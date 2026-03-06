

## Plan: Premium Layered Image Composition for Awareness Section

Replace the single flat image in `OrganizationsAwarenessSection` with a layered, floating dual-image composition inspired by the Salient reference screenshot.

### Changes

**1. Add floating animation keyframes** (`tailwind.config.ts`)
- Add two keyframes: `float-gentle` and `float-gentle-alt` with very slow, minimal vertical drift (3-4px over 6-8s)
- Slightly different durations so cards move out of sync
- Register corresponding animation utilities

**2. Rewrite the image area** (`OrganizationsAwarenessSection.tsx`)
- Replace the single `<img>` with a relative container holding two image cards:
  - **Back card**: Slightly larger, offset top-left, subtle rotation (~-2deg), `z-10`, soft shadow, slower float animation
  - **Front card**: Positioned overlapping in front, offset bottom-right, slight rotation (~1deg), `z-20`, stronger shadow, alternate float animation
- Both cards get `rounded-2xl`, `overflow-hidden`, and `shadow-lg`/`shadow-xl`
- Use the same `org-kids.png` for the front card; import `org-community.png` (already exists in assets) for the back card
- Desktop: full layered composition with offsets via absolute positioning inside a relative wrapper
- Mobile: stack simplified — show both images side-by-side or as a single prominent image with the second peeking behind, scaled down

**3. Responsive behavior**
- On `lg+`: relative container ~450px tall, both cards absolutely positioned with offsets
- On mobile/tablet: reduce container height, tighten offsets so images don't overflow, keep the layered feel but more compact

### Visual Details
- Back image: `top-0 left-0`, ~75% width, slight negative rotation
- Front image: `bottom-0 right-0`, ~75% width, slight positive rotation
- Shadows use the existing `--shadow-elevated` token for consistency
- Float animation: pure translateY, 6s and 7s durations, ease-in-out, infinite

