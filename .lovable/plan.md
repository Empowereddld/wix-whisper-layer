

# Plan: Re-extract PDF Preview Pages at Higher Quality

## Problem
The current page preview images in the gallery are blurry and text is hard to read. They need to be re-rendered at higher resolution with minimal compression.

## Steps

### Step 1 — Re-extract pages 1–3 from the uploaded PDF
- Use `pdftoppm` at **300 DPI** (double the previous attempt)
- Output as **PNG** (lossless) instead of WebP to avoid compression artifacts
- Target width of **1800px** for crisp rendering on retina displays

### Step 2 — Upload replacements to the thumbnails bucket
- Replace the existing `iep-preview-page-1.webp`, `iep-preview-page-2.webp`, `iep-preview-page-3.webp` with the new high-res PNGs
- Update the `sample_images` array in the `resources` table to point to the new `.png` URLs

### Step 3 — Update local public assets
- Replace the webp files in `public/images/` with the new PNGs for fallback

## Result
Sharp, readable PDF page previews in the gallery thumbnail strip.

