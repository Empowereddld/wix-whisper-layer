

## Pixel-Precision Refinement Plan — For Parents Page

Comparing the Wix reference against the current Lovable build, here are the specific adjustments needed across all five sections. No new elements, no structural changes — only spacing, sizing, and alignment refinements.

### 1. Global: Container Max-Width + Section Spacing

The Tailwind container is currently capped at `1200px`. The Wix reference appears narrower (~1100px). Section vertical padding needs to increase from `py-14 md:py-20` (~80px) to `md:py-[120px]` for generous breathing room.

**Changes:**
- `tailwind.config.ts`: Change `2xl` screen from `1200px` to `1100px`
- All five For Parents sections: Update vertical padding to `py-16 md:py-[120px]`

### 2. Hero Section (`ForParentsHero.tsx`)

- Increase headline from `md:text-[46px]` to `md:text-[48px]`
- Increase card internal padding: `md:py-24 md:px-16`
- Increase button height and padding: `h-14 px-10`
- Cap paragraph width at `max-w-[500px]` (already close, minor tweak)
- Section padding: `py-16 md:py-[120px]`

### 3. Does This Sound Familiar (`DoesSoundFamiliarSection.tsx`)

- Section padding: `py-16 md:py-[120px]`
- Add `max-w-[650px]` to the right text column to limit paragraph width
- Increase gap between list items: `space-y-2`
- Body text line-height already at 1.7 — good

### 4. How We Support Parents (`HowWeSupportParentsSection.tsx`)

- Section padding: `py-16 md:py-[120px]`
- Heading: keep at `md:text-[46px]` (already good)
- Subtitle: add `max-w-[650px]`
- Increase card internal padding from `p-8` to `p-10`
- Increase grid gap from `gap-6` to `gap-8`
- Increase card min-height from `280px` to `300px`

### 5. Why Parents Trust (`WhyParentsTrustSection.tsx`)

- Section padding: `py-16 md:py-[120px]`
- Image: add `rounded-xl` (already present, confirm)
- Increase heading size to `md:text-[46px]` for consistency
- Add `max-w-[650px]` to description text blocks

### 6. You're in the Right Place (`RightPlaceSection.tsx`)

- Section padding: `py-16 md:py-[120px]`
- Add `rounded-xl overflow-hidden` to image container
- Heading already at `md:text-[42px]` — bump to `md:text-[46px]` for consistency
- Add `max-w-[650px]` to text column content
- Increase button padding: `px-10 py-4`

### Summary of Changes

| File | What Changes |
|---|---|
| `tailwind.config.ts` | Container max-width `1200px` → `1100px` |
| `ForParentsHero.tsx` | Section padding, headline size, button size, card padding |
| `DoesSoundFamiliarSection.tsx` | Section padding, text max-width, list spacing |
| `HowWeSupportParentsSection.tsx` | Section padding, card padding/gap/min-height, subtitle max-width |
| `WhyParentsTrustSection.tsx` | Section padding, heading size |
| `RightPlaceSection.tsx` | Section padding, image rounded corners, heading size, text max-width, button padding |

No new components, no structural changes, no new elements. Pure spacing and sizing refinement to match the Wix reference.

