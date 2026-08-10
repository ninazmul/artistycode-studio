"use client";

import { motion } from "framer-motion";

const techStack = [
  "Next.js",
  "TypeScript",
  "React Native",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "AWS",
  "Tailwind CSS",
  "Framer Motion",
  "Docker",
  "Prisma",
  "GraphQL",
  "Redis",
  "Vercel",
  "Supabase",
  "OpenAI API",
];

// Double the list for seamless loop
const items = [...techStack, ...techStack];

export default function TechStack() {
  return (
    <section className="relative w-full py-12 bg-black-100 overflow-hidden border-y border-white/5">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-black-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-black-100 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((tech, i) => (
            <div
              key={i}
              className="flex items-center gap-4 shrink-0"
            >
              <span className="px-5 py-2 glass rounded-full border border-white/10 text-xs font-semibold text-white/50 uppercase tracking-[0.2em] whitespace-nowrap hover:text-white hover:border-white/30 hover:bg-white/[0.05] transition-all duration-300 cursor-default">
                {tech}
              </span>
              <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
