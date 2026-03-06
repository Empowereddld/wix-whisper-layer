

## Reduce Section Padding on For Organizations Page

**Problem**: Most sections use `lg:py-[120px]` (240px total between sections), creating too much whitespace between content blocks.

**Approach**: Reduce the desktop padding from `120px` to `80px` across all For Organizations-specific sections. This keeps the page feeling spacious without the excessive gaps. The two sections already at `80px` (StrugglesCTA and HowWeSupport) stay as-is.

**Sections to update** (all `lg:py-[120px]` → `lg:py-[80px]`):
1. `OrganizationsAwarenessSection.tsx` 
2. `WhyOrganizationsChooseSection.tsx`
3. `PartnershipPackagesSection.tsx`
4. `OrganizationsLeadFormSection.tsx`

**Also reduce** the `IsThisRightForOrgSection.tsx` which uses smaller custom values — tighten proportionally.

No changes to shared components (DLDImpactSection, ResourceLibraryCTA, Footer) to avoid affecting other pages.

