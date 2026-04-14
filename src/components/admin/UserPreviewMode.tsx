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
  Instagram,
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
  TIER_REWARDS,
  SOCIAL_LINKS,
} from "@/lib/waitlist-constants";
import RewardsInventory from "@/components/waitlist/RewardsInventory";
import storyPreviewBg from "@/assets/story-preview-bg.png";

interface UserPreviewModeProps {
  onClose: () => void;
}

interface TierData {
  name: string;
  points: number;
  referrals: number;
}

const TIER_PREVIEW_DATA: Record<number, TierData> = {
  0: { name: "Sarah M.", points: 10, referrals: 0 },
  1: { name: "Sarah M.", points: 48, referrals: 1 },
  2: { name: "Sarah M.", points: 115, referrals: 3 },
  3: { name: "Sarah M.", points: 195, referrals: 5 },
  4: { name: "Sarah M.", points: 358, referrals: 10 },
  5: { name: "Sarah M.", points: 647, referrals: 20 },
};

const TIER_REWARD_COLORS = [
  { bg: "rgba(136, 97, 212, 0.08)", border: "rgba(136, 97, 212, 0.25)", accent: "#8861d4" },
  { bg: "rgba(136, 97, 212, 0.12)", border: "rgba(136, 97, 212, 0.3)", accent: "#7b52c9" },
  { bg: "rgba(99, 179, 141, 0.1)", border: "rgba(99, 179, 141, 0.3)", accent: "#63b38d" },
  { bg: "rgba(212, 146, 11, 0.1)", border: "rgba(212, 146, 11, 0.3)", accent: "#d4920b" },
  { bg: "rgba(59, 31, 89, 0.1)", border: "rgba(59, 31, 89, 0.3)", accent: "#3b1f59" },
  { bg: "rgba(212, 175, 55, 0.12)", border: "rgba(212, 175, 55, 0.35)", accent: "#d4af37" },
];

