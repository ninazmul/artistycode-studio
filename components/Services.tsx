"use client";

import { services } from "@/data";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Cpu,
  Smartphone,
  Sparkles,
  Cloud,
  Palette,
  Zap,
  ArrowUpRight,
} from "lucide-react";

const iconMap: Record<number, React.ReactNode> = {
  1: <ShieldCheck className="w-5 h-5 text-purple-400" />,
  2: <Cpu className="w-5 h-5 text-cyan-400" />,
  3: <Smartphone className="w-5 h-5 text-emerald-400" />,
  4: <Sparkles className="w-5 h-5 text-amber-400" />,
  5: <Cloud className="w-5 h-5 text-blue-400" />,
  6: <Palette className="w-5 h-5 text-pink-400" />,
};

const tagMap: Record<number, string[]> = {
  1: ["System Blueprint", "Tech Audit", "Scalability"],
  2: ["Next.js 16", "TypeScript", "Performance"],
  3: ["React Native", "iOS & Android", "Offline First"],
  4: ["Custom LLMs", "AI Agents", "Automation"],
  5: ["AWS & Docker", "CI/CD Pipelines", "99.9% SLA"],
  6: ["Figma Design", "Design Systems", "Micro-animations"],
};

const Services = () => {
  return (
    <section id="services" className="py-28 bg-black-100 text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-15 pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/10 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <p className="uppercase tracking-[0.28em] text-[10px] font-semibold text-white/60">
                CAPABILITIES & EXPERTISE
              </p>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-shine italic text-left leading-[1.1]">
              ENGINEERING<br />SOLUTIONS FOR SCALE
            </h2>
          </div>
          <div className="flex flex-col items-start md:items-end gap-3">
            <p className="text-white/50 max-w-sm text-sm sm:text-base font-light leading-relaxed md:text-right">
              Architecting bespoke digital platforms tailored for speed, resilience, and maximum brand equity.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white/50 hover:text-white uppercase tracking-widest transition-colors duration-300 group"
            >
              <span>Custom Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
            </Link>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col p-7 sm:p-8 rounded-2xl glass border border-white/10 hover:border-white/25 bg-gradient-to-b from-white/[0.04] via-white/[0.02] to-transparent hover:from-white/[0.07] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden shadow-lg hover:shadow-2xl"
            >
              {/* Top hairline highlight shimmer */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Number watermark */}
              <div className="absolute top-4 right-5 text-[4rem] font-black italic text-white/[0.03] group-hover:text-white/[0.06] transition-all duration-500 leading-none select-none">
                0{index + 1}
              </div>

              {/* Top row: icon + number tag */}
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl glass border border-white/10 flex items-center justify-center bg-white/[0.03] group-hover:bg-white/[0.08] group-hover:border-white/25 transition-all duration-500">
                  {iconMap[service.id] ?? <Zap className="w-5 h-5" />}
                </div>
                <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-white/30 uppercase pt-1">
                  SYS.0{service.id}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold mb-3 tracking-tight text-left text-white group-hover:text-white transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light text-left flex-1 mb-6">
                {service.desc}
              </p>

              {/* Tech / Capability tags */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {tagMap[service.id]?.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/5 text-white/40 group-hover:text-white/60 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA link */}
              <Link
                href={`/contact?service=${encodeURIComponent(service.title)}`}
                className="flex items-center gap-1.5 text-xs font-bold text-white/30 group-hover:text-white transition-colors duration-300 mt-auto pt-4 border-t border-white/5"
              >
                <span className="uppercase tracking-widest text-[11px]">Initiate Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
