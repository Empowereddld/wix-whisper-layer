
# New page: /why-empowered-dld (v2, final)

A dedicated positioning page that explains what makes Empowered DLD different: story-led, practical, children-first, lifespan-aware, built by an SLP and an elementary educator. Not a replacement for a future /about page.

## Page structure

1. **Hero** — eyebrow "WHY EMPOWERED DLD", H1: *"Practical support for children with DLD and the adults around them."* Short intro paragraph in the warm homepage voice.
2. **What we are** — 2–3 short paragraphs describing the story-led support system: children's books, downloadable resources, animated podcast episodes, a free video course, community, professional training, with upcoming music.
3. **How we're different** — respectful framing block. Lead line: *"Awareness matters. So does knowing what to do on Monday morning."* Three short cards or rows:
   - Story-led and evidence-informed
   - Practical tools for home, therapy, and the classroom
   - Children-first, lifespan-aware
   No organization is named or negatively compared. The message is that awareness matters and Empowered DLD helps families and professionals take the next practical step.
4. **Built by an SLP and an elementary educator** — one paragraph each for Jinean Whitley (SLP; clinical expertise in child language, DLD, literacy, parent education, school-based advocacy; brief family connection line, not overstated, never says parent of a child with DLD) and Camesha Russell (elementary educator; classroom experience, literacy instruction). Reuse existing founder imagery where available.
5. **What we make** — three link cards into existing live routes:
   - Books → `/shop/books` (verified)
   - Resource Hub → `/hub` (verified, protected route; card still links there — logged-out users hit the Hub's own login flow)
   - Work With Us / training → `/work-with-us` (verified)
6. **Lifespan sentence** — closing line: *"Our work begins with children while recognizing that DLD is lifelong."*
7. **CTA band** — reuse the existing ContactSection or a lightweight CTA to `/contact`.

## Files

- **New:** `src/pages/WhyEmpoweredDLD.tsx` — assembles the sections using existing UI primitives, `Header`, `Footer`, `SEOHead`. Eagerly imported in `App.tsx` (matches other main public pages).
- **Edit:** `src/App.tsx` — add `import WhyEmpoweredDLD from "./pages/WhyEmpoweredDLD"` and `<Route path="/why-empowered-dld" element={<WhyEmpoweredDLD />} />` above the catch-all.
- **Edit:** `src/components/Footer.tsx` — add a "Why Empowered DLD" link in the appropriate column.
- **Edit:** `src/components/TrustSection.tsx` — add a small text link under the founder bios: "Learn more about why we built Empowered DLD →" pointing to `/why-empowered-dld`. No layout change.
- **Edit:** `public/sitemap.xml` — add `<url><loc>https://empowereddld.com/why-empowered-dld</loc></url>`.
- **Edit:** `public/llms.txt` — file exists, so add a one-line entry pointing crawlers at the new page.

## SEO

- `<title>`: "Why Empowered DLD | Practical Support for Children with DLD"
- Meta description: *"Empowered DLD is a story-led, practical support system for children with Developmental Language Disorder and the parents, educators, and speech-language pathologists (SLPs) who support them."*
- Canonical: `/why-empowered-dld` via existing `SEOHead`.
- Breadcrumbs prop: Home → Why Empowered DLD.
- No new schema types beyond what `SEOHead` already emits.

## Voice guardrails

- Keep "child / children."
- No em dashes.
- No new "free" language beyond the existing "free video course."
- No TV show or pilot mention.
- "Upcoming music" mentioned once, in the "What we are" section only.
- Never claim either founder is a parent of a child with DLD.
- Do not name or negatively compare RADLD, DLD and Me, NIH, ASHA, or any other organization. Contrast is category-level and respectful.
- Use "speech-language pathologists" (spelled out) or "speech-language pathologists (SLPs)" in prose and meta.

## Out of scope

- A separate `/about` page (kept free for a future dedicated founders/story page).
- Changes to the homepage hero, SupportSection, or CreatedByExperts copy (already done in v3 rewrite).
- Cross-links from For Parents / SLPs / Educators pages.
- Header nav changes.

## Verification

- Load `/why-empowered-dld` and screenshot hero, contrast, founders, link cards.
- Confirm the footer link and the TrustSection link both navigate correctly.
- Confirm `<title>`, meta description, and canonical render on the new route.
- Confirm sitemap.xml includes the new URL.
