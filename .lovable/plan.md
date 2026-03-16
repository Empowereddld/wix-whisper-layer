

## Plan: Increase Resource Card Sizes in "Explore the Resource Library"

### Current State
The resource preview section uses:
- Container: `max-w-[1100px]` with standard padding
- Grid: 3 columns on lg+ (`lg:grid-cols-3`), 2 on sm+ (`sm:grid-cols-2`), 1 on mobile
- Card image height: `h-40` (160px)
- Card padding: `p-5` (20px)
- Gap between cards: `gap-6` (24px)

### Proposed Changes

**1. Increase Container Width**
- Change from `max-w-[1100px]` to `max-w-[1200px]` to give cards more breathing room
- This provides ~100px more width, distributed across the 3 columns

**2. Increase Card Image Height**
- Change from `h-40` (160px) to `h-52` (208px)
- This makes preview images 30% taller and more prominent
- Resource previews will be easier to scan and evaluate

**3. Increase Card Content Padding**
- Change from `p-5` (20px) to `p-6` (24px)
- Provides more space around title, description, and tags
- Improves readability without feeling cramped

**4. Increase Card Gap**
- Change from `gap-6` (24px) to `gap-8` (32px)
- Creates better visual separation between cards
- Prevents cards from feeling crowded

**5. Increase Typography**
- Card title: Add `text-base` or `text-[15px]` to make titles more readable
- Currently using default font size which feels small for larger cards

### Responsive Behavior
- Mobile (< 640px): Single column, cards stack vertically
- Tablet (640px - 1023px): 2 columns with increased spacing
- Desktop (1024px+): 3 columns with larger cards and more prominent previews

### Visual Impact
The changes will:
- Make resource previews 30% larger and easier to evaluate
- Improve title and description readability
- Create better visual hierarchy and balance with other page sections
- Maintain the clean, editorial design style
- Keep the same responsive grid behavior

