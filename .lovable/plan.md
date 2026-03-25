

## Redesign StoryBuilders Page to Match Brief Exactly

### Section-by-section changes

**1. Hero** — No changes (already done).

**2. StoryBuildersStatBand** — Keep as-is.

**3. Hook Section** — Update copy with line breaks:
> For many children, telling a story about their day is not simple.
> Words get stuck. Details get lost. And over time, confidence starts to fade.
> StoryBuilders was created to change that.

**4. What Is StoryBuilders** — Simplify to heading + bullet list:
- Understand and retell stories
- Build vocabulary and sentence structure
- Share their ideas with more confidence
- Feel proud of how they communicate

Followed by: "It was designed for children with Developmental Language Disorder and can be used at home, in therapy, or in the classroom."

**5. Why Join the Launch Team** — Replace prose with 3-column card grid:
- Spread awareness of DLD
- Help shape a tool used across home, school, and therapy
- Be part of something meaningful from the beginning

**6. How It Works** — Reduce to 3 steps (remove animated tablet component):
1. Join the Launch Team
2. Invite other storytellers
3. Unlock meaningful milestones

**7. Milestones** — Keep as-is.

**8. Individual Progress** — Keep as-is (post-signup state).

**9. Collective Goal** — Keep as-is.

**10. Share Section** — Keep as-is.

**11. Remove FAQ** — Not in the brief.

**12. Final CTA** — Keep as-is.

### Files changed

1. **`src/pages/StoryBuilders.tsx`** — Rewrite sections 3–6, remove FAQ, remove `StoryBuildersHowItWorks` import, keep `StoryBuildersStatBand`.

