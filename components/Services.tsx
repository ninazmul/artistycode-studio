"use client";

import { services } from "@/data";
import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  Smartphone, 
  ShoppingBag, 
  Sparkles, 
  Cloud, 
  Palette, 
  Layers, 
  Zap 
} from "lucide-react";

const getIcon = (id: number) => {
  switch (id) {
    case 1: return <ShieldCheck className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />;
    case 2: return <Cpu className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />;
    case 3: return <Smartphone className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />;
    case 4: return <Sparkles className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />;
    case 5: return <Cloud className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />;
    case 6: return <Palette className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />;
    default: return <Zap className="w-8 h-8 text-white/40 group-hover:text-white transition-colors" />;
  }
};

const Services = () => {
  return (
    <section id="services" className="py-20 bg-black-100 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full lighting-radial opacity-20 pointer-events-none" />

      {/* Heading */}
      <div className="wrapper relative z-10 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md glass border border-white/5 mb-8">
          <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
            ENGINEERING EXCELLENCE
          </p>
        </div>
        <h2 className="heading mb-6 tracking-tighter italic">OUR CORE <br /> SERVICES</h2>
        <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
          We architect, design, and engineer high-performance digital products 
          that redefine industry benchmarks.
        </p>
      </div>

      {/* Services Grid */}
      <div className="wrapper relative z-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.8, 
              delay: index * 0.1, 
              ease: [0.16, 1, 0.3, 1] 
            }}
            className="group relative flex flex-col p-10 glass rounded-2xl transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.04] hover:border-white/20 overflow-hidden"
          >
            {/* Index Number Overlay */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <span className="text-8xl font-black italic">0{index + 1}</span>
            </div>

            {/* Icon Box */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-16 h-16 rounded-xl glass border border-white/5 flex items-center justify-center mb-8 bg-white/[0.02] group-hover:bg-white/[0.1] group-hover:border-white/40 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all duration-500"
            >
              {getIcon(service.id)}
            </motion.div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base text-white/50 leading-relaxed font-light">
              {service.desc}
            </p>

            {/* Subtle glow bottom edge */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
