

## Plan: Fix All Build Errors from Claude Coworker's Changes

Your Claude coworker made changes that reference database columns, tables, and function signatures that don't match what actually exists in your database types. There are also some TypeScript issues in edge functions. **You do NOT need to run any SQL migrations or set up Resend** -- I'll fix the code to work with what your database actually has.

Here's the breakdown of all errors and fixes:

---

### 1. Fix Edge Function TypeScript Errors

**Files:** `create-checkout/index.ts`, `verify-payment/index.ts`
- Change `err.message` to `(err instanceof Error ? err.message : "Internal server error")` (err is `unknown`)

**Files:** `track-referral-click/index.ts`, `verify-email-waitlist/index.ts`
- Replace `.then(() => {}).catch(...)` with a proper `try/catch` or just `await` the insert (`.catch` doesn't exist on the Supabase PromiseLike type)

---

### 2. Fix Waitlist Component Type Mismatches

**`src/components/waitlist/BadgeShowcase.tsx`**
- Remove `Butterfly` import from lucide-react (doesn't exist) — replace with an available icon like `Heart` or `Sparkles`

**`src/components/waitlist/MilestoneModal.tsx` (line 166)**
- Fix the type cast of `getTierColor()` result — cast through `unknown` or adjust the type

**`src/components/waitlist/ReferralTracker.tsx` (lines 71-72)**
- The code queries `waitlist_referrals` table which doesn't exist in the types. Replace with a query against `storybuilders_waitlist` using `referred_by_code` to find referrals

**`src/components/waitlist/index.ts` (line 28)**
- `VerificationBanner` uses a named export, not a default export. Change to `export { VerificationBanner } from "./VerificationBanner"`

---

### 3. Fix `useStorybuildersWaitlist.ts` Hook Errors

**Line 220:** `get_waitlist_user_stats` RPC expects `p_referral_code`, not `p_email` — change argument name

**Line 225:** Cast `data` through `unknown` before casting to `UserStats`

**Line 431:** `waitlist_suggestions` table expects `waitlist_id`, not `user_email` — need to look up the user's waitlist ID first and use that

**Line 468:** `waitlist_suggestion_votes` expects `waitlist_id`, not `user_id` — same fix, use the waitlist entry ID

**Lines 497, 513:** Cast RPC results through `unknown` before casting to `LeaderboardEntry[]` / `ActivityEntry[]`

---

### 4. Fix `AdminStoryBuilders.tsx` Type Mismatches

**Interface fixes:** The `WaitlistUser`, `FraudLog`, and `EmailLog` interfaces don't match actual DB columns:
- `WaitlistUser.flagged` → should be `fraud_flagged` (matches DB)
- `FraudLog.user_email` → should be `email`, `dismissed` → should be `resolved`
- `EmailLog.recipient_email` → doesn't exist (table has `waitlist_id`), `status` → doesn't exist

**Line 216:** `.update({ flagged: ... })` → should be `.update({ fraud_flagged: ... })`
**Line 242:** `.update({ dismissed: ... })` → should be `.update({ resolved: ... })`

---

### 5. Fix `StoryBuilders.tsx` Page Errors

**Line 128:** `SEOHead` missing required `path` prop — add `path="/storybuilders"`

**Lines 139, 346:** `SocialProofBanner` doesn't accept `totalJoined`/`dailyJoins` props — it fetches its own data internally. Remove the props.

**Line 312:** `CommunityMilestone` expects `totalCount`, not `totalParticipants`

**Line 343:** `ConfettiEffect` requires `trigger` prop — pass `trigger={showConfetti}`

**Line 350:** `NotificationBell` expects `userEmail` prop, not `notifications`/`onDismiss`

**Line 355-358:** `VerificationBanner` expects `emailVerified`, `email`, `onResendClick` props — not `onResend`/`isLoading`

---

### Summary

All fixes are code-side adjustments to align with the actual database schema and component APIs. No new migrations needed. No Resend setup needed (the edge functions already exist). Around 10 files need editing.

