"use client";

import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

interface LoadingAnimationProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { icon: 24, text: "text-sm" },
  md: { icon: 32, text: "text-base" },
  lg: { icon: 48, text: "text-lg" },
};

export function LoadingAnimation({
  message = "Loading...",
  size = "md",
}: LoadingAnimationProps) {
  const { icon, text } = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative"
      >
        <Music2 className={`h-${icon} w-${icon} text-[#1DB954]`} />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-full bg-[#1DB954] blur-xl"
        />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`${text} text-gray-400`}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}

export function PulseLoading({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="h-3 w-3 rounded-full bg-[#1DB954]"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
      {message && <p className="text-sm text-gray-400">{message}</p>}
    </div>
  );
}

