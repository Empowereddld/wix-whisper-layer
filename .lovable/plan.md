

## Remove Detailed Points Mechanics from Progress Steps

**Why**: The granular points breakdown ("+2 pts with streak bonuses up to +50", "7-day streak earns +10 bonus points") feels overwhelming for parents/educators. Keep messaging aspirational and action-oriented.

### Changes (single file: `src/pages/StoryBuilders.tsx`)

**Tier 2 impact text (line 659)**:
- From: "Share your referral link with other families (+25 pts per signup), post on social media (+3 pts per share), and check in daily (+2 pts with streak bonuses up to +50). You can reach this tier without any referrals."
- To: "Share your referral link with other families, post on social media, and check in daily to climb. You can reach this tier without any referrals."

**Tier 3 impact text (line 665)**:
- From: "Keep referring families, sharing your link, and building your daily check-in streak. A 7-day streak earns +10 bonus points, and a 14-day streak earns +20. Every referral is worth 25 points."
- To: "Keep referring families, sharing your link, and building your daily check-in streak. Consistency is rewarded — the longer your streak, the faster you climb."

The point values (+25, +3, etc.) in the Tier 1 text are fine since that's the onboarding step where users need to understand the basics. Tiers 4 and 5 already use aspirational language and don't need changes.

