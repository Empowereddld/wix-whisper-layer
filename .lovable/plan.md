

## Plan: Build the "For Organizations" Page

Based on the Wix reference screenshot and the uploaded images, I will create the full For Organizations page using the same layout patterns as the existing For Parents page. The page has 9 sections.

### Images to Copy
- `user-uploads://image-gen_51.png` → `src/assets/org-hero.png` (Hero - boardroom meeting)
- `user-uploads://image-gen_65.png` → `src/assets/org-workshop.png` (Why Organizations Choose Us)
- `user-uploads://image-gen_80.png` → `src/assets/org-community.png` (Is This Right)
- `user-uploads://image-gen_56-2.png` → `src/assets/org-kids.png` (DLD Impact section icons background or extra)

### New Components to Create

1. **`src/components/ForOrganizationsHero.tsx`** — Clone of ForParentsHero. Label "FOR ORGANIZATIONS", headline "DLD Support for Your Organization", button "Book a Consultation". Image: org-hero.png (boardroom).

2. **`src/components/OrganizationsAwarenessSection.tsx`** — Two-column layout (image left, text right) matching the Wix reference "Let's spread DLD Awareness together!" section. Not the black-bar format — the Wix shows it as an image+text editorial layout with a "Contact Us" button.

3. **`src/components/DLDImpactSection.tsx`** — Heading "DLD is Affecting the Communities You Serve" + intro text + 6 icon cards in 3x2 grid. Each card has a circular icon (using Lucide icons: BarChart3, GraduationCap, BookOpen, Briefcase, Heart, Handshake), title, and description. Same card styling as HowWeSupportParentsSection.

4. **`src/components/OrganizationsStrugglesCTA.tsx`** — Full-width dark overlay banner: "You're Seeing the Struggles. We can help you understand why." with bullet points on the right. Matches the Wix reference purple/dark CTA band.

5. **`src/components/HowWeSupportOrganizationsSection.tsx`** — Heading + 4 cards in a row (Parent Workshops, Staff Training, Resource Packages, Custom Partnerships). Same card style as HowWeSupportParentsSection but 4 cards in `lg:grid-cols-4`.

6. **`src/components/WhyOrganizationsChooseSection.tsx`** — Clone of WhyParentsTrustSection (checklist left, image right). 4 checkmark items. Image: org-workshop.png.

7. **`src/components/PartnershipPackagesSection.tsx`** — Heading + 2 pricing cards side by side (Community Intro Workshop $1,500 / Full-Day Training $3,000). Same card structure as ImplementationPackagesSection but 2 columns with purple headers and "Book This Package" buttons.

8. **`src/components/IsThisRightForOrgSection.tsx`** — Clone of RightPlaceSection (image left, bullets right). Heading "Is This Right for Your Organization?". Image: org-community.png.

9. **`src/components/OrganizationsLeadFormSection.tsx`** — Light bg section with heading "Get Our Free DLD Recognition Guide", intro text, form fields (Name, Email, Organization Name, dropdown "I am a:"), submit button, disclaimer text. Uses existing UI components (Input, Select, Button).

10. **Reuse `ResourceLibraryCTA`** — already exists.

### New Page

**`src/pages/ForOrganizations.tsx`** — Shell importing Header, all 10 sections above, and Footer.

### Route Addition

**`src/App.tsx`** — Add `<Route path="/for-organizations" element={<ForOrganizations />} />`.

### Styling Consistency
- All sections use the 120px vertical rhythm (`py-10 md:py-16 lg:py-[120px]`)
- Same container widths, typography hierarchy, card borders, and button styles as For Parents
- Images use `object-cover`, `rounded-xl`, responsive max-height constraints
- Lead form is frontend-only (no backend submission initially)

