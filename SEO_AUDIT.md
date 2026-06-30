# SEO Audit — empowereddld.com

**Prepared:** June 30, 2026
**Site:** https://www.empowereddld.com
**Markets reviewed:** US, UK, Australia, Canada
**Data sources:** Semrush (US/UK/AU/CA databases), Lovable SEO scanner, source-code review

---

## 1. Executive Summary

**Overall grade: D+** — The site is a well-built, technically near-clean Lovable React app with strong on-page SEO scaffolding (per-route `SEOHead`, JSON-LD, sitemap generator, semantic HTML). But it is **functionally invisible in Google** today: Semrush sees just **2 ranking keywords in the US, 1 in the UK, 3 in AU, 1 in CA**, total estimated organic traffic of **~9 visits/month worldwide**, and **Authority Score 6/100** — entry-level. The DLD topical space is genuinely winnable (low difficulty, modest volumes, weak commercial competition), but you are starting from zero. This audit is less about fixing what is broken and more about **building presence from scratch** in a niche where two competitors (dldandme.org AS 28, radld.org AS 29) already own the conversation.

**Top 3 wins to chase now**
1. **Own "what is DLD" and "developmental language disorder"** — combined ~5,300 searches/mo across US+UK, KDI 26–38. Your `/about-dld` page is excellent content; it just needs targeted optimization and time to age.
2. **Fix the domain canonicalization mismatch** — the Lovable scanner is correct: your sitemap and robots advertise `www.empowereddld.com` while your published primary is `empowereddld.com`. This is splitting signals.
3. **Aggressive referring-domain growth** — you have 12 referring domains vs. dldandme.org's 716. Even reaching 50–75 quality referring domains over 6 months would move you from invisible to competitive.

**Top 3 risks**
1. **Spammy backlinks already appearing** — anchors like *"high quality dofollow backlinks DA 50 PA 40 premium PBN…"* are showing up. Someone is point-blank-spamming your domain or you bought into a low-grade SEO service. **Disavow these now**.
2. **Heavy reliance on a single referring domain** — 53 of 66 backlinks come from `empowereddldparenting.com` (your own sister site, AS 12). That is not real authority; if Google discounts it, you have effectively ~13 backlinks.
3. **Long ramp time** — at AS 6 with a sparse content footprint, you should plan **6–12 months of consistent publishing** before meaningful traffic appears. Nothing in this audit is a "ship a fix tomorrow and traffic jumps" finding.

---

## 2. Current State

### Visibility snapshot (Semrush, organic only)

| Market | Ranking keywords | Est. traffic/mo | Top keyword | Best position |
|---|---|---|---|---|
| US | 2 | 4 | dld books | 6 |
| UK | 1 | 0 | dld and me | 53 |
| AU | 3 | 3 | dld books | 7 |
| CA | 1 | 2 | dld.com | 11 |

### Trend (US, 36 months)
First detected ranking keyword in **March 2026**. From October 2015 through February 2026: **zero** keywords ranking. May 2026: first detectable traffic (4 visits/mo est.). **Direction is up from zero, but the base is so small the trend is noise.**

### Authority & links
- **Authority Score: 6/100** (new-site band)
- **Trust Score: 6/100**
- **Total backlinks: 66** / **Referring domains: 12** / **Referring IPs: 6**
- 80% of backlinks come from one sister domain (empowereddldparenting.com)
- Toxic/spam anchors present (PBN, paid-link services)

### Reality check
Semrush only sees Google organic, top-100 positions. Your real traffic from direct visits, email, social (you have an active Instagram + Facebook + YouTube), and brand search is almost certainly higher — likely a few hundred to low thousands of monthly sessions. **For the true number, check Google Analytics or GSC.** The Semrush number is a proxy for *non-brand search discovery*, which is essentially nonexistent today.

---

## 3. Technical SEO Scorecard

