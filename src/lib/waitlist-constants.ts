export const TIER_NAMES = [
  "Tier 1",
  "Tier 2",
  "Tier 3",
  "Tier 4",
  "Tier 5",
  "Tier 6",
] as const;

export const TIER_COLORS = [
  "#8B7355",   // Tier 1 - warm brown
  "#D4920B",   // Tier 2 - amber
  "#C67B5C",   // Tier 3 - terracotta
  "#8BA888",   // Tier 4 - sage green
  "#C4A0A0",   // Tier 5 - dusty rose
  "#3D2B1F",   // Tier 6 - dark chocolate
] as const;

export const TIER_THRESHOLDS = [0, 35, 75, 130, 250, 500] as const;

export const TIER_REFERRALS = [0, 1, 3, 5, 10, 20] as const;

export const TIER_REWARDS_OLD = [
  "Early access updates & behind-the-scenes content",
  "Exclusive DLD Resource Guide PDF",
  "Access to Story Pros Podcast",
  "Story Pros Activity Pack + Suggestion Box access",
  "Founder recognition on website + Founder pricing ($5.99/mo)",
  "VIP Founding Elite: Virtual meet & greet + Signed Dan & Daria book",
] as const;

// Coin drop amounts when tier-up
export const COIN_DROPS: Record<number, number> = { 2: 75, 4: 200 };

// Coin packs for purchase
export const COIN_PACKS = [
  {
    level: 1,
    cost: 50,
    name: "Story Starter Pack",
    rewards: [
      "Shareable social badge graphic",
      "Name on Early Supporters wall",
      "Dan & Daria phone/desktop wallpaper",
    ],
  },
  {
    level: 2,
    cost: 150,
    name: "Story Champion Pack",
    rewards: [
      "Personalized Founding Supporter Certificate",
      "48-hour 2x referral power-up",
      "Story theme/character voting access",
      "Legend leaderboard flair",
    ],
  },
] as const;

// Founding Elite program cap
export const FOUNDING_ELITE_CAP = 50;

// Pricing
export const REGULAR_PRICE = 9.99;
export const FOUNDER_PRICE = 7.99;

// Detailed tier rewards structure
export const TIER_REWARDS = [
  {
    tier: 0,
    name: "Development Updates",
    description: "Behind-the-scenes updates on Story Pros development",
    claimType: "auto",
  },
  {
    tier: 1,
    name: "Founding Member Status",
    description: "Founding Member badge plus your name on the Early Supporters Wall",
    claimType: "auto",
  },
  {
    tier: 2,
    name: "Early Access Pass",
    description: "Early access to Story Pros on launch day, before the general public",
    claimType: "auto",
  },
  {
    tier: 3,
    name: "75 Bonus Story Coins",
    description: "A bonus coin drop to spend on in-app extras at launch",
    claimType: "auto",
  },
  {
    tier: 4,
    name: "VIP Beta Access",
    description: "Test Story Pros before launch and help shape the final product",
    claimType: "unlock",
  },
  {
    tier: 5,
    name: "Founder Pricing Locked",
    description: "$7.99/month for life instead of $9.99: permanent 20% discount",
    claimType: "auto",
  },
  {
    tier: 6,
    name: "Founding Elite Package",
    description: "Named in Story Pros founder credits forever, plus a signed Dan & Daria book and DLD-themed merch (limited to first 50 members)",
    claimType: "activate",
  },
] as const;

export const COMMUNITY_MILESTONES = [
  { target: 250, reward: "Exclusive community Q&A with the Story Pros team" },
  { target: 500, reward: "Community unlocks bonus 25 coins for everyone" },
  { target: 1000, reward: "Story Pros app preview video released to all waitlisters" },
  { target: 2500, reward: "Community vote: choose a Story Pros character or theme" },
] as const;

// ===========================================
// POINTS SYSTEM — 10/10 Edition
// ===========================================

// --- ONE-TIME ACTIONS (do once, big early impact) ---
export const ONETIME_POINTS = {
  SIGNUP: 10,              // Join the waitlist
  VERIFY_EMAIL: 15,        // Confirm your email (matches Email 1 promise)
  COMPLETE_PROFILE: 10,    // Fill in name, role, age range
  FOLLOW_INSTAGRAM: 8,     // Follow on Instagram (honor system, opens profile)
  FOLLOW_FACEBOOK: 8,      // Follow on Facebook
  SUBSCRIBE_YOUTUBE: 8,    // Subscribe on YouTube
  FIRST_SHARE: 5,          // Bonus for your very first share (any platform)
  FIRST_REFERRAL_BONUS: 10, // Bonus on top of the 25 referral pts for first one
} as const;
// MAX from one-time actions: 10+5+10+8+8+8+5+10 = 64 pts
// A user who joins, verifies, completes profile, follows 2 platforms = 49 pts → Tier 1 ✓

