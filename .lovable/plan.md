

## Fix: Reduce gap between header and hero section on For Parents page

The hero section has `lg:py-[120px]` top padding, which creates a large gap below the header. The fix is to reduce the **top** padding while keeping the bottom padding intact.

### Change in `src/components/ForParentsHero.tsx` (line 5):

Replace the symmetric padding `py-10 md:py-16 lg:py-[120px]` with asymmetric padding that reduces the top:

```
pt-6 md:pt-10 lg:pt-16 pb-10 md:pb-16 lg:pb-[120px]
```

This cuts the top spacing roughly in half while preserving the bottom spacing that separates this section from the next.

