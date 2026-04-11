import { services } from "@/data";
import Image from "next/image";
import Link from "next/link";
import MagicButton from "./MagicButton";
import { Contact } from "lucide-react";

const Services = () => {
  return (
    <section id="services" className="py-32 bg-black-100 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] lighting-radial opacity-30 pointer-events-none" />

      {/* Heading */}
      <div className="wrapper relative z-10 text-center mb-24">
        <h2 className="heading mb-6 tracking-tighter">OUR SERVICES</h2>
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
            className="group relative h-full flex flex-col p-8 glass rounded-3xl transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.05] hover:border-white/20"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="text-6xl font-black italic">0{index + 1}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight group-hover:text-white transition-colors">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base text-white/50 leading-relaxed font-light mt-auto">
              {service.desc}
            </p>

            {/* Subtle glow on hover */}
            <div className="absolute inset-0 rounded-3xl bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
