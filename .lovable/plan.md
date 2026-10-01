# EmailOctopus integration updates

Four changes, plus a consent-wording report. List and tag names stay exactly as they are. No one who unsubscribed in EmailOctopus is ever re-subscribed (the sync already never sends a status on updates, and that stays).

## 1. Footer newsletter: duplicate emails no longer error

Today, if an email already exists in our website database, the footer shows "Something went wrong" and EmailOctopus is never called.

Change `src/components/Footer.tsx` so a duplicate is treated as success: show the same "Welcome to the community!" message and still run the EmailOctopus sync, which adds the `newsletter` tag to the existing contact without touching their other tags. The welcome email is only sent for genuinely new signups, so repeat submitters don't get it twice.

## 2. Google sign-in names for Resource Library users

Google does provide a name in the sign-in profile (`full_name`, and often separate given/family names). In `src/contexts/AuthContext.tsx`, when syncing a confirmed account, fall back to Google's name only when our own first/last name fields are blank. A non-blank name the user typed is never overwritten. Splitting rule: first word becomes FirstName, the rest becomes LastName.

## 3. Move Resource Library syncing server-side

Today the sync runs in the visitor's browser, so anyone who confirms their account but never returns signed in is missed.

New scheduled job (a server function that runs every 15 minutes): find accounts whose email became confirmed since the last run, and sync each to EmailOctopus with the `resource-hub` tag. A small tracking table records who has been synced so nobody is sent twice, and a one-time backfill covers everyone already confirmed. The existing browser-side sync stays as a fast path; the server job is the safety net, and both are safe to run for the same person.

## 4. Consent wording report (no changes)

Exact wording users see today, and whether it discloses marketing emails:

- **Resource Library account** (`/hub/signup`): heading "Create Your Free Account", subheading "Sign up once. Access everything.", button "Create Account". No mention of newsletters or marketing emails, and no consent checkbox.
- **Newsletter footer form**: heading "Subscribe to Our Newsletter", fields "Email" and "Name", button "Subscribe". This clearly implies newsletter emails, but there is no explicit consent statement or checkbox.
- **Story Pros waitlist**: "Join the Story Pros Launch Team...", fields "Name", "Email", "I am a...", button "Join First to Get Your Link". Says nothing about receiving emails, and has no consent checkbox.

So: only the footer form clearly signals marketing emails, and none of the three has an explicit consent checkbox. Wording changes are out of scope here; I'll propose options separately if you want them.

## Technical details

- Footer: catch the unique-violation (23505) from the `waitlist` insert and treat it as success; still call `syncToEmailOctopus` with tag `newsletter`.
- AuthContext: read `full_name` / `given_name` / `family_name` from `user.user_metadata` (Google populates these) as a fallback only.
- Server sync: new edge function `sync-hub-emailoctopus` on a 15-minute schedule. It lists `auth.users` with the service key, filters `email_confirmed_at` newer than the last run, and posts to `emailoctopus-subscribe` (tag `resource-hub`). New table `emailoctopus_synced_users` (user_id, synced_at) with RLS enabled, service-role-only access, plus the required GRANTs. One-time backfill run for existing confirmed users.
- No changes to list ID, tag names, or the duplicate-handling logic in `emailoctopus-subscribe`.
