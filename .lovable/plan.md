

## Plan: Refine Global Community Stats Section

### Changes — single file: `src/components/ShopGlobalCommunity.tsx`

**Content updates:**
- Headline → "A Growing Global Community"
- Subtext → "Empowered DLD is connecting families, educators, and SLPs around the world."
- Updated labels: "Community members worldwide", "Countries using our resources", "Languages available", "Children affected by DLD"

**Visual fixes:**
1. **Add subtle shadow** to default cards: `shadow-[0_2px_12px_rgba(0,0,0,0.06)]` for more depth
2. **Reduce vertical padding**: `py-10` → `py-8` (32px) so cards aren't stretched
3. **Fix label color**: Ensure `text-stone-ui` resolves correctly; add fallback `text-[#A7B4C4]` if needed
4. **Ensure border visibility**: Already has `border border-thistle` — verify it renders; may need explicit `border-[#D7CCE5]`
5. **Fix "1 in 14" line break**: Add `whitespace-nowrap` to the number text, and slightly reduce font size for that card or use a consistent `whitespace-nowrap` on all numbers
6. **Increase card gap** slightly: `gap-4 md:gap-6` → `gap-5 md:gap-6`

No other files affected — component is already shared across Shop and Resources pages.

