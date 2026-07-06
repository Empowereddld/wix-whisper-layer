import {
  TIER_NAMES,
  TIER_COLORS,
  TIER_THRESHOLDS,
  TIER_REFERRALS,
} from "./waitlist-constants";

/**
 * Get the tier level (0-5) for a given point total.
 * Returns the highest tier the user qualifies for.
 */
export function getTierForPoints(points: number): number {
  if (points < 0) return 0;

  for (let i = TIER_THRESHOLDS.length - 1; i >= 0; i--) {
    if (points >= TIER_THRESHOLDS[i]) {
      return i;
    }
  }

  return 0;
}

/**
 * Get the tier name for a given tier level.
 */
export function getTierName(tier: number): string {
  const validTier = Math.max(0, Math.min(tier, TIER_NAMES.length - 1));
  return TIER_NAMES[validTier];
}

/**
 * Get the color associated with a tier level.
 */
export function getTierColor(tier: number): string {
  const validTier = Math.max(0, Math.min(tier, TIER_COLORS.length - 1));
  return TIER_COLORS[validTier];
}

/**
 * Get the point threshold required for the next tier.
 * Returns null if already at max tier.
 */
export function getNextTierThreshold(currentTier: number): number | null {
  const nextTier = currentTier + 1;
  if (nextTier >= TIER_THRESHOLDS.length) {
    return null;
  }
  return TIER_THRESHOLDS[nextTier];
}

/**
 * Calculate progress to next tier as a percentage (0-100).
 * Returns 100 if at max tier or if currentTier is invalid.
 */
export function getProgressToNextTier(points: number, currentTier: number): number {
  const nextTierThreshold = getNextTierThreshold(currentTier);

  if (nextTierThreshold === null) {
    return 100; // Already at max tier
  }

  const currentTierThreshold = TIER_THRESHOLDS[currentTier] ?? 0;
  const pointsInTier = points - currentTierThreshold;
  const pointsNeeded = nextTierThreshold - currentTierThreshold;

  if (pointsNeeded <= 0) {
    return 0;
  }

  const progress = (pointsInTier / pointsNeeded) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

/**
 * Format a queue position as a string with # prefix.
 * Example: formatQueuePosition(42) returns "#42"
 */
export function formatQueuePosition(position: number): string {
  if (position < 0) return "N/A";
  return `#${position.toLocaleString()}`;
}

/**
 * Get platform-specific share message for social media.
 */
export function getShareMessage(platform: string, referralLink: string): string {
  const baseMessage = "I'm on the waitlist for Story Pros! 📚";

  const messages: Record<string, string> = {
    twitter: `${baseMessage} Join me and unlock exclusive rewards! ${referralLink}`,
    facebook: `${baseMessage} Come join the Launch Team and get early access! ${referralLink}`,
    linkedin:
      `I'm excited about Story Pros - a platform designed to transform how teachers engage students with storytelling. ${referralLink}`,
    email: `Join me on the Story Pros waitlist!\n\nI'm part of the Launch Team and would love to have you join too. Get exclusive rewards, early access, and more.\n\n${referralLink}`,
    whatsapp: `${baseMessage}\n\nJoin me on the waitlist and get amazing rewards! 🎁\n${referralLink}`,
    copy: referralLink,
  };

  return messages[platform] || referralLink;
}

/**
 * Generate a referral link from a referral code.
 * Uses the production domain with /storypros path.
 */
export function generateReferralLink(code: string): string {
  return `https://www.empowereddld.com/storypros?ref=${code}`;
}

/**
 * Get the number of referrals required to reach the next tier.
 */
export function getReferralsForTier(tier: number): number {
  const validTier = Math.max(0, Math.min(tier, TIER_REFERRALS.length - 1));
  return TIER_REFERRALS[validTier];
}
