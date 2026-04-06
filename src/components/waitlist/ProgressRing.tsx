import React, { useMemo } from "react";
import { motion } from "motion/react";

interface ProgressRingProps {
  currentPoints: number;
  nextTierPoints: number;
  nextTierName: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  currentPoints,
  nextTierPoints,
  nextTierName,
}) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const percentage = Math.min(
    (currentPoints / nextTierPoints) * 100,
    100
  );
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Determine color gradient based on progress percentage
  const getColorGradient = () => {
    if (percentage < 25) {
      return {
        from: "#60a5fa", // calm blue
        to: "#3b82f6",
        gradientId: "gradient-blue",
      };
    } else if (percentage < 50) {
      return {
        from: "#fbbf24", // warm amber
        to: "#f59e0b",
        gradientId: "gradient-amber",
      };
    } else if (percentage < 75) {
      return {
        from: "#fb923c", // energetic orange
        to: "#f97316",
        gradientId: "gradient-orange",
      };
    } else {
      return {
        from: "#4ade80", // glowing green
        to: "#22c55e",
        gradientId: "gradient-green",
      };
    }
  };

  const colorGradient = useMemo(() => getColorGradient(), [percentage]);
  const remainingPoints = Math.max(0, nextTierPoints - currentPoints);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
      <motion.div
        className="relative w-72 h-72 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* SVG Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 200 200">
          <defs>
            <linearGradient
              id={colorGradient.gradientId}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={colorGradient.from} />
              <stop offset="100%" stopColor={colorGradient.to} />
            </linearGradient>

            {/* Pulse animation for near-complete */}
            {percentage > 75 && (
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            )}
          </defs>

          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="8"
          />

          {/* Progress circle */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={`url(#${colorGradient.gradientId})`}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            filter={percentage > 75 ? "url(#glow)" : undefined}
          />

          {/* Pulse effect when near completion */}
          {percentage > 75 && (
            <motion.circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={colorGradient.from}
              strokeWidth="8"
              opacity="0"
              animate={{
                r: [radius, radius + 8],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          )}
        </svg>

        {/* Center content */}
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {/* Percentage or status */}
          <motion.div
            className="mb-2"
            key={Math.floor(percentage)}
          >
            <div className="text-5xl font-bold text-white">
              {Math.round(percentage)}%
            </div>
          </motion.div>

          {/* Points text */}
          <div className="text-white/70 text-sm mb-4">
            <motion.span
              key={remainingPoints}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {remainingPoints} pts to {nextTierName}
            </motion.span>
          </div>

          {/* Status badge */}
          {percentage >= 100 ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="inline-block px-4 py-1 bg-green-500/20 border border-green-500 text-green-300 text-xs font-semibold rounded-full"
            >
              ✓ Ready to Unlock!
            </motion.div>
          ) : percentage >= 75 ? (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-block px-4 py-1 bg-orange-500/20 border border-orange-500 text-orange-300 text-xs font-semibold rounded-full"
            >
              Almost there! 🔥
            </motion.div>
          ) : (
            <div className="inline-block px-4 py-1 bg-blue-500/20 border border-blue-500 text-blue-300 text-xs font-semibold rounded-full">
              Keep going!
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Progress breakdown */}
      <motion.div
        className="mt-8 w-full p-4 bg-white/5 backdrop-blur border border-white/10 rounded-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="text-sm text-white/60 mb-2">Progress Breakdown</div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/70">
            <span className="font-bold text-white">{currentPoints}</span> pts
          </span>
          <div className="flex-1 mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-400 to-green-400 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <span className="text-sm text-white/70">
            <span className="font-bold text-white">{nextTierPoints}</span> pts
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressRing;