const UserPreviewMode = ({ onClose }: UserPreviewModeProps) => {
  const [selectedTier, setSelectedTier] = useState(0);
  const [followedPlatforms, setFollowedPlatforms] = useState<Record<string, boolean>>({});
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

  const handleFollowClick = (platform: string, url: string) => {
    window.open(url, "_blank");
    setFollowedPlatforms((prev) => ({ ...prev, [platform]: true }));
  };

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
                  <div className="flex items-center gap-2 bg-[#f3ebf8] px-4 py-2 rounded-full">
                    <span className="text-lg">🪙</span>
                    <span className="font-bold text-[#8861d4]">
                      {selectedTier >= 4 ? 275 : selectedTier >= 2 ? 75 : 0}
                    </span>
                    <span className="text-sm text-[#3b1f59]">coins</span>
                  </div>
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

            {/* Rewards Inventory */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6 relative overflow-hidden">
                {/* Low opacity background image */}
                <div
                  className="absolute inset-0 opacity-[0.04] bg-center bg-no-repeat bg-contain pointer-events-none"
                  style={{ backgroundImage: `url(${storyPreviewBg})` }}
                />
                <div className="relative z-10">
                  <RewardsInventory
                    currentTier={selectedTier}
                    coins={TIER_PREVIEW_DATA[selectedTier].points * 2}
                    badges={[]}
                    inventory={{}}
                    onClaimReward={() => {}}
                    onRedeemCoinPack={() => {}}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Interactive Story Preview - Hero+ tier */}
            {selectedTier >= 3 && (
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.75 }}>
                <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans font-bold text-foreground">Interactive Story Preview</h3>
                    <Badge className="bg-primary/20 text-primary">Tier 4 Exclusive</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    As a Hero tier member, you get an exclusive sneak peek at the Story Pros experience. Try an interactive story below!
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border">
                     <iframe
                      src="https://storyprospreview.lovable.app/preview/story/11111111-1111-1111-1111-111111111111"
                      className="w-full"
                      title="Story Pros Interactive Preview"
                      allow="fullscreen"
                      style={{ height: "900px" }}
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
                    <p className="text-sm text-muted-foreground">Reach Tier 4 ({TIER_THRESHOLDS[3]} pts) to unlock</p>
                  </div>
                  <div className="opacity-20">
                    <h3 className="font-sans font-bold text-foreground mb-4">Interactive Story Preview</h3>
                    <div className="rounded-xl overflow-hidden" style={{ height: "400px" }}>
                      <img src={storyPreviewBg} alt="" className="w-full h-full object-cover" />
                    </div>
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
                  <Button className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:opacity-90 text-white flex items-center gap-2">
                    <Instagram className="h-4 w-4" />
                    <span className="hidden sm:inline">Instagram</span>
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2">
                    <Copy className="h-4 w-4" />
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Follow Us Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              <Card className="bg-background border border-border rounded-2xl shadow-sm p-6">
                <h3 className="font-sans font-bold text-foreground mb-2">
                  Follow Us & Earn Points
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Follow us on social media to earn bonus points per platform!
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "instagram", label: "Instagram", icon: Instagram, color: "bg-gradient-to-r from-purple-500 via-pink-500 to-red-500", url: SOCIAL_LINKS.INSTAGRAM, points: ONETIME_POINTS.FOLLOW_INSTAGRAM },
                    { id: "facebook", label: "Facebook", icon: Facebook, color: "bg-[#1877F2]", url: SOCIAL_LINKS.FACEBOOK, points: ONETIME_POINTS.FOLLOW_FACEBOOK },
                    { id: "youtube", label: "YouTube", icon: () => <span className="text-lg">▶️</span>, color: "bg-red-600", url: SOCIAL_LINKS.YOUTUBE, points: ONETIME_POINTS.SUBSCRIBE_YOUTUBE },
                  ].map((social) => {
                    const isFollowed = followedPlatforms[social.id];
                    const Icon = social.icon;
                    return (
                      <Button
                        key={social.id}
                        onClick={() => handleFollowClick(social.id, social.url)}
                        disabled={isFollowed}
                        className={`h-12 rounded-xl flex items-center justify-center gap-2 text-white font-medium transition-all ${
                          isFollowed ? "bg-emerald-500/20 border border-emerald-500/50 text-emerald-600" : `${social.color} hover:opacity-90`
                        } disabled:opacity-100`}
                      >
                        {isFollowed ? (
                          <Check className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                        <span className="hidden sm:inline text-sm">
                          {isFollowed ? `+${social.points} pts ✓` : `${social.label} (+${social.points})`}
                        </span>
                      </Button>
                    );
                  })}
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
                            Reach Tier 3 ({TIER_THRESHOLDS[2]} pts)
                          </span>
                        </div>
                        <p className="text-sm font-bold text-[#8861d4]">
                          +{COIN_DROPS[2]} coins
                        </p>
                      </div>
                      <div className="bg-[#f3ebf8] rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-sm font-medium text-foreground">
                             Reach Tier 5 ({TIER_THRESHOLDS[4]} pts)
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
                      <div className="flex justify-between">
                        <span className={selectedTier >= 0 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 0 && <Check className="h-3 w-3" />}
                          Sign up
                        </span>
                        <span className={selectedTier >= 0 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 0 ? "✓ Done" : `${ONETIME_POINTS.SIGNUP} pts (once)`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Verify email
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.VERIFY_EMAIL} pts (once)`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Complete profile
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.COMPLETE_PROFILE} pts (once)`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Follow Instagram
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.FOLLOW_INSTAGRAM} pts (once)`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Follow Facebook
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.FOLLOW_FACEBOOK} pts (once)`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className={selectedTier >= 1 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 1 && <Check className="h-3 w-3" />}
                          Subscribe YouTube
                        </span>
                        <span className={selectedTier >= 1 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 1 ? "✓ Done" : `${ONETIME_POINTS.SUBSCRIBE_YOUTUBE} pts (once)`}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className={selectedTier >= 2 ? "text-emerald-600 flex items-center gap-1" : "text-foreground"}>
                          {selectedTier >= 2 && <Check className="h-3 w-3" />}
                          First share
                        </span>
                        <span className={selectedTier >= 2 ? "font-bold text-emerald-500" : "font-bold text-[#8861d4]"}>
                          {selectedTier >= 2 ? "✓ Done" : `${ONETIME_POINTS.FIRST_SHARE} pts (once)`}
                        </span>
                      </div>

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
                  <div className="bg-white rounded-lg p-4 border border-[#dedede]">
                    <p className="font-semibold text-[#3b1f59]">{TIER_REWARDS[selectedTier + 1]?.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{TIER_REWARDS[selectedTier + 1]?.description}</p>
                  </div>
                </Card>
              </motion.div>
            )}


            {/* Bottom Spacing */}
            <div className="h-8" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserPreviewMode;
