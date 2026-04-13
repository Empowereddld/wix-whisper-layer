import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronDown,
  Copy,
  Share2,
  Facebook,
  Twitter,
  Mail,
  Link as LinkIcon,
  Flame,
  Award,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getTierName, getTierColor } from "@/lib/waitlist-utils";
import { TIER_NAMES, TIER_THRESHOLDS } from "@/lib/waitlist-constants";

interface UserPreviewModeProps {
  onClose: () => void;
}

interface TierData {
  name: string;
  points: number;
  position: number;
  referrals: number;
  badges: string[];
  streakDays: number;
}

const TIER_PREVIEW_DATA: Record<number, TierData> = {
  0: {
    name: "Sarah M.",
    points: 10,
    position: 847,
    referrals: 0,
    badges: ["welcome"],
    streakDays: 1,
  },
  1: {
    name: "Sarah M.",
    points: 42,
    position: 312,
    referrals: 1,
    badges: ["welcome", "first_referral"],
    streakDays: 5,
  },
  2: {
    name: "Sarah M.",
    points: 98,
    position: 89,
    referrals: 3,
    badges: ["welcome", "first_referral", "social_butterfly"],
    streakDays: 12,
  },
  3: {
    name: "Sarah M.",
    points: 156,
    position: 34,
    referrals: 5,
    badges: ["welcome", "first_referral", "social_butterfly", "champion"],
    streakDays: 21,
  },
  4: {
    name: "Sarah M.",
    points: 289,
    position: 8,
    referrals: 10,
    badges: [
      "welcome",
      "first_referral",
      "social_butterfly",
      "champion",
      "streak_master",
      "super_referrer",
    ],
    streakDays: 35,
  },
  5: {
    name: "Sarah M.",
    points: 547,
    position: 2,
    referrals: 20,
    badges: [
      "welcome",
      "first_referral",
      "social_butterfly",
      "champion",
      "streak_master",
      "super_referrer",
      "founding_elite",
    ],
    streakDays: 60,
  },
};

const BADGE_NAMES: Record<string, string> = {
  welcome: "Welcome",
  first_referral: "First Referral",
  social_butterfly: "Social Butterfly",
  champion: "Champion",
  streak_master: "Streak Master",
  super_referrer: "Super Referrer",
  founding_elite: "Founding Elite",
};

const BADGE_COLORS: Record<string, string> = {
  welcome: "bg-[#D4A574] text-[#3D2B1F]",
  first_referral: "bg-[#C67B5C] text-white",
  social_butterfly: "bg-[#8BA888] text-white",
  champion: "bg-[#D4920B] text-white",
  streak_master: "bg-[#C4A0A0] text-white",
  super_referrer: "bg-[#8B7355] text-white",
  founding_elite: "bg-[#3D2B1F] text-white",
};

