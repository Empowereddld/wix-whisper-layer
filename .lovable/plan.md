

## Add "Coming Soon" Languages to BookDanSection

**Change**: In `src/components/BookDanSection.tsx`, after the existing language links paragraph (line 49), add a new line:

```tsx
<p className="mt-1 text-[12px] text-muted-foreground italic">
  Chinese and Arabic coming soon!
</p>
```

One file, one addition. Italic text to differentiate from the active links above.

