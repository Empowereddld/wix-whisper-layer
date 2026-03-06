import { cn } from "@/lib/utils";
import React from "react";

interface DotBackgroundProps {
  className?: string;
  dotColor?: string;
}

const DotBackground = ({ className, dotColor = "rgba(255,255,255,0.15)" }: DotBackgroundProps) => {
  return (
    <div
      className={cn("absolute inset-0 pointer-events-none", className)}
      style={{
        backgroundImage: `radial-gradient(${dotColor} 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
      }}
    />
  );
};

export { DotBackground };
