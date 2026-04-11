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
        className={`fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl z-50 transition-all duration-500 premium:ease-premium px-5 md:px-10 ${
          showHeader ? "translate-y-0" : "-translate-y-full opacity-0"
        } ${isScrolled ? "pt-4" : "pt-8"}`}
      >
        <div 
          className={`glass rounded-2xl transition-all duration-500 premium:ease-premium ${
            isScrolled ? "py-3 px-6 shadow-2xl bg-black-200/80" : "py-5 px-8 shadow-none bg-transparent border-transparent"
          }`}
        >
          {children}
        </div>
      </div>
      {/* Spacer removed for floating effect, or keep a small one if needed */}
    </>
  );
}
