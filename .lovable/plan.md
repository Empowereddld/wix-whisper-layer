

## Jinean's Feedback — Fix Plan

Based on the WhatsApp screenshots, here's what I can fix and what I need your help with:

---

### What I Can Fix Now (Code Issues)

**1. Podcast page — all "Watch Episode" buttons go nowhere + "Go to YouTube Channel" button broken**
- Wire all 3 episode links to your playlist: `https://youtube.com/playlist?list=PLzfiOYFA1If6abH3LUNdxKPOAuOgkjZN5`
- Wire the "Go to YouTube Channel" button to the same playlist
- Files: `src/pages/Podcasts.tsx`

**2. "Contact Us" and "Book a Consultation" buttons broken across multiple pages**
All `href="#contact"` links don't work because the contact form is on `/contact`, not an anchor on the same page. Fix in 7 files:
- `ForOrganizationsHero.tsx` — "Book a Consultation" → `/contact`
- `ForEducatorsHero.tsx` — "Book a Consultation" → `/contact`
- `EducatorsContactCTA.tsx` — both buttons → `/contact`
- `EducatorsDLDAwarenessCTA.tsx` → `/contact`
- `IsThisRightSection.tsx` → `/contact`
- `IsThisRightForOrgSection.tsx` — "Book a Consultation" → `/contact`
- `ImplementationPackagesSection.tsx` — 3 "Contact Us" buttons → `/contact`
- `PartnershipPackagesSection.tsx` — 2 buttons → `/contact`
- `OrganizationsAwarenessSection.tsx` → `/contact`
- `WorkWithUsHero.tsx` → `/contact`

**3. Remaining broken `href="#"` links on card sections**
- `HowWeSupportTherapistsSection.tsx` — 6 cards with `href="#"` → wire to appropriate pages (Books → `/shop/books`, Workshops → `/contact`, Podcast → YouTube playlist, App → waitlist, Bulk → `/shop/bulk-orders`, Parent Resources → `/hub/preview`)
- `HowWeSupportParentsSection.tsx` — 6 cards with `href="#"` → same approach
- `HowWeSupportSchoolsSection.tsx` — 6 cards with `href="#"` → same approach

**4. About DLD page — "children" language too narrow**
Update `WhatIsDLDSection.tsx` and `DLDFaqSection.tsx` to use "people/individuals" instead of "children" where it implies DLD is only a childhood condition. DLD is lifelong — the language should reflect that.

**5. Resources page — add books link at top**
Add a Books card to `BrowseByTypeSection.tsx` or add a prominent books link in the `ResourcesHero.tsx` section so visitors see books alongside the free resources.

---

### What I Need Your Help With (Hub Content/Data Issues)

These are database content issues that I can investigate but need your guidance on:

**6. "Why representation matters" link goes to wrong resource (Daria's tips for starting conversations)**
- This sounds like the `file_url` for the "Why Representation Matters" resource in the database is pointing to the wrong file. I can query the database to check and fix the URL, but I need to know: what should the correct file be?

**7. "Daria's tips for starting conversations" link goes to "Daria's tips for little talkers poster"**
- Same issue — wrong `file_url` in the database. Do you have the correct file for this resource?

**8. "Self advocacy poster formatting is messed up (a few lines are outside speech bubbles)"**
- This is a design issue with the actual PDF/image file itself, not the website code. You'd need to fix the source file and re-upload it.

**9. "Accommodations and modifications document needs clarification + YouTube video link"**
- Adding a disclaimer and a YouTube link would require editing the resource's `long_description` in the database. Can you share the YouTube video URL and the disclaimer text you want added?

---

### Summary

| # | Issue | Type | Can Fix Now? |
|---|---|---|---|
| 1 | Podcast buttons broken | Code | Yes |
| 2 | Contact/Consultation buttons broken | Code | Yes |
| 3 | Card section links broken | Code | Yes |
| 4 | "Children" language on About DLD | Code | Yes |
| 5 | Books link on Resources page | Code | Yes |
| 6-9 | Hub resource content issues | Database content | Need your input |

I'll fix items 1-5 now. For items 6-9, can you share the correct files/URLs so I can update the database records?

