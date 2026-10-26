# Roadmap

## Parent Guidebook pre-campaign purchase audit (2026-10-26)
- [x] Audit guest checkout, paid verification, secure PDF delivery, receipt email, recording, analytics and later retrieval; report gaps and proposed fixes without changing checkout or publishing.
- [x] Inspect the current stored PDF and correct the Resource Library's 26-page description only if 27 pages is confirmed.
- [x] Stage 1: per-purchase guest access pass, secure 5-minute download, guest path fix (rollback point 1)
- [x] Stage 2: confirmation page processing state and exact thank-you wording
- [x] Stage 3: Stripe notifications built, signing secret stored (real delivery confirmed by purchase test)
- [x] Stage 4: exact confirmation email with per-customer link, safe retries
  - [x] After 6 failed attempts: purchase kept, admin can find and resend securely, no links/PII in logs
  - [x] Access link works after address-bar removal, including page refresh
  - [ ] Stage 5: full test pass (automated checks done; live download + receipt verified by owner purchase 2026-10-26, access-pass retrieval via emailed link still to test after publish)
  - [ ] Stage 6: neutral, rate-limited lost-email recovery
  - [x] Real $9.99 purchase test by owner (2026-10-26: live Stripe session, immediate download worked, exact confirmation email arrived, one purchase record, email accepted on first attempt)

## Parent Guidebook single hero (2026-10-26)
- [x] Remove the original hero at source, connect the new hero to the existing checkout button, and preserve other sections and /for-parents.
- [x] Check desktop/mobile previews, guest checkout initiation and single analytics call; do not publish.

## Parent Guidebook hero photo swap (2026-10-26)
- [x] Replace the shared hero photo with the user's sunlit desk flat-lay (guidebook on a tablet), keeping the same hero layout, and update its description.
- [x] Verify the photo renders on desktop and phone with no overflow or errors; do not publish.

## Parent Guidebook parent introduction (2026-10-26)
- [x] Add the exact existing For Parents hero above all guidebook information without changing the existing content.
- [x] Verify the shared hero and unchanged guidebook content in preview; do not publish.

## Parent Guidebook announcement banner (2026-10-26)
- [x] Apply the approved burgundy campaign banner with the exact wording, full-banner link to /shop/parent-guidebook, and preserved Story Pros config for restore.
- [x] Bold only "Not sure how to talk to your child about DLD" at the user's request; verify desktop/mobile weight, colour and fit in preview.
- [x] Unhide the landing page: noindex removed, /shop/parent-guidebook added to the sitemap, "Parent Guidebook" added to the Shop menu (desktop + mobile).
  - [x] User to complete one real $9.99 test purchase, then confirm the download link and receipt email arrive (done 2026-10-26, live Stripe).
  - [ ] Publish once the user approves (preview only so far; the emailed access link points at the live domain, so it only works after publishing).

## Explain DLD article approved replacement (2026-10-25)
- [x] Replace article copy exactly, retain approved callout/cards/product layouts and links, and align four FAQs with structured data.
- [x] Verify desktop/mobile content, images, links and accordions in preview only; do not publish.

## Parent Guidebook GA4 preparation (2026-10-25)
- [x] Prepare analytics-only opt-in, safe visits/UTMs, checkout starts and verified deduplicated USD purchase reporting without extra database tables.
- [x] Test prepared tracking and privacy controls with 11 passing tests and synthetic browser flows; native analytics audit reported, nothing published or deployed.
  - [ ] Connect GA4, configure its web stream and verify receipt (waiting on Measurement ID).
  - [x] Verify real paid download and receipt delivery (owner test purchase 2026-10-26 succeeded).

## Parent Guidebook focused conversion refinement (2026-10-25)
- [x] Apply the approved shorter hero and introduction, improve readability, and emphasize PDF format and closing purchase.
- [x] Keep Story Pros hidden and library navigation secondary only on this page; verify layout, enlargement, FAQ and checkout.
- [x] Use the owner's clarified FAQ: recommended alongside the story, some activities usable independently.

## Contextual books links (2026-10-12)
- [x] Add the eight approved contextual links, preserving designs and existing purchase links.
- [x] Verify all eight destinations and report anchors; do not create topic pages.

