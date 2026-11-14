# Rebuild the Music page (/music)

Replace the current single-song Music page with the six-section layout from your brief, styled like the Resources page. All copy is used exactly as you wrote it.

## Sections
1. **Purple hero** (same as Resources): "OUR MUSIC", "Living Life with DLD Through Music", subtitle, white "Explore Our Songs" button that scrolls to the songs.
2. **Listen to Our Music**: three cards like "Find What You Need" (artwork on top, title, description, dark "Listen Now" button opening in a new tab):
   - What Is DLD? → release.landr.com/what-is-dld
   - When Words Get Stuck → release.landr.com/when-words-get-stuck
   - Ask For What I Need → release.landr.com/ask-for-what-i-need
   Artwork is your real cover art taken from each song's listening page (nothing generated).
3. **Why We Created Our Music**: image beside text, like the books section. Image: the What Is DLD? cover art (no new image).
4. **Ways to Use Our Music**: short, centred text. "free to listen to and share" kept as you wrote it.
5. **Our Music Around the World**: light grey band, like "A Growing Global Community".
6. **Help Us Create More Music**: dark closing band with a "Get Involved" button emailing hello@empowereddld.com.

## Menu
Add "Music" as its own item in the top menu (desktop and phone), linking to /music.

## Not changing
No other pages or content. No extra animations or sections. Stays in the preview until you approve publishing.

## Check
Desktop, tablet and phone in the preview: all three links, the scroll button and the email button.

## Technical details
- Download the three og:image covers, convert to WebP, keep as in-repo imports (per project rule for previewed images).
- Rewrite src/pages/Music.tsx; keep SEOHead and trackStreamingClick on each Listen Now click; update the page title/description to cover all three songs.
- Add the nav item in Header.
