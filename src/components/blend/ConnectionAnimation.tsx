"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Music2, Sparkles, Check } from "lucide-react";
import { UserAvatars } from "./UserAvatars";

interface ConnectionAnimationProps {
  creator: {
    name?: string | null;
    image?: string | null;
  };
  partner?: {
    name?: string | null;
    image?: string | null;
  };
  status: "waiting" | "connecting" | "connected";
}

export function ConnectionAnimation({
  creator,
  partner,
  status,
}: ConnectionAnimationProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-[#1DB954]/20 blur-[100px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.5,
          }}
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-[#FF006E]/20 blur-[100px]"
        />
      </div>

      {/* User Avatars */}
      <div className="relative z-10 mb-12">
        <UserAvatars
          creator={creator}
          partner={status === "connected" ? partner : undefined}
          size="lg"
          showConnection={status === "connected"}
        />
      </div>

      {/* Status Messages */}
      <AnimatePresence mode="wait">
        {status === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10"
            >
              <Music2 className="h-8 w-8 text-[#1DB954]" />
            </motion.div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              Waiting for you...
            </h2>
            <p className="text-lg text-gray-400">
              {creator.name ?? "Someone"} wants to blend with you!
            </p>
          </motion.div>
        )}

        {status === "connecting" && (
          <motion.div
            key="connecting"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              Connecting...
            </h2>
            <p className="text-lg text-gray-400">
              Your music is blending together
            </p>
          </motion.div>
        )}

        {status === "connected" && (
          <motion.div
            key="connected"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]"
            >
              <Check className="h-8 w-8 text-white" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-2 text-3xl font-bold text-white"
            >
              Connected!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-400"
            >
              Discovering your music compatibility...
            </motion.p>

            {/* Particle Effect */}
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 30 }).map((_, i) => {
                const angle = (i / 30) * 360;
                const radius = 100 + Math.random() * 50;
                const x = Math.cos((angle * Math.PI) / 180) * radius;
                const y = Math.sin((angle * Math.PI) / 180) * radius;
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                    initial={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 1,
                    }}
                    animate={{
                      x,
                      y,
                      opacity: 0,
                      scale: 0,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-[#1DB954]" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

