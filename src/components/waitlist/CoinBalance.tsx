import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

export interface CoinBalanceProps {
  coins: number;
}

export default function CoinBalance({ coins }: CoinBalanceProps) {
  const [displayCoins, setDisplayCoins] = useState(coins);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (coins !== displayCoins) {
      setIsAnimating(true);

      const difference = coins - displayCoins;
      const steps = Math.abs(difference);
      const stepValue = difference > 0 ? 1 : -1;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        if (currentStep >= steps) {
          setDisplayCoins(coins);
          setIsAnimating(false);
          clearInterval(interval);
        } else {
          setDisplayCoins(prev => prev + stepValue);
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [coins, displayCoins]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-2 px-4 py-2 bg-[#f3ebf8] border border-[#8861d4]/30 rounded-full"
    >
      {/* Coin icon */}
      <motion.div
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3, repeat: isAnimating ? Infinity : 0 }}
        className="flex items-center justify-center w-6 h-6 rounded-full bg-[#8861d4]"
      >
        <span className="text-white font-sans font-bold text-sm">S</span>
      </motion.div>

      {/* Coin count */}
      <motion.span
        key={displayCoins}
        initial={isAnimating ? { y: -10, opacity: 0 } : {}}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="font-semibold text-[#8861d4] text-sm whitespace-nowrap"
      >
        {displayCoins}
      </motion.span>

      {/* Label */}
      <span className="text-xs font-medium text-gray-500 hidden sm:inline">
        coins
      </span>
    </motion.div>
  );
}
