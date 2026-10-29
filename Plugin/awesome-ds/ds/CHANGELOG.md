# Changelog

All notable changes to AwesomeDS are recorded here. The format follows Keep a Changelog
and the project follows Semantic Versioning 2.0.0.

## [Unreleased]

### Added

- Page layout tokens: `--ds-container-doc` (760px, document pages),
  `--ds-measure-ja` (40em, 40 full-width characters), `--ds-gutter-sm` / `-md` /
  `-lg` (20 / 24 / 32px side margins). Tailwind: `max-w-ds-doc`. Values come from
  17 measured pages (`Knowledge/layout/reference-sites-measured.md`) and the sources
  in `Knowledge/layout/spacing-grid-grouping.md`.
- `foundations/spacing.md`: page width, side margin and reading width; vertical
  rhythm and grouping (space above a heading at least twice the space below,
  document and gallery sections 48 / 64, home 64 / 96, card gap 16 at every width, only large spaces shrink
  on phones, column count from item count); a "too much space" failure table.
  DESIGN.md section 4, `layout.md` and `responsive.md` follow it.
- `foundations/data-visualization.md`: choosing the chart, text in the chart, 390px
  phones, accessibility (`<figure>`, `role="img"`, a table for read-off values), dark
  mode, states, a Recharts example, and which static-audit finding checks which rule.
  DESIGN.md section 2 links to it from its first lines.
  `scripts/dataviz-palette.test.mjs` keeps the palette table equal to `tokens.json`
  and `tokens.css`. No token changed.
- Hybrid C (decided 2026-09-06) in `DESIGN.md`, `foundations/stack.md`, and
  `foundations/motion.md`. AwesomeDS authors core tokens. Complex motion and heavy
  components stay on the recommended libraries. No token values changed.
- `foundations/anti-patterns.md`: four tables for Japanese copy, volume, charts,
  and correctness. No token changed. DESIGN.md section 9 points at them.
- `foundations/content-and-tone.md`: words per component (including toast), error
  messages, Japanese notation and keigo ceiling (公用文作成の考え方), numbers /
  dates / money, accessible wording (WCAG 2.4.4, 2.4.6, 2.5.3, 3.3.1 to 3.3.3),
  length at 390, the forbidden-word table, the checks table, and a review
  procedure. `scripts/check-copy.mjs` now uses design-verifier's 13 English words
  instead of 4, and `scripts/content-tone.test.mjs` keeps the table and both
  checkers in step. No token changed.
- `foundations/content-and-tone.md`: long-form ceilings (100 Japanese characters,
  at most 3 `、`, no empty `ことができます`, no bold or emoji list labels).
  UI copy stays at 60 characters. No token changed. `scripts/check-copy.mjs`
  flags those tells in `web/src/i18n/messages`, and skips keys that contain
  `bad` or `before`.
- `foundations/responsive.md`: 320 px floor (WCAG 1.4.10), CSS for seven layout
  patterns, ten causes of sideways scroll with fixes, and a verification table.
  The navigation switch is measured per product; the site's own switch at xl is
  recorded. `100vw`, bare `1fr` tracks and `overflow-x: hidden` on `body` are
  ruled out with sources. DESIGN.md section 10 links the file. No token changed.
- `foundations/responsive.md`: width classes (phone 320 to 599, tablet portrait 600
  to 839, tablet landscape 840 to 1199, desktop 1200 up) with review widths; canonical
  layouts (list-detail, supporting pane, feed) with CSS; a height rule under 480px;
  the base viewport meta and a ban on `user-scalable=no` and `maximum-scale`;
  `interactive-widget` for the on-screen keyboard; pointer, hover and hybrid devices;
  fluid type with a `rem` term between 360 and 1240; a visible scrollbar on scroll
  regions; adaptive versus responsive; a desktop-only notice pattern. Sources: Android
  window size classes and canonical layouts, NN/g, MDN, web.dev, StatCounter, DADS,
  SmartHR, GOV.UK. Knowledge: `Knowledge/layout/responsive-mobile-tablet.md`.
