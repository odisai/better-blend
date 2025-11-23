"use client";

import { motion } from "framer-motion";
import { Music2 } from "lucide-react";

interface PlaylistLengthCardsProps {
  value: number;
  onChange: (value: number) => void;
}

const lengths = [
  { value: 25, label: "25", desc: "Quick Mix", size: "sm" as const },
  { value: 50, label: "50", desc: "Perfect", size: "md" as const },
  { value: 100, label: "100", desc: "Epic", size: "lg" as const },
];

const sizeMap: Record<
  "sm" | "md" | "lg",
  { width: string; height: string; icon: number; widthMobile: string; heightMobile: string; iconMobile: number }
> = {
  sm: { width: "w-24", height: "h-24", icon: 32, widthMobile: "w-16", heightMobile: "h-16", iconMobile: 24 },
  md: { width: "w-32", height: "h-32", icon: 40, widthMobile: "w-20", heightMobile: "h-20", iconMobile: 28 },
  lg: { width: "w-40", height: "h-40", icon: 48, widthMobile: "w-24", heightMobile: "h-24", iconMobile: 32 },
};

export function PlaylistLengthCards({
  value,
  onChange,
}: PlaylistLengthCardsProps) {
  return (
    <div className="w-full space-y-4">
      <h3 className="text-center text-xl font-bold text-white">
        Playlist Length
      </h3>

      <div className="flex items-end justify-center gap-3 sm:gap-6">
        {lengths.map((length) => {
          const isActive = length.value === value;
          const size = sizeMap[length.size];

          return (
            <motion.button
              key={length.value}
              onClick={() => onChange(length.value)}
              className="flex flex-col items-center gap-2 sm:gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -10 : 0,
                }}
                className={`${size.widthMobile} ${size.heightMobile} sm:${size.width} sm:${size.height} flex flex-col items-center justify-center rounded-xl border-2 transition-all sm:rounded-2xl ${
                  isActive
                    ? "border-[#1DB954] bg-[#1DB954]/20 shadow-lg shadow-[#1DB954]/50"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <Music2
                  className={`text-[#1DB954] sm:hidden`}
                  style={{ width: size.iconMobile, height: size.iconMobile }}
                />
                <Music2
                  className={`hidden text-[#1DB954] sm:block`}
                  style={{ width: size.icon, height: size.icon }}
                />
                <div
                  className={`text-xs font-bold sm:text-sm ${isActive ? "text-white" : "text-gray-400"}`}
                >
                  {length.label}
                </div>
              </motion.div>
              <motion.div
                animate={{ opacity: isActive ? 1 : 0.5 }}
                className="text-center"
              >
                <div
                  className={`text-xs font-semibold sm:text-sm ${isActive ? "text-white" : "text-gray-400"}`}
                >
                  {length.desc}
                </div>
                <div className="text-[10px] text-gray-500 sm:text-xs">songs</div>
              </motion.div>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-xs text-gray-500">
        Tap a card to select playlist length
      </p>
    </div>
  );
}
