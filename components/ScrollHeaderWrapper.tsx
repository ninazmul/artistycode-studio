"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function ScrollHeaderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Shrink logic
        setIsScrolled(currentScrollY > 50);

        // Hide/Show logic
        if (currentScrollY > lastScrollY.current && currentScrollY > 300) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });

      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <>
      <div
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl z-50 transition-all duration-500 ease-premium px-3.5 sm:px-6 md:px-10 ${
          showHeader ? "translate-y-0" : "-translate-y-full opacity-0"
        } ${isScrolled ? "pt-2 sm:pt-3 md:pt-4" : "pt-3 sm:pt-5 md:pt-7"}`}
      >
        <div 
          className={`rounded-2xl transition-all duration-500 ease-premium ${
            isScrolled 
              ? "glass py-2.5 px-4 sm:py-3 sm:px-6 md:px-8 shadow-2xl bg-black-200/90 border-white/10 backdrop-blur-xl" 
              : "py-2.5 px-4 sm:py-3.5 sm:px-6 md:py-4 md:px-8 glass bg-black-200/40 sm:bg-transparent border-white/10 sm:border-transparent backdrop-blur-md sm:backdrop-blur-none"
          }`}
        >
          {children}
        </div>
      </div>
    </>
  );
}
