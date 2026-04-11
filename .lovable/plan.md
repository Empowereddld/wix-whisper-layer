

## Plan: Add YouTube Video to "What is DLD?" FAQ Answer

Add a styled callout link below the existing answer text for the "What is Developmental Language Disorder?" FAQ item, encouraging users to watch Dan and Daria explain DLD.

### What changes

**File: `src/components/DLDFaqSection.tsx`**
- Update the first FAQ answer to include a clickable callout link after the text
- The link will say something like: **"🎧 Listen to Dan and Daria explain DLD →"**
- It will open `https://www.youtube.com/watch?v=Zf6PcH4f7rk` in a new tab
- Styled as a subtle, branded inline link with an accent color and hover effect — consistent with the minimalist FAQ design

### Design approach
- Keep it as a text link (not a full embed) so the FAQ stays clean and scannable
- Use a small top margin to separate it from the answer paragraph
- Opens in a new tab so users don't leave the page

