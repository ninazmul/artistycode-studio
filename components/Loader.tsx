"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
  size?: number;
  label?: string;
}

export default function Loader({
  className,
  size = 48,
  label = "Please wait...",
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center min-h-screen gap-6 text-center bg-black text-white",
        className,
      )}
    >
      {/* Premium spinner */}
      <Loader2
        className="animate-spin text-white drop-shadow-lg"
        style={{ width: size, height: size }}
        aria-label="Loading spinner"
      />

      {/* Label with refined typography */}
      <p className="text-sm md:text-base tracking-wide uppercase text-gray-300 font-medium">
        {label}
      </p>

      {/* Subtle progress bar for premium feel */}
      <div className="w-40 h-[2px] bg-gray-700 overflow-hidden rounded-md">
        <div className="h-full w-full bg-white animate-[progress_2s_linear_infinite]" />
      </div>

      <style jsx>{`
        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
