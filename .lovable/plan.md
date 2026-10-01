# Optional newsletter consent for Resource Library and Story Pros

This separates access and waitlist participation from optional newsletter consent. Both boxes start unchecked. Not checking either box will never block account creation, Resource Library access, or joining Story Pros.

## Proposed wording

### Resource Library account signup

Place this optional checkbox near the end of the Resource Library onboarding step, above **Take me to the Resource Library**. This location works consistently for email, Google, and Apple signups after the account is confirmed.

**Checkbox, unchecked by default**

> Yes, I'd like practical DLD tips, new resources, and occasional updates from Empowered DLD by email.

**Short text below it**

> Optional. You can unsubscribe at any time. Your Resource Library access is not affected.

### Story Pros waitlist signup

Place this optional checkbox below the role field and above **Join Now**.

**Checkbox, unchecked by default**

> Yes, send me Empowered DLD's newsletter with practical DLD resources, news, and occasional Story Pros updates.

**Short text below it**

> Optional. You'll stay on the Story Pros waitlist whether or not you choose this. You can unsubscribe at any time.

## Consent record

Add a dedicated, append-only consent record in the database rather than relying only on an EmailOctopus tag. Record both yes and no choices so there is a clear audit trail.

Store:

- the Resource Library account ID or Story Pros waitlist entry ID
- normalized email address
- consent choice (`true` or `false`)
- server-recorded timestamp
- signup source (`resource-library` or `story-pros-waitlist`)
- wording version, initially `newsletter-consent-v1`
- the exact checkbox wording shown
- the exact explanatory text shown

Only trusted server-side code should write or read these records. A later checked submission may add consent. An unchecked submission must never be treated as an unsubscribe or erase earlier affirmative consent.

## EmailOctopus behaviour

Keep the current EmailOctopus list and all current tag names unchanged.

### Resource Library

- After email confirmation, continue adding the existing `resource-hub` tag.
- If newsletter consent is checked, also add the existing `newsletter` tag.
- If unchecked, send only the existing `resource-hub` tag.
- Send EmailAddress, FirstName, and LastName using the current name fallback rules.

### Story Pros

- After waitlist email verification, continue adding the existing `story-pros` tag.
- If newsletter consent is checked, also add the existing `newsletter` tag.
- If unchecked, send only the existing `story-pros` tag.
- Send EmailAddress, FirstName, and LastName using the current full-name split.

For an address already in EmailOctopus, use the current update behaviour to add only the applicable tag or tags without removing existing tags. Do not send a status during updates, so a previously unsubscribed contact remains unsubscribed. The newsletter tag records the website choice but must not override EmailOctopus's unsubscribe status.

## Implementation plan

1. Add the consent checkbox to Resource Library onboarding and Story Pros signup, with independent state defaulting to unchecked.
2. Add the consent record structure, permissions, and server-only access rules.
3. Save Resource Library consent from the authenticated onboarding step. Skipping onboarding records no newsletter consent and still opens the library.
4. Pass the Story Pros choice to the existing signup function and store it with the waitlist entry. Handle repeat signups safely: a new checked choice may add consent, while an unchecked choice never revokes earlier consent.
5. Update the confirmed-account and verified-waitlist sync paths to always send their existing source tag, and send `newsletter` only when affirmative consent is recorded.
6. Keep newsletter campaigns limited to contacts carrying the `newsletter` tag. Existing source tags remain available for the current account and waitlist communications.
7. Test email, Google, and Apple Resource Library signup paths; new and duplicate Story Pros entries; checked and unchecked choices; existing multi-tag contacts; and a previously unsubscribed EmailOctopus contact.

## Scope safeguards

- No list or tag renaming.
- No required marketing consent.
- No changes to the separate footer newsletter form.
- No backfill that assumes consent for existing Resource Library or Story Pros contacts.
- No code, database, or EmailOctopus changes until this plan is approved.