| Check | Status | Evidence |
|---|---|---|
| HTTPS | ✅ Pass | Site served over HTTPS |
| Single H1 per page | ✅ Pass | Spot-checked Index, AboutDLD, ForParents |
| Semantic HTML | ✅ Pass | `<header>`, `<main>`, `<footer>` consistently |
| Per-route `<title>` and `<meta description>` | ✅ Pass | `SEOHead` component, `react-helmet-async` correctly wired |
| Canonical tags per route | ✅ Pass | `SEOHead` self-references each route |
| OG / Twitter cards | ✅ Pass | Default `og-empowered-dld.png` + per-page overrides |
| JSON-LD Organization | ✅ Pass | In `index.html` |
| JSON-LD WebSite + SearchAction | ✅ Pass | In `index.html` |
| JSON-LD FAQPage | ✅ Pass | On `/about-dld` |
| JSON-LD BreadcrumbList | ✅ Pass | Via `SEOHead` breadcrumbs prop |
| `robots.txt` exists | ✅ Pass | `/public/robots.txt` |
| `sitemap.xml` exists + auto-generated | ✅ Pass | `scripts/generate-sitemap.ts` runs pre-dev/build |
| `llms.txt` for AI engines | ✅ Pass | Excellent, well-structured |
| `noindex` on private routes | ✅ Pass | `/shop/merch` correctly noindexed |
| **Sitemap host matches primary domain** | ❌ Fail | Uses `www.empowereddld.com`; published primary is `empowereddld.com` |
| **`robots.txt` Sitemap directive host match** | ❌ Fail | Same root cause |
| **Sitemap completeness** | ⚠️ Partial | Missing: `/signup`, `/storypros/dashboard`, `/storypros/claim-founder`, `/storypros/verify`, `/storypros/verified` (last 4 should stay out; `/signup` should be added or noindexed) |
| **Generic link text** | ❌ Fail | "LEARN MORE" used in `ChoosePathSection.tsx`, `HowWeSupportTherapistsSection.tsx` — bad for SEO and screen readers |
| **Header/Footer logo alt text** | ❌ Fail | Header alt is `EmpoweredDLD` (one token). Should be `Empowered DLD` (two words) for accessibility + brand-keyword reinforcement |
| **Title length on `/shop/books`** | ❌ Fail | Exceeds 60 chars per scanner |
| **Meta description length on `/` and `/about-dld`** | ❌ Fail | Exceeds 160 chars per scanner |
| **LCP performance** | ⚠️ Risk | Hero image (`hero-girls.webp`) is `loading="eager"` ✅ but missing `fetchpriority="high"` and explicit width/height |
| **Color contrast (Lighthouse)** | ⚠️ Risk | Some muted-foreground text on light bg below 4.5:1 — usually placeholders |
| **Sitewide H2 hierarchy on `/`** | ⚠️ Risk | Sections like SupportSection, BookShowcase render visually but without semantic H2 anchors |

### Domain canonicalization — explain the failure
- `index.html` `canonical` and `og:url`: `https://www.empowereddld.com/` (with www)
- `sitemap.xml` and `robots.txt`: `https://www.empowereddld.com` (with www)
- "Project domain" per Lovable config: `empowereddld.com` (no www)
- Both URLs resolve. Pick one as canonical and force-redirect the other (the host serves both, so this is a registrar/DNS or CDN decision, not a code one — verify in GSC that both are added and one set as preferred).

---

## 4. On-Page Findings (per file)

### `src/components/HeroSection.tsx` — Home hero
- ✅ Single `<h1>` with strong keyword ("DLD")
- ⚠️ H1 copy is emotional ("Every child with DLD deserves to feel seen.") — beautiful for humans, weak for search. Consider an SEO-friendly subhead H2 immediately below the hero on the homepage like *"Resources for Developmental Language Disorder (DLD)"*.
- ⚠️ Hero `<img>` missing explicit `width`/`height` and `fetchpriority="high"` → flagged by Lighthouse as LCP risk.
- ⚠️ Alt text "Two girls laughing together" is fine for accessibility but adds zero keyword signal. Suggest: *"Two children with DLD smiling together at school"*.

### `src/components/Header.tsx` — Logo alt
- ❌ Line 62: `alt="EmpoweredDLD"` — fails the scanner. Change to `alt="Empowered DLD"` (with space).

### `src/components/Footer.tsx` — Logo alt
- Same fix.

### `src/components/ChoosePathSection.tsx`, `HowWeSupportTherapistsSection.tsx`
- ❌ Generic "LEARN MORE" / "Learn More" link text. Replace with descriptive anchors that reinforce the destination page's target keyword (e.g. *"DLD resources for parents"*, *"Clinical DLD resources for SLPs"*).

