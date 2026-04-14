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
  Eye,
  Gift,
  User,
  Check,
  Zap,
  Lock,
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
import {
  TIER_NAMES,
  TIER_THRESHOLDS,
  ONETIME_POINTS,
  REPEATABLE_POINTS,
  DAILY_CAPS,
  COIN_DROPS,
  COMMUNITY_MILESTONES,
  TIER_REWARDS,
} from "@/lib/waitlist-constants";
import RewardsInventory from "@/components/waitlist/RewardsInventory";

interface UserPreviewModeProps {
  onClose: () => void;
}

interface TierData {
  name: string;
  points: number;
  referrals: number;
  badges: string[];
}

const TIER_PREVIEW_DATA: Record<number, TierData> = {
  0: {
    name: "Sarah M.",
    points: 10,
    referrals: 0,
    badges: ["welcome"],
  },
  1: {
    name: "Sarah M.",
    points: 48,
    referrals: 1,
    badges: ["welcome", "first_referral"],
  },
  2: {
    name: "Sarah M.",
    points: 115,
    referrals: 3,
    badges: ["welcome", "first_referral", "social_butterfly"],
  },
  3: {
    name: "Sarah M.",
    points: 195,
    referrals: 5,
    badges: ["welcome", "first_referral", "social_butterfly", "champion"],
  },
  4: {
    name: "Sarah M.",
    points: 358,
    referrals: 10,
    badges: [
      "welcome",
      "first_referral",
      "social_butterfly",
      "champion",
      "super_referrer",
    ],
  },
  5: {
    name: "Sarah M.",
    points: 647,
    referrals: 20,
    badges: [
      "welcome",
      "first_referral",
      "social_butterfly",
      "champion",
      "super_referrer",
      "founding_elite",
    ],
  },
};

const BADGE_NAMES: Record<string, string> = {
  welcome: "Welcome",
  first_referral: "First Referral",
  social_butterfly: "Social Butterfly",
  champion: "Tier 3",
  super_referrer: "Super Referrer",
  founding_elite: "Tier 6",
};

