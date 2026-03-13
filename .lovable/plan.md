

## Convert Remaining PNG/JPG Images to WebP

8 remaining non-WebP image imports to convert:

### Files to change:

1. **`src/components/InsideDLDResourceHub.tsx`** — 5 resource preview PNGs → WebP
2. **`src/components/EducatorsDLDAwarenessCTA.tsx`** — `workshop-bg.png` → WebP
3. **`src/components/WhatYoullLearnSection.tsx`** — `course-watching.jpg` → WebP
4. **`src/components/hub/HubHeader.tsx`** — `empowered-logo-white.png` → WebP

### What stays as-is:
- `resource-library-preview.gif` in DownloadablesLibraryIntro — GIF (animated), not convertible to static WebP

### For each asset:
- Create the `.webp` version in `src/assets/`
- Update the import in the component file

