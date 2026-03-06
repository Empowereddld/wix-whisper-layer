

## Spacing Improvements for the Awareness Section

Looking at the screenshot reference and the current code, the spacing issues are:

1. **Bullet list items are too tight** -- `space-y-2` (8px) vs the reference which shows generous spacing between each bullet (~16-20px)
2. **Gap between intro text and bullet list** could be larger
3. **Gap between bullet list and "Let's Talk" heading** needs more breathing room
4. **Gap between the consultation description and the button** could use more space
5. **Title-to-grid gap** looks good in the reference at roughly the current size

### Changes to `src/components/OrganizationsAwarenessSection.tsx`:

- Increase bullet list `space-y` from `space-y-2` to `space-y-4` for more generous vertical rhythm between list items
- Increase margin below intro paragraph from `mb-4 md:mb-5` to `mb-5 md:mb-6`
- Increase margin below bullet list from `mb-6 md:mb-8` to `mb-8 md:mb-10` for more separation before the CTA block
- Increase margin below "Let's Talk" heading from `mb-3` to `mb-4`
- Increase margin below consultation description from `mb-6 md:mb-8` to `mb-8 md:mb-10`

These are minor CSS-only tweaks to match the airy, editorial spacing visible in the reference screenshot.

