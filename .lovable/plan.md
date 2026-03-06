

## Plan: Build the "For Therapists" Page

Create a new `/for-therapists` route mirroring the For Parents page structure, with therapist-specific content extracted from the Wix screenshots. Three uploaded images will be used as assets. All new components follow the exact same layout patterns, class names, and responsive behavior as the For Parents equivalents.

### New Files

**1. `src/pages/ForTherapists.tsx`** — Page shell (same as ForParents.tsx)
- Header, ForTherapistsHero, TherapistsFamiliarSection, HowWeSupportTherapistsSection, WhyTherapistsTrustSection, TherapistsRightPlaceSection, ResourceLibraryCTA, Footer

**2. `src/components/ForTherapistsHero.tsx`** — Mirrors ForParentsHero
- Badge: "For Therapists"
- Heading: "Evidence-Based DLD Resources for Your Practice"
- Subtitle: "Ready-to-use books, tools, and multilingual materials that save you time and better serve diverse clients."
- CTA: "BROWSE RESOURCES"
- Image: `image-gen_68.png` (therapist with kids)

**3. `src/components/TherapistsFamiliarSection.tsx`** — Mirrors DoesSoundFamiliarSection
- Black bar heading: "Have you ever read a children's book about DLD?"
- Body text about clients needing representative materials, multilingual families, clinical language issues
- Bullet points: expensive/time-consuming, don't reflect diverse populations, too clinical, only in English
- Closing paragraphs about spending hours creating materials and needing real tools

**4. `src/components/HowWeSupportTherapistsSection.tsx`** — Mirrors HowWeSupportParentsSection
- Heading: "How We Support Therapists"
- Subtitle: "Ready-to-use materials that save you time and better serve your clients."
- 6 cards (3x2 grid): Books & Therapy Guides (BUY NOW), Parent Resources (BUY NOW), Workshops & Training (LEARN MORE), Animated Podcast (YOUTUBE), Educational App (JOIN WAITING LIST), Stock Your Therapy Room (BUY NOW)

**5. `src/components/WhyTherapistsTrustSection.tsx`** — Mirrors WhyParentsTrustSection
- Heading: "Why Therapists Trust Empowered DLD"
- 5 check items: Designed for real-world practice, Evidence-based approach, Serves diverse populations, Saves you prep time, Families can use them
- Image: `download_2.png` (boy reading on bench)

**6. `src/components/TherapistsRightPlaceSection.tsx`** — Mirrors RightPlaceSection
- Heading: "You're in the right place if..."
- Intro: "You're a parent who:" (from Wix — likely "You're a therapist who:" adapted)
- Bullet points from the Wix reference
- CTA: "JOIN OUR FACEBOOK COMMUNITY"
- Image: `image-gen_56.png` (kids playing soccer)

### Modified Files

**7. `src/App.tsx`** — Add route `/for-therapists` pointing to ForTherapists page

### Assets to Copy
- `user-uploads://image-gen_68.png` → `src/assets/therapist-with-kids.png`
- `user-uploads://download_2.png` → `src/assets/boy-reading-bench.png`
- `user-uploads://image-gen_56.png` → `src/assets/kids-playing-soccer.png`

### Scope
- 6 new component files + 1 new page file
- 1 modified file (App.tsx route)
- 3 image assets copied
- All responsive patterns inherited from For Parents equivalents

