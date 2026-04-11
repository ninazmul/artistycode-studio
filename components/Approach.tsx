import React from "react";

const steps = [
  {
    title: "Strategy & Planning",
    desc: "We define goals, audience, and product direction to ensure a strong foundation before building.",
  },
  {
    title: "Design & Development",
    desc: "We design intuitive interfaces and build scalable, high-performance systems with modern technologies.",
  },
  {
    title: "Launch & Support",
    desc: "We test, launch, and continuously improve your product to ensure long-term success.",
  },
];

const Approach = () => {
  return (
    <section id="approach" className="py-32 bg-black-100 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[40%] h-[40%] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />

      {/* Heading */}
      <div className="wrapper relative z-10 text-center mb-24">
        <h2 className="heading mb-6 tracking-tighter uppercase italic">OUR APPROACH</h2>
        <p className="text-white/40 max-w-xl mx-auto text-base md:text-lg font-light leading-relaxed">
          A disciplined engineering lifecycle designed for precision, speed, and uncompromising quality.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="wrapper relative z-10 grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div
            key={i}
            className="group relative flex flex-col p-10 glass rounded-[2.5rem] transition-all duration-500 ease-premium hover:-translate-y-2 hover:bg-white/[0.05]"
          >
            {/* Step Number Badge */}
            <div className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-black transition-all duration-500">
              <span className="text-sm font-bold">0{i + 1}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl md:text-2xl font-bold mb-4 tracking-tight">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-sm md:text-base text-white/50 leading-relaxed font-light">
              {step.desc}
            </p>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-white/20 group-hover:w-full transition-all duration-700 rounded-full" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Approach;
