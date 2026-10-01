# Roadmap

## EmailOctopus integration updates (in progress)
1. Footer newsletter: treat duplicate emails as success, still sync the `newsletter` tag. No list/tag renames.
2. Google sign-in: use Google's name for FirstName/LastName only when our own fields are blank. Never overwrite a non-blank name.
3. Move Resource Library sync server-side: sync confirmed accounts to EmailOctopus without depending on the browser, tag `resource-hub`. Includes one-time backfill of existing confirmed users.
4. Consent wording report delivered in plan; no wording changes (user deferred).

## Standing
- Never change list or tag names in EmailOctopus.
- Never resubscribe contacts who unsubscribed in EmailOctopus.
- Announcement bar wording is locked.
