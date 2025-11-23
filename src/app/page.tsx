import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Music2, Headphones, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
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
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
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
          <Link
            href="#"
            className="hidden text-sm font-medium text-gray-300 hover:text-white sm:block"
          >
            Log in
          </Link>
          <Button className="rounded-full bg-white px-6 text-black hover:bg-gray-200">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 py-12 md:py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
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
                <span className="bg-linear-to-r from-[#1DB954] via-[#1DB954] to-[#FF006E] bg-clip-text text-transparent">
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
                className="h-12 min-w-[180px] rounded-full bg-[#1DB954] px-8 font-bold text-black hover:bg-[#1ed760]"
              >
                <Play className="mr-2 h-4 w-4 fill-black" />
                Create Your Blend
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
          <div className="perspective-1000 relative mx-auto w-full max-w-md lg:ml-auto lg:max-w-full">
            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1DB954]/20 blur-[100px]" />
            <div className="absolute top-1/2 left-1/2 -z-10 h-[200px] w-[200px] translate-x-20 translate-y-20 rounded-full bg-[#FF006E]/20 blur-[80px]" />

            {/* Floating Elements */}
            <div className="animate-float-delayed absolute -top-12 -left-12 hidden md:block">
              <div className="glass-card -rotate-12 rounded-2xl p-3">
                <Music2 className="h-8 w-8 text-[#FF006E]" />
              </div>
            </div>
            <div className="animate-float absolute -right-8 -bottom-8 hidden md:block">
              <div className="glass-card rounded-full p-4">
                <Headphones className="h-6 w-6 text-[#3A86FF]" />
              </div>
            </div>

            {/* Main Stats Card */}
            <div className="glass-card animate-float relative rounded-3xl border border-white/10 p-6 shadow-2xl md:p-8">
              {/* Card Header */}
              <div className="mb-8 flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="flex items-center justify-center">
                    <div className="relative z-10 -mr-4 h-20 w-20 overflow-hidden rounded-full border-4 border-[#1a1625]">
                      <Image
                        src="/woman-portrait.jpg"
                        alt="Profile 1"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="relative z-0 -ml-4 h-20 w-20 overflow-hidden rounded-full border-4 border-[#1a1625]">
                      <Image
                        src="/man-portrait.jpg"
                        alt="Profile 2"
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border-2 border-[#1a1625] bg-[#FF006E] px-3 py-1 text-xs font-bold whitespace-nowrap text-white shadow-lg">
                    <div className="flex h-3 items-end gap-0.5">
                      <div
                        className="equalizer-bar w-0.5 rounded-full bg-white"
                        style={{ animationDelay: "0s" }}
                      />
                      <div
                        className="equalizer-bar w-0.5 rounded-full bg-white"
                        style={{ animationDelay: "0.2s" }}
                      />
                      <div
                        className="equalizer-bar w-0.5 rounded-full bg-white"
                        style={{ animationDelay: "0.4s" }}
                      />
                    </div>
                    High Synergy
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <div className="font-heading mb-1 flex items-center justify-center gap-2 text-5xl font-bold text-white">
                    89%
                  </div>
                  <p className="text-sm font-medium tracking-wider text-gray-400 uppercase">
                    Vibe Match
                  </p>
                </div>
              </div>

              {/* Shared Artists */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-medium tracking-wider text-gray-400 uppercase">
                  <span>Shared Favorites</span>
                  <span>See all</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
                    >
                      <Image
                        src="/album-cover-art-.jpg"
                        alt="Album Art"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <Play className="h-6 w-6 fill-white text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Player Bar Mockup */}
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#1DB954]">
                  <Play className="ml-0.5 h-5 w-5 fill-black text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div className="animate-grow h-full w-[60%] origin-left rounded-full bg-white" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>1:24</span>
                    <span>3:45</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decor Elements */}
            <div className="absolute top-1/4 -right-4 -z-10 h-24 w-24 animate-pulse rounded-full bg-[#3A86FF]/20 blur-2xl lg:-right-12" />
            <div className="absolute bottom-1/4 -left-4 -z-10 h-32 w-32 animate-pulse rounded-full bg-[#FF006E]/20 blur-2xl delay-700 lg:-left-12" />
          </div>
        </div>
      </main>
    </div>
  );
}
