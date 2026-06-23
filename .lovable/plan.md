
# Storefront Imagery: Generate Drafts + Reusable Prompts

Goal: get a consistent, on-brand look across the hidden `/shop/merch` page using imagery that matches Empowered DLD (deep purple palette, DM Sans, soft natural daylight, minimalist editorial style). You'll get both: I'll generate first-draft images in the sandbox AND give you the exact prompts to use in ChatGPT 2.0 so you can iterate yourself.

## Approach: which tool does what

- **ChatGPT 2.0 (or sandbox imagegen)** — branded *storefront* imagery: the lifestyle hero, optional editorial shots. Style-controlled, consistent palette.
- **Gelato** — actual *product* mockups once your designs are uploaded (true t-shirt cut, true mug shape, accurate print placement). Use these for the live product cards after Phase 1.
- **For the hidden preview now** — I'll generate placeholder product shots in a single consistent style so the page looks polished while you wait on Gelato.

## What I'll generate in the sandbox (premium quality, on-brand)

Saved to `src/assets/`, replacing current placeholders:

1. `merch-hero.jpg` — 1280x960 (4:3), lifestyle flat lay of tee + mug + tote on a warm neutral surface.
2. `merch-tshirt.jpg` — 1024x1024, folded purple heather tee on neutral background.
3. `merch-mug.jpg` — 1024x1024, white 11oz ceramic mug with purple wordmark band.
4. `merch-tote.jpg` — 1024x1024, natural canvas tote with deep purple print.

All four use the same lighting, palette, and composition language so the grid looks like one collection.

## Master style guide (shared across all prompts)

Use this style block in every ChatGPT 2.0 prompt to keep the look consistent:

```
Style: minimalist editorial e-commerce photography. Soft natural daylight from upper left, gentle realistic shadows. Warm neutral background (off-white #F5F1EA or soft oat). Deep purple brand accent (#5B3A8C). No text overlays, no logos, no people, no props beyond the product itself. Clean composition, generous negative space, slightly desaturated, modern lifestyle brand feel. High resolution, photorealistic.
```

## ChatGPT 2.0 prompts (copy/paste)

**1. Hero (1280x960, 4:3)**
```
Lifestyle flat lay for a DLD awareness merch collection called "Empowered DLD". 
A neatly folded deep purple heather unisex t-shirt, an 11oz white ceramic mug with a purple band, and a natural canvas tote bag arranged together on a warm neutral oat-colored linen surface. Items slightly overlapping, balanced asymmetric composition with negative space on the right for headline text.
[paste master style guide]
```

**2. T-shirt (1024x1024, 1:1)**
```
Single neatly folded deep purple heather unisex t-shirt, centered on a warm neutral oat-colored surface. Soft fabric texture visible. Subtle realistic shadow.
[paste master style guide]
```

**3. Mug (1024x1024, 1:1)**
```
Single 11oz white ceramic mug with a deep purple horizontal band around the middle. Mug centered, handle facing right, on a warm neutral oat-colored surface. Soft realistic shadow.
[paste master style guide]
```

**4. Tote (1024x1024, 1:1)**
```
Single natural canvas tote bag with a small deep purple geometric print at the center. Bag standing upright with handles natural, on a warm neutral oat-colored surface. Soft realistic shadow.
[paste master style guide]
```

## Build steps

1. Generate the 4 images above using `imagegen--generate_image` at **premium** quality (consistent style, no text needed so `standard` would also work, but premium gives you better fabric/ceramic realism).
2. Save to `src/assets/merch-hero.jpg`, `merch-tshirt.jpg`, `merch-mug.jpg`, `merch-tote.jpg` (overwriting current placeholders).
3. Imports in `MerchHero.tsx` and `merchPlaceholders.ts` already point to those filenames, so the page picks them up automatically.
4. Send you the master style guide + 4 prompts above in chat so you can regenerate any of them in ChatGPT 2.0 whenever you want.

## Important note on Gelato

For the **final** product images post-launch, use Gelato's built-in mockup generator. It renders your actual uploaded designs on the real garments/mugs Gelato will ship, which keeps customer expectations accurate. The ChatGPT/sandbox images stay perfect for the hero and any editorial sections. We'll swap the product images during Phase 3 (Shopify wire-up).

## What does NOT change

- No copy edits.
- No layout changes.
- Page stays hidden (`noindex` + robots disallow + "Coming Soon" badge).
- No Shopify or Gelato actions yet.

Approve and I'll generate the four images and drop the final prompt sheet in chat.
