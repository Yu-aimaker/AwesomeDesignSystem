---
name: awesome-motion
description: >-
  Design and implement tasteful, purpose-driven motion and animation using the AwesomeDesignSystem
  — Motion (React, formerly Framer Motion) and CSS-only recipes. Use when the user asks to "add
  animation", "make it animate / move", "add transitions", "scroll effects", "page-load reveal",
  "stagger", "micro-interactions", "hover/press effects", or wants motion that feels considered
  rather than decorative. Produces working code with chosen easing/durations, reduced-motion
  fallbacks, and one orchestrated high-impact moment over scattered effects.
---

# AwesomeMotion — motion that communicates

Motion exists to communicate **state change, attention, or personality** — never as decoration.
One well-orchestrated moment beats a dozen scattered micro-interactions.

## 0. Load the motion modules

Read from the knowledge base (two levels up): `motion/principles.md` (purpose, springs,
easing/duration tokens, choreography, reduced-motion) and `motion/recipes.md` (copy-paste
Motion + CSS recipes). Use the `--ease-*` / `--dur-*` tokens from `foundations/tokens.md`.

## 1. Decide intent and intensity

Name what each animation communicates before coding it. Set `MOTION_INTENSITY` (default 6/10):
lower = restrained and editorial; higher = lively and expressive. Pick the **one** high-impact
moment (usually a staggered page-load reveal, or a hero/section entrance).

## 2. Pick the right tool

| Situation | Use |
|---|---|
| Static HTML / single-file / simple entrance & hover | **CSS only** — `@keyframes` + `animation-delay` stagger, transitions, `@starting-style`, `animation-timeline: view()` |
| React app, state-driven UI, lists, exit animations | **Motion** — `motion.*`, `variants` + `staggerChildren`, `AnimatePresence`, `useScroll`, springs |
| Page/route transitions | **View Transitions API** (same-doc & cross-doc) |
| Heavy timeline / pinned scroll storytelling | **GSAP + ScrollTrigger**; pair with **Lenis** for smooth scroll |

## 3. Craft rules

- **Springs over fixed easing for interactive motion** (Apple springs = duration+bounce; M3
  Expressive spring tokens). Use `--ease-out` for entrances, `--ease-in-out` for moves, snappy
  `--dur-fast` (150ms) for feedback, `--dur-base` (250ms) for transitions, `--dur-slow` (400ms) for large reveals.
- **Performance:** animate only `transform` and `opacity`; promote with `will-change` sparingly;
  avoid layout-thrashing properties (width/height/top/left).
- **Choreography:** stagger 40–80ms between siblings; lead with the most important element.
- **Reduced motion is mandatory:** wrap motion in `@media (prefers-reduced-motion: reduce)` (CSS)
  or gate with `useReducedMotion()` (Motion) and provide a non-moving fallback (fade/instant), not nothing.

## 4. Deliver working code

Provide the actual snippet (CSS or React/Motion) wired to the project's tokens, with the
reduced-motion fallback included. State what the motion communicates and which dial value it reflects.
Then sanity-check against the Pre-Flight motion lines in `00-philosophy/human-not-ai.md`.


## AwesomeDS Platform (required routing)

Before major UI work, also load:
- `../../DESIGN.md` (agent contract)
- For AwesomeDS-facing output, also load `../../design-system/brand/awesomeds-brand.md`; do not impose AwesomeDS's proof-mark/ember identity on third-party brands.
- `../../skills/shared/rule-contract.md`
- `../../skills/shared/reference-atlas.md`
- Relevant canon under `../../design-system/` via INDEX
- Executable packages: `@awesome-ds/tokens`, `@awesome-ds/react`, `@awesome-ds/motion`

### Review / QA
- Interface quality: `../../design-system/review/interface-quality-checklist.md` (cite IQ-* IDs)
- Local site: `pnpm --filter @awesome-ds/docs dev`
- Graph: `pnpm validate`
- Tests: `pnpm test` and `pnpm test:e2e` when UI changes

### Non-negotiables
- Semantic tokens only (no raw product colors in components)
- Full states: empty/loading/error as first-class
- WCAG 2.2 AA + keyboard paths
- Evidence for doctrine (`ref.*` / `rule.*`)
- No auto-promotion of social signals into canon
