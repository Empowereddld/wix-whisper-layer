

## Plan: Redesign Resource Detail Page with Two-Column Layout and "You May Also Like" Section

### What Changes

Replace the current single-column `ResourceDetail` page (`src/pages/hub/ResourceDetail.tsx`) with a new two-column layout and add a "You May Also Like" section.

### Layout Structure

```text
┌──────────────────────────────────────────────┐
│  ← Back to Resource Library                  │
├──────────────────────────────────────────────┤
│                                              │
│  ┌──────────────┐  ┌──────────────────────┐  │
│  │              │  │ Title (large, bold)  │  │
│  │   Resource   │  │ Free/Paid badge      │  │
│  │   Cover      │  │ Audience tags (pills)│  │
│  │   Image      │  │ Full description     │  │
│  │  (grey box)  │  │                      │  │
│  │              │  │ [Download] / [Unlock] │  │
│  └──────────────┘  └──────────────────────┘  │
│                                              │
├──────────────── divider ─────────────────────┤
│                                              │
│  You May Also Like                           │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐      │
│  │  Card   │  │  Card   │  │  Card   │      │
│  └─────────┘  └─────────┘  └─────────┘      │
│                                              │
└──────────────────────────────────────────────┘
```

### Implementation Details

**File: `src/pages/hub/ResourceDetail.tsx`** — Full rewrite:

1. **Back navigation**: "← Back to Resource Library" link at top, navigating to `/hub`

2. **Two-column section** (`grid grid-cols-1 lg:grid-cols-2 gap-8`):
   - **Left column**: Large image area showing `resource.thumbnail_url` if available, otherwise a grey placeholder (`bg-gray-100 border border-gray-200 rounded-xl`) with the type icon. Image uses `object-cover` and matches the right column height.
   - **Right column** (stacked vertically):
     - Title in large bold midnight text
     - Free badge (green) or Paid badge (deep-purple with price)
     - Audience tags as pale-yellow pills with deep-purple text (matching card styling)
     - Full description text, no truncation
     - Download button (dark navy/midnight) or Unlock button (deep-purple) at the bottom, using `mt-auto` to push down

3. **Divider**: A simple `<hr>` or border separator

4. **"You May Also Like" section**:
   - Fetch all resources, filter to same audience roles as current resource, exclude current resource, pick 3 (random or first 3)
   - If fewer than 3 from same audience, backfill from other resources
   - Render using existing `ResourceCard` component in a 3-column grid
   - Cards include full existing functionality (thumbnail, title, description, tags, badges, Preview/Download buttons)

5. **Mobile responsive**: Columns stack vertically at `< lg` breakpoint (image on top, details below)

6. **Purchase modal**: Keep existing `PurchaseModal` integration for paid resources

### No Database Changes Required

All data already exists in the `resources` and `products` tables.

### Files Modified
- `src/pages/hub/ResourceDetail.tsx` — Full rewrite with new layout

