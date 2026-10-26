# Parent Guidebook page: For Parents style top section

Restyle only the top section of /shop/parent-guidebook to match the For Parents hero. All wording, the price, and the buy button stay exactly the same.

## What changes
- **Purple label bar:** The small "PARENT GUIDEBOOK" label becomes the same deep purple bar with large white spaced capitals, sitting across the top of a rounded grey card (like "FOR PARENTS").
- **Grey card:** The heading, subheading, both intro paragraphs, the "27-page printable PDF..." line, the buy button, the digital download note and the creators line all sit inside the grey card on the left (about 58% width on desktop).
- **Picture panel:** On the right, a rounded panel with a soft shadow shows the guidebook cover and the page 4 preview side by side on a light background, filling the same height as the grey card. The "Printable PDF guidebook" caption stays under the images.
- **Buy button:** Keeps its current deep purple style and wording ("Get the Parent Guidebook · $9.99 USD"), so it still matches the other buy buttons further down.
- **Phone:** Like For Parents, the grey card comes first and the picture panel stacks underneath.

## Not changing
- Everything below the top section, the header, the banner, the For Parents page, and checkout.

## Check
- Preview at desktop (1280px) and phone (390px): no overflow, buy button still opens checkout, no console errors. Preview-only until you say publish.

## Technical details
- Edit only the hero section in `src/pages/ParentGuidebook.tsx`, reusing the ForParentsHero class structure (container, `bg-muted` card, `lg:w-[58%]`, purple bar). The purple bar uses a semantic token rather than the hardcoded hsl used in ForParentsHero.
