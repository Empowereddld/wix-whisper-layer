/**
 * Earthy card wrapper component
 * Provides warm, feminine styling with optional hover and glow effects
 */

import { motion } from "motion/react";
import { glass } from "../../lib/glassmorphism";
import { ReactNode } from "react";

interface GlassCardProps {
  variant?: "default" | "accent" | "warm";
  hover?: boolean;
  glow?: boolean;
  className?: string;
  children: ReactNode;
}

const getVariantClass = (variant: "default" | "accent" | "warm"): string => {
  switch (variant) {
    case "accent":
      return glass.cardPurple;
    case "warm":
      return glass.cardDark;
    case "default":
    default:
      return glass.card;
  }
};

const getGlowColor = (variant: "default" | "accent" | "warm"): string => {
  switch (variant) {
    case "accent":
      return "from-[#8861d4]/20 to-[#f3ebf8]/10";
    case "warm":
      return "from-[#7451c4]/15 to-[#f3ebf8]/10";
    case "default":
    default:
      return "from-[#8861d4]/15 to-[#7451c4]/10";
  }
};

const GlassCard = ({
  variant = "default",
  hover = false,
  glow = false,
  className = "",
  children,
}: GlassCardProps) => {
  const variantClass = getVariantClass(variant);
  const glowColor = getGlowColor(variant);

  return (
    <motion.div
      className="relative"
      whileHover={hover ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Glow effect behind card */}
      {glow && (
        <div
          className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${glowColor} blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
          aria-hidden="true"
        />
      )}

      {/* Card content */}
      <div className={`relative ${variantClass} ${hover ? "cursor-pointer" : ""} ${className}`}>
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;
