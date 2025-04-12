/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect } from "react";

interface Item {
  quote: string;
  image: string;
  name: string;
  title: string;
}

interface InfiniteMovingCardsProps {
  items: Item[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards: React.FC<InfiniteMovingCardsProps> = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });
    }
  }, []);

  const getSpeed = () => {
    if (speed === "fast") return "20s";
    if (speed === "normal") return "40s";
    return "80s";
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-screen overflow-hidden group",
        "[mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap",
          "animate-scroll",
          pauseOnHover && "group-hover:paused"
        )}
        style={
          {
            "--animation-duration": getSpeed(),
            "--animation-direction":
              direction === "left" ? "forwards" : "reverse",
          } as React.CSSProperties
        }
      >
        {items.concat(items).map((item, idx) => (
          <li
            key={idx}
            className="w-[90vw] max-w-full relative rounded-2xl border border-b-0 border-slate-800 p-5 md:p-16 md:w-[60vw] hover:scale-105 transition-transform duration-300"
            style={{
              background: "rgb(4,7,29)",
              backgroundColor:
                "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
            }}
          >
            <blockquote>
              <span className="relative z-20 text-sm md:text-lg leading-[1.6] text-white font-normal !text-justify line-clamp-4">
                {item.quote}
              </span>
              <div className="relative z-20 mt-6 flex flex-row items-center">
                <div className="me-3">
                  <Image
                    src={item.image}
                    alt="profile"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
                <span className="flex flex-col gap-1">
                  <span className="text-xl font-bold leading-[1.6] text-white">
                    {item.name}
                  </span>
                  <span className="text-sm leading-[1.6] text-white-200 font-normal">
                    {item.title}
                  </span>
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};
