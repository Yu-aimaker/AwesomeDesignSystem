# Typography: Variable Fonts, Fluid Scales, Pairing & Japanese Typography

> AI-agent-first reference. June 2026. Copy-paste-ready CSS. Every non-trivial claim is sourced (see `## Sources`). Values reflect current 2026 reality (browser support, font versions, design-language updates).

---

## 1. Font Selection: Escape the Inter/Roboto/Arial Default

By 2026 there is real fatigue with neutral UI sans-serifs. Inter, Roboto, and system stacks are excellent for dense dashboards where the font should be "invisible," but they lack the character a marketing page or branded product needs. The 2026 move: pick a **distinctive body font** OR pair a **display font (personality) + body font (legibility)** with deliberate contrast.

### Pairing principle
Contrast in **weight**, **style** (serif vs sans), or **personality**. The display face carries identity at large sizes; the body face must stay invisible at 16–20px over long reading. Use **one** display + **one** body; add a mono only if you show code.

### Distinctive body-font alternatives to Inter (2026)

| Font | Foundry / source | Character | Best for | License |
|------|------------------|-----------|----------|---------|
| **Geist / Geist Mono** | Vercel | Neutral-but-crisp, engineered | Dev tools, SaaS | OFL, free |
| **Satoshi** | Fontshare (ITF) | Squared curves, editorial, "expensive" | Premium SaaS, fintech | Free (Fontshare) |
| **General Sans** | Fontshare (ITF) | Clean geometric workhorse | SaaS body | Free (Fontshare) |
| **Space Grotesk** | Florian Karsten | Mono-inspired quirk, squared terminals | Developer/aerospace vibe | OFL, on Google Fonts |
| **Plus Jakarta Sans** | Tokotype | Bright geometric, high x-height | Energetic startups, B2B | OFL, on Google Fonts |
| **Mona Sans / Hubot Sans** | GitHub | Grotesque, variable wght/wdth/slnt | Apps, dashboards | OFL, free |
| **Inclusive Sans** | Olivia King | Accessibility-first, open counters | A11y-critical UI | OFL, on Google Fonts (2025) |
| **Aeonik** (commercial) | CoType Foundry | Neo-grotesque, mechanical+warm | Premium brand | Paid |

### High-impact display + body pairings (2026)

| Display (headlines) | Body | Vibe |
|---------------------|------|------|
| **Bricolage Grotesque** | Inter / Satoshi | The signature 2025–26 pairing; distinctive yet professional |
| **Clash Display** | Satoshi | High-impact e-commerce / landing |
| **General Sans** | Satoshi | The SaaS workhorse pairing |
| **Syne** | DM Sans | Angular personality, memorable headlines |
| **Playfair Display** (serif) | Inter | Editorial luxury, lifestyle/boutique |

> Note: Fontshare faces (Satoshi, General Sans, Clash Display, Switzer) are free but **not** on Google Fonts — self-host them. Always verify webfont licensing before self-hosting commercial faces; some licenses forbid self-hosting.

---

## 2. Variable Fonts

