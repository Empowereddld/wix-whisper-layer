

## Plan: Build the "For Educators" Page

Create `/for-educators` using the For Parents page as the structural and spacing template, with exact copy from the Wix screenshots. The page will be built as individual section components following established patterns.

### Files to create

**1. `src/pages/ForEducators.tsx`** -- Page shell (mirrors ForParents.tsx structure)

**2. `src/components/ForEducatorsHero.tsx`** -- Hero section
- Badge: "For Schools and Educators"
- Heading: "Comprehensive DLD Support for Your School"
- Description about school-wide materials, training, and multilingual support
- CTA: "Book a Consultation"
- Image: one of the uploaded classroom images (image-gen_69.png -- kids in classroom)

**3. `src/components/EducatorsFamiliarSection.tsx`** -- Black banner + text
- Banner: "Your students with language disorders are falling through the cracks."
- Body text about students being identified late, teachers not recognizing DLD, etc.
- Follows DoesSoundFamiliarSection pattern exactly

**4. `src/components/EducatorsDLDAwarenessCTA.tsx`** -- Mid-page CTA
- Dark/purple card: "Do you want to bring DLD awareness and support to your school?"
- Subtitle + "JOIN NOW" button
- Uses the uploaded school hallway or workshop image as background

**5. `src/components/HowWeSupportSchoolsSection.tsx`** -- 6-card grid
- Cards: Diverse Children's Books, Professional Development, Implementation Toolkit, Parent Partnership Resources, Equity-Driven Resources, Goal Bank & Digital Resources
- Exact copy from screenshots
- Follows HowWeSupportParentsSection layout

**6. `src/components/WhySchoolsChooseSection.tsx`** -- Checklist + image
- Heading: "Why Schools Choose Empowered DLD"
- 4 check items: Supports early identification, Saves staff time, Demonstrates commitment to educational equity, Inclusive practices
- Exact descriptions from screenshots
- Image: uploaded image of educator with student (image-gen_73.png)
- Follows WhyParentsTrustSection pattern

**7. `src/components/ImplementationPackagesSection.tsx`** -- 3 pricing tiers
- Resource Package ($1,500), Staff Training ($2,800), Staff and Family Support ($4,500)
- Each tier with purple header, "Best for:" line, "What's included:" list
- Add-ons section below
- "Contact Us" buttons

**8. `src/components/HowItWorksSection.tsx`** -- 4-step process
- Step 1: Book a Free Consultation
- Step 2: Choose Your Implementation Package
- Step 3: Schedule Training & Delivery
- Step 4: Implement with Ongoing Support
- Each with image and description text from screenshots
- Uses uploaded images (image-gen_74.png, image-gen_76.png, image-gen_77.png)

**9. `src/components/IsThisRightSection.tsx`** -- Split layout
- Heading: "Is This Right for Your School?"
- "This program is designed for schools that:" + 6 bullet points
- Closing paragraph + "Book a Free Consultation" button
- Image: uploaded educator with students (image-gen_3.png)
- Follows RightPlaceSection editorial pattern

**10. `src/components/EducatorsContactCTA.tsx`** -- Bottom CTA
- "Want to Bring This to Your School? Get Our Information Packet"
- Contact form or simple CTA

### Files to modify

**`src/App.tsx`** -- Add `/for-educators` route pointing to ForEducators page

### Images to copy into project
- `image-gen_69.png` → `src/assets/educators-hero.png` (hero classroom)
- `image-gen_73.png` → `src/assets/educators-trust.png` (educator with student)
- `image-gen_74.png` → `src/assets/educators-step-2.png` (man at desk)
- `image-gen_76.png` → `src/assets/educators-step-3.png` (family with teacher)
- `image-gen_77.png` → `src/assets/educators-step-4.png` (kids in class)
- `image-gen_3.png` → `src/assets/educators-right-fit.png` (teacher with students)
- `image-gen_4.png` → `src/assets/educators-step-1.png` (for Step 1)

### Design approach
- All spacing, font sizes, padding, and responsive breakpoints mirror the For Parents components
- Scroll fade-in animations via `useScrollFadeIn` hook on each section
- Hover transitions on cards matching existing patterns
- `lg` breakpoint for column stacking (tablet safety)
- 120px vertical rhythm between sections on desktop

