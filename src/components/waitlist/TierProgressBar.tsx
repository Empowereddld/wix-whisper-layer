import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface TierProgressBarProps {
  currentPoints: number;
  currentTier: number;
}

interface Tier {
  name: string;
  points: number;
  icon: string;
  reward: string;
}

const TIERS: Tier[] = [
  { name: "Tier 1", points: 0, icon: "📖", reward: "Starter Access" },
  { name: "Tier 2", points: 35, icon: "🗣️", reward: "Early Features" },
  { name: "Tier 3", points: 85, icon: "🏆", reward: "Premium Badge" },
  { name: "Tier 4", points: 135, icon: "🦸", reward: "Custom Profile" },
  { name: "Tier 5", points: 260, icon: "👑", reward: "Exclusive Updates" },
  { name: "Tier 6", points: 510, icon: "💎", reward: "VIP Access" },
];

const TierProgressBar = ({
  currentPoints,
  currentTier,
}: TierProgressBarProps) => {
  const [visibleTiers, setVisibleTiers] = useState<Tier[]>([]);

  useEffect(() => {
    // Show current and neighboring tiers
    const start = Math.max(0, currentTier - 1);
    const end = Math.min(TIERS.length, currentTier + 3);
    setVisibleTiers(TIERS.slice(start, end));
  }, [currentTier]);

  const totalPoints = TIERS[TIERS.length - 1].points;
  const progress = (currentPoints / totalPoints) * 100;
  const nextTierPoints = TIERS[Math.min(currentTier + 1, TIERS.length - 1)].points;
  const pointsToNext = Math.max(0, nextTierPoints - currentPoints);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 sm:p-8"
    >
      <h3 className="text-xl font-semibold text-white mb-6">Tier Progress</h3>

      {/* Main Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <p className="text-white/70 text-sm">Overall Progress</p>
          <p className="text-white font-semibold">
            {currentPoints} / {totalPoints} pts
          </p>
        </div>

        <div className="relative h-3 bg-white/10 border border-white/20 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 shadow-lg"
          />

          {/* Glow effect */}
          <motion.div
            animate={{ boxShadow: ["0 0 10px rgba(168, 85, 247, 0.5)", "0 0 20px rgba(168, 85, 247, 0.8)", "0 0 10px rgba(168, 85, 247, 0.5)"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute right-0 top-0 h-full w-2 bg-purple-400 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Tier Milestones */}
      <div className="mb-8 space-y-4">
        <p className="text-white/70 text-sm">Tier Milestones</p>

        <div className="space-y-3">
          {TIERS.map((tier, index) => {
            const isActive = index <= currentTier;
            const isCurrent = index === currentTier;
            const isNext = index === currentTier + 1;

            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`relative p-3 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? "bg-white/10 border-purple-500/50"
                    : "bg-white/5 border-white/10"
                } ${
                  isCurrent
                    ? "ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/20"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Tier Icon and Name */}
                    <span className="text-2xl flex-shrink-0">{tier.icon}</span>
                    <div className="min-w-0">
                      <p className={`font-semibold ${isActive ? "text-white" : "text-white/60"}`}>
                        {tier.name}
                      </p>
                      <p className="text-white/50 text-xs">{tier.reward}</p>
                    </div>
                  </div>

                  {/* Points and Status */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-white/60 text-xs">{tier.points} pts</p>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.05 + 0.3 }}
                          className="text-green-400 text-sm font-bold"
                        >
                          ✓
                        </motion.div>
                      )}
                    </div>

                    {/* Current Indicator */}
                    {isCurrent && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-3 h-3 bg-purple-400 rounded-full"
                      />
                    )}

                    {/* Next Indicator */}
                    {isNext && (
                      <div className="px-2 py-1 bg-purple-500/30 border border-purple-500/50 rounded text-purple-300 text-xs font-semibold">
                        Next
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Next Milestone Info */}
      {currentTier < TIERS.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg"
        >
          <p className="text-purple-300 text-sm">
            <span className="font-bold">{pointsToNext} more points</span> until you reach{" "}
            <span className="font-bold">{TIERS[currentTier + 1].name}</span>! 🚀
          </p>
        </motion.div>
      )}

      {currentTier === TIERS.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg text-center"
        >
          <p className="text-yellow-300 font-semibold">
            🎉 Congratulations! You've reached Founding Elite!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TierProgressBar;
