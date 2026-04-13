/**
 * Shared Access Configuration for Story Pros ↔ Empowered DLD
 *
 * The waitlist data lives in the Empowered DLD Supabase project.
 * When the Story Pros app launches as a separate project, it should:
 * 1. Use the SAME Supabase project URL and anon key
 * 2. Call link_waitlist_to_auth() when a waitlist user creates an account
 * 3. Read tier/coins/rewards from storybuilders_waitlist table
 *
 * This file defines the RPC functions and table access patterns
 * the Story Pros app will need.
 */

// Tables the Story Pros app needs read access to
export const SHARED_TABLES = {
  WAITLIST: "storybuilders_waitlist",
  WAITLIST_EVENTS: "waitlist_events",
  WAITLIST_BADGES: "waitlist_badges",
} as const;

// RPC functions the Story Pros app can call
export const SHARED_RPC = {
  /** Links a waitlist email to a new auth user_id */
  LINK_AUTH: "link_waitlist_to_auth",
  /** Awards points for in-app actions */
  AWARD_POINTS: "award_waitlist_points",
  /** Awards Story Coins */
  AWARD_COINS: "award_story_coins",
  /** Claims a tier reward */
  CLAIM_REWARD: "claim_waitlist_reward",
  /** Redeems a coin pack */
  REDEEM_COINS: "redeem_coin_pack",
} as const;

// Data the Story Pros app needs per user (query pattern)
export interface WaitlistUserData {
  email: string;
  name: string;
  points: number;
  current_tier: number;
  coins: number;
  rewards_inventory: Record<string, any>;
  is_founding_elite: boolean;
  referral_code: string;
  invite_count: number;
  email_verified: boolean;
  user_id: string | null; // null until auth is linked
}

// How the Story Pros app should fetch waitlist data for a logged-in user
export const getWaitlistDataQuery = (supabase: any, userEmail: string) => {
  return supabase
    .from(SHARED_TABLES.WAITLIST)
    .select("email, name, points, current_tier, coins, rewards_inventory, referral_code, invite_count, email_verified, user_id")
    .eq("email", userEmail)
    .single();
};

// How to check if a user qualifies for founder pricing
export const isFounderEligible = (tier: number): boolean => tier >= 1;
export const isFoundingElite = (tier: number): boolean => tier >= 5;

export const PRICING = {
  REGULAR: 7.99,
  FOUNDER: 5.99,
} as const;
