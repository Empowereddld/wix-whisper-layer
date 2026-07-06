import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Copy, Share2, Award, Zap, Users, Heart, Gift, Trophy, Sparkles, Target, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/SEOHead";
import {
  TIER_NAMES,
  TIER_COLORS,
  TIER_REWARDS,
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
    
    { name: "Community Builder", description: "Helped reach a community milestone", icon: "🏗️" },
    { name: "Super Sharer", description: "30+ successful shares", icon: "📢" },
    { name: "Engaged Parent", description: "Made a story suggestion", icon: "💭" },
  ];

  const proTips = [
    {
      title: "Complete Profile + Social Follow to Hit Tier 2",
      description: "Complete your profile (10 pts) and follow us on Instagram (8 pts) + Facebook (8 pts) = 26 pts. With email verification (5 pts) and signup (10 pts), you'll hit Tier 2 (35 pts) without any referrals!",
      icon: "📋",
    },
    {
      title: "Share in ADHD & Dyslexia Communities",
      description: "Post your referral link in Facebook groups for ADHD, Dyslexia, and speech delay communities. Parents in these spaces are already looking for solutions!",
      icon: "👥",
    },
    {
      title: "Tell Your Speech Therapist",
      description: "Your speech-language pathologist can share Story Pros with other families. They know people who need it!",
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
      description: "Tell people how Story Pros helps your child. Real stories are the most powerful marketing!",
      icon: "📖",
    },
  ];

  const faqItems = [
    {
      q: "What is Story Pros?",
      a: "Story Pros is an innovative educational app designed specifically for children with Developmental Language Disorder (DLD). It uses interactive storytelling to help kids build language skills, confidence, and creativity in a fun, judgment-free environment.",
    },
    {
      q: "When will Story Pros launch?",
      a: "We're in final beta testing! The exact launch date will be announced to all waitlist members first. Being on the waitlist guarantees you'll get in on day one.",
    },
    {
      q: "How do tier rewards work?",
      a: "As you earn points through referrals and sharing, you automatically advance through tiers. Each tier unlocks exclusive rewards! You don't need to do anything special — the system tracks everything automatically.",
    },
    {
      q: "Can I earn points without referring friends?",
      a: "Absolutely! You can earn points by completing your profile (10 pts), verifying email (5 pts), following us on Instagram (8 pts), Facebook (8 pts), and YouTube (8 pts), sharing on social media (3 pts), clicking engagement links (1 pt), and suggesting stories (5 pts). Referrals give the most points, but you can reach Tier 2 just by completing your profile and following our social accounts!",
    },
    {
      q: "What happens to my tier after launch?",
      a: "Your tier status carries through to launch! Tier 6 (Founding Elite) members get lifetime founder pricing and recognition on our website. All other tier members get special launch bonuses and exclusive content.",
    },
    {
      q: "Can I share the same referral link multiple times?",
      a: "The leaderboard ranks members by total points earned. It's not just about referrals — sharing, suggestions, and other activities all count toward your position!",
    },
    {
      q: "Will my referrals know I referred them?",
      a: "They'll see 'Referred by [Your Name]' when they sign up, but we don't share contact information. It's just a fun acknowledgment of who brought them to the community.",
    },
    {
      q: "What if I want to update my email?",
      a: "Contact support@empowereddld.com and we'll update your account for you. Your points and tier status will transfer to your new email.",
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
        title="Waitlist User Guide | Story Pros"
        description="Learn how to maximize your position on the Story Pros Launch Team, earn rewards, and make the most of our referral system."
        path="/waitlist-guide"
        noindex
      />

      <div className="min-h-screen bg-white text-[#121212] overflow-hidden">
        {/* Purple gradient background */}
        <div className="fixed inset-0 pointer-events-none opacity-5 bg-gradient-to-br from-[#8861d4] via-[#f3ebf8] to-[#3b1f59]" />

        {/* Header */}
        <motion.div
          className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-6xl mx-auto">
            <Button
              onClick={() => navigate("/storypros")}
              variant="ghost"
              className="mb-8 text-[#8861d4] hover:text-[#3b1f59]"
            >
              ← Back to Waitlist
            </Button>
            <h1 className={`text-4xl font-bold font-sans font-bold mb-4 text-[#3b1f59]`}>
              Your Story Pros Launch Team Playbook
            </h1>
            <p className={`text-lg max-w-3xl text-gray-600`}>
              Welcome to the exclusive community of early supporters! This guide will show you how to maximize your position, unlock rewards, and help other families discover Story Pros.
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {/* Section 1: Welcome */}
          <motion.section
            className={`mb-16 p-8 rounded-2xl bg-[#f3ebf8] border border-[#dedede]`}
            {...animations.fadeInUp}
          >
            <div className="flex items-start gap-4 mb-4">
              <Heart className="w-8 h-8 text-[#8861d4] flex-shrink-0 mt-1" />
              <div>
                <h2 className={`text-2xl font-bold font-sans font-bold mb-3 text-[#3b1f59]`}>Welcome to the Story Pros Launch Team</h2>
                <p className={`text-base mb-4 text-[#121212]`}>
                  You're part of something special. Story Pros is an educational app designed with love for children with Developmental Language Disorder. We're building a community where kids feel celebrated for who they are, not measured by what they can't do yet.
                </p>
                <p className={`text-base text-[#121212]`}>
                  Early supporters like you are helping shape the future of language learning. Your referrals, feedback, and enthusiasm matter more than you know. Together, we're creating a movement to support families navigating DLD.
                </p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Tier System */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-sans font-bold mb-8 text-[#3b1f59]`}>The Tier System: Your Path to Rewards</h2>
            <p className={`text-base text-gray-600 mb-8`}>
              Earn points through referrals, sharing, and engagement. Watch your tier climb and unlock exclusive rewards at each level.
            </p>

            <div className="space-y-4">
              {TIER_NAMES.map((tier, index) => (
                <motion.div
                  key={tier}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-102 bg-white`}
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
                      <h3 className="text-2xl font-bold mb-1 text-[#3b1f59]">{tier}</h3>
                      <p className="text-sm text-gray-600">
                        Reach {[0, 35, 75, 130, 250, 500][index]} points
                      </p>
                    </div>
                    {index > 0 && (
                      <div className="text-right">
                        <div className="text-3xl font-bold" style={{ color: TIER_COLORS[index] }}>
                          {[0, 35, 75, 130, 250, 500][index]}
                        </div>
                      </div>
                    )}
                  </div>
                  <p className="text-[#121212] ml-16">{TIER_REWARDS[index]?.name}: {TIER_REWARDS[index]?.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 3: How to Earn Points */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-sans font-bold mb-8 text-[#3b1f59]`}>How to Earn Points</h2>
            <p className={`text-base text-gray-600 mb-8`}>
              There are many ways to earn points — referrals give the most, but every action counts!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Join the Waitlist", points: "10", emoji: "👋" },
                { label: "Verify Email", points: "5", emoji: "✓" },
                { label: "Complete Profile", points: "10", emoji: "📋" },
                { label: "Follow Instagram", points: "8", emoji: "📷" },
                { label: "Follow Facebook", points: "8", emoji: "👍" },
                { label: "Subscribe YouTube", points: "8", emoji: "▶️" },
                { label: "First Share Bonus", points: "5", emoji: "🎁" },
                { label: "First Referral Bonus", points: "10", emoji: "🎯" },
                { label: "Friend Joins via Link", points: "25", emoji: "🔗" },
                { label: "Share on Social", points: "3", emoji: "📢" },
                { label: "Friend Clicks Link", points: "1", emoji: "🖱️" },
                { label: "Submit Suggestion", points: "5", emoji: "💭" },
                
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-xl bg-white border border-[#dedede] flex items-center justify-between`}
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="font-semibold text-[#121212]">{item.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#8861d4]">+{item.points}</div>
                </motion.div>
              ))}
            </div>


            <motion.div className={`mt-4 p-6 rounded-xl bg-white border border-[#dedede]`} whileHover={{ scale: 1.02 }}>
              <strong className="text-[#121212]">Sharing Limits:</strong>
              <ul className="text-[#121212] mt-2 space-y-1">
                <li>Social shares: Up to 5 per day (3 pts each)</li>
                <li>Friend link clicks: Up to 10 per day (1 pt each)</li>
              </ul>
            </motion.div>
          </motion.section>

          {/* Section 4: Sharing Your Referral Link */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-sans font-bold mb-8 text-[#3b1f59]`}>Sharing Your Referral Link</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <motion.div className={`p-6 rounded-2xl bg-white border border-[#dedede]`}>
                <h3 className="text-xl font-bold mb-4 text-[#3b1f59]">Your Link</h3>
                <div className={`p-4 rounded-lg bg-[#f3ebf8] border border-[#dedede] mb-4 font-mono text-sm break-all text-[#121212]`}>
                  https://www.empowereddld.com/storypros?ref=YOUR_CODE
                </div>
                <Button
                  onClick={() => copyToClipboard("https://www.empowereddld.com/storypros?ref=YOUR_CODE")}
                  className="w-full bg-[#8861d4] hover:bg-[#7451c4] text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
              </motion.div>

              <motion.div className={`p-6 rounded-2xl bg-white border border-[#dedede]`}>
                <h3 className="text-xl font-bold mb-4 text-[#3b1f59]">Share on Platforms</h3>
                <div className="space-y-3">
                  {["Facebook", "WhatsApp", "Email", "Text Message"].map((platform, idx) => (
                    <Button key={idx} variant="outline" className="w-full text-left justify-start border-[#dedede] text-[#121212] hover:bg-[#f3ebf8]">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share on {platform}
                    </Button>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div className={`p-8 rounded-2xl bg-white border border-[#dedede]`}>
              <h3 className="text-xl font-bold mb-4 text-[#3b1f59]">Sample Messages</h3>
              <div className="space-y-4">
                <div className="bg-[#f3ebf8] p-4 rounded-lg border border-[#dedede]">
                  <p className="text-sm text-gray-600 mb-2">For Parent Groups:</p>
                  <p className="text-[#121212]">
                    "I'm so excited about Story Pros — an app designed specifically for kids with language challenges. If you know families navigating DLD, check this out! <strong>www.empowereddld.com/storypros?ref=YOUR_CODE</strong>"
                  </p>
                </div>
                <div className="bg-[#f3ebf8] p-4 rounded-lg border border-[#dedede]">
                  <p className="text-sm text-gray-600 mb-2">For Therapist/Educator Referrals:</p>
                  <p className="text-[#121212]">
                    "I'm part of the launch team for Story Pros, an educational app built for kids with DLD. I think your families would love it. Join the waitlist: <strong>www.empowereddld.com/storypros?ref=YOUR_CODE</strong>"
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* Section 5: Your Dashboard */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-sans font-bold mb-8 text-[#3b1f59]`}>Your Dashboard Explained</h2>
            <p className={`text-base text-gray-600 mb-8`}>
              Your dashboard is your command center. Here's what you'll see:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Tier Progress Bar",
                  description: "Visual progress toward your next tier. See exactly how many points you need.",
                },
                {
                  title: "Referral Tracker",
                  description: "Count of people you've referred and verification status. See who's joined via you.",
                },
                {
                  title: "Reward Journey",
                  description: "See all 6 tiers and which rewards you've unlocked in a visual progress tracker.",
                },
                {
                  title: "Share & Follow",
                  description: "Share your referral link and follow our social accounts to earn bonus points.",
                },
                {
                  title: "Interactive Story Preview",
                  description: "Tier 4+ members get an exclusive sneak peek at the Story Pros experience.",
                },
                {
                  title: "Your Impact",
                  description: "See how many families discovered Story Pros because of your referrals.",
                },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-xl bg-white border border-[#dedede]`}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <h4 className="text-lg font-bold mb-2 text-[#3b1f59]">{item.title}</h4>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>




          {/* Section 8: Pro Tips */}
          <motion.section className="mb-16" {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-sans font-bold mb-8 text-[#3b1f59]`}>Pro Tips to Climb Faster</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proTips.map((tip, idx) => (
                <motion.div
                  key={idx}
                  className={`p-6 rounded-2xl bg-white border border-[#dedede] border-l-4`}
                  style={{ borderLeftColor: "#8861d4" }}
                  whileHover={{ x: 8 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl flex-shrink-0">{tip.icon}</span>
                    <div>
                      <h4 className="text-lg font-bold mb-2 text-[#3b1f59]">{tip.title}</h4>
                      <p className="text-gray-600 text-sm">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section 9: FAQ */}
          <motion.section {...animations.fadeInUp}>
            <h2 className={`text-2xl font-bold font-sans font-bold mb-8 text-[#3b1f59]`}>Frequently Asked Questions</h2>

            <div className="space-y-3">
              {faqItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`rounded-lg overflow-hidden bg-white border border-[#dedede]`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                    className="w-full p-4 flex items-center justify-between hover:bg-[#f3ebf8] transition-colors"
                  >
                    <span className="font-semibold text-left text-[#3b1f59]">{item.q}</span>
                    <ChevronDown
                      className="w-5 h-5 flex-shrink-0 transition-transform text-[#8861d4]"
                      style={{
                        transform: expandedFAQ === idx ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>
                  {expandedFAQ === idx && (
                    <motion.div
                      className="px-4 pb-4 text-[#121212] border-t border-[#dedede]"
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
            className={`mt-16 p-8 rounded-2xl bg-[#f3ebf8] border-2 border-[#8861d4] text-center`}
            whileHover={{ scale: 1.02 }}
          >
            <Gift className="w-12 h-12 text-[#8861d4] mx-auto mb-4" />
            <h3 className={`text-2xl font-bold font-sans font-bold mb-3 text-[#3b1f59]`}>Ready to Start Your Journey?</h3>
            <p className={`text-base text-[#121212] mb-6 max-w-2xl mx-auto`}>
              Head back to your dashboard and start earning points today. Share your referral link, complete daily activities, and watch your tier climb!
            </p>
            <Button
              onClick={() => navigate("/storypros")}
              size="lg"
              className="bg-[#8861d4] hover:bg-[#7451c4] text-white"
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
