import React from "react";
import { motion } from "motion/react";
import { Check, Lock } from "lucide-react";

export interface RewardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  earnedVia: string;
  status: "locked" | "claimable" | "claimed";
  onClaim?: () => void;
  requirement?: string;
  claimedAt?: string;
}

export default function RewardCard({
  title,
  description,
  icon,
  earnedVia,
  status,
  onClaim,
  requirement,
  claimedAt,
}: RewardCardProps) {
  const isLocked = status === "locked";
  const isClaimable = status === "claimable";
  const isClaimed = status === "claimed";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        border-2 rounded-2xl p-6 transition-all duration-300
        ${
          isLocked
            ? "bg-white border-[#dedede] opacity-60"
            : "bg-white border-[#dedede] hover:border-[#8861d4]/30"
        }
      `}
    >
      {/* Header with icon and status */}
      <div className="flex items-start justify-between mb-4">
        <div className={`text-4xl ${isLocked ? "opacity-50" : ""}`}>
          {icon}
        </div>

        {/* Status badge */}
        <div className="flex-1 ml-4">
          {isClaimed && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium"
            >
              <Check className="w-4 h-4" />
              Claimed
            </motion.div>
          )}
          {isClaimable && (
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(136, 97, 212, 0.3)",
                  "0 0 0 8px rgba(136, 97, 212, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="inline-block bg-[#8861d4] text-white px-3 py-1 rounded-full text-sm font-medium"
            >
              Ready
            </motion.div>
          )}
          {isLocked && (
            <div className="inline-flex items-center gap-1 bg-[#f3ebf8] text-gray-500 px-3 py-1 rounded-full text-sm font-medium">
              <Lock className="w-4 h-4" />
              Locked
            </div>
          )}
        </div>
      </div>

      {/* Title and description */}
      <div className="mb-4">
        <h3
          className={`font-sans font-bold text-lg mb-1 ${
            isLocked ? "text-gray-500" : "text-[#3b1f59]"
          }`}
        >
          {title}
        </h3>
        <p className={`text-sm ${isLocked ? "text-gray-500" : "text-[#121212]"}`}>
          {description}
        </p>
      </div>

      {/* How earned / Requirement */}
      <div className="mb-4 pt-4 border-t border-[#dedede]">
        <p className="text-xs font-medium text-gray-500 mb-2">
          {isLocked ? "Unlock:" : "Earned via:"}
        </p>
        <p className={`text-sm font-medium ${
          isLocked ? "text-gray-500" : "text-[#8861d4]"
        }`}>
          {requirement || earnedVia}
        </p>
      </div>

      {/* Claimed date */}
      {isClaimed && claimedAt && (
        <div className="mb-4 text-xs text-gray-500">
          Claimed on {new Date(claimedAt).toLocaleDateString()}
        </div>
      )}

      {/* Action button */}
      {isClaimable && onClaim && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClaim}
          className="w-full bg-[#8861d4] hover:bg-[#7451c4] text-white font-medium py-2 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Claim Reward
        </motion.button>
      )}

      {isLocked && (
        <button
          disabled
          className="w-full bg-[#f3ebf8] text-gray-500 font-medium py-2 px-4 rounded-xl opacity-60 cursor-not-allowed"
        >
          Locked
        </button>
      )}

      {isClaimed && (
        <button
          disabled
          className="w-full bg-emerald-50 text-emerald-600 font-medium py-2 px-4 rounded-xl flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" />
          Claimed
        </button>
      )}
    </motion.div>
  );
}