## Books final copy cleanup and SEO audit (2026-10-08)
- [x] Apply only the five approved wording corrections, keeping the existing design and other descriptions.
- [x] Verify rendered corrections and report technical SEO, schema, images, and internal anchors; report-only SEO issues left unchanged.

## EmailOctopus integration updates — DONE (2026-10-01)
1. Footer newsletter: duplicate emails now treated as success, `newsletter` tag still synced (src/components/Footer.tsx).
2. Google sign-in name fallback in src/contexts/AuthContext.tsx (only when our fields are blank).
3. Server-side Resource Library sync: sync-hub-emailoctopus edge function, hourly cron, emailoctopus_synced_users table. Backfill completed: 150/150 confirmed accounts synced.
4. Consent wording report delivered; no wording changes (user deferred).

## Standing
- Never change list or tag names in EmailOctopus.
- Never resubscribe contacts who unsubscribed in EmailOctopus.
- Announcement bar wording is locked.

## Newsletter consent flow (approved 2026-10-01)
- [x] Add newsletter_consents table (append-only audit, service-only)
- [x] Story Pros checkbox (new approved wording) + signup fn consent handling
- [x] Resource Library checkbox on /signup/role + consent save
- [x] EmailOctopus: multi-tag support; newsletter tag only on affirmative consent
- [x] verify-email-waitlist + sync-hub-emailoctopus read consent before tagging
- [ ] Test all paths; no list/tag renames; never resubscribe unsubscribed

## Existing-member newsletter prompt (approved 2026-10-01)
- [x] Hub dialog (X/Escape saves nothing; Continue unchecked = decline)
- [x] Story Pros dashboard card (ignored = re-show at most every 14 days)
- [x] newsletter-prompt server function

## Empowered DLD music (approved 2026-10-03)
- [x] Add permanent, expandable `/music` page with the approved song copy and streaming smart link
- [x] Add `/music` metadata, lazy route, and sitemap entry
- [x] Add home-page-only delayed popup for October 3–31 with a 7-day dismissal cooldown
- [x] Verify popup behavior, desktop/mobile music page, metadata, sitemap, and build

- [paused] Set up Google Analytics to track "Listen to What Is DLD?" clicks — waiting on user (husband to help). Existing streaming_link_clicks counter already tracks listens in the meantime.

## Critical security fixes (approved 2026-10-05, one batch at a time)
- [x] Batch 1: A1/A2 + C1 + A6 + rate limits on public email functions (hashed IDs, 2-day retention)
- [x] Fix internal callers (tier, nudge, scarcity, inactivity) — fixed and tested 2026-10-06
- [ ] Decide on held backlog (13 tier + 9 nudge, automated_email_hold_at) — waiting on user
- [ ] Batch 2: A5 founder claims (signed link only, minimal status, confirm before replacing a submission)
- [ ] Batch 3: A4 + A3 + B1 (dashboard token with fixed expiry and absolute max lifetime)
- [ ] Batch 4: B2 + B3 (report first: existing unsubscribe links use ?email= with no signed token)
- [ ] Review function + outbound email logs for past abuse; then delete old waitlist_recovery_attempts rows
- [ ] Retry deep scan

## Security batch 6 (approved 2026-10-07)
- [x] C1 newsletter prompt requires dashboard pass
- [x] C2 mailing-list subscribe locked to trusted callers / fixed per-form tags
- [x] W1 SLP staff alert escaped
- [x] T1 click tracking uses shared address helper
- [x] W2 repeat signup records no consent
- [ ] T2 pre-create Stripe prices (deferred by user)
- [ ] Build 'How to Explain DLD to Your Child' page (preview only, awaiting review before publish)
- [x] Parent Guidebook stage 2: guest checkout (create-checkout/verify-payment guest paths, purchases.user_id nullable + customer_email, /shop/payment-success, newsletter opt-in checkbox with consent record)
- [ ] Real-money purchase test of guest guidebook checkout (batch 5A, deferred)
- [x] Make /shop/parent-guidebook indexable and add it to the sitemap and Shop menu (done 2026-10-26)
