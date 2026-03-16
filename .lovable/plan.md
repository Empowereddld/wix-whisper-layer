

## Plan: Add "Saved" Filter Pill to Resource Hub Dashboard

### Approach
Add a "Saved" pill with a heart icon to the existing audience filter row on the dashboard. When active, it filters the grid to show only the user's saved/favourited resources. This is the simplest approach — no new page or route needed.

### Changes

**1. `src/pages/hub/HubDashboard.tsx`**
- Add a "Saved" pill (with `Heart` icon) after the audience pills
- Track a `showSavedOnly` boolean state
- When active, filter the `filtered` array to only include resources whose ID is in `savedIds`
- Clicking "Saved" deselects the audience filter and vice versa
- Show the count of saved resources on the pill

**2. Behaviour details**
- The "Saved" pill sits visually separated (with a divider or gap) from the audience pills to indicate it's a different type of filter
- When "Saved" is active, search and sort still apply on top
- If no saved resources exist, show an empty state: "You haven't saved any resources yet. Click the heart icon on any resource to save it here."
- Clicking an audience pill while "Saved" is active deactivates the saved filter

### No database or backend changes required
The `saved_resources` table and `useSavedResources` hook already provide everything needed.

