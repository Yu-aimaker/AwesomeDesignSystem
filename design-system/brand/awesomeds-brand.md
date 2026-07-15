---
title: "AwesomeDS — Brand Design System (the bible)"
updated: 2026-07-16
status: canonical
sources: [ref.matrix.build, ref.duolingo.design, ref.nothing.design, ref.apple.hig, ref.vercel.web-interface-guidelines, ref.w3c.wcag-22]
influences: "matrix.build (narrative sequencing) · Duolingo (one personality across media) · Nothing Technology (industrial grid + restraint) — sublimated, never copied"
---

# AwesomeDS — Brand Design System

> This is AwesomeDS's own brand, defined with the same rigor the platform demands of every
> product it helps build. It is the single source of truth for how AwesomeDS **looks, sounds,
> and behaves** across the site, README imagery, `assets/banner.svg`, OG images, diagrams,
> tokens, components, motion, copy, and the distributed skills. Load this before any brand-facing
> work, alongside [`cross-medium-coherence.md`](./cross-medium-coherence.md).

We studied three elite systems and **sublimated** — did not imitate — them:

- **matrix.build** → narrative sequencing and the courage to be an *experiment* with a thesis.
- **Duolingo** → one declared personality that survives intact into words, shape, color, and motion.
- **Nothing Technology** → industrial typographic confidence, a visible grid, and playful precision.

None of their assets, palettes, or marks are reused. What we take is *method*, expressed as
AwesomeDS's own **evidence-first · agent-readable · Japanese-first** identity.

---

## 1. Brand contract (Purpose · Tone · Constraints · Differentiation)

**Purpose.** Make design taste *provable*. AwesomeDS turns first-party design knowledge into a
living Canon, semantic tokens, accessible components, motion contracts, and instructions that
**both people and AI agents** can verify — so a good decision can always be traced to a source.

**Tone.** *Confident instrument.* Editorial and calm like a well-set publication; engineered and
exact like measurement equipment. Never cute, never hype, never a logo wall. We show the reading,
not the applause.

**Constraints (non-negotiable).**
- White reading surface, dark ink. A dark instrument panel may appear as one isolated,
  content-bounded data plane in a long page; it is deliberate, never the hero, and never the page.
  This is the brand's *default* surface and the one every marketing/hero/README/OG surface uses.
  The site's `data-theme="dark"` is **not** a second brand look: it is an explicit, user-opted
  accommodation (a preference/accessibility choice, defaulting to light and set only via the theme
  control), governed by the same semantic tokens. Light-first is the contract; dark is an opt-in
  rendering of it, never the authored first impression. High-contrast is likewise an accommodation,
  not a separate identity.
- One authored interaction color (the ember **signal**). Status colors carry only status.
- Semantic tokens only; no raw hex/oklch in product UI.
- WCAG 2.2 AA, visible `:focus-visible`, full keyboard paths, `prefers-reduced-motion` honored.
- Japanese-first typography is a first-class citizen, not a translation afterthought.
- Every doctrine claim links to maintained evidence (`rule.* → ref.*`). No unsourced authority.

**Differentiation.** Design references usually sell *aesthetics*. AwesomeDS ships *aesthetics with
receipts*: a freshness-tracked Reference Atlas, an evidence graph you can validate (`pnpm validate`),
executable components as the documentation, and a contract compact enough for an agent to obey.
The signature is the **proof mark**: taste that points back at its evidence.

---

## 2. Personality

| | |
|---|---|
| **Traits (3–5 verbs)** | *measures, clarifies, proves, composes, restrains* |
| **Emotional range** | quietly assured → precise → occasionally wry (in mono asides), never loud |
| **Anti-personas** | the hype deck, the mood-board with no rules, the "AI slop" gradient-blob generator, the logo wall |

AwesomeDS behaves like a **principal designer who keeps their sources open on the desk** — and a
**laboratory instrument** that reports honest readings even when the reading is "needs review".

---

## 3. Signature visual grammar

The grammar is what makes an AwesomeDS surface recognizable in one glance, independent of content.
It is implemented in `apps/docs/app/globals.css`, `assets/banner.svg`, and `app/opengraph-image.tsx`.

### 3.1 The proof mark (primary signature)
A small **ember square** (the `--color-accent` signal) paired with a knocked-out registration
square — a target/registration glyph meaning *"this is verified; here is where it points."* It
appears as: the eyebrow tick before every section label, the wordmark accent, the banner/OG mark.
- Rule: **one dominant ember signal per hierarchy level** — never a second, competing accent hue.
  The *same* ember signal may recur as several marks (the registration bar, the proof mark, the
  wordmark tick, the measured ruler) **only when they read as one coherent registration system**,
  not as scattered decoration. So the banner's ember bar + proof mark + underline + ruler are on
  contract (one signal, one registration system); a second accent, or ember spread as ornament,
  is not. Ember never becomes a large fill field.

