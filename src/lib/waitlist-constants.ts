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

export const TIER_THRESHOLDS = [0, 35, 85, 135, 260, 510] as const;

export const TIER_REFERRALS = [0, 1, 3, 5, 10, 20] as const;

export const TIER_REWARDS_OLD = [
  "Early access updates & behind-the-scenes content",
  "Exclusive DLD Resource Guide PDF",
  "Access to Story Pros Podcast",
  "Story Builder Activity Pack + Suggestion Box access",
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
    description: "Behind-the-scenes updates on Story Builders development",
    claimType: "auto",
  },
  {
    tier: 1,
    name: "5 Language Activities PDF",
    description: "One-page guide with language activities to try tonight",
    claimType: "download",
  },
  {
    tier: 2,
    name: "75 Bonus Coins + Story Starter Pack",
    description: "A treasure chest of coins and your first reward pack",
    claimType: "activate",
  },
  {
    tier: 3,
    name: "Founding Voice + Sneak Peek",
    description: "Shape the app with your suggestions + preview video",
    claimType: "unlock",
  },
  {
    tier: 4,
    name: "Founder Recognition + Pricing + 200 Coins",
    description:
      "Your name on our wall, $5.99/mo forever, and 200 bonus coins",
    claimType: "activate",
  },
  {
    tier: 5,
    name: "VIP Founding Elite Package",
    description:
      "Meet & greet, signed book, app credits — the full experience",
    claimType: "onboard",
  },
] as const;

export const COMMUNITY_MILESTONES = [
  { target: 500, reward: "Unlock community Discord channel" },
  { target: 1000, reward: "Early beta access for everyone" },
  { target: 2500, reward: "Free first month for all waitlisters" },
  { target: 5000, reward: "Exclusive launch event invitation" },
] as const;

export const POINTS = {
  SIGNUP: 10,
  VERIFY_EMAIL: 5,
  REFERRAL: 25,
  SHARE: 2,
  CLICK: 1,
  SUGGESTION: 5,
  STREAK_BONUS: 3,
  MAX_CLICK_POINTS_PER_DAY: 10,
  MAX_SHARE_POINTS_PER_DAY: 20,
} as const;

export type TierLevel = typeof TIER_NAMES[number];
export type TierColor = typeof TIER_COLORS[number];
