---
title: "Anatomy of a Design System — Required Elements (2026)"
description: "Definitive, AI-agent-first survey of what a complete modern design system must contain, sourced from Material 3, Apple HIG, Polaris, Carbon, Atlassian, Spectrum 2, Primer, and Fluent 2."
updated: 2026-06-09
tags: [design-systems, design-tokens, foundations, components, governance, accessibility]
---

# Anatomy of a Design System — Required Elements

> Scope: the layered model every serious public design system converges on, with concrete 2026 values and copy-paste code. Sourced from each system's official docs. Use the **Checklist** at the end as a build/audit spec.

## The Layered Model (the canonical mental model)

Every mature system stacks the same way, theory → practice:

| Layer | What it is | Owns | Examples across systems |
|---|---|---|---|
| **1. Design tokens** | Named design decisions as data | The raw vocabulary; theming | M3 ref/sys/comp; Fluent global/alias/control; Primer base/functional/component |
| **2. Foundations** | Color, type, space, grid, elevation, motion, iconography | The "physics" of the brand | Carbon 2x Grid; Apple Dynamic Type; M3 type scale |
| **3. Primitives / Components** | Reusable UI building blocks with full states + a11y | Interaction + accessibility contract | Buttons, inputs, menus, cards |
| **4. Patterns** | Components composed to solve a recurring problem | Forms, nav, data display, feedback | Polaris patterns; Carbon page templates |
| **5. Content / voice** | How the product speaks | Microcopy, tone, error language | Polaris content; Spectrum writing |
| **6. Governance / contribution** | People + process that keep it trustworthy | Versioning, RFCs, deprecation | Spectrum (35-person core + federated), Carbon RFCs |

