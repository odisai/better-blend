"use client";

import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Music2,
  Loader2,
  ExternalLink,
  Download,
  Share2,
  Check,
  Sparkles,
} from "lucide-react";
import { api } from "@/trpc/react";
import Image from "next/image";
import { toPng } from "html-to-image";

export default function SuccessPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params?.sessionId as string;
  const statsCardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: session, isLoading: isLoadingSession } =
    api.session.get.useQuery(
      { id: sessionId },
      {
        enabled: !!sessionId,
        retry: false,
      },
    );

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#1a1625] to-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-[#1DB954]" />
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
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-4xl font-bold text-white">Your Blend is Ready!</h1>
          <p className="text-gray-400">
            Your playlists have been created and saved to Spotify
          </p>
        </div>

        {/* Stats Card (for download) */}
        <div className="mb-8 flex justify-center">
          <div
            ref={statsCardRef}
            className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-[#1a1625] to-black p-8 text-white"
            style={{ aspectRatio: "4/5" }}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(29,185,84,0.1),transparent_50%)]" />
            </div>

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
                <div className="text-center">
                  <div className="mb-2 text-6xl font-bold text-[#1DB954]">
                    {compatibilityScore}%
                  </div>
                  <div className="text-sm text-gray-400">Compatibility</div>
                </div>
              </div>

              {/* Shared Artists */}
              {sharedArtists.length > 0 && (
                <div className="mb-4">
                  <div className="mb-3 text-center text-sm font-semibold text-gray-400">
                    Top Shared Artists
                  </div>
                  <div className="flex justify-center gap-2">
                    {sharedArtists.slice(0, 5).map((artist) => (
                      <div
                        key={artist.id}
                        className="relative h-12 w-12 overflow-hidden rounded-full"
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
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto text-center text-xs text-gray-500">
                betterblend.app
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Links */}
        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
        {(session.playlistUrlCreator || session.playlistUrlPartner) && (
          <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music2 className="h-5 w-5 text-[#1DB954]" />
                Your Playlists
              </CardTitle>
              <CardDescription className="text-gray-400">
                Open your playlists on Spotify
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {session.playlistUrlCreator && (
                <a
                  href={session.playlistUrlCreator}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div>
                    <div className="font-semibold text-white">
                      {creator.name ?? "Your"} Playlist
                    </div>
                    <div className="text-sm text-gray-400">
                      {session.playlistLength ?? 50} songs
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-[#1DB954]" />
                </a>
              )}
              {session.playlistUrlPartner && (
                <a
                  href={session.playlistUrlPartner}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10"
                >
                  <div>
                    <div className="font-semibold text-white">
                      {partner.name ?? "Partner"}&apos;s Playlist
                    </div>
                    <div className="text-sm text-gray-400">
                      {session.playlistLength ?? 50} songs
                    </div>
                  </div>
                  <ExternalLink className="h-5 w-5 text-[#1DB954]" />
                </a>
              )}
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={handleDownloadCard}
            disabled={downloading}
            variant="outline"
            className="rounded-full border-white/10 bg-white/5 px-6 py-6 hover:bg-white/10"
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
            className="rounded-full border-white/10 bg-white/5 px-6 py-6 hover:bg-white/10"
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
        </div>
      </div>
    </div>
  );
}

