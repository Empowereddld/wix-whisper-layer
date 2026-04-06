/**
 * Reusable confetti celebration component
 * Generates particles with physics simulation and cleanup after animation
 */

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  rotation: number;
  size: number;
  life: number;
}

interface ConfettiEffectProps {
  trigger: boolean;
  mode?: "burst" | "rain" | "sides";
  particleCount?: number;
  duration?: number;
  onComplete?: () => void;
}

const COLORS = [
  "#a855f7", // purple-500
  "#ec4899", // pink-500
  "#f59e0b", // amber-500
  "#3b82f6", // blue-500
  "#10b981", // emerald-500
  "#8b5cf6", // violet-500
  "#f97316", // orange-500
  "#06b6d4", // cyan-500
];

const generateParticles = (
  count: number,
  mode: "burst" | "rain" | "sides"
): Particle[] => {
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    let x, y, vx, vy;

    switch (mode) {
      case "rain":
        // Particles fall from top
        x = Math.random() * 100;
        y = -10;
        vx = (Math.random() - 0.5) * 2;
        vy = Math.random() * 2 + 1;
        break;

      case "sides":
        // Particles from left and right edges
        x = Math.random() > 0.5 ? -10 : 110;
        y = Math.random() * 100;
        vx = (x < 0 ? 1 : -1) * (Math.random() * 3 + 2);
        vy = (Math.random() - 0.5) * 2;
        break;

      case "burst":
      default:
        // Particles burst from center
        const angle = (Math.PI * 2 * i) / count;
        const velocity = Math.random() * 5 + 3;
        x = 50;
        y = 50;
        vx = Math.cos(angle) * velocity;
        vy = Math.sin(angle) * velocity;
        break;
    }

    particles.push({
      id: i,
      x,
      y,
      vx,
      vy,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      size: Math.random() * 8 + 4, // 4-12px
      life: 1,
    });
  }

  return particles;
};

const ConfettiEffect = ({
  trigger,
  mode = "burst",
  particleCount = 60,
  duration = 3000,
  onComplete,
}: ConfettiEffectProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!trigger) return;

    setIsActive(true);
    const newParticles = generateParticles(particleCount, mode);
    setParticles(newParticles);

    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress >= 1) {
        setIsActive(false);
        setParticles([]);
        onComplete?.();
        return;
      }

      // Physics simulation
      const updatedParticles = newParticles.map((p) => {
        const newP = { ...p };
        const dt = 0.016; // ~60fps

        // Apply gravity
        newP.vy += 0.1 * dt;

        // Air resistance
        newP.vx *= 0.99;
        newP.vy *= 0.99;

        // Update position
        newP.x += newP.vx * dt;
        newP.y += newP.vy * dt;

        // Update rotation
        newP.rotation += 5;

        // Fade out
        newP.life = Math.max(0, 1 - progress);

        return newP;
      });

      setParticles(updatedParticles);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [trigger, mode, particleCount, duration, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              style={{
                position: "fixed",
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                borderRadius: "50%",
                opacity: particle.life,
                transform: `translate(-50%, -50%) rotate(${particle.rotation}deg)`,
                pointerEvents: "none",
                zIndex: 50,
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiEffect;
