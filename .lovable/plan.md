# Fix Story Pros email verification

## Status

- Database migration **already applied** (verify_waitlist_and_award now uses `out_*` column names, no more 42702 collision).
- Edge function code changes below need build mode to apply.

## Fix 1 — Edge function reads renamed RPC fields

In `supabase/functions/verify-email-waitlist/index.ts`, change the `rpcRows[0]` consumer from `verified_now / new_points / welcome_sent_at / name / referral_code / email` to `out_verified_now / out_new_points / out_welcome_sent_at / out_name / out_referral_code / out_email`. No other callers exist.

## Fix 2 — Self-serve resend on error pages

Rewrite `getErrorHTML()` in the same file to:

- Soften the page title to "Verification Link Issue" and drop the harsh red "Verification Failed" framing.
- Add an inline form: email input + "Resend my verification link" button.
- Pre-fill the email when the verify branch already knows the user (expired token, RPC error after lookup succeeded).
- Inline `<script>` posts JSON `{ email }` to `${SUPABASE_URL}/functions/v1/resend-verification-waitlist` with the anon key as both `apikey` and `Authorization: Bearer` headers.
- On success: hide form, show "Check your inbox, a fresh link is on the way." If `already_verified`, show that instead.
- On failure: render the error message returned by the function and re-enable the button.
- Copy stays warm, no em dashes ("This link is no longer valid. Drop your email below and we'll send you a fresh one.").

Centralize HTML response headers in one `HTML_HEADERS` const that always includes `Content-Type: text/html; charset=utf-8` so Outlook / Gmail webviews stop rendering raw source. Wrap all error returns in a single `errorPage(reason, status, prefillEmail?)` helper so no branch can forget the header.

## Fix 2b — Loosen `resend-verification-waitlist` to accept email

The current function only accepts `referral_code`. The recovery form only has email. Update `supabase/functions/resend-verification-waitlist/index.ts` to accept **either** `referral_code` **or** `email` in the body and look up the waitlist row accordingly. Everything else (2-minute rate limit, new token issue, verification email send, `already_verified` response) stays identical. No other behavior or auth changes.

Edge functions deploy with `verify_jwt = false` by default, so the anon-key-only call from the static HTML form will be accepted as-is.

## Verification after deploy

1. Tail `verify-email-waitlist` logs and confirm `column reference "email" is ambiguous` (42702) errors stop.
2. Trigger one fresh verification end-to-end: confirm redirect to `/storypros/verified`, +15 points lands, welcome email fires once.
3. Hit a garbage token URL, confirm the new resend form renders, posts, and shows the inline success message.
4. Resend Naz and Justine's links from the admin tool, confirm they land on `/storypros/verified`.

## Out of scope

- Token expiry length (still 7 days).
- Any copy outside the two error pages.
- Any UI work outside the two edge functions.
