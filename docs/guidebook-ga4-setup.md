# Parent Guidebook GA4 campaign preparation

Nothing is published or activated. No page-visit or checkout database tables were created.

## Measurement
- Landing page: manual `page_view` on `/shop/parent-guidebook` after analytics opt-in.
- Checkout: `begin_checkout` only when create-checkout returns a Stripe URL; USD 9.99, one guidebook. Redirect waits at most one second and never depends on Google being available.
- Purchase: `purchase` only after verify-payment confirms paid/complete, correct product and currency, and inserts or finds the authoritative purchase record. Actual Stripe amount in cents becomes USD event value. Applies to guest and signed-in guidebook buyers.
- Transaction ID: deterministic SHA-256 of the checkout session, prefixed `guidebook_`. The raw session is a download capability and never goes to Google. In-memory/local browser markers reduce repeats; GA4 web-stream transaction-ID deduplication covers other browsers. Analytics is not exactly-once delivery and is not the revenue ledger.
- Campaign labels: allowlisted `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, stored in sessionStorage only after consent to survive Stripe returns. Use short letters/numbers/underscore/hyphen labels, starting with a letter. Never put personal information in campaign labels. Referrer sends origin only; Stripe return referral is omitted. No emails, names, user IDs, health details, raw query strings, fragments, download URLs or click identifiers are deliberately sent.
- Explicit analytics opt-in in every region, independent of newsletter signup. No tag loading or cookieless pings before acceptance. Equal accept/reject controls, footer Cookie settings, withdrawal and other-tab updates. DNT/GPC also block. Browser-local notice/choice history preserves acceptance on withdrawal; no central consent table added.
- No Google Signals, advertising personalization, ad customer matching, server-side Google events, or automatic event replay.

## Before activation
1. Owner supplies the web-stream Measurement ID (`G-…`); link Google Analytics via Browser tracking (Measurement ID). No API secret needed for this browser integration.
2. In GA4 use website `https://www.empowereddld.com`, reporting currency USD, and an appropriate reporting timezone.
3. **Disable Enhanced measurement entirely** before activation, especially automatic history pageviews, outbound clicks, file downloads, form collection and user-provided data. These bypass the deliberate event allowlist and may collect checkout/download URLs. Manual events provide this campaign's funnel. Disable Google Signals, ads personalization and user-provided data collection.
4. Add `checkout.stripe.com` to unwanted referrals (plus any actual Stripe return domain used). Do not add Stripe as an owned cross-domain property.
5. Confirm `purchase` is a key event. Build a funnel for guidebook page views, `begin_checkout` and `purchase`; use source/medium/campaign and item ID to isolate this guidebook. Track $1,000 USD over 60 days against Stripe/backend revenue, not GA alone. At $9.99, 101 full-price sales gross $1,008.99 before fees/refunds/tax adjustments.
6. Test network transmission and GA4 DebugView/Realtime receipt with the supplied ID; do not infer receipt from queued events. Preview checks here use synthetic payloads and blocked Google scripts, not real customer outcomes. No real purchase/delivery has been verified.
7. Deploy the verify-payment update when authorized; the draft payload addition is not deployed now because this backend is shared with production. Then publish only on the owner's explicit request. Verify paid checkout, correct PDF and receipt via owner's real test purchase before campaign launch.

## UTM examples
`/shop/parent-guidebook?utm_source=facebook&utm_medium=paid_social&utm_campaign=guidebook60&utm_content=parent_story`

Use `instagram`/`paid_social` or `social`, and `newsletter`/`email` with the same campaign label. Existing GA browser cookies and session campaign labels continue on return from Stripe, subject to browser limits and consent. Browser tracking misses people who decline, block Google, leave before transmission, or never return to confirmation; Stripe/backend still record their actual purchases. Revisiting a receipt without an originating GA session does not establish campaign attribution.

## Current analytics audit
Native Lovable analytics Sep 25–Oct 25, 2026: 903 visits, 2,260 page views, 2.5 page views/visit. Sources include google.com (174), facebook.com (43), lm.facebook.com (22), m.facebook.com (20), and bing.com (32). These are visit/referrer statistics, not purchase evidence. No existing GA/GTM tag or analytics-cookie preference controls were found in application source. Native hosting analytics already operate outside this GA4 opt-in; native cookie/storage behavior must be assessed separately and is not controlled by this integration. Policy updated in draft to disclose current hosting statistics and planned opt-in Google measurement.

## Limitations still pending
- Measurement ID, GA4 web-stream settings and provider receipt are unverified.
- Real payment/download/receipt test is pending.
- Native hosting analytics full collection/retention and visitor opt-out behavior are not verified through account settings.
- Live homepage browser check found no visible GA/GTM scripts or `_ga`/`_gid`/`_gat` cookies in that visit; this does not establish the hosting analytics collection method or absence of other tracking.
- Browser records are not centralized consent audit records and disappear if visitors clear local storage; no legal-compliance certification is claimed.