"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Music2,
  Headphones,
  Users,
  LogOut,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const handleSignIn = async () => {
    await signIn("spotify", { callbackUrl: "/create" });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleCreateBlend = () => {
    if (isAuthenticated) {
      router.push("/create");
    } else {
      void handleSignIn();
    }
  };
  return (
    <div className="min-h-screen w-full overflow-hidden bg-linear-to-b from-[#1a1625] to-black text-white selection:bg-[#1DB954] selection:text-black">
      {/* Custom Floating Animation Styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes float-delayed {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes equalizer {
          0%, 100% { height: 40%; }
          50% { height: 100%; }
        }
        @keyframes grow-width {
          from { width: 0%; }
          to { width: 60%; }
        }
        @keyframes gradient-shift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
          animation-delay: 1s;
        }
        .equalizer-bar {
          animation: equalizer 0.8s ease-in-out infinite;
        }
        .animate-grow {
          animation: grow-width 1.5s ease-out forwards;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
        .glass-card-enhanced {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 
            0 8px 32px 0 rgba(0, 0, 0, 0.37),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.1);
        }
      `}</style>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-[#1DB954] to-[#FF006E]">
            <Music2 className="size-5 text-white" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight">
            BetterBlend
          </span>
        </div>
        <div className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
          <Link href="#" className="transition-colors hover:text-white">
            Features
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <div className="hidden items-center gap-3 sm:flex">
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-300">
                  {session?.user?.name ?? "User"}
                </span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="hidden rounded-full border-white/20 bg-transparent px-4 text-sm text-gray-300 hover:bg-white/10 hover:text-white sm:flex"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleSignIn}
                variant="ghost"
                className="hidden text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white sm:flex"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Log in"}
              </Button>
              <Button
                onClick={handleSignIn}
                className="rounded-full bg-white px-6 text-black hover:bg-gray-200"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Get Started"}
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-4 py-8 sm:px-6 sm:py-12 md:py-20 lg:py-32">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="rounded-full border-[#1DB954]/50 bg-[#1DB954]/5 px-4 py-1 text-[#1DB954] backdrop-blur-sm"
              >
                <Users className="mr-2 h-3 w-3 fill-current" />
                #1 Collaborative Music App
              </Badge>

              <h1 className="font-heading text-5xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
                <span className="animate-gradient bg-gradient-to-r from-[#1DB954] via-[#00FF88] via-[#FF006E] to-[#FF006E] bg-clip-text text-transparent">
                  Blend Your Taste
                </span>
              </h1>

              <p className="mx-auto max-w-xl text-lg leading-relaxed text-gray-400 md:text-xl lg:mx-0">
                Discover your music compatibility with friends, create the
                ultimate shared playlists, and never fight over the aux cord
                again.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                onClick={handleCreateBlend}
                className="h-12 min-w-[180px] rounded-full bg-[#1DB954] px-8 font-bold text-black hover:bg-[#1ed760]"
                disabled={isLoading}
              >
                <Play className="mr-2 h-4 w-4 fill-black" />
                {isAuthenticated
                  ? "Create Your Blend"
                  : isLoading
                    ? "Loading..."
                    : "Get Started"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 min-w-[180px] rounded-full border-white/20 bg-transparent px-8 text-white hover:bg-white/10 hover:text-white"
              >
                See Example
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-gray-400 lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 overflow-hidden rounded-full border-2 border-[#1a1625] bg-gray-800"
                  >
                    <Image
                      src="/diverse-person-portrait.png"
                      alt="User"
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p>
                Join{" "}
                <span className="font-semibold text-white">
                  10,000+ curators
                </span>{" "}
                discovering their match
              </p>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative mx-auto w-full max-w-[320px] sm:max-w-[360px] lg:ml-auto">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1DB954]/20 blur-[80px] sm:h-[300px] sm:w-[300px] sm:blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -z-10 h-[150px] w-[150px] translate-x-10 translate-y-10 rounded-full bg-[#FF006E]/20 blur-[60px] sm:h-[200px] sm:w-[200px] sm:translate-x-20 sm:translate-y-20 sm:blur-[80px]" />

            {/* Main Stats Card with 3D Effect */}
            <CardContainer
              containerClassName="py-0"
              className="relative w-full"
            >
              {/* Floating Elements - Adjusted positions for narrower card */}
              <CardItem
                translateX={-20}
                translateY={-20}
                translateZ={50}
                className="animate-float-delayed absolute -top-8 -left-4 hidden sm:block"
              >
                <div className="glass-card -rotate-12 rounded-2xl p-2.5 shadow-lg">
                  <Music2 className="h-6 w-6 text-[#FF006E]" />
                </div>
              </CardItem>
              <CardItem
                translateX={20}
                translateY={20}
                translateZ={50}
                className="animate-float absolute -right-4 -bottom-8 hidden sm:block"
              >
                <div className="glass-card rounded-full p-3 shadow-lg">
                  <Headphones className="h-5 w-5 text-[#3A86FF]" />
                </div>
              </CardItem>

              <CardBody className="h-auto w-full">
                <CardItem translateZ={0} className="w-full">
                  <div className="glass-card-enhanced relative w-full overflow-hidden rounded-[32px]">
                    {/* Subtle Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1DB954]/5 via-transparent to-[#FF006E]/5 opacity-30" />
                    {/* Inner glow effect */}
                    <div className="pointer-events-none absolute inset-[1px] rounded-[32px] bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50" />

                    {/* Playlist Header Section */}
                    <div className="relative flex flex-col items-center gap-6 p-6 pt-8 text-center">
                      {/* Playlist Cover Art */}
                      <CardItem
                        translateZ={40}
                        rotateX={5}
                        className="relative w-full max-w-[240px]"
                      >
                        <div className="group relative aspect-square w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
                          <Image
                            src="/album-cover-art-.jpg"
                            alt="Blend Playlist"
                            width={280}
                            height={280}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            priority
                          />
                          {/* Play button overlay */}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954] shadow-xl transition-transform hover:scale-110">
                              <Play className="ml-1 h-7 w-7 fill-black text-black" />
                            </div>
                          </div>
                        </div>
                      </CardItem>

                      {/* Playlist Info */}
                      <div className="flex w-full flex-col items-center gap-4">
                        <div className="space-y-1.5">
                          <CardItem translateZ={25} translateY={-5}>
                            <h3 className="font-heading text-2xl font-bold text-white">
                              Our Perfect Blend
                            </h3>
                          </CardItem>

                          <CardItem translateZ={20} translateY={-2}>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-300">
                              <div className="flex -space-x-2">
                                <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-[#282828]">
                                  <Image
                                    src="/woman-portrait.jpg"
                                    alt="User 1"
                                    width={24}
                                    height={24}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-[#282828]">
                                  <Image
                                    src="/man-portrait.jpg"
                                    alt="User 2"
                                    width={24}
                                    height={24}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </div>
                              <span className="font-medium">Alex & Sam</span>
                            </div>
                          </CardItem>
                        </div>

                        <CardItem translateZ={15} className="w-full">
                          <div className="flex items-center justify-center gap-4 text-xs font-medium tracking-wider text-gray-400 uppercase">
                            <span className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              98% Match
                            </span>
                            <span className="h-1 w-1 rounded-full bg-gray-600" />
                            <span className="flex items-center gap-1.5">
                              <Music2 className="h-3.5 w-3.5" />
                              24 Songs
                            </span>
                          </div>
                        </CardItem>

                        {/* Action Buttons */}
                        <CardItem
                          translateZ={30}
                          className="flex items-center justify-center gap-4 pt-2"
                        >
                          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1DB954] text-black shadow-lg shadow-[#1DB954]/20 transition-all hover:scale-105 hover:bg-[#1ed760] hover:shadow-[#1DB954]/40 active:scale-95">
                            <Play className="ml-1 h-6 w-6 fill-current" />
                          </button>
                          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-white/20 active:scale-95">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </CardItem>
                      </div>
                    </div>

                    {/* Track List - Simplified for card view */}
                    <div className="relative border-t border-white/5 bg-black/20 px-2 py-2">
                      <div className="space-y-1">
                        {[
                          {
                            title: "Blinding Lights",
                            artist: "The Weeknd",
                            image: "/album-cover-art-.jpg",
                            playing: true,
                          },
                          {
                            title: "Levitating",
                            artist: "Dua Lipa",
                            image: "/album-cover-art-.jpg",
                            playing: false,
                          },
                          {
                            title: "Watermelon Sugar",
                            artist: "Harry Styles",
                            image: "/album-cover-art-.jpg",
                            playing: false,
                          },
                        ].map((track, index) => (
                          <CardItem
                            key={index}
                            translateZ={index === 0 ? 20 : 10}
                            className={cn(
                              "w-full flex items-center gap-3 rounded-xl p-2 transition-colors",
                              track.playing
                                ? "bg-white/10 shadow-lg"
                                : "hover:bg-white/5",
                            )}
                          >
                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg shadow-sm">
                              <Image
                                src={track.image}
                                alt={track.title}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                              {track.playing && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <div className="flex h-3 items-end gap-0.5">
                                    <div
                                      className="equalizer-bar w-0.5 rounded-full bg-[#1DB954]"
                                      style={{ animationDelay: "0s" }}
                                    />
                                    <div
                                      className="equalizer-bar w-0.5 rounded-full bg-[#1DB954]"
                                      style={{ animationDelay: "0.2s" }}
                                    />
                                    <div
                                      className="equalizer-bar w-0.5 rounded-full bg-[#1DB954]"
                                      style={{ animationDelay: "0.4s" }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="min-w-0 flex-1 text-left">
                              <div
                                className={cn(
                                  "truncate text-sm font-medium",
                                  track.playing
                                    ? "text-[#1DB954]"
                                    : "text-white",
                                )}
                              >
                                {track.title}
                              </div>
                              <div className="truncate text-xs text-gray-400">
                                {track.artist}
                              </div>
                            </div>
                          </CardItem>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>

            {/* Decor Elements */}
            <div className="absolute top-1/4 -right-4 -z-10 h-24 w-24 animate-pulse rounded-full bg-[#3A86FF]/20 blur-2xl lg:-right-12" />
            <div className="absolute bottom-1/4 -left-4 -z-10 h-32 w-32 animate-pulse rounded-full bg-[#FF006E]/20 blur-2xl delay-700 lg:-left-12" />
          </div>
        </div>
      </main>
    </div>
  );
}
