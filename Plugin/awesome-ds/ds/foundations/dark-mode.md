# Dark mode

AwesomeDS dark mode inverts luminance, not hue. The canvas becomes `#0a0a0a`, ink becomes
`#fafafa`, surfaces get lighter as they rise, the accent is lightened so it keeps its contrast,
and photographs are dimmed so white backgrounds do not glow. Dark mode is not a second
design; it is the same roles with different values. This file gives the surface ladder, the
component notes and the test list.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Trigger | `[data-theme="dark"]` or `prefers-color-scheme: dark` unless `[data-theme="light"]` | Users expect the OS setting to work and expect an in-app override to win. |
| `color-scheme` | `light` on `:root`, `dark` in the dark blocks | Form controls, scrollbars and system colors follow the scheme without extra CSS (MDN). |
| Canvas | `#0a0a0a`, not `#000` | Pure black under white text produces halation on OLED; `#0a0a0a` leaves room for the ladder below. Material's dark baseline is `#121212` for the same reason. |
| Surface ladder | canvas `#0a0a0a`, sunken `#0f0f0f`, canvas-soft `#111111`, surface `#141414`, raised `#1a1a1a` | Shadows have little contrast on dark, so lightness carries elevation (Material dark theme, Apple base and elevated backgrounds). |
| Ink | `#fafafa`, secondary `#a3a3a3`, muted `#8a8a8a` | 18.97:1, 7.85:1 and 5.73:1 on canvas. Not pure white, to reduce glare. |
| Accent | `#2f5bea` to `#7a9cff` | Lightened in OKLCH from L 0.52 to L 0.71; 7.57:1 on canvas. The dark accent is also the focus ring. |
| Status colors | success `#4ade80`, warning `#fbbf24`, danger `#f87171` | Lightened the same way; all above 7:1 on canvas. Soft tints darken to `#0f2a18`, `#2a1f05`, `#2f1010`. |
| Shadows | level 2 becomes a 1 px `hairline-strong` ring; level 3 adds `0 24px 64px -16px rgb(0 0 0 / 0.6)` | A ring is visible on dark; a soft shadow alone is not. |
| Images | `filter: brightness(0.88)` on `img` and `video` unless `data-no-dim` | Apple HIG: slightly darken content images with white backgrounds so they do not glow in Dark Mode. |
| Chart palette | separate dark values, L 0.66 to 0.86 | Light-mode marks at L 0.41 to 0.63 fail 3:1 on `#0a0a0a`. See data-visualization.md. |

## Why luminance inversion and not a new palette

1. Roles stay stable. A component references `--ds-surface`; it does not know which mode it is
   in. This is what makes a single token file possible.
2. Hue identity survives. Blue links stay blue, danger stays red. Users learn one meaning per hue.
3. Contrast is computed, not eyeballed. Each dark value in color.md has a ratio next to it.

NN/g found that dark mode users barely noticed when a design did not support dark mode and
could not recall which designs lacked it. Dark mode is expected but not scrutinised, which
argues for a mechanical inversion with a short test list, not a second bespoke theme.

## Surface ladder in use

| Element | Light | Dark | Note |
|---|---|---|---|
| Page | canvas `#ffffff` | canvas `#0a0a0a` | |
| Alternate section, code block | canvas-soft `#fafafa` | canvas-soft `#111111` | One step up, still reads as page |
| Table header, well, badge | surface-sunken `#f5f5f5` | surface-sunken `#0f0f0f` | Below surface in both modes |
| Card, input, popover | surface `#ffffff` | surface `#141414` | Card on canvas is visible without a shadow |
| Dialog, menu, hover-lifted card | surface-raised `#ffffff` | surface-raised `#1a1a1a` | Light mode uses the shadow; dark mode uses the step |
| Dividers | hairline `#e5e5e5` | hairline `#262626` | Decorative in both |
| Control borders | hairline-strong `#8c8c8c` | hairline-strong `#666666` | 3.36:1 and 3.5:1 on canvas |

Each dark step is 3 to 4 percent lighter than the one below. Enough to see, not enough to read
as a different color.

## Accent lightening recipe

Keep the hue and reduce chroma while raising lightness. In OKLCH the light accent is
`oklch(0.52 0.21 265)` and the dark accent is about `oklch(0.71 0.15 265)`. The same move
(L plus 0.2 to 0.26, C minus 0.05 to 0.08) produces the dark value for every accent in
`tokens/accents.css`. The dark `on-accent` is `#0a0a0a`, because a light accent needs dark
text on it.

## Per-component notes

