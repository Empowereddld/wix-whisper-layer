# SEO Cleanup Plan

## Goal
Remove the remaining technical and copy inconsistencies that could weaken the site's SEO signals after the `/about-dld` pillar-page work.

## Changes

### 1. Standardize canonical domain to `https://www.empowereddld.com`
Search engines treat `www` and non-www as separate URLs. Every canonical signal should point to the same preferred version.

- Update `scripts/generate-sitemap.ts` so `BASE_URL = "https://www.empowereddld.com"`.
- Update `public/robots.txt` so the `Sitemap:` directive points to `https://www.empowereddld.com/sitemap.xml`.
- Regenerate `public/sitemap.xml` so every `<loc>` uses `https://www.empowereddld.com`.
- Leave `index.html` and `SEOHead.tsx` unchanged — they already use `https://www.empowereddld.com`.

### 2. Align sitewide meta description with DLD terminology guidelines
The project uses "people" rather than "children" for DLD messaging.

- Update `index.html` `<meta name="description">` and `og:description` from "children with Developmental Language Disorder" to "people with Developmental Language Disorder".
- Update the `Organization` JSON-LD `description` in `index.html` with the same wording.
- Update the `WebSite` JSON-LD only if its description is affected.

### 3. Verify / regenerate sitemap
Run `bunx tsx scripts/generate-sitemap.ts` so the checked-in `public/sitemap.xml` reflects the new canonical domain.

## Out of scope
- No changes to `/about-dld` content or structure — it is already implemented.
- No new pages or route metadata.
- No robots.txt allow/disallow changes.

## Acceptance
- `public/sitemap.xml` contains only `https://www.empowereddld.com` URLs.
- `public/robots.txt` points to `https://www.empowereddld.com/sitemap.xml`.
- `index.html` no longer uses "children" in its description or JSON-LD.
- Build passes and no SEO findings are introduced.