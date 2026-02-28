

## Update Footer to Match Wix Reference

Rebuild the footer to pixel-match the Wix reference screenshots. The uploaded logo image (`empowered_logo_26.png`) appears to be a white version of the EmpoweredDLD logo for use on the dark background.

### Layout (from reference)

The footer has two main rows on a deep purple background:

**Row 1 -- Top section (4-column grid):**
- **Column 1 (Brand):** EmpoweredDLD logo image (use uploaded `empowered_logo_26.png`), followed by body text: "Supporting 4,000+ families and professionals with evidence-based resources, multilingual materials, and community connection for children with Developmental Language Disorder."
- **Column 2 (Quick Links):** Bold heading "Quick Links", links: Home, About, Services, Contact Us
- **Column 3 (Useful Links):** Bold heading "Useful Links", links: Privacy Policy, Terms & Conditions, Disclaimer, Support
- **Column 4 (Contact):** Bold heading "Contact", with a mail icon + "hello@empowereddldparenting.com"

**Row 2 -- Bottom section (split into left + right):**
- **Left:** Social icons (Facebook, WhatsApp, Instagram) -- large, white, ~32px
- **Right:** "Subscribe to Our Newsletter" heading (serif/italic style), two stacked input fields with white borders on dark bg, and a white-outlined "SUBSCRIBE" button

### Key Styling Differences from Current
- Logo is an image, not text
- Brand description text is updated
- Quick Links changed to: Home, About, Services, Contact Us
- Useful Links changed to: Privacy Policy, Terms & Conditions, Disclaimer, Support
- Contact email changed to hello@empowereddldparenting.com (with mail icon)
- Social icons are larger (~32px), white, and include WhatsApp instead of YouTube
- Newsletter section is right-aligned with a serif italic heading, two separate input fields stacked, and a bordered "SUBSCRIBE" button
- No bottom copyright bar visible in reference
- Newsletter inputs have white border, transparent bg styling

### Technical Details

**File:** `src/assets/empowered-logo-white.png` -- Copy uploaded logo
**File:** `src/components/Footer.tsx` -- Full rewrite to match reference layout

- Replace text logo with imported image logo
- Update grid to 4 columns: brand (wider), Quick Links, Useful Links, Contact
- Update link lists to match reference exactly
- Replace bottom bar with two-column layout: social icons (left) + newsletter (right)
- Use `MessageCircle` or a WhatsApp SVG icon for WhatsApp
- Newsletter heading uses `font-serif italic` styling
- Input fields use `bg-transparent border border-white/50` styling
- SUBSCRIBE button: white border, transparent bg, uppercase tracking
