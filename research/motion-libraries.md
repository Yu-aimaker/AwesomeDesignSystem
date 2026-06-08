# Motion & Animation Libraries (2026)

> AI-agent-first reference for web motion in 2026. Covers Motion (formerly Framer Motion), GSAP, Lenis, the View Transitions API, CSS scroll-driven animations, easing/duration recommendations, and accessibility. Code is copy-paste ready.

## TL;DR decision guide

| Need | Reach for | Why |
| --- | --- | --- |
| React component enter/exit, gestures, layout (FLIP), shared element | **Motion** (`motion/react`) | Declarative, hybrid WAAPI engine, springs by default |
| Cheap, always-on UI motion (hover, focus, fade-in) | **CSS** transitions + `@starting-style` | Zero JS, GPU-accelerated, runs off main thread |
| Scroll-progress bars, reveal-on-scroll, parallax | **CSS scroll-driven** (`animation-timeline`) first, Motion `useScroll` fallback | Native runs off main thread; no JS needed |
| Page/route transitions (same-doc or cross-doc) | **View Transitions API** | Browser-native morph, MPA support since Chrome 126 |
| Complex timelines, SVG morph, draw, text splitting, pinning | **GSAP** + ScrollTrigger | Battle-tested sequencing; 100% free since 2025 |
| Buttery momentum scroll feeding scroll animations | **Lenis** | Lightweight, integrates with GSAP/Motion |

**Orchestration principle:** one strong, staggered page-load reveal beats a dozen scattered micro-interactions. Choreograph entrance, keep the rest restrained, and always honor `prefers-reduced-motion`.

---

## Motion (formerly Framer Motion)

Renamed from **Framer Motion** to **Motion**. Import path is now `motion/react`. Latest release line is **v12.x** (v12.39.0, 2026-05-18). Hybrid engine uses the Web Animations API + `ScrollTimeline` for hardware acceleration, with a JS fallback for spring physics, gestures, and layout.

```bash
npm install motion
```

```jsx
// New import path (NOT "framer-motion")
import { motion } from "motion/react"
```

> Upgrade note: `framer-motion` still works as an alias, but new projects should use `motion`. Server components: import animated children from `"motion/react-client"` or mark the file `"use client"`.

### 1. The `motion` component + basic props

```jsx
import { motion } from "motion/react"

export function Card() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}   // mount-from state
      animate={{ opacity: 1, y: 0 }}    // target state
      exit={{ opacity: 0, y: -20 }}     // requires <AnimatePresence>
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      Content
    </motion.div>
  )
}
```

- Physical props (`x`, `y`, `scale`, `rotate`) default to **spring** physics.
- Visual props (`opacity`, `color`, `backgroundColor`) default to **tween** easing.

### 2. Variants, stagger & orchestration

Variants are named states that propagate down the tree. Children with the same variant name animate automatically when the parent changes — this is the backbone of a clean staggered reveal.

```jsx
import { motion, stagger } from "motion/react"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      when: "beforeChildren",       // parent finishes before children
      delayChildren: stagger(0.08), // 0.08s between each child
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.25 } },
}

export function List({ items }) {
  return (
    <motion.ul variants={container} initial="hidden" animate="show">
      {items.map((label) => (
        <motion.li key={label} variants={item}>
          {label}
        </motion.li>
      ))}
    </motion.ul>
  )
}
```

`stagger()` accepts a `from` option (`"first" | "last" | "center" | <index>`) and `ease` to shape the cascade. Dynamic variants take a `custom` prop:

```jsx
const variants = {
  visible: (i) => ({ opacity: 1, transition: { delay: i * 0.1 } }),
}
// <motion.div custom={index} variants={variants} animate="visible" />
```

### 3. AnimatePresence (exit animations)

`exit` only runs when the element is wrapped in `AnimatePresence` and removed from the React tree.

```jsx
import { AnimatePresence, motion } from "motion/react"

export function Modal({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </AnimatePresence>
  )
}
```

