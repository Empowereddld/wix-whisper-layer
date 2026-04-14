

## Remove Daily Check-in & Streak System

Strip all references to the daily check-in mechanic and streak bonuses from 4 files.

### 1. `src/lib/waitlist-constants.ts`
- Remove `DAILY_CHECKIN: 2` from `REPEATABLE_POINTS`
- Remove entire `STREAK_BONUSES` export
- Remove `MAX_CHECKIN_POINTS` from `DAILY_CAPS`
- Remove `DAILY_CHECKIN`, `STREAK_3`, `STREAK_7`, `STREAK_14`, `STREAK_30` from the `POINTS` backward-compat object

### 2. `src/components/admin/UserPreviewMode.tsx`
- Remove `STREAK_BONUSES` from imports
- Remove `streakDays` from the `TierPreviewData` interface and all 6 tier data objects
- Remove the "Streak" stat in the stats row (~lines 351–359)
- Remove the entire "Daily Streak" card (~lines 365–420)
- Remove the "Daily check-in" row from the points breakdown table (~lines 722–727)
- Remove the `streak_master` badge from tier data objects and badge name/color maps

### 3. `src/pages/WaitlistUserGuide.tsx`
- Remove the "Daily Check-in" row from the points grid (line 251)
- Remove the "Pro Tip" streak callout block (~lines 267–272)
- Update the FAQ answer about earning points without referrals (line 93) to remove "daily check-ins: 2 pts" and "activity streaks"

### 4. `src/pages/AdminWaitlistGuide.tsx`
- Remove the "Daily Check-in +2" card (~line 514–517)
- Remove "Check-in: once per day" from the daily caps list (~line 548)

No database or backend changes needed — the mechanic was never wired up.

