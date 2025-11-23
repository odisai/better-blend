"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Music2 } from "lucide-react";

interface Artist {
  id: string;
  name: string;
  image: string | null;
}

interface ArtistGridProps {
  artists: Artist[];
  maxDisplay?: number;
}

export function ArtistGrid({ artists, maxDisplay = 10 }: ArtistGridProps) {
  const displayedArtists = artists.slice(0, maxDisplay);

  return (
    <div className="w-full">
      <motion.h3
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 text-center text-xl font-bold text-white sm:mb-6 sm:text-2xl"
      >
        Artists You Both Love
      </motion.h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-5">
        {displayedArtists.map((artist, index) => (
          <motion.div
            key={artist.id}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group cursor-pointer space-y-2"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-full transition-all group-hover:ring-4 group-hover:ring-[#1DB954]/50">
              {artist.image ? (
                <Image
                  src={artist.image}
                  alt={artist.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1DB954] to-[#FF006E]">
                  <Music2 className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            <p className="truncate text-center text-sm font-medium text-white">
              {artist.name}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