- `tokens.css`: `input`, `select` and `textarea` text is at least 16px under
  `(pointer: coarse)`, so iOS Safari does not zoom into a focused field.
  `typography.md` and `forms.md` give the reason. No token value changed.
- `layout.md`: headings fit in two lines at every width (about 20 Japanese characters
  for `h1`, 24 for `h2` at 390); cards in a row share a bottom edge; the column count
  avoids a lone last-row card; equal side margins; no blur over a plain canvas.
  From taste-skill at commit 6010f91.

### Changed

- Display type is fluid between 36 and 56 px (`clamp` with a rem term), so a one-word heading
  fits on one line at 320 px. Other sizes are fixed.

- Navigation has one rule, in `responsive.md`: visible links from lg (1024) up, never a
  menu button there; below lg, visible links when 4 or fewer fit, otherwise a menu and a
  sheet with links at least 44px tall and a sticky close button. `layout.md`,
  `spacing.md` and `navigation.md` said 768, md and lg; they now point to that rule.
  The site's switch at xl (1280) is replaced by inline links from lg (NN/g: no hidden
  navigation on desktop).
- Full-height heroes use `100svh`, app shells `100dvh`. DESIGN.md section 10,
  `layout.md` and `anti-patterns.md` said `100dvh` for heroes; they now match
  `responsive.md`.
- Eyebrows are banned instead of capped at one per three sections (`layout.md`,
  `anti-patterns.md`, `principles.md`, DESIGN.md section 9, `components/checklist.md`).
  taste-skill's study: tiny uppercase labels on 16 percent of top sites, 57 percent of
  weak ones.
- Tables: no fill on the header row (`surface-sunken` is no longer the table header
  role), numbers right-aligned in tabular figures, a grey dash for a missing value, a
  real zero printed as zero, and a table of five columns or fewer is not stretched
  across the container (`components/README.md`, `layout.md`, `states.md`,
  `dark-mode.md`).
- Skeletons are flat `surface-sunken` bars at the final size with no shimmer
  (`states.md`, `components/README.md`, `motion.md`, `dark-mode.md`,
  `accessibility.md`). Only a progress indicator loops.
- `responsive.md`: the text line at 390 is 350px (20px side margins), 21 full-width
  characters at 16px. It said 358px from a 16px margin.
- `spacing.md`: the Japanese 40-character source is the DADS typography accessibility
  page; the JLREQ quote is removed (not found in the current text); the tablet margin
  no longer cites Material 3's 24 dp (page did not load); GOV.UK's page width notes
  that the docs say 1020px and the source on `main` says 960px.
- taste-skill citations in `layout.md`, `anti-patterns.md` and
  `components/checklist.md` point at the current files at commit 6010f91, or at
  `taste-skill-classics` for rules that moved there.

- The page container is 1200px (galleries) or 760px (documents), centered, with
  20 / 24 / 32px side margins. `responsive.md` said 1280px with 16 / 24 / 32;
  DESIGN.md and `tokens.css` already said 1200, so the three now agree.
- `spacing.md` no longer says Apple's layout guidance uses 8, 16 and 32 point
  increments; the current HIG Layout page does not say that.

- `foundations/content-and-tone.md` and `foundations/japanese-typography.md`: between
  Japanese and Latin letters or digits, do not type spaces by hand; rely on CSS
  `text-autospace`. Unsupported browsers show no gap and do not break, which is
  acceptable. Example strings and the Numbers / Count rows follow the same rule.
  Latin-Latin units (`184 ms`) still use a typed space. No token value changed.
- `tokens/tokens.css`: `data-theme="light"` on an element below `:root` now restores
  the light color roles, shadows and chart palette for that subtree. They sit in one
  block shared by `:root` and the island. Before, only a nested `data-theme="dark"`
  worked, so report and slide samples turned black in dark mode. No token value changed.
  Dark-mode image dimming skips that subtree.
