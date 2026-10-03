# Fix the header overflow on common desktop widths

## What I found (measured in the browser)

- On a wide screen (about 1500px+, like your screenshot) the header looks correct: logo left, nav centered, cart, Log in / MY LIBRARY right, all visible.
- On a common laptop width of 1280px the header is too wide: the page scrolls sideways and the right side of the header is cut off. The purple "JOIN THE LIBRARY" button is clipped at the screen edge ("JOIN THE LIB...").
- Measured: at 1280px viewport the page's content width is 1337px, so it overflows by about 57px. At 1024px it overflows by about 225px.

## Plan

Make the full desktop nav only appear when there is genuinely room for it, and tighten its spacing so it fits at exactly 1280px:

1. In `src/components/Header.tsx`, switch the desktop nav breakpoint from `lg` (1024px) to `xl` (1280px):
   - `hidden lg:flex` → `hidden xl:flex` for the desktop nav.
   - `lg:hidden` → `xl:hidden` for the hamburger button and the mobile menu, so screens between 1024–1279px use the same tidy hamburger menu that mobile and tablet already use.
2. Tighten the desktop row so it fits at 1280px with room to spare:
   - Nav gap: `xl:gap-8` → keep 6px-level spacing at xl, drop the wider 8.
   - Auth buttons: reduce outer padding on the "JOIN THE LIBRARY" button and the gap between Log in and the button at xl.
   - Keep `whitespace-nowrap` so nothing wraps or truncates mid-word.
3. Header height, logo size, announcement bar, dropdowns, and mobile menu stay exactly as they are.

## Scope

- Only `src/components/Header.tsx` changes.
- No copy, routing, announcement bar, or business logic changes.

## Verification

- Playwright screenshots of the header at 1024, 1280, 1440 and 1920px widths: no horizontal scrolling (scrollWidth equals innerWidth), button fully visible at every width, hamburger menu used below 1280px.
- Build stays clean.
