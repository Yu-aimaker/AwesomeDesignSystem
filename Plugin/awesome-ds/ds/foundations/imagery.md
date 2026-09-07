# Imagery

Photos, illustrations and video are content, not decoration. AwesomeDS fixes the ratios,
the corner radius, the loading behaviour and the few treatments that keep images from fighting
the interface.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Ratios | 16:9 (media), 4:3 (cards), 1:1 (avatars, thumbnails), 3:4 (portrait covers) | Four ratios cover every card; `aspect-ratio` reserves space before load. |
| Radius | `radius-lg` (12) inside cards, `radius-md` (8) standalone, pill for avatars | Matches the card ladder in radius.md; nested formula keeps rings even. |
| Fit | `object-fit: cover`, `object-position: center` by default; focal point set per image when it matters | Faces and products stay in frame. |
| Loading | `loading="lazy"` below the fold, `decoding="async"`, explicit `width` and `height` | Zero layout shift (CLS), the largest cause of "jank" in content pages. |
| Placeholder | `surface-sunken` block at the final size, no blur-up | A blurred preview is a second image to download. |
| Formats | AVIF, then WebP, then JPEG via `<picture>`; SVG for logos and icons | 30 to 50 percent smaller at the same quality. |
| Sizes | `srcset` with 1x and 2x for fixed sizes, width descriptors for fluid | Retina without doubling every download. |
| Alt text | describes purpose in under 125 characters; `alt=""` for decorative | WCAG 1.1.1. |
| Overlays | text over photos only with a `rgb(10 10 10 / 0.5)` gradient scrim and `canvas` text | 4.5:1 cannot be guaranteed over an unknown photo otherwise. |
| Treatments | none by default; grayscale or duotone only as a deliberate brand decision | Filters are the fastest way to look generated. |
| Illustration | one style per product, flat, two colors plus `ink`, on `canvas-soft` | Consistency reads as intent; mixed illustration sets read as stock. |
| Video | muted, `playsinline`, poster set, autoplay only when `prefers-reduced-motion: no-preference` | Motion rules apply to video too. |

## Card anatomy

Media sits at the top edge of a card with the card's inner radius (`radius-lg` minus border),
caption below at `space-4`. Never place text on the image inside a card; use the scrim pattern
only for full-bleed heroes.

## Alternatives considered

- Blur-up placeholders (Medium style): extra request and decode; a flat block at the right size
  removes the shift just as well.
- Rounded images without rounded cards: the ring between image and card border looks uneven;
  follow the nested formula.

## Sources

- web.dev, Optimize Cumulative Layout Shift: https://web.dev/articles/optimize-cls
- MDN, Responsive images: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- WCAG 2.2, 1.1.1 Non-text Content: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
- Apple HIG, Images: https://developer.apple.com/design/human-interface-guidelines/images
- Material 3, Imagery: https://m3.material.io/styles/imagery/overview