| Component | Dark mode rule |
|---|---|
| Primary button | Inverts to `#fafafa` fill with `#0a0a0a` text. Hover `#e5e5e5`. |
| Secondary button | `surface` fill, `hairline-strong` border. Hover raises the background to `surface-raised`. |
| Input | `surface` fill, `hairline-strong` border, focus border and ring in the dark accent. Placeholder `ink-muted` `#8a8a8a` (5.73:1 on canvas, 5.34:1 on surface). |
| Card | `surface` on canvas with `hairline`. No shadow. Hover on a clickable card steps to `surface-raised`. |
| Dialog | `surface-raised`, 1 px `hairline-strong` ring, the level 3 shadow, backdrop `rgb(0 0 0 / 0.6)`. |
| Dropdown, popover, tooltip | `surface-raised` with the ring. Tooltip inverts: `ink` background `#fafafa`, canvas text `#0a0a0a`. |
| Table | Header `surface-sunken`, rows `canvas`, hover `canvas-soft`, selected `selection` `#1e2a4d`. |
| Code block | `canvas-soft` with syntax colors from the chart palette (dark set). |
| Toast | `surface-raised` with ring. Status icon in the lightened status color. |
| Badge (status) | Soft tint background, status color icon, `ink` text. |
| Skeleton | `surface-sunken` to `surface` shimmer. |
| Images and video | Dimmed to 88 percent. Logos, charts and UI screenshots set `data-no-dim`. |
| Illustrations | Ship a dark variant or use `currentColor` strokes. Never a white-backed PNG. |
| Focus ring | `#7a9cff`, 2 px, offset 2 px. 7.57:1 on canvas. |

## Switching

```html
<html data-theme="dark">   <!-- forced dark -->
<html data-theme="light">  <!-- forced light, ignores the OS -->
<html>                     <!-- follows prefers-color-scheme -->
```

Persist the choice in `localStorage` and apply it in a blocking inline script before first
paint, or the page flashes. Offer three options (light, dark, system); "system" is the default.
Do not animate the whole page between modes; a 150 ms opacity crossfade on the root is the
maximum, and none under reduced motion.

## Testing

1. Render every page in both modes at 390 and 1280 px. Playwright `colorScheme: "dark"` in the
   test config covers the OS path; set `data-theme` for the override path.
2. Run `tokens/scripts/check-contrast.mjs`. It audits both modes and exits 1 on a failure.
3. Grayscale screenshot of the dark page: status must still read.
4. Look for white boxes: images without `data-no-dim` intent, SVGs with `fill="#fff"`, iframes.
5. Check `color-scheme` took effect: native `select`, date inputs and scrollbars are dark.
6. Check the flash on reload with the override set.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Separate dark palette with its own hues | Doubles the token surface; hue meaning drifts between modes. |
| Pure `#000` canvas | Halation on OLED, no room for the ladder. |
| Shadows on dark surfaces | Invisible on `#0a0a0a`; the ring plus step is visible. |
| Material tonal surfaces (primary-tinted) | Ties surfaces to the accent; breaks true grays and live accent switching. |
| `filter: invert()` on the page | Inverts images and brand colors; unpredictable. |
| Dimming images by opacity | Opacity lets the canvas bleed through and lowers contrast of text inside the image; `brightness` keeps edges. |

## Sources

- https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme : `color-scheme` adjusts form controls, scrollbars and system colors (seen in search; the MDN host itself is blocked from this environment).
- https://developer.apple.com/design/human-interface-guidelines/dark-mode : base and elevated backgrounds; darken content images with white backgrounds (page reachable, content summarised from search results).
- https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md : `#121212` baseline, lighter surfaces at higher elevation.
- https://www.nngroup.com/articles/dark-mode-users-issues/ : users rarely notice missing dark mode; test both.
- https://www.nngroup.com/articles/dark-mode/ : light mode wins for most reading tasks; dark mode is a preference.
- https://github.com/GoogleChrome/modern-web-guidance/blob/main/skills/modern-web-guidance/guides/visual-design/dark-mode.md : `color-scheme: light dark` and `light-dark()` guidance.
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl : OKLCH lightness is perceptual, which is what makes the lightening recipe portable.
- https://www.w3.org/TR/WCAG22/ : 1.4.3 and 1.4.11, applied to both modes.
- https://atlassian.design/foundations/elevation : "the higher the elevation, the lighter the surface looks" in dark theme; shadows are harder to see there (opened 2026-10-08).
- https://linear.app/now/how-we-redesigned-the-linear-ui : Linear generates its light and dark themes in LCH, whose lightness is perceptually uniform, and uses it for elevated surfaces (opened 2026-10-08).
