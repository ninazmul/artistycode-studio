"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");

  useEffect(() => {
    animate(
      "span",
      { opacity: 1, y: 0 },
      { duration: 0.6, delay: stagger(0.08) },
    );
  }, []);

  return (
    <div className={cn("font-bold", className)}>
      <div className="my-4">
        <div className="relative leading-snug tracking-wide text-white overflow-hidden">
          {/* Metallic sweep layer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r 
              from-transparent via-white/40 to-transparent opacity-20"
          />

          <motion.div ref={scope}>
            {wordsArray.map((word, idx) => (
              <motion.span
                key={word + idx}
                className="inline-block opacity-0 translate-y-2"
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
