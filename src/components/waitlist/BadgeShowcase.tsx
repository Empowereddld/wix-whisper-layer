import React from "react";
import { motion } from "motion/react";
import {
  Share2,
  Star,
  Heart,
  Clock,
  Flame,
  Shield,
  Megaphone,
  Target,
  Bird,
  Network,
  Lock,
} from "lucide-react";

interface EarnedBadge {
  badge_id: string;
  earned_at: string;
}

interface BadgeShowcaseProps {
  earnedBadges: EarnedBadge[];
}

interface BadgeDefinition {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  howToEarn: string;
  colors: {
    bg: string;
    border: string;
    text: string;
    glow: string;
  };
}

const BADGES: BadgeDefinition[] = [
  {
    id: "first_share",
    name: "First Share",
    description: "Shared for the first time",
    icon: Share2,
    howToEarn: "Share your referral link on any platform",
    colors: {
      bg: "from-blue-400 to-blue-600",
      border: "border-blue-500",
      text: "text-blue-700",
      glow: "shadow-blue-500/50",
    },
  },
  {
    id: "triple_threat",
    name: "Triple Threat",
    description: "Referred 3 friends",
    icon: Star,
    howToEarn: "Get 3 people to sign up using your link",
    colors: {
      bg: "from-yellow-400 to-yellow-600",
      border: "border-yellow-500",
      text: "text-yellow-700",
      glow: "shadow-yellow-500/50",
    },
  },
  {
    id: "social_butterfly",
    name: "Social Butterfly",
    description: "Shared on 3+ platforms",
    icon: Heart,
    howToEarn: "Share your link on at least 3 different platforms",
    colors: {
      bg: "from-pink-400 to-pink-600",
      border: "border-pink-500",
      text: "text-pink-700",
      glow: "shadow-pink-500/50",
    },
  },
  {
    id: "week_one_og",
    name: "Week One OG",
    description: "Joined in the first week",
    icon: Clock,
    howToEarn: "You got this by joining early!",
    colors: {
      bg: "from-purple-400 to-purple-600",
      border: "border-purple-500",
      text: "text-purple-700",
      glow: "shadow-purple-500/50",
    },
  },
  {
    id: "streak_master",
    name: "Streak Master",
    description: "7-day visit streak",
    icon: Flame,
    howToEarn: "Visit the app for 7 consecutive days",
    colors: {
      bg: "from-red-400 to-orange-600",
      border: "border-red-500",
      text: "text-red-700",
      glow: "shadow-red-500/50",
    },
  },
  {
    id: "verified",
    name: "Verified",
    description: "Verified email",
    icon: Shield,
    howToEarn: "Verify your email address",
    colors: {
      bg: "from-green-400 to-green-600",
      border: "border-green-500",
      text: "text-green-700",
      glow: "shadow-green-500/50",
    },
  },
  {
    id: "super_sharer",
    name: "Super Sharer",
    description: "20+ shares",
    icon: Megaphone,
    howToEarn: "Share your link 20 or more times",
    colors: {
      bg: "from-cyan-400 to-cyan-600",
      border: "border-cyan-500",
      text: "text-cyan-700",
      glow: "shadow-cyan-500/50",
    },
  },
  {
    id: "the_convincer",
    name: "The Convincer",
    description: "50%+ conversion rate",
    icon: Target,
    howToEarn: "Convert 50% of your referrals to signups",
    colors: {
      bg: "from-orange-400 to-orange-600",
      border: "border-orange-500",
      text: "text-orange-700",
      glow: "shadow-orange-500/50",
    },
  },
  {
    id: "early_bird",
    name: "Early Bird",
    description: "First 100 signups",
    icon: Bird,
    howToEarn: "You got this by being in the first 100!",
    colors: {
      bg: "from-amber-400 to-amber-600",
      border: "border-amber-500",
      text: "text-amber-700",
      glow: "shadow-amber-500/50",
    },
  },
  {
    id: "community_builder",
    name: "Community Builder",
    description: "Referral referred someone",
    icon: Network,
    howToEarn: "Get a referral to refer someone else",
    colors: {
      bg: "from-indigo-400 to-indigo-600",
      border: "border-indigo-500",
      text: "text-indigo-700",
      glow: "shadow-indigo-500/50",
    },
  },
];

interface BadgeCardProps {
  badge: BadgeDefinition;
  isEarned: boolean;
  earnedAt?: string;
}

const BadgeCard: React.FC<BadgeCardProps> = ({
  badge,
  isEarned,
  earnedAt,
}) => {
  const IconComponent = badge.icon;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.3 }}
      className="group h-full"
    >
      <div
        className={`relative h-full rounded-2xl overflow-hidden transition-all duration-300 ${
          isEarned
            ? `bg-gradient-to-br ${badge.colors.bg} shadow-lg ${badge.colors.glow}`
            : "bg-gray-200 dark:bg-gray-700"
        }`}
      >
        {/* Earned badge glow effect */}
        {isEarned && (
          <motion.div
            className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full text-center">
          {/* Lock icon for locked badges */}
          {!isEarned && (
            <div className="absolute top-2 right-2">
              <Lock className="w-4 h-4 text-gray-400" />
            </div>
          )}

          {/* Icon */}
          <motion.div
            className={`mb-3 ${
              isEarned ? "text-white" : "text-gray-400"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <IconComponent className="w-8 h-8" />
          </motion.div>

          {/* Name */}
          <h3
            className={`font-bold text-sm mb-1 ${
              isEarned ? "text-white" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {badge.name}
          </h3>

          {/* Description */}
          <p
            className={`text-xs mb-3 ${
              isEarned
                ? "text-white/80"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {badge.description}
          </p>

          {/* Earned date or how to earn */}
          <div
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isEarned
                ? "bg-white/20 text-white"
                : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
            }`}
          >
            {isEarned ? (
              <>
                ✓ Earned {earnedAt && formatDate(earnedAt)}
              </>
            ) : (
              badge.howToEarn
            )}
          </div>
        </div>

        {/* Earned indicator */}
        {isEarned && (
          <motion.div
            className="absolute top-2 left-2"
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xs font-bold text-green-600">✓</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ earnedBadges }) => {
  const earnedBadgeIds = new Set(earnedBadges.map((b) => b.badge_id));
  const earnedBadgeMap = new Map(
    earnedBadges.map((b) => [b.badge_id, b.earned_at])
  );

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Badge Collection</h2>
        <p className="text-white/60">
          Unlock badges as you grow your network and engage with the community
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {BADGES.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <BadgeCard
              badge={badge}
              isEarned={earnedBadgeIds.has(badge.id)}
              earnedAt={earnedBadgeMap.get(badge.id)}
            />
          </motion.div>
        ))}
      </div>

      {/* Stats footer */}
      <motion.div
        className="mt-8 p-6 bg-white/5 backdrop-blur border border-white/10 rounded-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-white">
              {earnedBadges.length}
            </div>
            <div className="text-sm text-white/60">Badges Earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {BADGES.length - earnedBadges.length}
            </div>
            <div className="text-sm text-white/60">Badges Locked</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-white">
              {Math.round((earnedBadges.length / BADGES.length) * 100)}%
            </div>
            <div className="text-sm text-white/60">Complete</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BadgeShowcase;
