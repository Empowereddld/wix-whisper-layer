

## Fix DoesSoundFamiliarSection — Separate Work With Us and For Parents content

### Problem
The `DoesSoundFamiliarSection` component is shared by both `/for-parents` and `/work-with-us`. Its content was replaced with "Who We Work With" copy meant for Work With Us, breaking the For Parents page.

The original parent-focused content cannot be recovered from the current codebase. However, you can try restoring it from version history:

<lov-actions>
  <lov-open-history>View History</lov-open-history>
</lov-actions>

If you can find and share the original text from history, I'll restore it exactly.

### If original text is not recoverable

I'll write new parent-focused copy following the same pattern as the Educators ("Your students with language disorders are falling through the cracks") and Therapists ("Have you ever read a children's book about DLD?") sections.

### Changes (2 files created, 2 files edited)

1. **Create `src/components/WorkWithUsWhoSection.tsx`** — Move the current "Who We Work With" content (collaborators list, workshops copy) into its own component.

2. **Update `src/pages/WorkWithUs.tsx`** — Import `WorkWithUsWhoSection` instead of `DoesSoundFamiliarSection`.

3. **Restore `src/components/DoesSoundFamiliarSection.tsx`** — Replace with parent-focused content. Proposed copy:

   - **Black bar heading**: "Does this sound familiar?"
   - **Body**: Speaks to parents noticing their child struggles with language — being misunderstood, falling behind peers, feeling frustrated — but not knowing why or where to turn.
   - **Bullet list** of relatable parent experiences (e.g., "Your child struggles to express what they're thinking," "Teachers say they're 'just shy' or 'will grow out of it'," "You've Googled symptoms but nothing quite fits," "You feel alone and unsure where to get help")
   - **Closing**: Reassurance that they're not alone and DLD is more common than they think.

4. **Match the structure** of `EducatorsFamiliarSection` and `TherapistsFamiliarSection` exactly — same class names, spacing, and layout pattern.

### Technical details
- No database or backend changes needed
- Simple component separation — no shared state or props involved

