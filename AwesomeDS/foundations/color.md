# Color

AwesomeDS uses true-gray neutrals, near-black ink, one blue accent, and three status
hues. Primary buttons are ink on canvas. The accent is reserved for links, focus,
selection and one highlight per view. This file gives the reasons, the measured
contrast of every pair, and the recipe for swapping the accent for a brand color.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Neutrals are true gray | `#fafafa` to `#0a0a0a`, R=G=B | A tinted gray fights any brand hue placed on it. Vercel's Geist palette is "true gray from white to black" for the same reason. |
| Ink is `#0a0a0a`, not `#000` | 19.8:1 on white | Pure black on pure white is harsher than needed and is a documented AI-default tell. `#0a0a0a` keeps 19.8:1 while reading as black. |
| Primary button is ink on canvas | `primary #0a0a0a`, `on-primary #fff` | Vercel and Linear both use a black or white primary CTA. It leaves the accent free to mean "interactive text or state", not "important box". |
| Accent only for links, focus, selection | `#2f5bea` | One hue, one meaning (Gestalt similarity). Vercel documents blue as its sole interactive accent. |
| Status colors carry an icon or label | success / warning / danger | WCAG 1.4.1 and NN/g: never rely on color alone. |
| Dark mode inverts luminance, not hue | `#0a0a0a` canvas, `#fafafa` ink | Apple HIG and Material both express elevation in dark mode with lighter surfaces, not shadows. |

## Contrast of every text role on its background

Computed with the WCAG 2.x relative-luminance formula. AA requires 4.5:1 for body text,
3:1 for large text (24 px, or 18.66 px bold) and for UI component boundaries.

### Light theme

| Foreground | Background | Ratio | AA text | AA large / UI |
|---|---|---|---|---|
| ink `#0a0a0a` | canvas `#ffffff` | 19.80 | pass | pass |
| ink `#0a0a0a` | canvas-soft `#fafafa` | 18.97 | pass | pass |
| ink-secondary `#525252` | canvas | 7.81 | pass | pass |
| ink-secondary | surface-sunken `#f5f5f5` | 7.17 | pass | pass |
| ink-muted `#6b6b6b` | canvas | 5.33 | pass | pass |
| ink-muted | surface-sunken `#f5f5f5` | 4.89 | pass | pass |
| ink-disabled `#a3a3a3` | canvas | 2.52 | n/a (disabled is exempt) | fail |
| accent `#2f5bea` | canvas | 5.52 | pass | pass |
| accent-hover `#264dd0` | canvas | 6.87 | pass | pass |
| accent | accent-soft `#e8eefc` | 4.75 | pass | pass |
| on-accent `#ffffff` | accent | 5.52 | pass | pass |
| on-primary `#ffffff` | primary `#0a0a0a` | 19.80 | pass | pass |
| success `#167534` | canvas | 5.79 | pass | pass |
| success | success-soft `#e6f4ea` | 4.47 | fail (by 0.03) | pass |
| warning `#9a5c00` | canvas | 5.38 | pass | pass |
| warning | warning-soft `#fff4e0` | 3.89 | fail | pass |
| danger `#c81e1e` | canvas | 5.74 | pass | pass |
| danger | danger-soft `#fdecec` | 5.02 | pass | pass |
| hairline `#e5e5e5` | canvas | 1.26 | n/a | fail (decorative divider only) |
| hairline-strong `#8c8c8c` | canvas | 3.36 | n/a | pass (3:1 for control boundaries) |

### Dark theme

| Foreground | Background | Ratio | AA text | AA large / UI |
|---|---|---|---|---|
| ink `#fafafa` | canvas `#0a0a0a` | 18.97 | pass | pass |
| ink | surface-raised `#1a1a1a` | 16.67 | pass | pass |
| ink-secondary `#a3a3a3` | canvas | 7.85 | pass | pass |
| ink-secondary | surface-raised | 6.90 | pass | pass |
| ink-muted `#8a8a8a` | canvas | 5.73 | pass | pass |
| ink-muted | surface `#141414` | 3.89 | fail | pass |
| accent `#7a9cff` | canvas | 7.57 | pass | pass |
| accent | surface | 7.04 | pass | pass |
| on-accent `#0a0a0a` | accent | 7.57 | pass | pass |
| success `#4ade80` | canvas | 11.36 | pass | pass |
| warning `#fbbf24` | canvas | 11.86 | pass | pass |
| danger `#f87171` | canvas | 7.16 | pass | pass |
| hairline `#262626` | canvas | 1.31 | n/a | fail (decorative) |

### Rules that follow from the table

1. `ink-muted` is for placeholders, timestamps and captions. It passes 4.5:1 on `canvas`,
   `surface` and `surface-sunken` in both themes, but it is not a body text color.
2. Status colors (`success`, `warning`, `danger`) pass 4.5:1 on `canvas` and on their soft
   tints, so a status message may be written in the status color. Always pair it with an
   icon or a label; color alone is never the message.
3. `hairline` never carries meaning on its own. A card is recognised by its content and
   padding; the border is a helper. Input borders use `hairline-strong` plus a 2 px focus ring.
4. Disabled text is exempt from WCAG contrast but must still be visibly present; `#a3a3a3`
   is the floor.

## Why the primary button is not the accent

- Vercel: "a single black-ink primary CTA carries every conversion target" (measured in
  the cloned `vercel/DESIGN.md`).
- Linear: measured primary is `#5e6ad2` but the marketing CTA is a white pill on near-black;
  the brand hue is used sparingly.
