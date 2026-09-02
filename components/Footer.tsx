"use client";

import { FaFacebook, FaLinkedin, FaEnvelope } from "react-icons/fa";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import MagicButton from "./MagicButton";
import { motion } from "framer-motion";
import Image from "next/image";
import { HOSTINGER_PARTNER } from "@/constants";

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
    <footer className="w-full bg-black-100 text-white relative py-24 pb-12 border-t border-white/5">
      <div className="absolute bottom-0 left-0 w-full h-[50%] lighting-radial opacity-10 pointer-events-none" />

      <div className="wrapper relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md"
        >
          <div className="mb-4">
            <Image
              src="/assets/images/logo.png"
              width={200}
              height={80}
              alt="ArtistyCode Studio logo"
              className="brightness-110 contrast-125"
            />
          </div>

          <p className="text-sm md:text-base text-white/40 leading-relaxed font-light mb-6">
            Innovating Beyond Boundaries. We architect and engineer enterprise-grade
            digital solutions for the world&apos;s most ambitious visionaries.
          </p>

          {/* Official Hostinger Partner Mini Badge */}
          <a
            href={HOSTINGER_PARTNER.referralUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3.5 px-4 py-2.5 rounded-2xl glass border border-purple-500/20 hover:border-purple-500/40 bg-purple-950/20 hover:bg-purple-900/30 transition-all duration-300"
          >
            <div className="relative w-28 h-7 shrink-0">
              <Image
                src={HOSTINGER_PARTNER.bannerImages.brandDark320}
                alt="Hostinger Partner Badge"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col border-l border-white/10 pl-3">
              <span className="text-[10px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1">
                Official Partner
                <ArrowUpRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <span className="text-[11px] text-white/60">
                Code <strong className="text-white font-mono">{HOSTINGER_PARTNER.couponCode}</strong> for 20% OFF
              </span>
            </div>
          </a>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 w-full md:w-auto"
        >
          <a
            href="mailto:contact@artistycode.studio"
            className="group"
          >
            <MagicButton
              title="Work with us"
              icon={<FaEnvelope />}
              position="right"
            />
          </a>
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="wrapper relative z-10 mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8"
      >
        <div className="flex flex-col md:flex-row items-center gap-6">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/30 font-bold">
            &copy; {new Date().getFullYear()} <a href="/dashboard" target="_blank" className="hover:text-white transition-colors">ArtistyCode Studio</a>
          </p>
          <div className="hidden md:block w-1 h-1 rounded-full bg-white/10" />
          <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/30 font-bold">
            All Rights Reserved
          </p>
        </div>

        <div className="flex items-center gap-4">
          {socialMedia.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-lg glass border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
            >
              <span className="text-white/40 group-hover:text-white transition-colors text-lg">
                {item.icon}
              </span>
            </a>
          ))}
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
