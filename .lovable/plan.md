

## Redesign DLDImpactSection as Stacked Sticky Card Scroll

### Concept
Replace the current 3-column grid with a scroll-driven stacked card experience. On desktop, a sticky container holds 6 cards that peel away one by one as the user scrolls, revealing the next card underneath. Each card is a compact, centered rectangle with a circular icon, bold headline, and short text.

### Scroll Mechanics
- The outer section gets a tall height (~300vh) to create scroll runway
- A sticky inner container (`position: sticky; top: ~20vh`) centers in the viewport
- Each card is absolutely positioned in the stack; as the user scrolls, a `useEffect` with `scroll` listener calculates which card is active
- The active card stays put; cards above it translate upward (e.g., `translateY(-120%)`) with a slight rotation, revealing the next card
- Cards below remain stacked with subtle offsets (2-4px vertical, 0.5-1deg rotation) to create the "deck" feel

### Card Styling (brand-consistent)
- `bg-lavender` (existing token) background, `border border-border/30`, `rounded-xl`, soft `shadow-card` elevation
- Circular icon container: `bg-primary/10` with `text-primary` icons (existing pattern)
- Headlines: `text-foreground font-black` (midnight-dark)
- Body text: `text-muted-foreground` (stone-like)
- Subtle alternating rotation on stacked cards: `-0.5deg`, `0.3deg`, `-0.2deg` etc.
- Card width: `max-w-[480px]` centered, compact height

### Content Update
Replace the 6 cards with the user's provided content, using appropriate lucide icons:
1. "1 in 14 People Have DLD" — BarChart3
2. "6x Higher Mental Health Risk" — Heart
3. "Systematically Overlooked" — Eye (or EyeOff)
4. "Social Isolation" — Users
5. "Increased School Dropout Risk" — GraduationCap
6. "Lower Employment Outcomes" — Briefcase

### Responsive Behavior
- **Desktop (lg+)**: Full sticky stacked card scroll effect
- **Tablet (md)**: Stacked vertical feel with reduced scroll runway (~200vh), same sticky behavior but tighter spacing
- **Mobile**: Simple vertical card list, no sticky behavior, cards stack naturally with `space-y-5`

### Changes
- **`src/components/DLDImpactSection.tsx`**: Complete rewrite with scroll-driven stacked card logic using `useState`, `useEffect`, and scroll position calculations. No external dependencies needed.

