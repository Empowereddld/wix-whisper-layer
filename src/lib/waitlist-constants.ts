export const TIER_NAMES = [
  "Storyteller",
  "Advocate",
  "Champion",
  "Hero",
  "Legend",
  "Founding Elite",
] as const;

export const TIER_COLORS = [
  "#8B7355",   // Storyteller - warm brown
  "#D4920B",   // Advocate - amber
  "#C67B5C",   // Champion - terracotta
  "#8BA888",   // Hero - sage green
  "#C4A0A0",   // Legend - dusty rose
  "#3D2B1F",   // Founding Elite - dark chocolate
] as const;

export const TIER_THRESHOLDS = [0, 40, 100, 175, 325, 600] as const;

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
export const REGULAR_PRICE = 7.99;
export const FOUNDER_PRICE = 5.99;

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
    name: "Early Access Pass",
    description: "Early access to Story Pros on launch day, before the general public",
    claimType: "auto",
  },
  {
    tier: 2,
    name: "75 Bonus Story Coins",
    description: "A bonus coin drop to spend on in-app extras at launch",
    claimType: "auto",
  },
  {
    tier: 3,
    name: "Founder Pricing Locked",
    description: "$5.99/month for life instead of $7.99 — permanent 25% discount",
    claimType: "auto",
  },
  {
    tier: 4,
    name: "VIP Beta Access + 200 Coins",
    description: "Test Story Pros before launch and shape the final product, plus 200 bonus coins",
    claimType: "unlock",
  },
  {
    tier: 5,
    name: "Founding Elite Package",
    description: "Named in Story Pros founder credits forever — limited to first 50 members",
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
  VERIFY_EMAIL: 5,         // Confirm your email
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
  DAILY_CHECKIN: 2,        // Visit your dashboard (max once/day)
} as const;

// --- STREAK BONUSES (escalating, stacks with daily check-in) ---
export const STREAK_BONUSES = {
  DAYS_3: 3,               // 3-day streak bonus
  DAYS_7: 10,              // 7-day streak bonus
  DAYS_14: 20,             // 14-day streak bonus
  DAYS_30: 50,             // 30-day streak bonus
} as const;
// A 30-day daily visitor earns: (30×2) + 3 + 10 + 20 + 50 = 143 pts from engagement alone

// --- DAILY CAPS (prevent farming) ---
export const DAILY_CAPS = {
  MAX_SHARE_POINTS: 15,    // 5 shares per day max (5×3)
  MAX_CLICK_POINTS: 10,    // 10 clicks per day max
  MAX_CHECKIN_POINTS: 2,   // 1 check-in per day
} as const;

// --- SOCIAL LINKS (for follow/subscribe buttons) ---
export const SOCIAL_LINKS = {
  INSTAGRAM: "https://www.instagram.com/empowereddld",
  FACEBOOK: "https://www.facebook.com/empowereddld",
  YOUTUBE: "https://www.youtube.com/@empowereddld",
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
  DAILY_CHECKIN: REPEATABLE_POINTS.DAILY_CHECKIN,
  STREAK_3: STREAK_BONUSES.DAYS_3,
  STREAK_7: STREAK_BONUSES.DAYS_7,
  STREAK_14: STREAK_BONUSES.DAYS_14,
  STREAK_30: STREAK_BONUSES.DAYS_30,
  MAX_CLICK_POINTS_PER_DAY: DAILY_CAPS.MAX_CLICK_POINTS,
  MAX_SHARE_POINTS_PER_DAY: DAILY_CAPS.MAX_SHARE_POINTS,
} as const;

export type TierLevel = typeof TIER_NAMES[number];
export type TierColor = typeof TIER_COLORS[number];
