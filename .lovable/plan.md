

## Plan: Wire up "What We Offer" Support Section CTAs

**What**: Update the 9 card CTAs in `SupportSection.tsx` to link to the correct pages instead of `#`.

**Changes** — single file: `src/components/SupportSection.tsx`

Add an `href` field to each item in the `features` array:

| Card | Route |
|---|---|
| Dan & Daria Book Series | `/books` |
| Free Downloadable Resources | `/downloadables` |
| Implementation Kits | `/for-educators` |
| Life with DLD Podcast | `/podcasts` |
| Join Our Community | `https://www.facebook.com/groups/empowereddld` (external, opens new tab) |
| Educational app | `#` (no page yet) |
| Professional Development | `/work-with-us` |
| Free YouTube Course | `/free-course` |
| DLD Awareness Merch | `/shop` |

For internal links, use React Router's `<Link>` component. For the Facebook group, use a regular `<a>` with `target="_blank"`.

**Scope**: ~15 lines changed in one file.

