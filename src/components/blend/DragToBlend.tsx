"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { User } from "lucide-react";

interface DragToBlendProps {
  creator: {
    name?: string | null;
    image?: string | null;
  };
  partner: {
    name?: string | null;
    image?: string | null;
  };
  ratio: number;
  onRatioChange: (ratio: number) => void;
}

export function DragToBlend({
  creator,
  partner,
  ratio,
  onRatioChange,
}: DragToBlendProps) {
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const circleSize = 128; // 32 * 4 (h-32 = 128px)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - 64; // Account for padding (p-8 = 32px each side)
        setContainerWidth(Math.max(width, 400)); // Minimum width
      }
    };
    
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Calculate positions based on ratio (0.3 to 0.7)
  const minRatio = 0.3;
  const maxRatio = 0.7;
  const normalizedRatio = (ratio - minRatio) / (maxRatio - minRatio); // 0 to 1
  const availableWidth = containerWidth - circleSize;
  const creatorX = normalizedRatio * availableWidth;
  const partnerX = (1 - normalizedRatio) * availableWidth;

  const handleDragEnd = (x: number) => {
    if (!containerRef.current || containerWidth === 0) return;
    
    const newNormalizedRatio = Math.max(0, Math.min(1, x / availableWidth));
    const newRatio = minRatio + newNormalizedRatio * (maxRatio - minRatio);
    onRatioChange(newRatio);
  };

  const creatorPercentage = Math.round(ratio * 100);
  const partnerPercentage = Math.round((1 - ratio) * 100);

  return (
    <div className="w-full space-y-8">
      {/* Visual Blend Area */}
      <div
        ref={containerRef}
        className="relative h-64 w-full rounded-2xl border border-white/20 bg-white/5 p-8 backdrop-blur-sm"
      >
        {/* Blend Background */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: `linear-gradient(90deg, 
                rgba(29, 185, 84, 0.3) 0%, 
                rgba(29, 185, 84, 0.3) ${creatorPercentage}%, 
                rgba(255, 0, 110, 0.3) ${creatorPercentage}%, 
                rgba(255, 0, 110, 0.3) 100%)`,
            }}
          />
        </div>

        {/* Creator Circle */}
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={(_, info) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = info.point.x - rect.left - 32; // Account for padding
            handleDragEnd(x);
          }}
          animate={{
            x: creatorX,
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1/2 z-10 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{ left: 32 }} // Padding offset
        >
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#1DB954] bg-gradient-to-br from-[#1DB954] to-[#1ed760] shadow-2xl">
            {creator.image ? (
              <Image
                src={creator.image}
                alt={creator.name ?? "Creator"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
            <div className="text-lg font-bold text-white">{creatorPercentage}%</div>
            <div className="text-sm text-gray-400">{creator.name ?? "You"}</div>
          </div>
        </motion.div>

        {/* Partner Circle */}
        <motion.div
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDrag={(_, info) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const partnerXLocal = info.point.x - rect.left - 32; // Account for padding
            const newCreatorX = availableWidth - partnerXLocal;
            handleDragEnd(newCreatorX);
          }}
          animate={{
            x: partnerX,
            scale: isDragging ? 1.1 : 1,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1/2 z-10 -translate-y-1/2 cursor-grab active:cursor-grabbing"
          style={{ right: 32 }} // Padding offset, will be overridden by x animation
        >
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#FF006E] bg-gradient-to-br from-[#FF006E] to-[#FF4DA6] shadow-2xl">
            {partner.image ? (
              <Image
                src={partner.image}
                alt={partner.name ?? "Partner"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <User className="h-16 w-16 text-white" />
              </div>
            )}
          </div>
          <div className="absolute -bottom-8 right-1/2 translate-x-1/2 whitespace-nowrap text-center">
            <div className="text-lg font-bold text-white">{partnerPercentage}%</div>
            <div className="text-sm text-gray-400">{partner.name ?? "Partner"}</div>
          </div>
        </motion.div>

        {/* Connection Line */}
        {containerWidth > 0 && (
          <motion.div
            className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-[#1DB954] via-white/50 to-[#FF006E]"
            animate={{
              width: Math.max(100, Math.abs(creatorX - partnerX) + circleSize),
              left: Math.min(creatorX + 32, partnerX + 32),
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-gray-400">
        Drag the circles to adjust your blend ratio
      </p>
    </div>
  );
}
