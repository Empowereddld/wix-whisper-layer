
# SEO + AEO Upgrade Plan — Empowered DLD

The Lovable SEO/AEO feature is a strong fit. Empowered DLD already has solid basics (SEOHead with Helmet, sitemap.xml, robots.txt, JSON-LD on some pages), so this plan focuses on closing gaps, adding AI-search visibility, and cleaning up rebrand leftovers. Broken into 7 phases so we can ship and verify each one before moving on.

## Current state (quick audit)

- ✅ `index.html` has clean title/description/OG/Twitter tags
- ✅ `SEOHead` component using `react-helmet-async` (canonical, OG, JSON-LD, breadcrumbs)
- ✅ `public/sitemap.xml` (21 routes, hand-edited, static lastmod 2026-03-19)
- ✅ `public/robots.txt`
- ⚠️ No `llms.txt` (AI crawler discovery file)
- ⚠️ No Organization / WebSite JSON-LD in `index.html`
- ⚠️ ~20+ public pages don't import `SEOHead` (rely on static `index.html` only)
- ⚠️ Sitemap is hand-edited and missing dynamic blog posts + new routes (`/storypros`, `/storypros/dashboard`, `/early-supporters`, `/educational-app`, `/resources/language-impact-checklist`, etc.)
- ⚠️ Default OG image points at a Lovable preview R2 URL, not a branded asset
- ⚠️ Rebrand leftover: need to sweep for "Empowered DLD Parenting" / "StoryBuilders" in indexable copy, alt text, JSON-LD, and meta

---

## Phase 1 — Rebrand cleanup (quick win, ship first)

Goal: stop the old name from appearing anywhere a crawler can read.

- Sweep code, copy, alt text, meta descriptions, JSON-LD, and email templates for:
  - "Empowered DLD Parenting" → "Empowered DLD"
  - "StoryBuilders" (in user-facing copy) → "Story Pros" (per existing memory)
- Add a Google Search Console removal request guidance note for the old title
- Add 301-style canonical reinforcement on `/storypros` so old `/storybuilders` links consolidate

## Phase 2 — Sitewide SEO foundations

- Add **Organization** + **WebSite** JSON-LD to `index.html` (sitewide identity for Google/AI)
- Replace the R2 preview default OG image in `SEOHead` with a branded asset on the empowereddld.com domain
- Audit and tighten the homepage `<title>` (under 60 chars, primary keyword first) and meta description (under 160)
- Add `<meta name="theme-color">` and verify `lang="en"` is correct

## Phase 3 — Per-route SEO coverage

Add `SEOHead` to every public page that's missing it. From the audit, these include:
- `Index.tsx` (homepage — verify it has unique tags vs index.html)
- `AboutDLD.tsx`, `Resources.tsx`, `Blog.tsx`, `Shop.tsx`
- `WorkWithUs.tsx`, `Podcasts.tsx`, `StoryBuilders.tsx`
- Any other public route surfaced during the sweep

Each page gets: unique title, description, canonical, OG tags, and where appropriate JSON-LD (Article for blog posts, FAQPage for FAQ sections, BreadcrumbList for nested routes).

## Phase 4 — Sitemap automation

- Replace hand-edited `public/sitemap.xml` with `scripts/generate-sitemap.ts` (per Lovable convention)
- Wire `predev` + `prebuild` npm scripts so it regenerates automatically
- Pull blog posts from Supabase (`blog_posts` where `published = true`) so new posts auto-appear
- Include all current static routes + Story Pros, Early Supporters, Educational App, Language Impact Checklist
- Set real `lastmod` from DB rows where applicable

## Phase 5 — AEO (AI search) layer

This is the new piece from the Lovable feature you screenshotted.

- Add `public/llms.txt` describing Empowered DLD with a flat link list to key pages (Home, About DLD, For Parents/Therapists/Educators/Organizations, Resources, Blog top posts, Story Pros, Shop)
- Expand JSON-LD coverage:
  - **FAQPage** schema on `/about-dld` and any FAQ sections (DLD FAQ, Course FAQ)
  - **Article** schema on every blog post (already partially done — verify)
  - **Product** schema on book/shop pages
  - **Course** schema on `/resources/free-course`
- Add concise, AI-friendly answer paragraphs near the top of high-intent pages ("What is DLD?", "Who should screen for DLD?") so LLMs can extract clean answers

## Phase 6 — Content & keyword pass

- Run Semrush domain analysis on `empowereddld.com` to baseline traffic + ranking keywords
- Identify 5–10 highest-opportunity DLD-related keywords (low difficulty, real volume)
- Tune homepage, About DLD, and For-Parents/Therapists titles/H1s/intros against those keywords
- Keyword-gap check vs comparable advocacy / SLP sites

## Phase 7 — Verification & monitoring

- Verify the site in Google Search Console (using the META tag flow)
- Submit the new sitemap
- Run Lovable's SEO scan + Semrush trend report
- Document a monthly cadence: rerun scan, check rankings, refresh blog `lastmod`

---

## Technical notes

- Stack already supports this: Vite + react-router-dom + react-helmet-async + Supabase
- No new dependencies expected (sitemap generator uses `tsx`, already available)
- All new JSON-LD goes through existing `SEOHead` component — no new abstraction needed
- llms.txt is a static file at `public/llms.txt` (served at `/llms.txt`)
- Brand sweep is purely text changes; no schema or auth impact

## Suggested sequencing

Ship Phase 1 + 2 together (small, high impact, fixes the rebrand bleed). Then 3 and 4 in parallel. Then 5 (AEO). Then 6–7 as ongoing work after the structural lift is done.

**Approve and I'll start with Phase 1 (rebrand cleanup) — or tell me which phase to prioritize first.**
