

## Shift Image Focus to Worker & Kids on Floor

The `orgKids` image currently uses `object-bottom` on tablet and `object-center` on desktop, which likely shows the background people rather than the worker and kids playing on the floor.

### Change in `OrganizationsAwarenessSection.tsx`:

1. **Tablet image (line 42)**: Change `object-bottom` to `object-[center_70%]` (or similar) to shift the visible crop area toward the foreground subjects (worker + kids on the floor)
2. **Desktop image (line 42)**: Change `lg:object-center` to `lg:object-[center_60%]` to similarly focus on the lower-center area where the activity is happening
3. **Mobile image (line 83)**: Apply the same `object-[center_70%]` positioning so the focal point is consistent across all breakpoints

The exact percentage may need fine-tuning, but `object-position: center 65-70%` should shift the crop to emphasize the foreground group rather than the standing people in the background.

