

## Plan: Move Blogs Under Resources, Replace With Contact Us

Good call — Blogs fits naturally as a resource type, and Contact Us is more useful as a top-level nav item.

### `src/components/Header.tsx`
1. Add `{ label: "Blogs", href: "#blogs" }` to the `resourcesLinks` array
2. Replace the "BLOGS" entry in `navLinks` with `{ label: "CONTACT", href: "/contact" }`

### `src/pages/ContactUs.tsx` (new)
Standalone page at `/contact` wrapping the existing `ContactSection` component with `Header` and `Footer`.

### `src/App.tsx`
Add `/contact` route pointing to the new `ContactUs` page.

