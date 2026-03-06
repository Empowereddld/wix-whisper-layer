

## Fix Image in Awareness Section (Tablet View)

Looking at the reference screenshot and the current code, the issue on tablet is that the image container has a fixed height (`md:h-[380px]`) and the front card uses `relative` positioning with centering — but the rotation (`rotate(1deg)`) and the `md:w-[80%]` constraint make it look awkward at that breakpoint.

### Changes to `src/components/OrganizationsAwarenessSection.tsx`:

1. **Remove fixed height on tablet** — change `md:h-[380px] lg:h-[520px]` to `h-auto lg:h-[520px]` so the image sizes naturally on tablet
2. **Remove rotation on tablet** — only apply `rotate(1deg)` on desktop (`lg:`) so the tablet image sits flat and clean
3. **Simplify tablet image sizing** — use `md:w-[85%]` instead of `md:w-[80%]` for a slightly larger, more balanced presence
4. **Add `items-start` alignment** on the image column for tablet so it aligns with the top of the text column (matching the reference)

