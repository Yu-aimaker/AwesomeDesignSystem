# AI Slop vs. Human-Feeling Design — The Definition

> **For AI agents:** This file defines the line between "AI slop" UI and design that
> feels human, crafted, and intentional. It is the *taste layer* of this design system.
> Read it before generating any frontend. Everything below is distilled from primary
> sources (Anthropic's frontend guidance + engineering blog) and credible 2025–2026
> design critique. Source list at the end.
>
> **Status (June 2026):** "AI slop" is now a settled term of art in design discourse.
> Anthropic ships explicit anti-slop guidance in its Claude Cookbook and `frontend-design`
> Skill. The discourse has matured from "AI makes bad design" to a sharper claim:
> **thoughtlessness makes slop; AI just scales it.**

---

## 1. What "AI Slop" Means

**AI slop** = output that is *superficially competent but lacks substance, point of view,
or contextual fit*. A 2026 academic framing — Kommers et al., "Why Slop Matters" (MINT Lab,
Indiana University; arXiv:2601.06060, Jan 2026; published in ACM AI Letters) — names three
"prototypical properties": **superficial competence, asymmetric effort, and mass
producibility.** "Superficial competence" — looking right while lacking substance — maps
exactly onto generic AI UI.

The defining symptom in web design is **distributional convergence**: when you ask an LLM
to "build a landing page" with no constraints, you don't get *design* — you get **the
median of every Tailwind tutorial scraped from GitHub between 2019 and 2024.** Models
predict the most probable next token, so "safe" choices that offend no one dominate the
output. This is *not* a knowledge gap — Claude knows typography and color theory; it
**defaults to the statistical center unless explicitly steered off it.**

> The problem isn't that AI creates *bad* designs. It's that AI creates the *same*
> design everyone else gets.

### The origin story of the purple
In **August 2025**, Tailwind creator Adam Wathan posted an apology (1M+ views on X) for
having defaulted Tailwind UI's example buttons to `bg-indigo-500` years earlier — an
arbitrary choice that cascaded through thousands of tutorials and codebases, saturating
LLM training data with purple-as-default-accent. That single default is a large part of
why AI-built sites turn purple.

---

## 2. The Hallmarks of AI Slop (the visual tells)

A site is sloppy when a fintech homepage could be swapped onto a CRM or a to-do app **with
zero changes** — the design communicates nothing about the brand, product, or people.

| Dimension | The Tell | Why it reads as cheap |
|---|---|---|
| **Typography** | Inter / Roboto / Arial / Open Sans / system fonts; Space Grotesk as the "I tried" upgrade; lately Geist + Instrument Serif converging too | A font no one chose. Inter + system fallback = "never intentionally styled." |
| **Color** | Purple/violet → blue gradient on white; cyan-on-dark; pastel rainbow accents; timid, evenly-distributed palettes | Omnipresent to the point of meaninglessness; no dominant color, no point of view. |
| **Hero** | Centered eyebrow + 64px headline + subhead + two CTAs | The single most-copied macrostructure on the web. |
| **Layout** | Three-up feature cards w/ emoji or icon; logo soup; pricing toggle; FAQ accordion; identical nav | Predictable, interchangeable, brandless. |
| **Cards** | Thick colored border on one side of a rounded card; cards-inside-cards 3–5 levels deep, each with its own padding + shadow | The single most recognizable signature of AI-generated UI. |
| **Radius / spacing** | Uniform 16px radius on *everything*; identical padding & card heights; `rounded-xl` default buttons | Flat hierarchy — nothing is emphasized because everything is equal. |
| **Shadows** | Exactly `0.1` opacity soft drop shadows everywhere; generic glassmorphism; animated gradient blobs | Decorative default, not a considered elevation system. |
| **Motion** | Uniform fade-ins, or none; buttons that snap instead of ease; scattered unmotivated micro-interactions | Motion as decoration, not communication. |
| **Imagery** | Stock photos of diverse groups at laptops in unreal lighting; AI illustrations "slightly too smooth, too symmetrical" | Plastic; signals no real product or team. |
| **Copy** | "Build the future of work," "Scale without limits"; hedging ("may help," "can potentially"); generic superlatives | Generically averaged voice; no human said this. |
| **Components** | Default shadcn cards with no styling on top; Tailwind defaults untouched | Using a kit ≠ having taste. shadcn is a *starting point*, not a finished look. |
| **Missing** | No hierarchy beyond size; no error/empty/loading states; no a11y | Competence without substance. |

> **Default shadcn is not the enemy — *unstyled* shadcn is.** shadcn/ui is an unstyled
> primitive layer meant to be themed. Shipping its raw defaults (slate palette, default
> radius, no type choice) is the most common "kit-with-no-taste" tell.

---

## 3. Why Slop Happens (so agents can self-correct)

1. **Convergence under ambiguity.** Vague prompts → the statistical mean. The fix is
   *direction*, not more requests.
2. **Over-specification also fails.** Filling a prompt with rigid pixel-level specs burns
   the model's capacity on conservative defaults, leaving no room for creative choice — the
   result is "technically correct but visually dead." Both extremes (total openness AND
   pixel-locking) produce dead output.
3. **The sweet spot is the "right altitude": principle-based direction.** Tell the model
   *what to think about* (typography, color, motion, backgrounds), not exactly *what to
   produce.* Direct attention to specific dimensions individually.
4. **Taste requires lived experience.** A human develops taste by feeling the emotional
   impact of thousands of layouts; an LLM has "statistical correlations between tokens."
   So the taste must be *supplied* — via constraints, references, and tokens up front.

---

## 4. What Makes Design Feel HUMAN (the positive definition)

The 2025–2026 reorientation: design value has moved **from polish to presence** — from
surface perfection toward *judgment and intent.* Clients now literally request work that
"feels human," a phrase nearly unheard of in briefs before 2024. What separates designers
now "isn't access, it's judgment, taste, and decision-making." Below is what that resolves
to in practice.

### Human-Feel Principles

1. **Point of view.** A clear authorial stance. The work could only have come from
   *this* brand for *this* audience. "Architecture that could come from anywhere
   effectively comes from nowhere." Triangulate between two specific anchors (e.g.
   "Linear's typography discipline + Pitchfork's editorial color") so the result reads
   as *designed*, not copied.
