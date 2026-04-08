import { FaFacebook, FaLinkedin, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import MagicButton from "../MagicButton";

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
      className="w-full bg-black text-white relative py-20 px-6"
      id="contact"
    >
      {/* CTA Section */}
      <div className="flex flex-col items-center max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-5xl font-semibold">
          Ready to take <span className="text-white">your</span> digital
          presence to the next level?
        </h1>
        <p className="mt-5 md:mt-8 text-white/60 text-sm md:text-base">
          Get in touch today, and let's explore how we can help you achieve your
          goals.
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-8">
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
      <div className="flex flex-col md:flex-row justify-between items-center mt-16 max-w-6xl mx-auto gap-4">
        <p className="text-sm md:text-base text-white/50">
          &copy; {new Date().getFullYear()} ArtistyCode Studio
        </p>

        <div className="flex items-center gap-4 md:gap-3">
          {socialMedia.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-white/20 hover:bg-white/10 transition"
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
