# Stage 4: Parent Guidebook confirmation email

## Status before this stage
- Stage 3 (Stripe notifications) is switched on: the signing secret is stored and fake notices are refused. Whether a real Stripe notice arrives will be confirmed by your real $9.99 test purchase after this stage.
- The site's emails go out through the existing sender (Resend, from hello@mail.empowereddld.com), which is working. The separate built-in Lovable email domain (notify.empowereddld.com) never finished verifying. This stage doesn't use it, so nothing needs fixing there.

## What you will get
1. **Your exact email**, word for word:
   - Subject: "Your Empowered DLD Parent Guidebook is ready 💜"
   - Body: "Thank you for purchasing Discussing DLD with Your Child! ..." and the rest of your approved text
   - Sign-off: "Warmly, Jinean and Camesha, Empowered DLD"
   - A purple **Access Your Parent Guidebook** button in the site's colours.
2. **A personal link for each customer.** The button opens a new page, "Your Parent Guidebook", which shows the large download button. The link is created for each purchase and only works for that purchase. The example link from your template is never sent.
3. **Sent to the email used at checkout**, only after the payment is confirmed. It's sent once, from whichever records the purchase first: the thank-you page or Stripe's notice.
4. **Thank-you page wording.** "We've also sent a confirmation email..." appears only after the email service has accepted the email.
5. **Safe retries.** If sending fails, it's tried again automatically every 10 minutes, up to 6 times. Each attempt uses the email service's duplicate-prevention key for that purchase, plus our own "already sent" check. This greatly reduces duplicates, but no email service can guarantee exactly one delivery. An email failure never blocks the download.
6. **Guest buyers only.** Signed-in Resource Library members keep their current receipt, which points to their library. It's a purchase email only: no newsletter signup, no attachment and no permanent file link.

## Protecting the personal link
- The access pass sits after a "#" in the link, so browsers don't send it to the server, analytics or other sites.
- The page removes it from the address bar as soon as it loads, and tells browsers not to pass the address on to other sites.
- If a link is ever shared, you can switch it off and send a fresh one (Stage 6).

## Tests after building
- The email matches your approved text exactly, and the button carries a per-purchase link, never the placeholder.
- Recording the same purchase twice sends one email.
- A failed send keeps the purchase and download working, schedules a retry, and stops once a send succeeds.
- The access page works with a valid pass and refuses tampered, refunded or switched-off passes. The pass never shows in the address bar or in the logs.
- I'll check the page on desktop (1280px) and phone (390px). The Resource Library checkout stays as it is.

Nothing gets published. The personal links in the email point to www.empowereddld.com, so they only work once you approve publishing. Your real test purchase should therefore happen after publishing.

## Technical details
- New shared email module (`_shared/guidebookEmail.ts`) renders the approved template, escaping all values, and sends through the existing Resend gateway with an `Idempotency-Key` of `guidebook-confirm-<purchaseId>`.
- An atomic claim on `purchases.confirmation_email_status` / `claimed_at` (pending, sending, accepted, failed) stops two paths sending at once. Stale claims older than 10 minutes can be retried.
- `fulfillCheckout` calls it for guest purchases in place of the interim receipt.
- New `guidebook-email-retry` function, protected by CRON_SECRET and run by a pg_cron job every 10 minutes. It retries only failed or stale rows, at most 6 attempts each, and records `last_error` without any token.
- New route `/shop/guidebook-access`: reads the pass from the URL fragment, clears it with `history.replaceState`, sets `<meta name="referrer" content="no-referrer">`, marks the page noindex, and exchanges the pass through the existing `guidebook-download` function.
- `verify-payment` already returns `confirmation_email_accepted`, so the thank-you page needs no change.
- Unit tests in `_shared/guidebookAccess.test.ts` cover the template text, link building and claim and retry decisions.
