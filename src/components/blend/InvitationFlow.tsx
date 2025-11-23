"use client";

import { motion } from "framer-motion";
import { Sparkles, Users } from "lucide-react";
import { FloatingAlbumArt } from "./FloatingAlbumArt";
import { ShareOptions } from "./ShareOptions";

interface InvitationFlowProps {
  code: string;
  shareUrl: string;
  albums: Array<{ id: string; image: string | null }>;
  onCopy?: () => void;
}

export function InvitationFlow({
  code,
  shareUrl,
  albums,
  onCopy,
}: InvitationFlowProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating Album Art Background */}
      <FloatingAlbumArt albums={albums} />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-12">
        {/* Celebration Animation */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, -10, 0],
              }}
              transition={{
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] via-[#FF006E] to-[#1DB954]"
            >
              <Users className="h-12 w-12 text-white" />
            </motion.div>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-full bg-[#1DB954] blur-xl"
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-center text-5xl font-bold text-white md:text-6xl"
        >
          Your Blend is Ready!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12 text-center text-lg text-gray-400"
        >
          Invite your partner to join the magic
        </motion.p>

        {/* Share Options */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md"
        >
          <ShareOptions code={code} shareUrl={shareUrl} onCopy={onCopy} />
        </motion.div>

        {/* Sparkle Effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {Array.from({ length: 20 }).map((_, i) => {
            const delay = i * 0.1;
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            return (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="h-4 w-4 text-[#1DB954]" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

