

# Add Blog Styling Enhancements + CTAs

## Overview
Add 6 CSS styling enhancements to `.blog-content` and a CTA section at the bottom of every blog post. The CTAs will rotate between contextually relevant destinations including the Dan and Daria Podcast on YouTube.

## 1. CSS Enhancements in `src/index.css`

Add these styles to the existing `.blog-content` block:

- **Callout Boxes** — Blockquotes starting with bold openers like `**Did you know?**` or `**Tip:**` get a distinct lavender background with a purple left border and non-italic text
- **Pull Quotes** — Blockquotes containing only bold text (`> **"quote"**`) render larger (20px), centered, with decorative top/bottom borders
- **Tables** — Full styling: bordered cells, header row with deep-purple background, alternating row striping with secondary color
- **Drop Caps** — `.blog-content > p:first-of-type::first-letter` gets a large (3.2em) float-left decorative letter in primary color
- **Numbered Steps** — `ol` gets `counter-reset`, `li` gets large primary-colored counter numbers via `::before`
- **Inline Code** — `code` gets a subtle secondary background with small rounded padding

## 2. Blog Post CTA — `src/components/BlogPostCTA.tsx`

New component rendering **two CTA cards** at the bottom of every blog post, chosen contextually based on the post's categories:

| CTA | Description | Link | Show When |
|-----|------------|------|-----------|
| **Watch the Podcast** | "See Dan and Daria share real stories about life with DLD" | YouTube playlist link | Always (one of two) |
| **Explore Our Books** | "Stories that help kids with DLD feel seen and understood" | `/books` | Categories include Kids, Parenting, Awareness |
| **Take the Free Course** | "Learn strategies to support your child with DLD" | `/resources/free-course` | Categories include DLD, Parenting, Academics |
| **Join the Waitlist** | "Get early access to our app — tools built for families navigating DLD" | `/storybuilders` | Default fallback |
| **Browse Resources** | "Downloadable tools for parents, therapists, and educators" | `/resources` | Categories include Skills, Academics |

The component will pick the **Podcast CTA** as the primary card, then select one secondary CTA based on post categories.

**Design**: A section below the blog body with a horizontal divider, then two side-by-side cards (stacked on mobile) using the site's deep-purple and lavender palette. Each card has a heading, one-line description, and a button.

## 3. Integration in `src/pages/BlogPost.tsx`

- Import and render `<BlogPostCTA categories={post.categories} />` after the `blog-content` div, inside the `<article>` tag
- The podcast CTA links to: `https://www.youtube.com/watch?v=FEA22DA7yn0&list=PLzfiOYFA1If6abH3LUNdxKPOAuOgkjZN5`
- The waitlist CTA links to `/storybuilders` (the app waitlist, not the resource hub)

## Files Changed
1. `src/index.css` — Add 6 new style blocks inside `.blog-content`
2. `src/components/BlogPostCTA.tsx` — New component
3. `src/pages/BlogPost.tsx` — Import and render CTA

