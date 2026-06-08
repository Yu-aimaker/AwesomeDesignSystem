---
title: "Reference Repos & Official Skills — Critical Analysis"
description: "AI-agent-first teardown of awesome-design-md, awesome-design-md-jp, taste-skill, and Anthropic's frontend-design skill. What each does, its gaps, and what AwesomeDesignSystem should borrow (いいとこ取り)."
audience: ai-agents
status: research
date: 2026-06-09
---

# Reference Repos & Official Skills — Critical Analysis

> Purpose: This file is read by AI agents building **AwesomeDesignSystem (ADS)**. It distills four prior-art sources so an agent can absorb the substance WITHOUT re-fetching. For each source: **what it is → what it does well → structure → gaps → what ADS should borrow.**

## TL;DR comparison

| Source | Type | Core artifact | Strength | Biggest gap | ADS borrows |
|---|---|---|---|---|---|
| **VoltAgent/awesome-design-md** | Curated corpus | `DESIGN.md` (9 sections) per site | Huge real-world token library; clean 9-section schema | Static, descriptive-only, no enforcement, no motion code | The 9-section `DESIGN.md` schema + preview.html pattern |
| **kzhrknt/awesome-design-md-jp** | JP fork/corpus | `DESIGN.md` + `AGENTS.md` | CJK typography rigor (禁則, palt, fallback chains) | Inherits parent's static/descriptive limits | The CJK typography subsection (3.1–3.8) as a first-class module |
| **Leonxlnx/taste-skill** | Agent skill bundle | `SKILL.md` + dials | Enforceable anti-slop rules, GSAP skeletons, Pre-Flight | Landing-page-only scope; opinionated bans may over-fit | Dials, em-dash ban, Pre-Flight checklist, design-system mapping table, GSAP skeletons |
| **anthropic/skills · frontend-design** | Official skill | ~40-line `SKILL.md` | Principle-based direction; names "AI slop"; forces aesthetic commitment | Intentionally minimal; no tokens, no enforcement, no code | The 4-question framework, "name the anti-pattern", "pick an extreme" philosophy |

**Synthesis thesis:** awesome-design-md gives ADS the *data schema*, taste-skill gives ADS the *enforcement engine*, frontend-design gives ADS the *philosophy/spine*, and the JP fork gives ADS *CJK correctness*. ADS = schema × enforcement × philosophy × i18n.

---

## 1. VoltAgent/awesome-design-md

