

## Update Blog Post Content and Add SEO Improvements

Since blog content lives in the database, this requires both a database update and code changes.

### 1. Add `meta_description` column to `blog_posts` table
- New nullable text column for SEO meta descriptions
- Update this post's meta_description to the provided text

### 2. Update the blog post content via SQL migration
- Replace the body of the post with slug `life-with-dld-dan-daria-podcast` with the new markdown content provided
- Include the internal link to `/books` using markdown: `[Living Life with DLD book series](/books)`
- Update the excerpt to match

### 3. Update `BlogPost.tsx` for SEO
- Add a `<Helmet>` (or manual `document.title` + meta tag) to set the meta description dynamically from the `meta_description` column
- Update the image alt text to use a custom alt field or fallback to the SEO-friendly alt text

### 4. Add `featured_image_alt` column to `blog_posts` table
- New nullable text column for custom image alt text
- Set this post's alt to: "Family listening to Life with DLD Dan and Daria Podcast about Developmental Language Disorder"

### 5. Update `BlogPost.tsx` to use custom alt text
- Use `post.featured_image_alt || post.title` as the img alt attribute

### Summary of changes:
- **Migration**: Add `meta_description` and `featured_image_alt` columns, update this post's body, excerpt, meta_description, and featured_image_alt
- **Code**: Install `react-helmet-async`, update `BlogPost.tsx` to render meta description and use custom alt text
- **Content**: Full new article body with internal link to books page embedded as markdown

