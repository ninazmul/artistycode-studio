"use client";

import { motion } from "framer-motion";

export default function Promotion() {
  return (
    <section
      id="promotion"
      className="wrapper py-20 relative overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <a
          href="https://hostinger.com?REFERRALCODE=ACSTUDIO"
          target="_blank"
          rel="noopener noreferrer"
          className="block glass p-6 md:p-10 rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:bg-white/5 border border-white/5 hover:border-white/10"
        >
          <div className="relative w-full rounded-xl overflow-hidden flex items-center justify-center text-center">
            
            {/* Glow background accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-white/10 opacity-30" />

            <div className="relative z-10 space-y-3">
              <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-white/50">
                Limited Time Offer
              </p>

              <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-white leading-tight">
                Get{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-white">
                  20% Extra Off
                </span>{" "}
                on Hostinger Hosting Plans
              </h2>

              <p className="text-white/60 text-sm md:text-base">
                High-performance hosting for developers, creators, and businesses.
              </p>

              <div className="pt-2">
                <span className="inline-flex items-center gap-2 text-sm md:text-base text-white/80 hover:text-white transition-colors">
                  Claim Offer →
                </span>
              </div>
            </div>
          </div>
        </a>
      </motion.div>
    </section>
  );
}