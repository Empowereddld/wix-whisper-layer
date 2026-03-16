

## Plan: Update All 16 Resource Descriptions

### What Changes

1. **Database updates** — Update `description` (short card text) and `long_description` (preview page text) for all 16 resources
2. **Detail page tweak** — Change the right-column description on `ResourceDetail.tsx` to display `long_description` when available, falling back to `description`

### Data Updates (via insert tool)

All 16 resources will be updated with two fields each:
- `description` → the short "Card" text (shown on hub grid cards, truncated via line-clamp)
- `long_description` → the longer "Preview" text (shown in the right column of the detail page)

Resource mapping by ID:
| Resource | ID |
|---|---|
| Daria's Tips for Starting Conversations | a97360be |
| Word Finding Strategies | c2234d34 |
| Dan and Daria Self Advocacy | aa22b1a2 |
| Emotion Word Poster and Guide | d4dc87d2 |
| Describing and Connecting Words | f48cb30f |
| Tips for Little Talkers | 1ec8b8da |
| Graphic Organizers | 31f2e93e |
| Accommodations and Modifications | ef7ab4af |
| Language Impact Checklist | 84599638 |
| Executive Function Skills | d9836a63 |
| Parent Child Conversation Starters | 2630ce77 |
| Classroom Discussion Questions | a91a8a2d |
| Navigating DLD Together | b7e364af |
| Why Representation Matters | 8088506a |
| DLD Infographic | a3ff1443 |
| Parent Email Templates (Advocacy Toolkit) | 8b4aeeb0 |

### Code Change

**File: `src/pages/hub/ResourceDetail.tsx`** (line 212)

Change:
```tsx
{resource.description}
```
To:
```tsx
{resource.long_description || resource.description}
```

This ensures the preview page shows the longer description when available, while cards continue showing the short `description` via the existing `ResourceCard` component.

### No Schema Changes

Both `description` and `long_description` columns already exist on the `resources` table. Only data updates needed.

