import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";

interface PositionCardProps {
  position: number;
  totalUsers: number;
  points: number;
  tier: number;
  tierName: string;
}

const getTierGradient = (tier: number): string => {
  const gradients = [
    "from-slate-400 to-slate-600",
    "from-amber-400 to-amber-600",
    "from-cyan-400 to-cyan-600",
    "from-purple-500 to-purple-700",
    "from-violet-600 to-violet-800",
    "from-yellow-400 to-yellow-600",
  ];
  return gradients[tier] || gradients[0];
};

const getTierThresholds = () => [
  { name: "Storyteller", points: 0, icon: "📖" },
  { name: "Advocate", points: 35, icon: "🗣️" },
  { name: "Champion", points: 85, icon: "🏆" },
  { name: "Hero", points: 135, icon: "🦸" },
  { name: "Legend", points: 260, icon: "👑" },
  { name: "Founding Elite", points: 510, icon: "💎" },
];

const AnimatedCounter = ({ value }: { value: number }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    let currentValue = 0;
    const target = value;
    const increment = Math.ceil(target / 30);
    const interval = setInterval(() => {
      currentValue += increment;
      if (currentValue >= target) {
        currentValue = target;
        clearInterval(interval);
      }
      node.textContent = currentValue.toString();
    }, 30);

    return () => clearInterval(interval);
  }, [value]);

  return <div ref={nodeRef}>0</div>;
};

const PositionCard = ({
  position,
  totalUsers,
  points,
  tier,
  tierName,
}: PositionCardProps) => {
  const percentageRank = ((totalUsers - position + 1) / totalUsers) * 100;
  const tiers = getTierThresholds();
  const nextTier = tiers[Math.min(tier + 1, tiers.length - 1)];
  const currentTierThreshold = tiers[tier].points;
  const nextTierThreshold = nextTier.points;
  const progressToNextTier =
    ((points - currentTierThreshold) /
      (nextTierThreshold - currentTierThreshold)) *
    100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8"
    >
      {/* Main Position Display */}
      <div className="text-center mb-8">
        <motion.p
          key={position}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent"
        >
          #{position}
        </motion.p>
        <p className="text-white/70 text-lg mt-2">
          of {totalUsers} amazing supporters
        </p>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.3, duration: 1 }}
          className="h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mt-4 mx-auto max-w-xs"
        />
      </div>

      {/* Tier Badge */}
      <div className="flex justify-center mb-8">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`bg-gradient-to-r ${getTierGradient(tier)} rounded-full px-6 py-3 text-white font-bold text-lg shadow-xl`}
        >
          {tierName}
        </motion.div>
      </div>

      {/* Points and Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
        >
          <p className="text-white/60 text-sm mb-2">Current Points</p>
          <motion.p
            key={points}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-purple-400"
          >
            {points}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
        >
          <p className="text-white/60 text-sm mb-2">Your Percentile</p>
          <motion.p
            key={percentageRank}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold text-green-400"
          >
            Top {Math.round(100 - percentageRank)}%
          </motion.p>
        </motion.div>
      </div>

      {/* Progress to Next Tier */}
      {tier < tiers.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-white/60 text-sm">Progress to</span>
              <span className="text-white font-semibold">{nextTier.name}</span>
            </div>
            <span className="text-white/60 text-xs whitespace-nowrap">
              {nextTierThreshold - points} pts
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-3 bg-white/10 border border-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(progressToNextTier, 100)}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg"
            />
          </div>

          {/* Milestone Markers */}
          <div className="flex justify-between text-xs text-white/40 mt-2">
            <span>{currentTierThreshold}</span>
            <span>{nextTierThreshold}</span>
          </div>

          {/* Next Reward */}
          <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white/80">
              <span className="text-green-400 font-semibold">
                {nextTier.name}
              </span>{" "}
              unlocked at {nextTierThreshold} points!
            </span>
          </div>
        </motion.div>
      )}

      {tier === tiers.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg text-center"
        >
          <p className="text-yellow-300 font-semibold">
            🎉 You've reached the top tier! You're a Founding Elite!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default PositionCard;
