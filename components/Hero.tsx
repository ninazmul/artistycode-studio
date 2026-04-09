import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex justify-center my-10">
        <div className="flex flex-col items-center justify-center max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] text-center">
          <p className="uppercase tracking-widest text-sm md:text-lg lg:text-2xl text-blue-100 max-w-80">
            ArtistyCode Studio · Software Development Excellence
          </p>

          <TextGenerateEffect
            words="Engineering Precision. Delivering Innovation."
            className="text-[32px] sm:text-[38px] md:text-5xl lg:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-400"
          />

          <p className="mt-4 mb-6 text-sm md:text-lg lg:text-2xl md:tracking-wider">
            We craft enterprise-grade web platforms, mobile applications, and
            digital ecosystems. Every solution is built with geometric clarity,
            seamless UX, and cutting-edge technology— designed to empower
            businesses and inspire trust worldwide.
          </p>

          <a href="#projects" aria-label="Show my work">
            <MagicButton
              title="Show my work"
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
