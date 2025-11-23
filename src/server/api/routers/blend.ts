import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { spotifyApiRequest } from "../utils/spotify";

type Track = {
  id: string;
  name: string;
  artists: Array<{ id: string; name: string }>;
  album: { id: string; name: string; image: string | null };
  url: string;
  popularity: number;
};

type Artist = {
  id: string;
  name: string;
  image: string | null;
  genres: string[];
  popularity: number;
  url: string;
};

type AudioFeatures = {
  id: string;
  danceability: number;
  energy: number;
  valence: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  speechiness: number;
  tempo: number;
};

/**
 * Blend Router
 * Handles data fetching, insights calculation, and playlist generation
 */
export const blendRouter = createTRPCRouter({
  /**
   * Fetch and cache Spotify data for both users in a session
   */
  fetchSessionData: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { sessionId } = input;

      // Get session and verify access
      const session = await ctx.db.blendSession.findUnique({
        where: { id: sessionId },
        include: {
          creator: true,
          partner: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.creatorId !== userId && session.partnerId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      if (!session.partnerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Partner has not joined yet",
        });
      }

      const timeRange = session.timeRange ?? "medium_term";

      // Fetch data for both users in parallel
      const [creatorTracks, creatorArtists, partnerTracks, partnerArtists] =
        await Promise.all([
          fetchUserTopTracks(session.creatorId, timeRange),
          fetchUserTopArtists(session.creatorId, timeRange),
          fetchUserTopTracks(session.partnerId, timeRange),
          fetchUserTopArtists(session.partnerId, timeRange),
        ]);

      // Fetch audio features for all tracks
      const creatorTrackIds = creatorTracks.map((t) => t.id);
      const partnerTrackIds = partnerTracks.map((t) => t.id);

      // Batch fetch audio features (Spotify allows up to 100 at a time)
      const creatorFeatures = await fetchAudioFeatures(
        session.creatorId,
        creatorTrackIds,
      );
      const partnerFeatures = await fetchAudioFeatures(
        session.partnerId,
        partnerTrackIds,
      );

      // Store data in session (merge with existing data if any)
      const existingSession = await ctx.db.blendSession.findUnique({
        where: { id: sessionId },
      });

      const existingCreatorTracks =
        (existingSession?.creatorTracks as Record<string, Track[]>) ?? {};
      const existingCreatorArtists =
        (existingSession?.creatorArtists as Record<string, Artist[]>) ?? {};
      const existingPartnerTracks =
        (existingSession?.partnerTracks as Record<string, Track[]>) ?? {};
      const existingPartnerArtists =
        (existingSession?.partnerArtists as Record<string, Artist[]>) ?? {};
      const existingCreatorFeatures =
        (existingSession?.creatorAudioFeatures as Record<string, AudioFeatures>) ??
        {};
      const existingPartnerFeatures =
        (existingSession?.partnerAudioFeatures as Record<string, AudioFeatures>) ??
        {};

      await ctx.db.blendSession.update({
        where: { id: sessionId },
        data: {
          creatorTracks: {
            ...existingCreatorTracks,
            [timeRange]: creatorTracks,
          } as Record<string, Track[]>,
          creatorArtists: {
            ...existingCreatorArtists,
            [timeRange]: creatorArtists,
          } as Record<string, Artist[]>,
          creatorAudioFeatures: {
            ...existingCreatorFeatures,
            ...creatorFeatures.reduce(
              (acc, features) => {
                acc[features.id] = features;
                return acc;
              },
              {} as Record<string, AudioFeatures>,
            ),
          },
          partnerTracks: {
            ...existingPartnerTracks,
            [timeRange]: partnerTracks,
          } as Record<string, Track[]>,
          partnerArtists: {
            ...existingPartnerArtists,
            [timeRange]: partnerArtists,
          } as Record<string, Artist[]>,
          partnerAudioFeatures: {
            ...existingPartnerFeatures,
            ...partnerFeatures.reduce(
              (acc, features) => {
                acc[features.id] = features;
                return acc;
              },
              {} as Record<string, AudioFeatures>,
            ),
          },
        },
      });

      return {
        success: true,
        message: "Data fetched and cached successfully",
      };
    }),

  /**
   * Calculate compatibility insights
   */
  calculateInsights: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { sessionId } = input;

      // Get session and verify access
      const session = await ctx.db.blendSession.findUnique({
        where: { id: sessionId },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.creatorId !== userId && session.partnerId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      if (!session.partnerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Partner has not joined yet",
        });
      }

      const timeRange = session.timeRange ?? "medium_term";

      // Get cached data
      const creatorTracks =
        (session.creatorTracks as Record<string, Track[]>)?.[timeRange] ?? [];
      const creatorArtists =
        (session.creatorArtists as Record<string, Artist[]>)?.[timeRange] ?? [];
      const partnerTracks =
        (session.partnerTracks as Record<string, Track[]>)?.[timeRange] ?? [];
      const partnerArtists =
        (session.partnerArtists as Record<string, Artist[]>)?.[timeRange] ?? [];
      const creatorFeatures =
        (session.creatorAudioFeatures as Record<string, AudioFeatures>) ?? {};
      const partnerFeatures =
        (session.partnerAudioFeatures as Record<string, AudioFeatures>) ?? {};

      if (
        creatorTracks.length === 0 ||
        partnerTracks.length === 0 ||
        creatorArtists.length === 0 ||
        partnerArtists.length === 0
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session data not fetched yet. Please fetch data first.",
        });
      }

      // Calculate compatibility score using Jaccard similarity on artists
      const creatorArtistIds = new Set(creatorArtists.map((a) => a.id));
      const partnerArtistIds = new Set(partnerArtists.map((a) => a.id));
      const intersection = new Set(
        [...creatorArtistIds].filter((id) => partnerArtistIds.has(id)),
      );
      const union = new Set([...creatorArtistIds, ...partnerArtistIds]);
      const jaccardSimilarity = union.size > 0 ? intersection.size / union.size : 0;

      // Weight by popularity
      const sharedArtists = creatorArtists
        .filter((a) => partnerArtistIds.has(a.id))
        .map((a) => {
          const partnerArtist = partnerArtists.find((pa) => pa.id === a.id);
          return {
            ...a,
            combinedPopularity: (a.popularity + (partnerArtist?.popularity ?? 0)) / 2,
          };
        })
        .sort((a, b) => b.combinedPopularity - a.combinedPopularity)
        .slice(0, 10);

      const compatibilityScore = Math.round(
        jaccardSimilarity * 100 * 0.7 + (sharedArtists.length / 10) * 30,
      );

      // Calculate audio features averages
      const creatorFeatureValues = Object.values(creatorFeatures);
      const partnerFeatureValues = Object.values(partnerFeatures);

      const avgCreatorFeatures = creatorFeatureValues.length > 0
        ? {
            danceability:
              creatorFeatureValues.reduce((sum, f) => sum + f.danceability, 0) /
              creatorFeatureValues.length,
            energy:
              creatorFeatureValues.reduce((sum, f) => sum + f.energy, 0) /
              creatorFeatureValues.length,
            valence:
              creatorFeatureValues.reduce((sum, f) => sum + f.valence, 0) /
              creatorFeatureValues.length,
            acousticness:
              creatorFeatureValues.reduce((sum, f) => sum + f.acousticness, 0) /
              creatorFeatureValues.length,
            instrumentalness:
              creatorFeatureValues.reduce((sum, f) => sum + f.instrumentalness, 0) /
              creatorFeatureValues.length,
            liveness:
              creatorFeatureValues.reduce((sum, f) => sum + f.liveness, 0) /
              creatorFeatureValues.length,
            speechiness:
              creatorFeatureValues.reduce((sum, f) => sum + f.speechiness, 0) /
              creatorFeatureValues.length,
          }
        : null;

      const avgPartnerFeatures = partnerFeatureValues.length > 0
        ? {
            danceability:
              partnerFeatureValues.reduce((sum, f) => sum + f.danceability, 0) /
              partnerFeatureValues.length,
            energy:
              partnerFeatureValues.reduce((sum, f) => sum + f.energy, 0) /
              partnerFeatureValues.length,
            valence:
              partnerFeatureValues.reduce((sum, f) => sum + f.valence, 0) /
              partnerFeatureValues.length,
            acousticness:
              partnerFeatureValues.reduce((sum, f) => sum + f.acousticness, 0) /
              partnerFeatureValues.length,
            instrumentalness:
              partnerFeatureValues.reduce((sum, f) => sum + f.instrumentalness, 0) /
              partnerFeatureValues.length,
            liveness:
              partnerFeatureValues.reduce((sum, f) => sum + f.liveness, 0) /
              partnerFeatureValues.length,
            speechiness:
              partnerFeatureValues.reduce((sum, f) => sum + f.speechiness, 0) /
              partnerFeatureValues.length,
          }
        : null;

      // Generate personality insights
      const insights = generatePersonalityInsights(
        avgCreatorFeatures,
        avgPartnerFeatures,
      );

      // Find shared tracks
      const creatorTrackIds = new Set(creatorTracks.map((t) => t.id));
      const sharedTracks = partnerTracks
        .filter((t) => creatorTrackIds.has(t.id))
        .slice(0, 10);

      // Update session with insights
      await ctx.db.blendSession.update({
        where: { id: sessionId },
        data: {
          compatibilityScore,
          sharedArtists: sharedArtists.map((a) => ({
            id: a.id,
            name: a.name,
            image: a.image,
            genres: a.genres,
            popularity: a.popularity,
          })),
          insights: {
            audioFeatures: {
              creator: avgCreatorFeatures,
              partner: avgPartnerFeatures,
            },
            personality: insights,
            sharedTracks: sharedTracks.map((t) => ({
              id: t.id,
              name: t.name,
              artists: t.artists.map((a) => a.name).join(", "),
              album: t.album.name,
              image: t.album.image,
            })),
          },
        },
      });

      return {
        compatibilityScore,
        sharedArtists,
        insights,
        sharedTracks,
        audioFeatures: {
          creator: avgCreatorFeatures,
          partner: avgPartnerFeatures,
        },
      };
    }),

  /**
   * Generate and create playlists on Spotify
   */
  generatePlaylist: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { sessionId } = input;

      // Get session and verify access
      const session = await ctx.db.blendSession.findUnique({
        where: { id: sessionId },
        include: {
          creator: true,
          partner: true,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Session not found",
        });
      }

      if (session.creatorId !== userId && session.partnerId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have access to this session",
        });
      }

      if (!session.partnerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Partner has not joined yet",
        });
      }

      const timeRange = session.timeRange ?? "medium_term";
      const ratio = session.ratio ?? 0.5;
      const playlistLength = session.playlistLength ?? 50;

      // Get cached data
      const creatorTracks =
        (session.creatorTracks as Record<string, Track[]>)?.[timeRange] ?? [];
      const partnerTracks =
        (session.partnerTracks as Record<string, Track[]>)?.[timeRange] ?? [];

      if (creatorTracks.length === 0 || partnerTracks.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Session data not fetched yet. Please fetch data first.",
        });
      }

      // Generate blended track list
      const blendedTracks = generateBlendedPlaylist(
        creatorTracks,
        partnerTracks,
        ratio,
        playlistLength,
      );

      // Get Spotify user IDs
      const creatorSpotifyId = session.creator.spotifyId;
      const partnerSpotifyId = session.partner?.spotifyId;

      if (!creatorSpotifyId || !partnerSpotifyId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Spotify IDs not found for both users",
        });
      }

      // Create playlists on both accounts
      const [creatorPlaylist, partnerPlaylist] = await Promise.all([
        createSpotifyPlaylist(
          session.creatorId,
          creatorSpotifyId,
          session.partner?.name ?? "Partner",
          blendedTracks,
        ),
        createSpotifyPlaylist(
          session.partnerId,
          partnerSpotifyId,
          session.creator.name ?? "Partner",
          blendedTracks,
        ),
      ]);

      // Update session with playlist details
      await ctx.db.blendSession.update({
        where: { id: sessionId },
        data: {
          status: "GENERATED",
          playlistIdCreator: creatorPlaylist.id,
          playlistUrlCreator: creatorPlaylist.url,
          playlistIdPartner: partnerPlaylist.id,
          playlistUrlPartner: partnerPlaylist.url,
        },
      });

      return {
        success: true,
        creatorPlaylist: {
          id: creatorPlaylist.id,
          url: creatorPlaylist.url,
        },
        partnerPlaylist: {
          id: partnerPlaylist.id,
          url: partnerPlaylist.url,
        },
      };
    }),
});