2. **Restraint = confidence.** White space "signals confidence — it feels editorial,
   controlled, intentional." Minimal because the idea is strong enough to stand alone,
   not because there are no ideas. Every element earns its place.
3. **Intentional imperfection.** Slight wobble, hand-drawn marks, grain/paper/noise
   texture, asymmetry, "off" spacing — read as **care**, not carelessness, when they come
   from understanding the rules well enough to bend them. "Looseness that is intentional."
4. **Real content hierarchy.** Emphasis lives in *contrast* (size, weight, color, space),
   not in uniform sizing. One thing is clearly the most important on every screen.
5. **Editorial confidence.** Magazine-grade asymmetry: pull quotes, overlapping
   text/image, dramatic type hierarchy. Layout as composition, not a grid of equal boxes.
6. **Considered motion.** Animation communicates *state change, attention, or personality*
   — never decoration. One well-orchestrated page load (staggered reveals) beats scattered
   micro-interactions. Easing curves and durations are chosen, not defaulted.
7. **Craft at 800% zoom.** Optical alignment, consistent spacing rhythm, color harmony,
   contrast ratios, considered elevation. The details a designer refines after the layout
   "works."
8. **Originality.** Evidence of deliberate custom decisions a human designer would
   recognize as choices — not a template filled in.
9. **Contextual fit.** Color is *semantic* (function, not decoration); imagery is real
   (product screenshots, actual team, custom illustration); copy sounds like a specific
   human ("Would our CEO actually say this?").
10. **Coherent whole.** Color, type, layout, imagery, and motion combine into **one
    distinct mood and identity** — "a coherent whole rather than a collection of parts."
    This is Anthropic's #1 grading criterion for design quality.

---

## 5. Anthropic's Four Grading Criteria for Design

From Anthropic's engineering work on grading subjective quality. The reframe that makes
taste *gradable*: not "Is this beautiful?" but **"Does this follow our principles for good
design?"**

1. **Design quality** — "Does the design feel like a coherent whole rather than a
   collection of parts?" Colors, type, layout, imagery combine into a distinct mood/identity.
