"use client";

import { motion } from "framer-motion";
import { Copy, Check, MessageSquare, Link2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ShareOptionsProps {
  code: string;
  shareUrl: string;
  onCopy?: () => void;
}

export function ShareOptions({ code, shareUrl, onCopy }: ShareOptionsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${shareUrl}` : shareUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my BetterBlend session!",
          text: `Let's blend our music! Use code: ${code}`,
          url: fullUrl,
        });
      } catch (err) {
        // User cancelled or error
        console.error("Share failed:", err);
      }
    } else {
      void handleCopyLink();
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-4"
      >
        {/* Copy Link Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={handleCopyLink}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#1ed760]">
                <Link2 className="h-6 w-6 text-black" />
              </div>
              <span className="text-sm font-medium text-white">Copy Link</span>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 flex items-center justify-center bg-[#1DB954]/20 backdrop-blur-sm"
                >
                  <Check className="h-8 w-8 text-[#1DB954]" />
                </motion.div>
              )}
            </div>
          </button>
        </motion.div>

        {/* Share via Message Card */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={handleShare}
            className="group relative w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#FF006E] to-[#FF4DA6]">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-white">Share</span>
            </div>
          </button>
        </motion.div>
      </motion.div>

      {/* Code Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative"
      >
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-2 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
            Session Code
          </div>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="mb-4 text-center font-mono text-4xl font-bold tracking-wider text-white"
          >
            {code}
          </motion.div>
          <Button
            onClick={handleCopyCode}
            variant="outline"
            className="w-full rounded-full border-white/20 bg-white/5 hover:bg-white/10"
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
        </div>
      </motion.div>
    </div>
  );
}

