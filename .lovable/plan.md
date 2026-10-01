# One-time newsletter opt-in for existing members

Existing Resource Library users and Story Pros waitlist members who have never made a newsletter choice see one optional, unchecked prompt, once. No emails are sent to ask. Access never depends on it.

## Who sees it

A person sees the prompt only if all of these are true:
- they have no newsletter consent record at all (neither yes nor no)
- they do not already carry the `newsletter` tag in EmailOctopus
- they have not dismissed or answered it before

Once any choice is recorded (checked or unchecked), they never see it again.

## Resource Library flow

**Where:** a small pop-up window that opens over the Resource Library home page (`/hub`) right after an existing user signs in. New users never see it, because they already answer the same question during onboarding.

**Content (exact):**
- Heading: "Would you like to stay connected?"
- Checkbox, unchecked: "Yes, I'd like practical DLD tips, new resources, and occasional updates from Empowered DLD by email."
- Helper: "Optional. You can unsubscribe at any time. Your Resource Library access is not affected."
- One button: "Continue to the Resource Library"

**What happens:**
- Checked: affirmative consent saved (timestamp, source `resource-library-existing-prompt`, wording version `newsletter-consent-v1`, exact text). `newsletter` tag added in EmailOctopus alongside `resource-hub` and any other tags. Status untouched.
- Unchecked, or the window is closed with the X / Escape: a "shown, did not opt in" record is saved. No tag changes. Earlier yes records are never affected.

## Story Pros flow

Story Pros members don't have passwords. The site recognises them on the device where they joined or after the "Find my dashboard" link. That is the only identifiable session, so the prompt appears there.

**Where:** a card at the top of the Story Pros dashboard (`/storypros/dashboard`), above their points. It does not block the page; they can keep using the dashboard without answering. The card isn't shown on the public Story Pros page, since visitors there can't be identified reliably.

**Content (exact):**
- Heading: "Want to hear more from Empowered DLD?"
- Checkbox, unchecked: "Yes, I'd like practical DLD resources, Empowered DLD updates, and occasional Story Pros news by email."
- Helper: "Optional. You'll stay on the Story Pros waitlist whether or not you choose this. You can unsubscribe at any time."
- Buttons: "Save my choice" and "No thanks"

**What happens:**
- Checked + Save: affirmative consent saved (source `story-pros-existing-prompt`). `newsletter` tag added; `story-pros` and other tags kept. Status untouched.
- "No thanks", or Save with the box unchecked: a "did not opt in" record is saved. No tag changes.
- If they leave without choosing anything, nothing is saved and the card shows again next visit. It stays easy to ignore.

## Safeguards

- No emails sent to ask for consent.
- Boxes are never pre-checked; access never depends on them.
- Unsubscribed EmailOctopus contacts stay unsubscribed (updates never send status). If a person is unsubscribed in EmailOctopus, we treat them as "already decided" and don't show the prompt.
- No list or tag names change.
- A "no" record never revokes or overrides a "yes".
- Unverified Story Pros entries don't see the card until they're verified.

## Technical details

- New server function `newsletter-prompt` with two actions:
  - `status`: for a signed-in hub user (JWT) or a Story Pros referral code, returns `show: true/false`. It checks `newsletter_consents` for any row, then checks the EmailOctopus contact (MD5 lookup) for the `newsletter` tag or an unsubscribed status. It fails closed (no prompt) if EmailOctopus can't be reached.
  - `record`: inserts the consent row server-side with the fixed wording constants. If the box is checked, it calls `emailoctopus-subscribe` with tags `["resource-hub","newsletter"]` or `["story-pros","newsletter"]`. Story Pros calls are tied to the waitlist row looked up by referral code and must be verified and not deleted.
- New sources are added to the consent records; no table changes are needed.
- Hub: a new `NewsletterPromptDialog` on `HubDashboard`, gated on the profile having completed onboarding.
- Story Pros: a new `NewsletterPromptCard` in `StoryProsDashboard`.
- Tests: hub user with/without record, with an existing newsletter tag, unsubscribed contact; Story Pros checked / no thanks / ignored; repeat visits don't re-prompt.
