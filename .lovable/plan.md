# Batch 1 Fixes (in order, confirm each before moving on)

## Fix 1 — RPC column collisions (42702 prevention)

Single migration that drops the old signatures first, then recreates with `out_` prefixed OUT columns (same pattern as `verify_waitlist_and_award`).

**`get_pending_slp_verifications()`**
- `DROP FUNCTION IF EXISTS public.get_pending_slp_verifications();`
- Recreate returning `out_id`, `out_user_email`, `out_referred_by_email`, `out_created_at`.
- No frontend callers found, so nothing to update on the client.

**`check_user_vote(p_email text)`**
- `DROP FUNCTION IF EXISTS public.check_user_vote(text);`
- Recreate returning `out_theme_id`, `out_voted_at`.
- Update caller `src/components/waitlist/ThemeVoting.tsx:44` to read `(data as any)[0].out_theme_id`. (Lines 64 and 100 belong to `get_theme_results` — leave untouched.)

**Confirm:** call both RPCs via `supabase--read_query` / curl and verify no 42702.

---

## Fix 2 — Stop emailing soft-deleted users

- `supabase/functions/send-verification-reminders/index.ts` line ~48: append `.is("deleted_at", null)` to the waitlist query.
- `src/pages/admin/AdminEmails.tsx` line ~59: append `.is("deleted_at", null)` to the bulk recipient query.

**Confirm:** read the updated queries; spot-check that a row with `deleted_at IS NOT NULL` is excluded via `supabase--read_query`.

---

## Fix 3 — Stop verifying / updating soft-deleted records

- `supabase/functions/verify-email-waitlist/index.ts` line ~260: after fetching the waitlist row, reject if `deleted_at !== null` with a clear message: `"This signup is no longer active."` (HTML response uses existing `HTML_HEADERS`; JSON response uses standard JSON error shape — match whichever branch this line sits in).
- `supabase/functions/update-waitlist-profile/index.ts` lines ~197, ~215, ~240: append `.is("deleted_at", null)` to all three query paths so updates no-op on deleted rows and return a clear error when the lookup yields nothing.

**Confirm:**
- `verify-email-waitlist` rejects a soft-deleted row with the new message.
- `update-waitlist-profile` returns an error when targeting a deleted row.

---

## Scope guardrails

- No other files touched.
- No behavior changes to `get_theme_results`, leaderboard RPCs, `useSavedResources`, `EducationalApp`, `ClaimFounder`, `EarlySupportersWall`, or any Content-Type header work — those are Batch 2+.
- Migration is schema-only (DROP + CREATE FUNCTION), no data writes.

## Thoughts on the plan

This batch is well-scoped and low-risk. The two RPC renames are the same pattern that already worked for `verify_waitlist_and_award`, and `get_pending_slp_verifications` has zero client callers so it's effectively free. The four soft-delete filters are one-line additions each. Sequencing makes sense: schema first (so callers can be updated atomically), then read-side filters, then write-side guards.

One small note: the `verify-email-waitlist` rejection needs to land in whichever response branch (HTML vs JSON) line 260 actually sits in — I'll match the surrounding pattern rather than introduce a new one.
