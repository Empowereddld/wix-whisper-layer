

## Plan: Restyle BooksHero + Fix Route

### 1. Fix route path
Change `/books` to `/shop/books` in `App.tsx` so the Header dropdown link works.

### 2. Restyle BooksHero to match sub-page hero pattern
Rewrite `src/components/BooksHero.tsx` to use the same layout as `DownloadablesHero`, `FreeCourseHero`, etc.:

- **Outer section**: `pt-6 md:pt-10 lg:pt-16 pb-14 md:pb-16 lg:pb-16`
- **Two-column flex layout** with `lg:flex-row lg:items-stretch lg:gap-6`
- **Left column**: `bg-muted rounded-xl lg:rounded-2xl lg:w-[58%]` card with:
  - Purple "BOOKS" badge (`bg-deep-purple` with uppercase text)
  - Headline: `text-[30px] md:text-[36px] lg:text-[48px] font-black`
  - Description paragraph in `text-muted-foreground`
  - Black CTA button: "Explore the Series"
- **Right column**: Character image in a flex container with `items-center justify-center p-4 lg:p-8` (similar to FreeCourseHero since the characters image is an illustration, not a photo)

