# Batch 3 Plan

Same approach as Batches 1 and 2: do them in order, confirm each.

## Important findings before we touch anything

Two items in your batch don't match what's actually deployed. Confirming so we don't ship dead code:

- **`get_waitlist_leaderboard` and `get_waitlist_analytics` RPCs don't exist** in the production database. The full live RPC list does not contain them. The leaderboard/activity feed are served by the inline queries in `useStorybuildersWaitlist.ts` (lines 810 and 833), not by RPCs. I will skip those two RPC renames and instead make sure the inline equivalents are filtered.
- **Fix 8 (Content-Type headers) is already done.** I just verified all `JSON.stringify(...)` responses in `dispatch-tier-emails`, `send-waitlist-email2`, and `resend-webhook`. Every one of them already passes `{ ...corsHeaders, "Content-Type": "application/json" }`. There is nothing to change. I will mark Fix 8 complete with no edit and link the verifying grep in the confirmation.

If you'd rather I add `get_waitlist_leaderboard` / `get_waitlist_analytics` as new RPCs (instead of inline queries), say so and I'll spec that separately.

## Fix 6 — Exclude soft-deleted users from leaderboards, analytics, counts

**Single migration** (schema-only DROP + CREATE, no data writes) for the RPCs that do exist:

1. `get_storybuilders_waitlist_count()` — add `WHERE deleted_at IS NULL` to the `SELECT COUNT(*)`.
2. `get_waitlist_by_referral(p_code text)` — add `AND w.deleted_at IS NULL` to the predicate. No OUT-column rename needed (its OUT names already don't collide; we just need the filter).

**Frontend / inline queries**:

3. `src/hooks/useStorybuildersWaitlist.ts:810` (leaderboard query) — append `.is("deleted_at", null)`.
4. `src/hooks/useStorybuildersWaitlist.ts:833` (activity feed query) — append `.is("deleted_at", null)`.
5. `src/hooks/useStorybuildersWaitlist.ts:913` (`linkAuthAccount` lookup) — append `.is("deleted_at", null)` so a deleted row can't be linked.

**Edge function** `supabase/functions/weekly-app-summary/index.ts`:

6. Extend the `countRange` helper with an optional `excludeDeleted?: boolean` arg that appends `.is("deleted_at", null)` when true. Pass it for both `storybuilders_waitlist` calls at lines 87 and 88.
7. Top StoryPros referrers query (~line 132) — append `.is("deleted_at", null)`.
8. Recent waitlist signups query (~line 143) — append `.is("deleted_at", null)`.

**Confirm**: `supabase--read_query` against `get_storybuilders_waitlist_count()` and `get_waitlist_by_referral(...)` returning excluded counts when a row has `deleted_at IS NOT NULL`; spot-check the three inline queries by reading the updated lines.

## Fix 7 — Recovery actions on dead-end error states

**`src/pages/ClaimFounder.tsx`** — the `status.state === "invalid"` block (lines ~204-213). Add a prominent recovery CTA inside the card, below the message:

```tsx
<Button asChild className="mt-6">
  <Link to="/storypros">Back to Story Pros</Link>
</Button>
```

(Uses the existing `Button` + `Link` imports already in the file; matches the styling pattern from the `submitted` block right below it.)

**`src/pages/EarlySupportersWall.tsx`** — the `error` block (lines ~172-175). Refactor the fetch into a `useCallback` so the same function can be called from `useEffect` and from a retry button, then render two CTAs in the error state:

```tsx
<div className="text-center py-20 space-y-6">
  <p style={{ color: "#ef4444" }}>{error}</p>
  <div className="flex flex-wrap items-center justify-center gap-3">
    <Button onClick={fetchSupporters}>Try again</Button>
    <Button variant="outline" asChild>
      <Link to="/">Back to home</Link>
    </Button>
  </div>
</div>
```

(`Button` and `Link` are already in scope; just hoist the existing fetch function out of the `useEffect`.)

**Confirm**: Read both files at the new line ranges to verify the buttons exist; the user can also click through in the preview.

## Fix 8 — Content-Type on JSON Edge Functions

**No change required.** Verified by `rg`: all three functions already emit `Content-Type: application/json` on every JSON response (including the `Forbidden` / `error` branches). I'll re-run the same grep as the confirmation step so you have a clean record, and we won't touch the files.

## Scope guardrails

- No other files touched.
- No data writes; the only DB work is a schema-only migration that drops and recreates two RPC bodies with an added `deleted_at IS NULL` predicate.
- No behavior changes to `verify_waitlist_and_award`, `assign_founder_slot`, `admin_*_waitlist_entry`, or any other RPC already filtering `deleted_at`.
- Email copy and tier logic untouched.
