

## Restore stacked multi-slide carousel with proper containment

You're right -- the stacked look communicates "there are many resources" much better than a single-slide fade. The original glitch was caused by high z-index values (`z-[999]`) and 3D transforms (`translateZ`) escaping the card boundaries. We can bring back the stack while keeping it fully contained.

### Approach

**File:** `src/components/InsideDLDResourceHub.tsx`

1. **Render all slides simultaneously** -- go back to `items.map()` so all images are in the DOM, stacked on top of each other with `absolute` positioning.

2. **Active slide on top, others behind** -- use low, local z-index values only (`z-[2]` for active, `z-[1]` for others). No `z-[999]`.

3. **Inactive slides: slightly scaled down + offset** -- animate inactive slides to `scale: 0.95, opacity: 0.5` with a small `y` offset (e.g. `8px`) to create the visual "stack" depth effect without any 3D transforms or `translateZ`.

4. **Containment on the image wrapper** -- keep `overflow-hidden isolate` on the image container div so nothing escapes the card boundary. The `isolate` creates a local stacking context; `overflow-hidden` clips any visual leak.

5. **Containment on the card wrapper** -- keep `relative isolate` on the outer grid div to double-ensure the entire carousel stays below the sticky header (`z-50`).

6. **No `randomRotateY`** -- skip the random rotation that caused jitter. The depth effect comes purely from scale + y-offset + opacity.

### Visual result

```text
┌─────────────────────────────┐
│  ┌───────────────────────┐  │  ← inactive (scale 0.95, y+8, opacity 0.5)
│  │ ┌─────────────────┐   │  │  ← inactive (scale 0.95, y+4, opacity 0.5)
│  │ │  ACTIVE SLIDE    │   │  │  ← active (scale 1, opacity 1, z-[2])
│  │ └─────────────────┘   │  │
│  └───────────────────────┘  │
│  overflow-hidden isolate    │
└─────────────────────────────┘
```

All animation values stay small and 2D-only, and the `overflow-hidden` clips everything to the container.

