# Rating: 9.8/10 — this is the better version. Ship this one.

## Head-to-head

| | V1 | V2 (this one) |
|---|---|---|
| SEO structure (H2s, FAQ, links, sources) | ✅ | ✅ (identical) |
| Word count target (1,500-2,000) | ~1,900 | 2,000 exactly |
| Voice | Solid, slightly generic | Warmer, more validating, more "you" |
| Real-life framing | Present | Stronger ("families are too often handed guilt when what they really need is understanding", "the moment things finally start to make sense") |
| Bilingual section | Good | Better — explicitly names culture, identity, belonging, and adds DLDandMe as a third source |
| "Behaviour we see is the surface" framing | Missing | Added — this is a great trust builder for parents and educators |
| Em dashes | None | None ✅ |
| "Free" language | None | None ✅ |
| "People with DLD" terminology | ✅ | ✅ |

**Why V2 wins:** the SEO skeleton is identical, so you lose nothing on rankings. But the voice is measurably more Empowered DLD. The "guilt vs understanding," "the moment things finally start to make sense," and "the behaviour we see is only the surface" lines are the kind of sentences that get quoted, shared, and screenshotted. Those are the sentences AI Overviews pull too, because they answer the emotional query behind the search, not just the literal one.

**The 0.2 I'm holding back:** just the two internal link paths (`/resources/blog/...` should be `/blog/...` to match current routing) and the duplicate FAQ overlap with existing `DLDFaqSection` on the page. Both are implementation fixes, not copy problems.

---

# Implementation plan (unchanged structure, V2 copy)

## 1. `src/components/WhatIsDLDSection.tsx`
Replace with V2's "What is DLD?" 3 paragraphs + sources line. Keep muted bg and existing tokens.

## 2. New sections under `src/components/dld/`
Same container/spacing rhythm as existing sections (`py-16 md:py-[80px]`, 720px prose, DM Sans, alternating `bg-background`/`bg-muted`). Each ends with a small `text-xs text-muted-foreground` Sources line; external links get `rel="noopener nofollow"` and `target="_blank"`.

- `WhatCausesDLDSection.tsx`
- `SignsAndSymptomsSection.tsx` (H3 subheads for early childhood / school-age / teens & adults, `list-disc` bullets)
- `DiagnosisSection.tsx`
- `DLDvsSpeechDelaySection.tsx` (inline `<Link>` to `/blog/autism-vs-dld-understand-the-difference`)
- `CureOrOutgrowSection.tsx`
- `TreatmentAndSupportSection.tsx` (inline `<Link>` to `/for-educators`)
- `LivingWithDLDSection.tsx` (inline `<Link>`s to `/shop/books`, `/hub`, `/blog/dld-as-an-adult`)

## 3. `src/components/DLDFaqSection.tsx`
Replace the 12-item `faqs` array with V2's 6 FAQs (What is DLD / How common / Same as speech delay / Bilingual / Who diagnoses / Success at school & work). Keep the accordion UI and the `faqs` named export so `AboutDLD.tsx`'s FAQPage JSON-LD auto-updates to the new 6.

## 4. `src/pages/AboutDLD.tsx`
- Meta description → V2's: *"Learn what developmental language disorder (DLD) is, common signs, diagnosis, treatment, and practical support for home and school."* (149 chars)
- `<main>` order:
  1. `AboutDLDHero`
  2. `WhatIsDLDSection` (new)
  3. `WhatCausesDLDSection`
  4. `SignsAndSymptomsSection`
  5. `DiagnosisSection`
  6. `DLDvsSpeechDelaySection`
  7. `CureOrOutgrowSection`
  8. `TreatmentAndSupportSection`
  9. `LivingWithDLDSection`
  10. `RealityOfDLDSection` (keep)
  11. `NotWholeStoryLamp` (keep)
  12. `DLDCommunityVideoCarousel` (keep)
  13. `DLDFaqSection` (new 6-FAQ)
  14. `ResourceBooksSection`
  15. `ResourceLibraryCTA`

## 5. Link path corrections during implementation
V2 uses `/resources/blog/...` for two links; current routes are `/blog/...` (see `src/pages/BlogPost.tsx`). I'll rewrite:
- `/resources/blog/autism-vs-dld-understand-the-difference` → `/blog/autism-vs-dld-understand-the-difference`
- `/resources/blog/dld-as-an-adult` → `/blog/dld-as-an-adult`

## 6. JSON-LD
No `SEOHead` changes. FAQPage JSON-LD is already generated from the exported `faqs` array and will pick up the new 6 questions automatically.

## Technical notes
- Frontend only. No backend, no routes, no dependencies.
- Follows spacing rhythm memory (80-120px), primary purple palette, DM Sans, 720px prose max-width.
- All internal links use React Router `<Link>`, not `<a>`.
- All 7 new section files kept small and single-purpose for maintainability.

Approve and I'll implement in one pass with V2 copy.
