# Give each page its own hero

Yes: the guidebook hero (purple "PARENT GUIDEBOOK" strip, desk photo, $9.99 button) belongs only on the Parent Guidebook page. The For Parents page gets its original hero back.

## Changes
1. **Parent Guidebook page** keeps exactly the hero it shows now (same text, desk photo, layout and working $9.99 buy button). Nothing else on that page changes.
2. **For Parents page** gets its original hero back, as it was before the guidebook work started:
   - "For Parents" label
   - "Does Your Child Struggle to Express Themself?"
   - "Join 5,000+ parents learning about language challenges, gaining practical strategies, and discovering they're not alone."
   - "Join Our Community" button to the Facebook group
   - The original mother-and-daughter reading photo, positioned as before
3. Nothing else changes on either page, and nothing is published.
4. Check both pages on desktop and phone and show you screenshots.

## Technical details
- Move the current guidebook hero markup into a new `GuidebookHero` component used only by `ParentGuidebook.tsx` (it keeps the `GuidebookBuyButton` slot, so checkout and analytics are untouched).
- Put `ForParentsHero.tsx` back to its version from just before the guidebook edits (taken from git history), with `mother-daughter-reading.webp` (still in the repo).
- Update the AGENTS.md hero rule and the guidebook memory note so the two heroes stay separate.
