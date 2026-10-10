# Imagery

Photos, illustrations and video are content, not decoration. AwesomeDS fixes the ratios,
the corner radius, the loading behaviour and the few treatments that keep images from fighting
the interface. Every rule below has one goal: the page does not move while images load, and
every image either says something (with alt text) or is silent (`alt=""`).

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Ratios | 16:9 (media), 4:3 (cards), 1:1 (avatars, thumbnails), 3:4 (portrait covers) | Four ratios cover every card; `aspect-ratio` reserves space before load. |
| Radius | `radius-lg` (12) inside cards, `radius-md` (8) standalone, pill for avatars | Matches the card ladder in radius.md; nested formula keeps rings even. |
| Fit | `object-fit: cover`, `object-position: center` by default; focal point set per image when it matters; `contain` for documents, receipts and logos | Faces and products stay in frame; a cropped receipt loses the total. |
| Loading | `loading="lazy"` below the fold, `decoding="async"`, explicit `width` and `height` | web.dev: missing dimensions are a top cause of layout shift (CLS). |
| First viewport | No `loading="lazy"`; the LCP image gets `fetchpriority="high"` | web.dev: never lazy-load images likely to be in the first viewport, especially the LCP image. |
| Placeholder | `surface-sunken` block at the final size, no blur-up | A blurred preview is a second image to download. |
| Formats | AVIF, then WebP, then JPEG via `<picture>`; SVG for logos and icons | MDN: AVIF compresses much better than JPEG or PNG and needs a `<picture>` fallback. |
| Sizes | `srcset` with 1x and 2x for fixed sizes, width descriptors plus `sizes` for fluid | Retina without doubling every download. |
| Alt text | describes purpose, one sentence, house limit 125 characters; `alt=""` for decorative | WCAG 1.1.1; detail longer than one sentence goes in visible text. |
| Text in images | none; text is live HTML over or next to the image | WCAG 1.4.5 Images of Text; live text translates, zooms and themes. |
| Overlays | text over photos only with a `rgb(10 10 10 / 0.5)` gradient scrim and `canvas` text | 4.5:1 (WCAG 1.4.3) cannot be guaranteed over an unknown photo otherwise. |
| Treatments | none by default; grayscale or duotone only as a deliberate brand decision | Filters are the fastest way to look generated. |
| Illustration | one style per product, flat, two colors plus `ink`, on `canvas-soft` | Consistency reads as intent; mixed illustration sets read as stock. |
| Video | muted, `playsinline`, poster set, autoplay only when `prefers-reduced-motion: no-preference`; a pause control when it runs over 5 s | Motion rules apply to video too; WCAG 2.2.2 Pause, Stop, Hide. |

## Card anatomy

Media sits at the top edge of a card with the card's inner radius (`radius-lg` minus border),
caption below at `space-4`. Never place text on the image inside a card; use the scrim pattern
only for full-bleed heroes.

```
390 px, one column                    1280 px, three columns
+--------------------------------+    +------------+ +------------+ +------------+
| [ image 4:3, radius 11 top   ] |    | [img 4:3 ] | | [img 4:3 ] | | [img 4:3 ] |
|                                |    | Title      | | Title      | | Title      |
| Title (16/600)                 |    | 2 lines    | | 2 lines    | | 2 lines    |
| Caption, 2 lines max (14)      |    +------------+ +------------+ +------------+
+--------------------------------+    every image is 4:3, so rows line up without JS
```

## Markup: good and bad

Reserve the space. The browser computes the ratio from `width` and `height` before the file
arrives (web.dev, Optimize CLS).

```html
<!-- Bad: no size; the text below jumps when the photo arrives -->
<img src="/team.jpg" alt="">

<!-- Good: intrinsic size plus fluid width -->
<img src="/team.jpg" width="1200" height="900" alt="会議室で議論する開発チーム 5 人"
     loading="lazy" decoding="async" style="width:100%;height:auto">
```

The hero is the LCP image on most pages. Lazy-loading it delays the largest paint.

```html
<!-- Bad -->
<img src="/hero.avif" loading="lazy" alt="">
<!-- Good -->
<picture>
  <source type="image/avif" srcset="/hero-800.avif 800w, /hero-1600.avif 1600w">
  <source type="image/webp" srcset="/hero-800.webp 800w, /hero-1600.webp 1600w">
  <img src="/hero-1600.jpg" srcset="/hero-800.jpg 800w, /hero-1600.jpg 1600w"
       sizes="(min-width: 1280px) 1200px, 100vw"
       width="1600" height="900" fetchpriority="high" alt="">
</picture>
```

Add `loading` to the fallback `<img>` only; it applies to the whole `<picture>` (web.dev,
browser-level lazy loading).

## Alt text

