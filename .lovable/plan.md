# Parent Guidebook: guest fulfillment and confirmation email

Yes, understood: both your five technical requirements and the exact email are folded into the already-approved fixes. This extends the existing checkout, payment check, secure download and email sending already used by the site. No new checkout, no price or product changes, no Resource Library changes, nothing published.

## Stage 1: Secure guest access (rollback point 1)
- Each verified guidebook purchase gets a private, customer-specific access pass (signed, long-lived, can be revoked), created only by the server after Stripe confirms payment.
- Visiting the success page or holding a checkout session ID alone never unlocks the PDF.
- The download button asks the server for a short-lived (5-minute) link to the protected 27-page PDF. No public file address is ever shown.
- Fix the guest file-path issue found in the audit so guest downloads resolve to the correct PDF.
- Refunded purchases stop working; expired download links simply ask for a fresh one.

## Stage 2: Confirmation page (rollback point 2)
- After returning from Stripe, the page checks payment on the server.
- While still processing: a clear "Confirming your payment..." message that rechecks automatically, never a broken button.
- Once verified, it shows exactly:
  "Thank you for your purchase! 💜 / Your Parent Guidebook is ready. / You can download it below. We've also sent a confirmation email with instructions for accessing it again."
- The sentence about the email appears only after the email service accepted the message; otherwise it says the email is on its way. No claim of inbox delivery.
- Large "Download Your Parent Guidebook" button. No login or account needed.

## Stage 3: Fulfillment even if the customer never returns (rollback point 3)
- Stripe tells the site directly when a payment succeeds, so the purchase is recorded and the email is sent even if the Stripe tab is closed.
- The confirmation page and Stripe's notification share one recording step, so a purchase is recorded once and the email is sent once, however many times either fires.
- Refunds and disputes: a full refund or an opened chargeback retires access; a partial refund keeps access (proposed default, tell me if you prefer otherwise); a dispute won by you restores access. Every change is recorded.
- Delayed payment methods (bank debits and similar): access and the email happen only when Stripe confirms the money arrived; a failed delayed payment never grants access. The confirmation page shows "processing" meanwhile.
- This needs one signing value from your Stripe account; I'll set up the receiving address first, then ask you for it with step-by-step instructions.

## Stage 4: Confirmation email (rollback point 4)
- Replaces any generic guidebook receipt with your exact email:
  - Subject: "Your Empowered DLD Parent Guidebook is ready 💜"
  - Body word for word as provided, signed "Warmly, Jinean and Camesha, Empowered DLD".
  - "Access Your Parent Guidebook" button links to that customer's own access page, generated per purchase (never the placeholder).
- Sent to the email entered at Stripe checkout. Transactional only: no newsletter signup.
- The email service's actual result is recorded. Failed sends retry automatically on a schedule, with a once-only guard so no customer gets two confirmations. An email failure never blocks the download.
- No PDF attachment and no permanent file link.

## Stage 5: Testing
Automated tests (kept in the project), one per rule:
- Unpaid, unknown or refunded sessions get no access.
- Success URL or session ID alone gets no download.
- Same purchase processed twice: one record, one email.
- Email failure: purchase kept, download still works, retry scheduled, no duplicate after success.
- Access pass tampered or expired: refused.
- Resource Library purchases still behave as before.

Preview checks at desktop and phone: processing state, thank-you wording, button, no login prompt.

Still needs your real $9.99 test purchase: the actual email arriving, opening the PDF from the email later, the 27-page file on your device, and the closed-tab case.

## Stage 6: Recover access without the email (after the critical stages)
- A "Lost your email?" form: the customer enters their email and, if it has a guidebook purchase, gets a fresh access link sent there.
- The page always shows the same neutral message, so it never reveals whether an address bought anything.
- Rate limited with the site's existing privacy-safe limiter (per email and per network).
- Issuing a new link retires the old one.

## Added safeguards
- **Email retries:** the email service's own duplicate-prevention key per purchase, plus our once-only guard. This greatly reduces duplicates, but no email service guarantees exactly-once delivery, so I won't claim it.
- **Stripe signing value:** stored only through the secure secrets form, with step-by-step Stripe Dashboard instructions. You never paste it into chat.
- **Protecting the access link:** the pass is removed from the address bar as soon as the page loads, browsers are told not to pass the address to other sites, analytics never receives it, and server logs record only a short fingerprint. Shared links can be retired and reissued.
- **Product name:** the email keeps "Discussing DLD with Your Child" exactly.
- **One stage at a time:** results reported after each stage before moving on. No publishing, no unrelated changes.

## Technical details
- Extend `verify-payment` into a shared idempotent `fulfillGuidebookPurchase` (in `_shared/`) used by both it and a new `stripe-webhook` function (`checkout.session.completed`, `charge.refunded`, signature-verified with `STRIPE_WEBHOOK_SECRET` via add_secret after deploy).
- New `_shared/guidebookAccess.ts`: HMAC-signed access token (purchase id + version), revocable via `purchases` row; `generate-download-url` accepts it for the purchased resource only and issues 5-minute signed URLs.
- `purchases`: add `access_token_version`, `refunded_at`, `confirmation_email_status`, `confirmation_email_sent_at`, `confirmation_email_attempts`; unique index on stripe session already present.
- Email sent through the existing `send-email` provider path, content escaped via `_shared/html.ts`; retries via pg_cron job calling a retry function with CRON_SECRET; claim-row update guards against duplicate sends.
- New route `/shop/guidebook-access?t=...` for later retrieval; `/shop/payment-success` gains polling (every 3s, up to ~2 min).
- AGENTS.md rule updated; roadmap item checked per stage.
