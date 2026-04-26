## Goal

Update every Story Pros launch-team email (1, 2, 3, 4, 5, 6, 7, 7B) so the HTML sent by `send-waitlist-email` matches the final locked copy in `Final_Copy-_Pros_App_Email_Sequence_1.pdf` exactly — same subjects, preview text, body, scripts, tier rewards, and CTAs. No emojis, no em dashes (per project rule), keep purple brand styling.

## What's currently in the codebase

`supabase/functions/send-waitlist-email/index.ts` has 8 template branches:
- `welcome` — Email 1 (outdated copy, doesn't match PDF)
- `verification` — used by signup link
- `email2_points_tiers` — Email 2 (old pricing $5.99/$7.99, wrong tier rewards, missing scripts)
- `milestone_unlocked` — generic placeholder currently used for ALL tier-ups (Emails 3–7B)
- `referral_joined`, `weekly_digest`, `nudge`, `announcement` — auxiliary, not in PDF, leave alone

Email 2 is dispatched 24h post-signup by `send-waitlist-email2` cron. Tier-up emails (3–7B) are not yet wired to dedicated templates — they all hit the generic `milestone_unlocked`.

## Changes

### 1. Rewrite existing templates in `supabase/functions/send-waitlist-email/index.ts`

- **`welcome`** → Email 1 final copy. Subject `Welcome to Story Pros, {name}`, preview line, "Confirm my email (+15 points)" CTA pointing at `verification_link`, referral link block, both copy-paste scripts, signed by Camesha, Jinean and The Story Pros Team. Include welcome-video link to `/storypros`.
- **`email2_points_tiers`** → Email 2 final copy. New subject `Welcome back, {name}. Here's how Story Pros points work.`, full points table (Sign up +10, Verify +15, Profile +10, IG/FB/YT +8, First share +5, First referral +10, Refer friend +25, Refer SLP +50, Share +1/max 5/day, Tap +3/max 15/day), 6-tier list with correct rewards ($7.99/$9.99 founder pricing, Tier 6 first-50 rule + 100 Story Coins fallback), three "quickest moves", both scripts, dual CTAs (Share link / Dashboard).

### 2. Add 6 new template branches in the same file

- **`email3_tier2`** — "Your free guide is ready, {name}". EF guide download CTA + Tier 3 push (50 Story Coins).
- **`email4_tier3`** — "You just earned 50 Story Coins, {name}". Tier 4 push (VIP Beta + Suggestion Board).
- **`email5_tier4`** — "You get to test Story Pros before it launches, {name}". Cumulative tier list, Tier 5 push ($7.99 founder pricing, double points).
- **`email6_tier5`** — "You just hit Tier 5, {name}.". Founder Pricing locked, double points, cumulative tiers, three scripts, Tier 6 push (signed book + merch first 50, else 100 Story Coins).
- **`email7_tier6_founder`** — "You did it, {name}. You're a Story Pros Founder." Uses `{founder_slot_number}`. Signed book + Founder merch + lifetime $7.99 + "Claim my Founder package" CTA.
- **`email7b_tier6_legend`** — "You went all the way, {name}." 150 Story Coins total, lifetime $7.99, early access, Legend badge, future merch priority, thank-you note, full cumulative tier list, dashboard CTA, share CTA.

All new templates accept `{ name, referral_link, points_to_next, founder_slot_number?, referral_count?, guide_download_url? }` data and use the existing brand styling (purple #5B2D8E, container/card/button/footer constants).

### 3. Style + content rules applied to every template

- No emojis anywhere.
- No em dashes in body copy (only as bullet "Tier X — reward" separators, which the project rule allows).
- Replace any "—" inside scripts with commas/periods.
- Sign-off: "Camesha, Jinean and The Story Pros Team".
- Keep system-managed "Unsubscribe" link in footer pointing at `/unsubscribe`.
- Pricing standard: $7.99/mo Founder, $9.99/mo regular.

### 4. Update locked memory files

The 7 `mem://features/story-pros/email-*` files are marked "LOCKED" with the previous copy. Refresh each to mirror the new PDF copy so future agents stay aligned. Files: `email-1-welcome.md`, `email-2-points-tiers.md`, `email-3-tier2-reached.md`, `email-4-tier3-reached.md`, `email-5-tier4-reached.md`, `email-6-tier5-reached.md`, `email-7-tier6-reached.md` (covers both 7 and 7B).

### Out of scope (not changing now)

- Wiring tier-up triggers (3–7B) to call the new templates. Today they all route through `milestone_unlocked`. Flag this as follow-up: the tier-up dispatcher (referenced in `mem://tech/story-pros/email-automation`) needs to map tier → new template name. Want me to include that wiring in this same change? If yes, I'll also update the dispatcher to pick `email3_tier2` / `email4_tier3` / etc. based on the tier crossed and add `email3_sent_at`...`email7_sent_at` columns so each fires once.
- The auxiliary templates (`referral_joined`, `weekly_digest`, `nudge`, `announcement`) — not in the PDF, leaving as is.
- No new edge function, no DB migration (unless you confirm the dispatcher wiring above).

## Files touched

- `supabase/functions/send-waitlist-email/index.ts` (rewrite welcome + email2, add 6 new branches)
- `mem://features/story-pros/email-1-welcome.md` through `email-7-tier6-reached.md` (refresh locked copy)

## Question before I implement

Do you also want me to wire the tier-up dispatcher so Emails 3, 4, 5, 6, 7/7B actually fire from the new templates instead of the generic `milestone_unlocked`? It needs a small migration (`email3_sent_at`...`email7_sent_at` columns) plus dispatcher logic. If yes, I'll fold it into the same change.
