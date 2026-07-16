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

**Tone.** *Playful precision.* Editorial enough to teach, bold enough to remember — like matrix.build's
narrative courage, Nothing's industrial restraint, and Duolingo's one personality across media.
White paper, CMY energy, dark ink. Never sterile, never hype-slop, never a logo wall.

**Constraints (non-negotiable).**
- White reading surface, dark ink. Never a dark hero. A dark panel may appear as one isolated,
  content-bounded data plane; it is deliberate, never the page. Light-first is the contract;
  `data-theme="dark"` is an opt-in accommodation, not a second identity.
- **CMY logomark** (cyan · magenta · yellow) + designed OKLCH **spectrum** as brand decoration.
  Interactive chrome uses a **deep magenta** `--color-accent` (AA on white). Status colors carry only status.
- Semantic tokens only; no raw hex/oklch in product UI (brand assets and the docs brand layer are the exception).
- WCAG 2.2 AA, visible `:focus-visible`, full keyboard paths, `prefers-reduced-motion` honored.
- Japanese-first typography is a first-class citizen, not a translation afterthought.
- Every doctrine claim links to maintained evidence (`rule.* → ref.*`). No unsourced authority.

**Differentiation.** Design references usually sell *aesthetics*. AwesomeDS ships *aesthetics with
receipts*: a freshness-tracked Reference Atlas, an evidence graph you can validate (`pnpm validate`),
executable components as the documentation, and a contract compact enough for an agent to obey.
The signature is the **CMY mark + spectrum**: taste you can open, run, and verify — with a little joy.

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

### 3.1 The CMY logomark (primary signature)
Three overlapping circles — **cyan `#15C7DE` · magenta `#FF2EA6` · yellow `#FFD400`** — in
subtractive mixing (`mix-blend-mode: multiply`). The 🎨 metaphor, drawn. It is the brand's
primary signature on the site header, README banner, OG image, and app icon.

**One geometry, three surfaces.** Ratios live in `apps/docs/lib/cmy-mark.ts`. The site renders
`<CmyMark>`, OG uses `computeCmyMark`, and `assets/banner.svg` hand-authors the same cluster.
`apps/docs/tests/cmy-mark-geometry.test.ts` locks the contract so the mark cannot silently drift.
A calm "breathe" motion is decorative only and halts under `prefers-reduced-motion`.

### 3.2 The OKLCH spectrum
An 8-stop hue-stepped spectrum (same lightness/chroma, designed — not a random rainbow) as the
signature underline and footer stripe. It appears on the banner, OG, and hero accent chips.

### 3.3 Soft CMY field
Faint cyan / magenta / yellow radial washes plus a hairline dot grid behind the LP hero —
energy without darkening the reading surface.

### 3.4 Registration labels
Monospace, uppercase, letter-spaced indices (`01 · COLOR`, `CANON → BUILD → VERIFY`). Coordinates
over adjectives. This is the Nothing lesson in our vocabulary.

### 3.5 Character (Dotto)
An original CMY mascot used on the LP and motion demos. Playful motion that still honors reduced
motion. Never third-party IP (no Duo assets).

### 3.6 Type pairing
- **Display / editorial:** Newsreader (serif) — the publication voice; big, tight, `text-wrap: balance`.
- **UI / body:** IBM Plex Sans — precise, neutral, engineered.
- **Mono / labels:** IBM Plex Mono — the instrument's readout.
- **Japanese:** Platform native Japanese UI faces with their own leading, tracking, and line-breaking.
  Latin-centric bans (em-dash/curly-quote rules) relax under JP.

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

### 3.7 Color signal — interaction accent
The CMY mark is the *identity*. Interactive chrome uses deep magenta
`--color-accent: oklch(0.50 0.22 350)` (docs brand layer) so UI chrome meets WCAG 2.2 AA on white.
Yellow and cyan decorate; they are not body text colors.

### 3.8 Misuse (forbidden)
- ✗ Random multi-hue decoration that is not the designed OKLCH spectrum.
- ✗ Magenta/cyan/yellow as large full-bleed backgrounds that kill contrast.
- ✗ Dark full-page hero, white-on-black reading surfaces.
- ✗ Decorative field over text (washes and grids stay *behind*, always faded).
- ✗ Registration labels used as body copy.
- ✗ Retired ember proof-mark geometry (`#C0472A` squares) on any AwesomeDS surface.

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

**Verbal character — who speaks:** a principal designer who keeps sources open — with Dotto as
optional joy on marketing surfaces, never as the voice of doctrine. We never say "revolutionary",
"magic", or "effortless", and never claim authority without a citation.

---

## 5. Motion personality

`MOTION_INTENSITY 6/10`. Movement is purposeful play, not decoration spam.
- One orchestrated entrance per page load; then stillness. (`ads-motion-enter`.)
- CMY orbs may **breathe slowly** (≥5s); Dotto may bob/wave; both halt under reduced motion.
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
