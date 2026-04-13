import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export interface CoinDropAnimationProps {
  amount: number;
  trigger: boolean;
  onComplete: () => void;
}

export default function CoinDropAnimation({
  amount,
  trigger,
  onComplete,
}: CoinDropAnimationProps) {
  useEffect(() => {
    if (trigger) {
      const timer = setTimeout(() => {
        onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  const coinElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    startX: Math.random() * 100 - 50,
    duration: 2 + Math.random() * 0.5,
    delay: Math.random() * 0.3,
  }));

  return (
    <AnimatePresence>
      {trigger && (
        <div className="fixed inset-0 pointer-events-none">
          {/* Main celebration text */}
          <motion.div
            initial={{ opacity: 0, scale: 0, y: -100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
          >
            <motion.h2
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
              }}
              className="font-sans text-4xl sm:text-5xl font-bold text-[#8861d4] drop-shadow-lg"
            >
              +{amount} Coins!
            </motion.h2>
          </motion.div>

          {/* Falling coins */}
          {coinElements.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{
                opacity: 1,
                x: coin.startX,
                y: -200,
                rotate: 0,
              }}
              animate={{
                opacity: 0,
                x: coin.startX + 50,
                y: window.innerHeight + 200,
                rotate: 720,
              }}
              transition={{
                duration: coin.duration,
                delay: coin.delay,
                ease: "easeIn",
              }}
              className="absolute left-1/2 top-0 -translate-x-1/2"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#8861d4] shadow-lg">
                <span className="text-white font-sans font-bold text-sm">S</span>
              </div>
            </motion.div>
          ))}

          {/* Sparkles */}
          {Array.from({ length: 12 }, (_, i) => ({
            id: `spark-${i}`,
            angle: (i / 12) * Math.PI * 2,
            distance: 80,
          })).map((spark) => (
            <motion.div
              key={spark.id}
              initial={{
                opacity: 1,
                x: Math.cos(spark.angle) * spark.distance,
                y: Math.sin(spark.angle) * spark.distance,
                scale: 1,
              }}
              animate={{
                opacity: 0,
                x: Math.cos(spark.angle) * spark.distance * 3,
                y: Math.sin(spark.angle) * spark.distance * 3,
                scale: 0,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="w-2 h-2 bg-[#f3ebf8] rounded-full shadow-sm"></div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
