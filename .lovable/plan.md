

## Problem

The WHO WE SERVE dropdown opens but instantly closes because a single `dropdownRef` is shared across both dropdown nav items. In React's `.map()`, the ref gets reassigned on each iteration, so it only ever points to the **last** dropdown (RESOURCES). When you open WHO WE SERVE, the click-outside handler checks if the click is inside the RESOURCES container — it isn't — so it immediately closes the dropdown.

## Fix

Replace the single `ref` approach with a proper click-outside pattern that accounts for multiple dropdowns:

1. **Remove the single `dropdownRef`** and its `useEffect` click-outside handler.
2. **Use a wrapper ref** on the entire `<nav>` element (or use a callback ref pattern) so the click-outside handler checks if the click is inside *any* dropdown parent.
3. Alternatively, the simplest fix: use a single ref that wraps the entire nav bar, so any click inside the nav (including either dropdown) is considered "inside."

### Implementation (simplest approach)

In `src/components/Header.tsx`:
- Move `ref={dropdownRef}` from the individual dropdown `<div>` elements to the parent `<nav>` element.
- Remove `ref={dropdownRef}` from each `<div key={link.label} ...>` inside the map.
- This way, clicking either dropdown's chevron or submenu is inside the ref, and only clicks truly outside the nav will close the dropdown.

This is a ~3-line change in a single file.

