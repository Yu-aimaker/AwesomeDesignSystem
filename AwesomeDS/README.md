# AwesomeDS

AwesomeDS is the canonical design system of this repository: a neutral, content-first base
for web products. White canvas, near-black ink, one accent used only for links, focus and
selection. Geist and Noto Sans JP on a 4 px grid. Borders before shadows. Motion only as
feedback. Every value has a written reason with sources in `foundations/`.

Use it as-is when a product has no brand yet. Use it as the base when `ds-creator` builds
a brand-specific system.

## How to use

### 1. Give the agent the spec

Copy `AwesomeDS/DESIGN.md` into the project root (or reference it from the project's
`CLAUDE.md`). An agent reads it top to bottom before generating UI, then opens the
foundation file for the area it is about to touch.

### 2. Import the tokens

```css
/* app/globals.css */
@import "tailwindcss";
@import "./AwesomeDS/tokens/tokens.css";   /* --ds-* variables, base rules, dark mode, reduced motion */
@import "./AwesomeDS/tokens/tailwind.css"; /* @theme mapping: bg-canvas, text-ink, rounded-md, duration-base */
```

Without Tailwind, import `tokens.css` alone and use the variables directly:

```css
.card { background: var(--ds-surface); border: 1px solid var(--ds-hairline); border-radius: var(--ds-radius-lg); }
```

Dark mode applies through `[data-theme="dark"]` or the OS setting. Japanese pages set
`<html lang="ja">` to receive the `:lang(ja)` rules.

### 3. Use it with the plugin skills

- `ds-creator`: starts from AwesomeDS and produces a brand DESIGN.md that overrides tokens
  (accent, fonts, radius family) while keeping roles and rules.
- Frontend generation skills: read `DESIGN.md`, import the tokens, pick shadcn/ui
  components, run `components/checklist.md` before finishing.

### 4. Check before shipping

Run `components/checklist.md`. Every item is a yes/no test; report what was skipped.

## File map

| Path | What it is |
|---|---|
| `DESIGN.md` | The spec. Front matter tokens plus the rules an agent must follow. Source of truth. |
| `tokens/tokens.css` | CSS variables (`--ds-*`), base HTML rules, dark theme, `:lang(ja)`, focus ring, reduced motion. |
| `tokens/tailwind.css` | Tailwind v4 `@theme` mapping of the same tokens. |
| `tokens/tokens.json` | Machine-readable tokens for other tooling. |
| `foundations/principles.md` | The six principles and the laws (Fitts, Hick, Miller, Jakob, Gestalt, Norman, Nielsen) behind each rule. |
| `foundations/color.md` | Neutrals, accent, status colors, contrast table for every pair, dark mode, accent swap recipe in OKLCH. |
| `foundations/typography.md` | Geist and Noto Sans JP, scale, weights, leading, tracking, measure, loading strategy. |
| `foundations/japanese-typography.md` | Leading 1.8, kinsoku, `text-autospace`, `palt`, mixed-script pairing, OS fallbacks, Digital Agency reference. |
| `foundations/spacing.md` | 4 px scale, spacing bands, container, grid, breakpoints, touch targets, alignment. |
| `foundations/radius.md` | 8 / 12 / 16 / pill, nested formula, measured radii of Linear, Vercel, Stripe, Apple, Material. |
| `foundations/elevation.md` | Borders before shadows, three levels, tinted shadows, dark mode surface ladder. |
| `foundations/motion.md` | Durations, curves, springs, distance limits, reduced motion, library decision tree, performance. |
| `foundations/iconography.md` | Lucide at 1.75 stroke, sizes, alternatives, ARIA rules. |
| `foundations/layout.md` | Page anatomy, hero rules, mobile first, layout-family and eyebrow limits. |
| `foundations/accessibility.md` | WCAG 2.2 AA mapped to tokens and rules. |
| `foundations/stack.md` | Recommended stack and when to deviate. |
| `foundations/anti-patterns.md` | Generated-UI tells and their replacements. |
| `foundations/dark-mode.md` | Lightness inversion only, surface ladder, accent and status values for dark. |
| `foundations/states.md` | Nine interactive and five data states, the matrix, spinner timing, optimistic UI. |
| `foundations/forms.md` | Labels above, errors below, validation timing, field types, layout. |
| `foundations/navigation.md` | Two levels deep, top bar and sidebar, breadcrumbs, command menu. |
| `foundations/density.md` | Comfortable and compact, what changes and what never does. |
| `foundations/layers.md` | Eight z-index steps, portals, top layer, stacking contexts. |
| `foundations/data-visualization.md` | Eight-color chart palette light and dark, grid, labels, emphasis. |
| `foundations/content-and-tone.md` | Voice, button and error copy, numbers and dates, forbidden words. |
| `foundations/imagery.md` | Ratios, radius, loading, formats, scrims, illustration. |
| `foundations/internationalization.md` | Expansion, per-script fonts, Intl formats, names, logical properties. |
| `foundations/responsive.md` | Five widths, three design shapes, touch, tables, overflow rule. |
| `foundations/feedback.md` | Inline, error summary, banner, toast, dialog, callout: which one, how many, when it may disappear. |
| `data/*.json` | Measured data sets: brands, palettes, fonts, stack, repos. Generated by `scripts/`, validated in CI. |
| `tokens/accents.css`, `radius-families.css`, `font-pairings.css` | Alternates applied with `data-accent`, `data-radius`, `data-font`. |
| `components/README.md` | Anatomy, tokens, states, do / do not for each component. |
| `components/checklist.md` | The pre-ship yes/no checklist. |
| `CHANGELOG.md` | Versioned record of decisions. |

