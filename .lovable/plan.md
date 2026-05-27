
## Goal

Stop the `/storypros` Join Now form from returning "Edge Function returned a non-2xx status code" when the email is already on the waitlist (Camesha's case). Make the existing-email path deterministic and resilient to soft-deleted duplicates.

## What's broken

`supabase/functions/storybuilders-signup/index.ts`:

1. Pre-insert duplicate check uses `.maybeSingle()` with no `deleted_at` filter. The unique index is partial (`storybuilders_waitlist_email_active_unique`, active rows only), so the table can legitimately contain 1 active + N soft-deleted rows for the same email. `maybeSingle()` then returns `{ data: null, error: "multiple rows" }`, the error is discarded, and the code proceeds to INSERT → 23505 → 500 to the user.
2. The 23505 path itself has no graceful fallback — any race between two clicks would surface the same ugly 500.

## Fix (edge function only, no schema changes)

In `supabase/functions/storybuilders-signup/index.ts`:

### 1. Tighten the duplicate-email lookup

Replace the existing `existing` query with one that mirrors the partial unique index:

```ts
const { data: existing, error: existingErr } = await supabase
  .from("storybuilders_waitlist")
  .select("id, referral_code, invite_count, points, email_verified")
  .eq("email", normalizedEmail)
  .is("deleted_at", null)        // align with _email_active_unique
  .order("created_at", { ascending: false })
  .limit(1)
  .maybeSingle();

if (existingErr) {
  console.error("Existing-email lookup failed:", existingErr);
  // fall through; the 23505 handler below will still catch a true collision
}
```

This guarantees we only ever consider the active row and never trip `maybeSingle` on soft-deleted duplicates.

### 2. Keep the existing friendly "already_joined" response

When `existing` is found, return the same `already_joined: true` payload we already return today (referral_code, invite_count, points, total_count). No copy change needed — the frontend already handles it.

### 3. Add a 23505 safety net on the insert

Even with the lookup fix, two concurrent clicks could race. Wrap the insert result:

```ts
if (insertError) {
  if ((insertError as any).code === "23505") {
    // Lost the race — re-read the active row and return already_joined
    const { data: raceRow } = await supabase
      .from("storybuilders_waitlist")
      .select("referral_code, invite_count, points")
      .eq("email", normalizedEmail)
      .is("deleted_at", null)
      .maybeSingle();

    if (raceRow) {
      const { data: totalCount } = await supabase.rpc("get_storybuilders_waitlist_count");
      return new Response(JSON.stringify({
        already_joined: true,
        referral_code: raceRow.referral_code,
        invite_count: raceRow.invite_count ?? 0,
        points: raceRow.points,
        total_count: totalCount ?? 0,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
  }
  console.error("Insert error:", insertError);
  return new Response(JSON.stringify({ error: "Failed to join waitlist" }), {
    status: 500,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

## Out of scope

- No DB migration. The partial unique index is correct; only the function logic was wrong.
- No change to verification flow, welcome email, referral awarding, fraud check, or rate limiting.
- No frontend changes — `useStorybuildersWaitlist` already handles the `already_joined: true` response.
- Not deleting / merging Camesha's soft-deleted rows. The fix makes that state harmless going forward.

## Verification after deploy

1. Re-submit the form on `/storypros` with `camesha.russell03@gmail.com` → expect the existing `already_joined` UI state (no error banner), not a 500.
2. Tail `storybuilders-signup` logs and confirm no new `23505` errors after the deploy.
3. Submit with a brand-new test email → expect normal signup + verification email (unchanged path).
