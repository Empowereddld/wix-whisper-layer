## Goal

Tighten the verification flow so unverified users have one clear job (check email + verify), and verified users have one clear destination (the dashboard). No premature dashboard access, no redundant dashboard buttons before verification.

## Changes

### 1. Simplify post-signup confirmation view (`src/pages/StoryBuilders.tsx`)

Replace the existing `DashboardCard` component (lines ~358-560, rendered at line 728) with a much smaller `PostSignupCard`:

- Heading: "Thank you for joining the Story Pros waitlist!"
- Body: "Check your inbox for a quick verification email. Once you verify, we'll send you everything you need to get started, including your personal referral link."
- Text link: "Didn't get it? Resend verification email" → calls `wl.resendVerification()`, shows toast on success + 2-minute rate-limit message on failure.
- Text link: "Not you? Sign up a different person" → clears `sb_waitlist_state` and `sp_pending_ref` from localStorage, calls `window.location.reload()` to reset the page back to the original signup form.

Remove from this view:
- "Your Details" section (name input + save button)
- "Open your dashboard" button
- SLP self-ID checkbox

The SLP option remains only in the initial signup `Select` ("I am a..." dropdown, lines 691-700) — already in place, no change needed there.

If the user is already verified when this card would render (e.g. they verified in another tab and came back), automatically swap to the "Welcome back" state from change #4 instead of showing the post-signup card.

### 2. Add dashboard CTA to verified celebration page (`src/pages/VerifySuccess.tsx`)

The page already has a "Go to Dashboard" button (lines 145-153). Confirm it is the **primary** CTA and visually prominent — already correct. No structural change needed; this is the first place a user sees a path to the dashboard, which matches the requirement. The "Back to Story Pros" secondary button stays.

(Implementation note: this change is largely a content/no-op verification — the button already exists and routes to `/storypros/dashboard?ref=...`.)

### 3. Gate the dashboard for unverified users (`src/pages/StoryProsDashboard.tsx`)

After hydration completes and `wl.joined` is true, branch on `wl.emailVerified`:

**If `emailVerified === false`**, render a limited view instead of the full dashboard:
- Top banner: "You're almost there! We sent a quick verification email to **{wl.email}**. Once you verify, your referral link and all your rewards unlock."
- "Resend verification email" link below the banner (reuses `handleResendVerification`, shows toast).
- Tier roadmap section (extract or reuse the existing tier journey rendering) so they can see what they're working toward.
- All other interactive elements hidden or disabled: referral link card, copy button, share buttons, social claim buttons, suggestion board, role edit, etc.

Realtime subscription + visibility-change refetch (already wired in the hook) will flip `emailVerified` to true and re-render the full dashboard automatically once they click the verify link.

**If `emailVerified === true`**, render the existing full dashboard unchanged.

### 4. Welcome-back state for verified users on `/storypros` (`src/pages/StoryBuilders.tsx`)

In the hero signup block (lines 671-730), add a third branch:

```text
if (!wl.joined)              -> signup form
else if (!wl.emailVerified)  -> PostSignupCard (change #1)
else                          -> WelcomeBackCard
```

`WelcomeBackCard` shows:
- "Welcome back, {firstName}!"
- "Open your dashboard →" button → `/storypros/dashboard`
- Small "Not you? Sign up a different person" link (same reset behavior as #1) so a shared device isn't trapped.

## Technical Details

**Files to edit:**
- `src/pages/StoryBuilders.tsx` — replace `DashboardCard` with `PostSignupCard` + add `WelcomeBackCard`; update the branching at line 671.
- `src/pages/StoryProsDashboard.tsx` — add unverified gating branch before the full dashboard render (around line 334).
- `src/pages/VerifySuccess.tsx` — confirmed existing dashboard CTA satisfies requirement; no edit unless copy needs tweaking.

**Reset helper** (used by both "Not you?" links):
```ts
const resetSignup = () => {
  try {
    localStorage.removeItem("sb_waitlist_state");
    localStorage.removeItem("sp_pending_ref");
  } catch {}
  window.location.reload();
};
```

**Unverified dashboard structure** (sketch):
```text
[Banner: verify email to {{email}}]
[Resend verification email link]
[Tier roadmap — read-only, shows current tier 1 and what unlocks at 2-6]
```

Hidden/disabled when unverified: `ReferralLinkCard`, share buttons, `SocialClaimButtons`, `RewardsInventory` claim actions, `SuggestionBoard`, role edit dialog.

**No backend or schema changes required.** All state derives from existing `wl.emailVerified`, `wl.email`, `wl.name`, and `wl.resendVerification()`.

## Out of scope

- Changing email content, timing, or the 2-hour Email 2 delay (already shipped).
- Changing `/storypros/verified` layout beyond confirming the dashboard CTA.
- Admin UI changes.
