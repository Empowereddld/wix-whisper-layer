

# Blog Section: Migration + Public Pages

## What we're building

1. **Public blog listing page** at `/resources/blog` — a premium, editorial-style grid of blog posts
2. **Individual blog post page** at `/resources/blog/:slug` — clean reading experience
3. **Bulk migration** of all 12 existing blog posts from your WordPress site into the database via a backend function
4. **Database updates** to support public reading and category filtering

## Blog posts to migrate (12 total)

| # | Title | Categories |
|---|-------|-----------|
| 1 | Life with DLD: The Dan and Daria Podcast | Awareness, DLD, Kids, Parenting, Skills |
| 2 | Our Top 3 Books for Supporting Kids with DLD | Awareness, DLD, Kids, Parenting |
| 3 | Autism vs DLD: Understand The Difference | Awareness, DLD |
| 4 | DLD as an Adult | DLD |
| 5 | Addressing Inequities in DLD Therapy | DLD |
| 6 | Understanding Your Child's Development Team | Academics, Awareness, DLD, Parenting |
| 7 | Finding Peace as a Parent of a Child with DLD | Parenting |
| 8 | Empowering Your Child Through Reflexive Questioning | Academics, Parenting |
| 9 | Executive Function and Its Relationship to DLD | DLD, Parenting |
| 10 | Could my Child Have DLD? | Awareness, DLD, Parenting |
| 11 | Navigating the Holidays with a Communication Impairment | Parenting |
| 12 | What is Developmental Language Disorder (DLD)? | Awareness, DLD |

## Design approach

**Blog listing page (`/resources/blog`)**
- Hero banner with "Blog" title, subtle lavender background, matching site aesthetic
- Category filter pills (All, Awareness, DLD, Parenting, Academics, Kids, Skills)
- Responsive card grid: featured image with rounded-xl corners, category tags, title, excerpt (2 lines), date
- Cards use the premium-card hover pattern already in the codebase
- 1100px max-width container, consistent with all other pages

**Individual post page (`/resources/blog/:slug`)**
- Clean reading layout: featured image full-width within container, title, date, category tags
- Body rendered as markdown using `react-markdown` + `remark-gfm`
- Max prose width (~700px) for comfortable reading
- Back-to-blog link at top

## Technical details

### Database changes
1. **Add columns** to `blog_posts`: `excerpt` (text), `categories` (text array) for filtering
2. **Add RLS policy**: allow public (anon + authenticated) to SELECT published posts
3. **Add `excerpt` column** so we can show short previews on the listing

### Migration strategy
- Create a backend function that scrapes each of the 12 blog post URLs using fetch, extracts the markdown content, and inserts into `blog_posts`
- Featured images will reference the original WordPress URLs (no re-hosting needed initially)
- Categories extracted from the scraped data

### Frontend files
- `src/pages/Blog.tsx` — listing page
- `src/pages/BlogPost.tsx` — individual post page
- `src/components/BlogHero.tsx` — hero section
- `src/components/BlogPostCard.tsx` — card component
- Update `src/components/Header.tsx` — change Blogs link from `#blogs` to `/resources/blog`
- Update `src/App.tsx` — add routes `/resources/blog` and `/resources/blog/:slug`
- Install `react-markdown` and `remark-gfm` for rendering post bodies

### New dependency
- `react-markdown` + `remark-gfm` for rendering blog post body content