const UserPreviewMode = ({ onClose }: UserPreviewModeProps) => {
  const [selectedTier, setSelectedTier] = useState(0);
  const tierData = TIER_PREVIEW_DATA[selectedTier];
  const currentTierName = getTierName(selectedTier);
  const nextTierThreshold = TIER_THRESHOLDS[selectedTier + 1];
  const currentThreshold = TIER_THRESHOLDS[selectedTier];
  const pointsInTier = tierData.points - currentThreshold;
  const pointsNeeded = nextTierThreshold
    ? nextTierThreshold - currentThreshold
    : 0;
  const progressPercent =
    nextTierThreshold && pointsNeeded > 0
      ? (pointsInTier / pointsNeeded) * 100
      : 100;

  const allBadges = Object.keys(BADGE_NAMES);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 overflow-y-auto"
      >
        <div className="min-h-screen bg-[#FDF8F0]">
          {/* Preview Mode Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 bg-[#3D2B1F] text-white shadow-lg"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5" />
                <span className="font-semibold">
                  Previewing as: {currentTierName} User
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Select value={String(selectedTier)} onValueChange={(v) => setSelectedTier(Number(v))}>
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#FEFCF9]">
                    {TIER_NAMES.map((name, idx) => (
                      <SelectItem key={idx} value={String(idx)}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                  size="sm"
                >
                  <X className="h-4 w-4" />
                  Exit Preview
                </Button>
              </div>
            </div>

            {/* Preview Mode Watermark Banner */}
            <motion.div
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center text-xs text-white/70 py-1 border-t border-white/10"
            >
              PREVIEW MODE - This is not the real user experience
            </motion.div>
          </motion.div>

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            {/* Position Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-gradient-to-br from-[#FEFCF9] to-[#F5F0E8] border border-[#E8DDD0] rounded-2xl shadow-sm overflow-hidden">
                <div className="p-8 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#8B7355] uppercase tracking-wide">
                      Queue Position
                    </p>
                    <h2 className="text-5xl font-serif italic text-[#3D2B1F] mt-2">
                      #{tierData.position.toLocaleString()}
                    </h2>
                    <p className="text-sm text-[#8B7355] mt-2">
                      of 1,247 waitlist members
                    </p>
                  </div>
                  <div className="text-right">
                    <TrendingUp className="h-12 w-12 text-[#C67B5C] mb-2 ml-auto" />
                    <p className="text-2xl font-bold text-[#C67B5C]">
                      {Math.round((tierData.position / 1247) * 100)}%
                    </p>
                    <p className="text-xs text-[#8B7355]">ahead of queue</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier Progress Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2"
              >
                <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-serif italic text-[#3D2B1F] font-semibold">
                          Tier Progress
                        </h3>
                        <Badge className="bg-[#D4A574] text-[#3D2B1F]">
                          {currentTierName}
                        </Badge>
                      </div>
                      <p className="text-sm text-[#8B7355]">
                        {tierData.points} / {nextTierThreshold || tierData.points} points
                      </p>
                    </div>

                    <div className="relative h-3 bg-[#E8DDD0] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(progressPercent, 100)}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-[#C67B5C] to-[#D4A574]"
                      />
                    </div>

                    {nextTierThreshold && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8B7355]">Current Tier</span>
                        <span className="font-semibold text-[#C67B5C]">
                          {nextTierThreshold - tierData.points} points to next tier
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Quick Stats Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6 space-y-4">
                  <div>
                    <p className="text-xs text-[#8B7355] uppercase tracking-wide font-semibold">
                      Referrals
                    </p>
                    <p className="text-3xl font-bold text-[#C67B5C] mt-1">
                      {tierData.referrals}
                    </p>
                  </div>
                  <div className="border-t border-[#E8DDD0] pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Flame className="h-4 w-4 text-[#D4A574]" />
                      <p className="text-xs text-[#8B7355] uppercase tracking-wide font-semibold">
                        Streak
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-[#D4A574]">
                      {tierData.streakDays}
                    </p>
                    <p className="text-xs text-[#8B7355]">days</p>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Referral Link Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
                <h3 className="font-serif italic text-[#3D2B1F] font-semibold mb-4">
                  Your Referral Link
                </h3>
                <div className="flex gap-2">
                  <div className="flex-1 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg px-4 py-3 font-mono text-sm text-[#5C4033]">
                    https://storybuilders.co/?ref=SARAH_M_2847
                  </div>
                  <Button
                    className="bg-[#C67B5C] hover:bg-[#B86B4C] text-white"
                    size="sm"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Share Panel */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
                <h3 className="font-serif italic text-[#3D2B1F] font-semibold mb-4">
                  Share & Earn Referrals
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button className="bg-[#3D2B1F] hover:bg-[#2B1F15] text-white flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    <span className="hidden sm:inline">Twitter</span>
                  </Button>
                  <Button className="bg-[#1877F2] hover:bg-[#0A66C2] text-white flex items-center gap-2">
                    <Facebook className="h-4 w-4" />
                    <span className="hidden sm:inline">Facebook</span>
                  </Button>
                  <Button className="bg-[#EA4335] hover:bg-[#C5221F] text-white flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="hidden sm:inline">Email</span>
                  </Button>
                  <Button className="bg-[#25D366] hover:bg-[#128C7E] text-white flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </Button>
                  <Button className="bg-[#0A8FDC] hover:bg-[#0971F2] text-white flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">LinkedIn</span>
                  </Button>
                  <Button className="bg-[#8B7355] hover:bg-[#6B5345] text-white flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Referral Tracker */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
                <h3 className="font-serif italic text-[#3D2B1F] font-semibold mb-4">
                  Your Referrals
                </h3>
                {tierData.referrals > 0 ? (
                  <div className="space-y-3">
                    {Array.from({ length: tierData.referrals }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#D4A574] flex items-center justify-center text-[#3D2B1F] font-semibold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#3D2B1F]">
                              Referral {idx + 1}
                            </p>
                            <p className="text-xs text-[#8B7355]">
                              25 points earned
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-[#7CB342] text-white">
                          Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-[#E8DDD0] mx-auto mb-2" />
                    <p className="text-sm text-[#8B7355]">
                      No referrals yet. Start sharing to earn points!
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Badge Showcase */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif italic text-[#3D2B1F] font-semibold">
                    Achievements
                  </h3>
                  <span className="text-sm text-[#8B7355]">
                    {tierData.badges.length} of {allBadges.length}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {allBadges.map((badge) => {
                    const isEarned = tierData.badges.includes(badge);
                    return (
                      <motion.div
                        key={badge}
                        whileHover={isEarned ? { scale: 1.05 } : {}}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          isEarned
                            ? `${BADGE_COLORS[badge]} border-[#D4A574]`
                            : "bg-[#F5F0E8] border-[#E8DDD0] text-[#8B7355] opacity-50"
                        }`}
                      >
                        <Award className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-xs font-semibold">
                          {BADGE_NAMES[badge]}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            {/* Impact Counter */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gradient-to-br from-[#D4A574] to-[#C67B5C] text-white rounded-2xl shadow-sm p-8">
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                    Your Impact
                  </p>
                  <h3 className="font-serif italic text-4xl font-bold">
                    {Math.min(tierData.referrals * 5, 120)} Families
                  </h3>
                  <p className="text-sm opacity-90">
                    discovered Story Pros because of you
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Community Milestone Progress */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
                <h3 className="font-serif italic text-[#3D2B1F] font-semibold mb-4">
                  Community Milestones
                </h3>
                <div className="space-y-4">
                  {[
                    { target: 500, label: "Unlock community Discord" },
                    { target: 1000, label: "Early beta access for everyone" },
                    { target: 2500, label: "Free first month for all" },
                  ].map((milestone, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-[#5C4033] font-medium">
                          {milestone.label}
                        </span>
                        <span className="text-xs text-[#8B7355]">
                          847 / {milestone.target}
                        </span>
                      </div>
                      <div className="h-2 bg-[#E8DDD0] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(847 / milestone.target) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#8BA888] to-[#7CB342]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Leaderboard */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="bg-[#FEFCF9] border border-[#E8DDD0] rounded-2xl shadow-sm p-6">
                <h3 className="font-serif italic text-[#3D2B1F] font-semibold mb-4">
                  Top Referrers
                </h3>
                <div className="space-y-2">
                  {[
                    { name: "Alex Chen", points: 847, tier: 5 },
                    { name: "Maria Rodriguez", points: 756, tier: 4 },
                    { name: "James Wilson", points: 623, tier: 4 },
                    { name: "Sofia Patel", points: 512, tier: 4 },
                    { name: "Marcus Johnson", points: 498, tier: 3 },
                    { name: "Emma Thompson", points: 445, tier: 3 },
                    { name: "David Kim", points: 389, tier: 3 },
                    { name: "Lisa Anderson", points: 367, tier: 2 },
                    { name: "Omar Hassan", points: 298, tier: 2 },
                    { name: "Nina Volkov", points: 267, tier: 2 },
                  ].map((user, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.0 + idx * 0.05 }}
                      className="flex items-center gap-3 p-3 hover:bg-[#F5F0E8] rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#D4A574] flex items-center justify-center text-[#3D2B1F] font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#3D2B1F]">
                          {user.name}
                        </p>
                        <p className="text-xs text-[#8B7355]">{user.points} points</p>
                      </div>
                      <Badge
                        style={{
                          backgroundColor:
                            getTierColor(user.tier) + "20",
                          color: getTierColor(user.tier),
                        }}
                      >
                        {getTierName(user.tier)}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Bottom Spacing */}
            <div className="h-8" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserPreviewMode;
