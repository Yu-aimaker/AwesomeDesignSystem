---
version: 0.1.0
name: {{PRODUCT_NAME}}
description: >
  {{ONE_PARAGRAPH: what the product is, who it is for, the three adjectives,
  and the one or two things that differ from AwesomeDS. Built on AwesomeDS 0.1.0.}}

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
  accent: "{{ACCENT}}"
  accent-hover: "{{ACCENT_HOVER}}"
  accent-soft: "{{ACCENT_SOFT}}"
  on-accent: "{{ON_ACCENT}}"
  primary: "#0a0a0a"
  primary-hover: "#262626"
  on-primary: "#ffffff"
  success: "#167534"
  success-soft: "#e6f4ea"
  warning: "#9a5c00"
  warning-soft: "#fff4e0"
  danger: "#c81e1e"
  danger-soft: "#fdecec"
  focus-ring: "{{ACCENT}}"
  selection: "{{SELECTION}}"
  dark-canvas: "#0a0a0a"
  dark-canvas-soft: "#111111"
  dark-surface: "#141414"
  dark-surface-raised: "#1a1a1a"
  dark-ink: "#fafafa"
  dark-ink-secondary: "#a3a3a3"
  dark-ink-muted: "#8a8a8a"
  dark-hairline: "#262626"
  dark-hairline-strong: "#666666"
  dark-accent: "{{DARK_ACCENT}}"
  dark-primary: "#fafafa"
  dark-on-primary: "#0a0a0a"

typography:
  display:
    fontFamily: {{FONT_DISPLAY_OR_SANS}}
    fontSize: 56px
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: -0.02em
  h1:
    fontFamily: {{FONT_SANS}}
    fontSize: 36px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.02em
  h2:
    fontFamily: {{FONT_SANS}}
    fontSize: 28px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.015em
  h3:
    fontFamily: {{FONT_SANS}}
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: -0.01em
  h4:
    fontFamily: {{FONT_SANS}}
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0
  body-lg:
    fontFamily: {{FONT_SANS}}
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body:
    fontFamily: {{FONT_SANS}}
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: {{FONT_SANS}}
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: {{FONT_SANS}}
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0.01em
  label:
    fontFamily: {{FONT_SANS}}
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
  md: {{RADIUS_CONTROL}}
  lg: {{RADIUS_CARD}}
  xl: {{RADIUS_DIALOG}}
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
    height: {{CONTROL_HEIGHT}}
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0 16px
    height: {{CONTROL_HEIGHT}}
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink-secondary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: {{CONTROL_HEIGHT}}
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.hairline-strong}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: 0 12px
    height: {{CONTROL_HEIGHT}}
  card:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.hairline}"
    rounded: "{rounded.lg}"
    padding: {{CARD_PADDING}}
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

# {{PRODUCT_NAME}} Design System

Built on AwesomeDS 0.1.0. Every value not listed in [RATIONALE.md](RATIONALE.md) is an AwesomeDS default. Read this file, then `tokens.css`, before generating UI. Rules marked `(default, not decided)` were never confirmed by the brand owner; treat them as provisional.

## 1. Visual theme and atmosphere

Keywords: {{ADJ_1}}, {{ADJ_2}}, {{ADJ_3}}. (decided: Q3)

- {{ONE LINE: what ADJ_1 changes vs AwesomeDS, or "no change"}}
- {{ONE LINE: what ADJ_2 changes}}
- {{ONE LINE: what ADJ_3 changes}}
- Near: {{REFERENCE_LIKED}}. Not like: {{REFERENCE_DISLIKED}}. (Q12)
- Everything else follows AwesomeDS: quiet canvas, hierarchy by type and spacing, borders before shadows, motion as feedback.

## 2. Color

| Role | Light | Dark | Use | Status |
|---|---|---|---|---|
| canvas | `#ffffff` | `#0a0a0a` | Page background | default |
| surface | `#ffffff` | `#141414` | Cards, inputs, popovers | default |
| ink | `#0a0a0a` | `#fafafa` | Text, primary button | default |
| ink-secondary | `#525252` | `#a3a3a3` | Supporting text | default |
| ink-muted | `#6b6b6b` | `#8a8a8a` | Placeholder, timestamp | default |
| hairline / strong | `#e5e5e5` / `#8c8c8c` | `#262626` / `#666666` | Dividers / control borders | default |
| accent | `{{ACCENT}}` | `{{DARK_ACCENT}}` | Links, focus, selection | {{ACCENT_STATUS}} |
| success / warning / danger | `#167534` / `#9a5c00` / `#c81e1e` | `#4ade80` / `#fbbf24` / `#f87171` | Status with icon or label | default |

Rules: same as AwesomeDS section 2. Primary buttons are ink on canvas {{OR: "are the brand colour (changed: Q5, quoted answer)"}}. Contrast table: see RATIONALE.md.

## 3. Typography

Sans: `{{FONT_SANS}}` {{STATUS}}. Mono: Geist Mono. {{IF SERIF: "Display: {{FONT_DISPLAY}} on display and h1 only, never in controls (changed: Q6)."}}
Scale, weights, line heights and Japanese rules follow AwesomeDS section 3 unless listed in RATIONALE.md.

## 4. Spacing and layout

Density: {{comfortable | compact}} ({{STATUS}}). Controls {{CONTROL_HEIGHT}}, card padding {{CARD_PADDING}}, sections 64 to 96px. Everything else per AwesomeDS section 4.

## 5. Shape

Controls {{RADIUS_CONTROL}}, cards {{RADIUS_CARD}}, dialogs {{RADIUS_DIALOG}}, badges pill ({{STATUS}}). One family per page.

## 6. Depth, 7. Motion

Per AwesomeDS. Motion appetite: {{low | medium | high}} ({{STATUS}}). {{IF high: "Scroll-driven sequences allowed on marketing pages only, with reduced-motion fallback."}}

## 8. Copy

Tone: {{TONE}} ({{STATUS}}). {{ONE LINE on sentence length, politeness level (Japanese: です・ます), exclamation and emoji policy}}. No em dashes, no filler words.

## 9. Dark mode

{{both, follow OS | light only | dark only | both with switch}} ({{STATUS}}).

## 10. Platforms and accessibility

Platforms: {{PLATFORMS}} ({{STATUS}}). Accessibility floor: WCAG 2.2 AA {{plus: AAA body contrast | JIS X 8341-3 | larger body 18px}} ({{STATUS}}).

## 11. Agent prompt guide

1. State page kind and audience in one line.
2. Import `design-system/tokens.css` (it imports the AwesomeDS base) and `design-system/tailwind.css`.
3. Build with shadcn/ui restyled by tokens; follow AwesomeDS components/README.md.
4. Run the AwesomeDS checklist before finishing.
5. When this file and AwesomeDS disagree, this file wins; when this file is silent, AwesomeDS applies.

## Open questions

{{BULLETS: every "default, not decided" item with the question that would decide it}}
