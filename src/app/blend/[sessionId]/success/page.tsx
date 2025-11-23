"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Music2,
  Loader2,
  ExternalLink,
  Download,
  Share2,
  Check,
  Sparkles,
  Play,
} from "lucide-react";
import { api } from "@/trpc/react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { Header } from "@/components/nav/Header";
import { ConfettiEffect } from "@/components/animations/ParticleEffect";
import { LoadingAnimation } from "@/components/animations/LoadingAnimation";
import { GradientBackground } from "@/components/GradientBackground";

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const statsCardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const { data: session, isLoading: isLoadingSession } =
    api.session.get.useQuery(
      { id: sessionId },
      {
        enabled: !!sessionId,
        retry: false,
      },
    );

  // Stop confetti after animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadCard = async () => {
    if (!statsCardRef.current) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(statsCardRef.current, {
        backgroundColor: "#0a0a0a",
        quality: 1.0,
        pixelRatio: 2,
      });

      const link = document.createElement("a");
      link.download = `betterblend-${session?.code ?? "blend"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to download card:", error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!session) return;

    const shareData = {
      title: "Check out our music blend!",
      text: `We're ${session.compatibilityScore ?? 0}% compatible!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled or error occurred
        console.error("Share failed:", error);
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <LoadingAnimation message="Loading your success page..." size="lg" />
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
    }>) ?? [];

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#1a1625] to-black text-white">
      <GradientBackground />
      <Header />

      {/* Confetti Effect */}
      {showConfetti && <ConfettiEffect count={100} />}

      <div className="container mx-auto px-4 py-8">
        {/* Celebration Header */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="mb-12 text-center"
        >
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] via-[#FF006E] to-[#1DB954] shadow-2xl"
          >
            <Check className="h-12 w-12 text-white" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-5xl font-bold text-white md:text-6xl"
          >
            Your Blend is Ready! 🎉
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-400"
          >
            Your playlists have been created and saved to Spotify
          </motion.p>
        </motion.div>

        {/* Enhanced Stats Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="mb-12 flex justify-center"
        >
          <div
            ref={statsCardRef}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1625] via-[#0a0a0a] to-black p-8 text-white shadow-2xl"
            style={{ aspectRatio: "4/5" }}
          >
            {/* Animated Background */}
            <motion.div
              animate={{
                background: [
                  "radial-gradient(circle at 50% 50%, rgba(29,185,84,0.2), transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(255,0,110,0.2), transparent 50%)",
                  "radial-gradient(circle at 50% 50%, rgba(29,185,84,0.2), transparent 50%)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute inset-0"
            />

            {/* Content */}
            <div className="relative z-10 flex h-full flex-col">
              {/* Header */}
              <div className="mb-6 text-center">
                <div className="mb-2 flex items-center justify-center gap-2">
                  <Music2 className="h-6 w-6 text-[#1DB954]" />
                  <span className="text-lg font-bold">BetterBlend</span>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {creator.name ?? "You"} & {partner.name ?? "Partner"}
                </h2>
              </div>

              {/* Compatibility Score */}
              <div className="mb-6 flex flex-1 items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="text-center"
                >
                  <div className="mb-2 bg-gradient-to-r from-[#1DB954] to-[#FF006E] bg-clip-text text-7xl font-bold text-transparent">
                    {compatibilityScore}%
                  </div>
                  <div className="text-sm text-gray-400">Compatibility</div>
                </motion.div>
              </div>

              {/* Shared Artists */}
              {sharedArtists.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="mb-4"
                >
                  <div className="mb-3 text-center text-sm font-semibold text-gray-400">
                    Top Shared Artists
                  </div>
                  <div className="flex justify-center gap-2">
                    {sharedArtists.slice(0, 5).map((artist, index) => (
                      <motion.div
                        key={artist.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/20"
                      >
                        {artist.image ? (
                          <Image
                            src={artist.image}
                            alt={artist.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
                            <Music2 className="h-6 w-6 text-white" />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Footer */}
              <div className="mt-auto text-center text-xs text-gray-500">
                betterblend.app
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Playlist Links with Album Art */}
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {(session.playlistUrlCreator || session.playlistUrlPartner) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12 grid gap-4 md:grid-cols-2"
          >
            {session.playlistUrlCreator && (
              <motion.a
                href={session.playlistUrlCreator}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#1DB954] to-[#1ed760] shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-8 w-8 text-black" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-semibold text-white">
                      {creator.name ?? "Your"} Playlist
                    </div>
                    <div className="text-sm text-gray-400">
                      {session.playlistLength ?? 50} songs
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#1DB954]">
                      Open in Spotify
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </motion.a>
            )}
            {session.playlistUrlPartner && (
              <motion.a
                href={session.playlistUrlPartner}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-[#FF006E] to-[#FF4DA6] shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 font-semibold text-white">
                      {partner.name ?? "Partner"}&apos;s Playlist
                    </div>
                    <div className="text-sm text-gray-400">
                      {session.playlistLength ?? 50} songs
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-[#FF006E]">
                      Open in Spotify
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </motion.a>
            )}
          </motion.div>
        )}

        {/* Enhanced Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
        >
          <Button
            onClick={handleDownloadCard}
            disabled={downloading}
            variant="outline"
            className="rounded-full border-white/20 bg-white/5 px-8 py-6 hover:bg-white/10"
          >
            {downloading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                Download Card
              </>
            )}
          </Button>
          <Button
            onClick={handleShare}
            variant="outline"
            className="rounded-full border-white/20 bg-white/5 px-8 py-6 hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-5 w-5 text-[#1DB954]" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="mr-2 h-5 w-5" />
                Share
              </>
            )}
          </Button>
          <Button
            onClick={() => router.push("/create")}
            className="rounded-full bg-[#1DB954] px-8 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Create Another Blend
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
