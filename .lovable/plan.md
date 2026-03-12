

# Fix Blog Post Typography to Match Site Style

## Problem
The blog body uses Tailwind's `prose` classes from `@tailwindcss/typography` (which isn't even registered), resulting in unstyled, wall-of-text content with no paragraph spacing, heading hierarchy, or list formatting.

## Solution
Remove the `prose` dependency entirely and style the markdown output with custom CSS classes that match the site's existing typography system (DM Sans, consistent sizing/spacing, muted-foreground for body text).

### Changes

**1. `src/pages/BlogPost.tsx`** — Replace the `prose` container with a custom-styled wrapper class:
```tsx
<div className="max-w-[700px] mx-auto blog-content">
```

**2. `src/index.css`** — Add a `blog-content` utility class that styles all markdown elements to match the site's DM Sans typography:
- **Paragraphs**: `text-[15px] md:text-[16px]`, `leading-[1.7]`, `text-muted-foreground`, with `1.5rem` bottom margin
- **Headings (h2)**: `text-[24px] md:text-[28px]`, `font-bold`, `text-foreground`, matching site `h2` style
- **Headings (h3)**: `text-[20px] md:text-[22px]`, `font-semibold`
- **Lists (ul/ol)**: Proper indentation, bullet/number styling, consistent spacing
- **Blockquotes**: Left border with `border-primary`, italic, muted background
- **Bold/italic**: Proper `text-foreground` weight
- **Links**: `text-primary` with underline on hover
- **Images**: Rounded corners, full width, margin spacing

No new dependencies needed — just CSS that mirrors the existing site patterns.

