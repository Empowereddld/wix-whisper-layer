## Goal
Notify hello@empowereddld.com whenever a waitlist user self-claims "I'm a speech professional" so admins know to review the SLP Verification Queue promptly.

## Where the self-claim happens
`supabase/functions/update-waitlist-profile/index.ts` is the only path that flips `is_speech_professional = true` (either via the direct boolean flag or via `role === "speech_pro"`). The +50 bonus is already admin-gated; we just need to add notification when the flag flips from false → true.

## Plan

1. **Detect the transition in `update-waitlist-profile`**
   - Before applying updates, fetch current `is_speech_professional` + `name`, `email`, `referral_code` for the row (we already do a similar lookup for `complete_profile`; extend it to always fetch these fields).
   - After the UPDATE succeeds, compare: if previous value was `false`/null AND new value is `true` AND `speech_professional_verified` is still `false`, trigger the notification.

2. **Send the admin notification email**
   - Reuse the existing internal sender `send-waitlist-email` (already auth-gated with `CRON_SECRET`/service-role).
   - Add a new template key `slp-claim-admin-alert` with:
     - To: `hello@empowereddld.com`
     - Subject: `[Action needed] New SLP self-claim — review in admin queue`
     - Body: claimant's name, email, referral code, timestamp, and a direct link to `/admin/waitlist` (or the SLP Verification Queue route) plus a one-line reminder that the +50 bonus is only awarded on approval.
   - Invoke it from `update-waitlist-profile` using the service-role client already in the function (fire-and-forget; failure must not block the profile update — log only).

3. **De-dupe**
   - Only send when the flag actually transitions to true (skip when it was already true). This prevents repeated alerts if the user re-saves the profile.

4. **Deploy**
   - Deploy `send-waitlist-email` (new template) and `update-waitlist-profile`.

## Out of scope
- No schema changes, no new tables, no changes to the admin queue UI or the verification RPC.
- Not touching the self-claim UX or copy.

## Verification
- Manually flip a test user via the dashboard role picker → confirm one email arrives at hello@empowereddld.com and the row shows up in the SLP Verification Queue. Re-save the same profile → confirm no duplicate email.
