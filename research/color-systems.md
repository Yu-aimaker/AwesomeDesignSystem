---
title: "Color Systems: OKLCH, P3 Wide Gamut, Contrast, Dark Mode & Tokens"
description: "AI-agent-first reference for modern color in design systems — OKLCH, display-p3, WCAG 2.x + APCA contrast, semantic tokens, dark-mode strategy, and palette generation. Current as of June 2026."
updated: 2026-06-09
tags: [color, oklch, p3, contrast, apca, dark-mode, design-tokens, css]
---

# Color Systems: OKLCH, P3, Contrast, Dark Mode & Tokens

> Scope: how to define, scale, theme, and verify color in a 2026 design system.
> Default to **OKLCH** for authoring, **display-p3** for vibrancy with sRGB fallback,
> **semantic tokens** for theming, **WCAG 2.x AA as the legal floor** and **APCA as the
> readability ceiling**. Build palettes with a **dominant color + sharp accent**, not a
> timid even spread.

## TL;DR decision table

| Need | Use | Why |
|------|-----|-----|
| Author/scale colors | `oklch(L C H)` | Perceptually uniform; equal L = equal brightness across hues |
| Vibrant colors on modern screens | `color(display-p3 …)` + sRGB fallback | ~25% larger gamut; degrade gracefully |
| Derive shades/states | Relative color syntax `oklch(from … )` | One source color → whole scale |
| Blend two colors | `color-mix(in oklab, …)` | No muddy midpoints |
| Auto text on/off color | `contrast-color(var(--bg))` | Browser picks black/white (Baseline 2026) |
| Theme switch | Semantic tokens + `light-dark()` | Decouple role from value |
| Legal compliance | WCAG 2.x AA (4.5:1 / 3:1) | What auditors & courts test |
| Readability tuning | APCA `Lc` levels | Perceptual, size/weight-aware (candidate, not law) |

---

## 1. OKLCH — the authoring color space

OKLCH is the cylindrical (polar) form of Björn Ottosson's **Oklab** perceptual model:
`L` = lightness, `C` = chroma, `H` = hue. It is **perceptually uniform** — equal numeric
changes produce equal *perceived* changes regardless of hue. A yellow and a blue both at
`L 0.65` look equally bright to the eye; HSL cannot do this (`hsl(60 100% 50%)` yellow
looks far brighter than `hsl(240 100% 50%)` blue at the "same" lightness). It improves on
CIELCH especially for blue/purple hue accuracy. Part of **CSS Color Module Level 4**;
supported in **Chrome 111+, Firefox 113+, Safari 15.4+** (>90% global). [oklch-css][modern-css]

### Syntax & ranges

```text
oklch( <L> <C> <H> [ / <alpha> ]? )
```

| Component | Range | Meaning |
|-----------|-------|---------|
| `L` Lightness | `0`–`1` or `0%`–`100%` | 0 = black, 1/100% = white. Perceptually uniform. |
| `C` Chroma | `0` → ~`0.37` (unbounded) | 0 = gray; sRGB tops out ~0.13–0.15, P3 ~0.20+. |
| `H` Hue | `0`–`360` (deg) | 0 ≈ red, 120 ≈ green, 240 ≈ blue (like HSL). |
| `alpha` | `0`–`1` / `%` | Optional opacity after `/`. |

```css
/* Perceptual uniformity in action: only L changes → cohesive tints/shades */
:root {
  --brand:       oklch(0.55 0.20 264);
  --brand-light: oklch(0.75 0.20 264);
  --brand-dark:  oklch(0.35 0.20 264);

  --soft-blue:   oklch(70% 0.15 240);
  --vivid-purple: oklch(60% 0.20 280 / 75%);
  --mid-gray:    oklch(50% 0 0);  /* C = 0 → neutral */
}
```

### Staying in gamut (the chroma trap)

