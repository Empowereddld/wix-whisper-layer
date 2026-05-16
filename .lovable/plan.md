# Phase 8: SEO tuning for DLD keywords

Copy and metadata edits only. No layout, routing, sitemap, or logic changes.

## 1. Homepage metadata (`src/pages/Index.tsx`)

- **Title** → `Developmental Language Disorder Resources | Empowered DLD`
- **Description** → `Evidence-based resources, books, and community for families and professionals supporting people with Developmental Language Disorder (DLD). Empowered DLD does not provide diagnosis.`

## 2. Homepage hero (`src/components/HeroSection.tsx`)

- Eyebrow: **unchanged** (`SUPPORTING CHILDREN WITH DLD`)
- H1: **unchanged** (`Every child with DLD deserves to feel seen.`)
- Subheading → `We partner with families, educators, clinicians, and organizations to bring clear, practical resources about Developmental Language Disorder into homes, schools, and communities.`

## 3. About DLD metadata (`src/pages/AboutDLD.tsx`)

- **Title** → `What is DLD? Symptoms, Signs & Diagnosis | Empowered DLD`
- **Description** → `Learn about Developmental Language Disorder (DLD): signs, symptoms, and how DLD is diagnosed. Empowered DLD shares resources and education, not clinical diagnosis.`

Verify H1 in `AboutDLDHero` reads naturally as "What is Developmental Language Disorder (DLD)?" (read-only check; edit only if missing the full phrase).

## 4. FAQ section (`src/components/DLDFaqSection.tsx`)

Rewrite question wording so target search phrases appear as `<h3>` triggers. Keep existing answers.

- `What does DLD look like?` → `What are the signs of DLD?`

Add three new FAQs (site voice, "people" terminology, no "free", no em dashes):

- **What are the symptoms of DLD?** — vocabulary, following instructions, expressing ideas, organizing language in speech and writing.
- **How is DLD diagnosed?** — explains DLD is diagnosed by a qualified speech-language pathologist through language assessment; clarifies Empowered DLD provides education and resources, not diagnosis.
- **What is the difference between DLD and autism?** — short explainer with a link to `/blog/autism-vs-dld-understand-the-difference` (confirmed) using the existing `link` pattern from the first FAQ.

The `FAQPage` JSON-LD on About DLD picks up new entries automatically via the exported `faqs` array.

## Verification

- `SEOHead` props on Index and AboutDLD remain valid.
- `FAQPage` JSON-LD still maps from `faqs` array — no manual schema edits.
- No canonical / Open Graph / sitemap / routing / layout changes.
- FAQ link slug confirmed: `/blog/autism-vs-dld-understand-the-difference`.
- Terminology: "people with DLD" in new copy; hero copy stays child-focused per direction.
- No em dashes in new copy.