### `src/pages/Index.tsx` — Home meta
- ⚠️ Meta description over 160 chars — trim. Suggested:
  > *"Empowered DLD: evidence-based resources, books, and community for families and professionals supporting Developmental Language Disorder."* (155 chars)

### `src/pages/AboutDLD.tsx` — pillar page
- ✅ FAQ JSON-LD wired up well
- ✅ Solid breadcrumbs
- ⚠️ Title is currently *"What Is DLD? A Plain Guide to Developmental Language Disorder"* (62 chars — borderline; trim to *"What Is DLD? A Plain Guide to Developmental Language Disorder | Empowered DLD"* is over). Recommend: *"What Is DLD? A Plain Guide to Developmental Language Disorder"* and rely on Google appending site name. Keep current.
- ⚠️ Meta description exceeds 160 chars — trim.
- 🎯 **This is the single most important page on the site for SEO.** It should be expanded over time to be the definitive answer to "what is DLD" — currently good but should grow to 1,500–2,500 words with clear H2/H3 structure mirroring the People-Also-Ask questions in Section 5.

### `src/pages/Books.tsx`
- ❌ Title exceeds 60 chars — scanner flagged. Recommend: *"Children's Books About DLD | Empowered DLD"* (~43 chars).

### Blog (`/resources/blog`)
- ✅ Auto-included in sitemap from Supabase, status=published filter applied
- ✅ Article JSON-LD presumed via post template (good)
- Blog is your **most scalable SEO asset**. 12 posts indexed in sitemap. To meaningfully grow rankings, add 1–2 posts/month minimum targeting question-style keywords (Section 5).

---

## 5. Content & Keyword Strategy

### High-priority targets (US + UK aggregate)

| Keyword | US vol | UK vol | KDI (US) | Intent | Target page | Action |
|---|---|---|---|---|---|---|
| developmental language disorder | 2,400 | 2,900 | 37 | Informational | `/about-dld` | Expand to definitive 2k-word pillar. Add table of contents, H2s per PAA question. |
| what is dld | 320 | 1,000 | 26 | Informational | `/about-dld` (or sub-page) | Either dedicated `/about-dld/what-is-dld` or strong H2 on existing page. |
| dld awareness day | low (US) | 140 | 10 | Informational | New blog post + annual hub | **Easy win for UK market.** Build a `/dld-awareness-day` evergreen page now, refresh annually. |
| dld books | 140 | low | 17 | Commercial | `/shop/books` | You currently rank position 6 in US. Push to position 1–3 with: more on-page copy, better internal linking, Product schema, reviews. |
| dld in adults | 20 | 40 | 0 | Informational | New blog post | Easy SERP, growing topic, you already have a related blog post (`dld-as-an-adult`) — boost it. |
| dld vs autism | 20 | 20 | 0 | Informational | Existing blog | You have `autism-vs-dld-understand-the-difference` already. Optimize title/meta to target the exact "dld vs autism" phrase. |
| dld checklist / signs of dld | 40 | low | 0 | Informational | `/resources/language-impact-checklist` | Add the phrases "DLD checklist" and "signs of DLD" naturally into H1/H2 on this page. |
| dld symptoms | 30 | — | 0 | Informational | New blog or `/about-dld` H2 | Quick win — low difficulty. |
| language processing disorder | 1,900 | — | low | Informational | New comparison post | Adjacent topic, big volume. Write *"Language Processing Disorder vs Developmental Language Disorder"*. |
| language delay | 480 | — | low | Informational | New blog | Adjacent informational; bridge to DLD identification. |

### Question-keyword content map (for blog calendar)

These are all 10–50 vol/mo with near-zero difficulty. Each one is a 600–900 word post that should rank within 3–6 months:

- "What causes developmental language disorder?"
- "Is developmental language disorder lifelong?"
- "Can DLD be cured?"
- "Is DLD a learning disability?"
- "Is DLD a disability?"
- "Is DLD genetic?"
- "How to diagnose developmental language disorder"
- "How to teach a student with DLD"

Aggregate volume across these ~20 questions is small individually but compounds into a strong topical-authority signal for the pillar page.