// Helper functions

async function fetchUserTopTracks(
  userId: string,
  timeRange: string,
): Promise<Track[]> {
  const data = await spotifyApiRequest<{
    items: Array<{
      id: string;
      name: string;
      artists: Array<{ id: string; name: string }>;
      album: {
        id: string;
        name: string;
        images: Array<{ url: string }>;
      };
      external_urls: { spotify: string };
      popularity: number;
    }>;
  }>(userId, `/me/top/tracks?time_range=${timeRange}&limit=50`);

  return data.items.map((track) => ({
    id: track.id,
    name: track.name,
    artists: track.artists.map((a) => ({ id: a.id, name: a.name })),
    album: {
      id: track.album.id,
      name: track.album.name,
      image: track.album.images[0]?.url ?? null,
    },
    url: track.external_urls.spotify,
    popularity: track.popularity,
  }));
}

async function fetchUserTopArtists(
  userId: string,
  timeRange: string,
): Promise<Artist[]> {
  const data = await spotifyApiRequest<{
    items: Array<{
      id: string;
      name: string;
      images: Array<{ url: string }>;
      genres: string[];
      popularity: number;
      external_urls: { spotify: string };
    }>;
  }>(userId, `/me/top/artists?time_range=${timeRange}&limit=50`);

  return data.items.map((artist) => ({
    id: artist.id,
    name: artist.name,
    image: artist.images[0]?.url ?? null,
    genres: artist.genres,
    popularity: artist.popularity,
    url: artist.external_urls.spotify,
  }));
}

