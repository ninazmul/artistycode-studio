import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Hero = () => {
  return (
    <section className="relative w-full min-h-[95vh] flex items-center justify-center overflow-hidden bg-black-100 py-20 lg:py-32">
      {/* Premium Lighting System */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] lighting-radial opacity-40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex justify-center py-10 w-full px-5 sm:px-10">
        <div className="flex flex-col items-center justify-center max-w-[89vw] md:max-w-4xl lg:max-w-[70vw] text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <p className="uppercase tracking-[0.3em] text-[10px] md:text-xs font-semibold text-white/50">
              Agency · Development · Design
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black leading-[0.9] text-shine tracking-tighter mb-8 italic">
            INNOVATING <br className="hidden md:block" /> BEYOND <br className="hidden md:block" /> BOUNDARIES
          </h1>

          <p className="mt-6 mb-12 text-base md:text-xl md:tracking-wide text-white/60 max-w-2xl mx-auto leading-relaxed">
            We craft enterprise-grade digital ecosystems with geometric clarity and seamless motion. 
            Redefining technical excellence for the next generation of global visionaries.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="#projects" aria-label="Explore Our Portfolio">
              <MagicButton
                title="Explore Portfolio"
                icon={<FaLocationArrow />}
                position="right"
              />
            </a>
            <a href="#contact" className="text-sm font-medium text-white/40 hover:text-white transition-all duration-300 px-8 py-3 rounded-full glass-dark border border-white/5 hover:border-white/20">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
