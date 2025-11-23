"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import { api } from "@/trpc/react";
import { Header } from "@/components/nav/Header";
import { LoadingAnimation } from "@/components/animations/LoadingAnimation";
import { DragToBlend } from "@/components/blend/DragToBlend";
import { TimePeriodTimeline } from "@/components/blend/TimePeriodTimeline";
import { PlaylistLengthCards } from "@/components/blend/PlaylistLengthCards";
import { BlendPreview } from "@/components/blend/BlendPreview";
import { GradientBackground } from "@/components/GradientBackground";

export default function CustomizePage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;

  const { data: session, isLoading: isLoadingSession } =
    api.session.get.useQuery(
      { id: sessionId },
      {
        enabled: !!sessionId,
        retry: false,
      },
    );

  const [ratio, setRatio] = useState(0.5);
  const [timeRange, setTimeRange] = useState<
    "short_term" | "medium_term" | "long_term"
  >("medium_term");
  const [playlistLength, setPlaylistLength] = useState(50);

  const utils = api.useUtils();

  const updateConfig = api.session.updateConfig.useMutation({
    onSuccess: () => {
      void utils.session.get.invalidate({ id: sessionId });
    },
  });

  const generatePlaylistMutation = api.blend.generatePlaylist.useMutation({
    onSuccess: () => {
      router.push(`/blend/${sessionId}/success`);
    },
  });

  useEffect(() => {
    if (session) {
      setRatio(session.ratio ?? 0.5);
      setTimeRange(
        (session.timeRange as "short_term" | "medium_term" | "long_term") ??
          "medium_term",
      );
      setPlaylistLength(session.playlistLength ?? 50);
    }
  }, [session]);

  const handleGeneratePlaylist = () => {
    updateConfig.mutate(
      {
        sessionId,
        ratio,
        timeRange,
        playlistLength,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            generatePlaylistMutation.mutate({ sessionId });
          }, 500);
        },
      },
    );
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <LoadingAnimation
            message="Loading customization options..."
            size="lg"
          />
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

  const creatorPercentage = Math.round(ratio * 100);
  const partnerPercentage = Math.round((1 - ratio) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <GradientBackground />
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center sm:mb-12"
        >
          <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Customize Your Blend
          </h1>
          <p className="text-base text-gray-400 sm:text-lg">
            Mix your music tastes to create the perfect playlist
          </p>
        </motion.div>

        <div className="mx-auto max-w-4xl space-y-8 sm:space-y-12">
          {/* Blend Ratio - Drag to Blend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <DragToBlend
              creator={creator}
              partner={partner}
              ratio={ratio}
              onRatioChange={setRatio}
            />
          </motion.div>

          {/* Time Period Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TimePeriodTimeline value={timeRange} onChange={setTimeRange} />
          </motion.div>

          {/* Playlist Length Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PlaylistLengthCards
              value={playlistLength}
              onChange={setPlaylistLength}
            />
          </motion.div>

          {/* Live Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BlendPreview
              creatorPercentage={creatorPercentage}
              partnerPercentage={partnerPercentage}
              timeRange={timeRange}
              playlistLength={playlistLength}
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          >
            <Button
              onClick={() => router.push(`/blend/${sessionId}/insights`)}
              variant="outline"
              className="w-full rounded-full border-white/10 bg-white/5 px-6 py-6 hover:bg-white/10 sm:w-auto"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Insights
            </Button>
            <Button
              onClick={handleGeneratePlaylist}
              disabled={generatePlaylistMutation.isPending}
              className="w-full rounded-full bg-[#1DB954] px-6 py-6 text-base font-bold text-black hover:bg-[#1ed760] sm:w-auto sm:px-8 sm:text-lg"
            >
              {generatePlaylistMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Playlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
