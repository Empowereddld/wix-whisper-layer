import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Clock, Zap } from "lucide-react";

interface LaunchCountdownProps {
  launchDate?: string;
}

interface TimeUnits {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const LaunchCountdown: React.FC<LaunchCountdownProps> = ({ launchDate }) => {
  const [timeUnits, setTimeUnits] = useState<TimeUnits>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    if (!launchDate) {
      setHasLaunched(false);
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetDate = new Date(launchDate).getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        setHasLaunched(true);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeUnits({
        days,
        hours,
        minutes,
        seconds,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [launchDate]);

  if (!launchDate) {
    // Coming Soon state
    return (
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative rounded-3xl overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-red-600" />
          <motion.div
            className="absolute inset-0 opacity-50"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1), transparent 50%)",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Pulse overlay */}
          <motion.div
            className="absolute inset-0 bg-white/10"
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-12 text-center">
            <motion.div
              className="mb-6"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Clock className="w-16 h-16 mx-auto text-white" />
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-4">Coming Soon</h2>
            <p className="text-white/80 text-lg mb-8">
              Story Pros is being crafted with care. Lock in your position
              on the waitlist to be first in line when we launch!
            </p>

            {/* Animated text */}
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block px-6 py-3 bg-white/10 backdrop-blur border border-white/20 rounded-2xl"
            >
              <span className="text-white font-semibold">✨ Launch date coming soon ✨</span>
            </motion.div>

            {/* Features list */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {[
                "Personalized Stories",
                "Learning Pathways",
                "Community Rewards",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-2 text-white/80">
                    <span className="text-lg">✓</span>
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (hasLaunched) {
    return (
      <motion.div
        className="w-full max-w-2xl mx-auto"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative rounded-3xl overflow-hidden">
          {/* Celebratory background */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-cyan-600" />
          <motion.div
            className="absolute inset-0 opacity-50"
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2), transparent 70%)",
              backgroundSize: "200% 200%",
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-12 text-center">
            <motion.div
              className="mb-6 text-6xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🎉
            </motion.div>

            <h2 className="text-4xl font-bold text-white mb-4">
              We've Launched!
            </h2>
            <p className="text-white/90 text-lg">
              Story Pros is now live. Thank you for being part of this
              journey from the beginning!
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Active countdown
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          Launch Countdown
        </h2>
        <p className="text-white/60">
          Lock in your position before Story Pros launches!
        </p>
      </div>

      {/* Countdown grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Days", value: timeUnits.days },
          { label: "Hours", value: timeUnits.hours },
          { label: "Minutes", value: timeUnits.minutes },
          { label: "Seconds", value: timeUnits.seconds },
        ].map((unit, index) => (
          <motion.div
            key={unit.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            {/* Card */}
            <div className="relative rounded-2xl overflow-hidden h-full">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 backdrop-blur border border-white/20" />

              {/* Flip animation on value change */}
              <motion.div
                className="relative z-10 p-6 flex flex-col items-center justify-center h-full"
                key={unit.value}
                initial={{ rotateX: 90, opacity: 0 }}
                animate={{ rotateX: 0, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {String(unit.value).padStart(2, "0")}
                </div>

                {/* Label */}
                <div className="text-sm text-white/70 font-medium uppercase tracking-wider">
                  {unit.label}
                </div>
              </motion.div>

              {/* Animated border */}
              {unit.value > 0 && (
                <motion.div
                  className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-border pointer-events-none"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Call to action */}
      <motion.div
        className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur border border-white/20 rounded-2xl text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-yellow-300" />
          <span className="text-white font-semibold">
            Don't miss out on launch day!
          </span>
        </div>
        <p className="text-white/70 text-sm">
          Your spot on the waitlist gets you early access and exclusive rewards.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-white/60 text-sm">
          Get ready for something amazing. We're building Story Pros with
          care.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LaunchCountdown;
