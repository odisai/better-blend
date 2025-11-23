"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { api } from "@/trpc/react";
import { Header } from "@/components/nav/Header";
import { LoadingAnimation } from "@/components/animations/LoadingAnimation";
import {
  RevealSequence,
  RadarChartReveal,
  PersonalityInsightsReveal,
} from "@/components/blend/RevealSequence";
import { CompatibilityReveal } from "@/components/blend/CompatibilityReveal";
import { ArtistGrid } from "@/components/blend/ArtistGrid";
import { UserAvatars } from "@/components/blend/UserAvatars";
import { GradientBackground } from "@/components/GradientBackground";

export default function InsightsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const [dataFetched, setDataFetched] = useState(false);
  const [showReveal, setShowReveal] = useState(false);
  const fetchInitiatedRef = useRef(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Reset ref when sessionId changes
  useEffect(() => {
    fetchInitiatedRef.current = false;
    setDataFetched(false);
    setShowReveal(false);
    setFetchError(null);
  }, [sessionId]);

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
      fetchInitiatedRef.current = false;
      setFetchError(null);
    },
    onError: (error) => {
      fetchInitiatedRef.current = false;
      setFetchError(error.message);
      // Don't reset dataFetched to prevent infinite retries
    },
  });

  const calculateInsights = api.blend.calculateInsights.useMutation({
    onSuccess: () => {
      // Refetch session to get updated insights
      void utils.session.get.invalidate({ id: sessionId });
      // Show reveal after a short delay
      setTimeout(() => {
        setShowReveal(true);
      }, 500);
    },
  });

  useEffect(() => {
    if (
      session?.status === "ACTIVE" &&
      session.creator &&
      session.partner &&
      !dataFetched &&
      !fetchData.isPending &&
      !fetchInitiatedRef.current &&
      !fetchError // Don't retry if there's an error
    ) {
      // Always fetch data if insights haven't been calculated yet
      if (
        session.compatibilityScore === null ||
        session.compatibilityScore === undefined
      ) {
        fetchInitiatedRef.current = true;
        fetchData.mutate({ sessionId });
      } else {
        setDataFetched(true);
        setShowReveal(true);
      }
    }
  }, [session, dataFetched, sessionId, fetchData.isPending, fetchError]);

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
  }, [dataFetched, session, sessionId, calculateInsights.isPending]);

  if (isLoadingSession || fetchData.isPending || calculateInsights.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <LoadingAnimation
            message={
              fetchData.isPending
                ? "Fetching your music data..."
                : calculateInsights.isPending
                  ? "Calculating insights..."
                  : "Loading..."
            }
            size="lg"
          />
        </div>
      </div>
    );
  }

  // Show error state if fetch failed
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">
              Failed to Load Data
            </h1>
            <p className="mb-8 text-gray-400">{fetchError}</p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <div className="w-full max-w-md text-center">
            <h1 className="mb-4 text-2xl font-bold text-white">
              Session Not Found
            </h1>
            <p className="mb-8 text-gray-400">
              This blend session doesn&apos;t exist
            </p>
            <Button
              onClick={() => router.push("/")}
              className="rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const creator = session.creator as {
    name?: string | null;
    image?: string | null;
  };
  const partner = session.partner as {
    name?: string | null;
    image?: string | null;
  };

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

  // Build reveal steps
  const revealSteps = [];

  // Step 1: User avatars blending
  if (creator && partner) {
    revealSteps.push({
      id: "avatars",
      component: (
        <div className="flex flex-col items-center justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-3xl font-bold text-white md:text-4xl"
          >
            Your Music is Blending...
          </motion.h2>
          <UserAvatars
            creator={creator}
            partner={partner}
            size="lg"
            showConnection
          />
        </div>
      ),
    });
  }

  // Step 2: Compatibility score reveal
  revealSteps.push({
    id: "compatibility",
    component: (
      <CompatibilityReveal
        score={compatibilityScore}
        onComplete={() => {
          // Auto-advance handled by RevealSequence
        }}
      />
    ),
  });

  // Step 3: Shared artists
  if (sharedArtists.length > 0) {
    revealSteps.push({
      id: "artists",
      component: <ArtistGrid artists={sharedArtists} />,
    });
  }

  // Step 4: Audio features radar chart
  if (radarData.length > 0) {
    revealSteps.push({
      id: "radar",
      component: <RadarChartReveal data={radarData} />,
    });
  }

  // Step 5: Personality insights
  if (insights.personality && insights.personality.length > 0) {
    revealSteps.push({
      id: "personality",
      component: <PersonalityInsightsReveal insights={insights.personality} />,
    });
  }

  // Show reveal sequence if ready
  if (showReveal && revealSteps.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <RevealSequence
          steps={revealSteps}
          autoAdvance={true}
          autoAdvanceDelay={4000}
          onComplete={() => {
            // Show continue button after all reveals
          }}
        />
        {/* Continue Button - appears after all reveals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: revealSteps.length * 4 + 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4"
        >
          <Button
            onClick={() => router.push(`/blend/${sessionId}/customize`)}
            className="w-full rounded-full bg-[#1DB954] px-6 py-6 text-base font-bold text-black hover:bg-[#1ed760] sm:w-auto sm:px-8 sm:text-lg"
          >
            Customize Your Blend
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  // Loading or waiting state
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <GradientBackground />
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <LoadingAnimation message="Preparing your insights..." size="lg" />
      </div>
    </div>
  );
}
