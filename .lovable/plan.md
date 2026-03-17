

## Pre-Launch Fixes — Full Implementation Plan

This covers 8 areas: broken links, social icons, legal pages, newsletter, org lead form, index.html cleanup, domain URLs, and 404 page.

---

### 1. Fix All Broken Links

**Footer Quick Links** — replace the `href="#"` map with real routes:
- Home → `/`
- About → `/about-dld`
- Resources → `/resources`
- Contact Us → `/contact`

**Footer Useful Links** — route to new legal pages:
- Privacy Policy → `/privacy-policy`
- Terms & Conditions → `/terms-and-conditions`
- Disclaimer → `/disclaimer`
- Support → `/contact`

**Footer Social Icons** — wire to real URLs:
- Facebook → `https://www.facebook.com/share/g/17LHKuHtuC/`
- YouTube → `https://www.youtube.com/@EmpoweredDLDParenting`
- Instagram → `https://www.instagram.com/empowered.dld.parenting`

**Book "Buy on Amazon" buttons** (4 files) → all link to `https://mybook.to/nwINcA`:
- `BookDanSection.tsx`
- `BookGuidebookSection.tsx`
- `BookBirthdayPartySection.tsx`
- `BookMakeFriendsSection.tsx`
- `BookTheatreExchangeSection.tsx`

**For Parents Hero** CTA ("Join Our Community") → link to the Facebook community: `https://www.facebook.com/share/g/17LHKuHtuC/` (this is where parents connect)

**Bulk Orders Hero + CTA** ("Request a Bulk Order") → link to `/contact` (the contact form already collects bulk order inquiries)

---

### 2. Connect Footer Newsletter to Waitlist

Convert the static HTML inputs in `Footer.tsx` into a working form that inserts into the existing `waitlist` table (which already allows anonymous inserts via RLS). Add state management, a submit handler using the Supabase client, and a success/error toast.

---

### 3. Connect Organizations Lead Form to Database

**Database**: Create a new `lead_captures` table:
```sql
CREATE TABLE public.lead_captures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization_name text,
  role text,
  source text DEFAULT 'organizations_page',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.lead_captures ENABLE ROW LEVEL SECURITY;
-- Anyone can submit
CREATE POLICY "Anyone can submit lead form" ON public.lead_captures FOR INSERT TO public WITH CHECK (true);
-- Admins can view
CREATE POLICY "Admins can view leads" ON public.lead_captures FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
```

**Code**: Update `OrganizationsLeadFormSection.tsx` to insert into `lead_captures` with toast feedback.

---

### 4. Create Legal Pages

Create 3 new page components with standard legal content tailored to Empowered DLD:
- `src/pages/PrivacyPolicy.tsx` — what data is collected, how it's used, cookies, third parties
- `src/pages/TermsAndConditions.tsx` — terms of use, intellectual property, disclaimers
- `src/pages/Disclaimer.tsx` — educational content disclaimer, not medical/legal advice

Each page includes the site Header, Footer, and SEOHead. Add routes in `App.tsx`:
- `/privacy-policy`
- `/terms-and-conditions`
- `/disclaimer`

---

### 5. Clean Up `index.html`

- Change `<meta name="author" content="Lovable" />` → `"Empowered DLD"`
- Remove `<meta name="twitter:site" content="@Lovable" />`
- Remove the `<!-- TODO: Update og:title -->` comment

---

### 6. Update Domain in SEO References

Your custom domain is **www.empowereddld.com**. Update:
- `SEOHead.tsx`: Change `BASE_URL` from `https://wix-whisper-layer.lovable.app` to `https://www.empowereddld.com`
- `public/sitemap.xml`: Update all `<loc>` URLs to use `https://www.empowereddld.com`
- `src/pages/Index.tsx`: Update the Organization JSON-LD `url` field

---

### 7. Brand the 404 Page

Add Header, Footer, and styled content to `NotFound.tsx` so it matches the rest of the site. While 404s shouldn't happen if navigation is correct, search engines and mistyped URLs will still hit it — it needs to look professional.

---

### 8. Google Analytics

You mentioned you'll set this up yourself. When you have your GA4 Measurement ID (G-XXXXXXX), share it and I'll add the tracking snippet.

---

### Summary of Files Changed

| File | Change |
|---|---|
| `Footer.tsx` | Real links, social URLs, working newsletter form |
| `BookDanSection.tsx` | Amazon link |
| `BookGuidebookSection.tsx` | Amazon link |
| `BookBirthdayPartySection.tsx` | Amazon link |
| `BookMakeFriendsSection.tsx` | Amazon link |
| `BookTheatreExchangeSection.tsx` | Amazon link |
| `ForParentsHero.tsx` | Facebook community link |
| `BulkOrdersHero.tsx` | `/contact` link |
| `BulkOrdersCTASection.tsx` | `/contact` link |
| `OrganizationsLeadFormSection.tsx` | Database insert |
| `SEOHead.tsx` | Update BASE_URL |
| `index.html` | Author, twitter, TODO cleanup |
| `public/sitemap.xml` | Domain update |
| `src/pages/Index.tsx` | JSON-LD domain update |
| `NotFound.tsx` | Add Header/Footer/branding |
| **New:** `PrivacyPolicy.tsx` | Privacy policy page |
| **New:** `TermsAndConditions.tsx` | Terms page |
| **New:** `Disclaimer.tsx` | Disclaimer page |
| `App.tsx` | 3 new routes |
| **Migration** | `lead_captures` table |