- Japanese prose dates are `dateStyle: "long"` (2026年10月8日). The old "good"
  sample used `dateStyle: "medium"`, which Node 20 prints as 2026/10/08. Tables
  and code stay ISO 8601. No token changed.
- `foundations/content-and-tone.md`: the generated-Japanese example now uses a
  neutral product sentence. The note about one specific site was removed; the
  example stands on the patterns alone. No token changed.
- `foundations/japanese-typography.md`: `text-autospace` inserts 1/8ic, not a
  quarter space (CSS Text 4, and 2.5 px at 20 px measured in Chromium). No token
  changed.

### Fixed

- `foundations/data-visualization.md` printed six dark chart colors (chart-3 to chart-8)
  that were not the token values, and said the palette has fixed lightness and that the
  dark values are less saturated. The table now prints the tokens with measured contrast;
  the text gives the measured OKLCH lightness (0.41 to 0.63 light, 0.66 to 0.86 dark).
  The series cap is 7, matching the design-verifier `too-many-colors` finding; the doc
  had said 8. The legend rule now matches `color-key` (labels on the mark). No token changed.

## [0.5.0] - 2026-10-11

### Added

- Principle 7, "No generated tells", in `foundations/principles.md`. A choice that
  language models repeat is not a design decision. Replacements stay in
  `foundations/anti-patterns.md`.
- `foundations/content-and-tone.md`: one Japanese before/after for empty
  `ことができます`, forbidden words, and unsupported `注目`.
- `Knowledge/skills/anti-ai-slop.md`: the three-domain catalog and the hack list
  (taste-skill, ui-skills, no-ai-slop-ja, Pretty Mermaid, Frontend Slides, Anthropic
  pptx). Stars and install lines were read on 2026-10-11.

### Changed

- DESIGN.md section 9 points at principle 7. No token values changed.

## [0.4.0] - 2026-10-08

### Added
- `components/README.md` Maturity: alpha / beta / stable / deprecated, what each promises, how a
  component moves between levels. References: Primer component status, Atlassian release phases,
  Carbon. The site shows the level on every component in /components (34 stable, 14 beta).
- `components/README.md` Dialog and Toast: menus, popovers and toasts opened from a dialog are
  portalled into that dialog; with a native modal `<dialog>`, toasts render inside it.
- `foundations/feedback.md`: the same native `<dialog>` rule for toasts.

### Changed
- `foundations/imagery.md`, `internationalization.md`, `layers.md`, `density.md` expanded from about
  45 lines to 158 to 222: good and bad examples, edge cases, review checklists, verified sources.
  Corrected reasons that did not match their sources (Material 3 and Carbon density steps, the Apple
  HIG page for 44 pt, AVIF size claim); removed a dead Material 3 Imagery link.
- Sources in `typography.md`, `radius.md`, `spacing.md`, `elevation.md`, `dark-mode.md`, `color.md`
  and `stack.md` now cite Primer, Carbon, Polaris, Atlassian, Stripe and Linear primary sources for
  rules that came from them. No values changed.
- DESIGN.md front matter and token file headers to 0.4.0. No token values changed.

### Known gap
- `density.md` documents a `(pointer: coarse)` fallback from compact to comfortable that
  `tokens.css` does not implement yet. Tracked for a separate token change.

## [0.3.0] - 2026-10-08

### Added
- `foundations/feedback.md`: one rule set for choosing no message, inline, error summary, banner,
  toast, dialog or callout. Sources: Carbon notification pattern, Atlassian flag, GOV.UK
  notification banner, Primer notification messaging and toast accessibility, WCAG 2.2.1 and 4.1.3.
- DESIGN.md 8. Components: a Feedback rule that points at the new file.

### Changed
- `components/README.md` Toast: only toasts without an action auto-dismiss (5 s). Errors, warnings
  and toasts with Undo stay until dismissed. Do not toast a result that is already on screen.
- DESIGN.md front matter and token file headers to 0.3.0. No token values changed.

## [0.2.0] - 2026-09-07

