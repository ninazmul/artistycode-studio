"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy, Sparkles, ShieldCheck, Zap, Globe, Server } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { HOSTINGER_PARTNER } from "@/constants";

export default function Promotion() {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(HOSTINGER_PARTNER.couponCode);
    setCopied(true);
    toast.success("Coupon code ACSTUDIO copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="promotion" className="py-24 bg-black-100 text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl p-8 sm:p-10 md:p-14 lg:p-16 border border-white/15 bg-gradient-to-br from-white/[0.07] via-white/[0.03] to-white/[0.01] backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          {/* Top highlight shimmer */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/40 to-transparent" />

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Partner Badge Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full glass border border-purple-500/30 bg-purple-500/10 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[11px] font-bold tracking-[0.25em] text-purple-200 uppercase">
                  OFFICIAL HOSTINGER PARTNER
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] italic mb-5">
                GET UP TO <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-200 to-pink-300">20% DISCOUNT</span> ON HOSTINGER
              </h2>

              <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-xl">
                Deploy your next web application, portfolio, or enterprise solution on ultra-fast, secure hosting. Use our official referral link or coupon code to unlock up to <strong>20% off</strong> your first purchase.
              </p>

              {/* Value Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 w-full max-w-xl">
                <div className="flex items-center gap-2 text-xs text-white/80 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5">
                  <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>Free Domain & SSL</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>NVMe Ultra Speed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5">
                  <Server className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>99.9% Uptime SLA</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>24/7 Priority Support</span>
                </div>
                <div className="col-span-2 sm:col-span-2 flex items-center gap-2 text-xs text-white/80 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2.5">
                  <Sparkles className="w-4 h-4 text-pink-400 shrink-0" />
                  <span>Optimized for WordPress & Next.js</span>
                </div>
              </div>

              {/* Coupon Code Box & Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full">
                {/* Coupon Copy Pill */}
                <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/[0.06] border border-purple-400/30 hover:border-purple-400/50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-purple-300">
                      Coupon Code
                    </span>
                    <span className="font-mono text-base font-black tracking-wider text-white">
                      {HOSTINGER_PARTNER.couponCode}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/40 text-purple-200 text-xs font-semibold transition-all active:scale-95"
                    title="Copy coupon code"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Primary CTA Button */}
                <a
                  href={HOSTINGER_PARTNER.referralUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Claim 20% Discount</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right Card / Official Badge Graphic */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <a
                href={HOSTINGER_PARTNER.referralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full max-w-sm relative rounded-2xl glass p-6 border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-purple-400/40 transition-all duration-500 flex flex-col items-center text-center shadow-xl"
              >
                {/* Official Hostinger Partner Banner Badge */}
                <div className="relative w-full max-w-[280px] h-[105px] mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  <Image
                    src={HOSTINGER_PARTNER.bannerImages.brandDark640}
                    alt="Hostinger Official Partner Badge"
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    className="object-contain drop-shadow-[0_8px_24px_rgba(109,40,217,0.35)]"
                    priority={false}
                  />
                </div>

                <div className="w-full pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/40">
                      EXCLUSIVE DEAL
                    </p>
                    <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                      Up to 20% OFF First Order
                    </p>
                  </div>

                  <div className="w-9 h-9 rounded-full bg-white/10 group-hover:bg-purple-600 flex items-center justify-center transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 text-white group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}