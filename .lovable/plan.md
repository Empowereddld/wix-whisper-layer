## Add new blog post: "When Your Child Knows More Than They Can Say"

Insert one new row into the `blog_posts` table using Jinean's copy exactly as pasted. No component, route, or SEO code changes are needed — the existing `/resources/blog/:slug` route (`src/pages/BlogPost.tsx`) renders any published post via markdown.

### Post fields
- **title:** `When Your Child Knows More Than They Can Say`
- **slug:** `when-your-child-knows-more-than-they-can-say`
- **status:** `published`
- **published_at:** now
- **categories:** `["DLD", "Parenting", "Awareness"]` (matches existing tag conventions)
- **excerpt:** `Sometimes the hardest part isn't having an idea. It's finding a way to share it. How to help children with DLD share what they know.`
- **meta_description:** 150-ish char SEO description drawn from the intro.
- **featured_image_url:** left null (matches other recent posts that render fine without one).
- **body:** Jinean's full text, converted to the site's existing markdown conventions:
  - Section titles rendered as `###` headings (same pattern used in `could-my-child-have-dld`).
  - Sub-strategy titles ("Word Finding", "Ask More Specific Questions", etc.) as `####` bold-style subheadings.
  - Bullet lists using `-` for the "what this can look like" and "welcome different ways to communicate" groups.
  - Emoji lines (🎙️ 📚 🧰) kept verbatim in the closing "Looking for More DLD Support?" section.
  - Internal CTA links appended to the closing section: "DLD Resource Library" -> `/hub`, podcast/books references left as plain text (no external URLs were provided).
  - No em dashes (per project rule) — Jinean's copy already complies.
  - No FAQ block, so the existing FAQ parser in `BlogPost.tsx` will simply render the whole body as-is.

### How it will be inserted
Run a single `INSERT` via the Supabase migration tool so the post is versioned with the project. No schema changes.

### Out of scope
- No changes to `BlogPost.tsx`, `Blog.tsx`, `BlogPostCard.tsx`, or admin blog UI.
- No new images generated; if you want a featured image later, we can add it in a follow-up.
- No sitemap regeneration step (sitemap already covers `/resources/blog/*` dynamically).