### Added
- `data/`: measured data sets the site and the skills read. `brands.json` (261 brands' canvas, ink,
  accent, fonts and radii extracted from two public DESIGN.md collections), `palettes.json` (brand
  palettes with WCAG contrast plus 24 curated accent-on-neutral patterns generated in OKLCH, every
  one at least 4.5:1 in light and dark), `fonts.json` (34 typefaces with measured usage), `stack.json`
  (23 layers, one pick and its alternatives each), `repos.json` (GitHub star ranking, refreshed weekly
  by `.github/workflows/update-data.yml`). All generated by `scripts/*.mjs` and checked by
  `scripts/validate-data.mjs`.
- `tokens/accents.css`, `tokens/radius-families.css`, `tokens/font-pairings.css`: alternates applied
  with `data-accent`, `data-radius`, `data-font` on `<html>`. Contrast verified by
  `tokens/scripts/check-contrast.mjs`.
- `tokens/tokens.css`: `--ds-font-display`, density tokens (`--ds-row`, `--ds-pad-*`, and a
  `[data-density="compact"]` block), eight z-index layers, an eight-color chart palette for light and dark.
- `foundations/`: dark-mode, states, forms, navigation, density, layers, data-visualization,
  content-and-tone, imagery, internationalization, responsive.

### Changed
- DESIGN.md front matter version 0.2.0. Rules unchanged; the new files add perspectives, not exceptions.

## [Unreleased]

### Changed before release (contrast audit, 2026-09-06)

The first token draft was audited with the WCAG relative-luminance formula. These values
changed so that every text role reaches 4.5:1 and every control border reaches 3:1:

- `warning` `#b26a00` → `#9a5c00` (5.38:1 on canvas, 4.93:1 on `warning-soft`).
- `success` `#1a7f37` → `#167534` (5.79:1 on canvas, 5.10:1 on `success-soft`).
- Light `ink-muted` `#737373` → `#6b6b6b` (5.33:1 on canvas, 4.89:1 on `surface-sunken`).
- Dark `ink-muted` `#737373` → `#8a8a8a` (5.73:1 on `#0a0a0a`, 5.34:1 on `#141414`).
- `hairline-strong` `#d4d4d4` → `#8c8c8c` light, `#333333` → `#666666` dark. This token is
  now defined as the border of controls (inputs, checkboxes) and must reach 3:1 (WCAG 1.4.11).
  `hairline` stays light and is decorative.
- Dark `surface-sunken` `#1a1a1a` → `#0f0f0f` so wells sit below `surface` and raised panels
  sit above it.
- DESIGN.md prose aligned with tokens: dark status colors are listed explicitly; the weight
  rule reads "never 700 or heavier"; dark tokens for accent, status, focus and selection are
  now in the front matter.

## [0.1.0] - 2026-09-06

Initial release. Decisions recorded with reasons in `foundations/`.

### Added

- `DESIGN.md` with front-matter tokens (colors, typography, rounded, spacing, motion,
  components) and twelve rule sections.
- `tokens/tokens.css`, `tokens/tailwind.css`, `tokens/tokens.json`.
- Color: true-gray neutrals `#fafafa` to `#0a0a0a`; ink `#0a0a0a` not `#000`; primary button
  ink on canvas; single accent `#2f5bea` (dark `#7a9cff`) for links, focus, selection and one
  highlight; status colors success `#167534`, warning `#9a5c00`, danger `#c81e1e` with soft
  tints; dark mode by luminance inversion with a lighter-surface ladder `#0a0a0a`, `#0f0f0f`, `#111111`,
  `#141414`, `#1a1a1a`. Contrast table computed for every text role. OKLCH accent-swap recipe.
- Typography: Geist plus Noto Sans JP, Geist Mono plus JetBrains Mono; scale 12 / 14 / 16 /
  18 / 20 / 28 / 36 / 56; weights 400 / 500 / 600; body 16 / 1.6; headings 1.2 to 1.35 with
  -0.02em to -0.01em tracking; 65ch measure; tabular numerals in tables; self-hosted fonts in
  two subsets with `font-display: swap` and `size-adjust` fallbacks.
