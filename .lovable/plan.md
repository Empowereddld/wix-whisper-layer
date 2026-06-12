# Per-page SEO copy audit fixes

## Context

Every page already wraps `SEOHead` (which uses `react-helmet-async`) and `HelmetProvider` is mounted in `src/main.tsx`. The strings just don't match the new approved copy. View-source still shows the homepage defaults from `index.html` (Helmet rewrites them client-side after hydration), so we'll also verify the live DOM with the browser once edits land.

## Title + description updates

For each page below, replace the existing `title` and `description` props on `<SEOHead>` with the exact copy from the audit table. No other props change.

| File | Title | Description |
|---|---|---|
| `src/pages/Index.tsx` | Empowered DLD: Support for Developmental Language Disorder | Resources, books, and community for families and professionals supporting children with Developmental Language Disorder. Help every child find their words. |
| `src/pages/AboutDLD.tsx` | What Is DLD? A Plain Guide to Developmental Language Disorder | Developmental Language Disorder explained in plain language: what DLD is, the signs to look for, and how to support a child who struggles with words. |
| `src/pages/WhoWeServe.tsx` | Who We Serve: Families, Therapists, Educators & Schools | Empowered DLD supports parents, speech-language therapists, educators, and schools with practical tools for children with Developmental Language Disorder. |
| `src/pages/ForParents.tsx` | DLD Support for Parents \| Empowered DLD | If your child struggles to express themself, you are not alone. Find calm, practical support for parenting a child with Developmental Language Disorder. |
| `src/pages/ForEducators.tsx` | DLD Support & Resources for Educators \| Empowered DLD | Help students with Developmental Language Disorder thrive in your classroom. Practical DLD strategies, training, and resources for teachers and schools. |
| `src/pages/ForTherapists.tsx` | DLD Resources for Speech-Language Therapists | Evidence-informed books, tools, and materials for your DLD caseload, built in collaboration with speech-language pathologists and educators. |
| `src/pages/ForOrganizations.tsx` | DLD Partnerships for Organizations & Nonprofits | Partner with Empowered DLD to bring Developmental Language Disorder awareness, resources, and training to the communities and families you serve. |
| `src/pages/Resources.tsx` | Free DLD Resources & Tools \| Empowered DLD | Free, practical tools to support every child with Developmental Language Disorder, for parents, educators, and therapists. Explore the Resource Library. |
| `src/pages/Downloadables.tsx` | DLD Downloadables & Printables \| Empowered DLD | Printable guides, activities, and worksheets to support a child with Developmental Language Disorder at home, in the classroom, and in therapy. |
| `src/pages/FreeCourse.tsx` | Free DLD Course for Parents & Educators | A free course on Developmental Language Disorder: learn simple, evidence-informed ways to support a child's language and confidence, step by step. |
| `src/pages/Podcasts.tsx` | Life with DLD: The Dan & Daria Podcast | Real stories and practical support for Developmental Language Disorder. Listen to Life with DLD: The Dan and Daria Podcast from Empowered DLD. |
| `src/pages/Shop.tsx` | Shop DLD Books & Resources \| Empowered DLD | Books and resources that make a real difference for children with Developmental Language Disorder. Created by an educator and a speech-language pathologist. |
| `src/pages/Books.tsx` | Living Life with DLD Book Series \| Empowered DLD | The Living Life with DLD book series helps children understand DLD, feel confident, and know they are not alone. A warm entry point for every family. |
| `src/pages/WorkWithUs.tsx` | Work With Us: DLD Training & Speaking | Bring DLD expertise to your school, clinic, or organization. Book Empowered DLD for training, speaking, and consulting on Developmental Language Disorder. |
| `src/pages/ContactUs.tsx` | Contact Us \| Empowered DLD | Questions about Developmental Language Disorder, our books, or working together? Get in touch with the Empowered DLD team. We would love to hear from you. |

## Noindex on legal pages

Add `noindex` prop to `<SEOHead>` on these three (titles updated too, descriptions retained as harmless fallback):

- `src/pages/PrivacyPolicy.tsx` — title: `Privacy Policy | Empowered DLD`, add `noindex`
- `src/pages/TermsAndConditions.tsx` — title: `Terms & Conditions | Empowered DLD`, add `noindex`
- `src/pages/Disclaimer.tsx` — title: `Disclaimer | Empowered DLD`, add `noindex`

`SEOHead` already supports `noindex` (emits `<meta name="robots" content="noindex, nofollow">`).

## Contact page H1 fix

`src/components/ContactSection.tsx` currently uses `<h2>Let's Start a Conversation</h2>` and the page has no H1. Promote that heading to `<h1>` (keep the same classes and copy). The page's only H1, matching the new "Contact Us" title intent.

## Verification

After edits land, open the preview with the browser tool and check `document.title` and the `meta[name="description"]` content on a couple of routes (`/`, `/about-dld`, `/contact`, `/privacy-policy`) to confirm Helmet is mutating the live DOM and that `/privacy-policy` has the `robots` meta set to `noindex, nofollow`.

## Out of scope

- `index.html` static fallback tags stay as-is (they're only what social-preview crawlers see; per-page Helmet replaces them for browsers and JS-executing crawlers).
- No changes to canonical URLs, OG images, breadcrumbs, or JSON-LD.
- No changes to other pages (Blog, BulkOrders, EducationalApp, hub/admin/auth routes).
