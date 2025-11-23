"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Music2, ArrowLeft, Link2 } from "lucide-react";
import { Header } from "@/components/nav/Header";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const extractCodeFromLink = (input: string): string | null => {
    // Remove whitespace
    const trimmed = input.trim();

    // Check if it's a full URL
    const urlMatch = trimmed.match(/\/join\/([A-Z0-9]+)/i);
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1].toUpperCase();
    }

    // Check if it's just a code (alphanumeric, 6 characters)
    const codeMatch = trimmed.match(/^([A-Z0-9]{6})$/i);
    if (codeMatch && codeMatch[1]) {
      return codeMatch[1].toUpperCase();
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter a join code or link");
      return;
    }

    const extractedCode = extractCodeFromLink(code);
    if (!extractedCode) {
      setError("Invalid code or link format. Please check and try again.");
      return;
    }

    // Redirect to the join page with the code
    router.push(`/join/${extractedCode}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1625] to-black text-white">
      <Header />
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <Card className="w-full max-w-md border-white/10 bg-white/5 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
              <Link2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Join a Blend Session</CardTitle>
            <CardDescription className="text-gray-400">
              Enter the join code or paste the link you received
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter code (e.g., ABC123) or paste link"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError("");
                  }}
                  className="h-12 rounded-lg border-white/20 bg-white/5 text-white placeholder:text-gray-500 focus:border-[#1DB954] focus:ring-[#1DB954]"
                  autoFocus
                />
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full rounded-full bg-[#1DB954] px-6 py-6 text-lg font-bold text-black hover:bg-[#1ed760]"
              >
                <Music2 className="mr-2 h-5 w-5" />
                Join Session
              </Button>
            </form>
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

