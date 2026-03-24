

## Link "Implementation Kits" to Implementation Packages section on For Educators

### Changes (2 files)

1. **`src/components/ImplementationPackagesSection.tsx`** — Add `id="implementation-packages"` to the root `<section>` element.

2. **`src/components/SupportSection.tsx`** — Change `href` on line 24 from `"/for-educators"` to `"/for-educators#implementation-packages"`.

The existing scroll-to-hash behavior (100ms delay smooth scroll) will handle scrolling to the section automatically.

