"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const metrics = [
  { end: 80, suffix: "+", label: "Projects Delivered", sub: "across web, mobile & cloud" },
  { end: 30, suffix: "+", label: "Global Clients", sub: "across 10+ industries" },
  { end: 4,  suffix: "+", label: "Years Building", sub: "enterprise-grade systems" },
  { end: 100, suffix: "%", label: "Delivery Rate", sub: "on-time, every time" },
];

function Counter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

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
    <span ref={ref} className="text-4xl md:text-5xl lg:text-6xl font-black text-shine italic tracking-tighter">
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="py-20 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lighting-radial opacity-20" />
      </div>

      <div className="wrapper relative z-10">
        {/* Section Label */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-white/50">
              BY THE NUMBERS
            </p>
          </div>
          <h2 className="heading italic">PROVEN AT SCALE</h2>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative glass rounded-2xl p-8 md:p-10 flex flex-col items-center text-center border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:w-full transition-all duration-700" />

              <Counter end={metric.end} suffix={metric.suffix} />
              <p className="text-sm font-bold tracking-wide text-white mt-3 mb-1">{metric.label}</p>
              <p className="text-[11px] text-white/30 font-light uppercase tracking-[0.15em]">{metric.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
