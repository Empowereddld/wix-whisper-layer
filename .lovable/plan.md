## Improve blog post readability

The body currently reads as one flat wall of DM Sans in muted gray, with h2/h3 in the same font weight-family as the body so nothing separates sections. Fix it purely with CSS on `.blog-content` in `src/index.css` — no content changes, applies to every blog post.

### Typography
- Body text: switch color from `--muted-foreground` to `--foreground` at ~90% for stronger contrast; bump body size to 17px desktop / 16px mobile; line-height 1.75; `text-wrap: pretty`.
- H2: swap to `DM Serif Display` (already loaded), 32px / 36px desktop, tight leading, deeper color. Adds clear visual hierarchy vs body.
- H3: keep DM Sans but bolder (700), 20/22px, letter-spacing tightened, with a small colored primary bar or uppercase eyebrow feel via `::before` accent to make sub-sections scannable.
- First paragraph after H1: drop-cap on the first letter (already exists as `.first-letter` pattern in some blogs — verify and use only for the first `<p>` in `.blog-content`).

### Section rhythm
- H2 gets a subtle hairline `border-top: 1px solid hsl(var(--border))` with generous `padding-top: 2.5rem` — creates a real section break without visual heaviness.
- Increase spacing between `<p>` blocks to 1.75rem.
- Style standalone short italic lines (like "Sometimes the hardest part…") via existing blockquote rule; leave markdown intact.

### Lists + callouts
- Bulleted lists: custom marker using a small primary dot (`::marker` color primary, already set — bump size); tighter left indent; more breathing room between items (0.75rem).
- Blockquote: soften background to `--secondary` at lower opacity, larger left border (4px), remove italic default so authors control emphasis.

### Links
- Inline links: primary color, underline offset 3px, thickness 1px, hover deepens to `--deep-purple`.

### Scope
- Only `src/index.css` `.blog-content` rules.
- No changes to `BlogPost.tsx`, markdown, DB, FAQ accordion, or other pages.
- Verify visually at the current preview route after applying.