

## Add Language Links to BookMakeFriendsSection

**Change**: In `src/components/BookMakeFriendsSection.tsx`, after the "Buy on Amazon" button `<div>`, add:

```tsx
<p className="mt-3 text-[12px] text-muted-foreground">
  Also available in{" "}
  <a href="https://www.amazon.ca/Dan-Daria-Deviennent-Amis-d%C3%A9veloppemental/dp/B0G4DGGN5V/..." target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">French</a> and{" "}
  <a href="https://www.amazon.co.uk/Dan-Daria-Gwneud-Ffrindiau-Anhwylder/dp/B0FR9K8JJT/..." target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Welsh</a>.
</p>
```

Same styling as the BookDanSection language links. One file, one addition.

