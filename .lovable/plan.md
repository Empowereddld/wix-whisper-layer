

# Exact Copy Correction Pass

## Problem
Multiple text strings across the site don't match the original Wix homepage. Navigation structure, section labels, card titles, descriptions, and button text all need correction.

---

## Section-by-Section Text Corrections

### 1. Header Navigation (`Header.tsx`)
The Wix site uses **7 flat navigation links** -- no dropdown submenus.

| Current (wrong) | Wix (correct) |
|---|---|
| HOME, WHO WE SERVE (dropdown), SHOP (dropdown), RESOURCES (dropdown), WORK WITH US (dropdown), ABOUT DLD, BLOG, CONTACT | HOME, ABOUT DLD, RESOURCES, FOR PARENTS, ARTICLES, BOOKS, CONTACT |

**Changes**: Remove all `submenu` arrays. Replace nav links with the 7 flat links from the Wix site. Keep cart icon and LOGIN button.

---

### 2. Hero Section (`HeroSection.tsx`)

| Current | Wix |
|---|---|
| "SUPPORTING CHILDREN WITH DLD" | "SUPPORT FOR CHILDREN WITH DLD" |
| Body: "We partner with families, educators, clinicians, and organizations to bring clear, practical DLD resources into homes, schools, and communities." | Body: "We partner with families, educators, clinicians and organizations to bring clear, practical DLD resources into homes, schools and communities." (minor comma differences) |

**Changes**: Update subhead text. Adjust body copy to remove Oxford commas to match Wix exactly.

---

### 3. Stat Band (`StatBand.tsx`)
Text appears to match. **No changes needed.**

---

### 4. Choose Your Path (`ChoosePathSection.tsx`)

| Card | Current Title | Wix Title |
|---|---|---|
| Card 2 | "For Therapists / Clinicians" | "For Providers/Clinicians" |
| Card 3 | "For Educators and Support Staff" | "For Teachers and Support Staff" |

Card descriptions also need review -- the Wix descriptions may differ slightly. Will update to match the visible text from the reference.

**Changes**: Fix card 2 and card 3 titles. Review and correct descriptions.

---

### 5. Support Section (`SupportSection.tsx`)

The Wix reference shows the right-side paragraph text. Current text: "Our comprehensive approach addresses every aspect of a child's language journey -- from evidence-based tools for families to professional development for educators."

This appears close but may have minor wording differences. Will verify and correct.

The 9th card title in Wix appears to read "All Resources for Miners" (or similar -- hard to read at this resolution). Will update if discrepancy is confirmed.

**Changes**: Correct any description text mismatches.

---

### 6. Book Showcase (`BookShowcase.tsx`)

Book titles and body copy appear to match. **Minimal or no changes needed.**

---

### 7. Trust Section (`TrustSection.tsx`)

The body copy paragraphs and bullet points need verification against the Wix reference. Current text may be paraphrased rather than exact.

**Changes**: Verify and correct body paragraphs and bullet point text.

---

### 8. Not Alone Section (`NotAloneSection.tsx`)

Current body: "Join a warm, supportive community of families and professionals who understand your journey."

The Wix reference text appears to read something like: "Join a warm, supportive community for parents and families." (exact text hard to read at resolution).

**Changes**: Update body text to match Wix.

---

### 9. Contact Section (`ContactSection.tsx`)

Body text current: "Have a question or want to learn more? We'd love to hear from you."

Wix reference may have different body copy. Will verify and correct.

**Changes**: Update body text if different.

---

### 10. Footer (`Footer.tsx`)

The Wix footer's 4th column is labeled **"Contact"** (with contact info like address and email), not "Subscribe to our Newsletter". The newsletter subscription appears below the main columns.

**Changes**: 
- Rename 4th column from "Subscribe to our Newsletter" to "Contact"
- Add contact details (address, email, phone)
- Move newsletter subscription to a separate row or below the contact column

---

## Technical Summary

**Files to modify (7):**
1. `src/components/Header.tsx` -- Replace nav with 7 flat links, remove all dropdown submenus
2. `src/components/HeroSection.tsx` -- Fix subhead text
3. `src/components/ChoosePathSection.tsx` -- Fix card 2 and card 3 titles
4. `src/components/SupportSection.tsx` -- Fix any description mismatches
5. `src/components/TrustSection.tsx` -- Verify and correct body copy
6. `src/components/NotAloneSection.tsx` -- Fix body text
7. `src/components/Footer.tsx` -- Restructure 4th column to "Contact" with contact info

**No new dependencies required. No layout changes -- text and navigation structure only.**

