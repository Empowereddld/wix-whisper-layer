# Critical security fixes: batched plan (based on saved deep scan)

The fresh deep scan keeps failing, so this uses the saved Critical findings. I re-checked the current code today. **All 10 are still present.** One extra problem turned up (see A5).

## Re-check results (current code)
- **A1/A2** `send-waitlist-email`: the "invite" template is still public and sends to any typed-in address. No rate limit.
- **C1** same function: still trusts any token that *says* "service_role" without checking its signature.
- **A6** `send-email`: public template mode still lets the caller choose the recipient. Callers: contact form, organizations lead form, footer, signup role page, admin emails page. No rate limit.
- **A5** `claim-founder-package`: still accepts a plain waitlist ID and returns the full saved address and phone. **New problem:** the earlier fix added signed links to the Founder email, but the claim function still only accepts plain IDs, so a real signed link would be rejected. No Founders exist yet, so no one is affected today.
- **A4** `storybuilders-signup`: re-entering an existing email still returns that person's referral code and points.
- **A3** `lookup-storypros-by-ref`: lookup by referral code still returns email, child age, hopes and other details.
- **B1** `update-waitlist-profile`: edits by referral code alone, with no proof of ownership.
- **B2** `email-unsubscribe`: still accepts any typed-in email.
- **B3** `emailoctopus-subscribe`: public "unsubscribe" action still exists.

## How every batch runs
Before: note a rollback point (the version before the batch, restorable from History), and re-read the affected functions and the pages that call them.
After: redeploy only those functions, test allowed and refused calls, run the real user flow, confirm login, signup, password reset, Resource Library and admin still work, then report to you. **I stop and wait for your OK before the next batch.**

## Batch 1: email abuse (A1/A2 + C1 + A6)
- C1: remove the "decode without checking" shortcut. Trusted callers must use the scheduler secret, the exact server key, or a real admin sign-in. Check every scheduler and internal caller sends one of these.
- A1/A2: the invite needs the sender's referral code and goes only to a friend address that passes checks. Limits: a few per sender per day, per friend address, and per visitor network, plus a site-wide hourly cap. The page cannot set the subject or body.
- A6: public templates go only to the address saved in that same form submission (contact, lead, footer, signup), with the content built on the server. Custom and bulk sends need admin sign-in.
- Rate limiting on **every** public email-sending function: `send-waitlist-email`, `send-email`, `resend-verification-waitlist`, `find-storypros-dashboard` and the Founder confirmation. Limits per visitor network and per recipient, kept in a small server-only log table.
- Tests: forged token refused, made-up recipient refused, the limit triggers after repeat calls; a real invite, contact form, lead form, footer signup and admin test send all still work, and a scheduled tier email still sends.

## Batch 2: Founder claims (A5)
- Accept only the signed link from the Founder email (this also fixes the mismatch above). Refuse plain IDs.
- After a claim exists, return only minimal status: submitted yes/no, date, slot number and first name. **Never return the saved address, phone or notes.** Editing becomes "submit your details again", which replaces the old record.
- Tests: plain ID refused, tampered link refused, valid link loads and saves, the response has no address or phone.

## Batch 3: Story Pros identity (A4 + A3 + B1)
- New rule: **a referral code is never proof of ownership.** Dashboard access uses a server-signed, expiring dashboard token, issued only after email verification or the "Find my dashboard" email link. Kept in the browser and renewed on use.
- A4: an existing email at signup gets a neutral "check your email" message plus a dashboard link sent by email. The code is never shown.
- A3: lookup by referral code returns only public share info (first name). Full dashboard data needs the dashboard token.
- B1: profile edits need the dashboard token, only profile fields can change, and points are never set by the caller.
- Existing members: anyone without a token is asked to use "Find my dashboard" once. Tests cover a new signup, a repeat signup, verify, recovery, profile edit, a code-only call (refused) and an expired token (refused).

## Batch 4: mailing list (B2 + B3)
- B2: unsubscribe works only with the signed token in email links. I'll check that existing email links carry tokens so old links keep working.
- B3: remove the public unsubscribe action. Subscribe and tagging stay as they are.
- Tests: typed-in address refused, real unsubscribe link works, footer signup still adds the newsletter tag.

## After all batches
- Review recent function logs and outbound email logs for past abuse: unusual invite volume, unknown recipients, forbidden-call warnings, suppression spikes. Report findings. Rotate credentials only if the evidence calls for it.
- Retry the deep scan, then mark the confirmed findings as fixed.

## Technical notes
- Rate limit store: new table, service-role only (grants plus RLS with no client policies), keyed by function, IP hash and recipient, with a time window.
- Dashboard token: HMAC over waitlist id + expiry using a new server secret, checked in lookup, update-profile and invite.
- Founder token: reuse the existing `verifyClaimToken`.
