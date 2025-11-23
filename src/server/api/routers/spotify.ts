import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { spotifyApiRequest, getSpotifyScopeStatus } from "../utils/spotify";

/**
 * Spotify Router
 * Handles fetching user's Spotify data
 */
export const spotifyRouter = createTRPCRouter({
  /**
   * Get user's top tracks
   */
  getTopTracks: protectedProcedure
    .input(
      z.object({
        timeRange: z.enum(["short_term", "medium_term", "long_term"]).default("medium_term"),
        limit: z.number().min(1).max(50).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      const data = await spotifyApiRequest<{
        items: Array<{
          id: string;
          name: string;
          artists: Array<{ id: string; name: string }>;
          album: {
            id: string;
            name: string;
            images: Array<{ url: string; height: number; width: number }>;
          };
          external_urls: { spotify: string };
          popularity: number;
        }>;
      }>(
        userId,
        `/me/top/tracks?time_range=${input.timeRange}&limit=${input.limit}`,
      );

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
    }),

  /**
   * Get user's top artists
   */
  getTopArtists: protectedProcedure
    .input(
      z.object({
        timeRange: z.enum(["short_term", "medium_term", "long_term"]).default("medium_term"),
        limit: z.number().min(1).max(50).default(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      const data = await spotifyApiRequest<{
        items: Array<{
          id: string;
          name: string;
          images: Array<{ url: string; height: number; width: number }>;
          genres: string[];
          popularity: number;
          external_urls: { spotify: string };
        }>;
      }>(
        userId,
        `/me/top/artists?time_range=${input.timeRange}&limit=${input.limit}`,
      );

      return data.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        image: artist.images[0]?.url ?? null,
        genres: artist.genres,
        popularity: artist.popularity,
        url: artist.external_urls.spotify,
      }));
    }),

  /**
   * Get audio features for tracks (batch, up to 100)
   */
  getAudioFeatures: protectedProcedure
    .input(
      z.object({
        trackIds: z.array(z.string()).min(1).max(100),
      }),
    )
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      
      // Spotify API allows batch requests for audio features
      const ids = input.trackIds.join(",");
      
      const data = await spotifyApiRequest<{
        audio_features: Array<{
          id: string;
          danceability: number;
          energy: number;
          key: number;
          loudness: number;
          mode: number;
          speechiness: number;
          acousticness: number;
          instrumentalness: number;
          liveness: number;
          valence: number;
          tempo: number;
          duration_ms: number;
          time_signature: number;
        } | null>;
      }>(
        userId,
        `/audio-features?ids=${ids}`,
      );

      return data.audio_features.filter(
        (features): features is NonNullable<typeof features> => features !== null,
      );
    }),

  /**
   * Diagnostic endpoint to check Spotify scope status
   * Useful for debugging 403 errors
   */
  checkScopeStatus: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    return await getSpotifyScopeStatus(userId);
  }),
});

