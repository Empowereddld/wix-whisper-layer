
# Dan and the Paper Airplane — Preview Landing Page

A self-contained landing page at `/preview/dan-and-the-paper-airplane`, built from the supplied HTML blueprint exactly. UK SLT audience, two conversion goals: Amazon UK click and mailto to hello@empowereddld.com (both with UTM pass-through).

## Assets

Copy uploaded images to `src/assets/preview/dan-airplane/`:
- `book-cover.jpg`
- `lifestyle-boy-reading.jpg` (from `download_2-4.webp`)
- `lifestyle-classroom.jpg` (from `image-gen_68-4.webp`)
- `scene1-instructions-left.jpg` / `scene1-instructions-right.jpg`
- `scene2-dld-explained-left.jpg` / `scene2-dld-explained-right.jpg`
- `scene3-one-step-left.jpg` / `scene3-one-step-right.jpg`
- `scene4-glossary.jpg` (uses scene4-glossary.jpg from uploads)

## Files

- **Create** `src/pages/preview/DanAndThePaperAirplane.tsx` — the page. Single-file implementation: minimal logo-only header (top-left, links to `/`), all sections from the HTML in order, minimal footer (logo, © 2026 Empowered DLD, Privacy, Terms). Inline `<style>` block with the exact CSS from the HTML so visuals match pixel-for-pixel; load Poppins + Inter via `<link>` injected through a `useEffect` head append (or a SEOHead pass).
- **Create** `src/components/preview/MinimalHeader.tsx` and `src/components/preview/MinimalFooter.tsx` — only used on this page, so they live under `preview/`.
- **Edit** `src/App.tsx` — add route `<Route path="/preview/dan-and-the-paper-airplane" element={<DanAndThePaperAirplane />} />` (lazy-loaded) above the catch-all.
- **Edit** `public/robots.txt` — add `Disallow: /preview/` so the preview tree is excluded from crawling (page itself also sets `noindex, follow`).

## Page structure (from the HTML, copy verbatim)

1. Minimal header — Empowered DLD logo (links `/`), nothing else.
2. Hero — eyebrow pill, h1 with italic title, subtitle, book cover right with soft-purple radial glow (`::before` radial gradient).
3. "What this story gives a child" — alternating block, off-white bg, image left + 3 paragraphs right.
4. Lifestyle band — full-bleed photo, max-height 520px (320 mobile), bottom dark gradient overlay, centered Poppins caption "In homes. In clinics. In classrooms."
5. "Why it belongs in your work" — deep purple bg, 2 glassmorphism cards (white/6%, 1px white/10% border, 16px radius), yellow uppercase tracked headings, list items with a 14×2px yellow bar accent.
6. Glossary callout — softer purple bg, 2-col (text + glossary photo with caption).
7. "Read a Sample" — white bg, 4 scene cards (off-white, 1px soft border, 16px radius). Cards 1–3 are 2-col spreads; card 4 is single-page.
8. CTA — soft purple bg, two stacked-on-mobile buttons. Primary: deep purple solid → Amazon UK. Secondary: warm yellow solid → mailto with subject `Wholesale enquiry - Dan and the Paper Airplane` (regular hyphen, not em-dash).
9. Sign-off — "A note from us", signatures grid (Camesha Russell / Jinean Cheng), co-founders tag.
10. Minimal footer.

## Outbound link UTM pass-through

Inside the page component:

```ts
const search = typeof window !== "undefined" ? window.location.search : "";
const utmParams = new URLSearchParams(search);
const utmString = Array.from(utmParams.entries())
  .filter(([k]) => k.startsWith("utm_"))
  .map(([k,v]) => `${k}=${encodeURIComponent(v)}`)
  .join("&");

const amazonHref = `https://amzn.eu/d/0bpPo1FJ${utmString ? `?${utmString}` : ""}`;
const mailtoHref = `mailto:hello@empowereddld.com?subject=Wholesale%20enquiry%20-%20Dan%20and%20the%20Paper%20Airplane${utmString ? `&body=${encodeURIComponent("Source: " + utmString)}` : ""}`;
```

Computed in a `useMemo` so it's stable.

## SEO / head

Use the existing `SEOHead` component if compatible, otherwise inline `react-helmet`-style `useEffect`:
- `<title>Dan and the Paper Airplane | Sample Pages | Empowered DLD</title>`
- `<meta name="description" content="Read a free sample of Dan and the Paper Airplane, the first book in the Living Life with DLD series. Written by an SLP and an educator for children with DLD." />`
- `<meta name="robots" content="noindex, follow" />`
- Preconnect + Google Fonts link for Poppins (400-800) + Inter (400-700).

## Voice and copy rules

- Copy is **verbatim** from the HTML — no rewrites.
- No em-dashes anywhere; mailto subject uses a regular hyphen.
- British English — already present in source ("realising", "organisations" not introduced anywhere I'm adding).
- This page bypasses the site-wide DM Sans / 1100px / "people not children" memory rules — that's intentional and noted in the prompt (Poppins + Inter, 1140px, "child" appears in source copy).

## Out of scope

- No analytics events wired (UTMs flow through to outbound links and Amazon/inbox handle attribution).
- No A/B variants.
- Page is reachable only by direct URL (no nav links added anywhere).

## Verification after build

I'll screenshot at 1280 and 390 widths to confirm: hero glow, lifestyle band overlay caption, deep-purple why-section glass cards with yellow accents, scene cards rounded with off-white bg, CTA buttons stack on mobile, no em-dashes.
