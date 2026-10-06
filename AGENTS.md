# Project architecture rules

- Keep long-term music releases on the expandable `/music` page and isolate temporary promotions in dated home-page campaign components, so future songs do not require restructuring permanent content.- Public email-sending functions rate limit through `supabase/functions/_shared/rateLimit.ts` (keyed hashes only, 2-day purge job), so no raw IPs or emails are stored.
- Public `send-email` templates must match a just-saved form row and render from stored values; privileged callers prove identity with CRON_SECRET, the exact service key, or a verified admin session, never decoded token claims.
- Story Pros dashboard ownership is proven only by the signed, expiring token in `supabase/functions/_shared/dashboardToken.ts` (sliding expiry, absolute cap), never by a referral code, so share links cannot unlock private data.
- Resource purchases are fulfilled only by `verify-payment` from the Stripe session fetched server-side (owner, paid status, line item and currency checked) and unique indexes on `purchases`, so the browser can never declare or repeat a purchase.
