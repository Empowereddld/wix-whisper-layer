

## Fix: Style "you're a parent who:" in RightPlaceSection

In the reference, this line has an underline decoration, giving it emphasis as a lead-in to the bullet list. Currently it's plain muted text which feels orphaned.

### Change in `src/components/RightPlaceSection.tsx`:

Update the `<p>` tag for "you're a parent who:" to add an underline decoration:

```tsx
<p className="text-[13px] md:text-[14px] lg:text-[15px] text-muted-foreground leading-[1.7] mb-4 md:mb-6 underline underline-offset-4">
```

This matches the reference styling and gives the line purpose as a visual bridge between the heading and the list.

