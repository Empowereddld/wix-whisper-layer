# Redesign the "What's included?" section on the Parent Guidebook page

Only this section on /shop/parent-guidebook changes. Everything else on the page stays as it is, including checkout, tracking and navigation.

## New layout
1. **Heading:** "What's inside the guidebook?" This replaces "What's included?", as your brief asks.
2. **Supporting text:** "12 guided sections designed to help you explore DLD with your child, one conversation at a time."
3. **Four cards** with your exact wording. On a computer they sit two by two; on a phone they stack.
   - Celebrate their strengths (Sections 1–2)
   - Understand DLD together (Sections 3–6)
   - Find support and practice (Sections 7–10)
   - Look toward the future (Sections 11–12)
   Each card has a very light lavender or cream background, a thin border, softly rounded corners, one small simple icon, a small "Sections X–Y" label, the title and the description. No heavy shadows.
4. **"View all 12 guided sections"** sits right below the cards and opens and closes. Inside, the 12 real section titles appear in their original numbered order. It works with a keyboard and with screen readers.
5. **"Plus 4 bonus resources"** stays below, with the same four names and slightly tidier spacing. The current page doesn't have descriptions for these resources, so I won't make any up.
6. The old long numbered list and the closing line ("One guidebook. Twelve guided sections...") are removed. The price stays on every buy button. Tell me if you want to keep that line.

The new section is checked on desktop and phone. It won't be published.

## Technical details
- Edit only the "What's included" section in `src/pages/ParentGuidebook.tsx`. Add a local `GROUPS` array and reuse the `SECTIONS` and `BONUS` arrays.
- The expandable panel uses the existing shadcn `Collapsible` (Radix sets aria-expanded and aria-controls), with a chevron that rotates when it opens.
- Colours come from semantic tokens only (`bg-secondary/40`, `bg-accent/…`, `border-border`). Icons are Lucide, 18px, stroke 1.4, inside a `bg-primary/10` tile.
- Grid is `grid-cols-1 lg:grid-cols-2`, following the project's lg stacking rule.
