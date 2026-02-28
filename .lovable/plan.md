

## Problem

The logo PNG (`empowered-logo-white.png`) contains significant transparent padding baked into the image file. Every time we increase `h-48`, the invisible padding grows proportionally, pushing elements down and making alignment with "Quick Links" impossible via negative margins alone.

## Solution

Instead of fighting the image padding, place the logo inside a **fixed-height clipping container** (e.g. 40px tall) with `overflow-hidden`, and let the oversized image be positioned so only the visible "EmpoweredDLD" text shows through, aligned with the column headings.

### Technical Changes

**File: `src/components/Footer.tsx`** (line 29-30)

Replace the current logo `<img>` with a clipping wrapper:

```tsx
{/* Brand */}
<div>
  <div className="h-10 mb-5 overflow-hidden">
    <img 
      src={logoWhite} 
      alt="EmpoweredDLD logo" 
      className="h-48 -mt-[4.7rem] -ml-4" 
      style={{ objectFit: 'contain', objectPosition: 'left' }} 
    />
  </div>
  <p className="text-[13px] ...">
    Supporting 4,000+ families ...
  </p>
</div>
```

- The outer `div` (`h-10 overflow-hidden`) acts as a viewport/crop window -- only ~40px of the logo is visible
- The inner `img` stays at `h-48` but is shifted with `-mt-[4.7rem]` to position the actual text into the visible crop area
- The crop container's height matches the line height of "Quick Links", so they align perfectly
- No more pushing other elements -- the logo is fully contained

The exact `-mt` value may need fine-tuning (I'll test visually), but this approach guarantees the logo doesn't affect surrounding layout.