Max achievable chroma depends on **both L and H** — high chroma at extreme lightness falls
outside sRGB *and* P3 and gets clamped (unpredictably across browsers). Practical rule:
pick L and H first, then **raise C until just before the hue spectrum shows gaps/clipping**
(the oklch.com picker visualizes the sRGB/P3/Rec2020 boundaries live). Keep neutrals at
`C ≈ 0.005–0.02` for a subtle tint, brand mids around `C 0.12–0.20`. [oklch][tw-colors]

### Relative color syntax — derive, don't hand-pick

```css
:root {
  --base: oklch(43.7% 0.075 224);

  /* Harmonies: keep L & C, rotate H */
  --triadic-a:  oklch(from var(--base) l c calc(h + 120));
  --triadic-b:  oklch(from var(--base) l c calc(h - 120));
  --complement: oklch(from var(--base) l c calc(h + 180));

  /* States: scale L, keep C & H */
  --base-darken: oklch(from var(--base) calc(l * 0.85) c h);
  --hover:       oklch(from var(--base) calc(l * 1.15) c h);
  --active:      oklch(from var(--base) calc(l * 0.90) c h);
}
```

### color-mix() in a perceptual space

```css
:root {
  --base-grey-50:  color-mix(in oklab, var(--base), grey);
  --bg-tinted:     color-mix(in oklab, var(--bg) 80%, var(--base));
  --softer-text:   color-mix(in oklch, contrast-color(var(--bg)) 80%, var(--bg));
}
```

> Source for `--base` value, relative-color and mix patterns above: web.dev color-theme guide. [webdev-color]

### Building a tonal scale (50→950)

Anchor `H` and a target `C`, then walk `L` in even perceptual steps. Because OKLCH is
uniform, even L steps *look* even — no manual correction. Tailwind v4 ships its entire
default palette this way: **11 steps per hue (50 lightest → 950 darkest), 22 hues**. [tw-v4]

```css
/* A hand-built brand scale (hue 264, chroma tapers at the extremes to stay in gamut) */
:root {
  --brand-50:  oklch(0.971 0.013 264);
  --brand-100: oklch(0.936 0.032 264);
  --brand-200: oklch(0.885 0.062 264);
  --brand-300: oklch(0.808 0.105 264);
  --brand-400: oklch(0.704 0.165 264);
  --brand-500: oklch(0.637 0.200 264); /* base */
  --brand-600: oklch(0.560 0.190 264);
  --brand-700: oklch(0.476 0.160 264);
  --brand-800: oklch(0.398 0.125 264);
  --brand-900: oklch(0.340 0.090 264);
  --brand-950: oklch(0.243 0.055 264);
}
```

> Tip: chroma is highest in the mid-lightness band (400–600) and **must taper** toward 50
> and 950, otherwise the lightest/darkest steps clip out of gamut. Tailwind's real values
> show the same taper, e.g. `--color-red-500: oklch(0.637 0.237 25.331)`. [tw-colors]

---

## 2. Wide-gamut P3 — make colors pop, degrade gracefully

`display-p3` is a wide-gamut RGB space (~25% more colors than sRGB) defined in CSS Color 4.
Reach it via `color(display-p3 r g b)` (channels `0`–`1`) or simply by using OKLCH/OKLAB
chroma beyond the sRGB boundary. Wide-gamut hardware is common (Apple devices, modern
laptops/phones). Engine status June 2026: **Chromium ✅, WebKit/Safari ✅, Firefox** CSS
parsing done but full WCG *rendering* still gated behind its HDR work (earliest H1 2026).
[webkit-p3][chrome-hd]

### Fallback patterns (always provide sRGB)

