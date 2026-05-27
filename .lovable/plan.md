## The problem

Today the `storybuilders_waitlist` table stores **one** `verification_token` column. Every time we issue a fresh link (resend button, admin nudge, reminder cron, backfill), we overwrite that column. The old link in the user's inbox becomes a dead 404 because `verify-email-waitlist` looks up by `eq("verification_token", token)`.

That's exactly what happened to Fiona, and yes, it will keep happening to anyone who clicks the first email after we've sent a second one.

## The fix

Move verification tokens out of a single column and into their own table, so multiple tokens can be valid at the same time. Each token still independently expires after 7 days.

### 1. New table: `waitlist_verification_tokens`

| column | purpose |
|---|---|
| `id` | pk |
| `waitlist_id` | fk to `storybuilders_waitlist.id` |
| `token` (unique) | the URL token |
| `created_at` | for the 7-day expiry check |
| `used_at` | set when consumed (kept for audit, not deleted) |

RLS: no anon/authenticated access. Edge functions use service role only. Index on `token` and on `waitlist_id`.

### 2. Issue tokens additively

Anywhere we currently overwrite `verification_token` on the waitlist row, instead `INSERT` a new row into `waitlist_verification_tokens`:

- `storybuilders-signup`
- `resend-verification-waitlist`
- `admin-nudge-unverified`
- `send-verification-reminders` (both 24h and 72h branches)
- `backfill-verification-emails`

We'll keep updating `verification_sent_at` on the waitlist row so the resend rate-limit and reminder cadence keep working unchanged.

### 3. Verification lookup accepts any unused, unexpired token

Rewrite the lookup in `verify-email-waitlist`:

1. Find the token row by `token`.
2. If none → "invalid or expired" page (same as today).
3. If `used_at IS NOT NULL` → treat as already-verified path (redirect to success/already page).
4. If `created_at` older than 7 days → expired page.
5. Otherwise: mark `used_at = now()`, mark the waitlist row `email_verified = true`, award the +15, send the Welcome email (gated on `welcome_sent_at` like today).

Other unused tokens for the same `waitlist_id` are left alone — on a second click, step 3 redirects cleanly to the "already verified" page, which is the behavior we want.

### 4. Backfill + cleanup

- One-time migration: for every existing waitlist row where `verification_token IS NOT NULL` and `email_verified = false`, insert a row into the new table using the existing token and `verification_sent_at` as `created_at`. No user-visible breakage; their current link keeps working.
- The `verification_token` column on `storybuilders_waitlist` becomes legacy. Leave it in place for now (don't break the admin nudge/reminder queries that filter on `not("verification_token", "is", null)`); we'll switch those reads to the new table in the same PR and drop the column in a follow-up once safe.

### 5. Touch points to update in the same change

- Admin nudge + reminder crons: instead of reading `verification_token` off the waitlist row, issue a fresh token (insert) and use that in the email. Old links in the inbox still work because we never invalidate them.
- Resend rate-limit logic stays as-is (2 minutes, based on `verification_sent_at`).

## What this means for users

- Fiona's case never repeats. Every link we ever sent works until it naturally expires after 7 days or until one of them gets clicked.
- After a successful click, subsequent clicks on any other link from that user land on the friendly "already verified" page instead of a scary error.
- No change to the 7-day window, the +15 points, the Welcome email gating, or the verified-success redirect.

## Out of scope

- Changing the 7-day expiry length.
- Removing the legacy `verification_token` column (do this in a small follow-up once we confirm nothing else reads it).