const BADGE_COLORS: Record<string, string> = {
  welcome: "bg-primary/20 text-primary",
  first_referral: "bg-primary/80 text-primary-foreground",
  social_butterfly: "bg-emerald-600 text-white",
  champion: "bg-amber-500 text-white",
  super_referrer: "bg-primary/60 text-white",
  founding_elite: "bg-deep-purple text-white",
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
        <div className="min-h-screen bg-white">
          {/* Preview Mode Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-50 bg-deep-purple text-white shadow-lg"
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
                  <SelectContent className="bg-background">
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
              aria-live="polite"
              aria-label="Preview mode banner"
              animate={{ opacity: [0.5, 0.7, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center text-xs text-white/70 py-1 border-t border-white/10"
            >
              PREVIEW MODE - This is not the real user experience
            </motion.div>
          </motion.div>

          {/* User Dashboard Header */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white border-b border-[#dedede] py-6"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Profile Icon */}
                  <div className="w-12 h-12 rounded-full bg-[#8861d4] flex items-center justify-center text-white font-bold text-lg">
                    {tierData.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-[#121212]">
                      Welcome back, {tierData.name.split(" ")[0]}!
                    </h2>
                    <p className="text-sm text-gray-500">
                      {currentTierName} · {tierData.points} points
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* Coin Balance */}
                  <div className="flex items-center gap-2 bg-[#f3ebf8] px-4 py-2 rounded-full">
                    <span className="text-lg">🪙</span>
                    <span className="font-bold text-[#8861d4]">
                      {selectedTier >= 4 ? 275 : selectedTier >= 2 ? 75 : 0}
                    </span>
                    <span className="text-sm text-[#3b1f59]">coins</span>
                  </div>
                  {/* Inventory Button */}
                  <Button
                    className="bg-[#8861d4] hover:bg-[#7551c4] text-white flex items-center gap-2"
                    onClick={() => {
                      const el = document.getElementById("rewards-inventory-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <Gift className="h-4 w-4" />
                    My Rewards
                  </Button>
                  {/* Profile Icon Button */}
                  <div className="w-10 h-10 rounded-full border-2 border-[#dedede] bg-gray-100 flex items-center justify-center cursor-pointer hover:border-[#8861d4] transition-colors">
                    <User className="h-5 w-5 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2x Power-Up Banner */}
          {selectedTier >= 4 && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 flex items-center justify-between"
            >
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  <span className="font-semibold">2x Referral Power-Up Active!</span>
                  <span className="text-sm opacity-90">We're helping you push to our top tier!</span>
                </div>
                <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">23h left</span>
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier Progress Card */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2"
              >
                <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-sans font-bold text-foreground">
                          Tier Progress
                        </h3>
                        <Badge className="bg-primary/10 text-primary">
                          {currentTierName}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {tierData.points} / {nextTierThreshold || tierData.points} points
                      </p>
                    </div>

                    <div className="relative h-3 bg-border rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(progressPercent, 100)}%`,
                        }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-primary/70"
                      />
                    </div>

                    {nextTierThreshold && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Current Tier</span>
                        <span className="font-semibold text-primary">
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
                <Card className="bg-background border border-border rounded-2xl shadow-sm p-6 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
                      Referrals
                    </p>
                    <p className="text-3xl font-bold text-primary mt-1">
                      {tierData.referrals}
                    </p>
                  </div>
                </Card>
              </motion.div>
            </div>


            {/* Interactive Story Preview - Hero+ tier */}
            {selectedTier >= 3 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 }}>
                <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans font-bold text-foreground">Interactive Story Preview</h3>
                    <Badge className="bg-[#8BA888]/20 text-[#8BA888]">Tier 4 Exclusive</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    As a Hero tier member, you get an exclusive sneak peek at the Story Pros experience. Try an interactive story below!
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border" style={{ aspectRatio: "16/9" }}>
                    <iframe
                      src="https://storyprospreview.lovable.app/preview/story/11111111-1111-1111-1111-111111111111"
                      className="w-full h-full"
                      title="Story Pros Interactive Preview"
                      allow="fullscreen"
                      style={{ minHeight: "500px" }}
                    />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Interactive Story Preview - Locked teaser for lower tiers */}
            {selectedTier < 3 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 }}>
                <Card className="bg-background border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                    <Lock className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="font-semibold text-foreground">Interactive Preview</p>
                    <p className="text-sm text-muted-foreground">Reach Tier 4 (175 pts) to unlock</p>
                  </div>
                  <div className="opacity-20">
                    <h3 className="font-sans font-bold text-foreground mb-4">Interactive Story Preview</h3>
                    <div className="rounded-xl bg-muted h-64" />
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Referral Link Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <h3 className="font-sans font-bold text-foreground mb-4">
                  Your Referral Link
                </h3>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted border border-border rounded-lg px-4 py-3 font-mono text-sm text-foreground">
                    https://empowereddld.com/storypros?ref=SARAH_M_2847
                  </div>
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <h3 className="font-sans font-bold text-foreground mb-4">
                  Share & Earn Referrals
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Button className="bg-foreground hover:bg-foreground/90 text-background flex items-center gap-2">
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
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
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
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <h3 className="font-sans font-bold text-foreground mb-4">
                  Your Referrals
                </h3>
                {tierData.referrals > 0 ? (
                  <div className="space-y-3">
                    {Array.from({ length: tierData.referrals }).map((_, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-muted border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                            {idx + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              Referral {idx + 1}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              25 points earned
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500 text-white">
                          Verified
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-8 w-8 text-border mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No referrals yet. Start sharing to earn points!
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* How to Earn Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <h3 className="font-sans font-bold text-foreground mb-6">
                  How to Earn Points & Coins
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Points Breakdown */}
                  <div>
                    <h4 className="font-semibold text-[#3b1f59] mb-4">Story Coins</h4>
                    <div className="space-y-3">
                      <div className="bg-[#f3ebf8] rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-sm font-medium text-foreground">
                            Reach Tier 3 (100 pts)
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#8861d4]">
                          +{COIN_DROPS[2]} coins
                        </p>
                      </div>
                      <div className="bg-[#f3ebf8] rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-sm font-medium text-foreground">
                             Reach Tier 5 (325 pts)
                           </span>
                        </div>
                        <p className="text-sm font-bold text-[#8861d4]">
                          +{COIN_DROPS[4]} coins
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Earnings Ways */}
                  <div>
                    <h4 className="font-semibold text-[#3b1f59] mb-4">Earn Points</h4>
                    <div className="space-y-2 text-sm">
                      {/* Sign up */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 0 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 0 && <Check className="h-3 w-3" />}
                          Sign up
                        </span>
                        <span className={selectedTier >= 0 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 0 ? "✓ Done" : `${ONETIME_POINTS.SIGNUP} pts (once)`}
                        </span>
                      </div>

                      {/* Verify email */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Verify email
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.VERIFY_EMAIL} pts (once)`}
                        </span>
                      </div>

                      {/* Complete profile */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Complete profile
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.COMPLETE_PROFILE} pts (once)`}
                        </span>
                      </div>

                      {/* Follow Instagram */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Follow Instagram
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.FOLLOW_INSTAGRAM} pts (once)`}
                        </span>
                      </div>

                      {/* Follow Facebook */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Follow Facebook
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.FOLLOW_FACEBOOK} pts (once)`}
                        </span>
                      </div>

                      {/* Subscribe YouTube */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Subscribe YouTube
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.SUBSCRIBE_YOUTUBE} pts (once)`}
                        </span>
                      </div>

                      {/* First share */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 2 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 2 && <Check className="h-3 w-3" />}
                          First share
                        </span>
                        <span className={selectedTier >= 2 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 2 ? "✓ Done" : `${ONETIME_POINTS.FIRST_SHARE} pts (once)`}
                        </span>
                      </div>

                      {/* First referral bonus */}
                      <div className="flex justify-between">
                        <span className={selectedTier >= 2 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 2 && <Check className="h-3 w-3" />}
                          First referral bonus
                        </span>
                        <span className={selectedTier >= 2 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 2 ? "✓ Done" : `${ONETIME_POINTS.FIRST_REFERRAL_BONUS} pts (once)`}
                        </span>
                      </div>

                      <div className="border-t border-border pt-2 mt-2">
                        <div className="flex justify-between">
                          <span className="text-foreground">Refer a friend</span>
                          <span className="font-bold text-[#8861d4]">
                            {REPEATABLE_POINTS.REFERRAL} pts
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground">
                            Share link
                          </span>
                          <span className="font-bold text-[#8861d4]">
                            {REPEATABLE_POINTS.SHARE} pts (max{" "}
                            {DAILY_CAPS.MAX_SHARE_POINTS}/day)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground">Feature suggestion</span>
                          <span className="font-bold text-[#8861d4]">
                            {REPEATABLE_POINTS.SUGGESTION} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Theme Voting */}
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-bold text-foreground">Story Theme Voting</h3>
                  {selectedTier >= 4 ? (
                    <Badge className="bg-emerald-500/20 text-emerald-600">Unlocked</Badge>
                  ) : (
                    <Badge className="bg-gray-200 text-gray-500">Story Champion Pack Required</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Help choose the next Story Pros adventure! Vote for your favorite theme.
                </p>
                <div className="space-y-3">
                  {/* Show 5 theme options with vote counts */}
                  {[
                    { emoji: "🌲", title: "Adventure Quest", votes: 142, pct: 32 },
                    { emoji: "🚀", title: "Space Explorers", votes: 98, pct: 22 },
                    { emoji: "🌊", title: "Ocean Discovery", votes: 87, pct: 20 },
                    { emoji: "🌻", title: "Secret Garden", votes: 73, pct: 16 },
                    { emoji: "🎵", title: "Rhythm & Words", votes: 45, pct: 10 },
                  ].map((theme, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-lg border ${selectedTier >= 4 ? "border-border hover:border-[#8861d4] cursor-pointer" : "border-border opacity-60"}`}>
                      <span className="text-2xl">{theme.emoji}</span>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span className="font-medium text-foreground">{theme.title}</span>
                          <span className="text-sm text-muted-foreground">{theme.votes} votes</span>
                        </div>
                        <div className="h-1.5 bg-border rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-[#8861d4] rounded-full" style={{ width: `${theme.pct}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Badge Showcase */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-sans font-bold text-foreground">
                    Achievements
                  </h3>
                  <span className="text-sm text-muted-foreground">
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
                            ? `${BADGE_COLORS[badge]} border-primary/30`
                            : "bg-muted border-border text-muted-foreground opacity-50"
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
              <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground rounded-2xl shadow-sm p-8">
                <div className="text-center space-y-2">
                  <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                    Your Impact
                  </p>
                  <h3 className="font-sans font-bold text-4xl">
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
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <h3 className="font-sans font-bold text-foreground mb-4">
                  Community Milestones
                </h3>
                <div className="space-y-4">
                  {COMMUNITY_MILESTONES.map((milestone, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-foreground font-medium">
                          {milestone.reward}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          847 / {milestone.target}
                        </span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(847 / milestone.target) * 100}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Upcoming Rewards */}
            {selectedTier < 5 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <Card className="bg-gradient-to-br from-[#f3ebf8] to-white border border-[#8861d4]/20 rounded-2xl shadow-sm p-6">
                  <h3 className="font-sans font-bold text-[#3b1f59] mb-2">
                    Coming at {TIER_NAMES[selectedTier + 1]} ({TIER_THRESHOLDS[selectedTier + 1]} pts)
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    You're {TIER_THRESHOLDS[selectedTier + 1] - tierData.points} points away from your next reward!
                  </p>
                  {/* Show the next tier's reward from TIER_REWARDS */}
                  <div className="bg-white rounded-lg p-4 border border-[#dedede]">
                    <p className="font-semibold text-[#3b1f59]">{TIER_REWARDS[selectedTier + 1]?.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{TIER_REWARDS[selectedTier + 1]?.description}</p>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* Leaderboard */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <h3 className="font-sans font-bold text-foreground mb-4">
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
                      className="flex items-center gap-3 p-3 hover:bg-muted rounded-lg transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {user.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{user.points} points</p>
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

            {/* Rewards Inventory Section */}
            <motion.div
              id="rewards-inventory-section"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="bg-background border border-border rounded-2xl shadow-sm p-6"
            >
              <h3 className="font-sans font-bold text-foreground mb-6">
                Rewards Inventory
              </h3>
              <RewardsInventory
                currentTier={selectedTier}
                coins={
                  selectedTier === 0
                    ? 0
                    : selectedTier === 1
                      ? 0
                      : selectedTier === 2
                        ? 75
                        : selectedTier === 3
                          ? 75
                          : selectedTier === 4
                            ? 275
                            : 275
                }
                badges={tierData.badges}
                inventory={{
                  tier_0_updates: { claimed: true },
                  tier_1_pdf: { claimed: selectedTier >= 1 },
                  tier_2_coins: { claimed: selectedTier >= 2 },
                  tier_3_voice: { claimed: selectedTier >= 3 },
                  tier_4_founder: { claimed: selectedTier >= 4 },
                  tier_5_elite: { claimed: selectedTier >= 5 },
                }}
                onClaimReward={() => {}}
                onRedeemCoinPack={() => {}}
              />
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
