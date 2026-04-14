import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { tierColors } from "@/lib/glassmorphism";

interface Tier {
  id: number;
  name: string;
  reward: string;
}

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  tier: Tier;
}

const TIER_COLORS = {
  tier1: {
    bg: "from-amber-400 to-amber-600",
    glow: "bg-amber-400/50",
    text: "text-amber-600",
    accent: "text-amber-500",
  },
  tier2: {
    bg: "from-blue-400 to-blue-600",
    glow: "bg-blue-400/50",
    text: "text-blue-600",
    accent: "text-blue-500",
  },
  tier3: {
    bg: "from-yellow-400 to-amber-600",
    glow: "bg-yellow-400/50",
    text: "text-amber-600",
    accent: "text-yellow-500",
  },
  tier4: {
    bg: "from-purple-600 to-purple-900",
    glow: "bg-purple-600/50",
    text: "text-purple-700",
    accent: "text-purple-500",
  },
  tier5: {
    bg: "from-emerald-400 to-emerald-600",
    glow: "bg-emerald-400/50",
    text: "text-emerald-600",
    accent: "text-emerald-500",
  },
  tier6: {
    bg: "from-cyan-300 via-blue-400 to-purple-600",
    glow: "bg-cyan-300/50",
    text: "text-purple-700",
    accent: "text-cyan-400",
  },
};

const getTierColor = (tierName: string) => {
  const normalizedName = tierName.toLowerCase().replace(/\s+/g, "");
  return (
    TIER_COLORS[normalizedName as keyof typeof TIER_COLORS] ||
    TIER_COLORS.tier1
  );
};

const Confetti = ({ tierColor }: { tierColor: keyof typeof TIER_COLORS }) => {
  const confettiPieces = Array.from({ length: 50 });

  const getConfettiColor = (index: number) => {
    const colors = [
      "#fbbf24", // amber
      "#3b82f6", // blue
      "#fcd34d", // yellow
      "#c084fc", // purple
      "#34d399", // emerald
      "#06b6d4", // cyan
      "#ec4899", // pink
    ];
    return colors[index % colors.length];
  };

  return (
    <>
      {confettiPieces.map((_, index) => {
        const delay = Math.random() * 0.3;
        const duration = 2 + Math.random() * 0.5;
        const randomX = Math.random() * 100 - 50;
        const randomRotation = Math.random() * 720;

        return (
          <motion.div
            key={index}
            initial={{
              opacity: 1,
              x: randomX,
              y: -20,
              rotate: 0,
            }}
            animate={{
              opacity: 0,
              x: randomX + (Math.random() * 100 - 50),
              y: window.innerHeight,
              rotate: randomRotation,
            }}
            transition={{
              duration,
              delay,
              ease: "easeIn",
            }}
            className="fixed pointer-events-none"
            style={{
              left: "50%",
              top: "50%",
              width: index % 2 === 0 ? 8 : 6,
              height: index % 2 === 0 ? 8 : 6,
              backgroundColor: getConfettiColor(index),
              borderRadius: index % 3 === 0 ? "50%" : "2px",
            }}
          />
        );
      })}
    </>
  );
};

const MilestoneModal: React.FC<MilestoneModalProps> = ({
  isOpen,
  onClose,
  tier,
}) => {
  const [showShare, setShowShare] = useState(false);
  const tierColor = getTierColor(tier.name);

  const handleShare = async () => {
    const text = `I just unlocked ${tier.name} tier and earned "${tier.reward}" on Story Pros! Join me on the waitlist and climb the leaderboard!`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Story Pros Achievement",
          text: text,
        });
      } else {
        await navigator.clipboard.writeText(text);
        toast.success("Achievement copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Confetti */}
          <Confetti tierColor={Object.keys(TIER_COLORS).find(k => k === tier.name.toLowerCase().replace(/\s+/g, "")) as keyof typeof TIER_COLORS || "storyteller"} />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="tier-title"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Main card */}
              <motion.div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {/* Background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tierColor.bg}`} />

                {/* Glow effect */}
                <motion.div
                  className={`absolute -inset-1 ${tierColor.glow} blur-2xl opacity-50`}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {/* Content */}
                <div className="relative z-10 p-8 text-center">
                  {/* Badge zoom animation */}
                  <motion.div
                    className="mb-6"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.6,
                      type: "spring",
                      stiffness: 100,
                    }}
                  >
                    <div
                      className={`w-24 h-24 mx-auto rounded-full bg-white/20 backdrop-blur border-2 border-white/40 flex items-center justify-center text-4xl font-bold ${tierColor.text}`}
                    >
                      ✨
                    </div>
                  </motion.div>

                  {/* Tier name and unlocked text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                  >
                    <h2 id="tier-title" className="text-4xl font-bold text-white mb-2">
                      {tier.name}
                    </h2>
                    <p className={`text-lg font-semibold ${tierColor.accent} mb-6`}>
                      Unlocked!
                    </p>
                  </motion.div>

                  {/* Reward description */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.4 }}
                    className="mb-8"
                  >
                    <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl p-4">
                      <p className="text-white/90 text-sm">Your Reward</p>
                      <p className="text-white font-semibold mt-1">
                        {tier.reward}
                      </p>
                    </div>
                  </motion.div>

                  {/* Action buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.4 }}
                    className="space-y-3"
                  >
                    <Button
                      onClick={() => setShowShare(true)}
                      className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-2 rounded-xl transition-all"
                    >
                      Claim Your Reward
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full border-white/30 text-white hover:bg-white/10"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Achievement
                    </Button>
                  </motion.div>

                  {/* Share success indicator */}
                  {showShare && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-white/80 text-sm"
                    >
                      ✓ Reward claimed! Share your achievement to inspire others.
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MilestoneModal;