2. **Originality** — Custom decisions over templates; a human designer recognizes
   deliberate creative choices.
3. **Craft** — Technical execution: type hierarchy, spacing consistency, color harmony,
   contrast ratios.
4. **Functionality** — Usability independent of aesthetics.

> Use a **generator/evaluator split** (GAN-inspired): never let the generating agent grade
> its own work — "agents tend to confidently praise the work even when the quality is
> obviously mediocre." Separate roles drive the generator toward stronger output.

---

## 6. The Anti-AI-Slop Checklist

Run this before shipping any frontend. Each ✗ is a slop tell to fix.

```text
TYPOGRAPHY
[ ] No Inter / Roboto / Arial / Open Sans / Lato / system-default font
[ ] No reflexive Space Grotesk OR Instrument Serif as the only "choice"
[ ] A deliberate font choice stated BEFORE writing CSS
[ ] High-contrast pairing (display + mono, or serif + geometric sans)
[ ] Weight extremes used (100/200 vs 800/900 — not 400 vs 600)
[ ] Size jumps of 3x+, not 1.5x

COLOR
[ ] No purple/violet gradient on white; no default cyan-on-dark
[ ] One dominant color + sharp accents (NOT a timid even palette)
[ ] Color is semantic (function-named CSS vars), not decorative
[ ] Committed to ONE cohesive aesthetic (named tone)

LAYOUT
[ ] Hero is not the default centered-eyebrow-headline-subhead-2CTA
[ ] Not three identical feature cards with emoji/icons
[ ] Radius/padding/shadow are an intentional SYSTEM, not 16px-on-everything
[ ] No cards-in-cards nesting; no one-sided thick colored border
[ ] Real visual hierarchy — one clear focal point per screen

MOTION
[ ] Motion communicates state/attention/personality, not decoration
[ ] Chosen easing + duration (not snap; not uniform fade)
[ ] One orchestrated page-load moment > scattered micro-interactions

SUBSTANCE
[ ] Error / empty / loading states designed
[ ] Accessibility (contrast, focus, semantics) handled
[ ] Copy has a specific voice; no hedging or generic superlatives
[ ] Real imagery (screenshots/team/custom), not generic stock/AI art
[ ] Default shadcn/Tailwind has been THEMED, not shipped raw

WHOLE
[ ] Could ONLY be this brand for this audience (swap-test fails for others)
[ ] Reads as a coherent whole, not a collection of parts
```

---

## 7. Operational Method (the prompt-side fix)

The repeatable method from Anthropic's guidance:
**(1) identify convergent defaults → (2) provide concrete alternatives →
(3) structure guidance at the right altitude → (4) make it reusable via a Skill.**

Three strategies, applied to each dimension individually:

- **Guide specific design dimensions** — typography, color, motion, backgrounds, one at a time.
- **Reference design inspirations** — IDE themes, cultural aesthetics, two named anchors.
- **Call out common defaults explicitly** — "avoid Inter," "no purple-on-white."

### Anthropic's distilled aesthetics prompt (copy-paste)

```text
<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend
design, this creates what users call the "AI slop" aesthetic. Avoid this: make
creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid
generic fonts like Arial and Inter; opt instead for distinctive choices that
elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for
consistency. Dominant colors with sharp accents outperform timid,
evenly-distributed palettes. Draw from IDE themes and cultural aesthetics.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only
solutions for HTML. Use the Motion library for React when available. Focus on
high-impact moments: one well-orchestrated page load with staggered reveals
(animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors.
Layer CSS gradients, use geometric patterns, or add contextual effects that
match the overall aesthetic.

Avoid generic AI-generated aesthetics:
- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed
for the context. Vary between light and dark themes, different fonts, different
aesthetics. You still tend to converge on common choices (Space Grotesk, for
example) across generations. Avoid this: it is critical that you think outside
the box!
</frontend_aesthetics>
```

### Commit to a direction first (frontend-design Skill behavior)
Before any CSS, answer four questions and **declare a tone**:
**purpose · tone · constraints · differentiation.** Push tone toward an extreme:

> brutally minimal · maximalist chaos · retro-futuristic · organic/natural ·
> luxury/refined · playful/toy-like · editorial/magazine · brutalist/raw ·
> art deco/geometric · soft/pastel · industrial/utilitarian

