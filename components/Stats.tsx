"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, ShieldCheck, Zap, Globe } from "lucide-react";

const metrics = [
  {
    end: 80,
    suffix: "+",
    label: "Digital Products",
    sub: "Enterprise web, mobile & cloud",
    icon: <Zap className="w-4 h-4 text-purple-400" />,
  },
  {
    end: 30,
    suffix: "+",
    label: "Global Clients",
    sub: "Across 10+ niche industries",
    icon: <Globe className="w-4 h-4 text-cyan-400" />,
  },
  {
    end: 4,
    suffix: "+",
    label: "Years Engineering",
    sub: "Production software architecture",
    icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
  },
  {
    end: 100,
    suffix: "%",
    label: "Delivery Track",
    sub: "On-time SLA commitment",
    icon: <CheckCircle2 className="w-4 h-4 text-amber-400" />,
  },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl lg:text-6xl font-black text-shine italic tracking-tighter">
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-24 bg-black-100 text-white relative overflow-hidden border-t border-white/5">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lighting-radial opacity-15" />
      </div>

      <div className="wrapper relative z-10">
        {/* Section Label */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <p className="uppercase tracking-[0.28em] text-[10px] font-semibold text-white/60">
              PROVEN RESULTS
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-shine italic">
            MEASURED BY THE NUMBERS
          </h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative glass rounded-2xl p-6 sm:p-8 flex flex-col items-center text-center border border-white/10 hover:border-white/25 hover:bg-white/[0.04] transition-all duration-500 overflow-hidden shadow-lg"
            >
              {/* Top hairline shimmer */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:w-full transition-all duration-700" />

              <div className="w-8 h-8 rounded-lg glass border border-white/10 flex items-center justify-center mb-4 bg-white/[0.02]">
                {metric.icon}
              </div>

              <Counter end={metric.end} suffix={metric.suffix} />
              
              <p className="text-xs sm:text-sm font-bold tracking-wide text-white mt-3 mb-1">
                {metric.label}
              </p>
              
              <p className="text-[10px] sm:text-[11px] text-white/40 font-light leading-relaxed">
                {metric.sub}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
