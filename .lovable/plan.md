## What that flashing page actually is

It's the dashboard itself, but in its **unverified state** ("You're almost there, Camesha! / Resend verification email / Unlocks after verification…"). You've never seen it because the last time you were unverified, you were on the verify-email page, not the dashboard.

## Why it flashes

When you click **Complete my profile** in the email, the dashboard mounts and immediately renders from whatever's in `localStorage`. The hook's default for `emailVerified` is `false`, and old localStorage entries from your first signup (before you verified) don't carry the verified flag either. So the dashboard paints the unverified state first, *then* fires `refreshStats`, gets the real row from the DB, sees `email_verified = true`, and re-renders the verified state ("Welcome, Camesha! / Tier Progress / Complete-your-profile card").

That gap between paint #1 and paint #2 is the half-second flash. Same pattern happens with `profileCompleted` — the Complete-your-profile card can also briefly appear or disappear during that re-render.

## The fix

Add a "first-fetch-complete" gate to the dashboard so we don't render verify/profile-state UI until we've heard back from the server at least once. Concretely:

1. **Track first-fetch completion in the hook**
   `useStorybuildersWaitlist` should expose a `statsHydrated` boolean that flips to `true` only after the initial `refreshStatsInternal` resolves (success *or* failure). Keep the existing `loading` flag for in-flight refreshes.

2. **Gate the verify banner and the Complete-your-profile card on `statsHydrated`**
   In `StoryProsDashboard.tsx`:
   - `{!wl.emailVerified && wl.statsHydrated && ( … verify banner … )}`
   - `{wl.emailVerified && !wl.profileCompleted && wl.statsHydrated && ( … CompleteProfileCard … )}`

   While `statsHydrated` is false, show a soft skeleton in those slots (or just nothing) instead of the unverified content.

3. **Same gate for the "Unlocks after verification" lock card and the Welcome header**
   Anywhere the dashboard branches on `emailVerified` for which experience to show, gate it on `statsHydrated` so the user never sees the wrong branch first.

4. **Optional polish** — also add `?ref=${referral_code}` to the dashboard CTAs in `send-waitlist-email/index.ts` (Email 2 and any others) so the link still hydrates correctly when opened in a new browser/device where localStorage is empty. This is the secondary fix from before; worth doing in the same pass since we're already in this flow.

### Technical details

- Files touched:
  - `src/hooks/useStorybuildersWaitlist.ts` — add `statsHydrated` to state, set it `true` in the `finally` of the first `refreshStatsInternal` call inside `initializeState`. Don't reset it on subsequent refreshes.
  - `src/pages/StoryProsDashboard.tsx` — wrap the verify banner (~line 644), the CompleteProfileCard (~line 639), and any verified/unverified branches with the new flag. Render a thin `SkeletonLoader` (already in `src/components/waitlist/SkeletonLoaders.tsx`) in their place during hydration.
  - `supabase/functions/send-waitlist-email/index.ts` — append `?ref=${data.referral_code}` to dashboard hrefs, with a fallback to bare URL when the code is missing.
- No DB migrations, no schema changes, no edge function logic changes besides the URL string.
- Acceptance check: hard-refresh `/storypros/dashboard` while signed up + verified — there should be no orange "You're almost there" flash before the verified Welcome view paints.