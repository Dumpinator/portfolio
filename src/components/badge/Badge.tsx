import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  className?: string;
  darkMode?: boolean;
  isActive?: boolean;
};

const colorMap = {
  blue: {
    bg: "bg-blue-950/60",
    text: "text-blue-300/70",
    border: "before:border-blue-400/20 hover:before:border-blue-400/40",
  },
  yellow: {
    bg: "bg-yellow-100/60",
    text: "text-yellow-600/70",
    border: "before:border-yellow-400/20 hover:before:border-yellow-400/40",
  },
} as const;

const Badge: React.FC<BadgeProps> = ({ children, darkMode = true }) => {
  const scheme = darkMode ? colorMap.blue : colorMap.yellow;

  return (
    <div
      className={`
        relative
        flex justify-center items-center
        m-0.5
        px-2
        pb-0.5
        text-xs
        font-medium
        rounded-full
        ${scheme.bg}
        border
        border-transparent
        before:absolute
        before:-inset-0.5
        before:rounded-full
        before:border-2
        before:animate-border-pulse
        transition-all
        duration-300
        ${scheme.text}
        ${scheme.border}
      `}
    >
      {children}
    </div>
  );
};

export default Badge;
