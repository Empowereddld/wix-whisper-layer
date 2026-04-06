# Story Builders Gamification Components

All gamification components have been created in `src/components/waitlist/` and are ready for production use.

## Component Overview

### 1. MilestoneModal

Full-screen celebration overlay triggered when users reach a new tier.

```tsx
import MilestoneModal from "@/components/waitlist/MilestoneModal";

<MilestoneModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  tier={{
    id: 2,
    name: "Advocate",
    reward: "Early access to beta features"
  }}
/>
```

**Features:**
- Tier-specific color gradients (Storyteller, Advocate, Champion, Hero, Legend, Founding Elite)
- 50+ animated confetti pieces
- Zooming badge with glow effect
- Share achievement functionality
- Animated backdrop and content reveal

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback when modal closes
- `tier: { id: number, name: string, reward: string }` - Tier information

---

### 2. BadgeShowcase

Responsive badge collection grid showing earned and locked badges.

```tsx
import BadgeShowcase from "@/components/waitlist/BadgeShowcase";

<BadgeShowcase
  earnedBadges={[
    { badge_id: "first_share", earned_at: "2024-01-15T10:30:00Z" },
    { badge_id: "verified", earned_at: "2024-01-14T08:00:00Z" }
  ]}
/>
```

**Available Badges:**
1. `first_share` - First Share (shared for the first time)
2. `triple_threat` - Triple Threat (referred 3 friends)
3. `social_butterfly` - Social Butterfly (shared on 3+ platforms)
4. `week_one_og` - Week One OG (joined in the first week)
5. `streak_master` - Streak Master (7-day visit streak)
6. `verified` - Verified (verified email)
7. `super_sharer` - Super Sharer (20+ shares)
8. `the_convincer` - The Convincer (50%+ conversion rate)
9. `early_bird` - Early Bird (first 100 signups)
10. `community_builder` - Community Builder (referral referred someone)

**Props:**
- `earnedBadges: Array<{ badge_id: string, earned_at: string }>` - Earned badges with timestamps

---

### 3. ProgressRing

Animated circular SVG progress indicator showing points to next tier.

```tsx
import ProgressRing from "@/components/waitlist/ProgressRing";

<ProgressRing
  currentPoints={45}
  nextTierPoints={100}
  nextTierName="Advocate"
/>
```

**Features:**
- Dynamic color gradient based on progress:
  - 0-25%: Blue
  - 25-50%: Amber
  - 50-75%: Orange
  - 75-100%: Green (with pulse)
- Animated progress bar below ring
- Motivational status badges

**Props:**
- `currentPoints: number` - User's current points
- `nextTierPoints: number` - Points needed for next tier
- `nextTierName: string` - Name of next tier

---

### 4. NotificationBell

Animated notification bell with dropdown menu.

```tsx
import NotificationBell from "@/components/waitlist/NotificationBell";

<NotificationBell userEmail="user@example.com" />
```

**Features:**
- Pulsing bell icon (only when unread notifications exist)
- Dropdown with notification history
- 4 notification types: share, points, badge, community
- Unread count badge
- Mark as read/clear all functionality
- localStorage persistence

**Mock Notifications:**
- "Someone used your link!"
- "You earned 25 points!"
- "You unlocked a new badge!"
- "Community hit 1,000 members!"

**Props:**
- `userEmail: string` - User's email for localStorage key

---

### 5. CommunityMilestone

Community goal progress display with celebration badges.

```tsx
import CommunityMilestone from "@/components/waitlist/CommunityMilestone";

<CommunityMilestone totalCount={2800} />
```

**Milestones:**
- 500 Club (Blue)
- 1K Strong (Orange)
- 2.5K Movement (Purple)
- 5K Revolution (Red/Pink)

**Features:**
- Animated progress bar to next milestone
- Individual milestone cards with status
- Celebration message when all milestones reached
- Progress statistics footer

**Props:**
- `totalCount: number` - Current total community members

---

### 6. AlmostThereNudge

Prominent nudge banner for users one referral away from next tier.

```tsx
import AlmostThereNudge from "@/components/waitlist/AlmostThereNudge";

<AlmostThereNudge
  nextTierName="Advocate"
  nextReward="Early access to beta features"
  referralLink="https://storybuilders.com/join?ref=xyz123"
/>
```

**Features:**
- Animated pulsing border with shimmer effect
- "You're ONE referral away!" message
- Share button with native share API support
- Dismissible (persists across sessions)
- Progress indicator animation

**Props:**
- `nextTierName: string` - Name of next tier to unlock
- `nextReward: string` - Reward description
- `referralLink: string` - User's referral link

