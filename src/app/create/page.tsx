"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Music2, Loader2, ArrowRight, Users } from "lucide-react";
import { api, type RouterOutputs } from "@/trpc/react";
import { signIn, useSession } from "next-auth/react";
import { Header } from "@/components/nav/Header";
import { InvitationFlow } from "@/components/blend/InvitationFlow";
import { GradientBackground } from "@/components/GradientBackground";
import Image from "next/image";

export default function CreatePage() {
  const [mounted, setMounted] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isCheckingAuth = status === "loading";

  // Fetch user's top tracks for floating album art
  const { data: topTracks } = api.spotify.getTopTracks.useQuery(
    { timeRange: "medium_term", limit: 20 },
    { enabled: isAuthenticated },
  ) as { data: RouterOutputs["spotify"]["getTopTracks"] | undefined };

  // Extract album art from tracks
  const albums =
    topTracks?.map((track) => ({
      id: track.album.id,
      image: track.album.image,
    })) ?? [];

  useEffect(() => {
    setMounted(true);
  }, []);

  const createSession = api.session.create.useMutation({
    onSuccess: () => {
      // Session created successfully
    },
    onError: (error) => {
      console.error("Failed to create session:", error);
    },
  });

  const handleCreateSession = async () => {
    if (!isAuthenticated) {
      await signIn("spotify", { callbackUrl: "/create" });
      return;
    }

    createSession.mutate();
  };

  // Show loading state only after component has mounted to prevent hydration mismatch
  if (!mounted || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
        </div>
      </div>
    );
  }

  // Show invitation flow if session is created
  if (createSession.data) {
    const sessionData = createSession.data as {
      code: string;
      shareUrl: string;
    };
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <InvitationFlow
          code={sessionData.code}
          shareUrl={sessionData.shareUrl}
          albums={albums}
        />
      </div>
    );
  }

  // Not authenticated - show sign in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]"
            >
              <Music2 className="h-12 w-12 text-white" />
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
              Create Your Blend
            </h1>
            <p className="mb-8 text-lg text-gray-400">
              Connect your Spotify account to start blending music with your
              partner
            </p>
            <Button
              onClick={handleCreateSession}
              className="rounded-full bg-[#1DB954] px-8 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
            >
              Sign in with Spotify
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Authenticated - show create invitation screen
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <GradientBackground />
      <Header />
      <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden px-4 py-12">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#1DB954]/20 blur-[100px]" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-[#FF006E]/20 blur-[100px]" />

        {/* Floating album art background */}
        {albums.length > 0 && (
          <div className="pointer-events-none absolute inset-0">
            {albums.slice(0, 8).map((album, index) => {
              if (!album.image) return null;
              const delay = index * 0.3;
              const duration = 20 + Math.random() * 10;
              const startX = Math.random() * 100;
              const startY = 100 + Math.random() * 20;
              const endY = -20 - Math.random() * 20;
              const size = 80 + Math.random() * 60;

              return (
                <motion.div
                  key={`${album.id}-${index}`}
                  className="absolute rounded-lg opacity-30"
                  style={{
                    width: size,
                    height: size,
                    left: `${startX}%`,
                  }}
                  initial={{
                    y: startY,
                    opacity: 0,
                  }}
                  animate={{
                    y: endY,
                    opacity: [0, 0.3, 0.3, 0],
                  }}
                  transition={{
                    duration,
                    delay,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Image
                    src={album.image}
                    alt=""
                    width={size}
                    height={size}
                    className="h-full w-full rounded-lg object-cover"
                    unoptimized
                  />
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] via-[#FF006E] to-[#1DB954]"
          >
            <Users className="h-16 w-16 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6 text-5xl font-bold text-white md:text-6xl lg:text-7xl"
          >
            Invite Your Partner
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12 text-xl text-gray-400"
          >
            Create a magical music blend together. Share your unique code and
            discover your compatibility.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={handleCreateSession}
              disabled={createSession.isPending}
              className="group relative overflow-hidden rounded-full bg-[#1DB954] px-12 py-8 text-xl font-bold text-black transition-all hover:scale-105 hover:bg-[#1ed760]"
            >
              {createSession.isPending ? (
                <>
                  <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                  Creating Your Blend...
                </>
              ) : (
                <>
                  Create Blend Session
                  <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>

          {/* Visual preview of what's coming */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex items-center justify-center gap-4 text-sm text-gray-500"
          >
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/20" />
            <span>Blend your music tastes</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/20" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
