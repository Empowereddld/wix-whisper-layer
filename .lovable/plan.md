

## Plan: Revamp Contact Form on Work With Us Page

### Database Changes
The current `contact_submissions` table has fields: `first_name`, `last_name`, `company_name`, `email`, `position`, `questions`. The new form has different fields, so we need to add columns:

**New migration** — add columns to `contact_submissions`:
- `role` (text, nullable) — for the "I am a" dropdown
- `interested_in` (text[], nullable) — for the multi-select checkboxes
- `preferred_timeline` (text, nullable) — optional date/timeline field

We'll repurpose existing columns:
- `first_name` → stores full name (rename label only, column stays)
- `company_name` → stores organization name
- `questions` → stores "Tell us about your goals and audience"
- `email` stays
- `last_name` and `position` become unused (keep nullable, no breakage)

### Component Changes (`src/components/ContactSection.tsx`)

Replace the entire form with new fields:

1. **Your Name** — single text input (maps to `first_name`)
2. **Email Address** — email input (maps to `email`)
3. **Organization Name** — text input (maps to `company_name`)
4. **I am a:** — Select dropdown with 5 options (maps to new `role` column)
5. **I'm interested in:** — Checkbox group, multi-select (maps to new `interested_in` column)
   - Speaking Engagement, Custom Workshop, Consultation Services, Not sure yet
6. **Preferred Date(s) or Timeline** — optional text input (maps to new `preferred_timeline` column)
7. **Tell us about your goals and audience** — required textarea (maps to `questions`)
8. **Button**: "Send Inquiry" instead of "Send Message"
9. **Helper text** below button: "We'll respond within 48 hours to schedule a discovery call."

Update the Zod schema accordingly. Keep the same visual style (bottom-border inputs, uppercase labels, white card).