Modes & options:
- `mode="wait"` — finish exit before the next element enters.
- `mode="popLayout"` — removed item pops out of flow so siblings reflow smoothly (pairs with `layout`). Custom child components must use `forwardRef`.
- `propagate` — lets a parent's exit cascade to children (added in v12.x).
- `initial={false}` — skip the first mount animation.

### 4. Layout & shared-element animations (FLIP)

The `layout` prop animates size/position changes (flex, grid, reorder) using FLIP — performant because it animates transforms, not layout properties.

```jsx
// Animate any layout change (e.g. when this element moves in a flex/grid)
<motion.div layout transition={{ type: "spring", stiffness: 350, damping: 30 }} />

// Shared-element transition: same layoutId across two elements morphs between them
<motion.div layoutId="hero-card" />   // in list view
<motion.div layoutId="hero-card" />   // in detail view — morphs from the list card
```

- `layout="position"` animates only position; `layout="size"` only size.
- Curved motion paths (v12.x): `transition={{ layout: { path: arc() } }}` curves the morph instead of moving in a straight line.
- Wrap reordering lists in `AnimatePresence mode="popLayout"` so removed items don't shove the rest.

### 5. Scroll-linked animations (`useScroll` + `useTransform`)

`useScroll` returns `scrollX/scrollY` (pixels) and `scrollXProgress/scrollYProgress` (0→1).

```jsx
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

// Page reading-progress bar
export function ProgressBar() {
  const { scrollYProgress } = useScroll()
  return (
    <motion.div
      style={{ scaleX: scrollYProgress, originX: 0,
               position: "fixed", insetInline: 0, top: 0, height: 4 }}
    />
  )
}

// Parallax tied to a specific section entering/leaving the viewport
export function Parallax() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"], // enters bottom → exits top
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  return (
    <section ref={ref}>
      <motion.img style={{ y }} src="/bg.jpg" alt="" />
    </section>
  )
}
```

Prefer `whileInView` for simple reveal-once-on-scroll (no manual transform math):

```jsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.3 }}   // fire once, when 30% visible
  transition={{ duration: 0.5, ease: "easeOut" }}
/>
```

### 6. Springs & transitions reference

Spring is the default for physical props. Two ways to define it:

```jsx
// Physics-based
transition={{ type: "spring", stiffness: 100, damping: 10, mass: 1 }}

// Duration-based (more intuitive — recommended for UI)
transition={{ type: "spring", visualDuration: 0.4, bounce: 0.25 }}
```

**Spring defaults:** `stiffness: 1`, `damping: 10`, `mass: 1`, `bounce: 0.25`, `restSpeed: 0.1`, `restDelta: 0.01`. `visualDuration` is the perceived time to reach the target (overrides `duration`); `bounce` 0 = no overshoot, 1 = very bouncy.

**Tween defaults:** `duration: 0.3` (or `0.8` for multi-keyframe), `ease: "easeInOut"`.

Built-in eases: `linear`, `easeIn/Out/InOut`, `circIn/Out/InOut`, `backIn/Out/InOut`, `anticipate`, or a cubic-bezier array `[0.17, 0.67, 0.83, 0.67]`.

Repeat & keyframes:

```jsx
<motion.div
  animate={{ scale: [1, 1.2, 1] }}     // keyframe array
  transition={{
    duration: 2,
    times: [0, 0.5, 1],                // position of each keyframe
    repeat: Infinity,
    repeatType: "mirror",              // "loop" | "reverse" | "mirror"
    repeatDelay: 0.5,
  }}
/>
```

---

## CSS-only animation patterns

Reach for CSS first: transforms and opacity are GPU-composited and run off the main thread. No JS, no bundle cost.

### Transitions + `@starting-style` (entry animation, no JS)

By default CSS transitions don't fire on first render or when an element goes from `display: none` to visible. `@starting-style` (Baseline since Aug 2024) fixes both, and `transition-behavior: allow-discrete` lets `display`/`overlay` participate.

```css
.toast {
  opacity: 1;
  transform: translateY(0);
  transition:
    opacity 0.3s ease-out,
    transform 0.3s ease-out,
    display 0.3s allow-discrete; /* discrete prop needs allow-discrete */
}

/* Starting point for the FIRST render / display:none → block */
@starting-style {
  .toast {
    opacity: 0;
    transform: translateY(8px);
  }
}
```

