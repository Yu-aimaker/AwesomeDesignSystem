# Modern SaaS / Product Marketing Aesthetic (2025–2026)

> The visual language of Linear, Stripe, Vercel, Raycast, Family, Arc, Resend, Clerk, Mintlify and peers.
> AI-agent-first reference. Embeds concrete tokens, CSS recipes, and the line between *tasteful* and *AI slop*.
> Captured June 2026.

---

## 1. The aesthetic in one paragraph

The dominant 2025–2026 SaaS look is **calm, dark-first, near-monochrome minimalism** built on
*restraint*: deep (never pure-black) backgrounds, hairline 1px borders instead of drop shadows,
generous whitespace, large confident type tightened with negative letter-spacing, and a **single
accent used like punctuation** rather than decoration. Color and motion are subtractive — Linear,
Vercel, and Raycast keep getting *less* colorful and *less* noisy over time. Signature flourishes
(gradient meshes, grain, glow/aurora, glass, bento grids, dot grids) are deployed **sparingly and
purposefully**, layered with grain/noise to avoid digital banding. The craft lives in details most
users never consciously see.

Linear's own words for their 2025 refresh: *"Structure should be felt not seen"* and *"most of what
makes software feel good is what you aren't likely to see."* ([Linear](https://linear.app/now/behind-the-latest-design-refresh))

---

## 2. Per-company signatures (primary-source tokens)

