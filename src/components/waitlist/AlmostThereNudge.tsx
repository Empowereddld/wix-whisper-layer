import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Zap, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AlmostThereNudgeProps {
  nextTierName: string;
  nextReward: string;
  referralLink: string;
}

const AlmostThereNudge: React.FC<AlmostThereNudgeProps> = ({
  nextTierName,
  nextReward,
  referralLink,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  // Check if user has dismissed this nudge before
  useEffect(() => {
    const dismissedKey = `nudge-dismissed-${nextTierName}`;
    const wasDismissed = localStorage.getItem(dismissedKey) === "true";
    if (wasDismissed) {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, [nextTierName]);

  const handleDismiss = () => {
    const dismissedKey = `nudge-dismissed-${nextTierName}`;
    localStorage.setItem(dismissedKey, "true");
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Story Pros",
          text: `Help me reach ${nextTierName} on Story Pros! Join me and earn ${nextReward}!`,
          url: referralLink,
        });
      } else {
        await navigator.clipboard.writeText(referralLink);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share error:", error);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative mb-6"
        >
          {/* Animated background */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            {/* Main gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-emerald-500/20 to-cyan-500/20 backdrop-blur" />

            {/* Animated pulsing border */}
            <motion.div
              className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-border"
              animate={{
                borderColor: [
                  "rgba(74, 222, 128, 0.5)",
                  "rgba(16, 185, 129, 0.5)",
                  "rgba(34, 211, 238, 0.5)",
                  "rgba(74, 222, 128, 0.5)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {/* Icon */}
                <motion.div
                  className="flex-shrink-0 mt-1"
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
                  <Zap className="w-6 h-6 text-yellow-300" />
                </motion.div>

                {/* Text content */}
                <div className="flex-1 min-w-0">
                  <motion.h3
                    className="text-lg sm:text-xl font-bold text-white mb-1"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                  >
                    You're ONE referral away! 🚀
                  </motion.h3>
                  <motion.p
                    className="text-sm text-white/80 mb-4"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    Unlock <span className="font-semibold">{nextTierName}</span> and
                    earn <span className="font-semibold">"{nextReward}"</span>
                  </motion.p>

                  {/* Share button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                  >
                    <Button
                      onClick={handleShare}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all active:scale-95"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share & Get Closer</span>
                    </Button>
                  </motion.div>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                onClick={handleDismiss}
                className="flex-shrink-0 text-white/60 hover:text-white transition-colors p-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Progress indicator */}
            <motion.div
              className="mt-4 flex items-center gap-2 text-xs text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <span>Almost there:</span>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-cyan-400"
                  initial={{ width: "90%" }}
                  animate={{
                    width: ["90%", "95%", "90%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </div>
              <span>90%</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlmostThereNudge;
