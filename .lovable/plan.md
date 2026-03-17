

## Fix: Align "Total" and price closer together

The "Total" label and price amount in the `PurchaseModal` are currently spaced apart using `justify-between` on the full width. The user wants them visually closer.

### Change
In `src/components/hub/PurchaseModal.tsx`, update the price row from `justify-between` (which pushes them to opposite edges) to `justify-end gap-3` so both "Total" and the price sit together on the right side — or alternatively use `justify-center gap-4` to center them together.

Best approach: keep `justify-between` but add padding to shrink the row, or switch to `flex items-center justify-center gap-4` so the label and price are adjacent and centered.

**File:** `src/components/hub/PurchaseModal.tsx` — change the price container div from:
```
<div className="flex items-center justify-between p-4 rounded-xl bg-midnight/5">
```
to:
```
<div className="flex items-center justify-center gap-4 p-4 rounded-xl bg-midnight/5">
```

This centers "Total" and the price together instead of pushing them to opposite edges.

