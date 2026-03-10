

# Replace PNG Images with Uploaded WebP Versions

## Mapping of Uploaded Files to Existing Assets

Here's what I've identified from your uploads and where each is used:

| Uploaded File | Replaces | Used In |
|---|---|---|
| `image-gen_84.webp` (boy in classroom) | `boy-thinking.png` | EveryChildSection |
| `image-gen_97.webp` (cartoon characters) | `book-characters.png` | BooksHero |
| `image-gen_98.webp` (Dan book cover) | `book-dan-paper-airplane.png` | BookDanSection |
| `image-gen_100.webp` (Parent Guidebook cover) | `book-parent-guidebook.png` | BookGuidebookSection |
| `image-gen.webp` (Ask Me About DLD shirt) | `shop-merch.png` | ShopBrowseByCategory |
| `Podcast_Thumbnails_2.webp` (Ep.6) | `podcast-ep6.png` | Podcasts page |
| `Podcast_Thumbnails_4.webp` (Ep.9) | `podcast-ep9.png` | Podcasts page |
| `step_2.webp` (woman at desk) | `educators-step-2.png` | HowItWorksSection |
| `step_3.webp` (man at desk) | `educators-step-3.png` | HowItWorksSection |
| `step_4.webp` (teacher with kids) | `educators-step-4.png` | HowItWorksSection |

## Implementation Steps

1. **Copy all 10 WebP files** into `src/assets/` with new `.webp` filenames matching the originals
2. **Update imports** in 7 component files to point to the new `.webp` versions

## Still Missing (PNGs not yet converted)

After this batch, you'll still have ~72 PNGs remaining, including high-impact ones like:
- Hero images: `hero-girls.png`, `educators-hero.png`, `org-hero.png`, `podcast-hero.png`
- Book covers: `book-paper-airplane.png`, `book-make-friends.png`, `book-birthday-party.png`, `book-theatre-exchange.png`, `book-birthday-party-cover.png`, `book-theatre-exchange-cover.png`
- Family/lifestyle photos: `family-dinner-new.png`, `family-reading.png`, `founders-photo.png`
- Blobs and icons: all `blob-*.png`, `icon-*.png`, `char-*.png`
- Testimonials, logos, and more

