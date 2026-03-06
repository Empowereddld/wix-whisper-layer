

## Plan: Widen card title max-width to prevent three-line wrapping

The current `max-w-[160px]` is too narrow for "Books & Therapy Guides", causing it to wrap to three lines. Increase to `max-w-[180px]` so it fits on two lines while still forcing shorter titles like "Educational App" to wrap to two lines.

**File**: `src/components/HowWeSupportTherapistsSection.tsx` (line 62)  
Change `max-w-[160px]` → `max-w-[180px]`

