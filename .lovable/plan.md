## Goal
Update Email 5 (Tier 4 Unlocked) so it:
1. Clearly separates what's available **today** (sneak peek of Story 1 + Suggestion Box) from the **future beta** seat (first-in-line when the full app opens).
2. Names the Tier 5 reward explicitly instead of teasing "something worth working toward."

## File
`supabase/functions/send-waitlist-email/index.ts` — `case "email5_tier4"` block (lines ~547-584).

## Copy changes

**Body (replace the current "you'll be one of the first families to try" + "test the app, use it with your child" + Suggestion Box paragraphs) with:**

- Opener: "You just crossed **130 points** and hit **Tier 4**, which locks in your seat as one of the first families to test the full Story Pros app the moment our beta opens."
- New "Here's what's live for you right now:" list:
  - **Sneak peek of Story 1** on your dashboard.
  - **Suggestion Box is open today** — submit story themes, characters, app features, Community Circle topics, and vote on others.
- Follow-up: "When the full beta opens, you'll be first in line to test the app with your child and help shape the final version."
- Keep the existing "Head to your dashboard to submit your first suggestion" link.

**Unlocked list:** change Tier 4 line to "Sneak peek + Suggestion Box + first-in-line beta seat".

**What's next section (replace the vague tease):**
- Heading: "What's next: Tier 5 (250 pts), Founder Pricing for life"
- Body: "Reach 250 points and you lock in **$7.99/month or $9.99/family for life**, even after public pricing goes up. From Tier 5 on, your referral points also start **doubling**, putting Tier 6 (Founder Package: signed book + merch for the first 50) within reach."
- Keep the "You're X points away" line, referral link, share scripts, and CTAs unchanged.

## After edit
- Deploy `send-waitlist-email`.
- Resend Email 5 preview to `hello@empowereddld.com` so you can confirm the new copy reads right end to end.
- Update the locked-template memory note for Email 5 to reflect the new wording.
