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
    name: "LinkedIn",
    icon: <FaLinkedin />,
    link: "https://www.linkedin.com/company/artistycode-studio",
  },
  {
    id: 2,
    name: "Facebook",
    icon: <FaFacebook />,
    link: "https://www.facebook.com/ArtistyCodeStudio",
  },
];

const navigationLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Buy Code", href: "/resources" },
  { label: "Blog", href: "/blog" },
  { label: "Contact Us", href: "/contact" },
];

const capabilities = [
  "Next.js Enterprise Apps",
  "React Native Systems",
  "Cloud & DevOps Architecture",
  "Custom AI Agents & LLMs",
  "Design Systems & UI/UX",
];

const Footer = () => {
  return (
    <footer className="w-full bg-black-100 text-white relative py-20 pb-12 border-t border-white/5">
      <div className="absolute bottom-0 left-0 w-full h-[50%] lighting-radial opacity-10 pointer-events-none" />

      <div className="wrapper relative z-10 flex flex-col gap-16">
        {/* Top Grid: Brand, Navigation, Capabilities, CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <div className="mb-5">
              <Image
                src="/assets/images/logo.png"
                width={190}
                height={75}
                alt="ArtistyCode Studio logo"
                className="brightness-110 contrast-125"
              />
            </div>

            <p className="text-xs sm:text-sm text-white/50 leading-relaxed font-light mb-6 max-w-sm">
              Innovating Beyond Boundaries. We architect and engineer enterprise-grade
              digital systems for ambitious global businesses.
            </p>

            {/* Official Hostinger Partner Mini Badge */}
            <a
              href={HOSTINGER_PARTNER.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-3.5 py-2.5 rounded-2xl glass border border-purple-500/25 hover:border-purple-500/50 bg-purple-950/20 hover:bg-purple-900/30 transition-all duration-300 shadow-md"
            >
              <div className="relative w-24 h-6 shrink-0">
                <Image
                  src={HOSTINGER_PARTNER.bannerImages.brandDark320}
                  alt="Hostinger Partner Badge"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col border-l border-white/10 pl-2.5">
                <span className="text-[9px] font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1">
                  Official Partner
                  <ArrowUpRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <span className="text-[10px] text-white/60">
                  Code <strong className="text-white font-mono">{HOSTINGER_PARTNER.couponCode}</strong> (20% OFF)
                </span>
              </div>
            </a>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-white/40 mb-1">
              Navigation
            </p>
            {navigationLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs text-white/50 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Capabilities */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-white/40 mb-1">
              Capabilities
            </p>
            {capabilities.map((cap) => (
              <span
                key={cap}
                className="text-xs text-white/50 cursor-default"
              >
                {cap}
              </span>
            ))}
          </div>

          {/* CTA & Contact */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <p className="text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-white/40 mb-1">
              Let&apos;s Build Together
            </p>
            <p className="text-xs text-white/50 leading-relaxed font-light">
              Ready to engineer your next platform? Book a direct architecture briefing.
            </p>
            <Link href="/contact">
              <MagicButton
                title="Start Collaboration"
                icon={<FaEnvelope />}
                position="right"
              />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
              &copy; {new Date().getFullYear()}{" "}
              <a href="/dashboard" target="_blank" className="hover:text-white transition-colors">
                ArtistyCode Studio
              </a>
            </p>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20" />
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 font-semibold">
              Enterprise Software Engineering
            </p>
          </div>

          <div className="flex items-center gap-3">
            {socialMedia.map((item) => (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg glass border border-white/5 hover:border-white/20 hover:bg-white/[0.05] transition-all duration-300 group"
                title={item.name}
              >
                <span className="text-white/40 group-hover:text-white transition-colors text-base">
                  {item.icon}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