**One geometry, three surfaces.** The mark's proportions are defined once, as ratios of the shared
square side, in `apps/docs/lib/proof-mark.ts` (`gap = ¼·side`, `stroke = 1⁄12·side`, `knockout =
½·side`, centered). The site header renders it via the shared `<ProofMark>` React component, the
Open Graph image (`app/opengraph-image.tsx`) computes the same geometry through `computeProofMark`,
and the static `assets/banner.svg` reproduces it by hand at the canonical unit (side 36 → gap 9,
stroke 3, knockout 18). `apps/docs/tests/proof-mark-geometry.test.ts` asserts the static banner and
the OG source stay locked to that spec, so the signature can never silently drift between media.
The eyebrow tick is the mark's reduced form (ember square only). Ink and ember map to `--color-fg`
and `--color-accent`, so the mark tracks the active theme and survives `forced-colors` as a signal.

### 3.2 The blueprint plane
A faint hairline **dot field** (`--color-border` dots on `--color-bg`), faded out toward content.
It signals "measuring surface" without darkening the reading area. Used behind the hero.

### 3.3 Registration / instrument labels
Monospace, uppercase, letter-spaced labels rendered as engineered indices:
`[ DS · CANON→BUILD→EVIDENCE ]`, `x1200 · y630 · v2026.07`, `01 · COLOR`. Coordinates over
adjectives. This is the Nothing lesson expressed in our own vocabulary.

### 3.4 The live-instrument bar
A 2px ember segment on the top-left edge of "instrument" surfaces (the evidence instrument),
reading as a *powered / verifying* indicator.

### 3.5 Type pairing
- **Display / editorial:** Newsreader (serif) — the publication voice; big, tight, `text-wrap: balance`.
- **UI / body:** IBM Plex Sans — precise, neutral, engineered.
- **Mono / labels:** IBM Plex Mono — the instrument's readout.
- **Japanese:** Noto Sans JP with its own leading, tracking, and line-breaking (`<wbr>` per phrase,
  heavier weight, looser line-height). Latin-centric bans (em-dash/curly-quote rules) relax under JP.
- **Locale-invariant signature word:** `PROVE.` stays Latin in the Japanese hero as a compact
  product mark, paired with a Japanese lead sentence and Japanese-first body rhythm. It is not a
  translation fallback; if the lead or supporting copy disappears, the invariant word must not stand alone.

The generated Open Graph image uses Georgia/Arial as an explicit Satori rendering fallback. Variable
Newsreader/Plex webfonts remain canonical for browser and SVG surfaces; OG preserves their editorial/UI
role contrast, spacing, proof mark, grid, and ember signal without adding duplicate font payloads.

### 3.6 Color signal — the ember
| Role | Light | Meaning |
|---|---|---|
| `--color-accent` | `oklch(0.522 0.166 43)` | the single interaction + proof signal (AA 5.9:1 on white) |
| `--color-accent` (dark) | `oklch(0.735 0.160 48)` | ember glows on the bounded dark plane |
| status | success/warning/danger | *only* status — never borrowed for emphasis |

The former purple (hue 264) was retired: it violated the system's own "no purple-on-white"
non-negotiable and read as generic. Ember is authored, warm, and legible as "signal / verified".

### 3.7 Misuse (forbidden)
- ✗ Rainbow / spectrum decoration (the old banner) — replaced by one measured ember ruler.
- ✗ Ember as a large background fill, or two accents competing.
- ✗ Dark full-page hero, white-on-black reading surfaces.
- ✗ Decorative dot-grid over text (it is a *plane behind*, always faded).
- ✗ Registration labels used as body copy.

---

## 4. Voice & tone

**Voice qualities (always true):** *precise, sourced, plain, unhurried.* We name the rule, show the
example, cite the evidence, and stop. We prefer verbs to adjectives and readings to claims.

**Tone matrix (context-dependent):**

| Context | Tone | Example |
|---|---|---|
| Marketing / hero | assured, editorial | "Taste you can prove." |
| Onboarding | guiding, concrete | "Read the Canon to decide. Compose to build. Trace to prove." |
| Success | quiet confirmation | "Evidence connected — this pattern cites canonical rules." |
| Empty | orienting, no dead end | "No sources yet. Add one to `content/references/` to begin the trail." |
| Error / needs-review | honest, actionable | "Evidence graph needs review — 2 rules lack a linked source." |
| Agent instruction | imperative, compact | "Read DESIGN.md → cite `rule.*` → compose `@awesome-ds/react` → verify states + a11y + evidence." |

**Verbal character — who speaks:** the *instrument*, not a mascot. It reports; it does not sell.
It never says "revolutionary", "magic", "effortless", or claims authority without a citation.

---

## 5. Motion personality

`MOTION_INTENSITY 6/10`. Movement is a *readout*, not a performance.
- One orchestrated entrance per page load; then stillness. (`ads-motion-enter`.)
- Ember marks may **pulse slowly** (calm "powered" breathing, ≥4s), never flash.
- Enter/feedback/reveal recipes are purpose-declared (`@awesome-ds/motion`); each states where it
  does *not* belong and its reduced-motion replacement.
