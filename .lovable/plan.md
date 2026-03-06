

## Plan: Replace How It Works images + Fix Why Schools Choose image styling

Two changes needed:

### 1. Replace How It Works step images

Copy the 4 uploaded images into `src/assets/` and update imports in `HowItWorksSection.tsx`:

- `user-uploads://image-gen_3-2.png` → `src/assets/educators-step-1.png` (Step 01 - Book a Free Consultation)
- `user-uploads://step_2.png` → `src/assets/educators-step-2.png` (Step 02 - Choose Your Implementation Package)
- `user-uploads://step_3.png` → `src/assets/educators-step-3.png` (Step 03 - Schedule Training & Delivery)
- `user-uploads://step_4.png` → `src/assets/educators-step-4.png` (Step 04 - Implement with Ongoing Support)

These overwrite the existing step images, so no import changes needed.

### 2. Fix Why Schools Choose image

The image container has `bg-background/40` which adds a visible non-transparent background behind the image. The `rounded-lg` is on the wrapper div but since `object-contain` leaves empty space around the image, the rounded corners aren't visually apparent on the photo itself.

Fix in `WhySchoolsChooseSection.tsx`:
- Remove `bg-background/40` from the container to eliminate the visible background
- Switch from `object-contain` back to `object-cover` so the image fills its container and the `rounded-lg overflow-hidden` on the wrapper actually clips the image corners visibly
- Keep the existing responsive size constraints (`max-w-[280px]`/`h-[260px]` etc.) to prevent oversizing

