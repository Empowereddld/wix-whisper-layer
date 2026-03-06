

## Plan: Fix "Why Therapists Trust" Section Image

The image in the therapists version uses `aspect-[4/5]` on desktop which forces a tall portrait crop that doesn't suit this particular photo (boy on bench is more landscape-oriented). The image looks awkward because it's being forced into a tall aspect ratio.

### Changes to `src/components/WhyTherapistsTrustSection.tsx`

Update the image container and `img` tag to use a more natural aspect ratio and better object positioning:

- Change desktop aspect from `lg:aspect-[4/5]` to `lg:aspect-[3/4]` for a less extreme crop
- Add `object-[center_20%]` to focus on the boy's face/upper body rather than defaulting to center
- Add `lg:sticky lg:top-8` on the image container so it stays visible as users scroll through the checklist
- Match the Parents version layout exactly but with image adjustments suited to this photo

This is a CSS-only tweak in one file.

