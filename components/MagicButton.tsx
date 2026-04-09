import React from "react";

const MagicButton = ({
  title,
  icon,
  position,
  handleClick,
  otherClasses = "",
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  handleClick?: () => void;
  otherClasses?: string;
}) => {
  return (
    <button
      onClick={handleClick}
      className={`
        group relative inline-flex items-center justify-center
        h-12 w-full md:w-60
        rounded-md border border-white/20
        bg-black text-white
        px-6 text-sm font-medium
        transition-all duration-300
        hover:border-white hover:bg-white hover:text-black
        ${otherClasses}
      `}
    >
      <span className="flex items-center gap-2">
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>

      {/* subtle glow (no animation, GPU safe) */}
      <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition duration-300 border border-white/40" />
    </button>
  );
};

export default MagicButton;