### Distinctive font choices by context (instead of Inter)

| Context | Pick from |
|---|---|
| Code / technical aesthetic | JetBrains Mono, Fira Code |
| Editorial | Playfair Display, Crimson Pro, Fraunces, Newsreader |
| Startup / display | Clash Display, Satoshi, Cabinet Grotesk |
| Technical systems | IBM Plex family, Source Sans 3 |
| Distinctive | Bricolage Grotesque, Obviously |

---

## 8. Quotable Lines (for agents to reason with)

- "You're not getting design. You're getting the **median.**"
- "**High contrast = interesting.**"
- "**Dominant colors with sharp accents** outperform timid, evenly-distributed palettes."
- "One **well-orchestrated page load** beats scattered micro-interactions."
- "**Tell the model what to think about, not what to produce.**"
- "Restraint isn't a lack of ideas — it's an idea **strong enough to stand alone.**"
- "The choice: be an **author or just an operator.**"
- "Coherent **whole**, not a collection of parts."
- "Architecture that could come from anywhere **comes from nowhere.**"

---

## 9. Caveats (intellectual honesty)

- Conversion/engagement stats from marketing blogs ("91% lower conversion," "human copy
  wins 94.12% of the time") are **uncited marketing claims** — treat as directional, not fact.
- "AI can't do detail at 800% zoom" is a designer's *opinion/prediction*, not settled fact;
  model image fidelity is improving fast.
- The point is **not** that AI inherently makes slop. **Thoughtlessness** makes slop. AI
  used by someone with a point of view is a force multiplier; used with nothing supplied,
  it returns nothing — "dressed up nicely."
- Even purpose-built anti-slop tools fall into the trap: critics noted Claude Design's own
  marketing visuals drifting toward Inter/purple/three-cards — the gravity is real.

---

## Sources

- Prompting for frontend aesthetics — Claude Cookbook — https://platform.claude.com/cookbook/coding-prompting-for-frontend-aesthetics
- Improving frontend design through Skills — Claude — https://claude.com/blog/improving-frontend-design-through-skills
- Harness design for long-running application development — Anthropic Engineering — https://www.anthropic.com/engineering/harness-design-long-running-apps
- Frontend Design plugin — Anthropic — https://claude.com/plugins/frontend-design
- Why Your AI Keeps Building the Same Purple Gradient Website — prg.sh — https://prg.sh/ramblings/Why-Your-AI-Keeps-Building-the-Same-Purple-Gradient-Website
- AI Slop Web Design: Complete Guide to Spotting and Fixing Generic Websites (2026) — 925studios — https://www.925studios.co/blog/ai-slop-web-design-guide
- Claude Design produces AI slop unless you tell it not to — The Adpharm — https://www.theadpharm.com/insights/claude-design-without-the-ai-slop-look
- AI Slop vs. AI Art: The Difference Isn't the Tool — It's the Intent — Otaku Mayhem — https://otakumayhem.com/2026/01/11/ai-slop-vs-ai-art-the-difference-isnt-the-tool-its-the-intent/
- Design Trends 2026: Imperfection, Rebellion, and the Return of Human Work — Lindsay Marsh (Substack) — https://lindsaymarsh.substack.com/p/design-trends-2026-imperfection-rebellion
- What 2025 taught us about longevity, craft and restraint in design — Commercial Interior Design — https://www.commercialinteriordesign.com/people/what-2025-taught-us-about-longevity-craft-and-restraint-in-design
- The Design Shifts That Will Matter in 2026 — KOVA Collective — https://www.kovacollective.co/post/the-design-shifts-that-will-matter-in-2026
- AI slop — Wikipedia — https://en.wikipedia.org/wiki/AI_slop
- Why Slop Matters — Kommers et al. (MINT Lab, Indiana University), arXiv:2601.06060 — https://arxiv.org/abs/2601.06060
- Hallmark: Stop AI-Generated UI Slop in One Command — DEV Community — https://dev.to/rams901/hallmark-stop-ai-generated-ui-slop-in-one-command-in-2026-3p9n
- Teaching Claude to Design Better — Justin Wetch — https://www.justinwetch.com/blog/improvingclaudefrontend
