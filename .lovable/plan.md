## Add featured image to blog post page

Update `src/pages/BlogPost.tsx` to render `post.featured_image_url` at the top of the article, above the categories/title block (around line 138).

### Markup
- Wrap in a `<figure className="max-w-[900px] mx-auto mb-8 md:mb-10">`.
- `<img src={post.featured_image_url} alt={post.title} className="w-full aspect-[16/9] object-cover rounded-xl" loading="eager" />`.
- Only render when `post.featured_image_url` is truthy (existing posts without an image are unaffected).
- Also add `image: post.featured_image_url` to the existing JSON-LD `Article` schema when present (small SEO win, no visual change).

### Scope
- Only `src/pages/BlogPost.tsx`.
- No changes to `Blog.tsx`, cards, DB, or the current post's data.
- Applies site-wide to any blog post that has a `featured_image_url`.