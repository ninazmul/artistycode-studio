"use client";

import { useState, useEffect, useRef } from "react";

export default function ScrollHeaderWrapper({
  children,
  headerHeight = 144,
}: {
  children: React.ReactNode;
  headerHeight?: number;
}) {
  const [showHeader, setShowHeader] = useState(true);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

      scrollTimeout.current = setTimeout(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY.current && currentScrollY > 300) {
          setShowHeader(false);
        } else {
          setShowHeader(true);
        }

        lastScrollY.current = currentScrollY;
      }, 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <div
        className={`fixed top-0 left-0 w-full transition-transform duration-300 z-50 ${
          showHeader
            ? "transform translate-y-0 shadow-black/20 shadow-lg"
            : "transform -translate-y-full"
        }`}
      >
        {children}
      </div>
      {/* Spacer to account for the header height */}
      <div
        style={{ height: showHeader ? `${headerHeight}px` : "0px" }}
        className="transition-all duration-300"
      />
    </div>
  );
}
