/**
 * Barrel export file for all waitlist components
 * Phases 4-8: Core components, gamification, engagement, and premium UI polish
 */

// Phase 4: Core Components
export { default as PositionCard } from "./PositionCard";
export { default as ReferralLinkCard } from "./ReferralLinkCard";
export { default as Leaderboard } from "./Leaderboard";
export { default as SharePanel } from "./SharePanel";

// Phase 5: Engagement & Social
export { default as ActivityFeed } from "./ActivityFeed";
export { default as BadgeShowcase } from "./BadgeShowcase";
export { default as SocialProofBanner } from "./SocialProofBanner";
export { default as NotificationBell } from "./NotificationBell";

// Phase 6: Gamification & Progression
export { default as TierProgressBar } from "./TierProgressBar";
export { default as ProgressRing } from "./ProgressRing";
export { default as ReferralTracker } from "./ReferralTracker";
export { default as LaunchCountdown } from "./LaunchCountdown";
export { default as MilestoneModal } from "./MilestoneModal";
export { default as CommunityMilestone } from "./CommunityMilestone";
export { default as ImpactCounter } from "./ImpactCounter";
export { default as InviteFriendForm } from "./InviteFriendForm";
export { default as AlmostThereNudge } from "./AlmostThereNudge";
export { VerificationBanner } from "./VerificationBanner";

// Phase 8: Premium UI Polish + Performance
export { default as AnimatedBackground } from "./AnimatedBackground";
export { default as ConfettiEffect } from "./ConfettiEffect";
export { default as GlassCard } from "./GlassCard";
export { default as AnimatedCounter } from "./AnimatedCounter";

// Phase 9: Rewards & Coin System
export { default as RewardsInventory } from "./RewardsInventory";
export { default as CoinBalance } from "./CoinBalance";
export { default as CoinDropAnimation } from "./CoinDropAnimation";
export { default as RewardCard } from "./RewardCard";
export {
  WaitlistFormSkeleton,
  PositionCardSkeleton,
  LeaderboardSkeleton,
  TierProgressSkeleton,
  ActivityFeedSkeleton,
  SharePanelSkeleton,
  NotificationBellSkeleton,
  GenericSkeleton,
} from "./SkeletonLoaders";

// Utilities and Constants
export * from "../../lib/glassmorphism";
export { glass, gradients, animations, states, typography } from "../../lib/glassmorphism";
