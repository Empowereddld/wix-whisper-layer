

## Hero Image iPad Fix

**Problem**: On iPad, the hero image is scaled at 1.15x which crops the right girl's shoulder out of frame.

**Fix**: Reduce the `md:scale` from `1.15` to `0.95` so the image zooms out slightly, keeping both girls fully visible. The desktop (`lg`/`xl`) can use a slightly larger scale to fill the space.

### Changes

**File: `src/components/HeroSection.tsx`** (line 25)
- Change `md:scale-[1.15]` to `md:scale-[0.95] lg:scale-[1.08]`
- This zooms out on iPad so neither girl gets cropped, while desktop stays appropriately sized

