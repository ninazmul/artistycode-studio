"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export default function ScrollHeaderWrapper({
  children,
  headerHeight = 144,
}: {
  children: React.ReactNode;
  headerHeight?: number;
}) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

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
    <div>
      <div
        className={`fixed top-0 left-0 w-full transition-transform duration-300 z-50 ${
          showHeader
            ? "translate-y-0 shadow-lg shadow-black/20"
            : "-translate-y-full"
        }`}
      >
        {children}
      </div>
      {/* Spacer to account for the header height */}
      <div
        style={{ height: headerHeight }}
        className={`transition-all duration-300 ${
          showHeader ? "h-[144px]" : "h-0"
        }`}
      />
    </div>
  );
}
