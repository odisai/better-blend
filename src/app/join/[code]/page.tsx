"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/trpc/react";
import { signIn, useSession } from "next-auth/react";
import { Header } from "@/components/nav/Header";
import { ConnectionAnimation } from "@/components/blend/ConnectionAnimation";
import { GradientBackground } from "@/components/GradientBackground";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const code = params?.code as string;
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isCheckingAuth = status === "loading";
  const [connectionStatus, setConnectionStatus] = useState<
    "waiting" | "connecting" | "connected"
  >("waiting");

  // Get session details if authenticated
  const { data: sessionData, isLoading: isLoadingSession } =
    api.session.get.useQuery(
      { code },
      {
        enabled: isAuthenticated && !!code,
        retry: false,
      },
    );

  const joinSession = api.session.join.useMutation({
    onSuccess: (data) => {
      setConnectionStatus("connecting");
      // Wait a moment for the connection animation, then redirect
      setTimeout(() => {
        setConnectionStatus("connected");
        setTimeout(() => {
          router.push(`/blend/${data.id}/insights`);
        }, 2000);
      }, 1500);
    },
    onError: (error) => {
      console.error("Failed to join session:", error);
      setConnectionStatus("waiting");
    },
  });

  const handleJoinSession = async () => {
    if (!isAuthenticated) {
      await signIn("spotify", { callbackUrl: `/join/${code}` });
      return;
    }

    if (!code) {
      return;
    }

    setConnectionStatus("connecting");
    joinSession.mutate({ code });
  };

  // Auto-redirect if already joined
  useEffect(() => {
    if (
      sessionData &&
      (sessionData.status === "ACTIVE" || sessionData.status === "GENERATED")
    ) {
      router.push(`/blend/${sessionData.id}/insights`);
    }
  }, [sessionData, router]);

  if (isCheckingAuth || isLoadingSession) {
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
              <Loader2 className="h-12 w-12 animate-spin text-white" />
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold text-white">
              Sign in to Join
            </h1>
            <p className="mb-8 text-lg text-gray-400">
              Connect your Spotify account to join this blend session
            </p>
            <div className="space-y-4">
              <Button
                onClick={handleJoinSession}
                className="w-full rounded-full bg-[#1DB954] px-8 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
              >
                Sign in with Spotify
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show error if session not found
  if (!sessionData && !isLoadingSession) {
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
              className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-red-500/20"
            >
              <Loader2 className="h-12 w-12 text-red-500" />
            </motion.div>
            <h1 className="mb-4 text-4xl font-bold text-white">
              Session Not Found
            </h1>
            <p className="mb-8 text-lg text-gray-400">
              This blend session doesn&apos;t exist or has expired
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => router.push("/")}
                className="w-full rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
              >
                Go Home
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                View Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show creator info if session exists and pending
  if (sessionData?.status === "PENDING" && sessionData) {
    const creator = sessionData.creator as
      | { name?: string | null; image?: string | null }
      | null
      | undefined;

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <GradientBackground />
        <Header />
        <ConnectionAnimation
          creator={creator ?? { name: "Someone", image: null }}
          status={connectionStatus}
        />
        {connectionStatus === "waiting" && (
          <div className="absolute right-0 bottom-8 left-0 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-auto max-w-md"
            >
              <Button
                onClick={handleJoinSession}
                disabled={joinSession.isPending}
                className="w-full rounded-full bg-[#1DB954] px-8 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
              >
                {joinSession.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Blend Session"
                )}
              </Button>
              {joinSession.error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-400"
                >
                  {joinSession.error.message}
                </motion.div>
              )}
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                className="mt-4 w-full text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    );
  }

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
