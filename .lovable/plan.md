

## Simplify Copy & Lower Thresholds

### 1. Lower point thresholds (`src/lib/waitlist-constants.ts`)

Current: `[0, 40, 100, 175, 325, 600]`
New: `[0, 35, 75, 130, 250, 500]`

This makes every tier feel more reachable — especially Tiers 3–5 where the current gaps are steep for busy parents.

### 2. Simplify copy & remove "check in" references (`src/pages/StoryBuilders.tsx`)

**Tier 1** (line 652–654):
- Task: `"Tier 1 — 0 points"`
- Impact → `"You earned 10 points just by signing up. Complete your profile, verify your email, and follow us on social media to start climbing."`
- Removes all the raw `+10 pts`, `+5 pts`, `+8 pts` values.

**Tier 2** (line 658–660):
- Task: `"Tier 2 — 35 points"`
- Impact → `"Share your referral link with other families and post on social media to climb. You can reach this tier without any referrals."`
- Removes "check in daily".

**Tier 3** (line 664–666):
- Task: `"Tier 3 — 75 points"`
- Impact → `"Keep referring families and sharing your link. Consistency is rewarded — the more you share, the faster you climb."`
- Removes "daily check-in streak" reference.

**Tier 4** (line 670): Task → `"Tier 4 — 130 points"` (impact text stays — it's already clean)

**Tier 5** (line 676–678): Task → `"Tier 5 — 250 points"`, and update the subdesc from "600 pts" → "500 pts" for the Tier 6 teaser.

### 3. Update Tier 2 tip text (line 660)

Current subdesc: `"Tip: Profile + email + 3 social follows = 49 pts — that's Tier 2 right there"`
New: `"Tip: Profile + email + 3 social follows gets you past Tier 2 right away"`

Removes the raw math while keeping the helpful nudge.

### Summary

Three changes across two files — lower the thresholds, remove "check in" language, and strip point values from Tier 1 copy. Everything else stays as-is.

