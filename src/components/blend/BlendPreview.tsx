"use client";

import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

interface BlendPreviewProps {
  creatorPercentage: number;
  partnerPercentage: number;
  timeRange: string;
  playlistLength: number;
}

export function BlendPreview({
  creatorPercentage,
  partnerPercentage,
  timeRange,
  playlistLength,
}: BlendPreviewProps) {
  const timeRangeLabel =
    timeRange === "short_term"
      ? "4 Weeks"
      : timeRange === "medium_term"
        ? "6 Months"
        : "All Time";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm sm:p-6"
    >
      <h3 className="mb-3 text-center text-base font-bold text-white sm:mb-4 sm:text-lg">
        Your Blend Preview
      </h3>

      {/* Visual Blend Bar */}
      <div className="mb-6 h-8 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="flex h-full"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="bg-gradient-to-r from-[#1DB954] to-[#1ed760]"
            animate={{ width: `${creatorPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="bg-gradient-to-r from-[#FF006E] to-[#FF4DA6]"
            animate={{ width: `${partnerPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </div>

      {/* Configuration Summary */}
      <div className="space-y-2 text-xs sm:space-y-3 sm:text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Blend Ratio</span>
          <span className="font-semibold text-white">
            {creatorPercentage}% / {partnerPercentage}%
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Time Period</span>
          <span className="font-semibold text-white">{timeRangeLabel}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Playlist Length</span>
          <span className="font-semibold text-white">{playlistLength} songs</span>
        </div>
      </div>

      {/* Preview Icon */}
      <div className="mt-6 flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
          <Music2 className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}

