# Next steps after the successful test purchase

## 1. Publish
- Publish the current preview so the personal access link in the confirmation email works on www.empowereddld.com.
- After publishing: open the email link, confirm the access page shows the download button, refresh once, download the PDF.

## 2. Stage 6: "Lost your email?" recovery (you approved it earlier)
- Small form on the guidebook access page asking for the checkout email.
- Always shows the same neutral message ("If this email has a purchase, we've sent a new link"), so it never reveals who bought.
- Rate limited per email and per network.
- A new link retires the old one.
- Uses the same approved sender and the same per-purchase access page.
- Preview only; reported after testing, then publish on your approval.

## 3. Still waiting on you
- GA4 Measurement ID (needed for campaign tracking).
- Optional: a refund test on your $9.99 order to confirm access is removed.

## Technical details
- Recovery reuses `_shared/rateLimit.ts`, `_shared/guidebookAccess.ts` (version bump to retire old passes) and `_shared/guidebookEmail.ts` with a recovery idempotency key; no customer email or pass in logs.