```css
/* 1. Cascade fallback — simplest, but NOT reliable with custom properties */
.brand { color: rgb(0 200 120);            /* sRGB fallback first */
         color: color(display-p3 0 0.8 0.45); } /* used if parsed */

/* 2. @supports — required when feeding CSS variables (recommended for tokens) */
:root { --accent: oklch(0.7 0.18 150); }                 /* sRGB-safe */
@supports (color: color(display-p3 1 1 1)) {
  :root { --accent: color(display-p3 0.27 0.78 0.45); }  /* P3 upgrade */
}

/* 3. Most robust — gate on hardware AND syntax support */
:root { --neon: rgb(100% 0 0); }
@media (dynamic-range: high) {
  @supports (color: color(display-p3 0 0 0)) {
    :root { --neon: color(display-p3 1 0 0); }
  }
}
```

Why explicit fallbacks (not just auto-clamping): gamut-mapping algorithms are **not
standardized**, so an unspecified P3→sRGB clamp can land on a color you didn't choose. For
privacy, `@media (color-gamut: p3)` / `dynamic-range` return a generalized capability, never
the exact display gamut. [webkit-p3][chrome-hd]

```css
/* Detect capability without revealing the device's exact gamut */
@media (color-gamut: p3)    { /* at least P3-class display */ }
@supports (background: color(display-p3 0 0 0)) { /* engine parses the syntax */ }
```

---

## 3. Accessible contrast — WCAG 2.x floor + APCA ceiling

### WCAG 2.x (the legal requirement, June 2026)

Luminance-ratio model. **AA: 4.5:1** normal text, **3:1** large text (≥24px, or ≥18.66px
bold) and UI/graphics. **AAA: 7:1 / 4.5:1**. Laws and procurement worldwide reference
**WCAG 2.x AA**, so these ratios are what auditors, scanners, and courts enforce. **Do not
drop WCAG 2 conformance based on a draft.** [roselli-2026][humbl]

Known weaknesses: it **overstates contrast for dark pairs** (so it's a poor guide for dark
mode), and has arbitrary pass/fail cliffs (`#777` on white = 4.48:1 fails; `#767676` =
4.54:1 passes — visually identical). Myth-bust: there is **no** background where *both*
pure black and pure white fail AA — one always passes. [roselli-2026]

### APCA (the readability model — candidate, not adopted)

APCA (Advanced Perceptual Contrast Algorithm) is the **candidate** method for WCAG 3. It
outputs an **`Lc` value (roughly −108 … +106; practical range ≈ ±106)** that is perceptually uniform and **polarity-aware**
(swapping text/background changes the result) and **size/weight-aware**. **Status: APCA was
moved out of the WCAG 3 working draft in July 2023; the draft says the contrast algorithm
is "yet to be determined," and WCAG 3 is unlikely to finalize before ~2028–2030.** Even
APCA's author says nobody should drop WCAG 2 over a draft. [roselli-2026][apca-why]

#### APCA `Lc` levels (from "APCA in a Nutshell")

| `Lc` | Use case | Representative min size/weight |
|------|----------|-------------------------------|
| **90** | Preferred for fluent / body text; max for very large bold | 18px/300 or 14px/400; non-body 12px/400 |
| **75** | Minimum for columns of body text | 24px/300, 18px/400, 16px/500, 14px/700 |
| **60** | Min for non-body content text (≈ old 4.5:1) | 24px/400, 18px/600, 16px/700 |
| **45** | Min for large/heavy text — headlines (≈ old 3:1); fine icons | 36px/400 or 24px/700 |
| **30** | Absolute min for any text; placeholder/disabled; solid icons | ≥5.5px feature |
| **15** | Min for non-text discernibility; below this = "invisible" | ≥5px feature |

[apca-nutshell]

> Rough WCAG↔APCA map: Lc 45 ≈ 3:1, Lc 60 ≈ 4.5:1, Lc 75 = preferred body. Adding Lc 15 to
> the AA set reaches AAA-equivalents; "Silver/Gold" levels use full font lookup tables.

### Two-layer strategy (recommended 2026)

