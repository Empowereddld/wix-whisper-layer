/**
 * Skeleton loading states for all major waitlist components
 * Provides visual feedback during data loading with glassmorphism styling
 */

import { glass } from "../../lib/glassmorphism";

// Waitlist Form Skeleton - placeholder for signup form
export const WaitlistFormSkeleton = () => (
  <div className={`${glass.card} p-8 space-y-4`}>
    <div className="h-8 bg-white/10 rounded-lg animate-pulse w-3/4 mx-auto" />
    <div className="space-y-3">
      <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
      <div className="h-12 bg-white/10 rounded-lg animate-pulse" />
    </div>
    <div className="h-10 bg-purple-600/20 rounded-lg animate-pulse" />
  </div>
);

// Position Card Skeleton - placeholder for position display
export const PositionCardSkeleton = () => (
  <div className={`${glass.card} p-8 space-y-6`}>
    {/* Position number */}
    <div className="text-center space-y-2">
      <div className="h-16 bg-white/10 rounded-lg animate-pulse w-32 mx-auto" />
      <div className="h-4 bg-white/10 rounded animate-pulse w-48 mx-auto" />
      <div className="h-1 bg-white/10 rounded-full animate-pulse w-32 mx-auto mt-2" />
    </div>

    {/* Tier badge */}
    <div className="flex justify-center">
      <div className="h-10 bg-white/10 rounded-full animate-pulse w-32" />
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-2 gap-4">
      <div className="h-20 bg-white/10 rounded-lg animate-pulse" />
      <div className="h-20 bg-white/10 rounded-lg animate-pulse" />
    </div>

    {/* Progress section */}
    <div className="space-y-3">
      <div className="h-4 bg-white/10 rounded animate-pulse w-40" />
      <div className="h-3 bg-white/10 rounded-full animate-pulse" />
      <div className="h-8 bg-white/10 rounded animate-pulse" />
    </div>
  </div>
);

// Leaderboard Skeleton - placeholder for leaderboard table
export const LeaderboardSkeleton = () => (
  <div className={`${glass.card} p-6 space-y-4`}>
    <div className="h-6 bg-white/10 rounded animate-pulse w-32 mb-4" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 pb-4 border-b border-white/10">
        <div className="h-10 w-10 bg-white/10 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded animate-pulse w-32" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-24" />
        </div>
        <div className="h-6 bg-white/10 rounded animate-pulse w-16" />
      </div>
    ))}
  </div>
);

// Tier Progress Skeleton - placeholder for tier progress bar
export const TierProgressSkeleton = () => (
  <div className={`${glass.card} p-6 space-y-4`}>
    <div className="flex items-center justify-between mb-4">
      <div className="h-5 bg-white/10 rounded animate-pulse w-32" />
      <div className="h-4 bg-white/10 rounded animate-pulse w-16" />
    </div>

    {/* Progress bar */}
    <div className="space-y-3">
      <div className="h-4 bg-white/10 rounded-full animate-pulse" />
      <div className="flex justify-between gap-2">
        <div className="h-3 bg-white/10 rounded animate-pulse w-8" />
        <div className="h-3 bg-white/10 rounded animate-pulse w-8" />
      </div>
    </div>

    {/* Tier badges */}
    <div className="flex gap-2 flex-wrap">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-8 bg-white/10 rounded-full animate-pulse flex-1 min-w-20"
        />
      ))}
    </div>
  </div>
);

// Activity Feed Skeleton - placeholder for activity feed
export const ActivityFeedSkeleton = () => (
  <div className={`${glass.card} p-6 space-y-4`}>
    <div className="h-6 bg-white/10 rounded animate-pulse w-40 mb-4" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="flex gap-4 pb-4 border-b border-white/10 last:border-b-0">
        <div className="h-10 w-10 bg-white/10 rounded-full animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-white/10 rounded animate-pulse w-48" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-32" />
          <div className="h-3 bg-white/10 rounded animate-pulse w-24" />
        </div>
      </div>
    ))}
  </div>
);

// Share Panel Skeleton - placeholder for sharing section
export const SharePanelSkeleton = () => (
  <div className={`${glass.card} p-6 space-y-4`}>
    <div className="h-6 bg-white/10 rounded animate-pulse w-32 mb-4" />

    {/* Share buttons */}
    <div className="flex gap-2 mb-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-10 bg-white/10 rounded-lg animate-pulse flex-1" />
      ))}
    </div>

    {/* Copy link section */}
    <div className="space-y-2">
      <div className="h-4 bg-white/10 rounded animate-pulse w-24" />
      <div className="flex gap-2">
        <div className="h-10 bg-white/10 rounded-lg animate-pulse flex-1" />
        <div className="h-10 bg-white/10 rounded-lg animate-pulse w-20" />
      </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-2 gap-2 mt-4">
      <div className="h-12 bg-white/10 rounded animate-pulse" />
      <div className="h-12 bg-white/10 rounded animate-pulse" />
    </div>
  </div>
);

// Notification Bell Skeleton - placeholder for notification icon
export const NotificationBellSkeleton = () => (
  <div className="h-10 w-10 bg-white/10 rounded-full animate-pulse" />
);

// Generic Skeleton Card - reusable for custom needs
interface GenericSkeletonProps {
  lines?: number;
  height?: string;
  variant?: "card" | "line";
}

export const GenericSkeleton = ({
  lines = 3,
  height = "h-4",
  variant = "card",
}: GenericSkeletonProps) => {
  if (variant === "line") {
    return <div className={`${height} bg-white/10 rounded animate-pulse`} />;
  }

  return (
    <div className={`${glass.card} p-6 space-y-4`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`${height} bg-white/10 rounded animate-pulse ${i === lines - 1 ? "w-3/4" : ""}`}
        />
      ))}
    </div>
  );
};
