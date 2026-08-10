"use client";

import { useEffect } from "react";

interface AdSenseProps {
  style?: React.CSSProperties;
  className?: string;
  slot?: string;
  format?: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal";
  responsive?: "true" | "false";
  layoutKey?: string;
  showLabel?: boolean;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdSense({
  style = { display: "block" },
  className = "",
  slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || "5657308865",
  format = "auto",
  responsive = "true",
  layoutKey,
  showLabel = true,
}: AdSenseProps) {
  const clientId =
    process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-1213821838926371";

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  if (!clientId || !slot) {
    return null;
  }

  return (
    <div
      className={`adsense-wrapper relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 my-12 ${className}`}
    >
      <div className="glass rounded-2xl p-4 md:p-6 border border-white/10 bg-black-200/40 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
        {showLabel && (
          <span className="text-[9px] uppercase tracking-[0.3em] font-semibold text-white/30 mb-3 select-none">
            ADVERTISEMENT
          </span>
        )}
        <div className="w-full min-h-[90px] flex items-center justify-center overflow-hidden">
          <ins
            className="adsbygoogle"
            style={style}
            data-ad-client={clientId}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={responsive}
            {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
          />
        </div>
      </div>
    </div>
  );
}
