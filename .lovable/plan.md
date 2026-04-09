

## Plan: Update "Why Empowered DLD" Section Text

The new copy is longer than the current text, but it can still look clean with proper formatting. I'll structure it with visual breathing room — short paragraphs, indented list-style lines for the "Children need…" and "Adults need…" blocks, and keep the "What makes us different" checklist removed since the new copy covers that ground.

### Changes to `src/components/TrustSection.tsx`

**Replace lines 34–57** (the heading, paragraphs, and checklist) with:

- **Heading** → "Changing how the world understands DLD"
- **Paragraphs** structured as:
  1. "We created Empowered DLD to change how the world understands children with Developmental Language Disorder."
  2. "We are Jinean and Camesha, an SLP and a teacher."
  3. "Too many children with DLD go unseen, misunderstood, or unsupported."
  4. Three indented lines starting with "Children need…" / "They need…" / "They deserve…" — styled as a subtle list block
  5. Three indented lines starting with "Adults need…" / "They need…" / "They need…" — same style
  6. Final paragraph: "That is why we create tools that go beyond awareness…"

**Formatting approach:**
- Keep `max-w-[420px]` on paragraphs for readability
- Use slightly tighter spacing (`mb-2.5`) between paragraphs within each group
- The "Children need…" and "Adults need…" blocks will use `pl-3 border-l-2 border-primary/30` for a subtle left-accent to visually separate them
- Remove the "What makes us different" checklist and bullet items (the new copy replaces this)
- Keep the CTA button as-is

This keeps the section clean and scannable despite the longer copy.