1. **Floor (compliance):** ship WCAG 2.1/2.2 **AA** for text + meaningful UI — what tools test.
2. **Ceiling (readability):** tune with **APCA** and real-world testing on top.
   To limit risk, pick colors that pass **both**. Treat browser DevTools APCA (still behind
   experimental flags) as informative, not authoritative. [roselli-2026][humbl]

### Let the browser pick text color: `contrast-color()`

CSS Color 5 `contrast-color()` returns **black or white** — whichever contrasts better with
the input — computed at style time (no runtime cost). **Baseline Newly Available, April 2026:
Chrome 147, Firefox 146, Safari 26.0.** Limits: discrete (snaps, no smooth animation), flat
colors only (no gradients/images), guarantees AA-ish output but **not AAA 7:1** for mid-tones;
ties return white. [smashing-contrast]

```css
.button {
  background: var(--brand);
  color: contrast-color(var(--brand)); /* auto black or white */
}

/* Progressive enhancement for older engines */
.card { background: var(--bg); color: #fff; text-shadow: 0 0 4px rgb(0 0 0 / .8); }
@supports (color: contrast-color(red)) {
  .card { color: contrast-color(var(--bg)); text-shadow: none; }
}

/* Branded contrast text: take only the L of black/white, re-add bg hue */
.chip { color: oklch(from contrast-color(var(--bg)) l 0.05 var(--bg-hue)); }
```

---

## 4. Semantic tokens & color roles

Decouple **meaning from value**. A primitive (`--brand-500`) is a raw color; a **semantic
token** carries a *role* (`--color-surface`, `--color-text`, `--color-interactive`). The
name stays constant; the value it resolves to changes per theme. Without this layer, dark
mode means touching every component. [colorarchive-dark]

Three-tier architecture:

```
Primitives  →  Semantic (role) tokens  →  Component tokens
--brand-500     --color-action-default      --button-bg
--neutral-50    --color-surface             --card-bg
```

```css
:root {
  /* Tier 1 — primitives (hue-anchored OKLCH scales) */
  --brand-500: oklch(0.637 0.20 264);
  --brand-600: oklch(0.560 0.19 264);
  --neutral-0:   oklch(1    0     0);
  --neutral-50:  oklch(0.985 0.004 264); /* grays borrow brand hue, near-zero C */
  --neutral-900: oklch(0.21  0.012 264);
  --danger-500:  oklch(0.637 0.237 25);
  --success-500: oklch(0.70  0.16  150);

  /* Tier 2 — semantic roles (what components actually consume) */
  --color-surface:            var(--neutral-0);
  --color-surface-raised:     var(--neutral-50);
  --color-text:               var(--neutral-900);
  --color-text-muted:         oklch(from var(--neutral-900) 0.45 c h);
  --color-border:             oklch(from var(--neutral-900) 0.9 0.01 h);
  --color-action:             var(--brand-500);
  --color-action-hover:       var(--brand-600);
  --color-on-action:          contrast-color(var(--brand-500));
  --color-danger:             var(--danger-500);
  --color-focus-ring:         var(--brand-500);
}
```

Minimum role vocabulary: `surface` / `surface-raised` / `surface-sunken`, `text` /
`text-muted` / `text-on-*`, `border` / `border-strong`, `action` (+ `hover`/`active`/`on-`),
`danger` / `warning` / `success` / `info`, `focus-ring`.

---

## 5. Dark mode — adjust L & C, never mere inversion

**Dark is a first-class context, not flipped light.** Naively lifting light-mode colors onto
dark surfaces makes them look washed-out/gray. Two perceptual facts drive the fix:

- **Simultaneous contrast:** a hue on near-black reads dimmer than on white → **boost chroma
  ~15–25%** to keep perceived intensity. [colorarchive-dark][colorarchive-sat]
- **Bezold-Brücke hue shift:** warm hues (orange/yellow) drift toward orange at low
  luminance → **rotate hue slightly** toward the source hue. [colorarchive-dark]

