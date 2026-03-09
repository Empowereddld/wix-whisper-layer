

## Plan: Simplify Homepage Contact Form to Match Wix Reference

The Wix reference shows a simpler, more general contact form with: First Name, Last Name, Company Name, Email, Position, Questions, and a "Send Message" button. The current homepage form is identical to the Work With Us form (role dropdown, interest checkboxes, timeline). We'll simplify the homepage version while keeping the Work With Us form unchanged.

The database already has `last_name` and `position` columns on `contact_submissions`, so no migration needed.

### Changes (single file: `src/components/ContactSection.tsx`)

**New form fields** (matching Wix reference):
1. **First Name** + **Last Name** (side-by-side row)
2. **Company Name** (full width)
3. **Email** + **Position** (side-by-side row)
4. **Questions** (textarea)
5. **Send Message** button

**Schema update**: Simplify the Zod schema to validate only these 6 fields. `lastName`, `position` are optional (matching the Wix reference where only First Name, Company, Email, and Questions are required).

**Database insert**: Map to existing `contact_submissions` columns — `first_name`, `last_name`, `company_name`, `email`, `position`, `questions`. Remove `role`, `interested_in`, `preferred_timeline` from the insert (they're all nullable).

**Remove**: Role dropdown, Interest checkboxes, Timeline input, and their associated imports (`Checkbox`, `Select` components) and constants (`ROLE_OPTIONS`, `INTEREST_OPTIONS`).

