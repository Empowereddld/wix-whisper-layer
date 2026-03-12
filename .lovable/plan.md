

## Replace last 2 PNGs with uploaded WebP versions

**Changes:**

1. **Save uploaded files:**
   - `user-uploads://empowered-logo-white..webp` → `src/assets/empowered-logo-white.webp`
   - `user-uploads://icon-slps..webp` → `src/assets/icon-slps.webp`

2. **Update `src/components/Footer.tsx`:**
   - Change import from `empowered-logo-white.png` → `empowered-logo-white.webp`

3. **Update `src/components/ChoosePathSection.tsx`:**
   - Change import from `icon-slps.png` → `icon-slps.webp`

This eliminates the last 2 PNGs on the Who We Serve page (and the Footer which appears site-wide).

