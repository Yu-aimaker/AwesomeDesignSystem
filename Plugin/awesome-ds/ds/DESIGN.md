---
version: 0.5.0
name: AwesomeDS
description: >
  A neutral, content-first design system for web products. Near-white canvas,
  near-black ink, one accent used only for links, focus and selection. Geist +
  Noto Sans JP typography on a 4px spatial grid. Borders before shadows. Motion
  only as feedback (fast, eased-out, spring for gestures). Built from measured
  patterns in Linear, Vercel, Stripe, Apple HIG, Material 3, shadcn/ui and
  Japanese typographic practice. Every value below has a written reason in
  AwesomeDS/foundations/*.md.

colors:
  canvas: "#ffffff"
  canvas-soft: "#fafafa"
  surface: "#ffffff"
  surface-raised: "#ffffff"
  surface-sunken: "#f5f5f5"
  ink: "#0a0a0a"
  ink-secondary: "#525252"
  ink-muted: "#6b6b6b"
  ink-disabled: "#a3a3a3"
  hairline: "#e5e5e5"
  hairline-strong: "#8c8c8c"
  accent: "#2f5bea"
  accent-hover: "#264dd0"
  accent-soft: "#e8eefc"
  on-accent: "#ffffff"
  primary: "#0a0a0a"
  primary-hover: "#262626"
  on-primary: "#ffffff"
  success: "#167534"
  success-soft: "#e6f4ea"
  warning: "#9a5c00"
  warning-soft: "#fff4e0"
  danger: "#c81e1e"
  danger-soft: "#fdecec"
  focus-ring: "#2f5bea"
  selection: "#dbe4fd"
  dark-canvas: "#0a0a0a"
  dark-canvas-soft: "#111111"
  dark-surface: "#141414"
  dark-surface-raised: "#1a1a1a"
  dark-surface-sunken: "#0f0f0f"
  dark-ink: "#fafafa"
  dark-ink-secondary: "#a3a3a3"
  dark-ink-muted: "#8a8a8a"
  dark-hairline: "#262626"
  dark-hairline-strong: "#666666"
  dark-accent: "#7a9cff"
  dark-accent-hover: "#93afff"
  dark-accent-soft: "#16203d"
  dark-on-accent: "#0a0a0a"
  dark-primary: "#fafafa"
  dark-primary-hover: "#e5e5e5"
  dark-on-primary: "#0a0a0a"
  dark-success: "#4ade80"
  dark-success-soft: "#0f2a18"
  dark-warning: "#fbbf24"
  dark-warning-soft: "#2a1f05"
  dark-danger: "#f87171"
  dark-danger-soft: "#2f1010"
  dark-focus-ring: "#7a9cff"
  dark-selection: "#1e2a4d"

typography:
  display:
    fontFamily: Geist, Noto Sans JP
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: Geist, Noto Sans JP
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: Geist, Noto Sans JP
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  h3:
    fontFamily: Geist, Noto Sans JP
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.01em
  h4:
    fontFamily: Geist, Noto Sans JP
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  body-lg:
    fontFamily: Geist, Noto Sans JP
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body:
    fontFamily: Geist, Noto Sans JP
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: Geist, Noto Sans JP
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: Geist, Noto Sans JP
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.01em
  label:
    fontFamily: Geist, Noto Sans JP
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  mono:
    fontFamily: Geist Mono, JetBrains Mono
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  xxl: 24px
  pill: 9999px

spacing:
  "1": 4px
  "2": 8px
  "3": 12px
  "4": 16px
  "5": 20px
  "6": 24px
  "8": 32px
  "10": 40px
  "12": 48px
  "16": 64px
  "20": 80px
  "24": 96px
  "32": 128px

motion:
  duration-instant: 100ms
  duration-fast: 150ms
  duration-base: 200ms
  duration-slow: 300ms
  duration-slower: 500ms
  ease-out: cubic-bezier(0.16, 1, 0.3, 1)
  ease-in: cubic-bezier(0.7, 0, 0.84, 0)
  ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
  spring-gentle: "stiffness 170, damping 26"
  spring-snappy: "stiffness 400, damping 30"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0 16px
    height: 40px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0 16px
    height: 40px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: 40px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: 40px
  card:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: 24px
  dialog:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.xl}"
    padding: 24px
    shadow: "0 16px 48px -12px rgba(10,10,10,0.18)"
  badge:
    backgroundColor: "{colors.surface-sunken}"
    textColor: "{colors.ink-secondary}"
    typography: "{typography.caption}"
    rounded: "{rounded.pill}"
    padding: 2px 8px
---

# AwesomeDS

AwesomeDS is the canonical design system of this repository. Use it directly when a
product has no brand of its own yet. Use it as the base when you build a brand-specific
system with the `ds-creator` skill. Every rule here is a default with a reason; the
reasons and the sources live in [`foundations/`](foundations/).

Read this file top to bottom before generating UI. Then open the foundation file for
any area you are about to touch.

## 1. Visual theme and atmosphere

- White canvas, near-black text, one accent. The interface stays quiet so the content
  is the loudest thing on screen.
- Hierarchy comes from type size, weight and spacing, not from color or decoration.
- Borders separate; shadows are reserved for things that float (menus, dialogs, drag).
- Corners are soft (8px controls, 12px cards) and consistent across the page.
- Motion is short, eased out, and always attached to something the user did.
- Density is medium: 16px body, 24px card padding, 64 to 96px between sections.
- No gradients on backgrounds, no glass, no glow, no decorative blobs by default.

Keywords: calm, precise, legible, honest, unhurried.

## 2. Color

Full reasoning: [`foundations/color.md`](foundations/color.md).

Roles, not hues. Never reference a raw hex in a component; reference a role.

| Role | Light | Dark | Use |
|---|---|---|---|
| canvas | `#ffffff` | `#0a0a0a` | Page background |
| canvas-soft | `#fafafa` | `#111111` | Alternate section, code block background |
| surface | `#ffffff` | `#141414` | Cards, inputs, popovers |
| surface-sunken | `#f5f5f5` | `#0f0f0f` | Table header, inset wells, badges |
| ink | `#0a0a0a` | `#fafafa` | Headings, body text, primary button fill |
| ink-secondary | `#525252` | `#a3a3a3` | Supporting text, labels (7.8:1 on white) |
| ink-muted | `#6b6b6b` | `#8a8a8a` | Placeholders, timestamps (5.3:1 on white, 4.9:1 on surface-sunken, 5.7:1 on dark) |
| hairline | `#e5e5e5` | `#262626` | Dividers, card borders |
| hairline-strong | `#8c8c8c` | `#666666` | Input and control borders (3.4:1 on canvas, WCAG 1.4.11) |
| accent | `#2f5bea` | `#7a9cff` | Links, focus ring, selected state, one highlight |
| success / warning / danger | `#167534` / `#9a5c00` / `#c81e1e` | `#4ade80` / `#fbbf24` / `#f87171` | Status only, never decoration. Each is at least 4.5:1 on canvas and on its soft background |

Rules

1. Primary actions are ink on canvas (black button, white text). The accent is not a
   button color. This keeps the accent meaningful when it appears.
2. One accent per product. Change the accent to match the brand; keep every neutral.
3. Neutrals are true grays (no blue or warm cast) so brand colors are never fighting a tint.
4. Text contrast is at least 4.5:1 for body, 3:1 for large text and for borders that
   identify a control (inputs, checkboxes). Dividers and card borders (`hairline`) are
   decorative and exempt. Check with the values above; do not eyeball.
5. Status colors carry an icon or a label. Color alone is never the message.
6. Dark mode inverts luminance, not hue. Surfaces get lighter as they rise
   (`#0a0a0a`, `#0f0f0f`, `#141414`, `#1a1a1a`); the accent is lightened for contrast.

## 3. Typography

Full reasoning: [`foundations/typography.md`](foundations/typography.md) and
[`foundations/japanese-typography.md`](foundations/japanese-typography.md).

```css
--font-sans: "Geist", "Noto Sans JP", system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif;
--font-mono: "Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
```

- Geist for Latin (open license, designed for screens, tabular figures, variable weight).
- Noto Sans JP for Japanese (largest glyph coverage, variable, pairs with Geist at the
  same x-height). Load Latin and Japanese as two subsets; never ship one 5 MB file.
- No serif by default. A serif is a brand decision, made in `ds-creator`, not a default.
- Weights: 400 body, 500 labels and buttons, 600 headings. Never 700 or heavier.
- Scale (px): 12, 14, 16, 18, 20, 28, 36, 56. Body is 16. Small UI text is 14. Never below 12.
- Line height: 1.6 body (Japanese 1.8), 1.2 to 1.35 headings (Japanese 1.4 to 1.5).
- Letter spacing: -0.02em on display and h1 Latin, 0 on body. Japanese text: 0 to 0.02em,
  never negative.
- Measure: body text max 65ch Latin, 40 full-width characters Japanese.
- Numbers in tables use `font-variant-numeric: tabular-nums`.
- Japanese: `line-break: strict`, `overflow-wrap: anywhere`, `text-autospace` where
  supported; `palt` on headings only, never on body.

## 4. Spacing and layout

Full reasoning: [`foundations/spacing.md`](foundations/spacing.md).

- 4px base unit. Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128.
- Inside a component: 8 to 16. Between related elements: 16 to 24. Between groups: 32
  to 48. Between sections: 64 (mobile) to 96 (desktop).
- Page content max width 1200px (`72rem` on wider screens is acceptable up to 1280).
  Reading content max width 65ch.
- Grid: 12 columns, 24px gutter at desktop, 16px at mobile. Prefer CSS Grid over
  flexbox arithmetic.
- Breakpoints: 640, 768, 1024, 1280, 1536.
- Left-align text by default. Center only short display headings and empty states.
- Touch targets 44x44 minimum on mobile, 24x24 minimum on desktop (WCAG 2.2 2.5.8).

## 5. Shape

Full reasoning: [`foundations/radius.md`](foundations/radius.md).

- Controls (button, input, select, tab): 8px.
- Cards, popovers, menus: 12px. Dialogs, sheets: 16px. Badges, avatars, toggles: pill.
- Nested radius = outer radius − padding (a 12px card with 4px padding holds an 8px image).
- One radius family per product. Do not mix sharp and pill on the same page.
- Borders are 1px. Never 2px except the focus ring.

## 6. Depth and elevation

Full reasoning: [`foundations/elevation.md`](foundations/elevation.md).

| Level | Treatment | Use |
|---|---|---|
| 0 | none | Page, sections, tables |
| 1 | `1px solid hairline` | Cards, inputs, inline panels |
| 2 | border + `0 4px 12px -2px rgba(10,10,10,.08)` | Popovers, dropdowns, tooltips |
| 3 | border + `0 16px 48px -12px rgba(10,10,10,.18)` | Dialogs, command menu, drag layer |

Shadows are tinted with the ink color, never pure black on a light canvas. On dark
canvas, elevation is expressed by a lighter surface and a stronger hairline, not by
shadow.

## 7. Motion

Full reasoning: [`foundations/motion.md`](foundations/motion.md).

- Durations: 100ms (color, opacity on hover), 150ms (small movement), 200ms (default
  enter), 300ms (dialog, sheet), 500ms (page level, rare).
- Enter with `ease-out` `cubic-bezier(0.16, 1, 0.3, 1)`. Exit faster than enter and
  with `ease-in`. Never use `linear` for anything the user watches, and never `ease`
  (the CSS default) because it is symmetric.
- Gestures and drags use springs (Motion `type: "spring", stiffness: 400, damping: 30`).
- Enter transforms travel 4 to 8px, never 24+. Scale enters start at 0.98, never 0.8.
- Nothing loops forever except a progress indicator.
- `prefers-reduced-motion: reduce` disables transforms and keeps only opacity.
- Library order: CSS transitions → Motion (`motion/react`) → GSAP ScrollTrigger only
  for pinned or scrubbed scroll sequences → Lottie for illustration → three.js (via
  react-three-fiber) only when the product is 3D.

## 8. Components

Rules and specs: [`components/README.md`](components/README.md).

- Base library: shadcn/ui on Radix primitives (Base UI is the accepted alternative).
  Install components into the project; do not import a pre-styled kit.
- Icons: Lucide, `strokeWidth 1.75`, sizes 16 (inline), 20 (buttons), 24 (standalone).
  One icon family per product.
- Every interactive component ships with hover, focus-visible, active, disabled,
  loading states. Every data view ships with loading (skeleton), empty and error states.
- Forms: label above, helper text below, error below in `danger` with an icon. Never
  placeholder as label.
- Buttons: 40px default height, 32px small, 48px large. Label fits on one line.
  One primary button per view.
- Feedback: no message when the result is visible; inline for a field, error summary
  for a form, one banner for the page, toast only for off-screen results, dialog only
  when the user must decide. Errors and toasts with an action never auto-dismiss.
  Full rules: [`foundations/feedback.md`](foundations/feedback.md).

## 9. Do and do not

Do

- Start from the content and let it set the layout.
- Use spacing and type weight for hierarchy before any color.
- Show real states: loading, empty, error, success.
- Test every text and border color against its background.
- Write UI copy the way you would say it to a colleague. Short, direct, specific.

Do not

- Use gradients, glow, glass, or blurred blobs as decoration.
- Use the accent as a button fill or on more than one element per view.
- Put an uppercase eyebrow label above every heading.
- Center long paragraphs. Use three identical cards in a row as a default.
- Use `Inter + slate + purple gradient`. It is the most recognisable AI default.
- Write copy with filler ("seamless", "unlock", "empower", "next generation") or
  metaphors that need explaining.
- Use em dashes in UI copy. Use a period or a comma.
- Build a date with slashes (`10/08`). Japanese prose is 2026年10月8日.
  Tables and code use `2026-10-08`.
- Ship a generated default (purple gradient, three equal cards, `ことができます`,
  `シームレス`) because it looks finished. Principle 7 in
  [`foundations/principles.md`](foundations/principles.md). The before/after catalog
  is `Knowledge/skills/anti-ai-slop.md`.
- Ship a long introduction before the decision, a chart with two y-axes, a color
  key where a label fits, or a number the chart does not show. The four tables are
  in [`foundations/anti-patterns.md`](foundations/anti-patterns.md).

## 10. Responsive behaviour

- Mobile first. Every multi-column layout declares its `< 768px` fallback.
- Hero fits in the first viewport on a 390px wide phone: heading max 2 lines at 32px,
  one paragraph, one primary button.
- Navigation collapses to a single row or a menu; it never wraps.
- Use `min-height: 100dvh`, never `100vh`, for full-height sections.
- Images use `aspect-ratio` and `object-fit: cover`; reserve space to avoid layout shift.

## 11. Accessibility

Full reasoning: [`foundations/accessibility.md`](foundations/accessibility.md).

- WCAG 2.2 AA is the floor. Contrast, focus visibility, target size, reduced motion.
- Focus ring: 2px solid accent, 2px offset, on every focusable element via
  `:focus-visible`. Never `outline: none` without a replacement.
- Semantic HTML first, ARIA second. One `h1` per page, headings in order.
- Every icon-only button has an `aria-label`. Every image has `alt` (empty when decorative).
- Keyboard: everything reachable by Tab, dismissible by Escape, operable by Enter/Space.

## 12. Agent prompt guide

When you build UI with AwesomeDS:

1. State the page kind and audience in one line before writing code.
2. Import the tokens from `AwesomeDS/tokens/tokens.css` (or the Tailwind theme in
   `tokens/tailwind.css`). Do not redeclare colors, radii, or durations inline.
3. Pick components from shadcn/ui and restyle them with the tokens.
4. Write the content first, then the layout. Cut copy that does not change what the
   user will do.
5. Before finishing, run the checklist in [`components/checklist.md`](components/checklist.md).
   If you cannot, say what you skipped.

Quick reference

```
canvas #ffffff  ink #0a0a0a  secondary #525252  muted #6b6b6b  hairline #e5e5e5  input border #8c8c8c
accent #2f5bea (links, focus, selected)  primary button: ink on canvas
sans Geist + Noto Sans JP  mono Geist Mono  body 16/1.6  h1 36/1.2/600/-0.02em
space 4 8 12 16 24 32 48 64 96  radius 8 (controls) 12 (cards) 16 (dialogs)
motion 150-200ms cubic-bezier(.16,1,.3,1)  spring 400/30  reduced-motion on
```
