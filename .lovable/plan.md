

## SEO Optimization + Website Analytics — Full Plan

### Part 1: SEO (Make the site 10/10 for search engines)

**A. Per-page meta tags (Helmet)**
Currently only BlogPost has `<Helmet>`. Every public page needs a unique `<title>` and `<meta name="description">` with DLD-targeted keywords. Pages to update (~15):
- Index, WhoWeServe, ForParents, ForTherapists, ForEducators, ForOrganizations
- Resources, Podcasts, FreeCourse, Downloadables, Blog
- Shop, Books, BulkOrders, WorkWithUs, AboutDLD, ContactUs, StoryBuilders

Example for ForParents:
```
<title>DLD Resources for Parents | Empowered DLD</title>
<meta name="description" content="Evidence-based resources and support for parents of children with Developmental Language Disorder (DLD). Books, downloadables, and community." />
```

**B. Dynamic sitemap.xml**
Create a `sitemap.xml` generator (Vite plugin or a static file listing all routes + dynamic blog slugs). This tells Google every page that exists.

**C. JSON-LD structured data**
- Homepage: `Organization` schema (name, logo, URL, social links)
- Blog posts: `Article` schema (headline, author, datePublished, image)
- Products/Books: `Product` schema (name, description, price)

**D. Canonical URLs**
Add `<link rel="canonical" href="...">` on every page to prevent duplicate content.

**E. Image alt text audit**
Review all hero/section images and ensure descriptive, keyword-rich alt text (e.g., "children with developmental language disorder reading together").

---

### Part 2: Website Analytics (Track visitors & performance)

**Option A: Google Analytics (recommended)**
Integrate Google Analytics 4 (GA4) by adding the tracking script to `index.html`. This gives you:
- Real-time visitor counts
- Page views by URL
- Traffic sources (Google, social, direct)
- User demographics and devices
- Which pages people visit most
- Bounce rates and session duration

You would create a free GA4 account at analytics.google.com, get a Measurement ID (G-XXXXXXX), and we add the snippet to `index.html`.

**Option B: Google Search Console (also recommended, free)**
Verifying your site with Google Search Console shows you:
- Which search queries bring people to your site
- Click-through rates for each page
- Whether your meta tags and sitemap are working
- Any indexing errors

**Option C: Built-in admin analytics enhancement**
Your existing `/admin/analytics` page already tracks signups, downloads, and revenue. We could add page-view tracking using a lightweight custom solution stored in your database, though GA4 is far more powerful for SEO-related metrics.

---

### Implementation Summary

| Task | What it does |
|---|---|
| Add `<Helmet>` to all 15+ pages | Unique titles & descriptions for Google |
| Generate `sitemap.xml` | Tells search engines about every page |
| Add JSON-LD to homepage + blog | Rich snippets in search results |
| Add canonical URLs | Prevents duplicate content penalties |
| Add GA4 tracking snippet | Full visitor analytics dashboard |
| Recommend Google Search Console | See search performance & indexing status |

**No database changes needed.** This is all frontend work plus one external service setup (GA4).

