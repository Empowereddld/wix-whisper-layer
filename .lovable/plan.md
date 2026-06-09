## Goal

Make every place that mentions Story Coin amounts match the database:
- **Tier 3 (75 pts)** = **75 Story Coins** (was 50)
- **Tier 5 (250 pts)** = **200 Story Coins** (new — Tier 5 currently only advertises Founder Pricing)
- **Tier 6 (500 pts, after the 20 Founder slots are claimed)** = **100 Story Coins** (unchanged)

No DB changes. No new features. Pure copy + constants sync.

## Heads up before I start

Three of the email templates I'll touch are tagged "locked" in project memory (`mem://features/story-pros/email-4-tier3-reached`, `email-6-tier5-reached`, `email-7-tier6-reached`). I'll update them per your instruction and also refresh those memory notes so the new copy is the new lock. Tier 5's reward proposition expands from "Founder Pricing only" to "Founder Pricing + 200 Story Coins"; flag now if you'd rather keep Tier 5 silent on coins.

## Exact changes (every spot, with before → after)

### 1. `src/lib/waitlist-constants.ts`
- `COIN_DROPS` (line 34): `{ 2: 50 }` → `{ 2: 75, 4: 200 }` (index 2 = Tier 3, index 4 = Tier 5)
- Comment above it: "Tier 3 (75 pts) = 50 bonus Story Coins" → "Tier 3 (75 pts) = 75 Story Coins, Tier 5 (250 pts) = 200 Story Coins, Tier 6 post-Founder = 100 Story Coins"
- `TIER_REWARDS[2].name` (line 87): "50 Bonus Story Coins" → "75 Story Coins"
- `TIER_REWARDS[4].name` (currently "Founder Pricing Locked"): keep the pricing reward but append "+ 200 Story Coins" to the name, and update the description to mention both. Same for `TIER_REWARDS[2].description` to read "75 bonus Story Coins to spend on in-app extras at launch."

### 2. `src/components/waitlist/RewardsInventory.tsx`
- Line 73 `name`: "50 Bonus Story Coins" → "75 Story Coins"
- Line 74 `description`: update to "75 bonus Story Coins to spend on in-app extras at launch"
- Line 160 comment + line 162 `setCoinDropAmount(50)`: 50 → 75
- Add a parallel coin-drop trigger for Tier 5 (reward.tier === 4) firing `setCoinDropAmount(200)`
- Line 101 (Tier 6 description): unchanged — still says 100 bonus Story Coins
- Add a Tier 5 reward row in the TIER_REWARDS array mention if needed so the Tier 5 row reflects "+200 Story Coins" alongside Founder Pricing

### 3. `src/pages/StoryProsDashboard.tsx`
- Lines 481–482: replace `const coinBalance = currentTier >= 2 ? COIN_DROPS[2] || 0 : 0;` with a sum over all reached tiers (`Object.entries(COIN_DROPS).reduce((sum, [tier, amt]) => currentTier >= Number(tier) ? sum + amt : sum, 0)`) so a Tier 5 user shows 275, a Tier 3 user shows 75, etc.

### 4. `src/pages/StoryBuilders.tsx`
- Line 39 (rewards table): "50 Story Coins dropped into your account…" → "75 Story Coins dropped into your account to spend on in-app extras at launch"
- Line 41 (Tier 5 row): "A reward that changes what you pay for Story Pros…" → "Founder Pricing locked in for life ($7.99/mo instead of $9.99) plus 200 Story Coins"
- Line 921 (timeline reward card, Tier 3): "50 Story Coins dropped into your account" → "75 Story Coins dropped into your account" (and matching `desc`)
- Line 933 (Tier 5 timeline card): reword from "Locked until Tier 5" mystery copy to "Founder Pricing for life + 200 Story Coins"
- Line 939 (Tier 6 subdesc): unchanged — still 100 bonus Story Coins

### 5. `supabase/functions/send-waitlist-email/index.ts`
All seven coin mentions:

| Line | Email | Before → After |
|------|-------|----------------|
| 343 | Welcome ladder list | "Tier 3 (75 pts): Bonus Story Coins…" → "Tier 3 (75 pts): 75 Story Coins to spend inside the app at launch." |
| 419 | Email 3 (Tier 2 reached) "What's next" | "Tier 3 (75 pts), 50 Story Coins" → "Tier 3 (75 pts), 75 Story Coins" |
| 466 | Email 4 (Tier 3 reached) subject | "You just earned 50 Story Coins, …" → "You just earned 75 Story Coins, …" |
| 470 | Email 4 hero | "50 Story Coins are yours." → "75 Story Coins are yours." |
| 480 | Email 4 body | "**50 Story Coins are yours.**" → "**75 Story Coins are yours.**" |
| 576 | Email 4 ladder recap | Tier 3: "50 Bonus Story Coins" → "75 Story Coins" |
| 658, 754, 857 | Emails 5, 6, 7 ladder recaps | Tier 3 line: "50 Bonus Story Coins"/"50 Story Coins" → "75 Story Coins" |
| 838–839 | Email 7 body | "Combined with the 50 you earned at Tier 3, that's 150 Story Coins" → "Combined with the 75 you earned at Tier 3 and the 200 you earned at Tier 5, that's 375 Story Coins" |
| Email 6 (Tier 5 reached, around line 700ish — I'll surface and update) | Body | Add a "200 Story Coins are yours" beat alongside the Founder Pricing reveal; update ladder recap Tier 5 line to "Founder Pricing + 200 Story Coins + double points"; update "what's next" to subtract those 200 from the Tier 6 framing |
| 670, 860 | Email 6 / 7 references to Tier 6 = 100 Story Coins | unchanged |

After edits I'll redeploy `send-waitlist-email`.

### 6. Memory refresh
Update three locked memory files to reflect the new copy:
- `mem://features/story-pros/email-4-tier3-reached` → 75 Story Coins
- `mem://features/story-pros/email-6-tier5-reached` → Founder Pricing + 200 Story Coins
- `mem://features/story-pros/reward-journey` → new coin totals at Tier 3 / 5 / 6

### 7. Out of scope (calling out so you can decide later)
- The orphaned migration `20260413000002_coin_drop_triggers.sql` references a different tier scheme and a function (`award_waitlist_points`) that isn't live. I'm not touching DB code in this pass since you said "treat the database amounts as correct." If you want, I can follow up with a separate migration that aligns the trigger to the live 6-tier ladder (75 @ current_tier 2, 200 @ current_tier 4 in the live 0-indexed scheme) so the coins actually get awarded.
- `CoinBalance.tsx`, `CoinDropAnimation.tsx`: no hardcoded amounts, just render whatever is passed. No edits.

## Deliverable to you
After the edits I'll post a single checklist showing every file + line + final string, so you can confirm nothing was missed.
