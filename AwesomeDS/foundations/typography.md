# Typography

AwesomeDS sets Latin text in Geist and Japanese text in Noto Sans JP, both variable,
both open licensed, both self-hosted. Body is 16 px at 1.6 line height with a 65ch
measure. Headings use weight 600 and light negative tracking. This file explains each
choice and gives the exact CSS.

## Decisions

```css
--ds-font-sans: "Geist", "Noto Sans JP", system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif;
--ds-font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

| Decision | Value | Reason |
|---|---|---|
| Latin family | Geist (variable) | Designed by Vercel and Basement Studio for screens; SIL OFL 1.1; variable weight axis; tabular figures via `tnum`. |
| Japanese family | Noto Sans JP (variable) | Largest open Japanese glyph set; wght axis 100 to 900; used by the Digital Agency design system. |
| Mono family | Geist Mono, then JetBrains Mono | Same design source as Geist so code and UI share an x-height. |
| Scale (px) | 12, 14, 16, 18, 20, 28, 36, 56 | See scale rationale. |
| Weights | 400, 500, 600 | Three weights cover body, label, heading. 700+ only for display if a brand needs it. |
| Line height | 1.6 body, 1.55 small, 1.5 caption, 1.2 to 1.35 headings, 1.1 display | Long lines need more leading; short headings need less. |
| Tracking | -0.02em display and h1, -0.015em h2, -0.01em h3, 0 body, +0.01em caption | Large type has too much built-in spacing; small type needs a little more. |
| Measure | 65ch | 50 to 75 characters is the readable range. |
| Numerals | `font-variant-numeric: tabular-nums` in tables | Columns of digits must align. |

## Why Geist

1. Screen first. Geist was drawn for UI and code, with a Mono sibling that shares metrics.
2. License. SIL Open Font License 1.1, so it can be self-hosted, subset and bundled.
3. Variable. One `wght` axis file covers 400, 500 and 600.
4. Features. Tabular figures and stylistic sets are documented in the repository.
5. Distribution. Available from Google Fonts, npm (`geist`), and Fontsource
   (`@fontsource-variable/geist`), which makes `next/font` and Vite setups trivial.

## Alternatives considered

| Font | Status | Why not the default |
|---|---|---|
| Inter | Open (OFL), excellent features (`tnum`, `cv11`, `ss03`) | It is the single most common AI-generated UI font. taste-skill lists "Inter + slate" as the primary tell. Acceptable when a brief asks for it. |
| SF Pro | Apple system font, excellent | License restricts use to Apple platforms; cannot be self-hosted for the web. Stays in the fallback stack as `-apple-system`. |
| IBM Plex Sans | Open (OFL), sans/serif/mono family | Strong, but its grotesque details are IBM's brand voice. Good `ds-creator` choice for enterprise. |
| Söhne | Commercial (Klim) | Used by Stripe; paid license, no self-host without purchase. |
| Satoshi | Free (Fontshare) | Geometric, friendly; license is Fontshare's, not OFL, and it lacks a matching mono. |
| System stack only | Free, zero bytes | Metrics vary by OS so layouts shift; Japanese rendering differs between Hiragino and Yu Gothic. Used as fallback, not default. |
| A serif | Various | A serif is a brand decision. taste-skill: "creative brief = serif" is a tested AI tell. |

## Scale rationale

| Token | px | Use | Ratio to 16 |
|---|---|---|---|
| xs | 12 | caption, badge, table meta | 0.75 |
| sm | 14 | body-sm, labels, buttons, inputs | 0.875 |
| base | 16 | body | 1 |
| lg | 18 | body-lg, lead paragraph | 1.125 |
| xl | 20 | h3 | 1.25 |
| 2xl | 28 | h2 | 1.75 |
| 3xl | 36 | h1 | 2.25 |
| 4xl | 56 | display | 3.5 |

- 16 px body: the common floor for readable web text; smaller body sizes read slower.
- 14 px for UI chrome: matches Vercel and Linear measured label sizes (and Primer, Carbon, Polaris UI text); still above 12.
- 12 px is the minimum. Nothing in AwesomeDS goes below it.
- Gaps widen as size grows (2, 2, 2, 8, 8, 20) so every step is visibly different.
- Eight sizes is enough. Material 3 uses fifteen roles; the extra granularity produces
  near-identical sizes that agents misuse.

## Weights

- 400 body. 500 labels, buttons, table headers. 600 headings.
- One weight step is enough to mark a change of role; two steps at once (400 to 600
  inside a paragraph) is emphasis, not hierarchy.
- 700 and above are reserved for display and only when a brand asks. Noto Sans JP at 700
  gets visibly heavy at 16 px on Windows ClearType.

## Line height and tracking

- Body 1.6: 65ch lines need room for the eye to return; 1.5 is the floor recommended by the
  Digital Agency and 1.6 gives Latin and Japanese a shared rhythm before `:lang(ja)` raises it to 1.8.
- Headings 1.2 to 1.35: two-line headings at 36 px with 1.6 leading read as separate lines.
- Display 1.1 with -0.02em: Apple's SF Pro Display applies negative tracking above 20 pt for
  the same reason; Linear's measured display tracking is -3 px at 80 px.
- Negative tracking on body is never allowed. Cookpad's measured -0.4 px body tracking is a
  brand choice; as a default it reduces legibility for Japanese.

## Measure

`--ds-measure: 65ch`. Research summarised by NN/g and Baymard puts the comfortable range at
50 to 75 characters. In Japanese, 65ch of Latin is roughly 35 to 40 full-width characters,
which matches the DESIGN.md rule.

## Loading strategy

1. Self-host. Use `next/font` (Next.js) or `@fontsource-variable/geist` and
   `@fontsource-variable/noto-sans-jp` (Vite). No third-party `<link>` at runtime.
2. Two subsets. Latin (Geist) is a small file; Japanese is split by `unicode-range` into
   slices. Google's own Japanese slicing cut bytes by about 80 percent. Never ship one
   multi-megabyte Noto file.
3. `font-display: swap` for both. Body text must never be invisible.
4. `size-adjust` on a local fallback so the swap does not shift layout:

```css
@font-face {
  font-family: "Geist Fallback";
  src: local("Arial");
  size-adjust: 106%;
  ascent-override: 92%;
  descent-override: 24%;
  line-gap-override: 0%;
}
@font-face {
  font-family: "Noto Sans JP Fallback";
  src: local("Hiragino Sans"), local("Yu Gothic UI"), local("Meiryo");
  size-adjust: 100%;
}
```

`next/font` computes these overrides automatically; Fontsource users copy values from the
Chrome fallback tooling article.

5. Preload only the Latin variable file. Japanese slices load on demand.

## Do and do not

- Do set `font-feature-settings: "kern" 1` globally (already in tokens.css).
- Do use `tabular-nums` in any column of numbers, prices, timestamps.
- Do not use `letter-spacing` on Japanese body text below 0 or above 0.02em.
- Do not mix a second sans (for example a "display" grotesque) without a `ds-creator` decision.
- Do not load Geist from a CDN `<link>` in production.

## Sources

- https://vercel.com/font : Geist family page.
- https://github.com/vercel/geist-font/blob/main/LICENSE.txt : SIL OFL 1.1 license text.
- https://github.com/vercel/geist-font/blob/main/readme.md : variable files and feature settings.
- https://basement.studio/post/the-birth-of-geist-a-typeface-crafted-for-the-web : design intent (screens, Swiss roots).
- https://fontsource.org/fonts/geist/install : `@fontsource-variable/geist`.
- https://fonts.google.com/noto/specimen/Noto+Sans+JP : Noto Sans JP specimen.
- https://www.npmjs.com/package/@fontsource-variable/noto-sans-jp : variable package, wght 100 to 900.
- https://rsms.me/inter/ : Inter features (`tnum`, `cv11`, `ss03`).
- https://developer.apple.com/fonts/ : SF Pro license scope.
- https://en.wikipedia.org/wiki/IBM_Plex : IBM Plex under OFL.
- https://en.wikipedia.org/wiki/Klim_Type_Foundry : Söhne origin (commercial).
- https://www.uxpin.com/studio/blog/optimal-line-length-for-readability/ : 50 to 75 character range summary.
- https://baymard.com/blog/line-length-readability : product-description line length study.
- https://developer.apple.com/videos/play/wwdc2020/10175/ : SF tracking changes with size.
- https://m3.material.io/styles/typography/type-scale-tokens : Material's 15-role scale (considered).
- https://web.dev/articles/css-size-adjust : `size-adjust` for fallback fonts.
- https://developer.chrome.com/blog/framework-tools-font-fallback/ : computed fallback metrics.
- https://web.dev/articles/font-best-practices : `font-display`, preload guidance.
- https://nextjs.org/docs/app/getting-started/fonts : `next/font` self-hosting with zero layout shift.
- https://developers.googleblog.com/google-fonts-launches-japanese-support/ : `unicode-range` slicing of Japanese fonts.
- https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric : `tabular-nums`.
- https://design.digital.go.jp/dads/foundations/typography/ : Noto Sans JP and 1.5 minimum leading.
- https://github.com/Leonxlnx/taste-skill : Inter and default-serif listed as AI tells.
- https://raw.githubusercontent.com/primer/primitives/HEAD/src/tokens/base/typography/typography.json5 : Primer sets 14px as "Default body text size for UI" and ships line-height tokens 1.25, 1.375, 1.5, 1.625, 1.75 (fetched 2026-10-08).
- https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/styles.ts : Carbon `bodyShort01` is 14px (scale02) at line height 1.28572 (fetched 2026-10-08).
- https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/size.ts : Polaris size token `350` is 14px (fetched 2026-10-08).
- https://atlassian.design/foundations/typography : Atlassian publishes text styles as typography tokens, with Body M as the default size inside components (opened 2026-10-08).
- https://stripe.com/ : the stylesheet linked from the page defines `.tabular-nums` as `font-feature-settings: "tnum"` (opened 2026-10-08).
