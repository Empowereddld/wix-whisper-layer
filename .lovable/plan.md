## What Lydia is likely hitting

The Facebook comment says she can't create an account at `/hub/signup`. Reading the code, there's a clear bug in the signup flow that would make it look "broken" from the user's side, with no obvious error:

1. `src/pages/hub/HubSignup.tsx` calls `supabase.auth.signUp(...)` and then, on success, does `navigate("/signup/role")` **unconditionally**.
2. Lovable Cloud auth requires email confirmation, so `signUp` returns **no session** for a brand-new user. The user is not actually logged in yet.
3. `/signup/role` (`SignupRole.tsx`) checks `useAuth()`. Because there's no session, `user` is null, and its effect immediately does `navigate("/hub/signup")`.
4. Result: the user clicks "Create Account", the page flashes, and they land back on the signup form with no message. From their perspective, "it's not working."

A second, related issue: if the email is already registered, Supabase intentionally returns success with no error (to prevent account enumeration). Same outcome, same loop, no message.

There's already a `/hub/verify-email` page built for exactly this case, but `HubSignup` never routes to it.

Also worth noting: the current error handler shows a generic "Something went wrong" for every failure (weak password on the server, rate limit, invalid email, etc.), which hides real reasons.

## Fix (small, frontend only)

**File: `src/pages/hub/HubSignup.tsx`**

- After `supabase.auth.signUp(...)`:
  - If `error` is set, show the actual `error.message` in the toast (fall back to the generic copy only if there's no message). This surfaces things like "User already registered", "Password should be at least...", or rate-limit messages.
  - If there's no error and `data.session` is `null` (email confirmation required, the normal path), navigate to `/hub/verify-email` instead of `/signup/role`, and show a toast like "Check your email to confirm your account."
  - Only if `data.session` exists (auto-confirmed) navigate to `/signup/role`.
- Keep the referral-code handling and profile metadata exactly as they are today.

**No other files change.** `SignupRole`, `AuthContext`, `ProtectedRoute`, and `/hub/verify-email` are already correct; they just weren't being reached in the right order.

## Verification

- Type-check / build.
- Manually walk the signup flow in preview with a brand-new email: expect to land on `/hub/verify-email` with a "check your email" toast, not bounce back to the signup form.
- Try signing up with an email that already exists: expect a clear toast instead of a silent loop.
- Reply to Lydia on Facebook once deployed with a short "we just fixed this, please try again" note (optional, up to you).

## Out of scope

- No changes to auth config, email templates, `SignupRole`, `AuthContext`, or the verify-email page.
- No SEO/content work (still paused per your earlier instruction).
