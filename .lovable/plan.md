## Revert hero on `/preview/dan-and-the-paper-airplane`

Restore the hero section to its original framing so it doesn't duplicate the bench section's plot summary.

### Changes to `src/pages/preview/DanAndThePaperAirplane.tsx`

Replace the current hero block (eyebrow + h1 + four paragraphs) with the original:

- **Eyebrow:** "A Sample From Empowered DLD"
- **H1:** "A first look at *Dan and the Paper Airplane*" (with `<em>` on the title)
- **Subtitle (one paragraph):** "Book one in the *Living Life with DLD* series, written for children with DLD and the people who support them."

Remove the description paragraphs, the "Also available in…" line, and the "Chinese and Arabic coming soon" line.

The bench section ("What this story gives a child") stays exactly as it is and becomes the page's primary narrative description.

No other sections, styles, or images change.
