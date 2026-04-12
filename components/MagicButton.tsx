"use client";

import React, { forwardRef } from "react";

interface MagicButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
  position?: "left" | "right";
  otherClasses?: string;
}

const MagicButton = forwardRef<HTMLButtonElement, MagicButtonProps>(
  (
    {
      title,
      icon,
      position = "right",
      otherClasses = "",
      className = "",
      ...props // 👈 THIS is critical (includes onClick from SheetTrigger)
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        {...props} // 👈 merges Radix events + your events
        className={`
          group relative inline-flex items-center justify-center
          h-12 md:h-14 w-full md:w-auto md:min-w-[14rem]
          rounded-lg border border-white/10
          bg-black-100 text-white
          px-6 md:px-10 text-[xs] md:text-sm font-bold uppercase tracking-[0.2em]
          transition-all duration-500 ease-premium
          hover:border-white/20 hover:bg-white hover:text-black
          shadow-inner-glow hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
          active:scale-95
          ${otherClasses}
          ${className}
        `}
      >
        <span className="relative z-10 flex items-center gap-3">
          {position === "left" && icon}
          <span className="tracking-widest uppercase">{title}</span>
          {position === "right" && icon}
        </span>

        {/* metallic shine layer */}
        <span className="absolute inset-0 rounded-lg bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition duration-500" />
      </button>
    );
  }
);

MagicButton.displayName = "MagicButton";

export default MagicButton;