- `prefers-reduced-motion: reduce` → all decorative motion halts; state changes remain instant.
- Animate `transform`/`opacity` only. Never `transition: all`.
- **One controlled surprise (functional, not confetti).** The Proof Calibrator's verdict "acquires
  the target": on each intent selection the ember registers onto the target square as a completion
  cue that the evidence trace fully resolved (`source → rule → artifact → verdict`). It is feedback,
  not ornament — it fires only on a real state change, carries the verdict as its accessible label,
  halts under `prefers-reduced-motion` (shown pre-registered), and maps to system colors under
  `forced-colors`. Playfulness lives *inside* the instrument metaphor; it never becomes a mascot.

---

## 5A. Proof-grammar diagrams (reusable explainers)

Two canonical diagrams state the method as a picture. They are authored **once** as static SVGs so
the site and the README render the exact same file — no redraw, no drift:

- `assets/diagram-evidence-loop.svg` — the evidence loop: `rule.* → ref.* → artifact → verify`, with
  a single ember return path closing the loop (every rule is re-checked against its evidence).
- `assets/diagram-canon-to-verify.svg` — the build path: `Canon → tokens · components · motion →
  verify`, fanning one rule into the bounded set of executable artifacts, then converging on a
  checked, shippable interface.

Both obey the §3 grammar (white plane, one ember signal, registration labels) and each carries an
accessible name in `<title>` plus a long description in `<desc>` (`aria-labelledby`) for the README
and any external embed. On the site, `ProofDiagram` renders them **responsively**: the wide SVG at
desktop widths, and a localized, stacked HTML representation on narrow viewports — so the diagram
stays readable at 320–390px without shrinking 960px text to 4px or overflowing the page. The stacked
stations stay in the accessibility tree at every breakpoint (visually hidden on desktop), carrying
the localized description to screen readers; the inlined SVG is decorative there. The README embeds
the same wide SVG files.

## 5B. Brand layers & ownership boundary

The brand exists in two layers with a hard boundary — keep changes on the correct side:

- **Docs-only brand layer** (this repo's `apps/docs/**` + `assets/**` + this bible): the site
  surfaces, the `<ProofMark>`/`ProofDiagram` components, `app/opengraph-image.tsx`, `assets/*.svg`,
  and the copy/voice. These express *how AwesomeDS presents itself*. They may reference tokens but
  must not fork them.
- **Framework packages** (`packages/tokens`, `@awesome-ds/react`, `@awesome-ds/motion`): the
  *portable contract* every consuming product uses. These are brand-neutral primitives — they carry
  no proof mark, no ember-as-identity, no AwesomeDS wordmark. The ember is defined here only as the
  semantic `--color-accent` role, so a consumer re-themes it without touching component logic.

Rule of thumb: the proof mark, wordmark, blueprint plane, diagrams, and OG belong to the docs layer;
the token names, component APIs, and motion recipe contracts belong to the packages. Never bake an
AwesomeDS-specific mark or ember hue into a framework package (see SKILL.md: *"do not impose
AwesomeDS's proof-mark/ember identity on third-party brands"*).

## 5C. Locale-aware brand surface (bilingual by intent)

The brand is **Japanese-first**, and `/brand` is authored bilingually on purpose, not by fallback:
the brand contract (Purpose · Tone · Constraints · Differentiation), the personality, and the
proof-grammar captions read natively in English **and** 日本語 from the dictionary. Only the deep
source module (the full Markdown of this bible) remains in canonical English until translated, and
its notice says exactly that — scoped to the module, not stamped over the whole page. The invariant
signature word `PROVE.` stays Latin in both locales as the product mark, but never stands alone: a
localized lead and body always carry it. Locale-invariant ≠ untranslated.

---

## 6. Cross-medium coherence checklist (ship gate)

A surface is "on brand" only if all hold:

- [ ] White reading surface; any dark instrument panel is isolated, content-bounded, and intentional.
- [ ] One dominant ember signal per hierarchy level (the same signal may recur only as one coherent registration system, never a second accent); status colors used only for status.
- [ ] Proof mark or registration label present as the section signature.
- [ ] Newsreader display + Plex Sans UI + Plex Mono labels; JP typography rules applied under `:lang(ja)`.
- [ ] Semantic tokens only; validated by `pnpm validate` where content is involved.
- [ ] WCAG 2.2 AA, focus-visible, keyboard, reduced-motion, mobile ≥44px targets.
- [ ] Copy passes voice/tone; no hype, no unsourced authority; agent-readable where relevant.
- [ ] Banner / OG / diagrams reuse §3 grammar (no rainbow, no stock gradient).

## Linked rules
- `rule.brand.personality-system`
- `rule.brand.cross-medium-coherence`
- `rule.brand.content-design`
- `rule.foundations.semantic-tokens`
- `rule.governance.evidence-first`
