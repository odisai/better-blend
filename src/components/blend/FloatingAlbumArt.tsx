"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

interface AlbumArt {
  id: string;
  image: string | null;
}

interface FloatingAlbumArtProps {
  albums: AlbumArt[];
  count?: number;
}

export function FloatingAlbumArt({ albums, count = 12 }: FloatingAlbumArtProps) {
  const [displayedAlbums, setDisplayedAlbums] = useState<AlbumArt[]>([]);

  useEffect(() => {
    // Filter out albums without images and take up to count
    const validAlbums = albums
      .filter((album) => album.image)
      .slice(0, count);
    setDisplayedAlbums(validAlbums);
  }, [albums, count]);

  if (displayedAlbums.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {displayedAlbums.map((album, index) => {
        const delay = index * 0.2;
        const duration = 15 + Math.random() * 10; // 15-25 seconds
        const startX = Math.random() * 100; // Random starting position
        const endX = startX + (Math.random() - 0.5) * 40; // Random movement
        const startY = 100 + Math.random() * 20; // Start below viewport
        const endY = -20 - Math.random() * 20; // End above viewport
        const rotation = (Math.random() - 0.5) * 30; // Random rotation
        const size = 60 + Math.random() * 40; // 60-100px

        return (
          <motion.div
            key={`${album.id}-${index}`}
            className="absolute rounded-lg shadow-2xl"
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
            }}
            initial={{
              y: startY,
              x: 0,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: endY,
              x: endX - startX,
              rotate: rotation,
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {album.image && (
              <Image
                src={album.image}
                alt="Album art"
                width={size}
                height={size}
                className="h-full w-full rounded-lg object-cover"
                unoptimized
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

