import { services } from "@/data";
import Image from "next/image";
import Link from "next/link";
import MagicButton from "./MagicButton";
import { Contact } from "lucide-react";

const Services = () => {
  return (
    <section id="services" className="py-24 bg-black text-white px-6">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">Our Services</h1>
        <p className="text-white/60 mt-4 text-sm md:text-base">
          We help businesses design, build, and scale high-performance digital
          products.
        </p>
      </div>

      {/* Services Grid */}
      <div className="mt-20 grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="group border border-white/10 rounded-md p-6 bg-white/5 hover:bg-white/10 transition duration-300"
          >
            {/* Title */}
            <h2 className="text-lg md:text-xl font-medium">{service.title}</h2>

            {/* Description */}
            <p className="text-sm text-white/60 mt-2 leading-relaxed">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
