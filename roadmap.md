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
