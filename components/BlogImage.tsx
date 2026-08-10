"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";

interface BlogImageProps {
  src: string;
  alt: string;
  className?: string;
  category?: string;
  loading?: "eager" | "lazy";
}

/**
 * Client component for blog article images.
 * Uses a plain <img> tag so it works with arbitrary external News API URLs,
 * and falls back gracefully to a placeholder icon on load failure.
 */
export default function BlogImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  category,
  loading = "lazy",
}: BlogImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-white/[0.03] to-transparent">
        <BookOpen className="w-10 h-10 text-white/20 mb-2" />
        {category && (
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/30">
            {category}
          </span>
        )}
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
      onError={() => setError(true)}
    />
  );
}