### What it is
A curated repository of `DESIGN.md` files extracted from ~73 real public websites (MIT-licensed; ~88.5k GitHub stars as of mid-2026, ranked ~#150 globally). The pitch: *"Copy a DESIGN.md into your project, tell your AI agent 'build me a page that looks like this,' and generate high-quality UI that stays visually consistent."* The `DESIGN.md` concept itself originated with **Google Stitch** — a plain-text design-system document AI agents read to generate consistent UI. Markdown is chosen deliberately because "LLMs read best" — no Figma exports, JSON schemas, or special tooling required.

### What it does well
- **Real, copy-paste-ready tokens.** Each entry encodes actual public CSS values (hex, type scale, shadows) for recognizable brands (Stripe, Linear, Notion, Nike, Tesla, Apple, Supabase…). This is a goldmine of *grounded* reference, not generic advice.
- **A clean, stable 9-section schema** (the Stitch spec) that is consistent across all entries — predictable for agents to parse.
- **Visual verification artifacts.** Every site ships three files: `DESIGN.md`, `preview.html`, and `preview-dark.html` — a rendered catalog of swatches, type scale, buttons, and cards in light + dark. This lets a human (or vision model) sanity-check the tokens.
- **Categorized corpus** (AI/LLM platforms, Dev Tools/IDEs, Backend/DB/DevOps, Productivity/SaaS, Design/Creative, Fintech/Crypto, E-commerce, Media/Consumer, Automotive, Retro/Nostalgia) — easy to find a tonal neighbor.
- **Concrete style summaries** that read like art direction: Stripe = "signature purple gradients, weight-300 elegance"; Sanity = "dark-first editorial, 112px display type, IBM Plex Mono technical eyebrows, single coral-red accent"; Nike = "monochrome UI, massive uppercase Futura, full-bleed photography"; Tesla = "radical subtraction, cinematic full-viewport photography, Universal Sans."

### The 9-section DESIGN.md schema (verbatim section list)
1. **Visual Theme & Atmosphere** — mood and design philosophy
2. **Color Palette & Roles** — semantic names + hex + functional roles
3. **Typography Rules** — font families and hierarchy tables
4. **Component Stylings** — buttons, cards, inputs, navigation with states
5. **Layout Principles** — spacing scale, grid, whitespace philosophy
6. **Depth & Elevation** — shadow system and surface hierarchy
7. **Do's and Don'ts** — design guardrails and anti-patterns
8. **Responsive Behavior** — breakpoints, touch targets, collapsing strategy
9. **Agent Prompt Guide** — quick color reference + ready-to-use prompts

### Gaps / weaknesses (critical view)
- **Descriptive, not enforcing.** A `DESIGN.md` *describes* a look but contains no mechanism to stop an agent from producing slop. There is no Pre-Flight, no bans, no validation loop.
- **Static snapshots.** Tokens are scraped at a point in time and can drift from the live brand; "extracted design tokens represent publicly visible CSS values only" (maintainer disclaimer, "as is, without warranty").
- **No motion / interaction layer.** The schema covers color/type/spacing/elevation but has essentially nothing on animation choreography, easing curves, durations, or scroll behavior.
- **Imitation bias.** The whole model is "look like brand X," which structurally pushes toward *replication* rather than the *distinctive, original* direction Anthropic's skill demands. Copying Stripe's purple gradient is, ironically, close to AI-slop.
- **No accessibility contract.** Contrast ratios, focus states, reduced-motion, and WCAG targets are not part of the schema.
- **Western-only typography.** No CJK/RTL handling (the reason the JP fork exists).

### What ADS should borrow ("いいとこ取り")
- **Adopt the 9-section `DESIGN.md` schema as ADS's token-document format** — it is already an emerging de-facto standard agents recognize. Keep section headers in English for agent readability.
- **Keep the `preview.html` + `preview-dark.html` verification pattern** — generate a rendered catalog so tokens are visually auditable.
- **Reuse the categorization taxonomy** as ADS's tonal-family index.
- **But extend, don't copy:** add (a) a **Motion & Interaction** section, (b) an **Accessibility contract** section, and (c) a **Distinctiveness / anti-imitation** note so ADS docs steer toward original direction rather than brand cloning.

---

## 2. kzhrknt/awesome-design-md-jp

### What it is
A Japanese edition / fork-spirit of awesome-design-md: a curated repository of `DESIGN.md` files for **Japanese web services**, maintained alongside `AGENTS.md` files. It reportedly covers **~306 sites** across retail, SaaS, media, automotive, and heritage brands (MUJI, Mercari, SmartHR, freee, pixiv, Nintendo, etc.), each with its own `DESIGN.md` and `preview.html`.

### The gap it fixes
The README's thesis: the original covers Western services but *"lacks Japanese typography specifications entirely."* Stated bluntly: *"Without these specifications, AI agents produce Japanese UI with broken typography — wrong fonts, cramped line-height, and mishandled punctuation."* This is a real, observable failure mode for agents.

### What it does well — the six CJK additions
It isolates six typography areas absent from Western specs and bakes them into an **expanded Typography Rules section (subsections 3.1–3.8)**:

1. **Font fallback chains** — Japanese → Latin → generic family.
2. **Expanded line-height** — `1.5–2.0` for CJK body (vs Western `1.4–1.5`).
3. **Letter-spacing for body text** — `0.04–0.1em`.
4. **Kinsoku shori (禁則処理)** — line-break rules so punctuation/brackets never start or end a line incorrectly.
5. **OpenType features** — `palt`, `kern` for proportional Japanese composition.
6. **Mixed-script rules** — combining Japanese + Latin typefaces coherently.

Critically, it keeps **section headers in English "for AI agent readability"** while explanatory prose is Japanese — a smart bilingual convention ADS should mirror.

### Representative CJK token block (synthesized from the spec, copy-paste-ready)

```css
/* Japanese-first body type — ADS recommended baseline */
:root {
  --font-jp: "Hiragino Kaku Gothic ProN", "Hiragino Sans",
             "Noto Sans JP", "Yu Gothic", "Meiryo", sans-serif;
  --font-latin: "Inter", system-ui, sans-serif; /* paired, not default */
}
body {
  font-family: var(--font-jp);
  line-height: 1.75;          /* CJK comfort range 1.5–2.0 */
  letter-spacing: 0.04em;      /* 0.04–0.1em for JP body */
  font-feature-settings: "palt" 1, "kern" 1; /* proportional metrics */
  text-spacing-trim: trim-start; /* CSS Text 4 — JP punctuation kerning */
  line-break: strict;          /* enforce 禁則処理 */
  word-break: normal;
  overflow-wrap: anywhere;     /* avoid awkward CJK overflow */
}
/* Latin runs inside JP text get the paired Latin face */
:lang(en) { font-family: var(--font-latin); }
```

### Gaps / weaknesses
- **Inherits all of the parent's limits** — still descriptive-only, static, no enforcement, no motion layer, no a11y contract.
- **JP-only i18n.** Korean (`word-break: keep-all`), Chinese (SC/TC font stacks), Thai, and RTL (Arabic/Hebrew) are out of scope.
- **Vertical writing (`writing-mode: vertical-rl`, 縦書き)** and ruby (`<ruby>`/furigana) are not deeply specified despite being distinctly Japanese.
- **Font-licensing reality** (e.g. Noto vs commercial Morisawa/FONTPLUS) is not addressed, which matters for production.

### What ADS should borrow ("いいとこ取り")
- **Promote CJK typography to a first-class, reusable ADS module** (not a per-site afterthought): fallback chains, line-height range, letter-spacing range, `palt`/`kern`, `line-break: strict`, and `text-spacing-trim`.
- **Adopt the bilingual convention:** English section headers (agent-parseable) + localized prose.
- **Generalize beyond JP:** add `lang`-scoped recipes for `keep-all` (KO), SC/TC stacks (ZH), and RTL `dir` handling — ADS's differentiator is being *correctly multilingual*, not just JP.
- **Add the missing JP depth** the fork skips: ruby/furigana and `writing-mode` recipes.

---

## 3. Leonxlnx/taste-skill

### What it is
*"The Anti-Slop Frontend Framework for AI Agents."* A bundle of portable agent **skills** (each a `SKILL.md`) that upgrade AI-generated interfaces with stronger layout, typography, motion, and spacing instead of boilerplate. Installed via `npx skills add https://github.com/Leonxlnx/taste-skill`, which scans the `skills/` folder. It is explicitly scoped to **landing pages, portfolios, and redesigns — NOT dashboards or multi-step product UI.**

### Structure (the `skills/` inventory)
Implementation skills (folder names verbatim): `taste-skill` (v2, the default; internal frontmatter name `design-taste-frontend`), `taste-skill-v1` (legacy), `gpt-tasteskill` (GPT/Codex-tuned), `image-to-code-skill`, `redesign-skill`, `soft-skill` (high-end visual), `minimalist-skill`, `brutalist-skill`, `stitch-skill`, plus `output-skill` (full-output enforcement). Image-generation skills: `imagegen-frontend-web`, `imagegen-frontend-mobile`, `brandkit`. Each lives at `skills/<folder>/SKILL.md`. There is also a `research/` docs folder at the repo root.

### What it does well — this is the strongest *enforcement* model of the four

**The three dials (1–10), with conversational override; baseline `8 / 6 / 4`:**

| Dial | Low (1–3) | Mid (4–7) | High (8–10) |
|---|---|---|---|
| **DESIGN_VARIANCE** (layout asymmetry) | Symmetrical grids, centered | Offset overlaps, varied aspect ratios | Masonry, fractional grid units, massive whitespace zones |
| **MOTION_INTENSITY** (animation) | Static; hover/active only | Fluid CSS transitions, staggered load-ins | Scroll hijacks, parallax, GSAP ScrollTrigger choreography |
| **VISUAL_DENSITY** (info per viewport) | Art-gallery spacing (`py-32`–`py-48`) | Daily-app density (`py-16`–`py-24`) | Cockpit mode; tight padding, mono numbers |

**Mandatory pre-brief inference.** Before any code, the agent must state a one-line design read:
> "Reading this as: [page kind] for [audience], with a [vibe] language, leaning toward [design system or aesthetic family]."

**Design-system mapping table (honesty rule: use the official package if the brief matches; do NOT hand-recreate or override 90% of tokens; one system per project):**

| Brief reads as | Reach for |
|---|---|
| Microsoft/enterprise SaaS | `@fluentui/react-components` |
| Google/Material-flavored | `@material/web` + Material 3 tokens |
| IBM B2B analytics | `@carbon/react` + `@carbon/styles` |
| Shopify admin | Polaris web components |
| Atlassian/Jira | `@atlaskit/*` + `@atlaskit/tokens` |
| GitHub devtool/community | `@primer/css` / `@primer/react-brand` |
| UK public sector | `govuk-frontend` |
| US public sector | `uswds` |
| Modern SaaS (owned code) | `shadcn/ui` |
| Tailwind indie/AI marketing | Tailwind v4 utilities + `dark:` |

**The em-dash ban (signature rule, "9.G — non-negotiable").** The em-dash `—` is *"the #1 LLM design Tell"* and is forbidden in all visible text (headlines, eyebrows, pills, buttons, captions, nav, body, quotes, alt text). Only `-` (hyphen) and the math minus are allowed. A single `—`/`–` is a Pre-Flight failure.

**Other concrete anti-slop bans:**
- **Typography:** don't default to Inter (use Geist/Outfit/Cabinet Grotesk/Satoshi); serif banned as default; specifically banned serifs **Fraunces** and **Instrument_Serif**.
- **Premium-consumer palette ban:** the warm-beige + brass + oxblood + espresso cliché (e.g. bg `#f5f1ea`/`#f7f5f1`, accent `#b08947`/`#b6553a`, text `#1a1714`) is banned as default; rotate alternatives (cold luxury, forest, cobalt+cream, terracotta+slate…).
- **Visual:** no AI-purple gradients; no pure black (`#000`, use zinc-950); no neon glows; no three equal feature cards; no centered hero over dark mesh; no custom cursors; no infinite micro-animations.
- **Copy:** no "John Doe", no fake-perfect numbers (`99.99%`), no startup-slop names ("Acme/Nexus/SmartFlow"), no "Quietly trusted by", no version footers on marketing pages.

**Hard layout rules:** hero fits initial viewport (headline ≤2 lines, subtext ≤20 words, top padding ≤ `pt-24`); nav single-line ≤80px; a layout family appears **max once** per page (≥4 families across 8 sections); zigzag alternation capped at 2 consecutive; eyebrow restraint `≤ ceil(sectionCount/3)` (mechanical `uppercase tracking` count).

**Canonical GSAP skeletons** (Sticky-Stack, Horizontal-Pan) and a lighter **Motion** reveal-stagger — all reduced-motion-guarded:

```tsx
// Scroll-reveal stagger (Motion, not GSAP) — reduced-motion safe
"use client";
import { motion, useReducedMotion } from "motion/react";

export function RevealStagger({ items }: { items: string[] }) {
  const reduce = useReducedMotion();
  return (
    <ul className="grid gap-6">
      {items.map((item, i) => (
        <motion.li
          key={item}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  );
}
```

GSAP rule of thumb: `start: "top top"`, `pin: true`, last card unpinned, scrub-driven; never `window.addEventListener('scroll')` — use `useScroll()` / ScrollTrigger / IntersectionObserver. Viewport stability: `min-h-[100dvh]`, never `h-screen`.

**A long, mechanical Pre-Flight checklist** gates ship: brief declared, dials reasoned, zero em-dashes, one theme, one accent, one radius system, WCAG AA on buttons/forms, hero discipline, eyebrow count check, motion justified per-sentence, reduced-motion wrapped for `MOTION_INTENSITY > 3`, Core Web Vitals plausibly hit (LCP < 2.5s, INP < 200ms, CLS < 0.1).

### Gaps / weaknesses
- **Scope-limited:** explicitly *not* for dashboards/product UI — yet much real frontend work is exactly that. ADS must cover both.
- **Over-fitting risk:** some bans are highly specific (banned hex lists, "no decorative dots") and can read as one author's taste hardened into law. Useful as defaults, dangerous as absolutes.
- **Heavy and prescriptive:** the v2 `SKILL.md` is very long; smaller models may not honor every rule. The bans need to be *tiered* (hard fail vs soft nudge).
- **English-copy-centric:** the em-dash ban and copy rules assume Latin text; no CJK equivalent (a JP design legitimately uses `—`/`、`/`。` and full-width punctuation).
- **Marketing-page motion bias:** GSAP scroll choreography is wrong for data-dense app UI.

### What ADS should borrow ("いいとこ取り")
- **Adopt the dials** (`DESIGN_VARIANCE` / `MOTION_INTENSITY` / `VISUAL_DENSITY`, 1–10, conversational override) as ADS's single most useful control surface — but add a 4th dial like **`SURFACE`** (light/dark/auto) or **`A11Y_STRICTNESS`**.
- **Adopt the Pre-Flight checklist concept** as ADS's ship gate, split into **hard fails** (a11y, contrast, one-system) vs **soft nudges** (taste bans).
- **Adopt the design-system mapping table + honesty rule** verbatim — it stops agents hand-rolling Carbon/Fluent.
- **Adopt the GSAP/Motion skeletons** and the reduced-motion discipline as ADS's motion module.
- **Adopt the em-dash/Inter/AI-purple bans as *defaults*** — but make them **locale-aware** (relax punctuation rules under `lang="ja"`/CJK) and **overridable** with a stated reason.

---

## 4. Anthropic official "frontend-design" Claude skill

### What it is
An official Anthropic skill (in `anthropics/skills`, also shipped as a Claude Code plugin). Frontmatter: **name** `frontend-design`, **description** *"Create distinctive, production-grade frontend interfaces with high design quality."* It is famously **~40 lines of markdown — a single `SKILL.md`** (no model, no vision component), and one of the most-installed Claude skills (reported 277k+ installs as of Mar 2026; marketplace listings showed it climbing past ~490k by mid-2026 — figures vary by source and date). Install: `npx skills add https://github.com/anthropics/skills --skill frontend-design`.

### The philosophy (why it punches above its size)
- **Name the anti-pattern.** The skill explicitly tells the model to avoid generic **"AI slop."** The prompt-engineering insight: LLMs trained on the median of the internet regress to the median when told "make it modern"; saying *"avoid AI slop"* pushes output *away from the gravitational center of training data*. Named offenders: overused fonts, cliché color schemes (purple gradients), predictable layouts, cookie-cutter design.
- **Declare your hand before any code.** It forces a **four-question framework** and demands an actual aesthetic commitment before a single CSS rule:
  1. **Purpose** — "What problem does this interface solve? Who uses it?"
  2. **Tone** — pick an *extreme* aesthetic direction.
  3. **Constraints** — framework, performance, accessibility.
  4. **Differentiation** — "What makes this UNFORGETTABLE? What's the one thing someone will remember?"
- **Pick an extreme.** The tone list: *brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian* — "use these for inspiration but design one true to the aesthetic direction." Crucially: *"Bold maximalism and refined minimalism both work — the key is intentionality, not intensity."*

### The aesthetic guidance (verbatim-ish)
- **Typography (highest leverage):** *"Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter"* — pair a distinctive display font with a refined body font. (Practitioner gloss: one distinctive font choice is worth ten layout tweaks.)
- **Color & theme:** *"Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes."*
- **Motion:** *"one well-orchestrated page load with staggered reveals (animation-delay)"* beats scattered micro-interactions.
- **Spatial composition:** *"Unexpected layouts. Asymmetry. Overlap. Diagonal flow."* — grid-breaking elements, generous negative space OR controlled density.
- **Match complexity to vision:** *"Maximalist designs need elaborate code with extensive animations… minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well."*
- **Closing encouragement:** *"Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision."*

### The deeper principle
**Principle-based direction beats both rigid specs and total openness.** The sweet spot: *tell the model what to think about, not what to produce.* The skill works because it makes the agent's taste stop fighting the model's training-data center of gravity on every prompt.

### Gaps / weaknesses
- **Intentionally minimal.** No tokens, no values, no code, no a11y checklist, no enforcement loop. It sets *direction* but provides zero *substance* — an agent still has to invent every hex and curve.
- **No verification.** Unlike taste-skill, there is no Pre-Flight; "distinctive" is unmeasured, so a weak model can still produce slop while believing it followed the rules.
- **Western/Latin assumption.** "Avoid Inter; pick a distinctive display font" has no CJK story.
- **Can over-rotate to spectacle.** "Pick an extreme / don't hold back" is great for marketing/portfolio, risky for utilitarian product UI where restraint and convention are the right call (the skill does hedge with "intentionality, not intensity," but agents skim).

### What ADS should borrow ("いいとこ取り")
- **Adopt the spine:** the **4-question framework** and the **"name the anti-pattern (AI slop)"** mechanism are ADS's philosophical core. Put them at the *top* of every ADS skill.
- **Adopt "pick an extreme / commit fully"** and the tone vocabulary as ADS's aesthetic-direction selector — wire it to taste-skill's `DESIGN_VARIANCE` dial.
- **Adopt "principle-based direction > rigid spec"** as ADS's authoring rule: lead with principles, *then* provide tokens/enforcement as scaffolding, not as a cage.
- **Fuse with substance:** ADS's advantage is pairing this philosophy with awesome-design-md's concrete tokens and taste-skill's enforcement — direction + values + a ship gate.

---

## 5. Synthesis — the ADS "いいとこ取り" blueprint

ADS should be the **union** of all four, with the weaknesses of each cancelled by the strengths of another:

| Layer | Source it comes from | What ADS does with it |
|---|---|---|
| **Philosophy / spine** | Anthropic frontend-design | Lead every skill with the 4-question framework + "avoid AI slop"; "pick an extreme, commit fully"; principle-based direction. |
| **Token document schema** | awesome-design-md | The 9-section `DESIGN.md` + `preview.html`/`preview-dark.html` verification, extended with **Motion**, **Accessibility**, and **Distinctiveness** sections. |
| **Enforcement engine** | taste-skill | Dials (1–10) + tiered Pre-Flight (hard fail vs soft nudge) + design-system mapping/honesty rule + GSAP/Motion skeletons. |
| **i18n correctness** | awesome-design-md-jp | First-class CJK module (fallback chains, `1.5–2.0` line-height, `palt`/`kern`, `line-break: strict`, `text-spacing-trim`), generalized to KO/ZH/RTL + ruby/縦書き. |

### Concrete differentiators ADS must add (none of the four have all of these)
1. **Locale-aware bans.** The em-dash/punctuation bans relax under CJK; the "avoid Inter" rule maps to locale-appropriate display+body pairs (Latin + JP/KO/ZH faces).
2. **Tiered enforcement.** Accessibility/contrast/one-system = **hard fail**; taste bans = **soft nudge, overridable with a stated reason** (avoids the over-fitting trap).
3. **Beyond landing pages.** Cover product/dashboard UI (where taste-skill explicitly stops) by mapping VISUAL_DENSITY-high to official systems (Carbon/Fluent) rather than GSAP spectacle.
4. **Direction + values + gate in one loop.** frontend-design has direction but no values; awesome-design-md has values but no gate; taste-skill has a gate but narrow scope. ADS chains all three: *infer brief → declare direction → emit tokens → build → Pre-Flight.*
5. **Bilingual authoring convention** (English headers + localized prose) borrowed from the JP fork, applied across all ADS docs and skills.

### One-paragraph mandate for an ADS-building agent
> Read the brief and declare a one-line design read (taste-skill). State Purpose/Tone/Constraints/Differentiation and pick an *extreme*, committing fully (frontend-design). Emit a 9-section `DESIGN.md` with real tokens plus Motion + A11y + Distinctiveness sections, and a `preview.html`/`preview-dark.html` (awesome-design-md). If the locale is CJK/RTL, apply the i18n typography module (awesome-design-md-jp). Build with the matched official design system or Tailwind v4, using reduced-motion-guarded Motion/GSAP skeletons. Before ship, run the tiered Pre-Flight: hard-fail on a11y/contrast/one-system, soft-nudge on taste bans (locale-aware, overridable with reason).

---

## Sources
- Awesome DESIGN.md (VoltAgent/awesome-design-md) README — https://github.com/VoltAgent/awesome-design-md
- awesome-design-md README (raw) — https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/README.md
- Google Stitch (origin of the DESIGN.md concept) — https://stitch.withgoogle.com/
- Awesome Design MD JP (kzhrknt/awesome-design-md-jp) — https://github.com/kzhrknt/awesome-design-md-jp
- awesome-design-md-jp README (raw) — https://raw.githubusercontent.com/kzhrknt/awesome-design-md-jp/main/README.md
- Taste Skill (Leonxlnx/taste-skill) — https://github.com/Leonxlnx/taste-skill
- taste-skill design-taste-frontend SKILL.md (raw) — https://raw.githubusercontent.com/Leonxlnx/taste-skill/main/skills/taste-skill/SKILL.md
- Anthropic Skills — frontend-design SKILL.md — https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- frontend-design SKILL.md (raw) — https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md
- Claude Code frontend-design plugin SKILL.md — https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
- "Why Anthropic's frontend-design Skill Just Works — A Prompt Engineering Breakdown" (Ahmed Soliman, Apr 2026) — https://medium.com/@ahmed.soliman/why-anthropics-frontend-design-skill-just-works-a-prompt-engineering-breakdown-72a1386df114
- "Anthropic Skills Marketplace: The Anti AI-Slop UI Design Skill" (Nick Porter) — https://medium.com/@porter.nicholas/anthropic-skills-marketplace-the-anti-ai-slop-ui-design-skill-a572d0cfef4f
- "How to Use the Claude Code Frontend-Design Plugin to Stop Shipping AI Slop" (Thomas Wiegold) — https://thomas-wiegold.com/blog/claude-code-frontend-design-plugin/
- CSS Text Module Level 4 — text-spacing-trim (CJK punctuation) — https://www.w3.org/TR/css-text-4/
- Tailwind CSS v4 announcement — https://tailwindcss.com/blog/tailwindcss-v4
- frontend-design install count (marketplace listing) — https://claudemarketplaces.com/skills/anthropics/skills/frontend-design
