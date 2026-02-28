
# Empowered DLD Homepage — Implementation Plan

## Brand System
- **Primary purple**: #6241BE
- **Deep purple**: #3B2772
- **Light lavender**: #F6EFFF
- Applied consistently across buttons, icons, links, footer, accents

## Pages & Sections (in order, matching Wix screenshot)

### 1. Sticky Header (72px)
- White background, bottom border
- Logo left-aligned ("Empowered DLD" text logo)
- Navigation links right-aligned
- Purple "Login" button

### 2. Hero Section
- Two-column layout (58% image / 42% text on desktop, stacked on mobile)
- Large headline (44–48px, bold): placeholder text about DLD awareness
- Subtext paragraph in muted gray
- Purple CTA button ("Discover Our Resources")
- Placeholder hero image with rounded corners

### 3. Stat Band
- Near-black (#111) background, white text
- Left-aligned stat ("What affects 1 in 14 people?") with supporting text
- 120–140px height

### 4. "Start Here" — Choose Your Path Cards
- 4-column grid (desktop), 2 (tablet), 1 (mobile)
- Cards: light lavender (#F6EFFF) background, border, rounded, icons, title, description, small purple button
- Audiences: Parents/Caregivers, Providers/Clinicians, Teachers/Support Staff, Schools/Organizations
- Subtle hover lift + shadow

### 5. "How We Support Children with DLD" Feature Grid
- 3-column grid (desktop), 2 (tablet), 1 (mobile)
- 9 feature cards: white background, light border, icon + title + description
- Clean, minimal styling

### 6. Book Showcase ("Stories that celebrate brave kids with DLD")
- Left text block (45%) + right 2-column book card grid (55%)
- Book cards: white, light shadow, rounded, cover image placeholder
- Hover: slight lift

### 7. Trust Section ("Created by an SLP and teacher")
- Two-column: text left, founder image right
- Purple check icon bullet points
- Purple CTA button

### 8. Testimonial Band
- Deep purple (#3B2772) background, white text
- Centered quote, max-width 800px
- Carousel with fade transition, dots + arrows

### 9. "You Are Not Alone" Section
- Two-column: text left, warm family image right
- Light neutral background
- CTA button

### 10. Contact Section (with working form)
- Two-column: form left (50%), text panel right (50%)
- Form fields: name, email, message with validation (Zod)
- **Lovable Cloud backend**: edge function to store submissions in Supabase database
- Purple submit button, full-width on mobile

### 11. Footer
- Deep purple (#3B2772) background, white text
- 4-column layout (desktop), stacked on mobile
- Newsletter email input field
- Social media icon links
- Logo + tagline

## Technical Approach
- All placeholder content — text and images will use clean placeholders you can replace later
- Fully responsive: desktop, tablet, mobile breakpoints
- Accessibility: 16px min body text, focus states, reduced-motion support, alt text, explicit button labels
- Performance: lazy-loaded images below fold, optimized layout to prevent CLS
- Lovable Cloud for contact form submissions (database table + edge function)
- Testimonial carousel built with Embla (already installed)
