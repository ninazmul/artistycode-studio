"use client";

import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { motion } from "framer-motion";
import Link from "next/link";
import { ShieldCheck, Zap, Sparkles, Terminal, CheckCircle2 } from "lucide-react";

const stats = [
  { val: "80+", label: "Products Delivered" },
  { val: "30+", label: "Global Clients" },
  { val: "100%", label: "Delivery Rate" },
];

const Hero = () => {
  return (
    <section className="relative w-full min-h-[92vh] flex items-center justify-center overflow-hidden bg-black-100 pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background Dot Pattern & Radial Lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ opacity: [0.2, 0.35, 0.2], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-white/[0.03] blur-[140px] rounded-full"
          style={{ willChange: "transform, opacity" }}
        />
        <motion.div
          animate={{ opacity: [0.25, 0.4, 0.25], scale: [1.1, 1, 1.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-white/[0.03] blur-[140px] rounded-full"
          style={{ willChange: "transform, opacity" }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] h-[75%] lighting-radial opacity-25" />
      </div>

      {/* Split 2-Column Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Headline, Bio, CTAs & Stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Status Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-white/10 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <p className="uppercase tracking-[0.28em] text-[10px] sm:text-xs font-semibold text-white/60">
                Available for New Projects · Est. 2024
              </p>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black leading-[0.92] tracking-[-0.03em] text-shine uppercase italic mb-8">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white/60">
                Next-Gen Digital
              </span> <br />
              Ecosystems
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-white/55 max-w-xl font-light leading-relaxed mb-10">
              We architect enterprise-grade web applications, mobile platforms, and AI integrations — engineered for high performance, geometric clarity, and global scale.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-12">
              <Link href="/contact" aria-label="Start Collaboration">
                <MagicButton
                  title="Start Collaboration"
                  icon={<FaLocationArrow />}
                  position="right"
                />
              </Link>
              <a href="#projects" aria-label="Explore Portfolio">
                <button className="px-6 py-3.5 rounded-xl glass border border-white/15 text-xs font-bold uppercase tracking-widest text-white/80 hover:text-white hover:border-white/30 hover:bg-white/[0.08] transition-all duration-300">
                  Explore Work ↓
                </button>
              </a>
            </div>

            {/* Micro Stats Strip */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 w-full max-w-lg">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-black text-shine italic tracking-tighter">
                    {stat.val}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40 mt-0.5">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Visual Interactive Preview Showcase Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative w-full"
          >
            {/* Background Glow Ring */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-white/10 via-white/5 to-transparent blur-xl opacity-50 pointer-events-none" />

            {/* Floating Badge overlay on top */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 z-30 glass px-4 py-2.5 rounded-xl border border-white/25 bg-black-200/95 backdrop-blur-md shadow-2xl flex items-center gap-2 pointer-events-none"
            >
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: "6s" }} />
              <span className="text-[11px] font-bold text-white uppercase tracking-wider">AI & Cloud Ecosystems</span>
            </motion.div>

            {/* Code / Architecture Window Card */}
            <div className="relative glass rounded-3xl p-6 border border-white/15 bg-black-200/70 backdrop-blur-xl shadow-2xl overflow-hidden group">

              {/* Window Controls Header */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                </div>
                <div className="flex items-center gap-2 text-white/30 text-[11px] font-mono">
                  <Terminal className="w-3.5 h-3.5 text-white/40" />
                  <span>artistycode.config.ts</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest">Active</span>
                </div>
              </div>

              {/* Code Snippet */}
              <div className="font-mono text-xs text-white/75 space-y-2.5 leading-relaxed overflow-x-auto py-2">
                <p className="text-white/40">// Enterprise System Blueprint</p>
                <p>
                  <span className="text-purple-400">import</span> {"{"}{" "}
                  <span className="text-cyan-300">Studio</span> {"}"}{" "}
                  <span className="text-purple-400">from</span>{" "}
                  <span className="text-emerald-300">&quot;@artistycode/core&quot;</span>;
                </p>
                <br />
                <p>
                  <span className="text-purple-400">export const</span>{" "}
                  <span className="text-yellow-300">app</span> ={" "}
                  <span className="text-purple-400">new</span>{" "}
                  <span className="text-cyan-300">Studio</span>({"{"}
                </p>
                <p className="pl-4">
                  <span className="text-white/60">architecture:</span>{" "}
                  <span className="text-emerald-300">&quot;Cloud Native&quot;</span>,
                </p>
                <p className="pl-4">
                  <span className="text-white/60">stack:</span> [
                  <span className="text-emerald-300">&quot;Next.js&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;TypeScript&quot;</span>,{" "}
                  <span className="text-emerald-300">&quot;AI&quot;</span>],
                </p>
                <p className="pl-4">
                  <span className="text-white/60">performance:</span>{" "}
                  <span className="text-yellow-300">100</span>,
                </p>
                <p className="pl-4">
                  <span className="text-white/60">security:</span>{" "}
                  <span className="text-emerald-300">&quot;Enterprise Grade&quot;</span>,
                </p>
                <p>{"}"});</p>
                <br />
                <p className="text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>await app.deploy(); // Deployed to Edge</span>
                </p>
              </div>

              {/* Interactive Feature Pills inside Card */}
              <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2.5 p-3 rounded-xl glass border border-white/5 bg-white/[0.02]">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white">100/100 Score</span>
                    <span className="text-[9px] text-white/40 uppercase tracking-wider">Lighthouse CWV</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-3 rounded-xl glass border border-white/5 bg-white/[0.02]">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-white">SOC-2 Standards</span>
                    <span className="text-[9px] text-white/40 uppercase tracking-wider">Security First</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Subtle Gradient Transition */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black-100 to-transparent pointer-events-none" />
    </section>
  );
};

export default Hero;
