"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Music2,
  Loader2,
  Users,
  TrendingUp,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { api } from "@/trpc/react";
import Image from "next/image";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

export default function InsightsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [dataFetched, setDataFetched] = useState(false);

  const { data: session, isLoading: isLoadingSession } =
    api.session.get.useQuery(
      { id: sessionId },
      {
        enabled: !!sessionId,
        retry: false,
      },
    );

  const utils = api.useUtils();

  const fetchData = api.blend.fetchSessionData.useMutation({
    onSuccess: () => {
      setDataFetched(true);
    },
  });

  const calculateInsights = api.blend.calculateInsights.useMutation({
    onSuccess: () => {
      // Refetch session to get updated insights
      void utils.session.get.invalidate();
    },
  });

  useEffect(() => {
    if (
      session?.status === "ACTIVE" &&
      session.creator &&
      session.partner &&
      !dataFetched &&
      !fetchData.isPending
    ) {
      // Always fetch data if insights haven't been calculated yet
      if (
        session.compatibilityScore === null ||
        session.compatibilityScore === undefined
      ) {
        fetchData.mutate({ sessionId });
      } else {
        setDataFetched(true);
      }
    }
  }, [session, dataFetched, fetchData, sessionId]);

  useEffect(() => {
    if (
      dataFetched &&
      session?.status === "ACTIVE" &&
      !calculateInsights.isPending &&
      (session.compatibilityScore === null ||
        session.compatibilityScore === undefined)
    ) {
      // Small delay to ensure data is saved
      const timer = setTimeout(() => {
        calculateInsights.mutate({ sessionId });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [dataFetched, session, calculateInsights, sessionId]);

  if (isLoadingSession || fetchData.isPending || calculateInsights.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#1DB954]" />
            <p className="text-lg text-gray-300">
              {fetchData.isPending
                ? "Fetching your music data..."
                : calculateInsights.isPending
                  ? "Calculating insights..."
                  : "Loading..."}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Session Not Found</CardTitle>
            <CardDescription className="text-gray-400">
              This blend session doesn&apos;t exist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/")}
              className="w-full rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const compatibilityScore = session.compatibilityScore ?? 0;
  const sharedArtists =
    (session.sharedArtists as Array<{
      id: string;
      name: string;
      image: string | null;
      genres: string[];
      popularity: number;
    }>) ?? [];

  const insights =
    (session.insights as {
      audioFeatures?: {
        creator: {
          danceability: number;
          energy: number;
          valence: number;
          acousticness: number;
          instrumentalness: number;
          liveness: number;
          speechiness: number;
        } | null;
        partner: {
          danceability: number;
          energy: number;
          valence: number;
          acousticness: number;
          instrumentalness: number;
          liveness: number;
          speechiness: number;
        } | null;
      };
      personality?: string[];
      sharedTracks?: Array<{
        id: string;
        name: string;
        artists: string;
        album: string;
        image: string | null;
      }>;
    }) ?? {};

  const creator = session.creator as {
    name?: string | null;
    image?: string | null;
  };
  const partner = session.partner as {
    name?: string | null;
    image?: string | null;
  };

  // Prepare radar chart data
  const radarData =
    insights.audioFeatures?.creator && insights.audioFeatures?.partner
      ? [
          {
            feature: "Dance",
            creator: insights.audioFeatures.creator.danceability * 100,
            partner: insights.audioFeatures.partner.danceability * 100,
          },
          {
            feature: "Energy",
            creator: insights.audioFeatures.creator.energy * 100,
            partner: insights.audioFeatures.partner.energy * 100,
          },
          {
            feature: "Happiness",
            creator: insights.audioFeatures.creator.valence * 100,
            partner: insights.audioFeatures.partner.valence * 100,
          },
          {
            feature: "Acoustic",
            creator: insights.audioFeatures.creator.acousticness * 100,
            partner: insights.audioFeatures.partner.acousticness * 100,
          },
          {
            feature: "Instrumental",
            creator: insights.audioFeatures.creator.instrumentalness * 100,
            partner: insights.audioFeatures.partner.instrumentalness * 100,
          },
          {
            feature: "Live",
            creator: insights.audioFeatures.creator.liveness * 100,
            partner: insights.audioFeatures.partner.liveness * 100,
          },
          {
            feature: "Speech",
            creator: insights.audioFeatures.creator.speechiness * 100,
            partner: insights.audioFeatures.partner.speechiness * 100,
          },
        ]
      : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Your Music Compatibility</h1>
          <p className="text-gray-400">
            {creator.name ?? "You"} & {partner.name ?? "Partner"}
          </p>
        </div>

        {/* Compatibility Score */}
        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Compatibility Score</CardTitle>
            <CardDescription className="text-gray-400">
              Based on your shared music taste
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <div className="relative h-48 w-48">
                <svg className="h-48 w-48 -rotate-90 transform">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="#1DB954"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(compatibilityScore / 100) * 2 * Math.PI * 88} ${2 * Math.PI * 88}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-[#1DB954]">
                      {compatibilityScore}%
                    </div>
                    <div className="text-sm text-gray-400">Match</div>
                  </div>
                </div>
              </div>
            </div>
            <Progress value={compatibilityScore} className="h-3" />
          </CardContent>
        </Card>

        {/* Shared Artists */}
        {sharedArtists.length > 0 && (
          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#1DB954]" />
                Top Shared Artists
              </CardTitle>
              <CardDescription className="text-gray-400">
                Artists you both love
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {sharedArtists.slice(0, 10).map((artist) => (
                  <div
                    key={artist.id}
                    className="group cursor-pointer space-y-2 rounded-lg p-3 transition-colors hover:bg-white/5"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-full">
                      {artist.image ? (
                        <Image
                          src={artist.image}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
                          <Music2 className="h-8 w-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="text-center">
                      <p className="truncate text-sm font-medium text-white">{artist.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Audio Features Radar Chart */}
        {radarData.length > 0 && (
          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#1DB954]" />
                Audio Features Comparison
              </CardTitle>
              <CardDescription className="text-gray-400">
                How your music styles compare
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis
                    dataKey="feature"
                    tick={{ fill: "#fff", fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fill: "#fff", fontSize: 10 }}
                  />
                  <Radar
                    name={creator.name ?? "You"}
                    dataKey="creator"
                    stroke="#1DB954"
                    fill="#1DB954"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name={partner.name ?? "Partner"}
                    dataKey="partner"
                    stroke="#FF006E"
                    fill="#FF006E"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Personality Insights */}
        {insights.personality && insights.personality.length > 0 && (
          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#1DB954]" />
                Personality Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.personality.map((insight, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <p className="text-sm text-white">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Shared Tracks */}
        {insights.sharedTracks && insights.sharedTracks.length > 0 && (
          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Shared Tracks</CardTitle>
              <CardDescription className="text-gray-400">
                Songs you both love
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insights.sharedTracks.slice(0, 10).map((track) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/5"
                  >
                    {track.image && (
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded">
                        <Image
                          src={track.image}
                          alt={track.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-white">{track.name}</p>
                      <p className="truncate text-sm text-gray-400">
                        {track.artists} • {track.album}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Step Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => router.push(`/blend/${sessionId}/customize`)}
            className="rounded-full bg-[#1DB954] px-8 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
          >
            Customize Your Blend
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

