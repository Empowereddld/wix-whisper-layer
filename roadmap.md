# Roadmap

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