async function fetchAudioFeatures(
  userId: string,
  trackIds: string[],
): Promise<AudioFeatures[]> {
  if (trackIds.length === 0) return [];

  // Batch requests (Spotify allows up to 100 at a time)
  const batches: string[][] = [];
  for (let i = 0; i < trackIds.length; i += 100) {
    batches.push(trackIds.slice(i, i + 100));
  }

  const allFeatures: AudioFeatures[] = [];

  for (const batch of batches) {
    const ids = batch.join(",");
    const data = await spotifyApiRequest<{
      audio_features: Array<{
        id: string;
        danceability: number;
        energy: number;
        valence: number;
        acousticness: number;
        instrumentalness: number;
        liveness: number;
        speechiness: number;
        tempo: number;
      } | null>;
    }>(userId, `/audio-features?ids=${ids}`);

    allFeatures.push(
      ...data.audio_features.filter(
        (f): f is NonNullable<typeof f> => f !== null,
      ),
    );
  }

  return allFeatures;
}

function generateBlendedPlaylist(
  creatorTracks: Track[],
  partnerTracks: Track[],
  ratio: number,
  length: number,
): Track[] {
  // Calculate how many tracks from each user
  const creatorCount = Math.round(length * ratio);
  const partnerCount = length - creatorCount;

  // Remove duplicates within each list first
  const creatorUnique = Array.from(
    new Map(creatorTracks.map((t) => [t.id, t])).values(),
  );
  const partnerUnique = Array.from(
    new Map(partnerTracks.map((t) => [t.id, t])).values(),
  );

  // Remove duplicates between lists
  const partnerTrackIds = new Set(partnerUnique.map((t) => t.id));
  const creatorFiltered = creatorUnique.filter((t) => !partnerTrackIds.has(t.id));

  // Take top tracks from each (sorted by popularity)
  const creatorSelected = creatorFiltered
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, creatorCount);
  const partnerSelected = partnerUnique
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, partnerCount);

  // Interleave tracks for better distribution
  const blended: Track[] = [];
  const maxLength = Math.max(creatorSelected.length, partnerSelected.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < creatorSelected.length) {
      blended.push(creatorSelected[i]!);
    }
    if (i < partnerSelected.length) {
      blended.push(partnerSelected[i]!);
    }
  }

  return blended.slice(0, length);
}

