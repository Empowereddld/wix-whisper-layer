# Restyle the guidebook page's second section to match "Does this sound familiar?"

On the Parent Guidebook page, the section right after the hero ("You don't have to explain everything in one conversation.") gets the same look as the For Parents page's second section.

## Changes (Parent Guidebook page only)
1. The heading "You don't have to explain everything in one conversation." sits in a full-width black bar with white bold text, the same size and spacing as "Does this sound familiar?".
2. The section background changes from lavender to the same light gray, with the same top and bottom spacing.
3. The four paragraphs below keep their exact wording but use the same text size, gray colour, line spacing and gaps as the For Parents section. The sentence "What matters is creating space..." stays bold and dark, like "We can help you educate teachers..." on For Parents.
4. Paragraphs line up on the left with the black bar's heading, as on For Parents.

Wording, the For Parents page, checkout and all other guidebook sections stay unchanged. Checked on desktop and phone, not published.

## Technical details
- Edit only the first section after `GuidebookHero` in `src/pages/ParentGuidebook.tsx`, reusing the classes from `DoesSoundFamiliarSection.tsx` (section `py-10 md:py-16 lg:py-[120px] bg-muted`, black bar `bg-black text-white px-6 md:px-8 py-5 lg:py-8 mb-6 md:mb-8 lg:mb-12` with `container px-0` h2 `text-[20px] md:text-[26px] lg:text-[32px] font-black`, body `container px-6 md:px-8` > `max-w-[650px]`, paragraphs `text-[14px] md:text-[15px] leading-[1.7] mb-6`).
- `DoesSoundFamiliarSection` is not changed.
