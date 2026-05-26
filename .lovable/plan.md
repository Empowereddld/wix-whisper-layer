# Story Pros email automation — end-to-end wiring audit

## What's already correctly wired

**Cron jobs (all active)**

| Job | Schedule | Function | Auth |
|---|---|---|---|
| `dispatch-tier-emails` | every 5 min | dispatches Emails 3–7/7B | x-cron-secret ✓ |
| `send-waitlist-email2-followup` | every 15 min | dispatches Email 2 | Bearer anon (no secret check) ⚠️ |
| `send-verification-reminders` | hourly | 24h + 72h verify reminders | x-cron-secret ✓ |
| `send-nudge-emails-daily` | daily 16:00 | within-15-pts nudge | x-cron-secret ✓ |
| `send-inactivity-emails-daily` | daily 17:00 | re-engagement | x-cron-secret ✓ |
| `send-founder-scarcity-hourly` | :15 each hour | Tier 6 scarcity | x-cron-secret ✓ |

**Dispatch logic in `dispatch-tier-emails` is correct:**
- Thresholds match `TIER_THRESHOLDS` (35 / 75 / 130 / 250 / 500).
- Sends **only one tier email per cron tick** so a 0 → 250 jump gets Email 3, then 4, then 5 spaced 5 min apart (no inbox flood).
- Tier 6 (Email 7 / 7B) is gated behind `email6_sent_at` so Tier 5 always lands first.
- Founder-slot claim is atomic via `update … is('founder_slot_number', null)` and capped at 20.
- All 8 templates registered in `send-waitlist-email`: welcome, email2_points_tiers, email3_tier2, email4_tier3, email5_tier4, email6_tier5, email7_tier6_founder, email7b_tier6_legend (+ verify/reminders/nudge).

**Live data confirms it's working:** 9 verified users, 9 welcome sent, 9 Email 2 sent, Emails 3–7 flowing per tier crossings.

## Two drift items to fix

### 1. Email 2 timing: code says 1 h, locked copy says 24 h

`send-waitlist-email2/index.ts` line 24:
```ts
const cutoff = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(); // 1 hour
```

Locked memory (`email-2-points-tiers.md`) says **24 hours after signup**. Subject line literally reads "Welcome back, {{first_name}}" — implies next-day, not same-hour.

The code has a justification comment ("reaches them BEFORE crossing tier thresholds"), but that contradicts the locked copy and the double-opt-in flow (Email 1 already lands at verify).

**Decision needed.** Default in this plan: revert to 24 h to match locked copy. If you want to keep 1 h, I'll update the memory note instead.

### 2. `send-waitlist-email2` cron uses anon Bearer, not `x-cron-secret`

The cron command for `send-waitlist-email2-followup` sends the project anon key in `Authorization`. The function itself does **not** validate `x-cron-secret`. That means anyone can hit the function URL and trigger an Email 2 dispatch batch (idempotent via `email2_sent_at` so no double-send, but still wrong auth model and inconsistent with the other 5 cron jobs).

**Fix:** add the same `x-cron-secret` gate the other dispatchers use, and update the cron job to send the secret from vault.

## What I'll change (build phase)

1. `supabase/functions/send-waitlist-email2/index.ts`
   - Change cutoff from `1 * 60 * 60 * 1000` to `24 * 60 * 60 * 1000`.
   - Add `x-cron-secret` validation block (copy pattern from `send-nudge-emails`).
   - Redeploy.
2. `cron.job` for `send-waitlist-email2-followup`
   - Replace Bearer anon header with `x-cron-secret` from vault (matches the other 5 jobs). Done via `supabase--insert` SQL.
3. Verify by running `dispatch-tier-emails` and `send-waitlist-email2` once manually via curl and checking logs.

## What I will NOT touch

- Email body copy (Emails 1–7B already match locked memory files).
- Tier thresholds, points constants, founder slot cap.
- Welcome / verify / reminder / nudge / scarcity / inactivity functions (already correct).

Confirm the Email 2 timing decision (24 h ✓ default, or keep 1 h and update memory) and I'll switch to build mode and ship the two fixes.
