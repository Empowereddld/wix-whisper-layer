

## Make Page Labels More Prominent Across Hero Sections

The current page identifier (e.g., "BULK ORDERS", "For Parents") is a small inline badge that's easy to miss. We'll replace it with a full-width accent bar that spans the entire top of the gray content card, making the page identity unmissable.

### Design

Replace the small `inline-block` badge with a full-width bar that stretches across the top of the card. The bar will:
- Use `bg-deep-purple` background, spanning the full card width (negative margins to counteract card padding, or placed outside the padding container)
- Display the page name in white, bold uppercase text at a larger size (~14-18px)
- Sit flush at the top of the gray card with rounded top corners matching the card

### Files to Update

All 5 hero components that share this pattern:

1. **`src/components/BulkOrdersHero.tsx`** -- "BULK ORDERS"
2. **`src/components/ForParentsHero.tsx`** -- "FOR PARENTS"
3. **`src/components/ForTherapistsHero.tsx`** -- "FOR THERAPISTS"
4. **`src/components/ForEducatorsHero.tsx`** -- "FOR SCHOOLS AND EDUCATORS"
5. **`src/components/ForOrganizationsHero.tsx`** -- "FOR ORGANIZATIONS"

### Implementation

For each hero, restructure the gray card `div` so the purple bar sits at the very top edge:

- Remove `py-10`/`py-14`/`py-24` from the outer card div; instead use `pt-0 pb-10 md:pb-14 lg:pb-24`
- Replace the small `<span>` badge with a full-width div:
  ```tsx
  <div className="bg-deep-purple rounded-t-xl lg:rounded-t-2xl -mx-6 md:-mx-8 lg:-mx-16 -mt-0 px-6 md:px-8 lg:px-16 py-3 md:py-4 mb-6 md:mb-8">
    <span className="text-white text-[13px] md:text-[15px] lg:text-[17px] font-bold uppercase tracking-[0.16em]">
      Bulk Orders
    </span>
  </div>
  ```
- The negative horizontal margins (`-mx-6`/`-mx-8`/`-mx-16`) make it span the full card width while the card keeps its internal padding for the rest of the content
- `rounded-t-xl lg:rounded-t-2xl` keeps the top corners rounded to match the card shape

This is a purely visual/CSS change -- no logic, routing, or backend changes needed.

