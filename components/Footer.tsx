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
    <footer className="w-full bg-black text-white relative py-12 px-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left Section */}
        <div className="text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-semibold mb-2">
            ArtistyCode Studio
          </h2>
          <p className="text-sm text-white/60 max-w-md">
            Innovating Beyond Boundaries · Crafting enterprise-grade software
            solutions with precision and trust.
          </p>
        </div>

        {/* Contact Buttons */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
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

      {/* Bottom Bar */}
      <div className="max-w-6xl mx-auto mt-10 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/10 pt-6">
        <p className="text-xs md:text-sm text-white/50">
          &copy; {new Date().getFullYear()} <a href="/dashboard" target="_blank">ArtistyCode Studio</a> · All Rights
          Reserved
        </p>

        <div className="flex items-center gap-4">
          {socialMedia.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 flex items-center justify-center rounded-md border border-white/20 hover:border-white/40 hover:bg-white/10 transition"
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
