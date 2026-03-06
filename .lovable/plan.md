

## Plan: Fix mobile image cropping on For Therapists page

Two images on the /for-therapists page are being excessively cropped on mobile due to restrictive `max-h` and `object-position` values.

### Changes

**1. `src/components/ForTherapistsHero.tsx` (line 28)**
- The hero image has `max-h-[300px]` on mobile with `object-[center_40%]`, which crops subjects out of frame
- Remove the aggressive `max-h` constraint and adjust `object-position` to keep subjects centered
- Change: `max-h-[300px] md:max-h-[400px]` → remove max-h on mobile, use aspect ratio instead
- Update to: `aspect-[16/9] md:aspect-[16/10] lg:aspect-auto` with `object-center` for mobile

**2. `src/components/WhyTherapistsTrustSection.tsx` (line 60)**
- The boy-reading-bench image has `max-h-[250px]` on mobile with `object-[center_20%]`, heavily cropping the subject
- Increase mobile max-height and center the object position
- Change: `max-h-[250px]` → `max-h-[300px]` and `object-[center_20%]` → `object-center`

Both fixes widen the visible area of each image on mobile so the subjects are not cut off.