Architectural consequence: you generally need a **separate dark primitive set**, not just
semantic overrides — but the role-token *names* stay identical, so components don't change.

```css
/* light-dark(): one declaration, both themes. Requires color-scheme. */
html { color-scheme: light dark; }

:root {
  /* L drops dramatically; C nudges UP (not a 1−L inversion) */
  --color-surface: light-dark(oklch(0.985 0.004 264), oklch(0.20 0.012 264));
  --color-text:    light-dark(oklch(0.21  0.012 264), oklch(0.94 0.01  264));
  --color-action:  light-dark(oklch(0.637 0.20  264), oklch(0.70 0.23  264)); /* +L +C */
  --color-danger:  light-dark(oklch(0.637 0.237 25 ), oklch(0.70 0.25  27 )); /* +L +C, +hue */
}
```

```css
/* Class/attribute strategy (toggle without OS dependency) */
:root,
[data-theme="light"] { --color-surface: oklch(0.985 0.004 264); --color-text: oklch(0.21 0.012 264); }
[data-theme="dark"]  { --color-surface: oklch(0.20  0.012 264); --color-text: oklch(0.94 0.01  264); }

/* Respect OS preference as the default */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) { --color-surface: oklch(0.20 0.012 264); --color-text: oklch(0.94 0.01 264); }
}
```

**Dark-mode elevation = lighter surfaces, not shadows.** Express depth by raising `L` of the
surface token per layer (e.g. base `0.20` → raised `0.24` → overlay `0.28`); shadows barely
read on dark backgrounds. Re-verify contrast in *both* themes — WCAG 2 over-rates dark pairs,
so lean on APCA there. [muzli-dark][colorarchive-dark]

---

## 6. Generating a cohesive palette — dominant + sharp accent

Timid, evenly-weighted palettes read as generic. Aim for a **clear hierarchy**: one
**dominant** brand hue carrying most surfaces/actions, plus **one sharp accent** at high
chroma reserved for emphasis (primary CTA, key data). This is composition, not equality.

**Recipe (OKLCH-first):**

1. **Pick the dominant hue `H`.** Set base `L 0.55–0.65`, `C` as high as stays in gamut.
2. **Build the dominant scale** by walking `L` (50→950), tapering `C` at extremes (§1).
3. **Derive neutrals** from the *same hue* at `C ≈ 0.004–0.02` → grays feel related, not flat.
4. **Choose ONE accent** — complement (`H+180`) or a strong analog — at **higher chroma /
   contrasting L** than the dominant, so it visibly "pops." Use it sparingly (~5–10% of UI).
5. **Add functional hues** (danger ≈ 25, warning ≈ 80, success ≈ 150, info ≈ 240) at
   matched `L`/`C` so they share visual weight with the brand.
6. **Verify** every text/surface pair: WCAG 2 AA floor, then APCA Lc tune (§3).

```css
:root {
  /* 1–2: dominant (indigo, H 264) */
  --brand-500: oklch(0.62 0.20 264);
  /* 3: neutrals borrow the brand hue, near-zero chroma */
  --neutral-100: oklch(0.96 0.006 264);
  --neutral-700: oklch(0.40 0.012 264);
  /* 4: one SHARP accent — complement, pushed brighter & more chromatic */
  --accent-500:  oklch(0.78 0.21 84);   /* warm amber vs cool indigo */
  /* 5: functional hues at matched weight */
  --danger-500:  oklch(0.64 0.237 25);
  --success-500: oklch(0.70 0.16 150);
  --warning-500: oklch(0.80 0.16 80);
  --info-500:    oklch(0.66 0.16 240);
}
```

> 60-30-10 in practice: ~60% neutral surfaces, ~30% dominant brand, ~10% sharp accent.
> Keep accent chroma clearly above the dominant's so the eye knows where to look.

---

## 7. Tailwind CSS v4 `@theme` (OKLCH + P3 by default)

