"use client";

import { useRouter } from "next/navigation";
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
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { api } from "@/trpc/react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { Header } from "@/components/nav/Header";

export default function DashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isCheckingAuth = status === "loading";
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const { data: sessions, isLoading } = api.session.listSessions.useQuery(
    undefined,
    {
      enabled: isAuthenticated,
    },
  );

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const handleCopyLink = async (code: string) => {
    try {
      const fullUrl = `${window.location.origin}/join/${code}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
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

  const getSessionAction = (session: {
    id: string;
    code: string;
    status: string;
    compatibilityScore: number | null;
    playlistUrlCreator: string | null;
    playlistUrlPartner: string | null;
  }) => {
    if (session.status === "PENDING") {
      return {
        label: "Share Code",
        action: () => handleCopyLink(session.code),
        variant: "outline" as const,
      };
    }
    if (session.status === "ACTIVE") {
      return {
        label: "View Insights",
        action: () => router.push(`/blend/${session.id}/insights`),
        variant: "default" as const,
      };
    }
    if (session.status === "GENERATED") {
      return {
        label: "View Playlist",
        action: () => router.push(`/blend/${session.id}/success`),
        variant: "default" as const,
      };
    }
    return null;
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Header showDashboard={false} />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Header showDashboard={false} />
        <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
          <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Sign in Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please sign in to view your blend sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
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

  // Group sessions by status
  const pendingSessions =
    sessions?.filter((s) => s.status === "PENDING") ?? [];
  const activeSessions = sessions?.filter((s) => s.status === "ACTIVE") ?? [];
  const completedSessions =
    sessions?.filter((s) => s.status === "GENERATED") ?? [];
  const expiredSessions = sessions?.filter((s) => s.status === "EXPIRED") ?? [];

  const renderSessionCard = (
    session: NonNullable<typeof sessions>[number],
  ) => {
    const otherUser = session.isCreator ? session.partner : session.creator;
    const action = getSessionAction(session);

    return (
      <Card
        key={session.id}
        className="border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:bg-white/10"
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-2">
                <CardTitle className="text-lg">
                  {session.isCreator ? "You" : otherUser?.name ?? "You"} &{" "}
                  {session.isCreator
                    ? otherUser?.name ?? "Partner"
                    : "Creator"}
                </CardTitle>
                {getStatusBadge(session.status)}
              </div>
              <CardDescription className="text-gray-400">
                Code: {session.code}
              </CardDescription>
            </div>
            {otherUser?.image && (
              <div className="flex -space-x-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white/20">
                  <Image
                    src={otherUser.image}
                    alt={otherUser.name ?? "User"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {session.compatibilityScore !== null && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Music2 className="h-4 w-4 text-[#1DB954]" />
              <span>
                {session.compatibilityScore}% compatibility
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {session.status === "PENDING" && (
              <>
                <Button
                  onClick={() => handleCopyCode(session.code)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                >
                  {copiedCode === session.code ? (
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
                  onClick={() => handleCopyLink(session.code)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 bg-white/5 hover:bg-white/10"
                >
                  {copiedCode === session.code ? (
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
              </>
            )}
            {action && (
              <Button
                onClick={action.action}
                variant={action.variant}
                className="flex-1 rounded-full bg-[#1DB954] text-black hover:bg-[#1ed760]"
                size="sm"
              >
                {action.label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
            {session.status === "GENERATED" &&
              (session.playlistUrlCreator ?? session.playlistUrlPartner) && (
                <Button
                  onClick={() => {
                    const url = session.isCreator
                      ? session.playlistUrlCreator
                      : session.playlistUrlPartner;
                    if (url) window.open(url, "_blank");
                  }}
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Spotify
                </Button>
              )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              My Blend Sessions
            </h1>
            <p className="text-gray-400">
              Manage and access all your music blends
            </p>
          </div>
          <Button
            onClick={() => router.push("/create")}
            className="rounded-full bg-[#1DB954] px-6 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
          >
            <Music2 className="mr-2 h-5 w-5" />
            Create New Blend
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
          </div>
        ) : !sessions || sessions.length === 0 ? (
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Music2 className="mb-4 h-12 w-12 text-gray-400" />
              <CardTitle className="mb-2 text-xl">No Sessions Yet</CardTitle>
              <CardDescription className="mb-6 text-center text-gray-400">
                Create your first blend session to get started
              </CardDescription>
              <Button
                onClick={() => router.push("/create")}
                className="rounded-full bg-[#1DB954] px-6 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
              >
                Create Your First Blend
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Active Sessions */}
            {activeSessions.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  Active Sessions
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeSessions.map((session) =>
                    renderSessionCard(session as typeof session & { isCreator: boolean }),
                  )}
                </div>
              </div>
            )}

            {/* Pending Sessions */}
            {pendingSessions.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  Waiting for Partner
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingSessions.map((session) =>
                    renderSessionCard(session as typeof session & { isCreator: boolean }),
                  )}
                </div>
              </div>
            )}

            {/* Completed Sessions */}
            {completedSessions.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  Completed Blends
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedSessions.map((session) =>
                    renderSessionCard(session as typeof session & { isCreator: boolean }),
                  )}
                </div>
              </div>
            )}

            {/* Expired Sessions */}
            {expiredSessions.length > 0 && (
              <div>
                <h2 className="mb-4 text-2xl font-semibold text-white">
                  Expired Sessions
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {expiredSessions.map((session) =>
                    renderSessionCard(session as typeof session & { isCreator: boolean }),
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

