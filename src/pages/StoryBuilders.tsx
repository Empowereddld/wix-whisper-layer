import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useStorybuildersWaitlist } from "@/hooks/useStorybuildersWaitlist";
import { toast } from "sonner";

// Waitlist Components
import {
  AnimatedBackground,
  SocialProofBanner,
  LaunchCountdown,
  PositionCard,
  TierProgressBar,
  ReferralLinkCard,
  SharePanel,
  InviteFriendForm,
  ReferralTracker,
  Leaderboard,
  ActivityFeed,
  CommunityMilestone,
  BadgeShowcase,
  ImpactCounter,
  AlmostThereNudge,
  VerificationBanner,
  ProgressRing,
  NotificationBell,
  ConfettiEffect,
  GlassCard,
  WaitlistFormSkeleton,
  PositionCardSkeleton,
  TierProgressSkeleton,
} from "@/components/waitlist";

const StoryBuilders = () => {
  const state = useStorybuildersWaitlist();
  const {
    joined,
    referralCode,
    inviteCount,
    totalCount,
    points,
    currentTier,
    queuePosition,
    emailVerified,
    badges,
    streakDays,
    shareCount,
    clickCount,
    loading,
    error,
    notifications,
    joinWaitlist,
    refreshStats,
    trackShare,
    resendVerification,
    dismissNotification,
    referralLink,
    tierInfo,
  } = state;

  // Local state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Trigger confetti on join success
  useEffect(() => {
    if (joined && !showConfetti) {
      setShowConfetti(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => setShowConfetti(false), 1000);
    }
  }, [joined, showConfetti]);

  // Handle form submission
  const handleSignup = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formName.trim() || !formEmail.trim()) {
        toast.error("Please fill in all fields");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }

      setFormLoading(true);
      const result = await joinWaitlist(formName, formEmail);
      setFormLoading(false);

      if (result) {
        setFormName("");
        setFormEmail("");
      }
    },
    [joinWaitlist]
  );

  // Get tier info
  const tier = tierInfo();

  return (
    <>
      <SEOHead
        title="Story Builders Launch Team - Viral Waitlist"
        description="Join the Story Builders launch team. Help kids with DLD learn to read and communicate through personalized storytelling."
      />

      {/* ==================== PRE-JOIN MODE ==================== */}
      {!joined ? (
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
          <AnimatedBackground />

          {/* Social Proof Banner */}
          <SocialProofBanner totalJoined={totalCount} dailyJoins={Math.floor(totalCount * 0.15)} />

          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="pt-20 pb-16 text-center"
            >
              <div className="mb-8">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-6">
                  Story Builders
                </h1>
                <p className="text-xl sm:text-2xl text-white/80 mb-4 max-w-3xl mx-auto">
                  The app that helps kids with DLD (Developmental Language Disorder) learn to read and communicate through personalized storytelling.
                </p>
                <p className="text-lg text-white/60 max-w-2xl mx-auto">
                  Built by parents and professionals. Launching soon.
                </p>
              </div>

              {/* Launch Countdown */}
              <div className="mb-16">
                <LaunchCountdown launchDate="2025-06-01" />
              </div>
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Signup Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <GlassCard>
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-white mb-2">Join the Launch Team</h2>
                    <p className="text-white/70 text-sm mb-6">
                      Be among the first to access Story Builders. Earn rewards by inviting others.
                    </p>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-300 text-sm"
                      >
                        {error}
                      </motion.div>
                    )}

                    {loading ? (
                      <WaitlistFormSkeleton />
                    ) : (
                      <form onSubmit={handleSignup} className="space-y-4">
                        {/* Name Input */}
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={formName}
                            onChange={(e) => setFormName(e.target.value)}
                            placeholder="Sarah Johnson"
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            disabled={formLoading}
                          />
                        </div>

                        {/* Email Input */}
                        <div>
                          <label className="block text-white/80 text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={formEmail}
                            onChange={(e) => setFormEmail(e.target.value)}
                            placeholder="sarah@example.com"
                            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            disabled={formLoading}
                          />
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={formLoading}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
                        >
                          {formLoading ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                            />
                          ) : (
                            "Join the Launch Team"
                          )}
                        </Button>
                      </form>
                    )}

                    {/* Trust Section */}
                    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                      <p className="text-white/70 text-xs">
                        We're building the most evidence-based, family-centered app for kids with DLD.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Community & Mission */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Community Milestone */}
                <CommunityMilestone totalParticipants={totalCount} />

                {/* Testimonial Section */}
                <GlassCard>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Our Mission</h3>
                    <div className="space-y-3">
                      <p className="text-white/80 text-sm">
                        DLD affects 1 in 40 kids. Many don't get the support they need. Story Builders changes that.
                      </p>
                      <p className="text-white/70 text-sm">
                        Built by parents who've walked this journey, with guidance from speech-language pathologists and educators, Story Builders makes language development engaging, evidence-based, and fun.
                      </p>
                      <div className="mt-4 p-3 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                        <p className="text-purple-300 text-sm font-semibold">
                          "Every child deserves to tell their story." - Dan & Daria
                        </p>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        /* ==================== POST-JOIN MODE ==================== */
        <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
          <AnimatedBackground />

          {/* Show confetti on first join */}
          {showConfetti && <ConfettiEffect />}

          {/* Social Proof Banner */}
          <SocialProofBanner totalJoined={totalCount} dailyJoins={Math.floor(totalCount * 0.15)} />

          {/* Notification Bell */}
          <div className="fixed top-20 right-4 sm:right-8 z-40">
            <NotificationBell notifications={notifications} onDismiss={dismissNotification} />
          </div>

          {/* Verification Banner */}
          {!emailVerified && (
            <VerificationBanner
              onResend={resendVerification}
              isLoading={loading}
            />
          )}

          {/* Main Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 text-center"
            >
              <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent mb-2">
                Welcome to the Launch Team!
              </h1>
              <p className="text-white/70 text-lg">
                You're helping shape the future of language learning for kids with DLD.
              </p>
            </motion.div>

            {/* Section 1: Your Impact */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Your Impact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Position Card */}
                <div>
                  {loading || !queuePosition ? (
                    <PositionCardSkeleton />
                  ) : (
                    <PositionCard
                      position={queuePosition}
                      totalUsers={totalCount}
                      points={points}
                      tier={currentTier}
                      tierName={tier.name}
                    />
                  )}
                </div>

                {/* Tier Progress Bar */}
                <div className="md:col-span-2">
                  {loading ? (
                    <TierProgressSkeleton />
                  ) : (
                    <TierProgressBar currentPoints={points} currentTier={currentTier} />
                  )}
                </div>

                {/* Almost There Nudge */}
                {currentTier < 5 && points > tier.nextTierThreshold! * 0.75 && (
                  <div>
                    <AlmostThereNudge
                      nextTierName={tier.name}
                      nextReward={`Reward for ${tier.name}`}
                      referralLink={referralLink}
                    />
                  </div>
                )}

                {/* Progress Ring */}
                <div>
                  <ProgressRing
                    currentPoints={points}
                    nextTierPoints={tier.nextTierThreshold || 510}
                    nextTierName={tier.name}
                  />
                </div>

                {/* Impact Counter */}
                <div className="md:col-span-2">
                  <ImpactCounter referralCount={inviteCount} />
                </div>
              </div>
            </motion.div>

            {/* Section 2: Grow Your Team */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Grow Your Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Referral Link Card */}
                <div>
                  <ReferralLinkCard
                    referralLink={referralLink}
                    stats={{
                      clicks: clickCount,
                      signups: inviteCount,
                    }}
                  />
                </div>

                {/* Share Panel */}
                <div className="md:col-span-2">
                  <SharePanel
                    referralLink={referralLink}
                    onShare={(platform) => trackShare(platform)}
                  />
                </div>

                {/* Invite Friend Form */}
                <div className="lg:col-span-2">
                  <InviteFriendForm
                    referralCode={referralCode}
                    userName={formName || "Friend"}
                  />
                </div>

                {/* Referral Tracker */}
                <div>
                  <ReferralTracker inviteCount={inviteCount} />
                </div>
              </div>
            </motion.div>

            {/* Section 3: Community */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Community</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Leaderboard */}
                <div>
                  <Leaderboard />
                </div>

                {/* Activity Feed */}
                <div>
                  <ActivityFeed />
                </div>
              </div>

              {/* Community Milestone */}
              <div className="mt-6">
                <CommunityMilestone totalParticipants={totalCount} />
              </div>
            </motion.div>

            {/* Section 4: Your Achievements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Your Achievements</h2>
              <BadgeShowcase
                earnedBadges={badges.map((badge) => ({
                  badge_id: badge,
                  earned_at: new Date().toISOString(),
                }))}
              />
            </motion.div>
          </div>
        </div>
      )}
    </>
  );
};

export default StoryBuilders;
