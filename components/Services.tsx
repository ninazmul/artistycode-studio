import { services } from "@/data";
import React from "react";
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
    case 1: return <ShieldCheck className="w-8 h-8 text-white/40" />;
    case 2: return <Cpu className="w-8 h-8 text-white/40" />;
    case 3: return <Smartphone className="w-8 h-8 text-white/40" />;
    case 4: return <ShoppingBag className="w-8 h-8 text-white/40" />;
    case 5: return <Sparkles className="w-8 h-8 text-white/40" />;
    case 6: return <Cloud className="w-8 h-8 text-white/40" />;
    case 7: return <Palette className="w-8 h-8 text-white/40" />;
    case 8: return <Layers className="w-8 h-8 text-white/40" />;
    case 9: return <Zap className="w-8 h-8 text-white/40" />;
    default: return <Zap className="w-8 h-8 text-white/40" />;
  }
};

const Services = () => {
  return (
    <section id="services" className="py-32 bg-black-100 text-white relative overflow-hidden">
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
          <div
            key={service.id}
            className="group relative flex flex-col p-10 glass rounded-2xl transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/20 overflow-hidden"
          >
            {/* Index Number Overlay */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <span className="text-8xl font-black italic">0{index + 1}</span>
            </div>

            {/* Icon Box */}
            <div className="w-16 h-16 rounded-xl glass border border-white/5 flex items-center justify-center mb-8 bg-white/[0.02] group-hover:bg-white group-hover:border-white transition-all duration-500">
              <div className="group-hover:text-black transition-colors duration-500">
                {getIcon(service.id)}
              </div>
            </div>

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
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