- Apple: one Action Blue for interactive text, product tiles stay monochrome.
- If the accent is also the button fill, the accent appears dozens of times per page and
  stops signalling "this is a link". Hick's Law: more colored targets, slower decisions.

## Status colors

| Role | Light | Dark | Use |
|---|---|---|---|
| success | `#167534` | `#4ade80` | Confirmation, positive delta |
| warning | `#9a5c00` | `#fbbf24` | Needs attention, not blocking |
| danger | `#c81e1e` | `#f87171` | Errors, destructive actions |

Each has a `-soft` background for chips and banners. The soft tint holds the icon and the
colored border; the text stays `ink` or `ink-secondary` unless the table above shows a pass.

## Dark mode strategy

1. Invert luminance: canvas `#0a0a0a`, ink `#fafafa`. Hues stay the same family.
2. Surfaces get lighter as they rise: `#0a0a0a` canvas, `#0f0f0f` sunken, `#141414` surface,
   `#1a1a1a` raised.
   Material's dark theme and Apple's base/elevated background pairs use the same logic:
   shadows have little contrast on dark, so lightness carries elevation.
3. The accent is lightened (`#2f5bea` to `#7a9cff`) so it reaches 7.6:1 on canvas.
4. Shadows become a 1 px `hairline-strong` ring plus a large soft black shadow only at level 3.
5. Not pure black: `#0a0a0a` avoids the halation that pure white on `#000` produces and
   leaves room below the surface ladder. Material recommends `#121212` for the same reason.

## Swapping the accent for a brand

Change only `--ds-accent`, `--ds-accent-hover`, `--ds-accent-soft`, `--ds-on-accent`,
`--ds-focus-ring`, `--ds-selection`. Keep every neutral.

```css
/* OKLCH recipe: pick a hue, then set lightness to hit 4.5:1 on white */
:root {
  --brand-h: 262;                 /* hue from the brand mark */
  --ds-accent:       oklch(0.52 0.20 var(--brand-h));  /* text-safe: ~L 0.50 to 0.55 on white */
  --ds-accent-hover: oklch(0.46 0.20 var(--brand-h));
  --ds-accent-soft:  oklch(0.95 0.03 var(--brand-h));
  --ds-selection:    oklch(0.92 0.05 var(--brand-h));
  --ds-focus-ring:   var(--ds-accent);
  --ds-on-accent:    #ffffff;
}
[data-theme="dark"] {
  --ds-accent:       oklch(0.78 0.14 var(--brand-h));  /* lighter for dark canvas */
  --ds-accent-hover: oklch(0.84 0.12 var(--brand-h));
  --ds-accent-soft:  oklch(0.25 0.06 var(--brand-h));
  --ds-selection:    oklch(0.30 0.07 var(--brand-h));
  --ds-on-accent:    #0a0a0a;
}
```

Why OKLCH: its L channel is perceptually uniform, so two accents at L 0.52 have similar
contrast on white regardless of hue (Evil Martians). HSL lightness does not have that property.

Rule: after the swap, measure the accent on `canvas`. If it is below 4.5:1 it may not be used
as text or as a link. It may still be used for focus rings and selection backgrounds
(3:1 boundary rule) or as a fill behind `on-accent` text if that pair reaches 4.5:1.
Yellow, lime and light orange brands usually need a darker "text accent" variant.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Slate or zinc tinted neutrals (Tailwind defaults) | The blue cast collides with warm brands and is the most recognised AI default palette. |
| Accent as primary button (Material filled button) | Correct for Material, but it multiplies the accent and weakens link recognition. |
| Radix Colors 12-step scales for every hue | Excellent for product UI. Too many steps for a base system; the role model here (canvas / surface / ink / hairline / accent) maps onto Radix steps 1-2, 3, 12, 6-7, 9 if a team wants to adopt it. |
| Pure `#000` and `#fff` | 21:1 is not needed; `#0a0a0a` keeps 19.8:1 and reads as black without the AI-default look. |
| Warm "paper" canvas `#f5f1ea` | Named in taste-skill as the second most repeated AI palette for consumer brands. |

## Sources

- https://www.w3.org/TR/WCAG22/ : the 4.5:1 and 3:1 requirements (1.4.3, 1.4.11).
- https://webaim.org/resources/contrastchecker/ : reference checker; values above were computed with the same formula.
- https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast : 3:1 for UI component boundaries.
- https://www.nngroup.com/articles/visual-treatments-accessibility/ : do not rely on color alone; grayscale test.
- https://www.nngroup.com/articles/low-contrast/ : why gray-on-gray text degrades trust and legibility.
- https://vercel.com/geist/colors : true-gray scale and blue as sole interactive accent.
- https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale : 12-step role mapping considered as an alternative.
- https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl : perceptual lightness in OKLCH.
- https://css-tricks.com/almanac/functions/o/oklch/ : `oklch()` syntax.
- https://developer.apple.com/design/human-interface-guidelines/dark-mode : base and elevated backgrounds in Dark Mode.
- https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md : lighter surfaces at higher elevation; `#121212` baseline.
- https://www.nngroup.com/articles/dark-mode-users-issues/ : dark mode is popular but not essential; test both.
- https://refactoringui.com/previews/building-your-color-palette : role-based palettes with few hues.
- https://github.com/Leonxlnx/taste-skill : "no pure black", "Inter + slate + purple" and warm-paper palette listed as AI tells.
- https://linear.app/now/how-we-redesigned-the-linear-ui : Linear limited how much chrome color enters its theme calculation to reach a "more neutral and timeless appearance" (opened 2026-10-08).
