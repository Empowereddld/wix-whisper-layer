export const TIER_NAMES = [
  "Storyteller",
  "Advocate",
  "Champion",
  "Hero",
  "Legend",
  "Founding Elite",
] as const;

export const TIER_COLORS = [
  "#9CA3AF",
  "#8B5CF6",
  "#3B82F6",
  "#F59E0B",
  "#EF4444",
  "#5B2D8E",
] as const;

export const TIER_THRESHOLDS = [0, 35, 85, 135, 260, 510] as const;

export const TIER_REFERRALS = [0, 1, 3, 5, 10, 20] as const;

export const TIER_REWARDS = [
  "Early access updates & behind-the-scenes content",
  "Exclusive DLD Resource Guide PDF",
  "Access to Story Builders Podcast",
  "Story Builder Activity Pack + Suggestion Box access",
  "Founder recognition on website + Founder pricing ($5.99/mo)",
  "VIP Founding Elite: Virtual meet & greet + Signed Dan & Daria book",
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
