

## Update "Explore Workshops" CTA to link to Partnership Packages

**Change**: In `src/components/WorkWithUsBrowseSection.tsx`, update the "Custom Workshops" card's `href` from `"#contact"` to `"/for-organizations#partnership-packages"`.

Also add an `id="partnership-packages"` anchor to the `PartnershipPackagesSection.tsx` `<section>` element so the link scrolls to it.

### Files changed
1. **`src/components/WorkWithUsBrowseSection.tsx`** — Change line 22 `href` from `"#contact"` to `"/for-organizations#partnership-packages"`
2. **`src/components/PartnershipPackagesSection.tsx`** — Add `id="partnership-packages"` to the root `<section>` tag

