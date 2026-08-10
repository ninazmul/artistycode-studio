"use client";

import { services } from "@/data";
import React from "react";
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
  1: <ShieldCheck className="w-6 h-6" />,
  2: <Cpu className="w-6 h-6" />,
  3: <Smartphone className="w-6 h-6" />,
  4: <Sparkles className="w-6 h-6" />,
  5: <Cloud className="w-6 h-6" />,
  6: <Palette className="w-6 h-6" />,
};

const Services = () => {
  return (
    <section id="services" className="py-24 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-15 pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
              <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-white/50">
                ENGINEERING EXCELLENCE
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-shine italic text-left">
              WHAT WE<br />BUILD FOR YOU
            </h2>
          </div>
          <p className="text-white/40 max-w-sm text-base font-light leading-relaxed md:text-right">
            Precision-engineered digital products — from strategy to deployment and beyond.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.8,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative flex flex-col p-8 glass rounded-2xl border border-white/10 transition-all duration-500 hover:-translate-y-1.5 hover:bg-white/[0.04] hover:border-white/25 overflow-hidden cursor-default"
            >
              {/* Number watermark */}
              <div className="absolute top-4 right-5 text-[4.5rem] font-black italic text-white/[0.03] group-hover:text-white/[0.06] transition-all duration-500 leading-none select-none">
                0{index + 1}
              </div>

              {/* Top row: icon + number label */}
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-white/[0.08] group-hover:border-white/30 transition-all duration-500">
                  {iconMap[service.id] ?? <Zap className="w-6 h-6" />}
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] text-white/20 uppercase pt-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg md:text-xl font-bold mb-3 tracking-tight text-left group-hover:text-white transition-colors duration-300">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-white/45 leading-relaxed font-light text-left flex-1">
                {service.desc}
              </p>

              {/* Hover micro-link */}
              <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-white/20 group-hover:text-white/70 transition-all duration-400">
                <span className="uppercase tracking-widest">Learn more</span>
                <ArrowUpRight className="w-3.5 h-3.5 -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
              </div>

              {/* Bottom glow line */}
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:w-full transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
