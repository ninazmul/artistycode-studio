"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, Sparkles } from "lucide-react";

const features = [
  "Smart Calorie & Macro Pacing",
  "AI Health Coaching & Briefings",
  "Strength & Workout Tracking",
  "Longitudinal Progress Analytics",
];

export default function NutriBDBanner() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />
      </div>

      <div className="wrapper relative z-10 flex flex-col items-center">
        {/* Section Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 md:text-xs">
            Featured Platform • NutriBD v2.2.1
          </span>
        </motion.div>

        {/* NutriBD Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 max-w-3xl text-center"
        >
          {/* Brand Name & Studio Tag */}
          <div className="mb-3 flex flex-col items-center justify-center gap-1">
            <span className="text-3xl font-black tracking-tight text-emerald-400 sm:text-4xl">
              NutriBD
            </span>
            <span className="text-xs font-medium tracking-wide text-white/40">
              Crafted by ArtistyCode Studio
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Smart AI Fitness &{" "}
            <span className="text-emerald-400">Nutrition Platform.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            An advanced, server-first health ecosystem combining precise dual-mode
            portion calculations, strength tracking, body recomposition analytics,
            and real-time Gemini AI coaching.
          </p>

          {/* Features */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-1.5 text-xs text-white/70 sm:text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Banner Mockup Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-2.5 shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-emerald-500/30 sm:p-4 md:rounded-3xl md:p-6"
        >
          <a
            href="https://nutribd.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open NutriBD fitness and nutrition tracking platform"
            className="block w-full overflow-hidden rounded-xl transition-transform duration-500 ease-out group-hover:scale-[1.01] md:rounded-2xl"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-neutral-950 md:rounded-2xl">
              <Image
                src="/assets/images/nutribd.png"
                alt="NutriBD dashboard interface preview"
                fill
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="object-contain"
              />
            </div>
          </a>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6"
        >
          <div className="flex items-center gap-2 text-center text-sm text-white/40 sm:text-left">
            <Sparkles className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Built with Next.js 16, TypeScript, MongoDB & Gemini AI</span>
          </div>

          <a
            href="https://NutriBD.artistycode.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-6 py-3 text-sm font-medium text-emerald-300 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]"
          >
            Explore Live App
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}