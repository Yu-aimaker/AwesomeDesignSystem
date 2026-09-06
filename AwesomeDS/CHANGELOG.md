# Changelog

All notable changes to AwesomeDS are recorded here. The format follows Keep a Changelog
and the project follows Semantic Versioning 2.0.0.

## [Unreleased]

### Known issues (to fix in 0.2.0)

- `warning` `#b26a00` on `canvas` measures 4.24:1 and fails AA for 14 to 16 px text.
  Candidate `#9a5a00` measures 5.47:1 on canvas and 5.02:1 on `warning-soft`.
- `success` `#1a7f37` on `success-soft` measures 4.47:1 (fails by 0.03). Candidate
  `#177a33` measures 5.43:1 on canvas and 4.78:1 on the soft tint.
- Dark `ink-muted` `#737373` measures 4.18:1 on `#0a0a0a` and 3.89:1 on `#141414`.
  Candidate `#8f8f8f` measures 6.12:1 and 5.70:1.
- Light `ink-muted` `#737373` on `surface-sunken` `#f5f5f5` measures 4.35:1. Either restrict
  the pairing (current rule) or move `ink-muted` to `#6b6b6b` (5.33:1 on canvas, 4.89:1 on sunken).
- Dark `surface-sunken` and `surface-raised` are both `#1a1a1a`; sunken should sit below
  `surface` (`#111111` or `#0f0f0f`) so wells and raised panels differ.
- DESIGN.md color table says dark status colors are the light values "lightened 20%";
  tokens.css uses `#4ade80`, `#fbbf24`, `#f87171`. Align the prose with the tokens.

## [0.1.0] - 2026-09-06

Initial release. Decisions recorded with reasons in `foundations/`.

### Added

- `DESIGN.md` with front-matter tokens (colors, typography, rounded, spacing, motion,
  components) and twelve rule sections.
- `tokens/tokens.css`, `tokens/tailwind.css`, `tokens/tokens.json`.
- Color: true-gray neutrals `#fafafa` to `#0a0a0a`; ink `#0a0a0a` not `#000`; primary button
  ink on canvas; single accent `#2f5bea` (dark `#7a9cff`) for links, focus, selection and one
  highlight; status colors success `#1a7f37`, warning `#b26a00`, danger `#c81e1e` with soft
  tints; dark mode by luminance inversion with a lighter-surface ladder `#0a0a0a`, `#111111`,
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

[Unreleased]: ./CHANGELOG.md
[0.1.0]: ./CHANGELOG.md
