

## Update Testimonial Band with Full-Length Quotes and Auto-Rotate

### Content Changes
Replace the 3 placeholder testimonials with the full-length versions from the Wix reference:

1. **Becca** (Parent): Full quote about finding Empowered DLD Parenting and gaining confidence, hope, and a roadmap.
2. **Stacie** (Parent): Full quote about the loneliness of parenting a child with DLD and feeling less alone.
3. **Brianne** (Speech Language Pathologist): Full quote about the community created and representation in materials.

### Visual Changes
- Keep name and role on **separate lines** (as currently implemented)
- Enlarge the decorative quote icon to ~60-70px to match the reference
- Widen the container from 620px to ~900px to accommodate longer quotes
- Increase section vertical padding for more breathing room
- Make navigation arrows slightly larger

### Behavior Changes
- Add **auto-rotation** every ~6 seconds using the `embla-carousel-autoplay` plugin (new dependency)
- Keep manual arrow navigation and dot indicators

### Technical Details

**New dependency:** `embla-carousel-autoplay`

**File:** `src/components/TestimonialBand.tsx`
- Replace testimonial data array with full quotes and correct author names/roles
- Import and configure autoplay plugin with 6-second delay
- Adjust container max-width, padding, icon size, and arrow size
