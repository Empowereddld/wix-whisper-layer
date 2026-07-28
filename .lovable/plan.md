## What the two emails mean

They are not contradictory. They are about two different issues, sent minutes apart.

**Email 1 — "Redirect error fixed" (1 page).** This is resolved and correct. `empowereddld.com/` now 301-redirects to `www.empowereddld.com/` in a single hop (verified live). Search Console reports the root domain as "Page with redirect", which is the expected, healthy state.

**Email 2 — "New reason: Soft 404".** This is a real, new issue in the app code.

## Root cause of the Soft 404

The site is a single-page app. When Google requests a URL that no longer exists, the server returns **HTTP 200** and React renders the 404 page. Verified live: requesting `/this-page-does-not-exist-12345` returns status 200, not 404.

`src/pages/NotFound.tsx` makes this worse in two ways:
- It sets **no `noindex`** tag, so Google is invited to index the error page.
- It sets a **self-referencing canonical** pointing at the broken URL, telling Google the dead URL is the real, preferred page.

The combination of "200 OK + indexable + canonical to itself + content that says 404" is exactly what Google classifies as a Soft 404. Any legacy URL Google still remembers (old Wix paths, removed merch handles, old blog links) will keep generating these.

## Three related problems found while investigating

**1. The sitemap submits pages that are set to `noindex`.**
`/privacy-policy`, `/terms-and-conditions`, and `/disclaimer` all carry a `noindex` tag but are listed in the sitemap. Search Console already reports `/privacy-policy` as "Excluded by 'noindex' tag". Submitting a page you are also telling Google to ignore is a conflicting signal.

**2. The sitemap conflicts with robots.txt on merch.**
`robots.txt` has `Disallow: /shop/merch`, but the sitemap submits `/shop/merch` plus all three product URLs. Google is being told to crawl and not crawl the same pages.

**3. Blog posts are missing from the live sitemap.**
The live sitemap has 29 URLs and zero blog posts. Running the generator locally produces 42 URLs including all the blog posts. The blog lookup silently returns an empty list when its credentials are unavailable during the publish build, and the script logs a warning and carries on. Every published blog post is currently absent from the sitemap, including ones already getting impressions in Search Console.

## Proposed fixes

**Stop generating Soft 404s**
- Add `noindex, nofollow` to the 404 page so Google drops dead URLs instead of flagging them.
- Remove the self-referencing canonical on the 404 page so it no longer claims dead URLs are legitimate.

**Clean up conflicting sitemap signals**
- Remove `/privacy-policy`, `/terms-and-conditions`, and `/disclaimer` from the sitemap generator, since they are intentionally `noindex`.
- Resolve the merch conflict. Two options, and I need your call on which:
  - **Option A (recommended):** Merch is a real, live storefront now, so remove `Disallow: /shop/merch` from robots.txt, drop the `noindex` on the merch pages, and let the products get indexed and found in search.
  - **Option B:** Keep merch hidden from search, and remove `/shop/merch` and all product URLs from the sitemap instead.

**Fix the missing blog posts**
- Make the sitemap generator fail the build loudly when the blog lookup returns nothing, instead of silently writing a sitemap with no posts. This surfaces the problem at publish time rather than months later.

## Technical details

Files to change:
- `src/pages/NotFound.tsx` — add `noindex`, remove self-canonical.
- `src/components/SEOHead.tsx` — allow suppressing the canonical tag when a page should not self-reference.
- `scripts/generate-sitemap.ts` — drop the three `noindex` legal pages, harden the blog fetch, apply the merch decision.
- `public/robots.txt` — only if you pick Option A.

Note that none of this is instant. Google re-crawls on its own schedule, so the Soft 404 report will clear over days to weeks, not immediately. Once deployed you can speed it up by hitting Validate Fix on the Soft 404 issue in Search Console.
