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
    <section className="py-24 bg-black text-white px-6">
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-semibold">Our Approach</h1>
        <p className="text-white/60 mt-4 text-sm md:text-base">
          A simple, proven process to deliver high-quality digital products.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-20 grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <div
            key={i}
            className="border border-white/10 rounded-md p-6 bg-white/5 hover:bg-white/10 transition duration-300"
          >
            {/* Step Number */}
            <div className="text-sm text-white/40 mb-4">Step {i + 1}</div>

            {/* Title */}
            <h2 className="text-lg md:text-xl font-medium">{step.title}</h2>

            {/* Description */}
            <p className="text-sm text-white/60 mt-2 leading-relaxed">
              {step.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Approach;
