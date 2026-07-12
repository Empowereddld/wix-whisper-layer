Add a total user count to the Admin Users page

- Add a count next to the "Users" page title that shows the total number of Hub users (full unfiltered list).
- Use the existing `profiles` table and query only for the count, separate from the filtered list, so the total stays stable while searching or filtering.
- Display it as a small badge or muted text beside the title, matching the existing admin panel styling.
- Files to modify: `src/pages/admin/AdminUsers.tsx`.