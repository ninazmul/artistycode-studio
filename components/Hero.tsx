import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      {/* Content */}
      <div className="relative z-10 flex justify-center py-20">
        <div className="flex flex-col items-center justify-center max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] text-center">
          <p className="uppercase tracking-[0.3em] text-xs text-gray-400 mb-6">
            ArtistyCode Studio · Software Development Excellence
          </p>

          <TextGenerateEffect
            words="Engineering Precision. Delivering Innovation."
            className="text-[32px] sm:text-[38px] md:text-5xl lg:text-6xl font-extrabold leading-tight"
          />

          <p className="mt-8 mb-10 text-sm md:text-lg lg:text-xl md:tracking-wide text-gray-300 max-w-2xl">
            We craft enterprise-grade web platforms, mobile applications, and
            digital ecosystems. Every solution is built with geometric clarity,
            seamless UX, and cutting-edge technology— designed to empower
            businesses and inspire trust worldwide.
          </p>

          <a href="#projects" aria-label="Explore our portfolio">
            <MagicButton
              title="Explore Portfolio"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
