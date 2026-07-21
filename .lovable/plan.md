## Fix merch hero image cropping on desktop & tablet

The current hero image uses `aspect-[4/3]` + `object-cover`, which forces a tall crop in every viewport and clips the boy on the right on desktop and tablet. Mobile is fine because the image fills full width.

### Changes to `src/components/merch/MerchHero.tsx`

1. **Reshape the image frame to landscape at md+**
   - Replace `aspect-[4/3]` with responsive ratios: `aspect-[4/5]` on mobile (portrait fits phones), `md:aspect-[16/10]` (tablet landscape), `lg:aspect-[3/2]` (desktop wider landscape). This makes the frame shorter and wider so less needs to be cropped.

2. **Give the image column more room on desktop**
   - Change the lg grid from `lg:grid-cols-2` (50/50) to `lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]` so the image side gets ~58% of the row. Keeps the copy readable while giving the photo more landscape space.

3. **Anchor the crop so the boy stays in frame**
   - Add `object-[center_30%]` (or `object-center`) on the `<img>` so when any cropping does happen, it trims the top/bottom of the scene (sky, ground) rather than the boy on the right edge.

4. **No changes elsewhere** — image asset, copy, button, and mobile stacking behavior stay identical.

### Verification

- Preview at desktop (1280+), tablet (~768–1024), and mobile.
- Confirm the boy on the right is fully visible in all three, the mother is centered, and the copy column still reads cleanly.