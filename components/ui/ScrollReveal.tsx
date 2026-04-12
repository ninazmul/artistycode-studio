"use client";

import React from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: "w-full" | "w-fit";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  duration?: number;
  className?: string;
  stagger?: boolean;
}

export const ScrollReveal = ({
  children,
  width = "w-full",
  delay = 0,
  direction = "up",
  distance = 30,
  duration = 0.8,
  className = "",
  stagger = false,
}: ScrollRevealProps) => {
  const getInitial = () => {
    switch (direction) {
      case "up": return { y: distance, opacity: 0 };
      case "down": return { y: -distance, opacity: 0 };
      case "left": return { x: distance, opacity: 0 };
      case "right": return { x: -distance, opacity: 0 };
      default: return { y: distance, opacity: 0 };
    }
  };

  return (
    <div className={`${width} ${className} relative overflow-hidden`}>
      <motion.div
        variants={{
          hidden: getInitial(),
          visible: { 
            y: 0, 
            x: 0, 
            opacity: 1,
            transition: {
              duration: duration,
              delay: delay,
              ease: [0.16, 1, 0.3, 1], // easeOutExpo
            }
          },
        }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {children}
      </motion.div>
    </div>
  );
};
