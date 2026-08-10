"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const features = [
  "Calorie Tracking",
  "Nutrition",
  "Workout Tracking",
  "Weight Progress",
];

export default function FitOSBanner() {
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
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 backdrop-blur-md"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>

          <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 md:text-xs">
            Featured • FitOS
          </span>
        </motion.div>

        {/* FitOS Introduction */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 max-w-3xl text-center"
        >
          {/* Brand Name */}
          <div className="mb-3 flex items-center justify-center gap-2">
            <span className="text-2xl font-black tracking-tight text-emerald-400 sm:text-3xl">
              FitOS
            </span>
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Your Fitness,{" "}
            <span className="text-emerald-400">Simplified.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/50 sm:text-base">
            A modern fitness and nutrition tracker to help you track calories,
            protein, workouts, weight, hydration and progress — all in one
            place.
          </p>

          {/* Features */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-1.5 text-xs text-white/60 sm:text-sm"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="group w-full overflow-hidden rounded-2xl border border-white/10 bg-black/60 p-2.5 shadow-2xl backdrop-blur-md transition-all duration-500 hover:border-white/20 sm:p-4 md:rounded-3xl md:p-6"
        >
          <a
            href="https://fitos.artistycode.studio/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open FitOS fitness and nutrition tracker"
            className="block w-full overflow-hidden rounded-xl transition-transform duration-500 ease-premium group-hover:scale-[1.01] md:rounded-2xl"
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-white md:rounded-2xl">
              <Image
                src="/assets/images/fitos.webp"
                alt="FitOS fitness and nutrition tracker"
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
          className="mt-7 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <p className="max-w-md text-center text-sm leading-6 text-white/40">
            Build healthier habits, understand your progress, and stay
            consistent.
          </p>

          <a
            href="https://fitos.artistycode.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="group/cta inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-2.5 text-sm font-medium text-emerald-300 transition-all duration-300 hover:border-emerald-400/40 hover:bg-emerald-400/20"
          >
            Explore FitOS
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}