- Japanese typography: `:lang(ja)` line-height 1.8, letter-spacing 0 to 0.02em,
  `line-break: strict`, `overflow-wrap: anywhere`, `text-autospace: normal`, `palt` on
  headings only, kinsoku by the browser, OS fallback stack Hiragino Sans, Yu Gothic UI,
  Noto Sans CJK JP; Digital Agency design system as reference.
- Spacing: 4 px base, scale 4 to 128; inside 8 to 16, between 16 to 24, groups 32 to 48,
  sections 64 to 96; container 1200; 12-column grid, gutters 24 / 16; breakpoints 640, 768,
  1024, 1280, 1536; targets 44 px touch, 24 px pointer; left alignment default.
- Radius: 4 / 6 / 8 / 12 / 16 / 24 / pill; controls 8, cards 12, dialogs 16; nested radius
  equals outer minus padding; one family per product; 1 px borders, 2 px focus ring only.
- Elevation: three levels (border; border plus `0 4px 12px -2px` ink 8 percent; border plus
  `0 16px 48px -12px` ink 18 percent); tinted shadows; dark mode lift by surface lightness
  and hairline strength; shadows only on floating elements.
- Motion: durations 100 / 150 / 200 / 300 / 500 ms; ease-out `cubic-bezier(0.16, 1, 0.3, 1)`,
  ease-in `cubic-bezier(0.7, 0, 0.84, 0)`, ease-in-out `cubic-bezier(0.65, 0, 0.35, 1)`; springs
  170 / 26 and 400 / 30; enters travel 4 to 8 px, scale from 0.98; exits shorter than enters;
  reduced motion honoured globally; library order CSS, Motion, GSAP ScrollTrigger, Lottie,
  react-three-fiber; animate transform and opacity only.
- Iconography: Lucide, stroke 1.75 with `absoluteStrokeWidth`, sizes 16 / 20 / 24, one family,
  `aria-label` on icon-only controls and `aria-hidden` on icons.
- Layout: nav 64 px, hero fits the first viewport at 390 px, sections 64 to 96 px apart,
  layout-family repetition ban, no default three-card row, max one eyebrow per three sections,
  `100dvh` never `100vh`.
- Accessibility: WCAG 2.2 AA floor mapped to tokens; focus ring 2 px accent offset 2 px on
  `:focus-visible`; semantic structure; keyboard model per component; `lang` attribute rule.
- Stack: TypeScript, React 19, Next.js App Router or Vite, Tailwind v4, shadcn/ui on Base UI
  or Radix, Motion, Lucide, Geist via `next/font` or Fontsource, Sonner, cmdk, Playwright
  screenshots, optional Storybook, Biome or ESLint plus Prettier; deviation table.
- Anti-patterns catalogue with replacements (purple gradients, glass, centered mesh hero,
  three equal cards, eyebrow on every section, Inter plus slate, em dashes, filler copy,
  fake numbers, div screenshots, infinite micro-animations, icon-only controls,
  placeholder-as-label, `h-screen`).
- Components: rules for Button, Input / Textarea / Select, Checkbox / Radio / Switch, Card,
  Dialog / Sheet, Popover / Dropdown / Tooltip, Tabs, Table, Toast, Badge, Avatar,
  Skeleton / Empty / Error, Navigation, Command menu.
- Pre-ship checklist with yes/no tests, mechanical items marked.
- README with usage, file map, semver policy and weekly research cadence.

### Notes

- Values were cross-checked against the measured DESIGN.md files of Linear, Vercel, Stripe,
  Apple, Notion, Figma, Raycast, Claude and Cursor (awesome-design-md) and 487 Japanese sites
  (awesome-design-md-jp). Contrast ratios were computed with the WCAG relative-luminance formula.
- Source URLs in every foundation file were collected during the 2026-09-06 research pass.