## Versioning policy

AwesomeDS follows Semantic Versioning 2.0.0. The version lives in `DESIGN.md` front matter,
`tokens/tokens.css` header and `CHANGELOG.md`.

| Change | Bump | Examples |
|---|---|---|
| Token value change that alters rendered output | major | New accent hex, new radius ladder, font swap |
| Removed or renamed token or rule | major | Dropping `--ds-space-5`, renaming `hairline-strong` |
| New token, component rule or foundation file; clarified reasoning | minor | Adding `--ds-shadow-4`, a new component entry |
| Typo, source link, wording with no behaviour change | patch | Fixing a URL, tightening a sentence |

Pre-1.0 (0.x): minor bumps may include breaking token changes, listed under "Changed" with
a migration note. 1.0.0 is declared when a product has shipped on the tokens and the contrast
table has no failing pair.

The changelog follows the Keep a Changelog format: `Added`, `Changed`, `Deprecated`,
`Removed`, `Fixed`, `Security`, dated entries, newest first.

## Update cadence

Weekly research review. Each week:

1. Re-measure two reference systems from awesome-design-md and awesome-design-md-jp and
   note any drift (radius, spacing, type sizes).
2. Check the source list in each foundation file for dead links or changed guidance
   (WCAG, Material, Apple HIG, shadcn changelog, Motion docs).
3. Re-run the contrast table if any color token changed.
4. Record findings in `CHANGELOG.md` under `Unreleased`; release a patch or minor when the
   list has three or more entries or any correctness fix.

Larger changes (font, accent, radius family) wait for a monthly review with a rendered
before/after screenshot set from Playwright.

## Sources of the system

- Measured systems: Linear, Vercel, Stripe, Apple, Notion, Figma, Raycast, Claude, Cursor
  (https://github.com/voltagent/awesome-design-md) and 487 Japanese sites
  (https://github.com/kzhrknt/awesome-design-md-jp).
- Standards: WCAG 2.2 (https://www.w3.org/TR/WCAG22/), Apple HIG, Material 3, JLReq.
- Practice: Nielsen Norman Group, Refactoring UI, Emil Kowalski, Josh Comeau, the Digital
  Agency design system (https://design.digital.go.jp/dads/foundations/typography/), taste-skill
  (https://github.com/Leonxlnx/taste-skill).
- Versioning: https://semver.org/ and https://github.com/olivierlacan/keep-a-changelog.
