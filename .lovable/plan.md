# Optimize /shop/books for search and AI search

The design, imagery, book descriptions, buy links and the "More than just a story" and "Who are these books for" sections all stay the same.

## What changes

1. **Top heading**
   - Main heading: "Children's Books About Developmental Language Disorder (DLD)"
   - Directly below it, in the same branded style: "The Living Life with DLD Book Series"
   - The existing character tagline and "Explore the Series" button stay.

2. **Intro paragraph**: your exact paragraph goes in a light, readable text block between the top section and "More than just a story".

3. **Series structure**
   - A small section label, "Living Life with DLD Storybooks", above the four children's stories. They will be renumbered Book 1 to Book 4: Paper Airplane, Make Friends, Birthday Party, Theatre Exchange.
   - The Parent Guidebook moves after the storybooks under a "Parent Companion Guide" label. Its "Book 2" tag becomes "Companion guide", and it keeps its text, cover and link.
   - Book descriptions, covers, links and the Spanish/French language links do not change.

4. **FAQ section** near the bottom, using the site's existing FAQ style. It has 6 short answers based only on what the site already says:
   - Ages: the site never states an age range, so this answer will say the books are picture books for children and can be shared at home, in classrooms and in therapy. It will not give specific ages unless you send them.
   - Other languages: Dan and the Paper Airplane is available in Spanish and French. Dan & Daria Make Friends is available in French. These are the same links already on the page.
   - Diagnosis: the books help any child learn about DLD and build understanding. This is not a clinical claim.

5. **"Continue exploring DLD with Dan & Daria"**: a small set of links:
   - Watch the Dan & Daria podcast, linking to the Podcasts page
   - Listen to What Is DLD?, linking to the Music page
   - Explore free DLD resources, linking to the Downloadables page (I'll check this matches the site's "no free language" rule; the label may become "Explore DLD resources")
   - Learn more about talking to your child about DLD, linking to the About DLD page

6. **Page title and description** use your suggested wording exactly.

7. **Search data**
   - Keep the per-book data and fix it: give each book its own cover image instead of the general site image, and add both creators as authors.
   - Add Empowered DLD organization data.
   - Add FAQ data that matches the visible FAQ word for word.

8. **Accessibility checks**
   - Descriptive alt text on the covers, for example "Cover of Dan and the Paper Airplane, a children's book about DLD"
   - Headings in a logical order: one main heading, with the section labels above the book titles
   - Check phone, tablet and desktop, and confirm every purchase button still works.

## Questions to confirm
- If you know the age range (for example 4 to 9), send it and I'll use it in the FAQ.
- I'll need the creators' names for the author data. The current data lists Camesha Russell only. Please send the SLP co-creator's name as you'd like it shown.

## Technical details
- Files: BooksHero.tsx, Books.tsx (section order, new intro/FAQ/links components, SEOHead jsonLd as an @graph with ItemList, Organization and FAQPage), and the five Book*Section.tsx files (only the label text and alt text change).
- FAQ items are reused by both the accordion and the search data so they never drift apart.
- The sitemap already includes /shop/books, so no change is needed there.
