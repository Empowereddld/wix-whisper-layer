Update the Implementation Packages section on `/for-educators` with new tier content and a simplified add-ons area.

### Changes to `src/components/ImplementationPackagesSection.tsx`

1. **Replace the `packages` array** with three new tiers:
   - **Self-Guided Kit** — $1,500, new best-for text, 5 new included items
   - **Guided Training** — $2,800, new best-for text, 4 new included items
   - **Full Partnership** — $4,500, new best-for text, 4 new included items
2. **Keep card layout identical**: purple header (`bg-deep-purple`), price display, "Best for" line, "What's included" list, "CONTACT US" button linking to `/contact`.
3. **Replace the Add-Ons block** below the cards with centered text:
   - Line 1: "Additional book copies available at school pricing. Shipping covered by school."
   - Line 2: "Working with multiple sites or looking for something custom? Contact us to discuss enterprise pricing and tailored training solutions." with "Contact us" linked to `/contact`.
4. **No styling changes**: preserve all existing Tailwind classes, spacing, responsive grid, and typography tokens.

### Technical details
- Single-file edit. No new dependencies. No routing or logic changes.