Popover / `<dialog>` entry (place `@starting-style` AFTER the open rule — equal specificity):

```css
[popover] {
  opacity: 0;
  transition: opacity 0.25s, overlay 0.25s allow-discrete, display 0.25s allow-discrete;
}
[popover]:popover-open { opacity: 1; }
@starting-style {
  [popover]:popover-open { opacity: 0; }
}
```

### Keyframes

```css
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
.reveal { animation: fade-in-up 0.5s ease-out both; }
```

### Scroll-driven animations (`animation-timeline`)

Native scroll/visibility-driven animation — no JS, runs off main thread. **Browser support 2026: not yet Baseline (Chromium since 2023, Safari 26 shipped; Firefox still behind a flag)** — treat as progressive enhancement behind `@supports`.

```css
/* Page scroll-progress bar — scroll() = nearest scroller progress */
.progress {
  position: fixed; inset-inline: 0; top: 0; height: 4px;
  transform-origin: left; transform: scaleX(0);
  animation: grow-x linear;
  animation-timeline: scroll(root block);
}
@keyframes grow-x { to { transform: scaleX(1); } }

/* Reveal-on-scroll — view() = subject's own visibility in scrollport */
.card {
  animation: fade-in-up linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%; /* animate while entering */
}

@supports (animation-timeline: scroll()) {
  /* feature-detect before relying on it */
}
```

> Gotcha: the `animation` shorthand resets `animation-timeline` to `auto`. Declare `animation-timeline` **after** any `animation` shorthand.

---

## View Transitions API

Browser-native animated transitions between DOM states. The browser snapshots old/new states and cross-fades (or morphs named elements) for you.

**Browser support 2026:**
- Same-document `document.startViewTransition()`: Chrome/Edge 111+, Safari 18+, Firefox 144+ (Baseline newly available Oct 2025).
- Cross-document `@view-transition`: Chrome/Edge 126+, Safari 18.2+, Firefox in progress.

### Same-document (SPA)

```js
function navigate(updateDOM) {
  // Graceful fallback when unsupported
  if (!document.startViewTransition) return updateDOM()

  const transition = document.startViewTransition(() => updateDOM())
  transition.ready.then(() => {/* animations started */})
  transition.finished.then(() => {/* done */})
}
```

### Cross-document (MPA) — pure CSS opt-in, both pages

```css
@view-transition { navigation: auto; }
```

Hook into the lifecycle for fine control:

```js
window.addEventListener("pageswap",  (e) => { /* outgoing page */ })
window.addEventListener("pagereveal", (e) => { /* incoming page */ })
```

### Naming elements + customizing the animation

Give a shared element the same `view-transition-name` on both states and the browser morphs it (shared-element transition). Style the generated pseudo-elements to override the default cross-fade.

```css
.hero-image { view-transition-name: hero; } /* must be unique per snapshot */

/* Pseudo-element tree: ::view-transition > group > image-pair > old/new */
::view-transition-old(hero) { animation: 0.3s ease-out both fade-out; }
::view-transition-new(hero) { animation: 0.3s ease-in  both fade-in;  }
```

> React: Next.js App Router and React Router support View Transitions; React 19 exposes a `<ViewTransition>` component (experimental). For SPA frameworks without native helpers, wrap route updates in `startViewTransition`.

---

## GSAP

**Now 100% free, including all former Club plugins** (SplitText, MorphSVG, DrawSVG, ScrollTrigger, ScrollSmoother) for commercial use — Webflow acquired GreenSock (Oct 2024) and freed the full toolset (Apr 2025). Current line: **v3.x** (v3.13+). Still maintained by the original team.

**When to use GSAP over Motion/CSS:** complex sequenced timelines, SVG morphing/drawing, text splitting, scroll-pinning, and precise control independent of React's render cycle. For typical React component motion, Motion is lighter and more idiomatic.

```bash
npm install gsap
```

### Core API

