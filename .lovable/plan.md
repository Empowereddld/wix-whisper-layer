# Phase 3: SEO Optimization (Review-First)

Scan finished. Here's the full list of what the scanner flagged, plus your original Phase 3 keyword work. **I will show you the exact before/after for each item in chat and wait for your "go" before editing anything.**

## A. Scanner findings (6 items)

1. **Generic link text "LEARN MORE"** — `ChoosePathSection.tsx`, `HowWeSupportTherapistsSection.tsx`. Replace with descriptive text like "Learn more about DLD for parents."
2. **Short logo alt text** — `Header.tsx`, `Footer.tsx`. Change to "Empowered DLD" or "Empowered Developmental Language Disorder."
3. **Homepage heading structure** — Add `<h2>` to `SupportSection` and `BookShowcase` in `Index.tsx`; check no heading levels are skipped.
4. **Titles/descriptions too long** — Books page title >60 chars; Home + About DLD meta descriptions >160 chars. Trim while keeping keywords.
5. **robots.txt sitemap URL** — Points at `www.empowereddld.com`; change to `https://empowereddld.com/sitemap.xml`.
6. **sitemap.xml** — Same host issue; also missing entries for `/signup`, `/storypros/dashboard`, `/storypros/claim-founder`, `/storypros/verify`, `/storypros/verified`.

(Lighthouse performance + accessibility findings apply to the published build; I'll address them last so we can republish once.)

## B. Keyword optimizations (your original Phase 3 list)

7. **Autism vs DLD blog** → target `dld vs autism` (SEO title, meta, H1, light heading tweaks; body untouched).
8. **DLD as an Adult blog** → target `DLD in adults` (same treatment).
9. **Language Impact Checklist page** → add `DLD checklist` and `signs of DLD` to SEO title, meta, H1/subhead.
10. **`/shop/books` Product schema** → add JSON-LD Product structured data via SEOHead.

## Workflow for every item

1. I read the current file.
2. I post the **exact diff** in chat (current → proposed).
3. You reply "go" / "change X" / "skip."
4. I edit and confirm.

## Order I suggest

Quick housekeeping first (fast, no judgment calls), then keyword work:
- Batch 1: #5, #6 (robots + sitemap) — I'll show the exact new file contents.
- Batch 2: #1, #2 (link/alt text swaps).
- Batch 3: #4 (title/description trims).
- Batch 4: #3 (heading structure).
- Batch 5: #7, #8, #9 (keyword tuning, one at a time).
- Batch 6: #10 (Product schema).

## Out of scope

Blog body content, CTAs, routing, styling, business logic, "free"-language rewrites.

Approve this plan and I'll start with Batch 1 by posting the proposed robots.txt + sitemap changes for your sign-off.