### Content gaps vs. competitors
- **dldandme.org** ranks for 165 keywords (you: 2). Their strongest pages target classroom strategies and educator resources.
- **radld.org** ranks for 221 keywords. Strong on awareness-day content and research summaries.
- **Neither** owns the commercial intent ("DLD books", "DLD resources for parents", "DLD therapy materials") in any meaningful way — **this is your wedge**.

---

## 6. Competitive Positioning

| Metric | empowereddld.com | dldandme.org | radld.org |
|---|---|---|---|
| Authority Score | 6 | 28 | 29 |
| Organic keywords | 2 | 165 | 221 |
| Est. traffic/mo (US) | 4 | 865 | 49 |
| Referring domains | 12 | 716 | 1,124 |
| Total backlinks | 66 | 2,823 | 3,680 |

### Read
- **dldandme.org** is the traffic leader — most efficient site (high traffic per backlink), suggesting strong on-page SEO and topical relevance. Steal their playbook.
- **radld.org** has the most backlinks but lower traffic — campaign/movement site, gets linked from advocacy contexts but is less optimized for search. Easier to out-rank on commercial terms.
- **You** are not yet in the conversation. Realistic 6-month target: reach AS 15+, 50+ ranking keywords, 75+ referring domains.

### Other competitors flagged by Semrush
`dldbooks.com`, `meetdld.com`, `dldandme.co.uk`, `speechandlanguage.org.uk` (ICAN, UK charity, big authority), `bcpractice.com`. The .org.uk RADLD/ICAN cluster dominates UK SERPs — partner with them rather than try to outrank.

---

## 7. Backlink Profile Assessment

### Strengths
- Clean follow/nofollow ratio (83% follow)
- One strong-ish anchor: brand variants ("empowereddld.com", "empowered dld")

### Weaknesses
1. **Single-source dependency**: 53/66 links from your own `empowereddldparenting.com`. Google discounts links between sites you own.
2. **Toxic anchors present**: anchor *"high quality dofollow backlinks DA 50 PA 40 premium PBN network service…"* is a clear paid-link/PBN footprint. If you bought this, stop. If you didn't, disavow.
3. **Domains like `analyticshaven.top`, `shortenurls.eu`, `8coint.com`, `bisprofit.com`, `blogsphere.top`** are recognized link-spam patterns. Add to disavow file in GSC.
4. **42 backlinks have empty anchor text** — usually image links or footer links from a single source. Not harmful, but not helpful.

### Outreach targets (high-quality, in-niche)
- **ICAN / Afasic / Speech and Language UK** (speechandlanguage.org.uk) — guest content, resource exchange
- **The DLD Project** (Australia, thedldproject.com) — international partnership
- **University SLP departments** (Edinburgh, McGill, Iowa, Wisconsin) — resource directory placements
- **ASHA Leader** and **Leader Live** — pitch articles
- **Reading Rockets** (readingrockets.org, AS ~70+) — listed as a competitor in Semrush; pitch a guest post on DLD vs reading disorders
- **Parent advocacy blogs** (Understood.org, Wrightslaw, Smart Kids with LD)
- **Local school district resource pages** — direct outreach with your free downloadables as the hook

Target rate: 3–5 quality outreach attempts per week → ~10–15 new referring domains per quarter is achievable.

---

## 8. Prioritized Action Plan

### P0 — This week (low effort, immediate impact)

| Action | File / where | Effort | Impact |
|---|---|---|---|
| Fix sitemap + robots host to `empowereddld.com` (or fully commit to `www.`) | `scripts/generate-sitemap.ts`, `public/robots.txt` | 15 min | High — fixes scanner failures |
| Trim home + AboutDLD meta descriptions to <160 chars | `src/pages/Index.tsx`, `src/pages/AboutDLD.tsx` | 10 min | Medium — CTR |
| Trim Books page title to <60 chars | `src/pages/Books.tsx` | 5 min | Medium |
| Fix logo alt text to "Empowered DLD" | `src/components/Header.tsx`, `Footer.tsx` | 5 min | Low — but cheap |
| Replace "LEARN MORE" with descriptive anchors | `ChoosePathSection.tsx`, `HowWeSupportTherapistsSection.tsx` | 20 min | Medium |
| Add `fetchpriority="high"` + explicit width/height to hero image | `src/components/HeroSection.tsx` | 10 min | Medium — LCP |
| Disavow toxic backlinks in Google Search Console | GSC | 30 min | Medium — protects domain |
| Add both `www` and root-domain properties in GSC + set preferred | GSC | 15 min | High — visibility |