// --- REPEATABLE ACTIONS (the engine) ---
export const REPEATABLE_POINTS = {
  REFERRAL: 25,            // Friend joins via your link
  SHARE: 3,                // Share on social media (bumped from 2)
  CLICK: 1,                // Friend clicks your link
  SUGGESTION: 5,           // Submit a suggestion (Tier 3+)
} as const;

// --- DAILY CAPS (prevent farming) ---
export const DAILY_CAPS = {
  MAX_SHARE_POINTS: 15,    // 5 shares per day max (5×3)
  MAX_CLICK_POINTS: 10,    // 10 clicks per day max
} as const;

// --- SOCIAL LINKS (for follow/subscribe buttons) ---
// NOTE: Story Pros Instagram is not yet created — placeholder for now.
export const SOCIAL_LINKS = {
  INSTAGRAM: "https://www.instagram.com/empowered.dld.parenting",
  FACEBOOK: "https://www.facebook.com/share/g/1Gjtr63eT5/",
  YOUTUBE: "https://www.youtube.com/@EmpoweredDLD",
} as const;

// --- BACKWARD COMPAT (combined flat export for existing code) ---
export const POINTS = {
  SIGNUP: ONETIME_POINTS.SIGNUP,
  VERIFY_EMAIL: ONETIME_POINTS.VERIFY_EMAIL,
  COMPLETE_PROFILE: ONETIME_POINTS.COMPLETE_PROFILE,
  FOLLOW_INSTAGRAM: ONETIME_POINTS.FOLLOW_INSTAGRAM,
  FOLLOW_FACEBOOK: ONETIME_POINTS.FOLLOW_FACEBOOK,
  SUBSCRIBE_YOUTUBE: ONETIME_POINTS.SUBSCRIBE_YOUTUBE,
  FIRST_SHARE: ONETIME_POINTS.FIRST_SHARE,
  FIRST_REFERRAL_BONUS: ONETIME_POINTS.FIRST_REFERRAL_BONUS,
  REFERRAL: REPEATABLE_POINTS.REFERRAL,
  SHARE: REPEATABLE_POINTS.SHARE,
  CLICK: REPEATABLE_POINTS.CLICK,
  SUGGESTION: REPEATABLE_POINTS.SUGGESTION,
  MAX_CLICK_POINTS_PER_DAY: DAILY_CAPS.MAX_CLICK_POINTS,
  MAX_SHARE_POINTS_PER_DAY: DAILY_CAPS.MAX_SHARE_POINTS,
} as const;

export type TierLevel = typeof TIER_NAMES[number];
export type TierColor = typeof TIER_COLORS[number];

// ===========================================
// FEATURE 1: Story Theme Voting
// ===========================================

export const INITIAL_STORY_THEMES = [
  { id: "adventure", title: "Adventure Quest", description: "Dan and Daria explore a magical forest, learning new words along the way", emoji: "🌲", votes: 0 },
  { id: "space", title: "Space Explorers", description: "A journey through the solar system where every planet teaches a new skill", emoji: "🚀", votes: 0 },
  { id: "ocean", title: "Ocean Discovery", description: "Underwater adventures helping sea creatures communicate and solve problems", emoji: "🌊", votes: 0 },
  { id: "garden", title: "Secret Garden", description: "Growing a magical garden where each plant represents a different emotion", emoji: "🌻", votes: 0 },
  { id: "music", title: "Rhythm & Words", description: "A musical adventure where sounds and words come together to tell stories", emoji: "🎵", votes: 0 },
] as const;

export const BRAND_COLORS = {
  PRIMARY: "#8861d4",      // Brand purple
  LIGHT: "#f3ebf8",        // Light purple background
  DARK: "#3b1f59",         // Dark purple
} as const;

// ===========================================
// FEATURE 2: SLP Referral Bonus
// ===========================================

// SLP referral is FLAT +50 total (mutually exclusive with the regular +25 referral).
// The referrer first gets +25 on signup; when admin verifies the new signup is an SLP,
// the verification action tops up by this delta amount so the total becomes exactly 50.
export const SLP_REFERRAL_TOTAL = 50;
export const SLP_REFERRAL_BONUS = 25; // delta added on verification (25 already awarded at signup -> 50 total)
