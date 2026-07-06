
# Homepage + About/Founders rewrite — source of truth aligned (v3, final)

Goal: make the site say what Empowered DLD actually is on the two surfaces that matter most for humans and search/LLM crawlers — the homepage and the founders/about block.

No layout, color, image, route, or backend changes. Copy + metadata only.

## Positioning

- **SEO / meta / About framing:** "a practical, story-led support ecosystem for children with Developmental Language Disorder and the adults who care for, teach, and support them."
- **Visible homepage (warmer):** "Story-led books, resources, and training that help children with DLD feel seen and help the adults around them know what to do next."
- **Voice frame everywhere:** children-first, lifespan-aware. Keep the words *child* and *children*.

## What changes

### 1. Homepage hero — `src/components/HeroSection.tsx`
- Eyebrow: `SUPPORTING CHILDREN WITH DLD` → `PRACTICAL SUPPORT FOR DLD`
- H1: keep `Every child with DLD deserves to feel seen.`
- Subhead:
  > "Story-led books, resources, and training that help children with Developmental Language Disorder feel seen, and help the parents, educators, and speech-language pathologists around them know what to do next."
- CTA unchanged.

### 2. "Why Empowered DLD" block — `src/components/TrustSection.tsx`
Rewrite body copy to the approved founder facts. Keep layout, images, CTA, and alt text.

- **Jinean Whitley, Speech-Language Pathologist** — clinical expertise in child language, DLD, literacy, parent education, and school-based advocacy. Include one short line noting a family connection to DLD; do not lead with it and do not overemphasize. Do NOT say she is a parent of a child with DLD.
- **Camesha Russell, elementary educator** — classroom experience, child development, literacy instruction, and a deep understanding of what support looks like in real classrooms.
- End the block with the lifespan sentence: > "Our work begins with children while recognizing that DLD is lifelong."

### 3. "Created by Experts" block — `src/components/CreatedByExpertsSection.tsx`  *(accuracy + warmth fix)*
- Eyebrow: `CREATED BY EXPERTS` → `CREATED BY A TEACHER AND A SPEECH-LANGUAGE PATHOLOGIST`
- H2: `Built by an SLP and a Teacher Who Understand What Families Need` → `Created by an SLP and an educator who know what families need`
- Body: "The Communicate with Confidence course was created by Camesha Russell, an elementary educator and co-founder of Empowered DLD, and Jinean Whitley, a Speech-Language Pathologist and co-founder of Empowered DLD."
- Keep the "real-world classroom experience and clinical expertise" line, CTA, and image.
- Remove "two moms" and remove "Jinean Cheng" entirely.

### 4. "How we support" intro — `src/components/SupportSection.tsx`
- H2 stays: `How we support children with DLD`
- Intro paragraph:
  > "Empowered DLD brings together children's books, downloadable resources, animated podcast episodes, a free video course, community, and professional training, with upcoming music, so children with DLD understand how their brains work and the adults around them have practical tools for home, therapy, and the classroom."
- Cards unchanged. No mention of TV show or pilot.

### 5. Homepage SEO metadata — `src/pages/Index.tsx`
- `<title>`: `Empowered DLD | Support for Children with DLD`
- `<meta description>`:
  > "A practical, story-led support system for children with Developmental Language Disorder and the parents, educators, and SLPs who support them."
- Update the `Organization` JSON-LD `description` to match the meta description.
- No route/canonical/og:image changes.

### 6. Voice guardrails
- Keep "child / children."
- No em dashes.
- No "free" language added beyond the existing "free video course" (accurate).
- No TV show or pilot mention anywhere.
- "Upcoming music" mentioned once, in the SupportSection intro only.
- Never claim either founder is a parent of a child with DLD.
- "Ecosystem" used in SEO/meta/About framing only; not surfaced in visible hero/support copy.

## Out of scope
- New dedicated `/about` or `/why-empowered-dld` page.
- Rewriting About DLD, Who We Serve, For Parents / SLPs / Educators pages.
- New pillar/FAQ pages, `MedicalCondition` schema, blog schema.
- Any imagery, layout, or component structural changes.

## Verification after implementation
- Re-read the four edited components + `Index.tsx` to confirm no "Jinean Cheng," "two moms," or implication that a founder is a parent of a child with DLD remains.
- Preview `/`, screenshot hero, TrustSection, SupportSection intro, and CreatedByExperts.
- Confirm `<title>` and meta description render on `/`.

## Technical notes
- All edits are in JSX text nodes of five files. No new files, no dependencies, no route changes.
- `SEOHead` already handles per-route title/description via `react-helmet-async`; only its props change.
- `CreatedByExpertsSection` is used on the Free Course page; rewritten copy still fits that context.
- Keep paragraph counts close to current so `TrustSection` image grid does not reflow.
