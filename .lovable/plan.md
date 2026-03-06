

## Plan: Update TherapistsRightPlaceSection to match Wix screenshot

The Wix For Therapists page uses the same "You're in the right place if..." section as the Parents page, targeting parents who land on the therapists page. The current code has therapist-focused copy that doesn't match.

### Changes to `src/components/TherapistsRightPlaceSection.tsx`

Update the copy to match the Wix screenshot exactly:

- **Title**: Change from "You're in the right place if you're a therapist who..." to "You're in the right place if..."
- **Add subtitle**: "You're a parent who:"
- **Bullet points** (6 items, matching Wix):
  1. Just received a DLD diagnosis and doesn't know where to start
  2. Suspects your child has language struggles but hasn't gotten answers yet
  3. Feels alone because no one else seems to understand what you're going through
  4. Wants practical tools you can use at home, not just medical jargon
  5. Is looking for a community of parents who truly get it
  6. Speaks a language other than English and needs resources that work for your family
- **Add closing paragraph**: "Whether you're just beginning to understand DLD or you've been navigating it for years, you'll find support here."
- **CTA** stays the same: "JOIN OUR FACEBOOK COMMUNITY"

One file, copy-only changes.

