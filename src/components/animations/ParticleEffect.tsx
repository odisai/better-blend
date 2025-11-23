"use client";

import { motion } from "framer-motion";
import { Sparkles, Music2, Star } from "lucide-react";

interface ParticleEffectProps {
  count?: number;
  type?: "sparkles" | "music" | "stars";
  color?: string;
  duration?: number;
  className?: string;
}

const iconMap = {
  sparkles: Sparkles,
  music: Music2,
  stars: Star,
};

export function ParticleEffect({
  count = 30,
  type = "sparkles",
  color = "#1DB954",
  duration = 1.5,
  className = "",
}: ParticleEffectProps) {
  const Icon = iconMap[type];

  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360;
        const radius = 100 + Math.random() * 100;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;
        const delay = i * 0.05;
        const size = 4 + Math.random() * 8;

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
              duration,
              delay,
              ease: "easeOut",
            }}
          >
            <Icon
              className="h-4 w-4"
              style={{ color, width: size, height: size }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

interface ConfettiEffectProps {
  count?: number;
  colors?: string[];
}

export function ConfettiEffect({
  count = 50,
  colors = ["#1DB954", "#FF006E", "#00FF88", "#3A86FF"],
}: ConfettiEffectProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const color =
          colors[Math.floor(Math.random() * colors.length)] ?? colors[0];
        const startX = Math.random() * 100;
        const endX = startX + (Math.random() - 0.5) * 20;
        const duration = 2 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        const size = 8 + Math.random() * 12;
        const rotation = Math.random() * 360;

        return (
          <motion.div
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${startX}%`,
              top: "-10%",
              width: size,
              height: size,
              backgroundColor: color,
            }}
            initial={{
              y: 0,
              x: 0,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: "110%",
              x: `${endX - startX}%`,
              rotate: rotation + 360,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              ease: "easeIn",
            }}
          />
        );
      })}
    </div>
  );
}
