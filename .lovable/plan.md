

## Two Features: Sample Page Gallery + Social Sharing Buttons

### Feature 1: Sample Pages Gallery

Like the Black Sheep Press reference screenshot, we'll add a thumbnail gallery below the main cover image on the resource detail page. This lets potential buyers preview sample pages before purchasing.

**Database change:** Add a `sample_images` column (text array) to the `resources` table to store URLs of sample page screenshots.

**Storage:** Upload the sample PDF page images (extracted from the parsed document) to the `resources` storage bucket as individual image files (e.g., `samples/dan-daria-graphic-organizers-1.jpg`, etc.).

**UI change in ResourceDetail.tsx — Left column:**
- Main cover image stays at top
- Below it, add a row of clickable thumbnail images (grid of small squares, like the reference)
- Clicking a thumbnail swaps it into the main image view
- The cover image is always the first thumbnail

**Data for Dan & Daria's Graphic Organizers:** Upload 4-5 representative sample page images from the PDF and populate the `sample_images` array.

### Feature 2: Social Sharing Buttons

Upgrade the existing `SharePopover` component to include social platform sharing alongside the copy-link functionality.

**Buttons to add:**
- **Facebook** — uses `https://www.facebook.com/sharer/sharer.php?u={url}`
- **X (Twitter)** — uses `https://twitter.com/intent/tweet?url={url}&text={title}`
- **Copy link** — keep existing behavior

**Note on Instagram:** Instagram does not support URL-based sharing (no share URL scheme for posts). We can't add a "share to Instagram" button — it's a platform limitation. We'll skip it.

**UI approach:** Add circular social icon buttons (Facebook blue, X black) in the SharePopover below the copy-link row, similar to the reference screenshot's "Share this product" section with LinkedIn/Twitter/Facebook icons. We'll also add a "Share this resource" section on the ResourceDetail page itself (below the download button area) with the same social buttons for higher visibility.

### Summary of Changes

| Area | Change |
|------|--------|
| Database | Add `sample_images text[]` column to `resources` |
| Storage | Upload sample page images for Graphic Organizers |
| `ResourceDetail.tsx` | Add thumbnail gallery below cover image; add share section |
| `SharePopover.tsx` | Add Facebook + X sharing buttons with icons |
| Database data | Populate `sample_images` for the Graphic Organizers resource |

