/**
 * Beautiful animated background for waitlist page (earthy theme)
 * Features warm gradient mesh, floating animated orbs, and subtle parallax effects
 * Performance-optimized with GPU-accelerated transforms
 */

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { gradients } from "../../lib/glassmorphism";

interface FloatingOrb {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  color: string;
}

const generateOrbs = (count: number = 8): FloatingOrb[] => {
  const colors = [
    "from-[#D4920B]/20 to-[#F5E6C8]/10",
    "from-[#C67B5C]/20 to-[#F5EDE3]/10",
    "from-[#8BA888]/15 to-[#E8F0E6]/8",
    "from-[#C4A0A0]/15 to-[#F5EDE3]/8",
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 150 + 50, // 50-200px
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 15, // 15-23s
    delay: Math.random() * 5,
    color: colors[i % colors.length],
  }));
};

interface AnimatedBackgroundProps {
  parallaxIntensity?: number;
}

const AnimatedBackground = ({ parallaxIntensity = 0.5 }: AnimatedBackgroundProps) => {
  const [orbs, setOrbs] = useState<FloatingOrb[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize orbs on mount
  useEffect(() => {
    setOrbs(generateOrbs(8));
  }, []);

  // Handle parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY * parallaxIntensity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [parallaxIntensity]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 -z-10 overflow-hidden ${gradients.hero}`}
      style={{ transform: `translateY(${scrollY}px)` }}
    >
      {/* Gradient Mesh Background */}
      <div className={`absolute inset-0 ${gradients.mesh}`} />

      {/* Floating Orbs with animation */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full blur-3xl pointer-events-none will-change-transform`}
          style={{
            width: orb.size,
            height: orb.size,
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            backgroundImage: `conic-gradient(from 0deg, rgb(212, 146, 11, 0.15), rgb(198, 123, 92, 0.15), rgb(139, 115, 85, 0.1))`,
          }}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Static gradient overlays for depth */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-[#D4920B]/8 via-transparent to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-[#C67B5C]/8 via-transparent to-transparent pointer-events-none" />

      {/* Subtle vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#3D2B1F]/5 pointer-events-none" />
    </div>
  );
};

export default AnimatedBackground;
