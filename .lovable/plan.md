
## Assessment: What Already Exists vs What Needs Building

The `/hub` route at `HubDashboard.tsx` already has a significant amount of the requested functionality:
- ✅ Protected route (redirects to `/hub/login`)
- ✅ Resource grid with filter sidebar (`FilterSidebar.tsx`)
- ✅ Search bar (header + mobile)
- ✅ Download tracking via `user_downloads`
- ✅ `useResources` hook with role-based filtering
- ✅ `ResourceDetailModal` for drawer/modal view
- ✅ Loading skeletons + empty state
- ✅ Grid/list view toggle
- ✅ Sort options

**What's missing or needs redesign:**
1. **Welcome banner** — personalized, dismissable, stored in Supabase (currently just a static heading)
2. **Navbar redesign** — needs audience filter tabs (All | Parents | Therapists | Educators) in center, user avatar initial circle in dropdown
3. **Filter bar redesign** — spec calls for horizontal pill filters below navbar, not a sidebar. Currently uses a left sidebar.
4. **`is_published` field** — resources table doesn't have this column; need migration + filter in query
5. **6 seed resources** — need to be inserted into the database
6. **Fade-in card animation** — cards should animate in on load
7. **Footer** — simple hub footer needed
8. **`download_events` table** — spec requests this name; currently using `user_downloads` (which is fine, same purpose)
9. **Welcome banner dismissed state** — needs a `profiles` column like `welcome_dismissed` to persist across sessions

### Database changes needed:
1. Add `is_published` boolean to `resources` table (default `true`)
2. Add `welcome_dismissed` boolean to `profiles` table (default `false`)
3. Seed the 6 starter resources

### Files to modify:

**`src/components/hub/HubHeader.tsx`**
- Add audience filter tabs (All | Parents | Therapists | Educators) — broadcast via custom event or shared state
- Replace dropdown trigger with avatar initial circle (first letter of name in colored circle)
- Keep settings and logout in dropdown

**`src/pages/hub/HubDashboard.tsx`**
- Add dismissable welcome banner (personalized, checks `profile.welcome_dismissed`, updates it on dismiss)
- Remove the sidebar layout, replace with horizontal pill filter bar below a search row
- Remove quick-start shortcut buttons (Most Popular / Browse by Age / Browse by Setting)
- Keep recommended section, resource grid, empty state, modal
- Add fade-in animation on resource cards
- Add simple footer at bottom

**`src/hooks/useResources.ts`**
- Add `is_published = true` filter to the Supabase query
- Add audience tab filter (roles) to be driven from the navbar tabs

**`src/components/hub/FilterSidebar.tsx`** — keep for mobile, but desktop will use horizontal pills

**`src/contexts/AuthContext.tsx`**
- Update Profile interface to include `welcome_dismissed: boolean | null`

### Key Design Decisions:
- Welcome banner: navy/purple background with coral accent text, X to dismiss. Calls `supabase.from('profiles').update({ welcome_dismissed: true })` on dismiss.
- Audience tabs in navbar: clicking sets a role filter visible across the library. Use a custom event (`hub-audience-filter`) or lift state. Since HubHeader and HubDashboard are siblings under HubLayout, a custom event is cleanest.
- Pill filters below search: compact row — "Audience:" pills + "Type:" pills, combinable. On mobile collapses to a "Filters" button opening a drawer.
- Resource cards: use `motion` library (already installed) for `fadeInUp` animation with staggered delay.
- Footer: single line `© 2026 Empowered DLD. All rights reserved.` in `HubLayout` or as a component.

### File plan:
1. **Migration** — add `is_published` to resources, `welcome_dismissed` to profiles
2. **Seed** — insert 6 starter resources
3. `src/contexts/AuthContext.tsx` — add `welcome_dismissed` to Profile type
4. `src/components/hub/HubHeader.tsx` — audience tabs + avatar circle
5. `src/pages/hub/HubDashboard.tsx` — full redesign: welcome banner, horizontal filter pills, fade-in grid, footer
6. `src/hooks/useResources.ts` — filter by `is_published`, handle audience tab event
7. `src/components/hub/HubLayout.tsx` — add footer
