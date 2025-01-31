import {
  FaGithub,
  FaFacebook,
  FaLinkedin,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import MagicButton from "./MagicButton";
import Image from "next/image";

export const socialMedia = [
  {
    id: 1,
    icon: <FaGithub />,
    link: "https://github.com/ninazmul",
  },
  {
    id: 2,
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/in/ninazmul",
  },
  {
    id: 3,
    icon: <FaFacebook />,
    link: "https://www.facebook.com/ArtistyCodeStudio",
  },
];

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      {/* background grid */}
      <div className="w-full absolute left-0 -bottom-72 min-h-96">
        <Image
          src="/footer-grid.svg"
          alt="grid"
          width={500}
          height={500}
          className="w-full h-full opacity-50 "
        />
      </div>

      <div className="flex flex-col items-center">
        <h1 className="heading lg:max-w-[45vw]">
          Ready to take <span className="text-purple">your</span> digital
          presence to the next level?
        </h1>
        <p className="text-white-200 md:mt-10 my-5 text-center">
          Get in touch today, and let&apos;s explore how the agency can help you
          achieve your goals.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-5">
          <a href="mailto:artistycodestudio@gmail.com">
            <MagicButton
              title="Contact via Email"
              icon={<FaEnvelope />}
              position="right"
            />
          </a>

          <a
            href="https://wa.me/+8801580845746"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MagicButton
              title="Chat on WhatsApp"
              icon={<FaWhatsapp />}
              position="right"
            />
          </a>
        </div>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center gap-5">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2025 ArtistyCode Studio
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <a
              key={info.id}
              href={info.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              {info.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
