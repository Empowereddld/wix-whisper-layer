## Goal

1. Clean up the signup form on `/storypros` — name, email, Join. Nothing else.
2. Make the email verification page send people back to `/storypros` (their dashboard) instead of a Supabase-hosted "Email Verified" page.
3. Add a "Your details" card to the post-signup dashboard view on `/storypros` where the user can:
   - Confirm/correct their **name** (in case they typed an email or made a typo)
   - Tick **"I'm a speech-language professional"** to claim the +50 bonus after admin verification
   - See whether their email is verified, and resend if not

## Changes

### 1. Signup form cleanup (`src/pages/StoryBuilders.tsx`)

- Remove the SLP checkbox + label in **both** signup forms (hero around line 449 and the second form around line 931).
- Remove `isSpeechPro` state and stop passing it into `joinWaitlist(...)`.
- Form keeps Name + Email + Join button only.

### 2. Verification redirect (`supabase/functions/verify-email-waitlist/index.ts`)

- On successful verification, redirect (HTTP 302) to `https://empowereddld.com/storypros?verified=1` instead of returning the standalone HTML success page.
- Keep the existing error HTML page for failures (invalid token, expired, etc.) so users still get a clear message.
- "Already verified" case also redirects to `/storypros?verified=already`.

### 3. New dashboard "Your details" card on `/storypros`

When `wl.joined === true`, render a new card directly under the existing "Thank you" / referral area with:

- **Name field**: pre-filled with current name. If the stored name contains `@` (i.e. they accidentally typed their email), we show it highlighted with a small "Looks like an email — please enter your first name" hint and the Save button is the primary action. Saves via a new `update-waitlist-profile` edge function (service-role, looks user up by `id` from the waitlist record already in context).
- **Email verification status**: green "Email verified" badge if `email_verified`; otherwise the existing amber `VerificationBanner` style with a Resend button.
- **SLP self-ID checkbox**: "I'm a speech-language professional (SLP, SLT, Speech Therapist, etc.) — unlocks +50 bonus points after verification". Saving sets `is_speech_professional = true` on the waitlist row (the existing admin SLP verification queue then awards the +50 via `verify_speech_professional`). Once submitted, the checkbox locks and shows "Pending admin verification" or "Verified +50 pts" based on `speech_professional_verified`.

If `?verified=1` is present in the URL on mount, fire a confetti burst and show a success toast: "Email verified! +5 bonus points added." If `?verified=already`, just toast "Your email is already verified."

### 4. New edge function: `update-waitlist-profile`

Inputs: `{ id, name?, is_speech_professional? }` where `id` is the waitlist row id (already known to the client because `joinWaitlist` returns the new row). Service role updates allowed fields only. Validates `name` is non-empty and does not contain `@`. Never lets the client flip `speech_professional_verified` directly.

### 5. Hook updates (`src/hooks/useStorybuildersWaitlist.ts`)

- Drop the `isSpeechProfessional` argument from `joinWaitlist`.
- Add `updateProfile({ name?, isSpeechProfessional? })` that calls the new edge function and refreshes local user state.

## What we are NOT doing

- Not removing the existing admin SLP verification queue — admins still confirm professionals before +50 is awarded.
- Not changing the welcome email copy (already locked).
- Not touching auth.users / Supabase Auth — this is the waitlist record only.

## Why this works

- Signup conversion stays maximally simple (name, email, join).
- The dashboard becomes the natural place to fix bad data (Jinean-style "name is my email" mistakes) and to self-identify as an SLP, exactly as you described.
- Verification feels like a real product moment: click the link, land in your dashboard, see confetti and your bonus points.