### Vercel — Geist
Aggressive minimalism: pure `#000` / `#fff`, custom Geist Sans + Geist Mono, near-zero radius on
marketing, accent used like punctuation. Optimized for developer surfaces (dashboards, logs, code);
reads cold if copied onto consumer marketing. ([Geist](https://vercel.com/geist/introduction))

```css
/* Geist gray ramp (approx) + tokens */
--gray-100:#f7f7f7; --gray-200:#e5e5e5; --gray-300:#d4d4d4; --gray-400:#a3a3a3;
--gray-500:#737373; --gray-600:#525252; --gray-700:#404040; --gray-800:#262626;
--gray-900:#171717; --gray-950:#0a0a0a;
--background:#000; --foreground:#ededed;
--accent-blue:#0070f3;   /* Vercel blue, the one accent */
--error:#ee0000; --warning:#f5a623;
--border-default:1px solid rgba(255,255,255,0.08);
--border-strong: 1px solid rgba(255,255,255,0.15);
--radius-sm:4px; --radius-md:6px; --radius-lg:8px; --radius-full:9999px;
```

Geist's **10-step functional color scale** is semantic, not just a ramp: Color 1=default bg,
2=hover, 3=active, 4=default border, 5=hover border, 6=active border, 7/8=high-contrast bg,
9=secondary text, 10=primary text. P3 colors on supported displays.
([Geist Colors](https://vercel.com/geist/colors))

Typography: tighter than Inter by default (negative tracking). Display headlines ~48–64px with
**-0.04em** letter-spacing and **1.15** line-height create the condensed high-impact marketing look.
Tailwind utility classes preset size+line-height+tracking+weight together.
([Geist Typography](https://vercel.com/geist/typography))

| token | size | line-height | tracking |
|-------|------|-------------|----------|
| display | 64px | 1.15 | -0.04em |
| 3xl | 48px | 1.15 | -0.04em |
| 2xl | 32px | ~1.2 | -0.01em |
| xl | 24px | ~1.3 | -0.01em |
| base | 16px | 1.5 | normal |
| sm | 14px | 1.5 | normal |
| xs | 12px | 1.5 | normal |

### Linear
The namesake of "Linear-style design." Dark gray Inter on near-black, neutral-heavy, almost no
accent on the marketing site in recent versions. ([Medium / Bootcamp](https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646))

- **LCH theme engine**: themes generated from just **3 inputs** — *base color, accent color,
  contrast* — instead of 98 hand-set variables. LCH (not HSL) is perceptually uniform, so a red and
  yellow at lightness 50 read equally light, giving consistent surface elevations.
  ([Linear redesign II](https://linear.app/now/how-we-redesigned-the-linear-ui))
- **2025 refresh**: shifted default palette from cool blue-ish gray → **warmer, less-saturated
  gray**; softened/rounded borders; *removed* separators ("they had quietly proliferated"); dimmed
  the sidebar; smaller icons; removed colored team-icon backgrounds. Color usage cut further.
  ([Linear refresh](https://linear.app/now/behind-the-latest-design-refresh))
- Principle: navigation **recedes**, task content advances. Backgrounds are brand color at ~1–10%
  lightness, never `#000`.

### Raycast
Single dark mode, no light variant. "The chrome IS the in-product command palette at marketing
scale" — marketing decoration = full-fidelity product screenshots (the Spotlight-style overlay).
**No drop shadows** — depth comes from a surface-color ladder + 1px hairlines.
([VoltAgent DESIGN.md](https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/raycast/DESIGN.md))

```css
/* Raycast surface ladder + tokens */
--canvas:#07080a;            /* page */
--surface:#0d0d0d;           /* cards */
--surface-elevated:#101111;  /* inputs/buttons */
--surface-card:#121212;      /* keycaps, icon tiles */
--ink:#f4f4f6; --body:#cdcdcd; --mute:#9c9c9d; --ash:#6a6b6c;
--hairline:#242728;                       /* 1px card border */
--hairline-soft:rgba(255,255,255,0.08);
--hairline-strong:rgba(255,255,255,0.16);
--primary:#fff; --on-primary:#000;        /* white pill = primary CTA only */
/* red hero band, ONCE per page max */
--hero-stripe:linear-gradient(135deg,#ff5757,#a1131a);
--keycap:linear-gradient(180deg,#121212,#0d0d0d);
/* radii cluster 4–16px; section rhythm 96px vertical */
```

Font: Inter with `font-feature-settings:"calt","kern","liga","ss03"` — the **ss03** stylistic set
(alternate `g`) is the brand-defining tell. Saturated accents are confined to extension/feature-tile
illustrations, never chrome.

### Family & Arc — the "craft / delight" school
Benji Taylor's Family wallet codifies three principles: **simplicity, fluidity, delight**. Every
animation is architectural — it explains the user's path A→B and gives the UI *dimensionality* (the
"dynamic tray" system presents UI on the fly, keeping screens minimal until context is needed).
*"Thoughtfully crafted software showcases a deep respect for the user."*
([Benji Taylor — Family Values](https://benji.org/family-values))
Arc's closed-tab logo "fidget spinner" with haptics is the canonical example of functionally
pointless but emotionally sticky delight. This school is the antidote to slop: motion with *meaning*.

### Resend / Clerk / Mintlify — dev-tool docs lineage
Resend: minimal black-and-white with monospace accents; site and docs visually unified. Mintlify
explicitly cites *"the clean and modern looks of products like Vercel and Resend"* (plus Linear,
Airbnb, Apple) as the inspiration for redoing its design system — green-accented, reading-optimized,
beautiful out-of-the-box. ([Mintlify design](https://www.mintlify.com/blog/design-matters)) These
tools share one DNA: neutral surfaces, one accent, mono for code/identifiers, docs that match the
marketing site exactly.

---

## 3. Signature techniques + copy-paste CSS recipes

### 3.1 Refined dark mode (never pure black)
Backgrounds = brand hue at 1–10% lightness, or warm/cool deep gray (`#181A20`, `#0a0a0a`,
`#07080a`). Pure `#000` + light text makes text "vibrate." Build **dark tokens** for surfaces,
borders, text hierarchy, and interactive states — *do not invert* the light palette.
([LogRocket](https://blog.logrocket.com/ux-design/linear-design/), [Chyshkala](https://chyshkala.com/blog/why-linear-design-systems-break-in-dark-mode-and-how-to-fix-them))

```css
:root[data-theme="dark"]{
  --bg-0:#08090a;          /* canvas — tinted, not #000 */
  --bg-1:#0d0e10;          /* card    */
  --bg-2:#141517;          /* elevated */
  --text-hi:#f4f4f6; --text-mid:#cdced2; --text-lo:#8a8c91;
  --line:rgba(255,255,255,0.08);   /* hairline */
  --line-strong:rgba(255,255,255,0.14);
  --accent:#5b8cff;
}
```

### 3.2 Hairline / 1px borders (depth without shadows)
```css
.card{
  background:var(--bg-1);
  border:1px solid var(--line);   /* THE depth primitive */
  border-radius:12px;
}
/* crisp sub-pixel hairline on retina */
@media (min-resolution:2dppx){ .card{ border-width:0.5px; } }
/* gradient hairline (top edge catches light) */
.card-lit{
  border:1px solid transparent;
  background:
    linear-gradient(var(--bg-1),var(--bg-1)) padding-box,
    linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.02)) border-box;
}
```

### 3.3 Grain / noise overlay (kills banding, adds tactility)
Generate noise with an inline SVG `feTurbulence`, tile it as a data-URI background at low opacity.
Use `fractalNoise` for soft film grain; `numOctaves` ≤ 3 for perf; add `stitchTiles="stitch"` for
seamless tiling. ([CSS-Tricks Grainy Gradients](https://css-tricks.com/grainy-gradients/),
[freeCodeCamp](https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/))

```css
.grain::before{
  content:""; position:absolute; inset:0; pointer-events:none;
  background-image:url("data:image/svg+xml,\
<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'>\
<feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/>\
</filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size:182px;             /* keep grain consistent */
  opacity:.08;                       /* subtle: 0.05–0.12 */
  mix-blend-mode:overlay;            /* test cross-browser */
}
```

Cheat sheet: subtle film grain → `baseFrequency .65–.9`, `numOctaves 3`, opacity `0.05–0.12`. Coarse
blobs → `baseFrequency .05–.2`. Bake alpha into the SVG with `feColorMatrix` (`…0 0 0 0.8 0`) for
finer control than CSS opacity.

### 3.4 Gradient mesh (Stripe-style)
Stripe's hero gradient is **WebGL, not CSS** — a ~10kb/~800-line "minigl" + Gradient class running
noise functions in a fragment shader, with a ScrollObserver that disables it off-screen. WebGL
offloads to GPU, avoiding the CPU repaint/compositing cost of animating CSS gradients. Colors come
from CSS custom props `--gradient-color-1…4`. Reverse-engineered as **Whatamesh**.
([Bram.us](https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/),
[DEV / jordienr](https://dev.to/jordienr/how-to-make-animated-gradients-like-stripe-56nh))

```css
/* Whatamesh: drive the WebGL canvas via 4 CSS vars */
#gradient-canvas{
  width:100%; height:100%;
  --gradient-color-1:#c3e4ff;
  --gradient-color-2:#6ec3f4;
  --gradient-color-3:#eae2ff;
  --gradient-color-4:#b9beff;
}
```
```html
<canvas id="gradient-canvas" data-transition-in></canvas>
<script type="module">
  import { Gradient } from "https://esm.sh/whatamesh";
  new Gradient().initGradient("#gradient-canvas");
</script>
```
*Static CSS fallback (cheap, no JS):*
```css
.mesh{
  background:
    radial-gradient(at 27% 37%, #c3e4ff 0, transparent 50%),
    radial-gradient(at 97% 21%, #eae2ff 0, transparent 50%),
    radial-gradient(at 52% 99%, #b9beff 0, transparent 50%),
    radial-gradient(at 10% 29%, #6ec3f4 0, transparent 50%);
}
```

### 3.5 Glow / aurora effects
Aurora = several heavily-blurred, low-opacity radial blobs behind content, optionally animated.
Glow reads dramatically on dark backgrounds. Keep it *purposeful* — directional light, not a rave.
([DEV / albertwalicki](https://dev.to/albertwalicki/aurora-ui-how-to-create-with-css-4b6g),
[Aceternity](https://ui.aceternity.com/components/aurora-background))

```css
.aurora{ position:relative; overflow:hidden; background:#020617; }
.aurora::before{                       /* the glow */
  content:""; position:absolute; inset:-20%;
  background:
    radial-gradient(40% 40% at 30% 20%, #5b8cff55, transparent 70%),
    radial-gradient(35% 35% at 75% 30%, #ce84cf44, transparent 70%),
    radial-gradient(45% 45% at 60% 80%, #13ffaa33, transparent 70%);
  filter:blur(60px);                   /* the magic */
  animation:aurora 18s ease-in-out infinite alternate;
}
@keyframes aurora{ from{transform:translate3d(-4%,0,0)} to{transform:translate3d(4%,2%,0)} }

/* a single CTA glow (use box-shadow sparingly — overuse = slop) */
.btn-glow{ box-shadow:0 0 0 1px var(--line), 0 8px 40px -8px var(--accent); }
```

Tailwind v4 aurora animation token:
```css
@import "tailwindcss";
@theme inline{
  --animate-aurora: aurora 60s linear infinite;
  @keyframes aurora{ from{background-position:50% 50%,50% 50%}
                     to  {background-position:350% 50%,350% 50%} }
}
```

### 3.6 Glassmorphism (tasteful)
Plain `backdrop-filter:blur()` is flat — real glass has imperfection. Add a noise pseudo-element on
top, keep borders subtle, **always** ship the `-webkit-` prefix for Safari.
([SVG Genie](https://www.svggenie.com/blog/advanced-svg-filters-glassmorphism-glitch))

```css
.glass{
  background:rgba(255,255,255,0.06);
  backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px);
  border:1px solid rgba(255,255,255,0.12);
  border-radius:16px; overflow:hidden;
}
.glass::after{                          /* noise = realism */
  content:""; position:absolute; inset:0; pointer-events:none;
  background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'>\
<filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/></filter>\
<rect width='100%' height='100%' filter='url(%23g)'/></svg>");
  opacity:.05; mix-blend-mode:overlay;
}
```

### 3.7 Dot / grid backgrounds (with spotlight mask)
One repeating radial-gradient = dots; two linear-gradients = grid lines. Mask the edges so the
pattern fades instead of tiling to infinity. ([ibelick](https://ibelick.com/blog/create-grid-and-dot-backgrounds-with-css-tailwind-css))

```css
/* dots */
.dots{ position:absolute; inset:0;
  background-image:radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px);
  background-size:16px 16px;
  -webkit-mask-image:radial-gradient(ellipse 60% 60% at 50% 0%, #000 40%, transparent 100%);
          mask-image:radial-gradient(ellipse 60% 60% at 50% 0%, #000 40%, transparent 100%);
}
/* grid */
.grid-bg{ position:absolute; inset:0;
  background-image:
    linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px);
  background-size:24px 24px;
}
```
Tailwind v4 size util changed: `bg-[size:16px_16px]` (v3) → `bg-size-[16px_16px]` (v4).

### 3.8 Bento grids
Named after the Japanese lunchbox; mainstreamed by Apple's 2023 product/WWDC pages, migrated into
B2B SaaS via Notion/Linear/Vercel across 2024–25; widely described as the **default for new B2B
homepages by 2026**. One design-blog analysis (Landdding's "top 100 SaaS on ProductHunt", echoed by
SaaSFrame/Pravin Kumar) puts adoption at ~67% — treat as a single-source industry estimate, not
audited data. Strict, geometric, hierarchical — *size maps to importance*.
([SaaSFrame](https://www.saasframe.io/blog/the-bento-layout-trend),
[Pravin Kumar](https://www.pravinkumar.co/blog/bento-grids-b2b-saas-homepage-design-trend-2026))

```css
.bento{
  display:grid; gap:16px;
  grid-template-columns:repeat(4,1fr);
  grid-auto-rows:200px;
}
.bento > .feature-hero{ grid-column:span 2; grid-row:span 2; } /* prime top-left, F-pattern */
.bento > .wide{ grid-column:span 2; }
.bento > .tall{ grid-row:span 2; }
@media (max-width:768px){ .bento{ grid-template-columns:1fr; } } /* restacks cleanly */
```
**Do:** alternate *outcome* cards ("Cut sales cycle 30%") with *feature* cards; put social proof in
row 2–3; vary cell sizes. **Don't:** >12–15 cells, or all-equal cells (that's just a rounded grid).

### 3.9 Micro-interactions & motion
Stripe's rules: **never** use built-in `ease-in/out/linear` — define custom cubic-bezier vars;
animate only **cheap properties** (`transform`, `opacity`); use `will-change` to hit the GPU; stay
**under 500ms**. ([Stripe Connect blog](https://stripe.com/blog/connect-front-end-experience))

2025–26 consensus: micro-interactions **150–200ms ease-out**; springs for *interactive* elements
(buttons, modals, tabs), fixed-duration tweens for *coordinated* things (progress bars, scroll
reveals). Library `framer-motion` was renamed **`motion`** (late 2024). Good default spring:
`stiffness ~200, damping ~20, bounce < 0.1` (anything bouncier reads playful, not pro). Always
honor `prefers-reduced-motion`; keep transitions interruptible. ([Motion docs](https://motion.dev/docs/react-transitions))

```css
:root{
  --ease-out-quint:cubic-bezier(.23,1,.32,1);  /* enter/rest */
  --ease-stripe:cubic-bezier(.2,1,.2,1);
  --dur-fast:150ms; --dur-base:220ms;
}
.btn{ transition:transform var(--dur-fast) var(--ease-out-quint),
                  opacity   var(--dur-fast) var(--ease-out-quint);
      will-change:transform; }
.btn:active{ transform:scale(.97); }
@media (prefers-reduced-motion:reduce){ *{ animation:none!important; transition:none!important; } }
```
```tsx
// Motion (ex framer-motion) — spring for interactive UI
import { motion } from "motion/react";
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 200, damping: 20, bounce: 0.05 }}
/>
```

### 3.10 Scroll-driven storytelling
Sequential reveals as the user scrolls (Linear/Apple style). Native CSS now does much of it without
JS via `animation-timeline: view()` / `scroll()`. Keep it subtle, one idea per viewport, respect
reduced-motion.

```css
@keyframes reveal{ from{opacity:0; transform:translateY(24px)} to{opacity:1; transform:none} }
.reveal{ animation:reveal linear both; animation-timeline:view(); animation-range:entry 0% cover 30%; }
```

---

## 4. Tasteful vs. AI slop — the dividing line

"AI slop" = **distributional convergence**: LLMs emit the most probable pattern, so everything
collapses into one interchangeable look. It earned 2025 Word-of-the-Year (Merriam-Webster). The test:
*if a fintech homepage could be a CRM or a PM tool with zero changes, it's slop.*
([925studios](https://www.925studios.co/blog/ai-slop-web-design-guide),
[Impeccable](https://impeccable.style/slop/))

### The tells (avoid these)
| Slop tell | Why it happens | Tasteful fix |
|-----------|----------------|--------------|
| Cards nested 3–5 deep, each with padding+shadow | most common training pattern | flatten; one container; hairline borders |
| Inter / system font everywhere | default in every AI tool | bespoke/character face; modify tracking |
| Same shadow on every element | one shadow token reused | shadow ladder, or none (use hairlines) |
| Blue→purple gradient + colored box-shadow glow | "cool" default | one purposeful directional light |
| Gradient *text* on headings/metrics | decorative AI tell | solid color text — protect scannability |
| Warm cream/beige "tasteful" bg by reflex | the safe default | deliberate palette choice |
| Rounded-square icon container above heading | universal feature-card template | icon inline / beside heading |
| Uniform 16px radius on everything | safe default | intentional radius scale per element role |
| Oversized hero + vague "Build the future" | average of millions of pages | real product-specific copy |

### What makes it tasteful (do these)
- **Typography is the fastest escape.** Replace Inter with a face that has personality, or earn the
  system font through deliberate tracking/weight. Linear modifies its type; Stripe pairs a bespoke
  serif headline with a clean sans body; Vercel commissioned Geist. ([Impeccable](https://impeccable.style/slop/))
- **Differentiate at the layout level, not just the component.** A terracotta button on the standard
  hero-section layout is still slop with a terracotta button.
- **Restraint in motion** — one or two well-placed animations beat a fireworks show.
- **Subtractive color** — accent like punctuation (Linear/Vercel keep removing color).
- **Human delight details** (Family/Arc) — purposeful micro-interactions signal a site "crafted for
  real people," the warmth AI's "average zone" misses.
- **Layer grain** over flat fills/gradients to escape the digital, banded look.
- Business stakes: IAS (analysis across 40+ agencies/brands) found traffic on **quality sites
  converts ~91% higher** than on low-quality "ad-clutter" inventory — note this measures ad-stuffed
  AI content farms, not generic-design SaaS sites, so apply it as directional context, not a direct
  metric for design slop. Either way, "credible-looking" is now the floor, not an advantage. Use AI
  as first-draft, apply human judgment for the rest. ([IAS via PPC Land](https://ppc.land/ias-makes-ai-slop-avoidance-generally-available-with-hard-performance-data/))

### Reusable token starter (paste-ready)
```css
:root{
  /* surfaces — tinted, never #000 */
  --bg-0:#08090a; --bg-1:#0d0e10; --bg-2:#141517;
  /* text hierarchy */
  --fg-hi:#f4f4f6; --fg-mid:#cdced2; --fg-lo:#8a8c91;
  /* hairlines do the work of shadows */
  --line:rgba(255,255,255,0.08); --line-strong:rgba(255,255,255,0.14);
  /* ONE accent */
  --accent:#5b8cff; --on-accent:#04060b;
  /* radius scale (intentional, not uniform) */
  --r-xs:4px; --r-sm:6px; --r-md:10px; --r-lg:16px; --r-full:9999px;
  /* spacing — 8px grid, big section rhythm */
  --s-1:4px; --s-2:8px; --s-3:12px; --s-4:16px; --s-6:24px;
  --s-8:32px; --s-12:48px; --s-16:64px; --s-24:96px;
  /* type — tight display tracking is the marketing tell */
  --tracking-display:-0.04em; --tracking-tight:-0.01em;
  --lh-display:1.15; --lh-body:1.5;
  /* motion */
  --ease:cubic-bezier(.23,1,.32,1); --dur-fast:150ms; --dur:220ms;
}
```

---

## 5. Quick checklist for an agent building this look
1. Dark canvas tinted (1–10% lightness), **not** `#000`. Build dark-native tokens; don't invert.
2. Depth = **1px hairline borders + surface ladder**, not drop shadows.
3. One accent, used like punctuation. Solid color for text (no gradient text).
4. Large headlines with **-0.04em tracking, 1.15 line-height**; bespoke or tracking-tuned font.
5. Generous whitespace; ~96px section rhythm.
6. Add **grain** (`feTurbulence` fractalNoise, opacity 0.05–0.12) over fills/gradients.
7. Mesh gradient = WebGL (Whatamesh) or layered radial fallback; glow/aurora = blurred low-opacity blobs.
8. Glass = `backdrop-filter:blur()` + noise overlay + `-webkit-` prefix.
9. Bento for feature sections: size = importance, mix outcome/feature cards, ≤12–15 cells.
10. Micro-interactions 150–200ms ease-out or spring (stiffness 200/damping 20/bounce <0.1); animate
    only transform/opacity; honor `prefers-reduced-motion`.
11. Differentiate at the **layout** level, not just colors. Real copy, real product screenshots.

---

## Sources
- Geist — Introduction — https://vercel.com/geist/introduction
- Geist — Colors — https://vercel.com/geist/colors
- Geist — Typography — https://vercel.com/geist/typography
- Vercel Design System Breakdown (SeedFlip) — https://seedflip.co/blog/vercel-design-system
- Geist (Vercel) — DesignSystems.one — https://www.designsystems.one/design-systems/vercel-geist
- How we redesigned the Linear UI (Part II) — https://linear.app/now/how-we-redesigned-the-linear-ui
- A calmer interface for a product in motion (Linear refresh) — https://linear.app/now/behind-the-latest-design-refresh
- The rise of Linear style design (Bootcamp/Medium) — https://medium.com/design-bootcamp/the-rise-of-linear-style-design-origins-trends-and-techniques-4fd96aab7646
- Linear design (LogRocket) — https://blog.logrocket.com/ux-design/linear-design/
- Why Linear Design Systems Break in Dark Mode (Chyshkala) — https://chyshkala.com/blog/why-linear-design-systems-break-in-dark-mode-and-how-to-fix-them
- Raycast DESIGN.md (VoltAgent/awesome-design-md) — https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/raycast/DESIGN.md
- Connect: behind the front-end experience (Stripe) — https://stripe.com/blog/connect-front-end-experience
- How To create the Stripe Website Gradient Effect (Bram.us) — https://www.bram.us/2021/10/13/how-to-create-the-stripe-website-gradient-effect/
- How to make animated gradients like Stripe (DEV / jordienr) — https://dev.to/jordienr/how-to-make-animated-gradients-like-stripe-56nh
- Grainy Gradients (CSS-Tricks) — https://css-tricks.com/grainy-gradients/
- How to Create Grainy CSS Backgrounds Using SVG Filters (freeCodeCamp) — https://www.freecodecamp.org/news/grainy-css-backgrounds-using-svg-filters/
- SVG Filter Effects: feTurbulence (Codrops) — https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/
- Advanced SVG Filters: Glassmorphism & Glitch (SVG Genie) — https://www.svggenie.com/blog/advanced-svg-filters-glassmorphism-glitch
- Aurora UI — how to create with CSS (DEV / albertwalicki) — https://dev.to/albertwalicki/aurora-ui-how-to-create-with-css-4b6g
- Aurora Background (Aceternity UI) — https://ui.aceternity.com/components/aurora-background
- Crafting grid and dot backgrounds with CSS/Tailwind (ibelick) — https://ibelick.com/blog/create-grid-and-dot-backgrounds-with-css-tailwind-css
- Understanding the Bento Layout Trend (SaaSFrame) — https://www.saasframe.io/blog/the-bento-layout-trend
- Bento Grids Quietly Winning B2B SaaS Homepages 2026 (Pravin Kumar) — https://www.pravinkumar.co/blog/bento-grids-b2b-saas-homepage-design-trend-2026
- Bento Grid CSS Tutorial (Senorit) — https://senorit.de/en/blog/bento-grid-design-trend-2025
- Family Values (Benji Taylor) — https://benji.org/family-values
- Arc Browser UI/UX Design (SaaSUI) — https://www.saasui.design/application/arc-browser
- Design matters: Mintlify's dashboard glow-up — https://www.mintlify.com/blog/design-matters
- Slop (Impeccable) — https://impeccable.style/slop/
- AI Slop Web Design: Complete Guide (925studios) — https://www.925studios.co/blog/ai-slop-web-design-guide
- IAS: AI slop avoidance with performance data (PPC Land) — https://ppc.land/ias-makes-ai-slop-avoidance-generally-available-with-hard-performance-data/
- React transitions (Motion docs) — https://motion.dev/docs/react-transitions
