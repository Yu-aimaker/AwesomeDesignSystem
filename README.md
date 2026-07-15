<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDS — taste you can prove · the evidence-first design instrument for people and AI agents" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-18181B?style=flat-square)](./LICENSE)
[![Reference Atlas: 128](https://img.shields.io/badge/Reference_Atlas-128-C0472A?style=flat-square)](./content/references)
[![Canon rules: 47](https://img.shields.io/badge/canon_rules-47-18181B?style=flat-square)](./content/canon)
[![Components: 32](https://img.shields.io/badge/components-32-18181B?style=flat-square)](./packages/react)
[![Skills: 5](https://img.shields.io/badge/skills-5-18181B?style=flat-square)](#the-five-skills)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](#quick-start)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-18181B?style=flat-square)](./CONTRIBUTING.md)

**English** · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</div>

---

> **Taste you can prove. Avoid the median.**
>
> AwesomeDesignSystem is no longer “just Markdown + skills.” It is an **evidence-first design instrument** for people and AI agents: curated doctrine, a versioned evidence graph, executable tokens/components/motion, and a bilingual docs site — so every choice traces back to a first-party source instead of the generic “AI slop” median.
>
> Four navigation verbs organize everything: **Start** (the Canon and its principles) · **Explore** (the Reference Atlas, AI-design guidance, brand) · **Build** (foundations, components, motion, patterns, interaction) · **Verify** (review, status, playground). The production loop runs **Start → Build → Verify**; **Explore** is the reference layer you can open at any step. The site opens on a live _PROOF calibrator_: pick a design intent and watch it resolve to source → rule → artifact → verdict.

## The system, drawn

<img src="./assets/diagram-evidence-loop.svg" alt="AwesomeDS evidence loop: a canon rule links to a maintained reference, becomes an implementation artifact, is verified by tests, accessibility, and freshness checks, then feeds evidence back into the rule" width="100%">

<img src="./assets/diagram-canon-to-verify.svg" alt="AwesomeDS build path: canon rules branch into semantic tokens, components, and motion contracts, then converge at verification" width="100%">

## Why this exists

Ask an LLM to “build a landing page” and you rarely get _design_ — you get the **statistical median** of every Tailwind tutorial: Inter, purple-to-blue gradient, centered hero, three emoji cards. Models default to the center unless steered.

AwesomeDesignSystem supplies the steering in **four layers that stay linked**:

| Layer                 | What it is                                          | Where                    |
| --------------------- | --------------------------------------------------- | ------------------------ |
| **Doctrine**          | Opinionated, code-embedded design knowledge         | `design-system/`         |
| **Evidence**          | Structured, validated primary sources + canon rules | `content/`               |
| **Executable system** | Tokens, React baseline, motion, brand contracts     | `packages/`              |
| **Verbs**             | Progressive-disclosure agent skills                 | `skills/` + `install.sh` |

## What you get

| Outcome                       | How                                                                   |
| ----------------------------- | --------------------------------------------------------------------- |
| **Stop shipping AI slop**     | Taste principles, anti-median patterns, review skill                  |
| **Trace every claim**         | Reference Atlas → canon rules → artifacts → tests                     |
| **Ship accessible UI faster** | 32 React components with shared contracts + React Aria                |
| **Motion with intent**        | Recipe library honoring `prefers-reduced-motion`                      |
| **Brand as code**             | Product lexicon, voice rules, copy lint contracts                     |
| **Stay current**              | Freshness + link governance scripts and CI hooks                      |
| **Prove release readiness**   | Public Reports surface with security, a11y, performance, and QA gates |
| **Browse locally**            | Next.js docs site in **English / Japanese** (`/en/*`, `/ja/*`)        |

Current evidence graph (validated): **128 Reference Atlas records · 47 canon rules · 54 artifacts · 6 quarantined signals**.

## What's inside

```
design-system/     human-readable canon (philosophy, foundations, brand, AI UX, a11y…)
content/           machine graph: references / canon / artifacts / signals
packages/
  tokens/          semantic multi-theme OKLCH tokens + generators
  core/            framework-neutral utilities + design contracts
  react/           accessible React component baseline
  motion/          intent-based motion recipes
  brand/           brand manifest + Product Lexicon + copy lint
  content/         Zod schemas, graph loaders, validators
apps/docs/         local Next.js 16 docs + Reference Atlas + live previews
skills/            five portable agent skills
research/          primary-source research notes
docs/              architecture, maintenance, QA, completion audit
reports/           machine-readable readiness, freshness, link, and review evidence
scripts/           validate, freshness, evidence, link checks
```

<details>
<summary><b>Doctrine modules (design-system/)</b></summary>

- `00-philosophy/` — taste layer, modern 2026, anti-slop principles
- `foundations/` — color (OKLCH), typography (incl. Japanese), spacing, tokens, literacy
- `brand/` — brand systems, voice/tone, illustration, Duolingo-derived doctrine
- `platforms/apple-derived/` — Apple-derived product doctrine
- `case-studies/elite-systems/` — cross-system synthesis from elite design orgs
- `ai-driven/` — agent workflow, generative UI, evaluation
- `interaction/` — states/recovery, product quality, browser correctness
- `motion/` · `components/` · `patterns/` · `accessibility/` · `governance/`

</details>

## The five skills

|      | Skill              | Use it to…                                                          |
| :--: | ------------------ | ------------------------------------------------------------------- |
| `01` | **/AwesomeDS**     | Build or refine UI with the taste layer; load only needed modules   |
| `02` | **/MakeAwesomeDS** | Generate a product’s own DS (OKLCH tokens + `DESIGN.md` + previews) |
| `03` | **/AwesomeHTML**   | Turn Markdown / notes into a polished single-file HTML document     |
| `04` | **/AwesomeReview** | Audit UI/code for AI slop and a11y failures; prioritized fixes      |
| `05` | **/AwesomeMotion** | Design purpose-driven motion (Motion for React + CSS recipes)       |

## Quick start

### 1) AI agent — no install

> [!TIP]
> Point the agent at this repo. Have it read **[`DESIGN.md`](./DESIGN.md)** and **[`design-system/INDEX.md`](./design-system/INDEX.md)** first, then open only the modules the task needs. Prefer citing `rule.*` IDs and tracing claims to `ref.*` records under `content/`.

### 2) Claude Code skills

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # symlinks 5 skills into ~/.claude/skills (backs up priors)
```

Then: `/AwesomeDS` · `/MakeAwesomeDS` · `/AwesomeHTML` · `/AwesomeReview` · `/AwesomeMotion`

> [!NOTE]
> Symlinks mean `git pull` updates skills in place. Use `./install.sh --copy` for sandboxed setups.

### 3) Local monorepo + docs site

Requires **Node ≥ 22.13.0** and **pnpm 10.5.2**.

```bash
pnpm install
pnpm --filter @awesome-ds/docs dev   # http://127.0.0.1:3000  (EN/JA)
pnpm validate                        # evidence graph
pnpm test                            # unit suite
pnpm qa:core                         # lint + build + validate + tests
# pnpm qa:full                       # + Playwright (e2e / a11y / visual / no-JS)
```

See [`docs/architecture.md`](./docs/architecture.md), [`docs/maintenance.md`](./docs/maintenance.md), [`docs/completion-audit.md`](./docs/completion-audit.md), and [`docs/qa-report.md`](./docs/qa-report.md).

Public release evidence: [`/reports`](https://awesome-design-system.yumaker.studio/en/reports) · live graph/freshness: [`/status`](https://awesome-design-system.yumaker.studio/en/status)

## The standard, in one breath

> Avoid the median. Commit to a point of view. One dominant color **+** sharp accents. A deliberate typeface — never Inter-as-the-only-choice. Real hierarchy; one focal point per screen. Restraint **=** confidence. Motion communicates state, not decoration. Theme primitives; never ship raw defaults. Design error / empty / loading states. Meet WCAG 2.2 AA. A coherent **whole**, not a pile of parts.

## Design tokens — shared vocabulary

Semantic OKLCH tokens, multi-theme, generated for CSS / Tailwind-friendly use via `@awesome-ds/tokens`.

| Group      | Examples                                                                                               |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| **Color**  | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space**  | `--space-1` … `--space-32`                                                                             |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full`                                        |
| **Type**   | `--text-xs` … `--text-7xl` · `--font-display` · `--font-body` · `--font-mono`                          |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow`                                                |

Human-readable contract → [`design-system/foundations/tokens.md`](./design-system/foundations/tokens.md)

## Evidence & freshness

- **Reference Atlas** (`content/references/`): first-party systems (Apple, Material, Fluent, Polaris, Carbon, Primer, Spectrum, Atlassian, GOV.UK, Duolingo, Vercel, W3C, …) with medium, drift risk, and verification cadence
- **Canon rules** (`content/canon/`): transferable doctrine with bidirectional links to refs + artifacts
- **Signals** (`content/signals/`): emerging X/social notes — quarantined until promotion gates pass
- **Governance**: `pnpm check:links`, `pnpm check:freshness`, `pnpm evidence:check`

This is **not** a link dump. Sources are absorbed into doctrine and executable contracts, then kept honest by graph validation.

## Release reports & repository trust

AwesomeDS publishes a dated, machine-readable readiness snapshot instead of relying on green badges alone:

- [`reports/release-readiness.json`](./reports/release-readiness.json) — bounded SHIP/HOLD verdict, measured gates, and reproducible commands
- [`docs/qa-report.md`](./docs/qa-report.md) — browser, accessibility, security, performance, and package evidence
- [`docs/completion-audit.md`](./docs/completion-audit.md) — requirement-to-artifact mapping and honest boundaries
- [`SECURITY.md`](./SECURITY.md) — private vulnerability reporting and supported-version policy

CI pins dependency scanning, blocks visual-test bypasses, verifies evidence/link integrity, and keeps local agent state (`.claude/`, `.codex/`, `.tokensave/`) outside the public repository.

## Localization

- Docs UI: English + Japanese routes (`/en/*`, `/ja/*`), locale negotiation, hreflang + x-default
- Canon Markdown remains English-first; Japanese UI labels English fallback content when a translation is not yet reviewed
- Skills install and agent workflows stay language-agnostic

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bar: every claim is **sourced**, substance is **embedded**, skills stay **token-thrifty**, and nothing ships that fails the anti-AI-slop pre-flight.

## License

[MIT](./LICENSE) — free to use, adapt, and build on.

<div align="center"><sub>Built so AI can design with taste it can prove.</sub></div>
