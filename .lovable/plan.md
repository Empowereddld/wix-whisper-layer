## Update /about-dld with Jinean's revised copy

Replace the body copy in each existing section component with the new wording provided. Keep all layout, styling, source-link markup, internal `Link` targets, and section order exactly as-is. Sources lines stay as clickable links using the same URLs already in each file; only the source labels change where Jinean's list differs (e.g. add "Bishop et al (2017)" and "McGregor, 2020" as plain text next to the existing linked sources in the intro section).

### Files to edit (copy swaps only, no structural changes)

1. **src/components/WhatIsDLDSection.tsx** — replace the three paragraphs with Jinean's "What is DLD" text. Update sources line to: RADLD, NIDCD, Bishop et al (2017), McGregor 2020 (first two remain links to existing URLs; the two citations render as plain text).
2. **src/components/dld/WhatCausesDLDSection.tsx** — replace paragraphs 1–3 with Jinean's shorter "What causes DLD" version (drops the standalone bilingualism paragraph). Sources line unchanged.
3. **src/components/dld/SignsAndSymptomsSection.tsx** — replace with Jinean's early-childhood / school-age / teens-and-adults bulleted structure plus the closing "hidden…language demand" paragraphs. (Need to view this file during build to preserve its wrapper markup.)
4. **src/components/dld/DiagnosisSection.tsx** — replace with Jinean's four-paragraph diagnosis copy. (View during build.)
5. **src/components/dld/DLDvsSpeechDelaySection.tsx** — replace paragraphs with Jinean's version that adds language-delay distinction; keep the existing `Link` to `/blog/autism-vs-dld-understand-the-difference` and closing summary paragraph reworded per Jinean.
6. **src/components/dld/CureOrOutgrowSection.tsx** — copy is essentially identical to current; only re-verify wording matches Jinean's version and adjust any small diffs.
7. **src/components/dld/TreatmentAndSupportSection.tsx** — apply Jinean's tweaks: add "In Canada a child could also get an IEP" sentence, soften parent-strategies paragraph ("With practice, adults can learn how to find the balance…"), keep `/for-educators` Link and sources line.
8. **src/components/dld/LivingWithDLDSection.tsx** — replace with Jinean's new "Living with DLD" copy including the closing paragraphs that CTA to Our Books and the Empowered DLD Resource Library. Keep existing internal links; if the component currently links elsewhere, point "Our Books" → `/books` and "Empowered DLD Resource Library" → `/hub` (matches Core CTA memory). View file during build to confirm.

### Out of scope
- No changes to `AboutDLDHero`, `RealityOfDLDSection`, `NotWholeStoryLamp`, `DLDCommunityVideoCarousel`, `DLDFaqSection`, `ResourceBooksSection`, `ResourceLibraryCTA`, or `AboutDLD.tsx` page composition.
- No new sections, no new routes, no SEO/JSON-LD changes.
- Em dashes stay banned per project memory; Jinean's copy already uses commas.
