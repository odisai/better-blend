"use client";

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music2, Loader2, User, AlertCircle } from "lucide-react";
import { api } from "@/trpc/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";

export default function JoinPage() {
  const router = useRouter();
  const params = useParams();
  const code = params?.code as string;
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isCheckingAuth = status === "loading";

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
      // Redirect to insights page once both users are joined
      router.push(`/blend/${data.id}/insights`);
    },
    onError: (error) => {
      console.error("Failed to join session:", error);
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

    joinSession.mutate({ code });
  };

  if (isCheckingAuth || isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
              <Music2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Sign in to Join</CardTitle>
            <CardDescription className="text-gray-400">
              Connect your Spotify account to join this blend session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleJoinSession}
              className="w-full rounded-full bg-[#1DB954] px-6 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
            >
              Sign in with Spotify
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show error if session not found
  if (!sessionData && !isLoadingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-2xl">Session Not Found</CardTitle>
            <CardDescription className="text-gray-400">
              This blend session doesn&apos;t exist or has expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full rounded-full border-white/10 bg-white/5 hover:bg-white/10"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show creator info if session exists
  if (sessionData?.status === "PENDING" && sessionData) {
    const creator = sessionData.creator as
      | { name?: string | null; image?: string | null }
      | null
      | undefined;
    const creatorName = creator?.name ?? "Someone";
    const creatorImage = creator?.image ?? undefined;

    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
              <Music2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Join Blend Session</CardTitle>
            <CardDescription className="text-gray-400">
              {creatorName} wants to blend with you!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Creator Profile */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-[#1DB954]">
                {creatorImage ? (
                  <Image
                    src={creatorImage}
                    alt={creatorName}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
                    <User className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-white">
                  {creator?.name ?? "Anonymous"}
                </p>
                <p className="text-sm text-gray-400">
                  Session Code: {sessionData.code}
                </p>
              </div>
            </div>

            {/* Join Button */}
            <Button
              onClick={handleJoinSession}
              className="w-full rounded-full bg-[#1DB954] px-6 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
              disabled={joinSession.isPending}
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
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
                {joinSession.error.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // If already joined, redirect to insights
  if (
    sessionData &&
    (sessionData.status === "ACTIVE" || sessionData.status === "GENERATED")
  ) {
    router.push(`/blend/${sessionData.id}/insights`);
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
      <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
    </div>
  );
}
