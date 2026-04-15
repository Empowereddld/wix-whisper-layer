

# Plan: Add PDF Page Previews to IEP Goal Builder Resource

## What happens

Convert pages 1, 2, and 3 of the IEP Goal Bank PDF into PNG images and add them as `sample_images` on the resource. The existing `SampleGallery` component already supports a thumbnail strip with multiple images — no component changes needed.

## Steps

### Step 1 — Generate preview images from the PDF
- Use a script to extract pages 1–3 from `Empowered_DLD_IEP_Goal_Bank_2.pdf` as PNG files
- Save them to `public/images/iep-preview-page-1.png`, `iep-preview-page-2.png`, `iep-preview-page-3.png`

### Step 2 — Upload preview images to storage
- Upload all 3 PNGs to the `thumbnails` bucket (public bucket, same as the thumbnail)

### Step 3 — Update the database row
- Update the `resources` row for this bundle to set `sample_images` to an array of the 3 public URLs from the thumbnails bucket

### Result
The resource detail page will show the thumbnail as the main image, plus pages 1–3 as clickable previews in the thumbnail strip below — all using the existing `SampleGallery` component with no code changes.

