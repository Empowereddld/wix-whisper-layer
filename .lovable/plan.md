
Goal: eliminate the persistent carousel overlap glitch in the “What’s Inside” Featured Resources section.

1) Root-cause fix in `src/components/InsideDLDResourceHub.tsx`
- Remove the slide stack behavior that uses very high z-index (`999`) and 3D `z/translateZ` animation values.
- Replace it with a single active-slide render inside `AnimatePresence` (`mode="wait"`), keyed by `active`.
- Keep a clean fade/scale transition so the visual style remains polished without layering artifacts.

2) Stabilize animation behavior
- Stop using `randomRotateY()` during every render cycle for active/inactive slides.
- If rotation is still desired, precompute a fixed rotation per resource (or remove rotation entirely) so slides don’t jump unpredictably during autoplay.

3) Contain stacking to the section
- Add local stacking/clip guards to prevent any visual leak above the section:
  - Image wrapper: `relative overflow-hidden isolate`
  - Featured card wrapper: `relative isolate`
- Keep internal z-index values low and local (no value that can outrank the sticky header).

4) Safety polish
- Ensure only visible slide receives pointer events.
- Keep autoplay + next/prev controls unchanged so behavior stays familiar.

Technical details
- File to update: `src/components/InsideDLDResourceHub.tsx`
- Main structural change: render one motion slide instead of mapping all slides simultaneously.
- Header currently has `z-50`; carousel must remain beneath this by avoiding global-high z-index values.
- This approach directly targets the overlap glitch while preserving current spacing work.

Verification checklist (after implementation)
- Scroll around `/resources/downloadables` and confirm no resource image appears above/over the header.
- Let autoplay run through multiple cycles; verify no flicker/ghost overlays.
- Test manual prev/next clicks rapidly and confirm transitions stay contained.
- Check both desktop and mobile widths for consistent behavior.
