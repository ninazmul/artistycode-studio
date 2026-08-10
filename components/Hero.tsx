"use client";

import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { val: "80+", label: "Products Delivered" },
  { val: "30+", label: "Global Clients" },
  { val: "4+", label: "Years in Business" },
  { val: "100%", label: "Delivery Rate" },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black-100 pt-28 pb-20 lg:pt-36 lg:pb-32">
      {/* Animated dot-grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Premium Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.25, 0.4, 0.25], scale: [1, 1.12, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[140px] rounded-full"
          style={{ willChange: "transform, opacity" }}
        />
        <motion.div
          animate={{ opacity: [0.25, 0.4, 0.25], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] bg-white/[0.03] blur-[140px] rounded-full"
          style={{ willChange: "transform, opacity" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] lighting-radial opacity-30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10 flex flex-col items-center text-center">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-white/60">
            Available for new projects
          </p>
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.88] tracking-[-0.03em] text-shine uppercase italic"
          >
            Engineering
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-6">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.88] tracking-[-0.03em] text-shine uppercase italic"
          >
            Digital
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.88] tracking-[-0.03em] text-shine uppercase italic"
          >
            Excellence
          </motion.h1>
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-base md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light mb-14"
        >
          We architect enterprise-grade web platforms, mobile ecosystems, and
          AI-powered solutions — engineered for performance, scalability, and
          long-term growth.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <a href="#projects" aria-label="View Our Work">
            <MagicButton
              title="View Our Work"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
          <Link href="/contact" aria-label="Start a Project">
            <button className="px-8 py-3 rounded-lg glass border border-white/15 text-sm font-semibold text-white/80 hover:text-white hover:border-white/30 hover:bg-white/[0.06] transition-all duration-300 tracking-wide">
              Start a Project →
            </button>
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass rounded-2xl p-5 md:p-6 flex flex-col items-center text-center border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 group"
            >
              <p className="text-2xl md:text-3xl font-black text-shine italic tracking-tighter mb-1 group-hover:scale-105 transition-transform duration-300">
                {stat.val}
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom border fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black-100 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
