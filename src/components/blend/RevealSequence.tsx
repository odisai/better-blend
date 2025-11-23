"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface RevealStep {
  id: string;
  component: React.ReactNode;
  title?: string;
}

interface RevealSequenceProps {
  steps: RevealStep[];
  onComplete?: () => void;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
}

export function RevealSequence({
  steps,
  onComplete,
  autoAdvance = true,
  autoAdvanceDelay = 3000,
}: RevealSequenceProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (autoAdvance && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, autoAdvanceDelay);

      return () => clearTimeout(timer);
    } else if (currentStep === steps.length - 1 && !completedSteps.has(currentStep)) {
      setCompletedSteps((prev) => new Set([...prev, currentStep]));
      setTimeout(() => {
        onComplete?.();
      }, autoAdvanceDelay);
    }
  }, [currentStep, steps.length, autoAdvance, autoAdvanceDelay, onComplete, completedSteps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="flex min-h-screen flex-col items-center justify-center px-4 py-12"
        >
          {steps[currentStep]?.component}
        </motion.div>
      </AnimatePresence>

      {/* Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex gap-2">
          {steps.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index <= currentStep ? "bg-[#1DB954]" : "bg-white/20"
              }`}
              initial={{ width: 8 }}
              animate={{
                width: index === currentStep ? 24 : 8,
              }}
            />
          ))}
        </div>
      </div>

      {/* Skip/Next Button */}
      {!autoAdvance && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 right-8"
        >
          <Button
            onClick={handleNext}
            className="rounded-full bg-[#1DB954] px-6 py-6 text-black hover:bg-[#1ed760]"
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            ) : (
              "Continue"
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

// Helper component for radar chart reveal
export function RadarChartReveal({ data }: { data: Array<{ feature: string; creator: number; partner: number }> }) {
  return (
    <div className="w-full max-w-2xl">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center text-2xl font-bold text-white"
      >
        Your Music Styles
      </motion.h3>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
      >
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis
              dataKey="feature"
              tick={{ fill: "#fff", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "#fff", fontSize: 10 }}
            />
            <Radar
              name="You"
              dataKey="creator"
              stroke="#1DB954"
              fill="#1DB954"
              fillOpacity={0.3}
            />
            <Radar
              name="Partner"
              dataKey="partner"
              stroke="#FF006E"
              fill="#FF006E"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

// Helper component for personality insights reveal
export function PersonalityInsightsReveal({ insights }: { insights: string[] }) {
  return (
    <div className="w-full max-w-2xl">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center text-2xl font-bold text-white"
      >
        Your Music Personality
      </motion.h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
            className="rounded-xl border border-white/20 bg-white/5 p-4 backdrop-blur-sm"
          >
            <p className="text-white">{insight}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

