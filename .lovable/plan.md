# Make the /music page match the rest of the site

## What I found

The /music page works, but it was built with its own one-off styling instead of the patterns every other page uses:

- **Hero**: Other pages (About DLD, Resources, Who We Serve, Shop) use a **deep purple, centered banner** with a small uppercase eyebrow label, a large bold white headline, and a short intro paragraph. The music page uses a **lavender, left-aligned, two-column layout** with custom font sizes that don't appear anywhere else.
- **Spacing**: The site standard is generous, consistent vertical spacing between sections. The music page uses tighter, irregular spacing values.
- **Font**: Good news — the font (DM Sans) already matches everywhere. No change needed there.

## The plan

1. **Restyle the hero to the standard sub-page pattern**: deep purple background, centered text, small uppercase "MUSIC FROM EMPOWERED DLD" eyebrow, "What Is DLD?" as the large white headline, the approved subheading below it, and the "Listen to the song" button styled like the white buttons used on other deep purple heroes. The cover artwork stays — shown centered above or beside the text at a tasteful size, same as book covers appear elsewhere.
2. **Standardize section spacing** to match the site-wide rhythm used on other pages.
3. **Keep everything else identical**: all approved copy word-for-word, the streaming smart link (code only, no public mention), the "Why we made this song" / "Use it to start a conversation" / "Help someone learn about DLD" / "Explore more" sections, SEO title and description, and the popup campaign. No content changes, only visual alignment.

## Technical details

- Only `src/pages/Music.tsx` changes.
- Hero follows the exact pattern in `src/components/AboutDLDHero.tsx` / `ResourcesHero.tsx` (bg-deep-purple, py-20 md:py-28 lg:py-32, eyebrow text-[11px] tracking-[0.22em] text-white/60, h1 text-[32px] md:text-[48px] lg:text-[56px] font-black).
- Section spacing aligned to the 120px site standard (80px for denser bands).
- Verified with screenshots of /music at desktop and mobile widths side by side with another page; build must stay clean.
