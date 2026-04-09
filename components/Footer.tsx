import { FaFacebook, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import MagicButton from "./MagicButton";

export const socialMedia = [
  {
    id: 1,
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/company/artistycode-studio",
  },
  {
    id: 2,
    icon: <FaFacebook />,
    link: "https://www.facebook.com/ArtistyCodeStudio",
  },
];

const Footer = () => {
  return (
    <footer
      className="w-full bg-black text-white relative py-20 px-6 border-t border-white/10"
      id="contact"
    >
      {/* CTA Section */}
      <div className="flex flex-col items-center max-w-3xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-100 to-gray-400">
          Ready to Elevate Your Digital Presence?
        </h1>
        <p className="mt-5 md:mt-8 text-white/60 text-sm md:text-base max-w-xl">
          Partner with ArtistyCode Studio to craft enterprise‑grade solutions
          that inspire trust and deliver innovation.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-10">
          <a
            href="mailto:contact@artistycode.studio"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MagicButton
              title="Email Us"
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
              title="WhatsApp"
              icon={<FaWhatsapp />}
              position="right"
            />
          </a>
        </div>
      </div>

      {/* Social + Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-16 max-w-6xl mx-auto gap-6 border-t border-white/10 pt-8">
        <a
          href="/dashboard"
          target="_blank"
          className="text-sm md:text-base text-white/50 hover:text-white transition"
        >
          &copy; {new Date().getFullYear()} ArtistyCode Studio · All Rights
          Reserved
        </a>

        <div className="flex items-center gap-4 md:gap-5">
          {socialMedia.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-md border border-white/20 hover:border-white/40 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 transition"
            >
              {item.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
