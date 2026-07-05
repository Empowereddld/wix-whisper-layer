# Batch 6 — DLD vs Autism blog polish

Keep child/kids terminology as-is. Ship items 1, 2, 3, 4, 5 from the earlier suggestions.

## Changes

1. **Meta description** — set on the `blog_posts` row (currently NULL):
   > "Autism and DLD share overlap but differ in key ways. Compare symptoms, diagnosis, and support so you can advocate for the right help."

2. **Intro paragraph** — add 2-3 sentences above the opening comparison table in the post body, framing why the two are confused and what the article covers. No new claims beyond what's already in the post.

3. **Restore missing sources** — append to the existing References section at the end of the body, matching the current citation format:
   - McGregor & Self (2021)
   - Marini et al. (2020)
   - Public Health Agency of Canada (2022)
   - Saar et al. (2022)
   - Thomas et al. (2019)
   - Whitehouse (2021)

   Full citation strings will be pulled verbatim from the user's draft.

4. **FAQ block** — add an "FAQs" H2 near the end of the body with 3-4 Q&As derived strictly from content already in the post (no new facts). Draft Qs:
   - Can a child have both DLD and autism?
   - How is DLD different from autism?
   - Does DLD affect social skills?
   - Who diagnoses DLD vs autism?

   Answers will be 1-2 sentences each, paraphrased from existing post content.

5. **Legacy slug redirect** — keep current slug `/resources/blog/autism-vs-dld-understand-the-difference`. Add a client-side redirect from `/blog/dld-vs-autism` and `/resources/blog/dld-vs-autism` → current URL in `src/App.tsx` routing (or a small redirect component).

## Skipped
- **Item 6 (terminology sweep)** — per your instruction, keep child/kids wording.

## Technical notes
- Items 1-4 are a single `UPDATE` on the `blog_posts` row (`meta_description` + `body`). No schema changes.
- Item 5 touches `src/App.tsx` only (add `<Route>` entries with `<Navigate replace />`).
- No FAQPage JSON-LD wiring in `BlogPost.tsx` this pass — content-only FAQ. Can add JSON-LD in a follow-up if you want the rich result.
