

## Plan: iPad-only image framing fix

**1. `src/components/ForTherapistsHero.tsx` (line 32)**
- Change `md:object-[center_35%]` → `md:object-[center_45%]` to shift the visible area down slightly on iPad

**2. `src/components/WhyTherapistsTrustSection.tsx` (line 60)**
- Change `object-bottom` → `object-[center_70%] md:object-[center_35%]` so mobile shows mostly lower portion while iPad centers higher to keep the boy's face visible

