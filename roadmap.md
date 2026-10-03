# Roadmap

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
- [ ] Add permanent, expandable `/music` page with the approved song copy and streaming smart link
- [ ] Add `/music` metadata, lazy route, and sitemap entry
- [ ] Add home-page-only delayed popup for October 3–31 with a 7-day dismissal cooldown
- [ ] Verify popup behavior, desktop/mobile music page, metadata, sitemap, and build
