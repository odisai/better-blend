"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music2,
  Loader2,
  Copy,
  Check,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { api } from "@/trpc/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { Header } from "@/components/nav/Header";

export default function SessionStatusPage() {
  const router = useRouter();
  const params = useParams();
  const code = params?.code as string;
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isCheckingAuth = status === "loading";
  const [copied, setCopied] = useState(false);

  const { data: session, isLoading } = api.session.get.useQuery(
    { code },
    {
      enabled: isAuthenticated && !!code,
      retry: false,
    },
  );

  const handleCopyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCopyLink = async () => {
    if (!code) return;
    try {
      const fullUrl = `${window.location.origin}/join/${code}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge
            variant="outline"
            className="border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
          >
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case "ACTIVE":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/50 bg-blue-500/10 text-blue-400"
          >
            <Users className="mr-1 h-3 w-3" />
            Active
          </Badge>
        );
      case "GENERATED":
        return (
          <Badge
            variant="outline"
            className="border-[#1DB954]/50 bg-[#1DB954]/10 text-[#1DB954]"
          >
            <CheckCircle className="mr-1 h-3 w-3" />
            Completed
          </Badge>
        );
      case "EXPIRED":
        return (
          <Badge
            variant="outline"
            className="border-gray-500/50 bg-gray-500/10 text-gray-400"
          >
            <XCircle className="mr-1 h-3 w-3" />
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
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
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign in Required</CardTitle>
              <CardDescription className="text-gray-400">
                Please sign in to view this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() =>
                  signIn("spotify", { callbackUrl: `/session/${code}` })
                }
                className="w-full rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
              >
                Sign in with Spotify
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Header />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Session Not Found</CardTitle>
              <CardDescription className="text-gray-400">
                This blend session doesn&apos;t exist or you don&apos;t have access to it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </CardContent>
          </Card>
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Back Button */}
          <Button
            onClick={() => router.push("/dashboard")}
            variant="ghost"
            className="mb-6 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          {/* Session Status Card */}
          <Card className="mb-6 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <CardTitle className="text-2xl">Session Details</CardTitle>
                    {getStatusBadge(session.status)}
                  </div>
                  <CardDescription className="text-gray-400">
                    Code: {session.code}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Users */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center">
                  {creator.image ? (
                    <Image
                      src={creator.image}
                      alt={creator.name ?? "Creator"}
                      width={64}
                      height={64}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
                      <Music2 className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <p className="mt-2 text-sm font-medium text-white">
                    {creator.name ?? "Creator"}
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <Music2 className="mx-auto h-6 w-6 text-[#1DB954]" />
                </div>
                <div className="flex flex-col items-center">
                  {partner ? (
                    <>
                      {partner.image ? (
                        <Image
                          src={partner.image}
                          alt={partner.name ?? "Partner"}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
                          <Music2 className="h-8 w-8 text-white" />
                        </div>
                      )}
                      <p className="mt-2 text-sm font-medium text-white">
                        {partner.name ?? "Partner"}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-gray-500">
                        <Users className="h-8 w-8 text-gray-500" />
                      </div>
                      <p className="mt-2 text-sm font-medium text-gray-400">
                        Waiting...
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Compatibility Score */}
              {session.compatibilityScore !== null && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-sm text-gray-400">Compatibility Score</p>
                  <p className="text-4xl font-bold text-[#1DB954]">
                    {session.compatibilityScore}%
                  </p>
                </div>
              )}

              {/* Share Options */}
              {session.status === "PENDING" && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-400">
                    Share Session
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCopyCode}
                      variant="outline"
                      className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-[#1DB954]" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Code
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleCopyLink}
                      variant="outline"
                      className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4 text-[#1DB954]" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {session.status === "ACTIVE" && (
                  <Button
                    onClick={() =>
                      router.push(`/blend/${session.id}/insights`)
                    }
                    className="flex-1 rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
                  >
                    View Insights
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
                {session.status === "GENERATED" && (
                  <>
                    <Button
                      onClick={() =>
                        router.push(`/blend/${session.id}/success`)
                      }
                      className="flex-1 rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
                    >
                      View Playlist
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {session.playlistUrlCreator && (
                      <Button
                        onClick={() => {
                          window.open(session.playlistUrlCreator ?? "", "_blank");
                        }}
                        variant="outline"
                        className="border-white/10 bg-white/5 hover:bg-white/10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Timestamps */}
              <div className="border-t border-white/10 pt-4 text-xs text-gray-500">
                <p>Created: {new Date(session.createdAt).toLocaleString()}</p>
                {session.expiresAt && (
                  <p>
                    Expires: {new Date(session.expiresAt).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

