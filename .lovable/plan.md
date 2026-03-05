

## Make "Does this sound familiar?" black bar full-width

The user wants the black card to stretch edge-to-edge across the viewport, breaking out of the container constraint.

### Approach

In `DoesSoundFamiliarSection.tsx`, restructure so the black bar sits outside the container (or uses negative margins/full-width utility) to span the full viewport width, while the text content below remains within the container.

### Changes — `src/components/DoesSoundFamiliarSection.tsx`

- Pull the black card out of the container grid and place it as a standalone full-width element before the container
- Remove `rounded-lg` from the black card (full-bleed bars don't have rounded corners)
- Keep the text content inside the container as-is
- The section background (`bg-muted`) still wraps everything

The structure becomes:

```text
<section bg-muted>
  <div class="bg-black full-width px-container py-5">  ← edge to edge
    <h2>Does this sound familiar?</h2>
  </div>
  <div class="container">                               ← constrained
    <p>Your child struggles...</p>
    ...
  </div>
</section>
```

This gives a bold editorial feel — the black band acts as a divider/banner spanning the full viewport while the body text stays within the readable container width.