Follow the W3C alt decision tree: does the image carry information, act as a link or button,
or only decorate?

| Image | Bad | Good |
|---|---|---|
| Product photo | `alt="画像"` / `alt="IMG_2041.jpg"` | `alt="黒のレザー製ノート、A5 サイズ"` |
| Logo linking home | `alt="logo"` | `alt="AwesomeDS ホーム"` (the destination, not the picture) |
| Avatar next to the name | `alt="田中 太郎のプロフィール写真"` | `alt=""` (the name is already in text beside it) |
| Background texture | `alt="背景"` | `alt=""`, or CSS `background-image` |
| Chart as image | `alt="グラフ"` | Short alt plus the numbers in a table below (data-visualization.md) |

Do not start with 「画像:」 or "Image of"; the words add length and no information. W3C uses
"W3C home" for a logo that links home: the alt names the destination.

## Text over photos

```css
/* Bad: white text straight on the photo; contrast depends on the photo */
.hero h1 { color: white; }

/* Good: scrim under the text, values from the Decisions table */
.hero { position: relative; }
.hero::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(to top, rgb(10 10 10 / 0.5), transparent 60%);
}
.hero h1 { position: relative; z-index: var(--ds-z-raised); color: var(--ds-canvas); }
```

Check the contrast at the lightest part of the photo under the text, not the average.
Marketing banners with Japanese copy baked into a PNG fail 1.4.5 and cannot be translated;
render the copy as HTML on top.

## Edge cases

| Case | Rule |
|---|---|
| Slow network | The `surface-sunken` block holds the final size; no spinner over images. Text around it is readable from the first paint. |
| Broken URL | Keep the block, show a 24 px `ink-muted` image icon centered, keep the alt for screen readers. Never collapse to zero height. |
| User upload, extreme ratio (panorama, tall screenshot) | Crop with `cover` in the grid; show the full image with `contain` in the detail view. |
| User upload, transparent PNG logo | Place on `surface` with a 1 px `hairline` so a black logo stays visible in dark mode (dark-mode.md). |
| No avatar | Initials on `surface-sunken`: first grapheme of the display name, from `Intl.Segmenter` with `granularity: "grapheme"` so emoji and combined characters are not split. 「田中 太郎」 gives 「田」. |
| Empty gallery | Empty state from states.md; never a grid of grey placeholders. |
| RTL | Photos do not flip. Only directional illustrations (arrows, progress) mirror. |
| Animated GIF | Convert to `<video muted playsinline loop>`; a GIF cannot be paused, a video can. |

## Review checklist

- Every `<img>` has `width` and `height`, or its container sets `aspect-ratio`.
- No `loading="lazy"` on anything in the first viewport at 390 and 1280.
- The LCP image has `fetchpriority="high"`.
- Alt text names the purpose; decorative images have `alt=""`, not a missing `alt`.
- No text rendered inside a raster image, except logos.
- Text over a photo sits on the scrim and passes 4.5:1 at its lightest point.
- Autoplay video is muted, has a poster and a pause control, and respects reduced motion.
- No image is wider than its container at 390 (`max-width: 100%`).

## Alternatives considered

- Blur-up placeholders (Medium style): extra request and decode; a flat block at the right size
  removes the shift just as well.
- Rounded images without rounded cards: the ring between image and card border looks uneven;
  follow the nested formula.
- `loading="lazy"` on every image: delays the hero, which is the LCP image on most pages.
- `role="presentation"` instead of `alt=""`: W3C notes it has less support than a null alt.

## Sources

- web.dev, Optimize Cumulative Layout Shift: https://web.dev/articles/optimize-cls
- web.dev, Browser-level image lazy loading: https://web.dev/articles/browser-level-image-lazy-loading
- web.dev, Optimize resource loading with the Fetch Priority API: https://web.dev/articles/fetch-priority
- MDN, Responsive images: https://developer.mozilla.org/en-US/docs/Web/HTML/Guides/Responsive_images
- MDN, Image file type and format guide: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types
- MDN, Intl.Segmenter: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
- W3C WAI, An alt decision tree: https://www.w3.org/WAI/tutorials/images/decision-tree/
- W3C WAI, Functional images: https://www.w3.org/WAI/tutorials/images/functional/
- W3C WAI, Decorative images: https://www.w3.org/WAI/tutorials/images/decorative/
- WCAG 2.2, 1.1.1 Non-text Content: https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html
- WCAG 2.2, 1.4.3 Contrast (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- WCAG 2.2, 1.4.5 Images of Text: https://www.w3.org/WAI/WCAG22/Understanding/images-of-text.html
- WCAG 2.2, 2.2.2 Pause, Stop, Hide: https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide.html
- Apple HIG, Images (scale factors, test on devices): https://developer.apple.com/design/human-interface-guidelines/images
