# EmailOctopus integration audit (report only, no changes)

Approving this plan changes nothing. It is a read-only report. Any fixes listed at the end need your separate go-ahead.

## Shared behaviour (all three sources)

Every signup goes through one sender that talks to EmailOctopus.

- **List:** one list for everyone, the list ID you saved in settings. The code never chooses a list, so all three sources land on the same list. I can't read the list's name from here. Check it in EmailOctopus under Lists.
- **Status on a new contact:** SUBSCRIBED. Nothing is ever created as PENDING.
- **Fields sent:** EmailAddress (trimmed and lowercased), FirstName and LastName. A name field is left out if it's blank, so an existing name is never wiped.
- **If the email already exists (your Jane example):** EmailOctopus rejects the create with MEMBER_EXISTS_WITH_EMAIL_ADDRESS, or with a 409 or an "already" message. The sender catches that and updates the existing contact instead. It adds the new tag as `{tag: true}`, which **adds it without removing any tags Jane already has**. So Jane stays one subscriber with both tags. This path was tested when the integration was built.
- **Existing contact's status:** the update never sends a status. Someone who unsubscribed stays unsubscribed and is not re-subscribed.
- **Names on update:** a new non-blank FirstName or LastName replaces the stored one.
- **Failures:** any error is logged and ignored. It never blocks the signup, but you also won't get an alert when a sync fails.

## 1. Resource Library account

- **When:** when a signed-in session appears with a **confirmed** email, meaning after they click the confirmation link or sign in with Google. It runs once per person per browser.
- **Tag:** `resource-hub`
- **Names:** first_name and last_name from the account. Email signup only asks for a first name, so LastName is usually blank. Google signups don't store first_name the same way, so **Google users may sync with no name at all**.
- **Caveat:** this runs in the visitor's browser. If someone confirms their account but never comes back to the site signed in, they are never synced.

## 2. Newsletter form (footer)

There's no separate newsletter popup in the code. The footer form is the only one.

- **When:** right after the form is saved on our side. There's no double opt-in.
- **Tag:** `newsletter`
- **Names:** the first word of "Name" becomes FirstName and the rest becomes LastName.
- **Caveat:** if that email already submitted any of our website forms (the footer, the workshop form or the app waitlist all share one table), our own save fails first. The person sees "Something went wrong" and **EmailOctopus is never called**. So in this case the `newsletter` tag is silently not added. This is the one place your Jane scenario can fail.

## 3. Story Pros waitlist

- **When:** only after they click the verification link. This runs on the server, not in the browser.
- **Tag:** `story-pros`
- **Names:** split from the full name they typed (first word becomes FirstName, the rest becomes LastName).
- **Duplicates:** handled the shared way above, so the tag is added to the existing contact.

## Other sources, for completeness

- Workshop form: tag `workshop`
- App waitlist: tag `educational-app` (it already handles "already on our list" correctly and skips the sync)
- Contact form: tag `contact`
- Old imported list: tag `legacy-list`

## Gaps worth knowing (not fixing unless you ask)

1. **Tag names differ from your examples.** The live tags are `resource-hub` and `story-pros`, not `resource-library` and `story-pros-waitlist`. Renaming them would split your existing segments.
2. **Footer duplicates:** the newsletter tag is skipped and the visitor sees a misleading error.
3. **Google sign-ups** may arrive in EmailOctopus without a first name.
4. **Resource Library sync depends on the browser.** It's missed if the person never returns signed in.
5. **Silent failures:** there's no alert when a sync fails.
