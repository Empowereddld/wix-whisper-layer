import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gift,
  Coins,
  Package,
  Check,
  Lock,
} from "lucide-react";
import CoinDropAnimation from "./CoinDropAnimation";
import { TIER_THRESHOLDS } from "@/lib/waitlist-constants";

// Tier 5 (idx 4) and Tier 6 (idx 5) keep their reward details hidden until
// the user actually reaches that tier — preserves the surprise/reveal moment.
const SURPRISE_TIER_INDEX = 4;
const surpriseName = (idx: number) => `Tier ${idx + 1} Mystery Reward`;
const surpriseDesc = (idx: number) =>
  `Reach Tier ${idx + 1} (${TIER_THRESHOLDS[idx]} pts) to reveal this reward.`;

export interface RewardsInventoryProps {
  currentTier: number;
  coins: number;
  badges: string[];
  inventory: Record<string, { claimed_at: string }>;
  onClaimReward: (rewardId: string) => void;
  onRedeemCoinPack: (packLevel: number) => void;
}

interface TierReward {
  tier: number;
  rewardId: string;
  name: string;
  description: string;
  icon: string;
  earnedVia: string;
  claimType: "auto" | "download" | "activate" | "unlock" | "onboard";
}

interface CoinPack {
  level: number;
  packId: string;
  name: string;
  cost: number;
  description: string;
  icon: string;
  rewards: string[];
}

// LOCKED — see mem://features/story-pros/reward-journey
// tier index is 0-based: 0 = Tier 1, 1 = Tier 2, ... 5 = Tier 6
const TIER_REWARDS: TierReward[] = [
  {
    tier: 0,
    rewardId: "tier_1_founding",
    name: "Founding Member Status",
    description: "Behind-the-scenes updates, Founding Member badge, and your name on the Early Supporters Wall",
    icon: "📖",
    earnedVia: "Auto-claimed on join",
    claimType: "auto",
  },
  {
    tier: 1,
    rewardId: "tier_2_ef_guide",
    name: "Executive Function Skills Guide",
    description: "FREE digital product (normally paid in the Resource Hub)",
    icon: "🎁",
    earnedVia: "Download digital guide",
    claimType: "download",
  },
  {
    tier: 2,
    rewardId: "tier_3_coins",
    name: "50 Bonus Story Coins",
    description: "A bonus coin drop to spend on in-app extras at launch",
    icon: "🪙",
    earnedVia: "Auto-deposited to your balance",
    claimType: "auto",
  },
  {
    tier: 3,
    rewardId: "tier_4_beta",
    name: "VIP Beta Access",
    description: "Test Story Pros before launch and help shape the final product",
    icon: "🚀",
    earnedVia: "Unlock beta invite",
    claimType: "unlock",
  },
  {
    tier: 4,
    rewardId: "tier_5_founder_price",
    name: "Founder Pricing Locked",
    description: "$7.99/month for life instead of $9.99. Points double from this tier on.",
    icon: "💎",
    earnedVia: "Activate lifetime pricing",
    claimType: "activate",
  },
  {
    tier: 5,
    rewardId: "tier_6_elite",
    name: "Founder or Legend Reward",
    description: "First 50 to Tier 6: signed Dan & Daria book + DLD-themed merch (Founder). After slots fill: 100 bonus Story Coins + Legend badge.",
    icon: "👑",
    earnedVia: "Auto-awarded based on Tier 6 slot",
    claimType: "onboard",
  },
];

const REWARD_COLORS = [
  { bg: "rgba(136, 97, 212, 0.08)", accent: "#8861d4" },
  { bg: "rgba(136, 97, 212, 0.12)", accent: "#7b52c9" },
  { bg: "rgba(99, 179, 141, 0.1)", accent: "#63b38d" },
  { bg: "rgba(212, 146, 11, 0.1)", accent: "#d4920b" },
  { bg: "rgba(59, 31, 89, 0.1)", accent: "#3b1f59" },
  { bg: "rgba(212, 175, 55, 0.12)", accent: "#d4af37" },
];

const COIN_PACKS: CoinPack[] = [
  {
    level: 1,
    packId: "coin_pack_1",
    name: "Story Starter Pack",
    cost: 50,
    description: "Get your journey started",
    icon: "🌟",
    rewards: [
      "Shareable social badge graphic",
      "Name on Early Supporters wall",
      "Dan & Daria phone/desktop wallpaper",
    ],
  },
  {
    level: 2,
    packId: "coin_pack_2",
    name: "Story Champion Pack",
    cost: 150,
    description: "Unlock premium perks",
    icon: "⭐",
    rewards: [
      "Personalized Founding Supporter Certificate",
      "48-hour 2x referral power-up",
      "Story theme/character voting access",
      "Legend leaderboard flair",
    ],
  },
];

