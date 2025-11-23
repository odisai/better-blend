"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CompatibilityRevealProps {
  score: number;
  onComplete?: () => void;
}

export function CompatibilityReveal({
  score,
  onComplete,
}: CompatibilityRevealProps) {
  const [displayedScore, setDisplayedScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Animate score from 0 to actual score
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = score / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const newScore = Math.min(Math.round(increment * currentStep), score);
      setDisplayedScore(newScore);

      if (newScore >= score) {
        clearInterval(timer);
        setIsComplete(true);
        setTimeout(() => {
          onComplete?.();
        }, 500);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Large Score Display */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative mb-8"
      >
        {/* Outer Glow */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#1DB954] to-[#FF006E] blur-3xl"
          style={{ width: "400px", height: "400px", margin: "-200px" }}
        />

        {/* Score Circle */}
        <div className="relative h-64 w-64 md:h-80 md:w-80">
          <svg className="h-full w-full -rotate-90 transform">
            {/* Background Circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="none"
            />
            {/* Animated Score Circle */}
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: displayedScore / 100 }}
              transition={{ duration: 2, ease: "easeOut" }}
            />
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1DB954" />
                <stop offset="100%" stopColor="#FF006E" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              key={displayedScore}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl font-bold md:text-8xl"
              style={{
                background: "linear-gradient(135deg, #1DB954 0%, #FF006E 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {displayedScore}%
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: isComplete ? 1 : 0 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-lg text-gray-400"
            >
              Match
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isComplete ? 1 : 0, y: isComplete ? 0 : 20 }}
        transition={{ delay: 0.7 }}
        className="text-center"
      >
        <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl">
          {score >= 80
            ? "Perfect Match! 🎉"
            : score >= 60
              ? "Great Compatibility! ✨"
              : score >= 40
                ? "Nice Blend! 🎵"
                : "Interesting Mix! 🎶"}
        </h2>
        <p className="text-lg text-gray-400">
          Your music tastes are blending beautifully
        </p>
      </motion.div>
    </div>
  );
}

