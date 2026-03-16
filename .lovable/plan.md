

## Plan: Simplify the Resource Hub

### 1. `src/pages/hub/HubDashboard.tsx` — Major simplification

- **Remove** the `PURCHASE_FILTER_PILLS` and `TYPE_PILLS` constants and all their UI (the "Show:" row and "Type:" row)
- **Remove** `showSaved`, `priceFilter`, `activeType` state and related logic
- **Remove** the entire "Recommended for…" section (lines 226–245)
- **Remove** the mobile filter drawer (lines 336–360) and the Filters button in the toolbar
- **Remove** the view mode toggle (grid/list) — keep grid only
- **Remove** active filter chips section
- **Simplify `displayResources`** — no more price/saved filtering, just use `filtered` directly
- **Update welcome banner**: 
  - First visit: `"Welcome, {first_name}, to the DLD Resource Hub"`
  - Return visit: `"Welcome back, {first_name}!"`
  - Both followed by: `"Browse practical tools designed to support children with Developmental Language Disorder."`
  - Remove the dismiss button — show as a static header, not a dismissable banner
- **Update section title** from dynamic titles to static `"Resource Library"`
- **Update empty state** text: replace "premium" → "paid"
- **Keep**: search bar, sort dropdown, card grid (3-col), resource request FAB, modals

### 2. `src/components/hub/ResourceCard.tsx` — Simplify labels & rename buttons

- **Rename** "View" button → "Preview"
- **Replace** "Premium" references → "Paid"  
- **Simplify tags section**: Show max 1–2 audience tags using a primary label format:
  - `parent` → "Parent Resource"
  - `educator` → "Educator Resource"  
  - `slp` → "Therapist Resource"
  - `school_leader` → "School Leader Resource"
  - Show up to 2 if the resource genuinely serves multiple audiences
  - Remove the resource type tag and setting tags from the card face

### 3. `src/components/hub/HubHeader.tsx` — Already correct

The header already has "Therapists" for the SLP tab. No changes needed.

### 4. `src/hooks/useResources.ts` — Minor cleanup

- The `toggleFilter` type already excludes `audienceTab`. No changes strictly required, but the unused filter categories will simply go unused.

### Files changed
- `src/pages/hub/HubDashboard.tsx` — major rewrite
- `src/components/hub/ResourceCard.tsx` — label simplification + button rename

