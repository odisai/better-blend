"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Music2, LogOut, LayoutDashboard } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface HeaderProps {
  showDashboard?: boolean;
}

export function Header({ showDashboard = true }: HeaderProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="relative z-10 container mx-auto flex items-center justify-between px-4 py-4 sm:px-6 sm:py-6">
      <Link href="/" className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
          <Music2 className="size-5 text-white" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight sm:text-xl">
          BetterBlend
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        {isAuthenticated ? (
          <>
            {showDashboard && (
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
                className="hidden text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white sm:flex"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            )}
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
              onClick={() => router.push("/")}
              variant="ghost"
              className="hidden text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white sm:flex"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Home"}
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}

