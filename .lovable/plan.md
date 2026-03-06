

## Move Title Into Left Column & Crop Image Top 30%

### Layout Change
Move the `h2` title from above the grid into the **right text column** (same column as "We partner..."), positioned as the first element. This way the title sits at the same vertical height as the image starts.

### Image Cropping
On tablet, clip the top 30% of the image so only the bottom 70% is visible, while the image still stretches to match the text column height. This is achieved by wrapping the image in a container with `overflow-hidden` and using negative top margin or `object-position: bottom` with constrained height.

### Specific changes to `OrganizationsAwarenessSection.tsx`:

1. **Remove the `h2` from above the grid** (lines 8-11)
2. **Add the `h2` as the first child inside the right text column** (before "We partner...")
3. **Image cropping on tablet**: Add `object-position: center bottom` on the `orgKids` image at `md:` breakpoint so the top portion is cropped when the image fills the column height via `object-cover`

This keeps the two-column grid but places the title in the text column, aligned with the image start, and the image naturally crops from the top since it's using `object-cover` with `object-position: bottom` to fill the available height.

