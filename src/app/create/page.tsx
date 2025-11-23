"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music2, Copy, Check, Loader2 } from "lucide-react";
import { api } from "@/trpc/react";
import { signIn, useSession } from "next-auth/react";

export default function CreatePage() {
  const [copied, setCopied] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isCheckingAuth = status === "loading";

  const createSession = api.session.create.useMutation({
    onSuccess: (_data) => {
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

  const handleCopyCode = async () => {
    if (!createSession.data) return;
    const code = (createSession.data as { code: string }).code;
    if (typeof code === "string") {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Failed to copy code:", error);
      }
    }
  };

  const handleCopyLink = async () => {
    if (!createSession.data) return;
    const shareUrl = (createSession.data as { shareUrl: string }).shareUrl;
    if (typeof shareUrl === "string") {
      try {
        const fullUrl = `${window.location.origin}${shareUrl}`;
        await navigator.clipboard.writeText(fullUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error("Failed to copy link:", error);
      }
    }
  };

  if (isCheckingAuth) {
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
            <CardTitle className="text-2xl">Sign in to Spotify</CardTitle>
            <CardDescription className="text-gray-400">
              Connect your Spotify account to create a blend session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreateSession}
              className="w-full rounded-full bg-[#1DB954] px-6 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
            >
              Sign in with Spotify
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (createSession.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#1DB954]" />
            <p className="text-lg text-gray-300">
              Creating your blend session...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (createSession.data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
              <Music2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Session Created!</CardTitle>
            <CardDescription className="text-gray-400">
              Share this code or link with your partner
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Session Code */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Session Code
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-2xl font-bold tracking-wider">
                  {createSession.data.code}
                </div>
                <Button
                  onClick={handleCopyCode}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-white/10 bg-white/5 hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-[#1DB954]" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Share Link */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">
                Share Link
              </label>
              <div className="flex items-center gap-2">
                <div className="flex-1 truncate rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm">
                  {typeof window !== "undefined" &&
                    `${window.location.origin}${createSession.data.shareUrl}`}
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 border-white/10 bg-white/5 hover:bg-white/10"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-[#1DB954]" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>

            <div className="pt-4">
              <p className="text-center text-sm text-gray-400">
                Expires in 24 hours • Waiting for partner to join...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
      <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
            <Music2 className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Create Your Blend</CardTitle>
          <CardDescription className="text-gray-400">
            Start a new music blend session with your partner
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleCreateSession}
            className="w-full rounded-full bg-[#1DB954] px-6 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
            disabled={createSession.isPending}
          >
            {createSession.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Blend Session"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
