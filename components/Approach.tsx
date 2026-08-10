"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    phase: "01",
    title: "Discovery & Strategy",
    desc: "We audit your goals, market landscape, and technical requirements to define a crystal-clear product roadmap and architecture blueprint.",
    deliverables: ["Technical Audit", "Product Roadmap", "Architecture Blueprint"],
  },
  {
    phase: "02",
    title: "Design & Engineering",
    desc: "Our engineers build high-performance, scalable systems while our designers craft premium interfaces that convert and delight at every touch point.",
    deliverables: ["Design System", "Frontend & Backend", "API Integration"],
  },
  {
    phase: "03",
    title: "Launch & Scale",
    desc: "We deploy to production with CI/CD pipelines, monitor performance metrics, and iterate rapidly based on real user data and business outcomes.",
    deliverables: ["CI/CD Pipeline", "Performance Monitoring", "Ongoing Support"],
  },
];

const Approach = () => {
  return (
    <section id="approach" className="py-24 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-white/[0.015] blur-[120px] rounded-full pointer-events-none" />

      <div className="wrapper relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 mb-6">
            <p className="uppercase tracking-[0.3em] text-[10px] font-semibold text-white/50">
              HOW WE WORK
            </p>
          </div>
          <h2 className="heading italic mb-6">OUR APPROACH</h2>
          <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
            A disciplined engineering lifecycle designed for precision, speed, and uncompromising quality.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line - desktop only */}
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-white/5 z-0">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="h-full bg-gradient-to-r from-transparent via-white/20 to-transparent origin-left"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.15,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col glass rounded-2xl p-8 border border-white/10 hover:bg-white/[0.04] hover:border-white/25 transition-all duration-500"
              >
                {/* Phase badge */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl glass border border-white/15 flex items-center justify-center group-hover:bg-white group-hover:border-transparent transition-all duration-500">
                    <span className="text-sm font-black group-hover:text-black transition-colors duration-500">
                      {step.phase}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-[0.35em] text-white/25 uppercase">
                    PHASE {step.phase}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-4 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm md:text-base text-white/45 leading-relaxed font-light mb-8 flex-1">
                  {step.desc}
                </p>

                {/* Deliverables */}
                <ul className="space-y-2">
                  {step.deliverables.map((item, j) => (
                    <li key={j} className="flex items-center gap-3 text-xs font-medium text-white/40 group-hover:text-white/60 transition-colors duration-300">
                      <CheckCircle className="w-3.5 h-3.5 shrink-0 text-white/20 group-hover:text-white/50 transition-colors duration-300" />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Bottom fill line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white/20 group-hover:w-full transition-all duration-700 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Approach;