async function createSpotifyPlaylist(
  userId: string,
  spotifyUserId: string,
  partnerName: string,
  tracks: Track[],
): Promise<{ id: string; url: string }> {
  // Create playlist
  const playlistData = await spotifyApiRequest<{
    id: string;
    external_urls: { spotify: string };
  }>(userId, `/users/${spotifyUserId}/playlists`, {
    method: "POST",
    body: JSON.stringify({
      name: `Blend with ${partnerName}`,
      description: "Created with BetterBlend",
      public: true,
    }),
  });

  // Add tracks to playlist (Spotify allows up to 100 at a time)
  const trackUris = tracks.map((t) => `spotify:track:${t.id}`);
  const batches: string[][] = [];

  for (let i = 0; i < trackUris.length; i += 100) {
    batches.push(trackUris.slice(i, i + 100));
  }

  for (const batch of batches) {
    await spotifyApiRequest(
      userId,
      `/playlists/${playlistData.id}/tracks`,
      {
        method: "POST",
        body: JSON.stringify({
          uris: batch,
        }),
      },
    );
  }

  return {
    id: playlistData.id,
    url: playlistData.external_urls.spotify,
  };
}

function generatePersonalityInsights(
  creatorFeatures: {
    danceability: number;
    energy: number;
    valence: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    speechiness: number;
  } | null,
  partnerFeatures: {
    danceability: number;
    energy: number;
    valence: number;
    acousticness: number;
    instrumentalness: number;
    liveness: number;
    speechiness: number;
  } | null,
): string[] {
  if (!creatorFeatures || !partnerFeatures) {
    return ["Not enough data to generate insights"];
  }

  const insights: string[] = [];

  // Energy comparison
  const energyDiff = Math.abs(creatorFeatures.energy - partnerFeatures.energy);
  if (energyDiff > 0.2) {
    if (creatorFeatures.energy > partnerFeatures.energy) {
      insights.push("You're the energetic one!");
    } else {
      insights.push("Your partner brings the energy!");
    }
  } else {
    insights.push("You both have similar energy levels");
  }

  // Valence (happiness) comparison
  const valenceDiff = Math.abs(
    creatorFeatures.valence - partnerFeatures.valence,
  );
  if (valenceDiff > 0.2) {
    if (creatorFeatures.valence > partnerFeatures.valence) {
      insights.push("You prefer happier, more upbeat music");
    } else {
      insights.push("Your partner loves the upbeat vibes");
    }
  }

  // Danceability
  const danceDiff = Math.abs(
    creatorFeatures.danceability - partnerFeatures.danceability,
  );
  if (danceDiff < 0.1) {
    insights.push("You're both dance floor ready!");
  }

  // Acousticness
  if (
    creatorFeatures.acousticness > 0.5 &&
    partnerFeatures.acousticness > 0.5
  ) {
    insights.push("You both appreciate acoustic vibes");
  }

  return insights;
}

