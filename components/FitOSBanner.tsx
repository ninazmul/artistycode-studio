"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function FitOSBanner() {
  return (
    <section className="relative w-full py-12 md:py-16 bg-black-100 overflow-hidden">
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-20 pointer-events-none" />

      <div className="wrapper relative z-10 flex flex-col items-center">
        {/* Tiny Section Label */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
            FEATURED PRODUCT
          </p>
        </div>

        {/* Dark Elevated Section Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full glass rounded-2xl md:rounded-3xl p-2.5 sm:p-4 md:p-6 border border-white/10 bg-black-200/60 backdrop-blur-md shadow-2xl overflow-hidden hover:border-white/20 transition-all duration-500 group"
        >
          <a
            href="https://fitos.artistycode.studio/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full overflow-hidden rounded-xl md:rounded-2xl transition-transform duration-500 ease-premium group-hover:scale-[1.01]"
            aria-label="FitOS fitness and nutrition tracker"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl md:rounded-2xl bg-white flex items-center justify-center">
              <Image
                src="/assets/images/fitos.webp"
                alt="FitOS fitness and nutrition tracker"
                width={1920}
                height={1080}
                priority
                sizes="(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"
                className="w-full h-auto object-contain rounded-xl md:rounded-2xl"
              />
            </div>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
