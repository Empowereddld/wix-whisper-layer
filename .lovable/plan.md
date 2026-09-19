# Auto-sync email signups to EmailOctopus

## Goal
Every new email signup on the site (Story Pros waitlist, Resource Hub accounts, newsletter and workshop forms) is automatically added to the user's EmailOctopus list, so the newsletter audience stays up to date with no manual exports.

## What you (the user) need to do
1. Create the EmailOctopus account (free plan covers 2,500 contacts).
2. Create one list in EmailOctopus (e.g. "Empowered DLD Newsletter").
3. Copy the API key (EmailOctopus -> Integrations & API) and the List ID (list Settings page).
4. Paste both into the secure form I'll open when we build.

## What I'll build

### 1. One backend "sync to EmailOctopus" function
A new edge function `emailoctopus-subscribe` that:
- Takes an email, optional first/last name, and a source tag (story-pros, resource-hub, newsletter, workshop).
- Calls the EmailOctopus API (`POST /lists/{listId}/contacts`) with the contact, tag, and status `subscribed`.
- Uses the stored API key and list ID (never visible in the browser).
- Is idempotent: re-adding an existing email just updates tags, never errors or duplicates.
- Fails silently for the user: if EmailOctopus is down, the signup still succeeds and the error is logged, never shown.

### 2. Hook it into each signup point, only after confirmation
- **Story Pros waitlist**: synced inside the email verification step (`verify-email-waitlist`), so only confirmed addresses are added, tagged `story-pros`.
- **Resource Hub signups**: synced when the account's email is confirmed (the `handle_new_user` path after auth confirmation), tagged `resource-hub`.
- **Newsletter / workshop forms** (footer signup, Parent Workshop waitlist): these have no verification step, so they're synced on submit, tagged `newsletter` / `workshop`. (Flag: if you'd rather add double opt-in here later, EmailOctopus supports a "pending" status with its own confirmation email.)

### 3. Tags by source
Each contact gets a tag showing where they came from, so you can email just Story Pros people, just Hub users, or everyone.

### 4. Verification
- Test each path end to end with a throwaway address and confirm it appears in EmailOctopus with the right tag.
- Confirm existing signups are unaffected (no change to verification emails, Story Pros automated emails, or anything else).

## Technical details
- EmailOctopus REST API v1.5/1.6, direct `fetch` from the edge function (no connector exists for EmailOctopus).
- Secrets via the secret store: `EMAILOCTOPUS_API_KEY`, `EMAILOCTOPUS_LIST_ID`.
- Files touched: new `supabase/functions/emailoctopus-subscribe/index.ts`, small additions to `verify-email-waitlist`, the newsletter/workshop signup code paths, and the hub confirmation flow; deploy affected functions.
- The ~2,000 old MailerLite emails are separate: one manual CSV import into EmailOctopus when you have the file, no code needed.

## Out of scope
- Importing the old MailerLite list (manual CSV step, yours).
- Removing signups from EmailOctopus when someone unsubscribes (EmailOctopus handles its own unsubscribe links in newsletters).
