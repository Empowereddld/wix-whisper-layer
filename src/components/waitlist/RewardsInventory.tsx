import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Gift,
  Coins,
  Award,
  BookOpen,
  Sparkles,
  MessageSquare,
  Trophy,
  Crown,
  Star,
  Heart,
  Zap,
  Users,
  Check,
  Lock,
} from "lucide-react";
import RewardCard from "./RewardCard";
import CoinDropAnimation from "./CoinDropAnimation";

export interface RewardsInventoryProps {
  currentTier: number;
  coins: number;
  badges: string[];
  inventory: Record<string, { claimed: boolean; claimedAt?: string }>;
  onClaimReward: (rewardId: string) => void;
  onRedeemCoinPack: (packLevel: number) => void;
}

interface TierReward {
  tier: number;
  rewardId: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  earnedVia: string;
  claimType: "auto" | "download" | "activate" | "unlock" | "onboard";
}

interface CoinPack {
  level: number;
  packId: string;
  name: string;
  cost: number;
  description: string;
  icon: React.ReactNode;
  rewards: string[];
}

const TIER_REWARDS: TierReward[] = [
  {
    tier: 0,
    rewardId: "tier_0_updates",
    name: "Development Updates",
    description: "Behind-the-scenes updates on Story Pros development",
    icon: "📬",
    earnedVia: "Auto-claimed on join",
    claimType: "auto",
  },
  {
    tier: 1,
    rewardId: "tier_1_pdf",
    name: "5 Language Activities PDF",
    description: "One-page guide with language activities to try tonight",
    icon: "📄",
    earnedVia: "Download PDF guide",
    claimType: "download",
  },
  {
    tier: 2,
    rewardId: "tier_2_coins",
    name: "75 Bonus Coins + Story Starter Pack",
    description: "A treasure chest of coins and your first reward pack",
    icon: "💎",
    earnedVia: "Receive 75 coins + pack access",
    claimType: "activate",
  },
  {
    tier: 3,
    rewardId: "tier_3_voice",
    name: "Founding Voice + Sneak Peek",
    description: "Shape the app with your suggestions + preview video",
    icon: "🎬",
    earnedVia: "Unlock suggestion form + video link",
    claimType: "unlock",
  },
  {
    tier: 4,
    rewardId: "tier_4_founder",
    name: "Founder Recognition + $5.99 Pricing + 200 Coins",
    description: "Your name on our wall, $5.99/mo forever, and 200 bonus coins",
    icon: "🏆",
    earnedVia: "Activate lifetime pricing + 200 coins",
    claimType: "activate",
  },
  {
    tier: 5,
    rewardId: "tier_5_elite",
    name: "VIP Founding Elite Package",
    description: "Meet & greet, signed book, app credits — the full experience",
    icon: "👑",
    earnedVia: "Start onboarding for exclusive benefits",
    claimType: "onboard",
  },
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

const BADGES = [
  { id: "storyteller", name: "Tier 1", tier: 0, icon: "📖" },
  { id: "advocate", name: "Tier 2", tier: 1, icon: "📢" },
  { id: "champion", name: "Tier 3", tier: 2, icon: "🎯" },
  { id: "hero", name: "Tier 4", tier: 3, icon: "⚡" },
  { id: "legend", name: "Tier 5", tier: 4, icon: "👑" },
  { id: "founding_elite", name: "Tier 6", tier: 5, icon: "💫" },
  { id: "early_bird", name: "Early Bird", tier: 0, icon: "🐦" },
  { id: "social_butterfly", name: "Social Butterfly", tier: 1, icon: "🦋" },
];

export default function RewardsInventory({
  currentTier,
  coins,
  badges: earnedBadges,
  inventory,
  onClaimReward,
  onRedeemCoinPack,
}: RewardsInventoryProps) {
  const [coinDropTrigger, setCoinDropTrigger] = useState(false);
  const [coinDropAmount, setCoinDropAmount] = useState(0);
  const [activeTab, setActiveTab] = useState<"tiers" | "coins" | "badges">(
    "tiers"
  );

  const handleClaimReward = (rewardId: string) => {
    const reward = TIER_REWARDS.find((r) => r.rewardId === rewardId);
    if (reward && reward.tier === 2) {
      setCoinDropAmount(75);
      setCoinDropTrigger(true);
    } else if (reward && reward.tier === 4) {
      setCoinDropAmount(200);
      setCoinDropTrigger(true);
    }
    onClaimReward(rewardId);
  };

  const handleRedeemPack = (packLevel: number) => {
    onRedeemCoinPack(packLevel);
  };

  const getRewardStatus = (
    rewardId: string,
    requiredTier: number
  ): "locked" | "claimable" | "claimed" => {
    if (currentTier < requiredTier) return "locked";
    if (inventory[rewardId]?.claimed) return "claimed";
    return "claimable";
  };

  return (
    <div className="bg-white min-h-screen">
      <CoinDropAnimation
        amount={coinDropAmount}
        trigger={coinDropTrigger}
        onComplete={() => setCoinDropTrigger(false)}
      />

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-sans text-4xl font-bold text-[#3b1f59] mb-2">
          My Rewards
        </h1>
        <p className="text-[#121212]">
          Discover and claim your earned rewards, unlock special badges, and
          redeem coins for exclusive perks.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: "tiers", label: "Tier Rewards", icon: Gift },
          { id: "coins", label: "Coin Packs", icon: Coins },
          { id: "badges", label: "Badges", icon: Award },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${
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
        {/* Tier Rewards Tab */}
        {activeTab === "tiers" && (
          <motion.div
            key="tiers"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative">
              {/* Vertical progress line */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-[#dedede]" />
              <div
                className="absolute left-5 top-0 w-0.5 bg-[#8861d4] transition-all duration-700"
                style={{ height: `${((currentTier + 1) / TIER_REWARDS.length) * 100}%` }}
              />

              <div className="space-y-1">
                {TIER_REWARDS.map((reward, idx) => {
                  const status = getRewardStatus(reward.rewardId, reward.tier);
                  const isLocked = status === "locked";
                  const isUnlocked = !isLocked;
                  const isCurrent = currentTier === idx;

                  const REWARD_COLORS = [
                    { bg: "rgba(136, 97, 212, 0.08)", accent: "#8861d4" },
                    { bg: "rgba(136, 97, 212, 0.12)", accent: "#7b52c9" },
                    { bg: "rgba(99, 179, 141, 0.1)", accent: "#63b38d" },
                    { bg: "rgba(212, 146, 11, 0.1)", accent: "#d4920b" },
                    { bg: "rgba(59, 31, 89, 0.1)", accent: "#3b1f59" },
                    { bg: "rgba(212, 175, 55, 0.12)", accent: "#d4af37" },
                  ];
                  const colors = REWARD_COLORS[idx] || REWARD_COLORS[0];

                  return (
                    <div
                      key={reward.rewardId}
                      className="relative flex items-start gap-4 py-3 px-4 rounded-xl transition-all duration-300"
                      style={{
                        backgroundColor: isUnlocked ? colors.bg : "transparent",
                        borderLeft: isCurrent ? `3px solid ${colors.accent}` : "3px solid transparent",
                      }}
                    >
                      {/* Progress dot */}
                      <div
                        className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-300"
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
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-lg">{reward.icon}</span>
                          <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: isUnlocked ? colors.accent : "#9ca3af" }}>
                            Tier {reward.tier + 1}
                          </span>
                        </div>
                        <p className={`text-sm font-bold ${isUnlocked ? "text-[#3b1f59]" : "text-gray-500"}`}>
                          {reward.name}
                        </p>
                        <p className={`text-xs mt-0.5 ${isUnlocked ? "text-[#121212]" : "text-gray-400"}`}>
                          {reward.description}
                        </p>

                        {/* Action buttons inline */}
                        <div className="mt-2">
                          {status === "claimable" && (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleClaimReward(reward.rewardId)}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-all"
                              style={{ backgroundColor: colors.accent }}
                            >
                              Claim Reward
                            </motion.button>
                          )}
                          {status === "claimed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                              <Check className="w-3 h-3" /> Claimed
                              {inventory[reward.rewardId]?.claimedAt && (
                                <span className="text-gray-400 ml-1">
                                  · {new Date(inventory[reward.rewardId].claimedAt!).toLocaleDateString()}
                                </span>
                              )}
                            </span>
                          )}
                          {isLocked && (
                            <span className="text-xs text-gray-400">
                              Reach Tier {reward.tier + 1} to unlock
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Current Balance
                  </p>
                  <p className="font-sans text-4xl font-bold text-[#8861d4]">
                    {coins} coins
                  </p>
                </div>
                <div className="text-6xl">💰</div>
              </div>
            </motion.div>

            {/* Coin Packs */}
            {COIN_PACKS.map((pack) => {
              const isRedeemed =
                pack.level === 1
                  ? inventory["coin_pack_1"]?.claimed
                  : inventory["coin_pack_2"]?.claimed;
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
                        <h3 className="font-sans text-lg font-bold text-[#3b1f59] mb-1">
                          {pack.name}
                        </h3>
                        <p className="text-[#121212] text-sm mb-2">
                          {pack.description}
                        </p>
                        <p className="text-[#8861d4] font-bold">
                          {pack.cost} coins
                        </p>
                      </div>
                    </div>
                    {isRedeemed && (
                      <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-medium">
                        Redeemed
                      </div>
                    )}
                  </div>

                  {/* Rewards List */}
                  <div className="bg-[#f3ebf8] rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-500 mb-2">
                      Includes:
                    </p>
                    <ul className="space-y-1">
                      {pack.rewards.map((reward, idx) => (
                        <li key={idx} className="text-sm text-[#121212] flex gap-2">
                          <span className="text-[#8861d4]">•</span>
                          {reward}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action */}
                  {!isRedeemed ? (
                    <motion.button
                      whileHover={canRedeem ? { scale: 1.02 } : {}}
                      whileTap={canRedeem ? { scale: 0.98 } : {}}
                      onClick={() => handleRedeemPack(pack.level)}
                      disabled={!canRedeem}
                      aria-label={`Redeem ${pack.name}`}
                      className={`w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 ${
                        canRedeem
                          ? "bg-[#8861d4] hover:bg-[#7551c4] text-white shadow-sm hover:shadow-md"
                          : "bg-[#f3ebf8] text-gray-500 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {canRedeem ? "Redeem Now" : `Need ${pack.cost - coins} more coins`}
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="w-full bg-emerald-50 text-emerald-600 py-2 px-4 rounded-xl font-medium"
                    >
                      ✓ Already Redeemed
                    </button>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Badges Tab */}
        {activeTab === "badges" && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {BADGES.map((badge) => {
                const isEarned = earnedBadges.includes(badge.id);
                const isUnlocked = currentTier >= badge.tier;

                return (
                  <motion.div
                    key={badge.id}
                    whileHover={isEarned ? { scale: 1.05 } : {}}
                    className={`relative rounded-2xl p-4 text-center transition-all duration-200 ${
                      isEarned
                        ? "bg-white border-2 border-[#8861d4] shadow-md"
                        : "bg-[#f3ebf8] border border-[#dedede] opacity-60"
                    }`}
                  >
                    {isEarned && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="absolute -top-2 -right-2 bg-[#8861d4] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      >
                        ✓
                      </motion.div>
                    )}

                    <div className="text-4xl mb-2">{badge.icon}</div>
                    <h4 className="font-sans font-bold text-[#3b1f59] text-sm mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {isEarned
                        ? "Earned"
                        : `Unlock at Tier ${badge.tier + 1}`}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
