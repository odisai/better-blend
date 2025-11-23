"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Music2,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { api } from "@/trpc/react";
import Image from "next/image";

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
  const [timeRange, setTimeRange] = useState<"short_term" | "medium_term" | "long_term">("medium_term");
  const [playlistLength, setPlaylistLength] = useState(50);

  const updateConfig = api.session.updateConfig.useMutation({
    onSuccess: () => {
      void utils.session.get.invalidate();
    },
  });

  const generatePlaylist = api.blend.generatePlaylist.useMutation({
    onSuccess: () => {
      router.push(`/blend/${sessionId}/success`);
    },
  });

  const utils = api.useUtils();

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

  const handleSaveConfig = () => {
    updateConfig.mutate({
      sessionId,
      ratio,
      timeRange,
      playlistLength,
    });
  };

  const handleGeneratePlaylist = () => {
    handleSaveConfig();
    setTimeout(() => {
      generatePlaylist.mutate({ sessionId });
    }, 500);
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

  const creatorPercentage = Math.round(ratio * 100);
  const partnerPercentage = Math.round((1 - ratio) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold text-white">Customize Your Blend</h1>
          <p className="text-gray-400">
            Adjust the settings to create your perfect playlist
          </p>
        </div>

        {/* User Profiles */}
        <div className="mb-8 grid grid-cols-2 gap-4">
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center py-6">
              <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-[#1DB954]">
                {creator.image ? (
                  <Image
                    src={creator.image}
                    alt={creator.name ?? "Creator"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
                    <Music2 className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold text-white">
                {creator.name ?? "Creator"}
              </p>
              <p className="text-sm text-gray-400">{creatorPercentage}%</p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center py-6">
              <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border-4 border-[#FF006E]">
                {partner.image ? (
                  <Image
                    src={partner.image}
                    alt={partner.name ?? "Partner"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#FF006E] to-[#1DB954]">
                    <Music2 className="h-12 w-12 text-white" />
                  </div>
                )}
              </div>
              <p className="text-lg font-semibold text-white">
                {partner.name ?? "Partner"}
              </p>
              <p className="text-sm text-gray-400">{partnerPercentage}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Blend Ratio */}
        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Blend Ratio</CardTitle>
            <CardDescription className="text-gray-400">
              Adjust how much each person&apos;s music appears in the playlist
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">
                {creator.name ?? "You"}: {creatorPercentage}%
              </span>
              <span className="text-sm font-medium text-white">
                {partner.name ?? "Partner"}: {partnerPercentage}%
              </span>
            </div>
            <Slider
              value={[ratio]}
              onValueChange={([value]) => {
                if (value !== undefined) {
                  setRatio(value);
                }
              }}
              min={0.3}
              max={0.7}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>30% / 70%</span>
              <span>50% / 50%</span>
              <span>70% / 30%</span>
            </div>
          </CardContent>
        </Card>

        {/* Time Range */}
        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Time Period</CardTitle>
            <CardDescription className="text-gray-400">
              Choose which time period to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: "short_term" as const, label: "4 Weeks", desc: "Recent" },
                {
                  value: "medium_term" as const,
                  label: "6 Months",
                  desc: "Popular",
                },
                { value: "long_term" as const, label: "All Time", desc: "Classic" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTimeRange(option.value)}
                  className={`rounded-lg border-2 p-4 text-center transition-all ${
                    timeRange === option.value
                      ? "border-[#1DB954] bg-[#1DB954]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="text-lg font-semibold text-white">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Playlist Length */}
        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Playlist Length</CardTitle>
            <CardDescription className="text-gray-400">
              How many songs should be in your blend?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[25, 50, 100].map((length) => (
                <button
                  key={length}
                  onClick={() => setPlaylistLength(length)}
                  className={`rounded-lg border-2 p-4 text-center transition-all ${
                    playlistLength === length
                      ? "border-[#1DB954] bg-[#1DB954]/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="text-lg font-semibold text-white">{length}</div>
                  <div className="text-xs text-gray-400">songs</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Configuration Summary */}
        <Card className="mb-8 border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#1DB954]" />
              Configuration Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Blend Ratio:</span>
              <span className="font-medium text-white">
                {creatorPercentage}% / {partnerPercentage}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Time Period:</span>
              <span className="font-medium text-white">
                {timeRange === "short_term"
                  ? "4 Weeks"
                  : timeRange === "medium_term"
                    ? "6 Months"
                    : "All Time"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Playlist Length:</span>
              <span className="font-medium text-white">{playlistLength} songs</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={() => router.push(`/blend/${sessionId}/insights`)}
            variant="outline"
            className="rounded-full border-white/10 bg-white/5 px-6 py-6 hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Insights
          </Button>
          <Button
            onClick={handleGeneratePlaylist}
            disabled={generatePlaylist.isPending}
            className="rounded-full bg-[#1DB954] px-8 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
          >
            {generatePlaylist.isPending ? (
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
        </div>
      </div>
    </div>
  );
}

