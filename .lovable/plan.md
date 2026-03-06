

## Fix: ForParents Hero spacing issues

Two problems identified from the screenshots:

### 1. Desktop/Laptop: Large white gap below the hero

The hero has `lg:pb-[120px]` bottom padding, creating excessive whitespace before the "Does this sound familiar?" section (which also has `lg:py-[120px]` top padding). Combined, that's 240px of white space.

**Fix**: Reduce the hero bottom padding on desktop from 120px to something more proportional:

```
pt-6 md:pt-10 lg:pt-16 pb-10 md:pb-16 lg:pb-16
```

This brings the gap down to ~16px + 120px (from next section) = a comfortable ~136px total.

### 2. Mobile: Hero feels small/cramped

The mobile text is quite small (26px heading, 13px body) and the image is squeezed to max-h-[220px]. A few tweaks:

- Bump the mobile heading from `text-[26px]` to `text-[30px]`
- Increase the mobile image max-height from `max-h-[220px]` to `max-h-[260px]`
- Increase mobile section bottom padding from `pb-10` to `pb-14` for more breathing room

### Summary of changes in `ForParentsHero.tsx`:

| Element | Current | New |
|---------|---------|-----|
| Section padding | `pb-10 md:pb-16 lg:pb-[120px]` | `pb-14 md:pb-16 lg:pb-16` |
| Heading size | `text-[26px]` | `text-[30px]` |
| Image container | `max-h-[220px]` | `max-h-[260px]` |

Single file change, three class adjustments.

