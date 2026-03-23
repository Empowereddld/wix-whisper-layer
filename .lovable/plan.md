

## Add "Books" Card to the Resources Page

### Layout

Full-width two-column card below `BrowseByTypeSection` — book collection photo on the left, copy + CTA on the right. Stacks vertically on mobile.

### Copy

- **Tag**: OUR BOOKS
- **Heading**: "Stories That Help Children With DLD Feel Seen"
- **Body**: "Meet Dan, Daria, Ming, and Millen — four characters living with DLD who learn to understand their diagnosis, find the right support, and self-advocate with confidence. Trusted by families, therapists, and educators around the world."
- **CTA button**: "Shop on Amazon" → `https://mybook.to/nwINcA` (new tab)

### Changes

1. **Save uploaded image** as `src/assets/resource-books-collection.png`
2. **Create `src/components/ResourceBooksSection.tsx`** — Two-column layout matching site conventions (purple accents, rounded card, muted background)
3. **Edit `src/pages/Resources.tsx`** — Insert `ResourceBooksSection` between `BrowseByTypeSection` and `ShopGlobalCommunity`