A variable font packs many weights/widths/styles into **one** file via the OpenType variations spec (OpenType 1.8, 2016). One 82 KB variable file can replace ~223 KB of static cuts (~63% smaller — savings scale with how many cuts you'd otherwise ship); browser support is ~94% globally in 2026 (caniuse). Best when you use 3+ weights/styles; for 1–2 weights a static WOFF2 may still win.

### Axes: registered (lowercase) vs custom (UPPERCASE)

Axis tags are **case-sensitive**. Registered axes use lowercase 4-char tags; custom axes use uppercase by convention.

| Tag | Axis | Notes |
|-----|------|-------|
| `wght` | Weight | Prefer `font-weight` over raw settings |
| `wdth` | Width | Condensed → extended |
| `ital` | Italic | Toggle (0/1) |
| `slnt` | Slant | Oblique angle (degrees) |
| `opsz` | Optical size | Auto via `font-optical-sizing: auto` |
| `GRAD` | Grade (custom) | Changes weight **without reflow** — safe to animate |

### Prefer standard properties; drop to the low-level only when needed

```css
/* GOOD: high-level properties cascade & animate cleanly */
h1 { font-weight: 750; font-stretch: 110%; font-optical-sizing: auto; }

/* LOW-LEVEL: only for axes with no standard property (e.g. GRAD). No % sign here. */
.dense { font-variation-settings: "wght" 600, "GRAD" 88; }
```

`font-variation-settings` is a low-level escape hatch: any axis you set there is overridden by, and does not inherit alongside, the high-level props cleanly — so set ALL axes you need in one declaration when you use it. The `%` symbol is never used inside `font-variation-settings`.

### Animate weight without layout shift (use GRAD)

```css
.btn {
  font-variation-settings: "wght" 500, "GRAD" 0;
  transition: font-variation-settings 0.2s ease;
}
.btn:hover { font-variation-settings: "wght" 500, "GRAD" 120; } /* density up, no reflow */
```

### @font-face for a variable font

```css
@font-face {
  font-family: "Mona Sans";
  src: url("/fonts/MonaSans.woff2") format("woff2-variations");
  font-weight: 200 900;   /* declare the supported range */
  font-stretch: 75% 125%;
  font-display: swap;
}
```

---

## 3. Fluid Typography: clamp() + Modular Scale

`clamp(MIN, PREFERRED, MAX)` renders the preferred value, bounded by min/max. For fluid type, the preferred value mixes `rem` + `vw` (not `vw` alone) — the `rem` part keeps text responsive to the user's font preference and zoom, which is an accessibility requirement.

```css
font-size: clamp(1rem, 0.91rem + 0.43vw, 1.25rem);
/*               ↑min  ↑rem base   ↑vw    ↑max  */
```

### A modular scale

Pick a ratio and multiply from a base. Common ratios: 1.2 (Minor Third), 1.25 (Major Third), 1.333 (Perfect Fourth), 1.5 (Perfect Fifth). Each step up = base × ratio^n; each step down = base ÷ ratio.

### Drop-in fluid scale (generated, Utopia-style)

```css
:root {
  /* Fluid steps: clamp(min, rem + vw, max). Body = --step-0. */
  --step--2: clamp(0.69rem, 0.66rem + 0.18vw, 0.80rem);
  --step--1: clamp(0.83rem, 0.78rem + 0.27vw, 1.00rem);
  --step-0:  clamp(1.00rem, 0.91rem + 0.43vw, 1.25rem);   /* body 16→20px */
  --step-1:  clamp(1.20rem, 1.07rem + 0.65vw, 1.56rem);
  --step-2:  clamp(1.44rem, 1.26rem + 0.93vw, 1.95rem);
  --step-3:  clamp(1.73rem, 1.47rem + 1.29vw, 2.44rem);
  --step-4:  clamp(2.07rem, 1.72rem + 1.77vw, 3.05rem);
  --step-5:  clamp(2.49rem, 2.01rem + 2.40vw, 3.82rem);   /* display */
}

h1 { font-size: var(--step-5); }
h2 { font-size: var(--step-3); }
h3 { font-size: var(--step-2); }
p, li { font-size: var(--step-0); }
small { font-size: var(--step--1); }
```

### Container-query units (component-aware, 2026)

Scale by the component, not the viewport — same component works in a sidebar or full-width.

```css
.card { container-type: inline-size; }
.card h2 { font-size: clamp(1.25rem, 5cqi, 2rem); } /* cqi = container inline size */
```

### Accessibility guardrails (do NOT skip)

- **Never floor body text below 1rem (16px).** Keep body max 18–22px.
- **Cap the max at ≤ ~2.5× the min** so extreme viewports don't blow up.
- **WCAG 1.4.4 (Resize text, AA):** `vw`-bounded text can fail if a user cannot reach 200% zoom. ALWAYS test at 200% browser zoom; text must visibly enlarge. Mixing `rem` into the preferred value is what makes this pass.
- Fluid is not a universal replacement for responsive — long-form reading wants conservative scaling; landing pages can be more dramatic.

> Tooling: generate scales with **Utopia.fyi** or the **Fluid Type Scale Calculator** rather than hand-math.

---

## 4. Per-Size Rhythm: line-height, measure, letter-spacing

These three are **size-dependent** — large text wants tighter leading and negative tracking; small text wants looser. Optical tuning, not one global value.

| Role | font-size | line-height | letter-spacing | measure (max-width) |
|------|-----------|-------------|----------------|---------------------|
| Display / H1 | ≥ 2.4rem | 1.05–1.15 | −0.02em to −0.03em | 12–18ch (short) |
| H2 / H3 | 1.5–2rem | 1.15–1.25 | −0.01em to −0.02em | — |
| Body | 1–1.25rem | 1.5–1.65 | 0 | **60–75ch** |
| Small / caption | 0.8–0.9rem | 1.4–1.5 | +0.01em to +0.02em | — |
| All-caps label | any | — | **+0.05em to +0.1em** | — |

```css
:root { --measure: 66ch; }            /* ideal Latin line length 45–75ch */

h1 { line-height: 1.1;  letter-spacing: -0.02em; text-wrap: balance; }
h2 { line-height: 1.2;  letter-spacing: -0.015em; }
p  { line-height: 1.6;  max-width: var(--measure); text-wrap: pretty; }
.caption  { font-size: var(--step--1); line-height: 1.45; letter-spacing: 0.01em; }
.eyebrow  { text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; }
```

**Rules of thumb:** tracking should shrink (toward negative) as size grows; leading should shrink as size grows; only all-caps and small text get positive tracking. Constrain body `max-width` with `ch` units so the measure tracks the font.

### Modern wrapping & rendering (ship in 2026)

```css
h1, h2, h3 { text-wrap: balance; max-width: 40ch; } /* needs a max-width to balance */
p          { text-wrap: pretty; }                    /* avoids orphans on last lines */
body       { -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
```

- `text-wrap: balance` — even line widths for headings. Broad support: **Chrome 114+, Firefox 121+, Safari 17.5+**. Chromium balances ≤ 4–6 lines; Firefox ≤ 10. Never use on long paragraphs.
- `text-wrap: pretty` — prevents orphaned last words in body copy. **Chrome 117+, Edge 117+, Safari 26+; Firefox NOT supported as of early 2026** (degrades gracefully to normal wrap). WebKit's `pretty` rebalances more lines than Chromium's last-4-line approach.
- Both are progressive enhancement — unsupported browsers fall back to normal wrap, no breakage.

### Numerals & OpenType in UI

```css
.tabular { font-variant-numeric: tabular-nums; }    /* align numbers in tables/timers */
.fraction { font-variant-numeric: diagonal-fractions; }
.no-lig  { font-variant-ligatures: none; }          /* code tokens */
```

---

## 5. Web Font Loading & Performance

Fonts are a top cause of CLS and slow LCP. The optimization stack — WOFF2 (~60–70% smaller) + subsetting (50–80% more) + self-hosting (200–500ms faster) + preload + `font-display` + fallback metric matching — can yield ~2.6s better LCP and CLS < 0.1. **Budget: < 100 KB total fonts, 2–4 files max.**

### `font-display` strategies

| Value | Behavior | Use when |
|-------|----------|----------|
| `swap` | Fallback immediately, swap on load (visible shift) | Default; good with matched fallback metrics |
| `optional` | ~100ms window; else fallback for the whole visit → **zero CLS** | Performance-critical pages |
| `fallback` | Short block, then swap within a window | Middle ground |
| `block` | Hide text until load | **Avoid** (FOIT) |

### Subsetting

A full Inter has 2,500+ glyphs; English needs ~200 — subsetting can cut 90 KB → 15 KB. Google Fonts subsets automatically. Self-hosted: use `pyftsubset` (fonttools).

```bash
pyftsubset Inter.ttf \
  --unicodes="U+0000-00FF,U+2018-2019,U+201C-201D,U+2013-2014" \
  --layout-features="kern,liga,calt" \
  --flavor=woff2 --output-file=Inter.subset.woff2
```

### Self-host + preload + match fallback metrics (framework-agnostic)

```html
<link rel="preload" href="/fonts/Satoshi-Variable.woff2" as="font" type="font/woff2" crossorigin>
```
```css
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Variable.woff2") format("woff2-variations");
  font-weight: 300 900;
  font-display: swap;
}
/* Metric-matched fallback to kill CLS during swap (web.dev). */
@font-face {
  font-family: "Satoshi-fallback";
  src: local("Arial");
  size-adjust: 97%;        /* scale glyphs to match x-height/width */
  ascent-override: 95%;
  descent-override: 24%;
  line-gap-override: 0%;
}
:root { --font-sans: "Satoshi", "Satoshi-fallback", system-ui, sans-serif; }
```
`size-adjust`: Chrome/Edge 87+, Firefox 89+, **and Safari**. The other three (`ascent-override` / `descent-override` / `line-gap-override`): Chrome/Edge 87+, Firefox 89+, but **NOT Safari as of 2026** (WebKit bug #219735 still open through Safari 26.x) — Safari supports only `size-adjust`, so the height-override trio degrades gracefully there. Tools like Fontaine / `@next/font` compute these automatically.

### `next/font` (does subsetting, self-hosting, preload, CLS fix for you)

```ts
// app/fonts.ts
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: true,   // auto size-adjust fallback → near-zero CLS
});

export const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

// Self-hosted Fontshare/commercial variable font:
export const satoshi = localFont({
  src: "../public/fonts/Satoshi-Variable.woff2",
  variable: "--font-display",
  weight: "300 900",
  display: "swap",
});
```
```tsx
// app/layout.tsx
<html className={`${inter.variable} ${mono.variable} ${satoshi.variable}`}> ... </html>
```
`next/font` fetches at **build time** (no runtime request to Google), removes unused styles, preloads, and generates the metric-matched fallback automatically. Prefer it over a `<link>` to fonts.googleapis.com.

### Verify
View source for `@font-face` with `font-display: swap`; confirm WOFF2 files < 100 KB; throttle to Slow 3G (text shows in fallback then swaps); Lighthouse CLS < 0.1.

---

## 6. Japanese (和文) Typography — Dedicated Section

Japanese needs different rules than Latin. There is no x-height/baseline system; every glyph (kana, kanji) is ~the size of a Latin capital and sits on a square em-box. Kanji are dense (more strokes/pixels), so 和文 needs **more leading, gentle tracking, and proportional-metrics kerning**. Italics do not exist — never apply `font-style: italic` to Japanese (browsers synthesize an ugly oblique); use weight or 「」 brackets for emphasis.

### Core values

| Property | Latin norm | 和文 recommendation |
|----------|-----------|---------------------|
| `line-height` | 1.4–1.6 | **1.6–1.9** (commonly ~1.7–1.85; some sites 2.0) |
| `letter-spacing` | 0 | **0.04–0.08em** (range 0.05–0.15em by font) |
| measure (CPL) | 45–75 chars | **~35–45 全角** chars per line |
| font-size in mixed UI | base | reduce 和文 **10–15%** vs Latin, or scale Latin up |
| alignment | left | `justify` works well (no inter-word spaces) |

### palt: proportional metrics (文字詰め) — the key refinement

Default 和文 is full-width monospaced (`pwid`), which looks loose — especially kana in Yu Gothic. Enabling **`palt`** applies the font's proportional spacing tables, tightening kana/punctuation dramatically. `palt` ≠ `pwid` — they are different features; only `palt` gives the polished tightening. Supported in all modern browsers.

```css
.ja {
  font-feature-settings: "palt" 1;     /* proportional alternate metrics */
  /* with palt enabled, ADD a little letter-spacing back for breathing room */
  letter-spacing: 0.04em;
}
```

### Production 和文 body CSS

```css
:root {
  /* Pair a 和文 face with a Latin face; list BOTH JP + romanized names —
     some browsers only match one spelling. Latin name first so Latin glyphs
     use the Latin face, then 和文 fills the rest. */
  --font-ja: "Inter", "Noto Sans JP", "Hiragino Kaku Gothic ProN",
             "ヒラギノ角ゴ ProN", "Yu Gothic", "游ゴシック", "Meiryo",
             system-ui, sans-serif;
}

body {
  font-family: var(--font-ja);
  font-size: 16px;            /* ≥ 12px floor; 16px for general/older audiences */
  line-height: 1.8;           /* 和文 wants 1.6–1.9 */
  letter-spacing: 0.04em;     /* 0.04–0.08em */
  font-feature-settings: "palt" 1;
  text-align: justify;
  word-break: normal;
  line-break: strict;         /* correct kinsoku (禁則) line-breaking */
  overflow-wrap: anywhere;
}

h1, h2, h3 {
  line-height: 1.4;           /* headings tighter than body, still > Latin */
  letter-spacing: 0.02em;
  font-feature-settings: "palt" 1;
}
```

### kinsoku (禁則処理) & punctuation

```css
.ja { line-break: strict; word-break: normal; }      /* don't start a line with 。、）」 */
```
For visually removing extra space inside brackets/punctuation (、。！？「」（）), use the **Yaku Han** webfont (`yakuhanjp`) layered before your 和文 font — though many JP readers don't notice. Avoid `word-break: break-all` for body copy.

### Recommended JP webfonts (2026)

| Font | Role | Source / note |
|------|------|---------------|
| **Noto Sans JP** | Standard body/UI | Google+Adobe, OFL, variable; used by 政府デジタル庁 design system, JP Slack |
| **Noto Serif JP** | Editorial body/headings | OFL, variable |
| **Zen Kaku Gothic New** | Modern headings & body | Google Fonts, 5 weights, clean geometric |
| **BIZ UDPGothic / UDGothic** | UD body, max legibility | Morisawa, free on Google Fonts |
| **M PLUS 1 / M PLUS 1p** | Versatile UI | Variable, geometric nuance |
| **IBM Plex Sans JP** | Technical/docs (pairs with code) | OFL |
| **LINE Seed JP** | Mixed-script by design | Latin harmony built in |
| **Dela Gothic One** | Impact display | Heavy headline |
| **Hiragino / Yu Gothic / Meiryo** | System body | Zero download — best default for body |

### 2026 performance reality — biggest 和文 gotcha

CJK fonts have an order of magnitude more glyphs (thousands), so files are huge. **Loading full Noto Sans JP on every page is now an anti-pattern.** Recommended pattern:

1. **Body text → system fonts** (Hiragino / Yu Gothic via the stack above). Often sufficient and zero-cost.
2. **One webfont for headings only** (limited character count → small impact).
3. Add a 和文 body webfont (Noto Sans JP / BIZ UDPGothic) only if you must match it.
4. Limit weights: start with **400 + 700**; add more only when needed.
5. Always set `font-display: swap` and a full fallback chain.
6. With Next.js use `next/font` to self-host & build-subset (Google handles unicode-range slicing). Confirm commercial JP font licenses allow self-hosting.

---

## 7. Tailwind v4 `@theme` Typography Tokens

Tailwind v4 defines design tokens in CSS via `@theme`. Wire `next/font` CSS variables and fluid `clamp()` values directly into font + size tokens.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* font families — point at next/font CSS variables */
  --font-sans: var(--font-sans), system-ui, sans-serif;
  --font-display: var(--font-display), var(--font-sans), sans-serif;
  --font-mono: var(--font-mono), ui-monospace, monospace;
  --font-ja: var(--font-sans), "Noto Sans JP", "Hiragino Kaku Gothic ProN",
             "Yu Gothic", "Meiryo", sans-serif;

  /* fluid type scale → utilities text-step-0 … text-step-5 */
  --text-step--1: clamp(0.83rem, 0.78rem + 0.27vw, 1rem);
  --text-step-0:  clamp(1rem, 0.91rem + 0.43vw, 1.25rem);
  --text-step-1:  clamp(1.2rem, 1.07rem + 0.65vw, 1.56rem);
  --text-step-2:  clamp(1.44rem, 1.26rem + 0.93vw, 1.95rem);
  --text-step-3:  clamp(1.73rem, 1.47rem + 1.29vw, 2.44rem);
  --text-step-5:  clamp(2.49rem, 2.01rem + 2.4vw, 3.82rem);

  --leading-tight: 1.1;
  --leading-body: 1.6;
  --leading-ja: 1.8;
  --tracking-tight: -0.02em;
  --tracking-wide: 0.08em;
}
```
```html
<h1 class="font-display text-step-5 leading-tight tracking-tight text-balance">…</h1>
<p  class="font-sans text-step-0 leading-body max-w-[66ch] text-pretty">…</p>
<p  class="font-ja text-step-0 leading-ja tracking-[0.04em] [font-feature-settings:'palt'_1]">日本語の本文…</p>
```
> Tailwind v4 ships `text-balance` / `text-pretty` utilities for `text-wrap`. Arbitrary `[font-feature-settings:...]` enables `palt`.

---

## 8. Quick Implementation Checklist

- [ ] Distinctive face chosen (not default Inter/Roboto); display+body pair has real contrast.
- [ ] Variable font where 3+ weights used; `font-weight`/`font-stretch` over raw `font-variation-settings`.
- [ ] Fluid scale via `clamp(rem + vw)`; body floor ≥ 16px; max ≤ 2.5× min; **passes 200% zoom (WCAG 1.4.4)**.
- [ ] line-height & tracking tuned per size (tight+negative for display, loose+positive for small/caps).
- [ ] `text-wrap: balance` on headings (with max-width), `text-wrap: pretty` on body.
- [ ] WOFF2 + subset + self-host + preload; `font-display: swap`; metric-matched fallback (or `next/font` `adjustFontFallback`). Budget < 100 KB.
- [ ] **JP:** line-height 1.6–1.9, letter-spacing 0.04–0.08em, `font-feature-settings: "palt" 1`, `line-break: strict`, no italics, dual JP+Latin stack, body = system fonts, webfont headings-only.

---

## Sources

- Variable fonts guide — MDN — https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide
- font-variation-settings — MDN — https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings
- @font-face font-variation-settings descriptor — MDN — https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-variation-settings
- Variable Fonts Guide: CSS Implementation & Best Practices 2025 — Font-Converters — https://font-converters.com/guides/variable-fonts
- Modern Fluid Typography Using CSS Clamp — Smashing Magazine — https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
- Consistent, Fluidly Scaling Type and Spacing — CSS-Tricks — https://css-tricks.com/consistent-fluidly-scaling-type-and-spacing/
- Creating a Fluid Type Scale with CSS Clamp — Aleksandr Hovhannisyan — https://www.aleksandrhovhannisyan.com/blog/fluid-type-scale-with-css-clamp/
- Utopia — Fluid type & space calculator — https://utopia.fyi/
- Responsive Typography: Best Practices for 2026 — remtopx — https://remtopx.com/blog/responsive-typography-best-practices/
- Adrian Roselli — WCAG 1.4.4 & fluid type caveat (referenced via Smashing/CSS-Tricks) — https://adrianroselli.com/2019/12/responsive-type-and-zoom.html
- CSS text-wrap: balance — Chrome for Developers — https://developer.chrome.com/docs/css-ui/css-text-wrap-balance
- CSS text-wrap: pretty — Chrome for Developers — https://developer.chrome.com/blog/css-text-wrap-pretty
- Better typography with text-wrap: pretty — WebKit — https://webkit.org/blog/16547/better-typography-with-text-wrap-pretty/
- text-wrap — MDN — https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap
- CSS font metric overrides (size-adjust / ascent-override) — web.dev — https://web.dev/articles/css-size-adjust
- ascent-override @font-face support (Safari unsupported) — caniuse — https://caniuse.com/mdn-css_at-rules_font-face_ascent-override
- Implement ascent-override/descent-override/line-gap-override (WebKit bug, still open) — https://bugs.webkit.org/show_bug.cgi?id=219735
- Variable fonts global support (~94%) — caniuse — https://caniuse.com/variable-fonts
- Custom fonts without compromise using next/font — Vercel — https://vercel.com/blog/nextjs-next-font
- next/font component — Next.js docs — https://nextjs.org/docs/pages/api-reference/components/font
- Complete Web Font Optimization Guide: WOFF2, Subsetting & Performance 2025 — Font-Converters — https://font-converters.com/guides/web-font-optimization
- The Most Comprehensive Guide to Web Typography in Japanese — Masaharu Hayataki — https://medium.com/@masaharuhayataki/japanese-web-typography-anatomy-and-best-practices-185449b7be65
- Using CSS font-feature-settings for better kerning in Japanese text — ICS MEDIA — https://ics.media/en/entry/14087/
- Seven rules for perfect Japanese typography — AQ — https://www.aqworks.com/blog/perfect-japanese-typography
- Typesetting principles of Chinese, Japanese, and Korean (CJK) text — Typotheque — https://www.typotheque.com/articles/typesetting-cjk-text
- Japanese typography on the web — tips and tricks — Pavel Laptev — https://pavellaptev.medium.com/japanese-typography-on-the-web-tips-and-tricks-981f120ad20e
- Google Fonts の日本語フォント（2025年末の現状） — Zenn (yhay81) — https://zenn.dev/yhay81/articles/202512-webfont
- 2025年の Google Fonts 総ざらい — note (中田デザイン事務所) — https://note.com/nakata_design/n/nde6a2952ccb1
- Noto Sans Japanese — Google Fonts — https://fonts.google.com/noto/specimen/Noto+Sans+JP
- Fontshare (Satoshi, General Sans, Clash Display, Switzer) — ITF — https://www.fontshare.com/
- Geist — Vercel — https://vercel.com/font
- Mona Sans / Hubot Sans — GitHub — https://github.com/github/mona-sans
- 15 typefaces designers can't stop using in 2026 — Creative Boom — https://www.creativeboom.com/resources/15-typefaces-designers-cant-stop-using-or-admiring-in-2026/
- Tailwind CSS v4 theme variables — Tailwind CSS docs — https://tailwindcss.com/docs/theme
