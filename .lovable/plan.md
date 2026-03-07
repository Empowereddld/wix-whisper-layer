

## Plan: Unify Global Community and Every Child Sections Across All Pages

### Problem
There are two versions of the "Join a Global Community" section: `ShopGlobalCommunity` (newer, better styled with suffix separation and larger numbers) and `GlobalCommunitySection` (older, smaller numbers, narrower container). The user wants them all to match the Shop versions shown in the screenshots.

### Changes

**1. Replace `GlobalCommunitySection` with `ShopGlobalCommunity` on the Resources page**
- Update `src/pages/Resources.tsx` to import and use `ShopGlobalCommunity` instead of `GlobalCommunitySection`
- The `ShopGlobalCommunity` component already matches the reference screenshot (larger numbers with superscript suffixes, wider container, bolder labels)

**2. Delete the old `GlobalCommunitySection` component**
- Remove `src/components/GlobalCommunitySection.tsx` since it will no longer be used anywhere

**3. `EveryChildSection` — already shared**
- The `EveryChildSection` component is already the same component used on Shop, Resources, and WhoWeServe pages, so no changes needed there. It already matches the reference screenshot with the gray card, overlapping image, and deep-purple CTA button.

### Summary
One file edit (Resources.tsx import swap) and one file deletion. No visual changes needed to EveryChildSection since it's already consistent.

