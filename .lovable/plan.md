

## Plan: Fix "Explore the Series" button + investigate universal link for paperback

### Changes

1. **Fix "Explore the Series" button in `BooksHero.tsx`**
   - The `#series` anchor has no matching `id="series"` element on the Books page — that's why it does nothing.
   - Change the href from `#series` to `#book-dan` (a new id we'll add) so it scrolls down to the first book description section.
   - Add `id="book-dan"` to the `<section>` in `BookDanSection.tsx` (the first book after the hero and "More Than A Story" sections).

2. **Universal Amazon link → paperback**
   - The `mybook.to/nwINcA` link is a "Genius Link" that auto-redirects by country, but it defaults to the Kindle edition.
   - Unfortunately, we cannot control where a mybook.to link lands (Kindle vs Paperback) from our code — that setting lives in the Genius Link / Books2Read dashboard where the link was created.
   - **Recommendation:** Log into your [Books2Read / MyBook.to dashboard](https://books2read.com) and edit the link so the default landing is the Paperback edition instead of Kindle. This is a setting on their side, not something we can append a query parameter to.
   - Alternatively, if you cannot change it there, we can replace `mybook.to/nwINcA` across all 6 files with a different universal link that defaults to paperback. You would need to either create a new Genius Link targeting paperback, or we can use the direct Amazon link (but that will only work for Canadian visitors).

### Files to edit
- `src/components/BooksHero.tsx` — change `#series` → `#book-dan`
- `src/components/BookDanSection.tsx` — add `id="book-dan"` to the section element

