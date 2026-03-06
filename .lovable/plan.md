

## Redesign DLDImpactSection: Two-Column Layout + Slower Scroll + Card Numbering

### Layout Change (Desktop)
Switch from a single centered column to a **two-column sticky layout**:
- **Left column** (sticky): Title, subtitle, and progress indicator (card counter `1/6`, `2/6`, etc.) — all left-aligned, pinned in place while scrolling
- **Right column** (sticky): The stacked card deck, anchored while cards animate through

Both columns sit inside the sticky container. The outer section provides scroll runway.

### Scroll Speed Fix
The current `300vh` height cycles through 6 cards too fast. Increase to **~450vh** (`lg:h-[450vh]`, `md:h-[300vh]`) so each card gets significantly more scroll runway — roughly 1 viewport height per card transition.

### Card Numbering
Add a subtle `1 / 6` counter to each card or to the left column. Place it in the **left column** near the bottom as a muted label (e.g., `text-muted-foreground text-[13px] font-medium tracking-wider`) that updates with `activeIndex`. Format: `1 / 6`.

### Specific Changes to `DLDImpactSection.tsx`:

1. **Outer section height**: Change `lg:h-[300vh]` → `lg:h-[450vh]`, `md:h-[200vh]` → `md:h-[300vh]`

2. **Sticky container**: Change from `flex-col items-center justify-center` to a two-column flex layout:
   - `flex items-center justify-center gap-16 max-w-[1100px] mx-auto`
   - Left div (~40% width): title `text-left`, subtitle, progress dots (vertical or horizontal), and card counter `{activeIndex + 1} / {cards.length}`
   - Right div (~60% width): the existing card stack (keep `max-w-[480px]`)

3. **Card counter**: In the left column, add a subtle `<span>` showing `01 / 06` style numbering, using `text-muted-foreground text-[13px] tracking-widest`

4. **Progress dots**: Move from below cards to the left column, displayed vertically for a more editorial feel

5. **Mobile**: Keep the existing simple vertical list, unchanged. Add `{i + 1} / {cards.length}` as a small label on each mobile card.

6. **Tablet (md)**: Use the two-column layout but with tighter gap (`gap-10`) and slightly smaller text sizes

