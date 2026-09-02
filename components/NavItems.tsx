"use client";

import { headerLinks } from "@/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavItemsProps {
  onItemSelected?: () => void;
}

const NavItems = ({ onItemSelected }: NavItemsProps) => {
  const pathname = usePathname();

  return (
    <ul className="flex w-full flex-col items-start gap-2 lg:flex-row lg:items-center lg:gap-1.5">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route;

        return (
          <li key={link.route} className="relative w-full lg:w-auto">
            <Link
              href={link.route}
              onClick={onItemSelected}
              className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 ${
                isActive
                  ? "text-white bg-white/[0.08] border border-white/15 shadow-inner-glow"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              )}
              <span>{link.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default NavItems;
