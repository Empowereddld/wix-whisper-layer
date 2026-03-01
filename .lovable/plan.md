

## Fix Mobile Hero: Absolute-Position the Image

**Problem**: The two-column grid forces the image and text to share horizontal space, squeezing the text column on mobile. The image should overlay from the left without pushing the text.

### Changes (File: `src/components/HeroSection.tsx`)

1. **Make the layout single-column on mobile**: Change grid to `grid-cols-1 md:grid-cols-[44%_56%]` so the text takes the full width on mobile
2. **Absolute-position the image on mobile**: Wrap the image container with `absolute bottom-0 left-0 w-[40%] h-full md:relative md:w-auto` so it floats over the left side without taking up grid space
3. **Layer the text above the image**: Add `z-10` to the text column and `z-0` to the image so text remains readable
4. **Add left padding on mobile text**: Use `pl-[30%] md:pl-0` on the text column to avoid overlap with the image, while still allowing the full width for text wrapping
5. **Vertically center everything**: Restore `items-center` and `justify-center` on both the flex container and text column
6. **Keep tablet/desktop unchanged**: All mobile-specific classes use base breakpoint, with `md:` prefixes preserving the current two-column grid behavior

### Result
- Mobile: Image anchored to bottom-left as an overlay, text centered with left padding to clear the image
- Tablet/Desktop: Unchanged two-column grid layout