```js
import gsap from "gsap"

gsap.to(".box", { x: 200, rotation: 360, duration: 1, ease: "power2.out" })
gsap.from(".box", { opacity: 0, y: 50, duration: 0.6 })
gsap.fromTo(".box", { opacity: 0 }, { opacity: 1, duration: 0.6 })

// Timeline: sequence with relative positioning
const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 0.5 } })
tl.from(".title", { y: 40, opacity: 0 })
  .from(".subtitle", { y: 20, opacity: 0 }, "-=0.3") // overlap previous by 0.3s
  .from(".cta", { scale: 0.8, opacity: 0 }, "<")     // start with previous
```

### ScrollTrigger

```js
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
gsap.registerPlugin(ScrollTrigger)

gsap.to(".panel", {
  xPercent: -100,
  ease: "none",
  scrollTrigger: {
    trigger: ".container",
    pin: true,            // pin while animating
    scrub: 1,             // tie progress to scrollbar (1 = 1s smoothing)
    start: "top top",
    end: "+=2000",
  },
})
```

In React, use `useGSAP()` (from `@gsap/react`) for automatic cleanup:

```jsx
import { useGSAP } from "@gsap/react"
useGSAP(() => { gsap.from(".item", { y: 30, opacity: 0, stagger: 0.1 }) },
        { scope: containerRef })
```

---

## Lenis (smooth scroll)

Lightweight momentum/smooth-scroll with zero runtime dependencies. Current: **v1.3.x** (v1.3.23, Apr 2026). First-class React/Vue packages.

```bash
npm install lenis
```

```js
import Lenis from "lenis"

const lenis = new Lenis({
  autoRaf: true,   // built-in RAF loop
  lerp: 0.1,       // interpolation (lower = smoother/slower catch-up)
  duration: 1.2,   // used when wheel-multiplier easing
})
lenis.on("scroll", (e) => {/* scroll data */})
```

React:

```jsx
import { ReactLenis } from "lenis/react"
export default function App({ children }) {
  return <ReactLenis root options={{ lerp: 0.1 }}>{children}</ReactLenis>
}
```

Drive GSAP ScrollTrigger from Lenis (single RAF source of truth):

```js
const lenis = new Lenis()
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000)) // GSAP ticker → Lenis (s→ms)
gsap.ticker.lagSmoothing(0)
```

> Use smooth scroll sparingly. It can hurt accessibility and feel laggy on low-end devices; always disable under reduced-motion (`lenis.destroy()` / don't mount `ReactLenis`).

---

## Easing curves & durations

Linear motion doesn't exist in the real world — objects accelerate and decelerate. Easing makes UI feel physical.

**Which curve:**
- **Ease-out** for elements **entering** (fast in, settles gently — feels responsive).
- **Ease-in** for elements **exiting** (accelerates off-screen — needs less attention).
- **Ease-in-out** for elements **moving between states** in place.

**Recommended durations (reference values):**

| Use case | Easing | Duration |
| --- | --- | --- |
| Micro-interactions (hover, tap, toggle) | ease-out | 120–200ms |
| Standard transitions | ease-out (enter) / ease-in (exit) | ~200ms |
| Inter-screen / page transitions | ease-in-out | ~300ms |
| Large-distance / large-scale changes | ease-in-out | longer, scale with distance |

Duration should be **contextual, not fixed** — scale it to travel distance and size change (Material, Carbon). A 300ms animation seen 40×/day becomes painful; keep frequent UI snappy.

**Reusable easing tokens (CSS):**

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);    /* expo-out: snappy entrance */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-spring: linear(0, 0.5, 1.1, 0.95, 1);  /* spring via linear() */
  --dur-fast: 150ms;
  --dur-base: 250ms;
  --dur-slow: 400ms;
}
```

> **2026 shift:** Material Design 3 Expressive moved its components from fixed easing/duration to a **spring-based physics system** (expressive vs. standard schemes). Springs (Motion's `visualDuration`/`bounce`, GSAP, MD3) increasingly replace cubic-beziers for natural, interruptible motion. The fixed-duration table above is still the right baseline for utilitarian transitions.

---

## Orchestration: choreograph, don't scatter

- **One strong staggered page-load reveal > many scattered micro-interactions.** Lead with a deliberate entrance (header → hero → content cascade via variants/`stagger()` or a GSAP timeline), then keep ongoing motion restrained.
- **Stagger ~50–100ms** between siblings; total cascade under ~600ms so it never blocks reading.
- **Keep animations interruptible** — never lock the UI until an animation finishes. An animation that blocks interaction is a bug dressed up as a feature.
- **Be consistent** — same interaction type → same timing + easing, enforced via tokens.
- **Animate only `transform` and `opacity`** to stay compositor-only (~60fps+). Avoid animating `width`, `height`, `top`, `left`, `box-shadow`, or `filter` in hot paths.
- **Reveal-once**, not on every scroll-by (`viewport={{ once: true }}` / `animation-fill-mode: both`).

---

## `prefers-reduced-motion` (required)

Some motion (large pans/zooms, parallax) triggers vestibular discomfort. Reduce — don't necessarily remove: replace large transforms with opacity fades so the experience still feels intentional. The OS exposes the setting; honor it everywhere.

**CSS baseline (global safety net):**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**View Transitions:**

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

**Motion (React) — site-wide:**

```jsx
import { MotionConfig } from "motion/react"
// "user" disables transform/layout animations, keeps opacity/color
<MotionConfig reducedMotion="user">{children}</MotionConfig>
```

**Motion — per-component (replace transform with fade):**

```jsx
import { useReducedMotion } from "motion/react"

