

## Update CTA labels in "How We Support Parents" cards

The user wants to standardize the card link labels for consistency and polish. This is a single change in `src/components/HowWeSupportParentsSection.tsx` — updating the `link` values in the `cards` array.

### Changes (lines 5-36 of `HowWeSupportParentsSection.tsx`):

| Card | Current | New |
|------|---------|-----|
| Parent Workshops | Join Waiting List | Join Workshop Waitlist |
| Books and Resources | Buy Now | Explore the Books |
| Free Community | Join Here | Join the Community |
| Free Resources | Learn More | Browse Resources |
| Animated Podcast | YouTube | Watch the Podcast |
| Educational App | Join Waiting List | Join the App Waitlist |

Single file, six string changes. No layout or styling modifications needed.

