"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";

interface TimePeriodTimelineProps {
  value: "short_term" | "medium_term" | "long_term";
  onChange: (value: "short_term" | "medium_term" | "long_term") => void;
}

const periods = [
  {
    value: "short_term" as const,
    label: "4 Weeks",
    desc: "Recent",
    icon: "🕐",
  },
  {
    value: "medium_term" as const,
    label: "6 Months",
    desc: "Popular",
    icon: "📅",
  },
  {
    value: "long_term" as const,
    label: "All Time",
    desc: "Classic",
    icon: "⭐",
  },
];

export function TimePeriodTimeline({
  value,
  onChange,
}: TimePeriodTimelineProps) {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentIndex = periods.findIndex((p) => p.value === value);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0]?.clientX ?? 0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentIndex < periods.length - 1) {
      onChange(periods[currentIndex + 1]!.value);
    }
    if (isRightSwipe && currentIndex > 0) {
      onChange(periods[currentIndex - 1]!.value);
    }
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-center text-xl font-bold text-white">Time Period</h3>

      {/* Timeline Visualization */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative h-32 w-full overflow-hidden rounded-2xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm"
      >
        {/* Timeline Line */}
        <div className="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 bg-white/10" />

        {/* Period Markers */}
        <div className="relative flex h-full items-center justify-between">
          {periods.map((period, index) => {
            const isActive = period.value === value;
            const position = (index / (periods.length - 1)) * 100;

            return (
              <motion.button
                key={period.value}
                onClick={() => onChange(period.value)}
                className="absolute z-10 flex flex-col items-center gap-2"
                style={{ left: `${position}%`, transform: "translateX(-50%)" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    y: isActive ? -5 : 0,
                  }}
                  className={`flex h-16 w-16 items-center justify-center rounded-full border-2 transition-all ${
                    isActive
                      ? "border-[#1DB954] bg-[#1DB954]/20"
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  <span className="text-2xl">{period.icon}</span>
                </motion.div>
                <motion.div
                  animate={{ opacity: isActive ? 1 : 0.5 }}
                  className="text-center"
                >
                  <div
                    className={`text-sm font-semibold ${isActive ? "text-white" : "text-gray-400"}`}
                  >
                    {period.label}
                  </div>
                  <div className="text-xs text-gray-500">{period.desc}</div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Active Indicator */}
        <motion.div
          className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#1DB954] to-[#FF006E]"
          animate={{
            left: `${(currentIndex / (periods.length - 1)) * 100}%`,
            width: `${100 / periods.length}%`,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>

      <p className="text-center text-xs text-gray-500">
        Swipe left or right to change • Tap to select
      </p>
    </div>
  );
}
