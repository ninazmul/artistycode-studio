"use client";

import { motion } from "framer-motion";

const techStack = [
  "Next.js 16",
  "TypeScript",
  "React Native",
  "Node.js",
  "PostgreSQL",
  "MongoDB",
  "AWS Cloud",
  "Tailwind CSS",
  "Framer Motion",
  "Docker",
  "Prisma ORM",
  "GraphQL",
  "Redis",
  "Vercel Edge",
  "Supabase",
  "Gemini & OpenAI API",
];

// Double the list for seamless loop
const items = [...techStack, ...techStack];

export default function TechStack() {
  return (
    <section className="relative w-full py-10 bg-black-100 overflow-hidden border-y border-white/5">
      {/* Edge gradient masks for seamless fade */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-black-100 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-black-100 to-transparent z-10 pointer-events-none" />

      <div className="flex w-max">
        <motion.div
          className="flex items-center gap-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {items.map((tech, i) => (
            <div key={i} className="flex items-center gap-4 shrink-0">
              <span className="px-5 py-2 glass rounded-full border border-white/10 text-[11px] font-semibold text-white/50 uppercase tracking-[0.22em] whitespace-nowrap hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300 cursor-default">
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
