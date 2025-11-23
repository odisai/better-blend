"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { User } from "lucide-react";

interface UserAvatarsProps {
  creator: {
    name?: string | null;
    image?: string | null;
  };
  partner?: {
    name?: string | null;
    image?: string | null;
  };
  size?: "sm" | "md" | "lg";
  showConnection?: boolean;
}

const sizeMap = {
  sm: 64,
  md: 96,
  lg: 128,
};

export function UserAvatars({
  creator,
  partner,
  size = "md",
  showConnection = false,
}: UserAvatarsProps) {
  const avatarSize = sizeMap[size];

  return (
    <div className="relative flex items-center justify-center">
      {/* Creator Avatar */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.6 }}
        className="relative z-10"
      >
        <div
          className="relative overflow-hidden rounded-full border-4 border-[#1DB954] bg-gradient-to-br from-[#1DB954] to-[#1ed760]"
          style={{ width: avatarSize, height: avatarSize }}
        >
          {creator.image ? (
            <Image
              src={creator.image}
              alt={creator.name ?? "Creator"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <User className="h-1/2 w-1/2 text-white" />
            </div>
          )}
        </div>
        {creator.name && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-center text-sm font-medium text-white"
          >
            {creator.name}
          </motion.div>
        )}
      </motion.div>

      {/* Connection Line */}
      {showConnection && partner && (
        <>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute h-1 w-32 bg-gradient-to-r from-[#1DB954] via-[#FF006E] to-[#1DB954] md:w-48"
            style={{ left: avatarSize / 2 }}
          />

          {/* Partner Avatar */}
          <motion.div
            initial={{ scale: 0, opacity: 0, x: -50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.5 }}
            className="relative z-10"
            style={{ marginLeft: avatarSize + (size === "lg" ? 64 : 32) }}
          >
            <div
              className="relative overflow-hidden rounded-full border-4 border-[#FF006E] bg-gradient-to-br from-[#FF006E] to-[#FF4DA6]"
              style={{ width: avatarSize, height: avatarSize }}
            >
              {partner.image ? (
                <Image
                  src={partner.image}
                  alt={partner.name ?? "Partner"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-1/2 w-1/2 text-white" />
                </div>
              )}
            </div>
            {partner.name && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-2 text-center text-sm font-medium text-white"
              >
                {partner.name}
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}

