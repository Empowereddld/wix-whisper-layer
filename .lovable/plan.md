
# Full SEO Audit — empowereddld.com

Run a consultant-grade SEO audit across organic visibility, technical health, on-page quality, content, competitors, backlinks, and keyword opportunities. Deliver the report in chat and save a copy to `SEO_AUDIT.md` at the repo root.

## What I'll analyze

### 1. Organic visibility & trend (Semrush)
- `domain_analysis` on empowereddld.com across **US, UK, AU, CA** databases — traffic, keywords, top rankings per market.
- `seo_trend` (US) — month-over-month direction; growing, flat, or declining.
- `top_pages` (US) — what pages drive traffic today.

### 2. Competitive landscape
- `competitive_analysis` (US + UK) — auto-discover organic competitors and keyword gaps.
- `compare_domains` against 1-2 named DLD-space competitors (e.g. radld.org, dldandme.org) — head-to-head on authority, keywords, traffic.

### 3. Keyword opportunity shortlist
- `keyword_research` on 4-6 core terms: "developmental language disorder", "what is DLD", "DLD vs autism", "DLD in adults", "DLD therapy", "DLD resources for parents".
- `keyword_compare` to triage the shortlist by volume/difficulty/intent.
- Flag quick wins (KDI < 40, decent volume, aligned to existing pages).

### 4. Backlink profile
- `backlink_analysis` on empowereddld.com — authority score, referring domains, anchor distribution, follow ratio.
- Compare against one competitor's backlink profile to spot link-building gaps.

### 5. Technical SEO audit (code-level, read-only)
Re-read and verify:
- `index.html` — title/description/OG/Twitter/JSON-LD/canonical/viewport/favicon/theme-color.
- `public/robots.txt` — crawler rules, disallows (note: `/shop/merch` is blocked, that's intentional).
- `public/sitemap.xml` + `scripts/generate-sitemap.ts` — coverage, freshness, dynamic blog inclusion.
- `src/components/SEOHead.tsx` — per-route head pattern, canonical/OG self-reference, breadcrumb JSON-LD.
- Spot-check 5-6 key pages (Index, AboutDLD, ForParents, ForTherapists, Blog, Resources) for: unique title/description, canonical, JSON-LD type match, breadcrumbs, noindex correctness.
- Lovable's built-in scanner via `seo_chat--list_findings` (no fresh scan triggered unless user asks).

### 6. On-page content quality
- Heading hierarchy (single H1, semantic structure).
- Image alt coverage on hero/key sections.
- Internal linking patterns (Resources → Blog → CTA hubs).
- Content depth on commercial pages vs informational pages.
- "Empowered DLD" brand-term ranking and SERP ownership.

### 7. AI search / LLM discoverability
- `public/llms.txt` presence and quality.
- Schema completeness for AI engines (Organization, WebSite, FAQ, Article, BreadcrumbList).

## Deliverable

Consultant-style report covering:

1. **Executive summary** — overall health grade, top 3 wins, top 3 risks.
2. **Current state** — traffic, keywords, authority, trend, per-market breakdown.
3. **Technical SEO scorecard** — pass/fail per check with evidence.
4. **On-page findings** — per-page issues with file references.
5. **Content & keyword strategy** — ranked opportunity list with target page, expected difficulty, recommended action.
6. **Competitive positioning** — who you compete with, where the gaps are.
7. **Backlink profile assessment** — strengths, weaknesses, outreach targets.
8. **Prioritized action plan** — P0 (fix this week), P1 (next 30 days), P2 (next quarter), each with effort estimate and expected impact.

Saved to `SEO_AUDIT.md` at repo root for reference and sharing. No other files created or modified.

## Notes

- Semrush data is Google organic only; real traffic from analytics will be higher.
- Estimated ~12-15 Semrush calls across the four markets.
- No content rewrites, schema additions, or robots/sitemap changes happen in this turn — audit only. Fixes come in a follow-up turn once you've reviewed the findings and picked priorities.
