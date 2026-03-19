

## Open External Links in New Tab

The issue: Several card components use `<a href={card.href}>` for links that mix internal (`/contact`) and external (`https://...`) URLs, but don't add `target="_blank"` for external ones.

### Components that need fixing

These components render cards with a mix of internal/external hrefs but never set `target="_blank"`:

1. **`src/components/HowWeSupportParentsSection.tsx`** — "Free Community" and "Animated Podcast" cards link to Facebook and YouTube
2. **`src/components/HowWeSupportTherapistsSection.tsx`** — "Animated Podcast" card links to YouTube

### Components already correct
- `SupportSection.tsx` — already checks `external` flag and adds `target="_blank"`
- `Footer.tsx` — social links already have `target="_blank"`
- `BlogPostCTA.tsx` — podcast CTA already has `target="_blank"`
- All Book sections, `CreatedByExpertsSection`, `FreeCourseHero`, `ForParentsHero`, `NotAloneSection`, `RightPlaceSection`, `Podcasts.tsx` — already have `target="_blank"`

### Implementation

For both `HowWeSupportParentsSection.tsx` and `HowWeSupportTherapistsSection.tsx`:
- Check if `card.href` starts with `http` in the `<a>` tag
- If external, add `target="_blank" rel="noopener noreferrer"`
- This is a simple conditional attribute addition on the existing `<a>` elements