Tailwind v4 is **CSS-first**: tokens declared in `@theme` become build-time custom
properties and utilities. Its **entire default palette is OKLCH** (more vivid on P3 displays;
shade numbers/HEX kept ~identical to v3). 11 shades × 22 hues; targets Safari 16.4+,
Chrome 111+, Firefox 128+; v4.1+ emits sRGB fallbacks. [tw-v4][tw-colors][tw-theme]

```css
@import "tailwindcss";

@theme {
  /* Custom OKLCH scale → generates bg-brand-500, text-brand-700, … */
  --color-brand-50:  oklch(0.971 0.013 264);
  --color-brand-500: oklch(0.637 0.200 264);
  --color-brand-950: oklch(0.243 0.055 264);

  --color-accent-500: oklch(0.78 0.21 84);

  /* Override a built-in: warmer gray everywhere it's referenced */
  --color-gray-400: oklch(0.75 0.02 80);
}

/* Theme-aware semantic tokens via @theme inline + a dark selector */
@theme inline {
  --color-surface: var(--surface);
  --color-fg:      var(--fg);
}
:root          { --surface: oklch(0.985 0.004 264); --fg: oklch(0.21 0.012 264); }
[data-theme="dark"] { --surface: oklch(0.20 0.012 264); --fg: oklch(0.94 0.01 264); }
```

Gradient interpolation: default **OKLAB**; opt into others per-utility —
`bg-linear-to-r/oklch` (vivid for far-apart hues) or `/srgb`. Disable a color with
`--color-red-*: initial`; full takeover with `--color-*: initial`. [tw-v4][tw-theme]

---

## Sources

- MDN — `oklch()` (CSS Color 4) — https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch
- MDN — `color()` / display-p3 — https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color
- MDN — `contrast-color()` — https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/contrast-color
- web.dev — Color themes with Baseline CSS features (light-dark, relative color, color-mix) — https://web.dev/articles/baseline-in-action-color-theme
- WebKit Blog — Wide Gamut Color in CSS with Display-P3 — https://webkit.org/blog/10042/wide-gamut-color-in-css-with-display-p3/
- Chrome for Developers — Migrate to HD CSS color — https://developer.chrome.com/docs/css-ui/migrate-hd-color
- oklch.com — OKLCH Color Picker & Converter — https://oklch.com/
- Tailwind CSS — Colors (v4 OKLCH palette) — https://tailwindcss.com/docs/colors
- Tailwind CSS — Theme variables (`@theme`) — https://tailwindcss.com/docs/theme
- Tailwind CSS v4.0 release notes — https://tailwindcss.com/blog/tailwindcss-v4
- APCA — APCA in a Nutshell (Lc levels) — https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell.html
- APCA — Why APCA as a New Contrast Method? — https://git.apcacontrast.com/documentation/WhyAPCA.html
- Adrian Roselli — WCAG3 Contrast as of April 2026 — https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html
- Smashing Magazine — Building Self-Correcting Color Systems With contrast-color() (May 2026) — https://www.smashingmagazine.com/2026/05/building-self-correcting-color-systems-contrast-color/
- Humbl Design — 2026 Engineering Guide to Color & Contrast (WCAG 2.2 + APCA) — https://humbldesign.io/blog-posts/color-accessibility-guide-wcag
- ColorArchive — OKLCH Perceptual Color Design Guide — https://colorarchive.org/guides/oklch-perceptual-color-design-guide/
- ColorArchive — Why dark mode colors need more saturation (May 2026) — https://colorarchive.org/notes/may-2026-dark-mode-saturation/
- Muzli — Dark Mode Design Systems: Patterns, Tokens, Hierarchy — https://muz.li/blog/dark-mode-design-systems-a-complete-guide-to-patterns-tokens-and-hierarchy/
- Evil Martians — Better dynamic themes in Tailwind with OKLCH — https://evilmartians.com/chronicles/better-dynamic-themes-in-tailwind-with-oklch-color-magic
