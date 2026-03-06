

## Plan: Make layered images portrait-style

### Changes in `OrganizationsAwarenessSection.tsx`

1. Change both image aspect ratios from `aspect-[4/3]` to `aspect-[4/5]` (portrait, matching the Salient reference)
2. Increase the relative container height to `h-[320px] md:h-[420px] lg:h-[520px]` to accommodate taller images
3. On mobile, ensure the layered composition stays compact and doesn't overflow

