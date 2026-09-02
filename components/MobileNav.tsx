"use client";

import Image from "next/image";
import { Menu, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import NavItems from "./NavItems";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { HOSTINGER_PARTNER } from "@/constants";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <nav className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="p-2 rounded-xl glass border border-white/10 text-white hover:bg-white/10 transition-colors">
          <Menu className="w-5 h-5 text-white" />
        </SheetTrigger>
        <SheetContent
          side="right"
          className="flex flex-col justify-between p-6 sm:p-8 bg-black-100/95 backdrop-blur-2xl border-l border-white/10 text-white w-5/6 max-w-sm"
        >
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 pt-2"
              onClick={handleClose}
            >
              <Image
                src="/assets/images/logo.png"
                alt="ArtistyCode Studio"
                width={150}
                height={35}
                className="w-auto h-8 object-contain brightness-110"
              />
            </Link>

            <div className="w-full h-px bg-white/10" />

            {/* Navigation links */}
            <div className="py-2">
              <NavItems onItemSelected={handleClose} />
            </div>
          </div>

          {/* Bottom drawer section */}
          <div className="pt-6 border-t border-white/10 flex flex-col gap-4">
            <a
              href={HOSTINGER_PARTNER.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClose}
              className="flex items-center justify-between p-3 rounded-xl glass border border-purple-500/30 bg-purple-950/20 text-xs"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300">Official Partner</span>
                <span className="text-white/80 font-medium">Get 20% OFF Hostinger</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-purple-400" />
            </a>

            <p className="text-[10px] text-white/30 uppercase tracking-widest text-center">
              © {new Date().getFullYear()} ArtistyCode Studio
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
