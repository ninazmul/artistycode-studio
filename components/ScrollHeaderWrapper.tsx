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

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures the listener is added only once

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
