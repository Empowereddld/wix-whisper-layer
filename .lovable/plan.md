# Critical security findings: review and fix plan

## Step 0: Fresh deep scan (you start this)
I can't start the Deep Security Scan myself. Only the "Run deep scan" button in the Security panel does that. Please tap it (it takes about 7 minutes). The report below comes from the latest saved deep scan, which is 10 days old. Once the new scan finishes, I'll compare against this list before fixing anything. A new scan may add findings or drop some.

The saved scan has **10 Critical findings**: 6 abusable endpoints, 3 access control, 1 account security. It has **no Critical findings** under "Exposed personal & sensitive data" or "Unsafe input & injection" (those groups only have Warnings and Info). All 10 are backend functions anyone can reach without signing in, so **they are all reachable on the live site**. Your sign-in walls don't protect them.

---

## Group A: Unauthenticated & abusable endpoints (6)

**A1 + A2. Waitlist email function sends "invite" emails to any address**
- Where: `send-waitlist-email` function, `invite` template path (skips the privileged-caller check)
- Plain language: anyone can make the function send a branded Story Pros email from hello@mail.empowereddld.com to any address.
- Attacker could: send spam under your name, damage your sending domain's reputation, and use up your Resend quota.
- Fix: require the visitor's own referral code and send only to the email saved for that code, never a typed-in address. Limit how often each code can send invites.
- Could affect: the Story Pros "invite a friend" button only. Signup, verification and tier emails are unaffected.
- Test: try a direct call with a made-up recipient (should be rejected), then do a real invite from the dashboard (should work).

**A3. Story Pros lookup by referral code returns personal details**
- Where: `lookup-storypros-by-ref` function, which reads `storybuilders_waitlist`
- Plain language: anyone who has or guesses a referral code (codes appear in shared links) gets back the email, name, child age and "hopes" answers.
- Attacker could: collect personal info from any shared referral link.
- Fix: return only what the page needs (first name, points and tier) and never the email, child age or hopes. Check what the dashboard actually uses first.
- Could affect: Story Pros dashboard recovery and the `?ref=` link loading. Existing users keep their access.
- Test: call the function with a code and confirm no email or child info comes back. Open the dashboard through a ref link and confirm it still loads.

**A4. Story Pros signup reveals existing members' referral code and points**
- Where: `storybuilders-signup` function, duplicate-email path
- Plain language: entering someone else's email returns their referral code. That code then unlocks A3, A6 and C1.
- Attacker could: take over someone's waitlist dashboard identity just by knowing their email.
- Fix: when the email already exists, show a neutral "check your email" message and email the dashboard link to that address. Never return the code on screen.
- Could affect: Story Pros signup for people who are already on the list. They'll get their link by email instead of being sent straight in. New signups are unchanged.
- Test: sign up again with an existing email (no code shown, recovery email arrives). Do a fresh signup (works as it does today).

**A5. Founder claim form exposes shipping address and phone**
- Where: `claim-founder-package` function (GET), table `founder_claims`
- Plain language: anyone with a person's waitlist ID can read their saved shipping address and phone number.
- Attacker could: read home addresses of Tier 6 founders.
- Fix: require a signed, time-limited claim link (or the verified waitlist session), and never return the full saved address. Show only "already submitted".
- Could affect: Tier 6 founder claim emails and links. Existing links may need to be re-sent.
- Test: plain-ID request gets refused, a valid signed link loads, and a submission saves.

**A6. General email function sends custom content to any recipient**
- Where: `send-email` function (for example the `contact_user_confirmation` template)
- Plain language: anyone can choose the recipient and the message text, then send it through your email account.
- Attacker could: send phishing emails that look like they come from Empowered DLD.
- Fix: confirmation templates go only to the address just saved in the contact form, and the message is built on the server, not from the request. Admin-only templates require an admin sign-in.
- Could affect: contact and lead form confirmation emails. Login and password reset emails come from a separate system and are not touched.
- Test: a direct call with a made-up recipient or text is rejected, and submitting the real contact form still sends the confirmation.

## Group B: Access control & authorization (3)

**B1. Anyone can edit another waitlist profile and points**
- Where: `update-waitlist-profile` function, which updates `storybuilders_waitlist` by referral code
- Attacker could: change someone's name, details or points, or boost their own points to unlock rewards.
- Fix: require proof of ownership (a verified dashboard token, not just the code), allow only profile fields, and never allow points changes.
- Could affect: Story Pros dashboard profile editing.
- Test: editing with only a code is refused, and editing from a real dashboard session works.

**B2. Anyone can block all emails to another person**
- Where: `email-unsubscribe` function, which writes to `suppressed_emails`
- Attacker could: stop every email (including Story Pros and confirmations) from reaching any address.
- Fix: accept only the signed unsubscribe token from the email link, not a typed-in address.
- Could affect: unsubscribe links in emails already sent, if they don't carry a token. I'll check first and keep old links working.
- Test: typed-in address is refused, and a real unsubscribe link still works.

**B3. Anyone can unsubscribe any address from the newsletter**
- Where: `emailoctopus-subscribe` function, "unsubscribe" action
- Attacker could: quietly remove your subscribers from EmailOctopus.
- Fix: remove the public unsubscribe action. EmailOctopus's own unsubscribe link handles this. Subscribe and tagging stay as they are.
- Could affect: nothing that people use. Footer, Resource Library and Story Pros syncing are unchanged.
- Test: the unsubscribe action gets refused, and a footer signup still adds the newsletter tag.

## Group C: Authentication & account security (1)

**C1. Fake "admin" tokens accepted by the waitlist email function**
- Where: `send-waitlist-email`, the check that decides whether a call comes from the system
- Plain language: the function trusts a token's claim of "I'm the system" without checking its signature, so anyone can forge one.
- Attacker could: send any privileged Story Pros email to anyone.
- Fix: verify the token properly, or compare against a server-only secret (`CRON_SECRET` already exists).
- Could affect: scheduled reminder and tier emails if the scheduler's header doesn't match. I'll update the caller in the same change.
- Test: a forged token is refused, then trigger a scheduled email run and confirm emails still send.

---

## Proposed fix order (one group at a time, re-scan after each)
1. **Batch 1, email abuse:** A1/A2 + C1 + A6. Same functions, highest abuse risk, lowest risk to users.
2. **Batch 2, mailing list:** B2 + B3.
3. **Batch 3, Story Pros identity:** A4 + A3 + B1. These depend on each other and need careful dashboard testing.
4. **Batch 4, founder claims:** A5.

None of these batches changes login, signup, password reset, Resource Library access or admin sign-in. Batch 3 changes how returning Story Pros members get back to their dashboard.

## Technical notes
- Before each batch, re-read the function code to confirm the scanner's line references, and check the related front-end callers.
- After each batch: redeploy the affected functions, run direct calls (good and bad), click through the real flow, then you re-run the deep scan and I mark findings as fixed.
