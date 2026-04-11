

## Plan: Fix gap below the FAQ link

The extra space below the "Listen to Dan and Daria explain DLD" link is caused by the `mt-3` class on the link combined with the `pb-5` padding on `AccordionContent`. Since the link now appears inline after the answer text, the `mt-3` margin is unnecessary and `inline-block` should just be `inline`.

### What changes

**File: `src/components/DLDFaqSection.tsx`**
- Change the link classes from `mt-3 inline-block` to `inline ml-1` so the link flows naturally after "thrive." without extra vertical spacing

