import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Users, Flame } from "lucide-react";

interface CommunityMilestoneProps {
  totalCount: number;
}

interface Milestone {
  target: number;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    border: string;
    glow: string;
    text: string;
  };
}

const MILESTONES: Milestone[] = [
  {
    target: 500,
    name: "500 Club",
    icon: Users,
    colors: {
      bg: "from-blue-500 to-blue-700",
      border: "border-blue-400",
      glow: "shadow-blue-500/50",
      text: "text-blue-300",
    },
  },
  {
    target: 1000,
    name: "1K Strong",
    icon: Flame,
    colors: {
      bg: "from-orange-500 to-orange-700",
      border: "border-orange-400",
      glow: "shadow-orange-500/50",
      text: "text-orange-300",
    },
  },
  {
    target: 2500,
    name: "2.5K Movement",
    icon: Users,
    colors: {
      bg: "from-purple-500 to-purple-700",
      border: "border-purple-400",
      glow: "shadow-purple-500/50",
      text: "text-purple-300",
    },
  },
  {
    target: 5000,
    name: "5K Revolution",
    icon: Flame,
    colors: {
      bg: "from-red-500 to-pink-700",
      border: "border-pink-400",
      glow: "shadow-pink-500/50",
      text: "text-pink-300",
    },
  },
];

const CommunityMilestone: React.FC<CommunityMilestoneProps> = ({
  totalCount,
}) => {
  const nextMilestone = useMemo(() => {
    return MILESTONES.find((m) => m.target > totalCount) || MILESTONES[MILESTONES.length - 1];
  }, [totalCount]);

  const previousMilestone = useMemo(() => {
    return MILESTONES.filter((m) => m.target <= totalCount).pop();
  }, [totalCount]);

  const progressToNextMilestone = useMemo(() => {
    if (!nextMilestone) return 100;

    const prevTarget = previousMilestone?.target || 0;
    const currentTarget = nextMilestone.target;
    const progress = totalCount - prevTarget;
    const needed = currentTarget - prevTarget;

    return Math.min((progress / needed) * 100, 100);
  }, [totalCount, nextMilestone, previousMilestone]);

  const reachedMilestones = useMemo(() => {
    return MILESTONES.filter((m) => m.target <= totalCount);
  }, [totalCount]);

  const isAllMilestonesReached = totalCount >= MILESTONES[MILESTONES.length - 1].target;

  return (
    <div className="w-full space-y-8">
      {/* Current progress section */}
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 backdrop-blur border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Community Growing!
              </h3>
              <p className="text-white/60 text-sm">
                We're{" "}
                <span className="text-white font-semibold">
                  {progressToNextMilestone.toFixed(0)}%
                </span>{" "}
                of the way to{" "}
                <span className="text-white font-semibold">
                  {nextMilestone.name}
                </span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-white">
                {totalCount.toLocaleString()}
              </div>
              <div className="text-white/60 text-sm">Total Members</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-white/60 mb-2">
              <span>
                {previousMilestone ? previousMilestone.target.toLocaleString() : "0"}
              </span>
              <span>
                {nextMilestone.target.toLocaleString()}
              </span>
            </div>

            <div className="h-3 bg-white/10 rounded-full overflow-hidden border border-white/20">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progressToNextMilestone}%` }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
              />
            </div>

            <div className="text-xs text-white/60 text-right">
              {Math.max(0, nextMilestone.target - totalCount).toLocaleString()}{" "}
              more to go!
            </div>
          </div>
        </div>
      </motion.div>

      {/* Milestones grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Milestone Badges</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MILESTONES.map((milestone, index) => {
            const isReached = totalCount >= milestone.target;
            const IconComponent = milestone.icon;

            return (
              <motion.div
                key={milestone.target}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden transition-all duration-300 h-full ${
                    isReached
                      ? `bg-gradient-to-br ${milestone.colors.bg} shadow-lg ${milestone.colors.glow}`
                      : "bg-gray-800/50 border border-white/10"
                  }`}
                >
                  {/* Glow effect for reached milestones */}
                  {isReached && (
                    <motion.div
                      className="absolute inset-0 bg-white/10 opacity-0"
                      animate={{
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  {/* Content */}
                  <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full text-center">
                    {/* Icon */}
                    <motion.div
                      className={`mb-3 ${
                        isReached ? "text-white" : "text-white/40"
                      }`}
                      animate={
                        isReached
                          ? {
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0],
                            }
                          : {}
                      }
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <IconComponent className="w-8 h-8" />
                    </motion.div>

                    {/* Target number */}
                    <div
                      className={`text-3xl font-bold mb-1 ${
                        isReached
                          ? "text-white"
                          : "text-white/60"
                      }`}
                    >
                      {(milestone.target / 1000).toFixed(1)}K
                    </div>

                    {/* Name */}
                    <h4
                      className={`font-semibold text-sm mb-2 ${
                        isReached ? "text-white" : "text-white/60"
                      }`}
                    >
                      {milestone.name}
                    </h4>

                    {/* Status */}
                    {isReached ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-semibold rounded-full"
                      >
                        ✓ Unlocked
                      </motion.div>
                    ) : (
                      <div className="text-xs text-white/50">
                        {(
                          ((totalCount - (previousMilestone?.target || 0)) /
                            (milestone.target - (previousMilestone?.target || milestone.target))) *
                          100
                        ).toFixed(0)}
                        % progress
                      </div>
                    )}
                  </div>

                  {/* Reached indicator */}
                  {isReached && (
                    <motion.div
                      className="absolute top-2 left-2"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-xs font-bold text-green-600">
                          ✓
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Celebration message when all milestones reached */}
      {isAllMilestonesReached && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-2xl text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-4xl mb-3"
          >
            🎉
          </motion.div>
          <h4 className="text-lg font-bold text-white mb-2">
            We've Reached All Milestones!
          </h4>
          <p className="text-white/70 text-sm">
            Thanks to our amazing community, Story Builders has achieved
            incredible growth. You're all legends!
          </p>
        </motion.div>
      )}

      {/* Stats footer */}
      <motion.div
        className="p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">
              {reachedMilestones.length}
            </div>
            <div className="text-xs text-white/60 mt-1">
              Milestones Reached
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {totalCount.toLocaleString()}
            </div>
            <div className="text-xs text-white/60 mt-1">Total Members</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {Math.round(
                (reachedMilestones.length / MILESTONES.length) * 100
              )}
              %
            </div>
            <div className="text-xs text-white/60 mt-1">Complete</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CommunityMilestone;
