# Security review: current scan findings (report only, no changes)

The scan returns 23 raw entries. Several are repeats of the same issue (the same function flagged in different scan runs), so the panel shows them as 15. They are grouped below the same way. Everything was checked against the current code and the live database permissions.

Summary: **3 issues are genuinely still open** (2 Critical, 1 Warning), **3 are small, low-risk gaps worth tidying**, and the rest are already fixed or are intended behavior.

---

## Critical findings (7)

### C1. "Anyone can access waitlist details using a referral code" (Critical, 3 repeat entries)
- **Where:** newsletter-prompt function (Story Pros branch)
- **What the scanner says:** the Story Pros newsletter prompt picks the member using only their referral code, which is public (it's in every share link). It then records a newsletter yes/no for that member and can add them to the mailing list.
- **Exploitable now?** **Yes.** Someone with another member's share link can record a "yes" (adding them to the newsletter) or a "no" (hiding the prompt from them). It does not show their email to the caller.
- **Covered by a batch?** No. Batch 3/3B moved the other member actions onto the signed dashboard pass, but this prompt was missed.
- **Smallest fix:** require the signed dashboard pass (the same one used for rewards and suggestions) instead of the referral code. Update the Story Pros prompt on the dashboard to send the pass. The Resource Library version already requires sign-in and stays the same.

### C2. "Anyone can subscribe arbitrary email addresses" (Critical)
- **Where:** emailoctopus-subscribe function
- **What the scanner says:** anyone can call it with any email address and tag, and it adds that address to your mailing list as subscribed.
- **Exploitable now?** **Yes.** The function checks nobody. It's called straight from the browser by the footer, contact, parents workshop, educational app, Resource Library onboarding and sign-in code, so it can't simply be locked down without changing those.
- **Covered by a batch?** No. Batch 4 removed public *unsubscribe* only; subscribe was left alone on purpose.
- **Smallest fix:** allow only trusted callers (your server functions and the signed-in Resource Library user, for their own email). Move the public form syncs (footer, contact, lead, workshop, app) to the server, so the sync only happens after the form row is saved, the same way Batch 1 handled confirmation emails. Add hashed rate limits. Tags, existing contacts and unsubscribed contacts are handled as they are now.

### C3. "Anyone can send emails from your app" (Critical)
- **Where:** send-waitlist-email
- **What the scanner says:** it accepts a forged sign-in token that claims the "service role."
- **Exploitable now?** No. The current check accepts only the cron secret, an exact match of the real server key, or a verified admin. Decoded claims are never trusted.
- **Covered by:** Batch 1.
- **Why it's still flagged:** this entry is from the October 5 scan and points at old line numbers. Safe to mark fixed.

### C4. "Anyone can award themselves unlimited waitlist points" via the suggestion function (Critical)
- **Where:** database function submit_waitlist_suggestion
- **Exploitable now?** No. Visitors and signed-in users can no longer run this function (checked live). Suggestions go through the member-action function, which requires the dashboard pass and awards a fixed 5 points.
- **Covered by:** Batch 3B and the Points batch.
- **Why it's still flagged:** the scanner reads an old migration file that never revoked access. Later migrations did. Safe to mark fixed.

### C5. "Anyone can grant arbitrary waitlist points" via award_waitlist_points (Critical)
- **Exploitable now?** No. This database function **no longer exists** (checked live).
- **Why it's still flagged:** it still appears in an old April migration file. Safe to mark fixed.

### C6. "Anyone can award points to another member" (Critical)
- **Where:** track-referral-click
- **What the scanner says:** anyone can submit a member's referral code and earn that member click points.
- **Exploitable now?** Only as designed: someone visiting a share link earns the owner 3 points, limited to once per network per day and 15 points per day. Visitors can't run the points function directly (checked live).
- **Covered by:** the Points batch.
- **Small gap:** this function reads the forwarded-address header *before* the edge-provided address, the opposite order to the shared helper. The anti-spoof test passed because the platform rewrites that header, but it should use the same helper. See T1.

*(C1 counts as 3 raw entries. C1 to C6 make up the panel's 7 Critical items.)*

---

## Warnings (8)

### W1. "Anyone can inject markup into admin alert emails" (Warning, 4 repeat entries)
- **Where:** send-waitlist-email, "New SLP self-claim" staff alert
- **Exploitable now?** **Yes, in a minor way.** The member's name, email and referral code go into this staff email without escaping. A crafted name could add fake links or formatting to an email that only staff receive. Nothing runs automatically.
- **Covered by a batch?** No. The export/alert batch cleaned the other staff alerts but missed this one.
- **Smallest fix:** run those four values through the shared escape helper. Punctuation, accents and non-English names display the same as now.

### W2. "Anyone can subscribe another member to marketing emails" (Warning)
- **Where:** storybuilders-signup, repeat signup with an existing email
- **Exploitable now?** **Yes.** If someone types another person's existing email with the newsletter box checked, the system records a "yes" and adds them to the newsletter. It's rate limited, but it is still consent without proof the person owns the inbox.
- **Smallest fix:** on a repeat signup, don't record consent right away. The neutral "check your email" message stays the same, and the newsletter question is asked again on the member's own dashboard (which needs the pass, after C1 is fixed).

### W3. "Anyone can trigger verification emails / reset another signup's verification link" (Warning, 4 repeat entries)
- **Where:** resend-verification-waitlist
- **Exploitable now?** Only as intended. Typing an email sends the link to that inbox only, and the reply is always the same. Limits: 1 per 2 minutes, 3 per person per day, 10 per hour per network. Earlier links stay valid, so nobody gets locked out.
- **Covered by:** Batch 1 and Batch 3B. Safe to mark reviewed as intended behavior.

### W4. "Public recovery reads private waitlist data unauthenticated" (Warning)
- **Where:** find-storypros-dashboard
- **Exploitable now?** No. It returns the same message every time, emails only the account owner, and is rate limited. Covered by Batches 1 and 3. Safe to mark reviewed as intended behavior.

### W5. "Anyone can claim a professional signup bonus" (Warning)
- **Exploitable now?** No. Claiming to be a speech professional now only flags the account. The +50 bonus is given only when an admin approves it (the approval function checks for the admin role). Covered by the Points batch. Safe to mark fixed.

### W6. "Anyone can award themselves referral points" via award_referral (Warning)
- **Exploitable now?** No. Nobody can run it from the site (checked live). Referral points are awarded once, after the new member verifies. Covered by the Points batch. Safe to mark fixed.

### W7. "Anyone can earn points with spoofed referral clicks" (Warning)
- Same function as C6. Not practically exploitable (the platform rewrites the address header), but tidy it up as described in T1.

### W8. "Checkout lets a purchaser mutate a catalog product" (Warning)
- **Where:** create-checkout
- **Exploitable now?** No meaningful harm. If a product doesn't have a Stripe price saved yet, checkout creates one from the price stored on your server and saves it. The buyer can't choose the amount or the product details. Payment verification (Batch 5A) still checks the amount against Stripe.
- Safe to mark reviewed. Optional tidy-up: T2.

### Ignored (2)
Already set aside by you earlier. Not re-checked unless you want me to.

---

## Proposed next batch (only after you approve)

Must-fix:
1. C1: newsletter prompt requires the dashboard pass.
2. C2: lock down the mailing-list subscribe function to trusted callers, and move public form syncs to the server.
3. W1: escape the SLP staff alert.

Small tidy-ups:
- T1: the click tracker uses the shared address helper.
- W2: repeat signups don't record consent.
- T2 (optional): create the missing Stripe prices ahead of time, so checkout never writes to the products list.

After that: mark C3 to C6, W5 and W6 fixed, and mark W3, W4 and W8 reviewed, each with a short note.

Testing for each item: the normal flow still works (footer, contact, lead, workshop and Resource Library signups still reach the mailing list with the right tags; the Story Pros prompt works from the dashboard); forged or missing pass is refused; arbitrary emails are refused when sent directly; the alert shows a crafted name as plain text.

Still deferred: Batch 5A real-money purchase test, refund handling, the 12 old recovery records.
