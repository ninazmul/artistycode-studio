import { FaLocationArrow } from "react-icons/fa6";
import MagicButton from "./MagicButton";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Content */}
      <div className="relative z-10 flex justify-center my-10">
        <div className="flex flex-col items-center justify-center max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] text-center">
          <p className="uppercase tracking-widest text-xs text-blue-100 max-w-80">
            Dynamic Software Magic with ArtistyCode Studio
          </p>

          <TextGenerateEffect
            words="Transforming Ideas into Seamless Digital Solutions"
            className="text-[32px] sm:text-[36px] md:text-5xl lg:text-6xl font-bold leading-tight"
          />

          <p className="mt-4 mb-6 text-sm md:text-lg lg:text-2xl md:tracking-wider">
            Welcome to ArtistyCode Studio! We specialize in creating innovative
            web apps, mobile apps, and games, all powered by the latest
            technology. Let’s bring your ideas to life with creativity,
            precision, and expertise!
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
