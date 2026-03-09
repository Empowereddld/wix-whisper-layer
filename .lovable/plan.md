

## Plan: Smaller stat cards on mobile

**File**: `src/components/ShopGlobalCommunity.tsx`

Reduce the padding and font sizes on the stat cards at mobile breakpoint:

- Card padding: `px-4 py-4` (mobile) → `md:px-5 md:py-5` (desktop, current)
- Stat number: `text-[28px]` (mobile) → keep `md:text-[40px] lg:text-[44px]`
- Suffix: `text-[16px]` (mobile) → keep `md:text-[24px]`
- Label: keep current sizes
- Grid gap: `gap-3` (mobile) → `md:gap-5` (desktop)

Single file, ~3 lines changed.

