

## Add Language Links to BookDanSection

Add a line below the "Buy on Amazon" button: "Also available in French, Spanish and Czech." with each language hyperlinked.

### Links
- **French**: `https://www.amazon.ca/Dan-LAvion-En-Papier-D%C3%A9veloppemental/dp/B0DZCNPK9J/ref=asc_df_B0DZCNPK9J?mcid=08eb745d2bb83556b1d423c6b8863395&tag=googleshopc0c-20&linkCode=df0&hvadid=751937625983&hvpos=&hvnetw=g&hvrand=4307501379961356780&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9000789&hvtargid=pla-2421744917454&psc=1&hvocijid=4307501379961356780-B0DZCNPK9J-&hvexpln=0&gad_source=1`
- **Spanish**: `https://www.amazon.com/-/es/Dan-Avi%C3%B3n-Papel-Trastorno-Desarrollo/dp/B0F12L8T4S`
- **Czech**: `https://www.barnesandnoble.com/w/dan-and-the-paper-airplane-camesha-russell/1148482396`

### Change

**Edit** `src/components/BookDanSection.tsx` — After the "Buy on Amazon" button `<div>`, add:

```tsx
<p className="mt-3 text-[12px] text-muted-foreground">
  Also available in{" "}
  <a href="[french url]" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">French</a>,{" "}
  <a href="[spanish url]" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Spanish</a> and{" "}
  <a href="[czech url]" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary transition-colors">Czech</a>.
</p>
```

Small, muted text with underlined links opening in new tabs. One file, one addition.