---

### 7. LaunchCountdown

Beautiful countdown timer with multiple states.

```tsx
import LaunchCountdown from "@/components/waitlist/LaunchCountdown";

// With launch date
<LaunchCountdown launchDate="2024-06-15T12:00:00Z" />

// Coming soon state
<LaunchCountdown />
```

**States:**
1. **Coming Soon** - No launch date provided
   - Purple gradient background
   - Pulse animations
   - Feature list preview

2. **Active Countdown** - Launch date in future
   - Flip animations on each second
   - Days, hours, minutes, seconds cards
   - Gradient animated borders
   - Call-to-action footer

3. **Launched** - Launch date in past
   - Celebration mode with emoji
   - Green/emerald gradient

**Props:**
- `launchDate?: string` - ISO 8601 date string (optional)

---

## Integration Examples

### Full Waitlist Dashboard

```tsx
import { useState } from "react";
import MilestoneModal from "@/components/waitlist/MilestoneModal";
import BadgeShowcase from "@/components/waitlist/BadgeShowcase";
import ProgressRing from "@/components/waitlist/ProgressRing";
import NotificationBell from "@/components/waitlist/NotificationBell";
import CommunityMilestone from "@/components/waitlist/CommunityMilestone";
import AlmostThereNudge from "@/components/waitlist/AlmostThereNudge";
import LaunchCountdown from "@/components/waitlist/LaunchCountdown";

export default function WaitlistDashboard() {
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);

  const userEmail = "user@example.com";
  const referralLink = "https://storybuilders.com/join?ref=xyz";
  const currentPoints = 85;
  const nextTierPoints = 100;
  const nextTierName = "Advocate";
  const earnedBadges = [
    { badge_id: "first_share", earned_at: new Date().toISOString() }
  ];
  const communityCount = 2500;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      {/* Notification Bell */}
      <div className="fixed top-6 right-6">
        <NotificationBell userEmail={userEmail} />
      </div>

      {/* Almost There Nudge */}
      <AlmostThereNudge
        nextTierName={nextTierName}
        nextReward="Exclusive VIP features"
        referralLink={referralLink}
      />

      {/* Milestone Modal */}
      <MilestoneModal
        isOpen={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        tier={{
          id: 1,
          name: "Advocate",
          reward: "Exclusive VIP features"
        }}
      />

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Launch Countdown */}
        <section>
          <LaunchCountdown launchDate="2024-06-15T12:00:00Z" />
        </section>

        {/* Progress Ring */}
        <section className="flex justify-center">
          <ProgressRing
            currentPoints={currentPoints}
            nextTierPoints={nextTierPoints}
            nextTierName={nextTierName}
          />
        </section>

        {/* Community Milestone */}
        <section>
          <CommunityMilestone totalCount={communityCount} />
        </section>

        {/* Badge Showcase */}
        <section>
          <BadgeShowcase earnedBadges={earnedBadges} />
        </section>
      </div>
    </div>
  );
}
```

---

## Styling & Customization

### Tailwind Classes Used
- `backdrop-blur-xl`, `backdrop-blur-sm` - Blur effects
- `bg-gradient-to-br`, `bg-gradient-to-r` - Gradient backgrounds
- `border-white/20`, `border-white/10` - Glassmorphism borders
- `text-white/70`, `text-white/60` - Text opacity

### Color System
- **Purple Brand**: #5B2D8E (used for dark sections)
- **Tier Colors**:
  - Storyteller: Amber
  - Advocate: Blue
  - Champion: Gold
  - Hero: Purple
  - Legend: Emerald
  - Founding Elite: Cyan/Platinum

### Animation Library
All components use `motion/react` (v12.35.0) for smooth animations:
- `AnimatePresence` - Mount/unmount animations
- `motion.div` - Animated containers
- `whileInView` - Viewport-triggered animations
- `transition` - Timing and easing

---

## Browser Support
- Modern browsers with ES2020+ support
- CSS custom properties support
- SVG animations support
- localStorage API

## Performance Notes
- Animations are optimized with GPU acceleration
- Lazy loading with `whileInView` for viewport detection
- localStorage used for light state persistence
- No external API calls in components (ready for integration)

---

## Next Steps for Integration

1. **Notifications**: Replace mock notifications in `NotificationBell.tsx` with actual Supabase `waitlist_events` queries
2. **State Management**: Connect components to your global state or React Query
3. **Analytics**: Add event tracking for milestone unlocks and tier progression
4. **Backend Integration**: Connect tier progression logic to your backend
5. **Localization**: Add i18n support for different languages

All components are fully typed and production-ready.
