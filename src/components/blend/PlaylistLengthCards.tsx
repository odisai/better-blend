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
  { width: string; height: string; icon: number }
> = {
  sm: { width: "w-24", height: "h-24", icon: 32 },
  md: { width: "w-32", height: "h-32", icon: 40 },
  lg: { width: "w-40", height: "h-40", icon: 48 },
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

      <div className="flex items-end justify-center gap-6">
        {lengths.map((length) => {
          const isActive = length.value === value;
          const size = sizeMap[length.size];

          return (
            <motion.button
              key={length.value}
              onClick={() => onChange(length.value)}
              className="flex flex-col items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -10 : 0,
                }}
                className={`${size.width} ${size.height} flex flex-col items-center justify-center rounded-2xl border-2 transition-all ${
                  isActive
                    ? "border-[#1DB954] bg-[#1DB954]/20 shadow-lg shadow-[#1DB954]/50"
                    : "border-white/20 bg-white/5 hover:border-white/40"
                }`}
              >
                <Music2
                  className={`text-[#1DB954]`}
                  style={{ width: size.icon, height: size.icon }}
                />
                <div
                  className={`font-bold ${isActive ? "text-white" : "text-gray-400"}`}
                >
                  {length.label}
                </div>
              </motion.div>
              <motion.div
                animate={{ opacity: isActive ? 1 : 0.5 }}
                className="text-center"
              >
                <div
                  className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-400"}`}
                >
                  {length.desc}
                </div>
                <div className="text-xs text-gray-500">songs</div>
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
