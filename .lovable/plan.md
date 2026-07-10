## Follow-up pass on "When Your Child Knows More Than They Can Say"

All changes are data-only (updates to the `blog_posts` row for slug `when-your-child-knows-more-than-they-can-say`). No component or route code changes. "Children" language stays as Jinean wrote it.

### 1. Featured image
Generate a warm, on-brand illustration and upload it via `lovable-assets` so the blog card and post header render an image.

- Prompt direction: soft, editorial illustration of a parent gently listening to a child sharing a drawing at a kitchen table. Warm neutral palette that harmonizes with the site's purple primary. No text in the image. 1600x900.
- Save the CDN pointer at `src/assets/blog/when-your-child-knows-more.jpg.asset.json`.
- Update `blog_posts.featured_image_url` to the CDN `url` from that pointer.

### 2. Internal links (added inline to the body)
Add contextual links that already exist on the site — no new routes:

- In "Children Show What They Know in Different Ways", link "Developmental Language Disorder (DLD)" -> `/about-dld`.
- In "Why Can Explaining Be So Difficult?", link "executive function" in the Executive Function subsection -> `/resources/blog/executive-function-and-its-relationship-to-dld`.
- In the intro, link "Could My Child Have DLD?" style phrase (e.g. "If this sounds familiar") to `/resources/blog/could-my-child-have-dld` via a short inline "Related reading" sentence at the end of the "What This Can Look Like" section.
- In the closing "Looking for More DLD Support?" section:
  - "Life with DLD: The Dan and Daria Podcast" -> `/podcasts`
  - "Living Life with DLD" -> `/books`
  - "DLD Resource Library" -> keep `/hub` (already linked)

### 3. FAQ block
Append a `###### **FAQs**` block before the closing "Looking for More DLD Support?" section so `BlogPost.tsx`'s existing parser renders it as an accordion. Four questions:

1. **Why does my child say "I don't know" so often?** - Explains cognitive load of open questions and how specific questions help.
2. **Is this the same as being shy or unmotivated?** - Distinguishes DLD from temperament and effort.
3. **My child understands everything but can't explain it. Is that still DLD?** - Covers expressive-dominant profiles.
4. **How can teachers tell what my child actually knows?** - Points to visual supports, demonstrations, and flexible response formats.

Answers stay short (2-3 sentences), no em dashes, warm brand voice.

### 4. SEO title and meta
Update the post's SEO-only fields (H1 stays as-is because `BlogPost.tsx` renders `<title>{post.title} | Empowered DLD</title>`, so we adjust the stored title alternatives via meta_description and rely on H1 for on-page tone).

Since the current schema uses `title` for both H1 and `<title>`, keep the H1 emotional but strengthen `meta_description` for search intent:

- **meta_description** (new, ~155 chars):
  `Children with DLD often know more than they can say. Learn why explaining is hard and practical ways parents and teachers can help them share what they know.`

- **excerpt** (used on blog card, tighten to ~140 chars):
  `Children with DLD often know more than they can say. Practical, parent-first strategies to help them share what they know.`

(Leaving `title` unchanged preserves Jinean's H1. If you later want a distinct SEO title, we'd need a small schema addition — flag if you want that; out of scope for this pass.)

### How it ships
- One `imagegen` call, one `lovable-assets create` upload, one `.asset.json` written.
- One `UPDATE` on `blog_posts` setting `featured_image_url`, `excerpt`, `meta_description`, and the revised `body` (with inline links + FAQ block).

### Out of scope
- No changes to `BlogPost.tsx`, `Blog.tsx`, `BlogPostCard.tsx`, sitemap, or admin UI.
- No swap of "children" -> "people" anywhere in the post.
- No new routes, categories, or schema columns.