export default function RewardsInventory({
  currentTier,
  coins,
  inventory,
  onClaimReward,
  onRedeemCoinPack,
}: RewardsInventoryProps) {
  const [coinDropTrigger, setCoinDropTrigger] = useState(false);
  const [coinDropAmount, setCoinDropAmount] = useState(0);
  const [activeTab, setActiveTab] = useState<"tiers" | "inventory" | "coins">("tiers");

  const handleClaimReward = (rewardId: string) => {
    const reward = TIER_REWARDS.find((r) => r.rewardId === rewardId);
    // Tier 3 (index 2) drops 50 bonus Story Coins
    if (reward && reward.tier === 2) {
      setCoinDropAmount(50);
      setCoinDropTrigger(true);
    }
    onClaimReward(rewardId);
  };

  const getRewardStatus = (
    rewardId: string,
    requiredTier: number,
    claimType: TierReward["claimType"]
  ): "locked" | "claimable" | "claimed" | "awarded" => {
    if (currentTier < requiredTier) return "locked";
    // Passive rewards (auto-granted when tier reached) display as "awarded"
    // unless the user has explicitly claimed them via the button (download types only).
    const isActionable = claimType === "download" || claimType === "unlock";
    if (inventory[rewardId]) return "claimed";
    if (!isActionable) return "awarded";
    return "claimable";
  };

  const tabs = [
    { id: "tiers" as const, label: "Tier Progress", icon: Gift },
    { id: "inventory" as const, label: "Claim Rewards", icon: Package },
  ];

  return (
    <div>
      <CoinDropAnimation
        amount={coinDropAmount}
        trigger={coinDropTrigger}
        onComplete={() => setCoinDropTrigger(false)}
      />

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 text-sm ${
              activeTab === tab.id
                ? "bg-[#8861d4] text-white shadow-md"
                : "bg-white text-[#121212] border border-[#dedede] hover:border-[#8861d4]/30"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {/* Tier Progress Tab - read-only view */}
        {activeTab === "tiers" && (
          <motion.div
            key="tiers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative pl-3">
              {/* Vertical progress line - offset left of circles */}
              <div className="absolute left-[22px] top-0 bottom-0 w-0.5 bg-[#dedede]" />
              <div
                className="absolute left-[22px] top-0 w-0.5 bg-[#8861d4] transition-all duration-700"
                style={{ height: `${((currentTier + 1) / TIER_REWARDS.length) * 100}%` }}
              />

              <div className="space-y-1">
                {TIER_REWARDS.map((reward, idx) => {
                  const isLocked = currentTier < idx;
                  const isUnlocked = !isLocked;
                  const isCurrent = currentTier === idx;
                  const colors = REWARD_COLORS[idx];

                  return (
                    <div
                      key={reward.rewardId}
                      className="relative flex items-center gap-4 py-2.5 px-4 rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: isUnlocked ? colors.bg : "transparent",
                        borderLeft: isCurrent ? `3px solid ${colors.accent}` : "3px solid transparent",
                      }}
                    >
                      {/* Progress dot */}
                      <div
                        className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                        style={{
                          backgroundColor: isUnlocked ? colors.accent : "#e5e5e5",
                          boxShadow: isCurrent ? `0 0 12px ${colors.accent}40` : "none",
                        }}
                      >
                        {isUnlocked ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-gray-400" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{reward.icon}</span>
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: isUnlocked ? colors.accent : "#9ca3af" }}>
                            Tier {reward.tier + 1}
                          </span>
                        </div>
                        <p className={`text-sm font-bold ${isUnlocked ? "text-[#3b1f59]" : "text-gray-500"}`}>
                          {isLocked && idx >= SURPRISE_TIER_INDEX ? surpriseName(idx) : reward.name}
                        </p>
                        <p className={`text-xs ${isUnlocked ? "text-[#121212]" : "text-gray-400"}`}>
                          {isLocked && idx >= SURPRISE_TIER_INDEX ? surpriseDesc(idx) : reward.description}
                        </p>
                      </div>

                      {/* Status indicator */}
                      {isUnlocked && (
                        <span className="text-xs font-medium text-emerald-600 flex-shrink-0">✓ Unlocked</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Claim Rewards Tab - actionable inventory */}
        {activeTab === "inventory" && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              {TIER_REWARDS.map((reward, idx) => {
                const status = getRewardStatus(reward.rewardId, reward.tier, reward.claimType);
                const isLocked = status === "locked";
                const colors = REWARD_COLORS[idx];

                return (
                  <div
                    key={reward.rewardId}
                    className={`rounded-xl p-4 transition-all duration-300 border ${
                      isLocked ? "border-[#dedede] opacity-60" : "border-transparent"
                    }`}
                    style={{
                      backgroundColor: !isLocked ? colors.bg : "rgba(245,245,245,0.5)",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: !isLocked ? colors.accent : "#9ca3af" }}>
                            Tier {reward.tier + 1}
                          </span>
                        </div>
                        <p className={`text-sm font-bold ${!isLocked ? "text-[#3b1f59]" : "text-gray-500"}`}>
                          {isLocked && idx >= SURPRISE_TIER_INDEX ? surpriseName(idx) : reward.name}
                        </p>
                        <p className={`text-xs mt-0.5 ${!isLocked ? "text-[#121212]" : "text-gray-400"}`}>
                          {isLocked && idx >= SURPRISE_TIER_INDEX ? surpriseDesc(idx) : reward.description}
                        </p>

                        {/* Action */}
                        <div className="mt-2">
                          {status === "claimable" && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleClaimReward(reward.rewardId)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all"
                              style={{ backgroundColor: colors.accent }}
                            >
                              {reward.claimType === "download" ? "Download Now" : "Activate"}
                            </motion.button>
                          )}
                          {status === "claimed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <Check className="w-3 h-3" /> Claimed
                              {inventory[reward.rewardId]?.claimed_at && (
                                <span className="text-gray-400 ml-1">
                                  · {new Date(inventory[reward.rewardId].claimed_at).toLocaleDateString()}
                                </span>
                              )}
                              {reward.claimType === "download" && (
                                <button
                                  onClick={() => handleClaimReward(reward.rewardId)}
                                  className="ml-2 underline text-[#8861d4] hover:text-[#7551c4]"
                                >
                                  Re-download
                                </button>
                              )}
                            </span>
                          )}
                          {status === "awarded" && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <Check className="w-3 h-3" /> Awarded automatically
                            </span>
                          )}
                          {isLocked && (
                            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                              <Lock className="w-3 h-3" /> Reach Tier {reward.tier + 1} to unlock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Coin Packs Tab */}
        {activeTab === "coins" && (
          <motion.div
            key="coins"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Current Coin Balance */}
            <motion.div
              className="bg-gradient-to-br from-[#f3ebf8] to-white border border-[#8861d4]/30 rounded-2xl p-6"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">Current Balance</p>
                  <p className="font-sans text-4xl font-bold text-[#8861d4]">{coins} coins</p>
                </div>
                <div className="text-6xl">💰</div>
              </div>
            </motion.div>

            {/* Coin Packs */}
            {COIN_PACKS.map((pack) => {
              const isRedeemed = !!inventory[pack.packId];
              const canRedeem = coins >= pack.cost && !isRedeemed;

              return (
                <motion.div
                  key={pack.packId}
                  className="bg-white border border-[#dedede] rounded-2xl p-6 hover:border-[#8861d4]/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{pack.icon}</div>
                      <div>
                        <h3 className="font-sans text-lg font-bold text-[#3b1f59] mb-1">{pack.name}</h3>
                        <p className="text-[#121212] text-sm mb-2">{pack.description}</p>
                        <p className="text-[#8861d4] font-bold">{pack.cost} coins</p>
                      </div>
                    </div>
                    {isRedeemed && (
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-medium">Redeemed</div>
                    )}
                  </div>

                  <div className="bg-[#f3ebf8] rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">Includes:</p>
                    <ul className="space-y-1">
                      {pack.rewards.map((reward, idx) => (
                        <li key={idx} className="text-sm text-[#121212] flex gap-2">
                          <span className="text-[#8861d4]">•</span>
                          {reward}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!isRedeemed ? (
                    <motion.button
                      whileHover={canRedeem ? { scale: 1.02 } : {}}
                      whileTap={canRedeem ? { scale: 0.98 } : {}}
                      onClick={() => onRedeemCoinPack(pack.level)}
                      disabled={!canRedeem}
                      className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                        canRedeem
                          ? "bg-[#8861d4] hover:bg-[#7551c4] text-white shadow-sm hover:shadow-md"
                          : "bg-[#f3ebf8] text-gray-500 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {canRedeem ? "Redeem Now" : `Need ${pack.cost - coins} more coins`}
                    </motion.button>
                  ) : (
                    <button disabled className="w-full bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl font-medium">
                      ✓ Already Redeemed
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