function Sidebar({ isOpen }) {
  const reduce = useReducedMotion()       // boolean, updates live on toggle
  const animate = isOpen
    ? (reduce ? { opacity: 1 } : { x: 0 })
    : (reduce ? { opacity: 0 } : { x: "-100%" })
  return <motion.div animate={animate} />
}
```

Also disable Lenis smooth scroll, parallax, and autoplaying video under reduced motion. Test via Chrome DevTools "Emulate prefers-reduced-motion: reduce" and real OS settings — `useReducedMotion()` returns a plain boolean usable with any library. SSR: default to a safe value on first render, reconcile on client.

---

## Sources

- Motion for React — Quick start — https://motion.dev/docs/react-quick-start
- Motion for React — Animation (variants, orchestration) — https://motion.dev/docs/react-animation
- Motion for React — Transitions (spring/tween/stagger defaults) — https://motion.dev/docs/react-transitions
- Motion for React — Scroll animations (useScroll/useTransform) — https://motion.dev/docs/react-scroll-animations
- Motion for React — Layout animations — https://motion.dev/docs/react-layout-animations
- Motion for React — Accessibility / useReducedMotion — https://motion.dev/docs/react-accessibility
- Motion — Changelog (v12.39.0, 2026-05-18) — https://motion.dev/changelog
- Motion — GitHub CHANGELOG — https://github.com/motiondivision/motion/blob/main/CHANGELOG.md
- MDN — View Transition API — https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- MDN — animation-timeline (scroll-driven) — https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timeline
- MDN — @starting-style — https://developer.mozilla.org/en-US/docs/Web/CSS/@starting-style
- MDN — prefers-reduced-motion — https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- GSAP — Docs v3 — https://gsap.com/docs/v3/
- GSAP 3.13 release — https://gsap.com/blog/3-13/
- Webflow — GSAP is now 100% free — https://webflow.com/blog/gsap-becomes-free
- CSS-Tricks — GSAP is Now Completely Free — https://css-tricks.com/gsap-is-now-completely-free-even-for-commercial-use/
- Lenis — GitHub (darkroomengineering/lenis) — https://github.com/darkroomengineering/lenis
- Material Design 3 — Easing and duration — https://m3.material.io/styles/motion/easing-and-duration
- Material Design 3 — Motion overview (physics/springs) — https://m3.material.io/styles/motion/overview/how-it-works
- Nielsen Norman Group — Executing UX Animations: Duration — https://www.nngroup.com/articles/animation-duration/
- Josh W. Comeau — Accessible Animations with prefers-reduced-motion — https://www.joshwcomeau.com/react/prefers-reduced-motion/