A token is a single codified decision; a **core system** codifies how decisions combine (e.g. a type ramp, an elevation system). Components are built *from* tokens + core systems, patterns are built *from* components. AI amplifies whatever foundation exists — a weak token layer gets amplified, not fixed. ([Sparkbox](https://sparkbox.com/foundry/design_system_makeup_design_system_layers_parts_of_a_design_system), [Brad Frost](https://bradfrost.com/blog/post/the-design-system-ecosystem/))

---

## 1. Design Tokens — the three-tier architecture

Every leading system uses **3 tiers**: primitive (raw) → semantic (role) → component (per-component). Components must reference *semantic* tokens, never primitives — that indirection is what makes theming a "token swap" (light/dark/high-contrast/dynamic color all become a values-table change). ([Contentful](https://www.contentful.com/blog/design-token-system/))

### Tier naming across systems

| System | Tier 1 (primitive) | Tier 2 (semantic) | Tier 3 (component) | Source |
|---|---|---|---|---|
| **Material 3** | `md.ref.*` (Reference) | `md.sys.*` (System) | `md.comp.*` (Component) | [m3](https://m3.material.io/foundations/design-tokens/overview) |
| **Fluent 2** | `Global.*` | `Set.*` (Alias) | Control mappings (no prefix) | [Fluent](https://fluent2.microsoft.design/design-tokens) |
| **Primer** | `base-*` | `*` functional (`bgColor-*`) | `button-*`, `control-*` | [Primer](https://primer.style/foundations/primitives/token-names) |
| **Atlassian** | palette refs | `color.*`, `space.*` semantic | (components consume semantic) | [Atlassian](https://atlassian.design/foundations/tokens/design-tokens/) |

### Material 3 naming convention

Name proceeds general → specific, dot-separated:

```
md . <ref|sys|comp> . <category> . <role/descriptor>
md.ref.palette.primary40        # primitive: a fixed hex
md.sys.color.primary            # semantic: a role, points at a ref
md.comp.fab.container.color     # component: points at a sys token
```

This is exactly what powers **Dynamic Color**: a new wallpaper regenerates `ref` tokens; `sys` and `comp` are untouched, so the whole UI re-themes automatically. ([m3](https://m3.material.io/foundations/design-tokens/overview))

### Fluent 2: global → alias → control (unidirectional)

```
Global.Color.Blue.60                       # raw value
Set.AccentActionControl.Fill.Color.Hover   # alias → Global.Color.Blue.60
AccentButton.Base.Fill.Color.Hover         # control → alias (never global directly)
```
Dependency flows one way: controls → control tokens → alias → global. Tooling renames per platform (`Global.Color.Blue.60` → `colorBlue60`). ([Fluent token pipeline](https://microsoft.github.io/fluentui-token-pipeline/naming.html))

### Primer: dash-separated, camelCase property (required)

```
prefix-namespace-pattern-property-variant-scale
base-color-green-5            # primitive (never use directly in code)
bgColor-default               # functional (most-used everywhere)
button-primary-bgColor-hover  # component/pattern (component CSS only)
boxShadow-inset-thick
```
Modifiers: `default` / `muted` / `emphasis`; t-shirt sizes `xsmall–xxlarge`; density `condensed|normal|spacious`. ([Primer](https://primer.style/foundations/primitives/token-names))

### Copy-paste: a 3-tier token file (W3C-style JSON + CSS)

```json
{
  "color": {
    "blue": { "500": { "$value": "#2680eb", "$type": "color" } },
    "action": {
      "primary": { "$value": "{color.blue.500}", "$type": "color" }
    }
  }
}
```

```css
:root {
  /* primitive */
  --blue-500: #2680eb;
  --gray-900: #111418;
  /* semantic — the only tier components consume */
  --color-action-primary: var(--blue-500);
  --color-text-default: var(--gray-900);
}
[data-theme="dark"] {
  --color-action-primary: #4b9cff; /* same semantic name, new value */
  --color-text-default: #f2f2f2;
}
/* component token */
.btn-primary { background: var(--color-action-primary); }
```

---

## 2. Foundations

A complete system codifies **seven** foundations: color, typography, space, grid, elevation, motion, iconography.

### 2.1 Color

- Built as a token ramp (e.g. `blue-5 … blue-95`), surfaced only through **semantic roles** (text/bg/border/icon, default/muted/emphasis, plus interaction states hover/pressed/selected/focused/disabled). Atlassian color tokens read `color` + property + role + emphasis + state. ([Atlassian](https://atlassian.design/foundations/color))
- **Theming is a values table**: light, dark, high-contrast each rebind the same semantic names. Carbon ships 4 themes — `White`, `Gray 10`, `Gray 90`, `Gray 100`. ([Carbon themes](https://v10.carbondesignsystem.com/guidelines/themes/overview/))
- M3 generates a tonal palette (0–100) per key color; dark mode swaps which tone a role points at.
- **A11y requirement:** semantic color pairs must hit WCAG contrast (4.5:1 text, 3:1 non-text/UI). Bake it into tokens, not into developer judgement. ([WCAG 2.2](https://www.w3.org/TR/WCAG22/))

### 2.2 Typography (type scale + roles)

Define a **named ramp with semantic roles**, not ad-hoc sizes.

**Material 3 type scale** — 5 roles × 3 sizes = 15 baseline styles (M3 Expressive adds 15 emphasized = 30). Tokens: `--md-sys-typescale-<role>-<size>-{font-size|line-height|font-weight|tracking}`.

| Role | L / M / S sizes (Regular unless noted) |
|---|---|
| Display | 57 / 45 / 36 |
| Headline | 32 / 28 / 24 |
| Title | 22 / 16 Medium / 14 Medium |
| Body | 16 / 14 / 12 |
| Label | 14 Medium / 12 Medium / 11 Medium |

Line-height ratio guidance: **~1.2×** for title/headline/display, **~1.5×** for body/label. ([M3 typography](https://m3.material.io/styles/typography/applying-type))

**Apple HIG** uses **Dynamic Type** text styles (LargeTitle, Title1–3, Headline, Body, Callout, Subheadline, Footnote, Caption1–2) on **SF Pro** (SF Pro Text ≤19pt, SF Pro Display ≥20pt; optical sizing automatic via system APIs). Avoid Ultralight/Thin/Light weights; honor a **minimum 11pt** even at smallest Dynamic Type. ([Apple Typography](https://developer.apple.com/design/human-interface-guidelines/typography))

**Fluent 2** ships platform-native ramps: Segoe UI / Segoe UI Variable (Web/Windows), SF Pro (macOS/iOS), Roboto (Android). Each type token bundles font-size + line-height + weight + family. ([Fluent typography](https://fluent2.microsoft.design/typography))

### 2.3 Space (the scale)

8px-based step scales dominate. Use tokens for both intra-component padding and inter-component layout.

**Carbon spacing** (`@carbon/layout`, multiples of 2/4/8):

| Token | rem | px | | Token | rem | px |
|---|---|---|---|---|---|---|
| spacing-01 | 0.125 | 2 | | spacing-08 | 2.5 | 40 |
| spacing-02 | 0.25 | 4 | | spacing-09 | 3 | 48 |
| spacing-03 | 0.5 | 8 | | spacing-10 | 4 | 64 |
| spacing-04 | 0.75 | 12 | | spacing-11 | 5 | 80 |
| spacing-05 | 1 | 16 | | spacing-12 | 6 | 96 |
| spacing-06 | 1.5 | 24 | | spacing-13 | 10 | 160 |
| spacing-07 | 2 | 32 | | | | |

Tokens do **not** change with viewport; instead you "jump steps" at breakpoints. ([Carbon spacing](https://carbondesignsystem.com/elements/spacing/overview/))

**Atlassian space** — base unit `space.100 = 8px`; the numeric suffix is a percentage of the base. `space.025`=2px, `space.200`=16px, `space.1000`=80px. Negative tokens `space.negative.025…400` (−2…−32px) exist for overlap/breakout. Ranges: 0–8px compact, 12–24px standard, 32–80px layout. ([Atlassian spacing](https://atlassian.design/foundations/spacing))

### 2.4 Grid

**Carbon 2x Grid**: 8px "mini unit" base; **16 columns**; Flexbox; 5 default breakpoints; **32px gutter** (16px each side) at every breakpoint; max width 1584px. Fluid grids divide by 2; fixed grids tile a fixed unit. ([Carbon 2x Grid](https://carbondesignsystem.com/elements/2x-grid/overview/))

### 2.5 Elevation

Surfaces + shadows = perceived depth. Atlassian elevation roles: `surface` (default/raised/overlay/sunken); raised+overlay pair with shadow tokens. **Dark mode**: shadows read poorly, so higher elevation = *lighter surface color* (front-lit metaphor) plus shadow. Elevation also carries hovered/pressed states. ([Atlassian elevation](https://atlassian.design/foundations/elevation))

### 2.6 Motion

Motion is tokenized as **easing × duration** (and increasingly **springs**).

**Material 3 easing/duration tokens** (CSS):

```css
:root {
  /* easing */
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  /* duration */
  --md-sys-motion-duration-short1: 50ms;   /* short2 100 / short3 150 / short4 200 */
  --md-sys-motion-duration-medium1: 250ms; /* …medium4 400 */
  --md-sys-motion-duration-long1: 450ms;   /* …long4 600 */
  --md-sys-motion-duration-extra-long1: 700ms;
}
```

**M3 Expressive** adds a **motion physics / spring** system that replaces fixed easing+duration for many transitions. Tokens split into **spatial** (position, size, rotation, corners — may overshoot) and **effects** (color, opacity — no overshoot), each with default/fast/slow, e.g. `md.sys.motion.spring.fast.spatial`. The scheme (`standard` vs `expressive`) is applied at product level so tokens stay stable. ([M3 motion tokens](https://m3.material.io/styles/motion/easing-and-duration/tokens-specs), [M3 Expressive](https://supercharge.design/blog/material-3-expressive))

Carbon splits motion into **productive** vs **expressive** curves via `@carbon/motion`. Always honor `prefers-reduced-motion`. ([Carbon](https://github.com/carbon-design-system/carbon))

### 2.7 Iconography

A system ships an **icon library** with consistent grid, stroke, and sizing, exposed as semantic sizes. Apple ships **SF Symbols** (scale/weight matched to SF Pro) plus the WWDC25 **Liquid Glass** layered app-icon system + **Icon Composer** tool. Spectrum 2 rebuilt its icon style between "sharp rational" and "Express bubbly." Icons must have accessible names (or `aria-hidden` when decorative) and meet 3:1 non-text contrast. ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/), [Spectrum 2](https://adobe.design/stories/design-for-scale/introducing-spectrum-2))

> **Apple HIG note (2026):** iOS/iPadOS/macOS 26 introduce **Liquid Glass** — a translucent, refractive material for controls/nav/modals that floats above content. Touch targets ≥ **44×44 pt**; contrast ≥ 4.5:1. ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/))

---

## 3. Primitives & Components (states + accessibility)

Components are the most-used layer, but a component is only "done" when its **states** and **accessibility contract** are specified — not just its default look.

### Required interactive states (every interactive component)

`default` · `hover` · `focus` (visible ring) · `active/pressed` · `selected` · `disabled` · plus where relevant `loading`, `error`, `read-only`, `indeterminate`. Atlassian models these as state modifiers on color/elevation tokens (`hovered`, `pressed`, `selected`, `focused`, `disabled`). ([UXPin states](https://www.uxpin.com/studio/blog/ui-component-library-checklist-essential-elements/), [Atlassian color](https://atlassian.design/foundations/color))

### Accessibility contract per component

Pinterest Gestalt's scorecard is a good "accessibility-ready" bar — a component must be:
1. **Visually accessible** — contrast 4.5:1 text / 3:1 UI; not color-alone.
2. **Screen-reader compatible** — correct semantics/role, name, ARIA.
3. **Navigable/operable** — full keyboard support, visible focus, logical order.
4. **Understandable** — predictable behavior, clear error handling.

Build on native semantics (`<button>`, `<label>`-associated inputs). Tie tokens to WCAG criteria: focus-ring color → 2.4.7, focus-ring width / non-text contrast → 1.4.11 (3:1), **44px min target** → 2.5.5/2.5.8. Automated tools cover only a portion of WCAG (roughly ~30–40% of success criteria are auto-testable; Deque reports ~57% of real-world issues by *volume* via axe-core) → manual + AT testing still required. ([WCAG 2.2](https://www.w3.org/TR/WCAG22/), [A11Y Pros](https://a11ypros.com/blog/accessibility-in-design-systems))

### Copy-paste: a fully-stated, accessible button (React + tokens)

```tsx
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export function Button({ variant = "primary", loading, disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant}`}
      // disabled communicates state to AT; aria-busy covers async work
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
```

```css
.btn {
  min-block-size: 44px;            /* WCAG 2.5.5 target size */
  padding-inline: var(--space-200);
  border-radius: var(--radius-sm);
  font: var(--type-label-large);
  transition: background var(--md-sys-motion-duration-short3)
              var(--md-sys-motion-easing-standard);
}
.btn--primary            { background: var(--color-action-primary); color: var(--color-on-primary); }
.btn--primary:hover      { background: var(--color-action-primary-hover); }
.btn--primary:active     { background: var(--color-action-primary-pressed); }
.btn:focus-visible       { outline: 2px solid var(--color-focus-ring); outline-offset: 2px; } /* 2.4.7 + 3:1 */
.btn:disabled            { opacity: .5; cursor: not-allowed; }
@media (prefers-reduced-motion: reduce) { .btn { transition: none; } }
```

### Baseline component inventory (what a "complete" library covers)

| Group | Components |
|---|---|
| **Actions** | Button, IconButton, ButtonGroup, Link, Menu/MenuButton |
| **Inputs/Selection** | TextField, Textarea, Select, Combobox/Autocomplete, Checkbox, Radio, Switch/Toggle, Slider, DatePicker, FileUpload |
| **Layout/Structure** | Box, Stack/Inline, Grid, Card, Divider, Page/Layout |
| **Navigation** | Tabs, Breadcrumbs, Pagination, SideNav, TopNav, Menu, Disclosure/Accordion |
| **Data display** | Table/DataGrid, List, Tag/Badge, Avatar, Tooltip, DescriptionList |
| **Feedback/Overlay** | Modal/Dialog, Drawer, Toast/Snackbar, Banner/Alert, ProgressBar/Spinner, Skeleton, EmptyState |

Polaris groups its library as **Actions / Layout & structure / Selection & input** (+ more). ([Polaris](https://polaris-react.shopify.com/), [Carbon](https://github.com/carbon-design-system/carbon))

---

## 4. Patterns

A pattern = components composed to solve a recurring problem. This is where real productivity (and page templates) live. Polaris documents patterns for page structure, navigation, common actions, empty states, error handling, loading, and multi-step workflows. ([Polaris patterns](https://polaris-react.shopify.com/), [Brad Frost](https://bradfrost.com/blog/post/the-design-system-ecosystem/))

The four pattern families a system must cover:

| Family | Must document | Key rules |
|---|---|---|
| **Forms** | Field layout, labels, help text, inline validation, required/optional, error summary, submission/disabled state | Label every field (`<label for>`); errors announced (`aria-describedby`, `role="alert"`); never validate by color alone |
| **Navigation** | Top/side nav, tabs, breadcrumbs, pagination, in-page anchors | One H1; visible focus; skip link; `aria-current`; keyboard arrow patterns for menus/tabs |
| **Data display** | Tables/data grids, lists, cards, detail views, filtering/sorting | Sortable headers expose state; sticky headers; responsive collapse; empty/loading variants |
| **Feedback** | Toasts, banners/inline alerts, dialogs, progress, skeletons, **empty states** | `role="status"`/`role="alert"`; focus trap + restore for modals; non-blocking confirmations |

### Pattern example: accessible inline form validation

```html
<div class="field">
  <label for="email">Email</label>
  <input id="email" type="email" name="email"
         aria-invalid="true" aria-describedby="email-error" />
  <p id="email-error" role="alert" class="field__error">
    Enter a valid email, e.g. name@example.com
  </p>
</div>
```

---

## 5. Content / Voice Guidelines

A design system speaks, not just renders. Required artifacts:

- **Voice & tone** principles (e.g. Polaris: friendly, direct, easy to act on; merchant-first). ([Polaris content](https://polaris-react.shopify.com/))
- **Microcopy rules** for buttons (action-led verbs), empty states, and confirmations.
- **Error-message guidelines**: say what happened, why, and how to fix; no blame; no jargon; never rely on color/icon alone.
- **Grammar & mechanics**: capitalization (sentence vs title case), numbers, dates, units, terminology glossary.
- **Accessibility of copy**: meaningful link text (not "click here"), plain language, alt-text guidance.

Spectrum and Polaris both treat writing as a first-class part of the system (UX writing articles + tone matrices), so components ship with copy guidance, not just visual specs. ([Polaris](https://polaris-react.shopify.com/), [Spectrum](https://spectrum.adobe.com/))

---

## 6. Governance & Contribution

A design system is a **product, not a project** — it needs ongoing operations (triage, review, adoption tracking), or it stagnates. ([Cabin](https://cabinco.com/design-system-governance-that-sticks/))

### Governance models

| Model | Strength | Failure mode |
|---|---|---|
| **Centralized** | Quality, consistency | Central team becomes a bottleneck; teams build workarounds |
| **Federated** | Buy-in, flexibility | Governance-by-committee past ~15–20 designers; nobody owns hard calls; bloat |
| **Hybrid (recommended)** | Small central team + federated contributors with clear decision rights | Needs real ops + authority to say "no" |

Adobe Spectrum runs a **35-person core team + hundreds of contributors**, with per-item versioning, open issues, and a design checklist communicating status — partnership over mandate. ([Spectrum scale](https://adobe.design/stories/design-for-scale/introducing-spectrum-2), [Knapsack/Braithwaite](https://www.knapsack.cloud/blog/garth-braithwaite-on-design-tokens-governance-and-scaling-spectrum-at-adobe))

### Contribution pipeline (RFC-style)

```
Request → Review → Design → Build → Document → Release
```
Supporting rituals: per-team **ambassadors**, feedback channels (Slack/forum), reuse culture, PR templates, read-only access broad / write access gated. Avoid the **"service team" trap** (central team forced to say yes to everything → bloat). ([UX Planet](https://uxplanet.org/design-system-governance-models-f66a97367ad5), [Nathan Curtis](https://medium.com/@nathanacurtis/the-fallacy-of-federated-design-systems-23b9a9a05542))

### Versioning & release

- **Semantic versioning** + changelog + migration guides for breaking changes.
- Predictable cadence (e.g. monthly minor / quarterly major).
- **Deprecation policy** with advance notice + migration path. Atlassian ships **codemods** to auto-migrate raw values → tokens. ([Atlassian migrate](https://atlassian.design/tokens/migrate-to-tokens/))
- Tooling: token diff generators, release analyzers, and (2025+) **MCP servers** exposing token data to AI assistants (Adobe Spectrum Design Data MCP). ([Spectrum data](https://github.com/adobe/spectrum-design-data))

### Multi-platform delivery

Tokens compile to many targets from one source (Style Dictionary / token pipelines). Polaris ships npm + Ruby gem; **Polaris moved to Web Components (Oct 1, 2025)**, deprecating Polaris React for framework-agnostic reach. Spectrum ships Spectrum CSS + React Spectrum + Spectrum Web Components. ([Polaris tokens](https://github.com/Shopify/polaris-tokens), [Spectrum](https://spectrum.adobe.com/))

---

## ✅ The "Elements a Design System Must Have" Checklist

**1. Design tokens**
- [ ] 3 tiers: primitive → semantic → component, with a documented naming convention
- [ ] Components reference **only** semantic/component tokens (never primitives)
- [ ] Themes (light/dark/high-contrast) implemented as a values swap on the same semantic names
- [ ] Single source of truth (W3C DTCG JSON / Style Dictionary) compiling to CSS vars + platform code

**2. Foundations**
- [ ] Color ramp + semantic roles (text/bg/border/icon × default/muted/emphasis × states), WCAG-checked
- [ ] Type scale with named roles (display/headline/title/body/label) + line-height rules; Dynamic Type / fluid support
- [ ] Spacing scale (8px base, e.g. `space-01…13`), incl. negative values where needed
- [ ] Responsive grid (columns, breakpoints, gutters, max-width)
- [ ] Elevation system (surface + shadow, dark-mode-aware, with states)
- [ ] Motion tokens (easing × duration, and/or springs) + `prefers-reduced-motion`
- [ ] Icon library (consistent grid/stroke/size, accessible naming)

**3. Components**
- [ ] Baseline inventory (actions, inputs, layout, nav, data display, feedback/overlay)
- [ ] Every interactive component specifies all states (default/hover/focus/active/selected/disabled/loading/error)
- [ ] Accessibility contract per component (semantics, keyboard, focus, name/role, 44px targets) + documented test results
- [ ] Built on native HTML semantics; ARIA only to fill gaps

**4. Patterns**
- [ ] Forms (validation + error summary), Navigation, Data display, Feedback documented as composed patterns
- [ ] Page/layout templates and common flows (empty/loading/error states)

**5. Content / voice**
- [ ] Voice & tone principles, microcopy rules, error-message guidelines, grammar/terminology glossary

**6. Governance / contribution**
- [ ] Stated governance model (hybrid recommended) with explicit decision rights
- [ ] RFC-style contribution pipeline (Request→Review→Design→Build→Document→Release)
- [ ] SemVer + changelog + migration guides + deprecation policy + release cadence
- [ ] Treated as a product: ops, adoption metrics, accessibility in CI (axe/Lighthouse), MCP/AI access to tokens

---

## Sources

- Material Design 3 — Design tokens overview — https://m3.material.io/foundations/design-tokens/overview
- Material Design 3 — Typography / Applying type — https://m3.material.io/styles/typography/applying-type
- Material Design 3 — Motion easing & duration tokens-specs — https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
- Material 3 Expressive (Supercharge) — https://supercharge.design/blog/material-3-expressive
- Apple — Human Interface Guidelines — https://developer.apple.com/design/human-interface-guidelines/
- Apple — HIG Typography — https://developer.apple.com/design/human-interface-guidelines/typography
- Shopify Polaris React — https://polaris-react.shopify.com/
- Shopify polaris-tokens (GitHub) — https://github.com/Shopify/polaris-tokens
- IBM Carbon — Spacing overview — https://carbondesignsystem.com/elements/spacing/overview/
- IBM Carbon — 2x Grid overview — https://carbondesignsystem.com/elements/2x-grid/overview/
- IBM Carbon — Themes (v10) — https://v10.carbondesignsystem.com/guidelines/themes/overview/
- IBM Carbon — Monorepo (GitHub) — https://github.com/carbon-design-system/carbon
- Atlassian Design — Tokens overview — https://atlassian.design/foundations/tokens/design-tokens/
- Atlassian Design — Spacing — https://atlassian.design/foundations/spacing
- Atlassian Design — Color — https://atlassian.design/foundations/color
- Atlassian Design — Elevation — https://atlassian.design/foundations/elevation
- Atlassian Design — Migrate to tokens — https://atlassian.design/tokens/migrate-to-tokens/
- Adobe Spectrum — Design tokens — https://spectrum.adobe.com/page/design-tokens/
- Adobe — Introducing Spectrum 2 — https://adobe.design/stories/design-for-scale/introducing-spectrum-2
- adobe/spectrum-design-data (GitHub) — https://github.com/adobe/spectrum-design-data
- Knapsack — Garth Braithwaite on tokens & governance — https://www.knapsack.cloud/blog/garth-braithwaite-on-design-tokens-governance-and-scaling-spectrum-at-adobe
- GitHub Primer — Token names — https://primer.style/foundations/primitives/token-names
- primer/primitives (GitHub) — https://github.com/primer/primitives
- Microsoft Fluent 2 — Design tokens — https://fluent2.microsoft.design/design-tokens
- Microsoft Fluent 2 — Typography — https://fluent2.microsoft.design/typography
- Fluent UI token pipeline — Naming reference — https://microsoft.github.io/fluentui-token-pipeline/naming.html
- WCAG 2.2 (W3C) — https://www.w3.org/TR/WCAG22/
- A11Y Pros — Accessibility in design systems — https://a11ypros.com/blog/accessibility-in-design-systems
- UXPin — UI component library checklist — https://www.uxpin.com/studio/blog/ui-component-library-checklist-essential-elements/
- UX Planet — Design system governance models — https://uxplanet.org/design-system-governance-models-f66a97367ad5
- Nathan Curtis — The fallacy of federated design systems — https://medium.com/@nathanacurtis/the-fallacy-of-federated-design-systems-23b9a9a05542
- Cabin — Design system governance that sticks — https://cabinco.com/design-system-governance-that-sticks/
- Sparkbox — Layers and parts of a design system — https://sparkbox.com/foundry/design_system_makeup_design_system_layers_parts_of_a_design_system
- Brad Frost — The design system ecosystem — https://bradfrost.com/blog/post/the-design-system-ecosystem/
- Contentful — Design token system — https://www.contentful.com/blog/design-token-system/
