# Pre-Launch Fixes: Email Timing, SLP Lock, Tier Sequencing, Verify-State Sync

Five targeted changes. No schema changes — all logic lives in edge functions and one data backfill.

---

## 1. Email 2 sends 2 hours after verification (not 24h after signup)

**File:** `supabase/functions/send-waitlist-email2/index.ts`

Today the dispatcher selects users where `created_at <= now() - 24h`. Change to:
- Cutoff based on `verified_at` (clock starts at verify, not signup).
- Window of **2 hours** instead of 24.

```ts
const cutoff = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
// select adds: .not("verified_at", "is", null).lte("verified_at", cutoff)
```

Cron already runs every 15 min, so worst case Email 2 lands ~2h 15m after verify — well before most users hit Tier 2.

---

## 2. Lock SLP +50 to one-time only

`+50` is awarded inside `update-waitlist-profile` when `speech_professional_verified` flips false → true. The data layer already guards against double-awarding, but the dashboard UI still shows the SLP toggle as actionable, which is the exploit surface.

**Frontend lock** (`src/pages/StoryProsDashboard.tsx`, role edit dialog):
- When `wl.profile.speech_professional_verified === true`, the "Speech Professional" option in the role `<Select>` shows a "Verified ✓ +50 awarded" badge and the Save button is disabled if they re-pick it.
- Switching FROM speech_pro to another role is allowed (we don't un-award).
- Re-picking speech_pro on a verified row triggers a toast: "You've already claimed your +50 SLP bonus."

**Backend hardening** (`supabase/functions/update-waitlist-profile/index.ts`):
- Confirm/strengthen the existing `if (!existing.speech_professional_verified)` guard so the +50 add never runs twice — even if `role` is changed back to `speech_pro` later. Existing logic already does this; lock it down with a clearer comment + explicit early skip.

No schema change needed: `speech_professional_verified` is the one-time flag.

---

## 3. Sequence tier emails 5 minutes apart

**File:** `supabase/functions/dispatch-tier-emails/index.ts`

Today the function picks the **highest unsent tier** per user and marks all lower tiers as sent in one shot — so a 0 → 200 jump skips Email 3 and 4. The user wants the opposite: Email 3 first, then Email 4 five min later, then Email 5.

Change the per-user loop to:
1. Find the **lowest unsent tier** the user qualifies for.
2. Send only that one email per cron tick.
3. Mark only that one tier's `sent_at`.
4. Next cron run (5 min later, since cron is `*/5`) picks up the next unsent tier.

This produces a natural 5-minute cadence with no sleeps or queues. Remove the "backfill all lower tiers" logic.

For Tier 6 (email7), keep gating behind `email6_sent_at IS NOT NULL` so Tier 5 always lands first.

---

## 4. Verify-email reliably reflects on /storypros immediately

This is the new fifth item. Today's flow: user taps verify link → edge function flips `email_verified = true` and 302-redirects to `/storypros/verified?already=...` or back to `/storypros`. The dashboard hook (`useStorybuildersWaitlist`) reads from `localStorage` plus a one-time fetch, so even after a successful verify the page can still show "pending" until a manual refetch.

**Fixes:**

a. **Dashboard hook** (`src/hooks/useStorybuildersWaitlist.ts`)
   - On mount of `/storypros` and `/storypros/dashboard`, if `email_verified` is `false` in cached/fetched state, refetch the row from Supabase by `referral_code`. Already partially done — confirm it runs.
   - Add a `?verified=1` query-param check: when present (set by the verify edge function on redirect), force a fresh fetch and clear the param from the URL.

b. **Verify edge function** (`supabase/functions/verify-email-waitlist/index.ts`)
   - Change the post-verify redirect from `/storypros` to `/storypros?verified=1` so the dashboard knows to refetch immediately.
   - Already-verified branch redirects to `/storypros/verified?already=1` — leave as-is.

c. **Realtime fallback (optional, low risk):** subscribe the dashboard to `postgres_changes` on its own waitlist row so any server-side flag flip (verify, SLP bonus, tier emails) reflects within a second without page refresh. Skipping unless the fetch-on-mount + `?verified=1` combo proves insufficient.

d. **Reliability check** of the verify edge function itself:
   - Confirm `verify_token` lookup, `email_verified` update, `+15` points add, and welcome email send all complete before the redirect. Wrap the welcome-email send in a try/catch (already done) so a Resend hiccup never blocks the verify state from flipping.
   - Add a single `console.log` of `{ id, verified_at, points_after }` after the update so failures are easy to find in edge logs.

---

## 5. Backfill admin accounts

Mark all `email{2..7}_sent_at`, `welcome_sent_at`, and verification reminder timestamps as `now()` for the two admin emails so cron skips them going forward.

```sql
UPDATE storybuilders_waitlist
SET email2_sent_at = COALESCE(email2_sent_at, now()),
    email3_sent_at = COALESCE(email3_sent_at, now()),
    email4_sent_at = COALESCE(email4_sent_at, now()),
    email5_sent_at = COALESCE(email5_sent_at, now()),
    email6_sent_at = COALESCE(email6_sent_at, now()),
    email7_sent_at = COALESCE(email7_sent_at, now()),
    welcome_sent_at = COALESCE(welcome_sent_at, now()),
    verification_reminder_1_sent_at = COALESCE(verification_reminder_1_sent_at, now()),
    verification_reminder_2_sent_at = COALESCE(verification_reminder_2_sent_at, now())
WHERE LOWER(email) IN ('camesha.russell03@gmail.com', 'jinean.whitleycheng@gmail.com');
```

---

## Test plan after deploy

1. Fresh test signup → verification email arrives, no Welcome yet.
2. Click verify link → land on `/storypros?verified=1`. Dashboard immediately shows "Verified ✓" and points include +15. No reload required.
3. Wait ~2h 15m → Email 2 arrives. Confirm only one copy.
4. From dashboard, pick SLP role → +50 awarded. Re-open role dialog → SLP option shows "Verified ✓ +50 awarded" and re-saving does not add points.
5. Manually push test user from 0 → 250 pts → confirm Email 3 sends, then 5 min later Email 4, then 5 min later Email 5 (not all at once).
6. Camesha + Jinean receive zero catch-up emails after backfill.

---

## Files touched

- `supabase/functions/send-waitlist-email2/index.ts` — cutoff source + window
- `supabase/functions/dispatch-tier-emails/index.ts` — lowest-unsent-tier, one per tick
- `supabase/functions/verify-email-waitlist/index.ts` — redirect to `?verified=1`, log post-update state
- `supabase/functions/update-waitlist-profile/index.ts` — strengthen one-time SLP guard
- `src/hooks/useStorybuildersWaitlist.ts` — refetch on `?verified=1`
- `src/pages/StoryProsDashboard.tsx` — disable SLP option once verified
- Data update via insert tool: backfill admin email timestamps

No schema migrations. No new secrets. No new cron jobs.
