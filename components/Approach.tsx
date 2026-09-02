"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock } from "lucide-react";

const steps = [
  {
    phase: "01",
    time: "Discovery",
    title: "Architecture & Blueprint",
    desc: "We audit business objectives, target market demands, and technical constraints to engineer a crystal-clear software blueprint and scalable data model.",
    deliverables: ["Technical Architecture", "Interactive UX Blueprint", "Performance Benchmark Specs"],
  },
  {
    phase: "02",
    time: "Sprint Execution",
    title: "Precision Engineering",
    desc: "Our team implements modular full-stack codebases with rigorous automated testing, luxury micro-interactions, and enterprise API integrations.",
    deliverables: ["Modular Component System", "Cloud Backend & Edge APIs", "Automated Security Audits"],
  },
  {
    phase: "03",
    time: "Deployment",
    title: "Production Launch & Scale",
    desc: "We execute zero-downtime deployments with continuous integration, configure real-time telemetry, and provide continuous SLA-backed maintenance.",
    deliverables: ["Automated CI/CD Pipelines", "Real-Time Error Telemetry", "SLA Support & Scaling"],
  },
];

const Approach = () => {
  return (
    <section id="approach" className="py-28 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border border-white/10 mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <p className="uppercase tracking-[0.28em] text-[10px] font-semibold text-white/60">
              ENGINEERING METHODOLOGY
            </p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-shine italic">
            OUR DISCIPLINES & PROCESS
          </h2>
          <p className="text-white/50 max-w-xl mx-auto text-sm sm:text-base font-light leading-relaxed mt-4">
            A battle-tested software engineering lifecycle designed for precision, velocity, and uncompromising code quality.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line - desktop only */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-white/10 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent origin-left"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col glass rounded-2xl p-8 border border-white/10 hover:bg-white/[0.04] hover:border-white/25 transition-all duration-500 shadow-xl overflow-hidden"
              >
                {/* Top shimmer line */}
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Phase badge */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl glass border border-white/15 flex items-center justify-center group-hover:bg-white group-hover:border-transparent transition-all duration-500">
                    <span className="text-sm font-black group-hover:text-black transition-colors duration-500">
                      {step.phase}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-white/40 uppercase tracking-widest">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    <span>{step.time}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light mb-8 flex-1">
                  {step.desc}
                </p>

                {/* Deliverables */}
                <div className="pt-5 border-t border-white/5">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 mb-3">
                    Deliverables
                  </p>
                  <ul className="space-y-2.5">
                    {step.deliverables.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2.5 text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors duration-300"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-cyan-400/80" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom fill line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-cyan-400/50 group-hover:w-full transition-all duration-700 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;
