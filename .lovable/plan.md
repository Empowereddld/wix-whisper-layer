

## Add Sample Pages to Executive Function Skills Resource

### What we're doing
Upload 3 sample page images from the Executive Function Skills PDF and wire them up exactly like the Dan and Daria's Graphic Organizers detail page (thumbnail gallery + social share buttons). Also upload the actual PDF to the private bucket for paid downloads.

### Sample pages chosen
- **Page 1** — Working Memory (title page, shows full table format)
- **Page 4** — Organization + Response Inhibition (two skills, stop sign icon)
- **Page 6** — Emotional Control (traffic light icon, relatable topic)

### Steps

1. **Upload the PDF** to the `resources-private` bucket and update `file_url` on the resource record (`d9836a63-003e-44bc-9da4-a27d6d478d1a`).

2. **Upload 3 sample page screenshots** (page_1.jpg, page_4.jpg, page_6.jpg) to the public `resources` bucket under `samples/executive-function-skills-*.jpg`.

3. **Update the `sample_images` array** on the resource record with the 3 public URLs.

No code changes needed — the SampleGallery, SocialShareButtons, and detail page layout are already in place from the Graphic Organizers work.