**Total P0 effort: ~2 hours. Estimated visibility impact: small but unblocks everything below.**

### P1 — Next 30 days (content build-out)

| Action | Effort | Impact |
|---|---|---|
| Expand `/about-dld` to 1,500–2,000 words; add H2s mirroring PAA questions | 4–6 hr | High — pillar |
| Optimize existing blog post `autism-vs-dld-understand-the-difference` for exact query "dld vs autism" | 1 hr | Medium |
| Optimize `dld-as-an-adult` for "DLD in adults" (US+UK 60/mo combined) | 1 hr | Medium |
| Create `/dld-awareness-day` evergreen page (UK 140/mo) | 3 hr | Medium — UK quick win |
| Add Product JSON-LD to all books on `/shop/books` (improves rich-result eligibility) | 2 hr | Medium |
| Add 4 new blog posts targeting question keywords (Section 5) | 8 hr | Compounding |
| Start link-building outreach: 10 contacts, target 2–3 placements | ongoing | High |
| Add internal links from every blog post back to `/about-dld` and topical hub | 2 hr | Medium |

### P2 — Next quarter (strategic depth)

| Action | Impact |
|---|---|
| Build out 10+ more pillar/cluster blog posts | High — compounding |
| Launch a "DLD vs X" comparison series (autism, ADHD, dyslexia, APD, language delay) | High — captures comparison searches |
| Build a downloadable "DLD identification toolkit" gated behind email — drives organic + list growth | High |
| Partner with one major .edu or .org for a co-authored resource (link magnet) | High — single backlink can move AS several points |
| Get listed on Understood.org, Reading Rockets, ASHA practice portal resource directories | High |
| Implement HowTo or Course schema on `/resources/free-course` for rich results | Medium |
| Hreflang setup if UK-specific content emerges, so US and UK pages don't compete | Medium |
| Quarterly Lovable SEO scan + Semrush check-in to measure AS, RD, keyword growth | Foundational |

---

## 9. What Not To Do
- Do not chase site-wide backlink packages, link farms, "DA 50 guaranteed" services. The toxic anchors already in your profile suggest someone tried this. It will hurt long-term.
- Do not noindex the blog or any of the `/for-*` pages — they are your moats.
- Do not migrate hosts or change URL structure without 301s in place. You have very little authority to lose and even less to spare.
- Do not over-rotate on technical SEO. The site is already 90% technically correct. **Content publishing + link building** is where the next 100 ranking keywords will come from, not another schema tweak.

---

## 10. 90-Day Success Metrics

If the P0 + P1 plan is executed, expected end-of-quarter:

| Metric | Today | 90-day target |
|---|---|---|
| Ranking keywords (US) | 2 | 25–40 |
| Ranking keywords (UK) | 1 | 15–25 |
| Referring domains | 12 | 25–35 |
| Authority Score | 6 | 10–14 |
| Top-10 rankings | 1 (dld books) | 4–6 |
| Indexed pages | ~30 | 40–60 (driven by new blog posts) |

These are realistic, not aggressive. AS moves slowly. The traffic flywheel for a domain in your maturity band starts to spin meaningfully around month 4–6 once content has aged and links accrue.

---

## Appendix A — Tool References

- Source: Semrush (US/UK/AU/CA databases), pulled June 30, 2026
- Source: Lovable built-in SEO scanner findings (6 active, all addressable in P0–P1)
- Source: code review of `index.html`, `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt`, `scripts/generate-sitemap.ts`, `src/components/SEOHead.tsx`, `src/App.tsx`, plus spot-checks of Index, AboutDLD, HeroSection, Header, ContactUs, ShopMerch
- Semrush data is Google organic top-100 only. True traffic from analytics will be higher because direct, email, and social are not counted here.

---

*End of audit. Happy to implement any of the P0 items in a follow-up turn — say the word and pick which ones.*
