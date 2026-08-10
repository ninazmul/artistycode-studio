"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Promotion() {
  return (
    <section id="promotion" className="py-24 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-15" />
      </div>

      <div className="wrapper relative z-10">
        <motion.a
          href="https://hostinger.com?REFERRALCODE=ACSTUDIO"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="group relative flex flex-col md:flex-row items-center md:items-start justify-between gap-8 glass rounded-2xl p-10 md:p-14 border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 overflow-hidden block"
        >
          {/* Top shimmer */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          {/* Left: Text */}
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/10 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] font-bold tracking-[0.3em] text-white/50 uppercase">
                SPONSORED · LIMITED TIME
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-shine italic mb-4">
              GET 20% EXTRA OFF<br className="hidden md:block" /> HOSTINGER PLANS
            </h2>

            <p className="text-white/50 text-sm md:text-base font-light max-w-md leading-relaxed">
              High-performance hosting for developers, creators, and businesses.
              Recommended by ArtistyCode Studio.
            </p>
          </div>

          {/* Right: CTA Badge */}
          <div className="shrink-0 flex flex-col items-center md:items-end gap-4">
            <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl glass border border-white/15 flex flex-col items-center justify-center text-center p-4 group-hover:bg-white group-hover:border-transparent transition-all duration-500">
              <span className="text-3xl font-black text-shine italic group-hover:text-black transition-colors duration-500">
                20%
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 group-hover:text-black/60 uppercase transition-colors duration-500">
                EXTRA OFF
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm font-bold text-white/40 group-hover:text-white transition-colors duration-400">
              <span className="uppercase tracking-widest text-xs">Claim Offer</span>
              <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            </div>
          </div>

          {/* Bottom glow */}
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:w-full transition-all duration-700" />
        </motion.a>
      </div>
    </section>
  );
}