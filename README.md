<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — the taste layer for AI agents" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Reference Atlas: 105](https://img.shields.io/badge/Reference_Atlas-105-E5484D?style=flat-square)](./content/references)
[![Canon rules: 42](https://img.shields.io/badge/canon_rules-42-7C5CFC?style=flat-square)](./content/canon)
[![Components: 32](https://img.shields.io/badge/components-32-D6409F?style=flat-square)](./packages/react)
[![Skills: 5](https://img.shields.io/badge/skills-5-46C26B?style=flat-square)](#-the-five-skills)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](#-quick-start)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-1FB8B8?style=flat-square)](./CONTRIBUTING.md)

**English** · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</div>

---

> **Avoid the median. Commit to a point of view.**  
> AwesomeDesignSystem is no longer “just Markdown + skills.” It is an **AI-agent-first design platform**: curated doctrine, a versioned evidence graph, executable tokens/components/motion, and a bilingual local docs site — so agents ship modern (2026), human-feeling UI instead of generic “AI slop.”

## 🧭 Why this exists

Ask an LLM to “build a landing page” and you rarely get *design* — you get the **statistical median** of every Tailwind tutorial: Inter, purple-to-blue gradient, centered hero, three emoji cards. Models default to the center unless steered.

AwesomeDesignSystem supplies the steering in **four layers that stay linked**:

| Layer | What it is | Where |
| --- | --- | --- |
| **Doctrine** | Opinionated, code-embedded design knowledge | `design-system/` |
| **Evidence** | Structured, validated primary sources + canon rules | `content/` |
| **Executable system** | Tokens, React baseline, motion, brand contracts | `packages/` |
| **Verbs** | Progressive-disclosure agent skills | `skills/` + `install.sh` |

## 🎁 What you get

| Outcome | How |
| --- | --- |
| **Stop shipping AI slop** | Taste principles, anti-median patterns, review skill |
| **Trace every claim** | Reference Atlas → canon rules → artifacts → tests |
| **Ship accessible UI faster** | 32 React components with shared contracts + React Aria |
| **Motion with intent** | Recipe library honoring `prefers-reduced-motion` |
| **Brand as code** | Product lexicon, voice rules, copy lint contracts |
| **Stay current** | Freshness + link governance scripts and CI hooks |
| **Browse locally** | Next.js docs site in **English / Japanese** (`/en/*`, `/ja/*`) |

Current evidence graph (validated): **105 Reference Atlas records · 42 canon rules · 54 artifacts · 6 quarantined signals**.

## 📂 What's inside

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

## 🛠️ The five skills

|  | Skill | Use it to… |
| :-: | --- | --- |
| 🎨 | **/AwesomeDS** | Build or refine UI with the taste layer; load only needed modules |
| 🏗️ | **/MakeAwesomeDS** | Generate a product’s own DS (OKLCH tokens + `DESIGN.md` + previews) |
| 📄 | **/AwesomeHTML** | Turn Markdown / notes into a polished single-file HTML document |
| 🔍 | **/AwesomeReview** | Audit UI/code for AI slop and a11y failures; prioritized fixes |
| ✨ | **/AwesomeMotion** | Design purpose-driven motion (Motion for React + CSS recipes) |

## 🚀 Quick start

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

Requires **Node ≥ 22.12** and **pnpm 10.5.2**.

```bash
pnpm install
pnpm --filter @awesome-ds/docs dev   # http://127.0.0.1:3000  (EN/JA)
pnpm validate                        # evidence graph
pnpm test                            # unit suite
pnpm qa:core                         # lint + build + validate + tests
# pnpm qa:full                       # + Playwright (e2e / a11y / visual / no-JS)
```

See [`docs/architecture.md`](./docs/architecture.md), [`docs/maintenance.md`](./docs/maintenance.md), [`docs/completion-audit.md`](./docs/completion-audit.md), and [`docs/qa-report.md`](./docs/qa-report.md).

## 📐 The standard, in one breath

> Avoid the median. Commit to a point of view. One dominant color **+** sharp accents. A deliberate typeface — never Inter-as-the-only-choice. Real hierarchy; one focal point per screen. Restraint **=** confidence. Motion communicates state, not decoration. Theme primitives; never ship raw defaults. Design error / empty / loading states. Meet WCAG 2.2 AA. A coherent **whole**, not a pile of parts.

## 🎨 Design tokens — shared vocabulary

Semantic OKLCH tokens, multi-theme, generated for CSS / Tailwind-friendly use via `@awesome-ds/tokens`.

| Group | Examples |
| --- | --- |
| **Color** | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space** | `--space-1` … `--space-32` |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full` |
| **Type** | `--text-xs` … `--text-7xl` · `--font-display` · `--font-body` · `--font-mono` |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow` |

Human-readable contract → [`design-system/foundations/tokens.md`](./design-system/foundations/tokens.md)

## 🔬 Evidence & freshness

- **Reference Atlas** (`content/references/`): first-party systems (Apple, Material, Fluent, Polaris, Carbon, Primer, Spectrum, Atlassian, GOV.UK, Duolingo, Vercel, W3C, …) with medium, drift risk, and verification cadence  
- **Canon rules** (`content/canon/`): transferable doctrine with bidirectional links to refs + artifacts  
- **Signals** (`content/signals/`): emerging X/social notes — quarantined until promotion gates pass  
- **Governance**: `pnpm check:links`, `pnpm check:freshness`, `pnpm evidence:check`

This is **not** a link dump. Sources are absorbed into doctrine and executable contracts, then kept honest by graph validation.

## 🌐 Localization

- Docs UI: English + Japanese routes (`/en/*`, `/ja/*`), locale negotiation, hreflang + x-default  
- Canon Markdown remains English-first; Japanese UI labels English fallback content when a translation is not yet reviewed  
- Skills install and agent workflows stay language-agnostic

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Bar: every claim is **sourced**, substance is **embedded**, skills stay **token-thrifty**, and nothing ships that fails the anti-AI-slop pre-flight.

## ⚖️ License

[MIT](./LICENSE) — free to use, adapt, and build on.

<div align="center"><sub>Built so AI can design like it has taste. 🎨</sub></div>
