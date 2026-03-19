

## Plan: Educational App Waitlist Page under Shop

### What we're building

1. **New page at `/shop/educational-app`** — A waitlist landing page for the Educational App, nested under Shop like Books and Bulk Orders. It will use the same `Header`/`Footer` layout as other shop sub-pages, with:
   - A hero section explaining the app (the "Coming soon!" messaging)
   - A waitlist signup form (reusing the existing `waitlist` table — inserting with a `notes` tag like `"Educational App waitlist"`)
   - A "Why storytelling matters" or feature preview section
   - SEO metadata with breadcrumbs (Home > Shop > Educational App)

2. **Add to Shop dropdown nav** — Add `{ label: "Educational App", href: "/shop/educational-app" }` to `shopLinks` in `Header.tsx`.

3. **Update "Join the App Waitlist" links** — Change the `href` in `HowWeSupportParentsSection.tsx` (and any other pages with the same CTA) from `/contact` to `/shop/educational-app`.

4. **Route registration** — Add the `/shop/educational-app` route in `App.tsx` (lazy-loaded).

### Technical details

- **New file**: `src/pages/EducationalApp.tsx` — Standard layout page with Header, Footer, waitlist form inserting into the `waitlist` table with `notes: "Educational App waitlist"` and optional `role` field.
- **Modified files**:
  - `src/components/Header.tsx` — Add entry to `shopLinks` array (line 22-25)
  - `src/components/HowWeSupportParentsSection.tsx` — Update Educational App card `href` from `/contact` to `/shop/educational-app` (line 38)
  - `src/App.tsx` — Add lazy import and route for the new page
- The existing `waitlist` table and admin panel (`/admin/waitlist`) already handle viewing/managing signups — no backend changes needed.

