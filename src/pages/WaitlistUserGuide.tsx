import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Copy, Share2, Award, Zap, Users, Heart, Gift, Trophy, Sparkles, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import {
  TIER_NAMES,
  TIER_COLORS,
  TIER_REFERRALS,
  TIER_REWARDS,
  COMMUNITY_MILESTONES,
  POINTS,
} from "@/lib/waitlist-constants";
import { glass, gradients, animations, typography } from "@/lib/glassmorphism";
import { toast } from "sonner";

const WaitlistUserGuide = () => {
  const navigate = useNavigate();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const getTierIcon = (index: number) => {
    const icons = [
      <Sparkles className="w-8 h-8" />,
      <Heart className="w-8 h-8" />,
      <Zap className="w-8 h-8" />,
      <Trophy className="w-8 h-8" />,
      <Award className="w-8 h-8" />,
      <Crown className="w-8 h-8" />,
    ];
    return icons[index] || icons[0];
  };

  const badges = [
    { name: "Welcome!", description: "Joined the Launch Team", icon: "👋" },
    { name: "Email Verified", description: "Confirmed your email address", icon: "✓" },
    { name: "Referral Master", description: "Referred 5+ people", icon: "🎯" },
    { name: "Social Butterfly", description: "Shared on multiple platforms", icon: "🦋" },
    { name: "Streak Champion", description: "Earned a 7-day activity streak", icon: "🔥" },
    { name: "Community Builder", description: "Helped reach a community milestone", icon: "🏗️" },
    { name: "Super Sharer", description: "30+ successful shares", icon: "📢" },
    { name: "Engaged Parent", description: "Made a story suggestion", icon: "💭" },
  ];

  const proTips = [
    {
      title: "Share with Parent Support Groups",
      description: "Post your referral link in Facebook groups, WhatsApp chats, and parent communities. DLD parents help each other!",
      icon: "👥",
    },
    {
      title: "Tell Your Speech Therapist",
      description: "Your speech-language pathologist can share Story Builders with other families. They know people who need it!",
      icon: "🗣️",
    },
    {
      title: "Bring the QR Code to Events",
      description: "Take the QR code to DLD support events, parent conferences, and therapy team meetings.",
      icon: "📱",
    },
    {
      title: "Email Your Network",
      description: "A personal email from you is more trusted than a post. Include a quick sentence about why it matters to your family.",
      icon: "📧",
    },
    {
      title: "Share Your Story",
      description: "Tell people how Story Builders helps your child. Real stories are the most powerful marketing!",
      icon: "📖",
    },
    {
      title: "Check Daily for Streak Bonuses",
      description: "Visit even if you don't share — maintain your streak for 3 bonus points per day!",
      icon: "⭐",
    },
  ];

  const faqItems = [
    {
      q: "What is Story Builders?",
      a: "Story Builders is an innovative educational app designed specifically for children with Developmental Language Disorder (DLD). It uses interactive storytelling to help kids build language skills, confidence, and creativity in a fun, judgment-free environment.",
    },
    {
      q: "When will Story Builders launch?",
      a: "We're in final beta testing! The exact launch date will be announced to all waitlist members first. Being on the waitlist guarantees you'll get in on day one.",
    },
    {
      q: "How do tier rewards work?",
      a: "As you earn points through referrals and sharing, you automatically advance through tiers. Each tier unlocks exclusive rewards! You don't need to do anything special — the system tracks everything automatically.",
    },
    {
      q: "Can I earn points without referring friends?",
      a: "Absolutely! You can earn points by verifying your email (5 pts), sharing on social media (2 pts), clicking engagement links (1 pt), suggesting stories (5 pts), and maintaining activity streaks (3 pts/day). Referrals give the most points, but they're not required.",
    },
    {
      q: "What happens to my tier after launch?",
      a: "Your tier status carries through to launch! Founding Elite members get lifetime founder pricing and recognition on our website. All other tier members get special launch bonuses and exclusive content.",
    },
    {
      q: "Can I share the same referral link multiple times?",
      a: "Yes! Your referral link never expires. Share it as many times as you want on different platforms and to different people. Each person who signs up through your link counts toward your tier.",
    },
    {
      q: "How is the leaderboard determined?",
      a: "The leaderboard ranks members by total points earned. It's not just about referrals — sharing, streaks, and other activities all count toward your position!",
    },
    {
      q: "Will my referrals know I referred them?",
      a: "They'll see 'Referred by [Your Name]' when they sign up, but we don't share contact information. It's just a fun acknowledgment of who brought them to the community.",
    },
    {
      q: "What if I want to update my email?",
      a: "Contact support@storybuilders.com and we'll update your account for you. Your points and tier status will transfer to your new email.",
    },
    {
      q: "Are rewards just for early access, or do they persist?",
      a: "Most rewards persist! Founder pricing is lifetime. Website recognition is permanent. Some rewards like the podcast are one-time access, but they're always yours to enjoy.",
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <SEOHead
        title="Waitlist User Guide | Story Builders"
        description="Learn how to maximize your position on the Story Builders launch team, earn rewards, and make the most of our referral system."
      />

      <div className="min-h-screen bg-[#FDF8F0] text-[#5C4033] overflow-hidden">
        {/* Earthy background */}
        <div className="fixed inset-0 pointer-events-none opacity-5 bg-gradient-to-br from-[#8B7355] via-[#D4920B] to-[#C67B5C]" />

        {/* Header */}
        <motion.div
          className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => navigate("/storybuilders")}
              variant="ghost"
              className="mb-8 text-[#C67B5C] hover:text-[#3D2B1F]"
            >
              ← Back to Waitlist
            </Button>
            <h1 className={`text-4xl font-bold font-serif italic mb-4 text-[#3D2B1F]`}>
              Your Story Builders Launch Team Playbook
            </h1>
            <p className={`text-lg max-w-3xl text-[#8B7355]`}>
              Welcome to the exclusive community of early supporters! This guide will show you how to maximize your position, unlock rewards, and help other families discover Story Builders.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Section 1: Welcome */}
          <motion.section
            className={`mb-16 p-8 rounded-2xl bg-[#FEFCF9] border border-[#E8DDD0]`}
            {...animations.fadeInUp}
          >
            <div className="flex items-start gap-4 mb-4">
              <Heart className="w-8 h-8 text-[#C67B5C] flex-shrink-0 mt-1" />
              <div>
                <h2 className={`text-2xl font-bold font-serif italic mb-3 text-[#3D2B1F]`}>Welcome to the Launch Team</h2>
                <p className={`text-base mb-4 text-[#5C4033]`}>
                  You're part of something special. Story Builders is an educational app designed with love for children with Developmental Language Disorder. We're building a community where kids feel celebrated for who they are, not measured by what they can't do yet.
                </p>
                <p className={`text-base text-[#5C4033]`}>
                  Early supporters like you are helping shape the future of language learning. Your referrals, feedback, and enthusiasm matter more than you know. Together, we're creating a movement to support families navigating DLD.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Tier System */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>The Tier System: Your Path to Rewards</h2>
            <p className={`text-base text-[#8B7355] mb-8`}>
              Earn points through referrals, sharing, and engagement. Watch your tier climb and unlock exclusive rewards at each level.
            </p>

            <div className="space-y-4">
              {TIER_NAMES.map((tier, index) => (
                <motion.div
                  key={tier}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-102 bg-[#FEFCF9]`}
                  style={{
                    borderColor: TIER_COLORS[index],
                  }}
                  whileHover={{ x: 8 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${TIER_COLORS[index]}20` }}
                    >
                      {getTierIcon(index)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-1 text-[#3D2B1F]">{tier}</h3>
                      <p className="text-sm text-[#8B7355]">
                        {TIER_REFERRALS[index]} referral{TIER_REFERRALS[index] !== 1 ? "s" : ""} required
                      </p>
                    </div>
                    {index > 0 && (
                      <div className="text-right">
                        <div className="text-3xl font-bold" style={{ color: TIER_COLORS[index] }}>
                          {TIER_REFERRALS[index]}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[#5C4033] ml-16">{TIER_REWARDS[index]}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 3: How to Earn Points */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>How to Earn Points</h2>
            <p className={`text-base text-[#8B7355] mb-8`}>
              There are many ways to earn points — referrals give the most, but every action counts!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Join the Waitlist", points: POINTS.SIGNUP, emoji: "👋" },
                { label: "Verify Email", points: POINTS.VERIFY_EMAIL, emoji: "✓" },
                { label: "Refer a Friend", points: POINTS.REFERRAL, emoji: "🎯" },
                { label: "Share on Social", points: POINTS.SHARE, emoji: "📢" },
                { label: "Click a Link", points: POINTS.CLICK, emoji: "🖱️" },
                { label: "Suggest a Story", points: POINTS.SUGGESTION, emoji: "💭" },
                { label: "Daily Streak Bonus", points: POINTS.STREAK_BONUS, emoji: "🔥" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-xl bg-[#FEFCF9] border border-[#E8DDD0] flex items-center justify-between`}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="font-semibold text-[#5C4033]">{item.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#D4920B]">+{item.points}</div>
                </motion.div>
              ))}
            </div>

            <motion.div className={`mt-8 p-6 rounded-xl bg-[#FEFCF9] border border-[#E8DDD0]`} whileHover={{ scale: 1.02 }}>
              <Sparkles className="w-5 h-5 text-[#D4920B] inline mr-2" />
              <span className="text-[#5C4033]">
                <strong>Pro Tip:</strong> Maintain a daily streak by visiting even if you don't share. You'll earn 3 bonus points every day you check in!
              </span>
            </motion.div>
          </motion.section>

          {/* Section 4: Sharing Your Referral Link */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>Sharing Your Referral Link</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div className={`p-6 rounded-2xl bg-[#FEFCF9] border border-[#E8DDD0]`}>
                <h3 className="text-xl font-bold mb-4 text-[#3D2B1F]">Your Link</h3>
                <div className={`p-4 rounded-lg bg-[#FDF8F0] border border-[#E8DDD0] mb-4 font-mono text-sm break-all text-[#5C4033]`}>
                  https://storybuilders.com?ref=YOUR_CODE
                </div>
                <Button
                  onClick={() => copyToClipboard("https://storybuilders.com?ref=YOUR_CODE")}
                  className="w-full bg-[#C67B5C] hover:bg-[#A85A48] text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </motion.div>

              <motion.div className={`p-6 rounded-2xl bg-[#FEFCF9] border border-[#E8DDD0]`}>
                <h3 className="text-xl font-bold mb-4 text-[#3D2B1F]">Share on Platforms</h3>
                <div className="space-y-3">
                  {["Facebook", "WhatsApp", "Email", "Text Message"].map((platform, idx) => (
                    <Button key={idx} variant="outline" className="w-full text-left justify-start border-[#E8DDD0] text-[#5C4033] hover:bg-[#F5EDE3]">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on {platform}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div className={`p-8 rounded-2xl bg-[#FEFCF9] border border-[#E8DDD0]`}>
              <h3 className="text-xl font-bold mb-4 text-[#3D2B1F]">Sample Messages</h3>
              <div className="space-y-4">
                <div className="bg-[#F5EDE3] p-4 rounded-lg border border-[#E8DDD0]">
                  <p className="text-sm text-[#8B7355] mb-2">For Parent Groups:</p>
                  <p className="text-[#5C4033]">
                    "I'm so excited about Story Builders — an app designed specifically for kids with language challenges. If you know families navigating DLD, check this out! <strong>storybuilders.com?ref=YOUR_CODE</strong>"
                  </p>
                </div>
                <div className="bg-[#F5EDE3] p-4 rounded-lg border border-[#E8DDD0]">
                  <p className="text-sm text-[#8B7355] mb-2">For Therapist/Educator Referrals:</p>
                  <p className="text-[#5C4033]">
                    "I'm part of the launch team for Story Builders, an educational app built for kids with DLD. I think your families would love it. Join the waitlist: <strong>storybuilders.com?ref=YOUR_CODE</strong>"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Section 5: Your Dashboard */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>Your Dashboard Explained</h2>
            <p className={`text-base text-[#8B7355] mb-8`}>
              Your dashboard is your command center. Here's what you'll see:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Position Card",
                  description: "Your current rank and queue position — visible to everyone on the leaderboard!",
                },
                {
                  title: "Tier Progress Bar",
                  description: "Visual progress toward your next tier. See exactly how many points you need.",
                },
                {
                  title: "Referral Tracker",
                  description: "Count of people you've referred and verification status. See who's joined via you.",
                },
                {
                  title: "Badges & Achievements",
                  description: "Earn badges for completing milestones. Show them off to your community!",
                },
                {
                  title: "Community Milestones",
                  description: "Track collective progress toward group rewards. Everyone benefits when we hit targets.",
                },
                {
                  title: "Activity Feed",
                  description: "Real-time updates of your actions and points earned. Stay motivated!",
                },
                {
                  title: "Leaderboard",
                  description: "See who's leading. Celebrate top supporters and get inspired to climb higher.",
                },
                {
                  title: "Streak Counter",
                  description: "Your daily visit streak. How many days can you keep it going?",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-xl bg-[#FEFCF9] border border-[#E8DDD0]`}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <h4 className="text-lg font-bold mb-2 text-[#3D2B1F]">{item.title}</h4>
                  <p className="text-[#8B7355] text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 6: Badges & Achievements */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>Badges & Achievements</h2>
            <p className={`text-base text-[#8B7355] mb-8`}>
              Earn exclusive badges by hitting milestones. Each badge tells your story in the community.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-xl bg-[#FEFCF9] border border-[#E8DDD0] text-center cursor-pointer`}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h4 className="font-bold text-sm mb-1 text-[#3D2B1F]">{badge.name}</h4>
                  <p className="text-xs text-[#8B7355]">{badge.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 7: Community Milestones */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>Community Milestones</h2>
            <p className={`text-base text-[#8B7355] mb-8`}>
              We succeed together! As our community grows, we all unlock exclusive rewards.
            </p>

            <div className="space-y-4">
              {COMMUNITY_MILESTONES.map((milestone, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-xl bg-[#FEFCF9] border border-[#E8DDD0]`}
                  whileHover={{ x: 8 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#D4920B]/20 flex-shrink-0">
                      <Users className="w-8 h-8 text-[#D4920B]" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-2xl font-bold text-[#3D2B1F] mb-1">{milestone.target.toLocaleString()} Members</h4>
                      <p className="text-[#5C4033]">{milestone.reward}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 8: Pro Tips */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>Pro Tips to Climb Faster</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proTips.map((tip, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-2xl bg-[#FEFCF9] border border-[#E8DDD0] border-l-4`}
                  style={{ borderLeftColor: "#D4920B" }}
                  whileHover={{ x: 8 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-[#3D2B1F]">{tip.title}</h4>
                      <p className="text-[#8B7355] text-sm">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 9: FAQ */}
          <motion.section {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-serif italic mb-8 text-[#3D2B1F]`}>Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`rounded-lg overflow-hidden bg-[#FEFCF9] border border-[#E8DDD0]`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between hover:bg-[#F5EDE3] transition-colors"
                  >
                    <span className="font-semibold text-left text-[#3D2B1F]">{item.q}</span>
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 transition-transform text-[#D4920B]"
                      style={{
                        transform: expandedFAQ === idx ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                  {expandedFAQ === idx && (
                    <motion.div
                      className="px-4 pb-4 text-[#5C4033] border-t border-[#E8DDD0]"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      {item.a}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA */}
          <motion.div
            className={`mt-16 p-8 rounded-2xl bg-[#FEFCF9] border-2 border-[#D4920B] text-center`}
            whileHover={{ scale: 1.02 }}
          >
            <Gift className="w-12 h-12 text-[#D4920B] mx-auto mb-4" />
            <h3 className={`text-2xl font-bold font-serif italic mb-3 text-[#3D2B1F]`}>Ready to Start Your Journey?</h3>
            <p className={`text-base text-[#5C4033] mb-6 max-w-2xl mx-auto`}>
              Head back to your dashboard and start earning points today. Share your referral link, complete daily activities, and watch your tier climb!
            </p>
            <Button
              onClick={() => navigate("/storybuilders")}
              size="lg"
              className="bg-[#C67B5C] hover:bg-[#A85A48] text-white"
            >
              Return to Dashboard →
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
};

// Helper component for Crown icon
const Crown = ({ className }: { className: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default WaitlistUserGuide;
