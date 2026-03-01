

## Mobile and iPad Responsive Optimization

A comprehensive pass across all sections to ensure a clean, airy mobile experience. Here's what will be adjusted in each component:

### 1. Header (`Header.tsx`)
- Reduce header height on mobile from 90px to 70px
- Scale down the oversized logo on mobile
- Add more spacing and padding to mobile menu items for easier tap targets
- Add a shopping cart icon + LOGIN button to the mobile menu

### 2. Hero Section (`HeroSection.tsx`)
- On mobile, stack image above text (currently correct) but reduce image height to ~40vh so text isn't pushed too far down
- Reduce heading size on mobile from 44px to 34px for breathing room
- Add more horizontal padding on mobile (px-6) for an airy feel
- On iPad (md), keep the side-by-side layout but reduce heading from 66px to 52px

### 3. Stat Band (`StatBand.tsx`)
- Reduce heading size on mobile to 28px
- Add more vertical padding on mobile (py-10)
- Already stacks well -- minor spacing tweaks

### 4. Choose Your Path (`ChoosePathSection.tsx`)
- On mobile, show cards in a single column with slightly more vertical gap
- Reduce section heading from 40px to 32px on mobile
- On iPad (sm), keep 2-column grid -- already works

### 5. Support Section (`SupportSection.tsx`)
- Reduce heading from 40px to 30px on mobile
- On mobile, single column cards with more breathing room (gap-4)
- On iPad, 2-column grid -- already works

### 6. Book Showcase (`BookShowcase.tsx`)
- On mobile, stack text above book grid (single column) -- already works
- Reduce book cover heights on mobile from h-44 to h-36
- Add more gap between text section and book grid on mobile

### 7. Trust Section (`TrustSection.tsx`)
- On mobile, stack all 3 columns vertically with generous spacing
- Limit founders photo width on mobile to ~260px for a cleaner look
- Boy reading image gets a fixed height on mobile (h-[300px])

### 8. Testimonial Band (`TestimonialBand.tsx`)
- Reduce quote font size on mobile to 14px
- Add more horizontal padding on mobile for the quote text
- Reduce the Quote icon size on mobile

### 9. Not Alone Section (`NotAloneSection.tsx`)
- Reduce outer padding on mobile (p-5 instead of p-8)
- Reduce heading from 32px to 26px on mobile
- Image gets adequate height on mobile

### 10. Contact Section (`ContactSection.tsx`)
- On mobile, make the 2-column form field rows (first/last name, email/position) stack to single column
- Reduce right-side heading from 36px to 28px on mobile
- Add more padding inside the form card on mobile
- Reorder on mobile: text content first, then form below (for context before action)

### 11. Footer (`Footer.tsx`)
- On mobile, single column for all 4 footer sections with clear spacing
- Newsletter inputs go full width
- Social icons center on mobile
- Add a subtle divider or extra spacing between sections

### Technical Approach
All changes use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) -- no new dependencies needed. The key theme is: **smaller text, more whitespace, single-column stacking, and generous tap targets on mobile**.

### Files to Edit
- `src/components/Header.tsx`
- `src/components/HeroSection.tsx`
- `src/components/StatBand.tsx`
- `src/components/ChoosePathSection.tsx`
- `src/components/SupportSection.tsx`
- `src/components/BookShowcase.tsx`
- `src/components/TrustSection.tsx`
- `src/components/TestimonialBand.tsx`
- `src/components/NotAloneSection.tsx`
- `src/components/ContactSection.tsx`
- `src/components/Footer.tsx`
