<div align="center">

# AwesomeDesignSystem

**The taste layer for AI agents.**
A self-contained, source-cited design-system knowledge base + skill suite that lets any AI agent
produce modern (2026), human-feeling frontend design — and stop shipping generic "AI slop".

<sub>

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</sub>

</div>

---

## Why this exists

Ask an LLM to "build a landing page" and you don't get *design* — you get the **statistical median**
of every Tailwind tutorial ever scraped: Inter, a purple-to-blue gradient on white, a centered hero,
three emoji feature cards. Not because the model lacks knowledge, but because it **defaults to the
center unless steered off it.**

AwesomeDesignSystem supplies the steering: a curated, opinionated body of design knowledge — **with
the code embedded** — plus skills that load only what a task needs. It's built **for AI agents to
read directly**, so an agent never has to fetch a library's docs mid-task to be productive, yet never
has to swallow the whole system into its context either.

Everything here is distilled from **primary sources** (Apple HIG & Liquid Glass, Google Material 3
Expressive, Nothing, Goodpatch, Linear/Stripe/Vercel/Raycast, and the official library docs) and
**adversarially fact-checked** — 270+ cited sources live under [`research/`](./research).

## What's inside

```
design-system/            ← the canonical knowledge base (code embedded; single source of truth)
  INDEX.md                  router: question → which module to read
  best-practice-design-for-ai.md   the flagship synthesis, source-linked
  00-philosophy/            taste layer · "modern 2026" · core principles
  foundations/              color (OKLCH) · typography (incl. 日本語) · spacing/layout · tokens
  motion/                   principles · copy-paste Motion + CSS recipes
  components/               button/card/input/dialog/… with states + a11y
  patterns/                 hero/bento/sections/nav/backgrounds (anti-slop)
  accessibility/            WCAG 2.2 · focus · keyboard · contrast
  tech-stack-2026/          the recommended AI-native stack
research/                 ← raw, primary-source research (the evidence)
skills/                   ← five portable skills (the verbs)
```

## The five skills

| Skill | Use it to… |
|---|---|
| **/AwesomeDS** | Build or refine any UI with the system's taste layer; routes to only the modules you need. |
| **/MakeAwesomeDS** | Generate a brand/product's *own* design system (OKLCH tokens + `DESIGN.md` + previews). |
| **/AwesomeHTML** | Turn Markdown / research / notes into a polished, self-contained single-file HTML document. |
| **/AwesomeReview** | Audit existing UI or code — detect AI slop & a11y failures, report prioritized fixes. |
| **/AwesomeMotion** | Design tasteful, purpose-driven motion (Motion for React + CSS-only recipes). |

## Quick start

### For an AI agent (no install)
Point the agent at this repo and tell it to **read [`design-system/INDEX.md`](./design-system/INDEX.md) first**,
then open only the modules its task needs. The INDEX is the map; each module is self-contained.

### As Claude Code skills
```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # symlinks the 5 skills into ~/.claude/skills and backs up any prior skill
```
Then in Claude Code: `/AwesomeDS`, `/MakeAwesomeDS`, `/AwesomeHTML`, `/AwesomeReview`, `/AwesomeMotion`.
> `install.sh` uses symlinks, so keep the repo in place; pulling updates updates the skills. Use `--copy` for sandboxed setups.

## The standard, in one breath

> Avoid the median. Commit to a point of view. One dominant color + sharp accents, never a timid
> even palette. A deliberate, distinctive typeface — never Inter-as-the-only-choice. Real hierarchy
> through contrast; one focal point per screen. Restraint = confidence. Motion communicates state,
> not decoration — one orchestrated page-load beats scattered micro-interactions. Theme your
> primitives, never ship raw defaults. Always design the error/empty/loading states and meet WCAG 2.2 AA.
> A coherent **whole**, not a collection of parts.

## Design tokens (the shared vocabulary)

Every module speaks one token language (full set in [`foundations/tokens.md`](./design-system/foundations/tokens.md)):
semantic OKLCH colors (`--color-bg/-surface/-fg/-border/-accent/-ring`), an 8pt space scale
(`--space-*`), `--radius-*`, a fluid type scale (`--text-*` + `--leading-*`/`--tracking-*`),
`--font-display/-body/-mono`, hairline borders + `--shadow-*`, and motion tokens (`--ease-*`, `--dur-*`),
mirrored into a Tailwind v4 `@theme {}` block.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). The bar: every claim is **sourced**, code is **embedded**,
skills stay **token-thrifty**, and nothing ships that would fail the anti-AI-slop Pre-Flight.

## License

[MIT](./LICENSE) — free to use, adapt, and build on.

<div align="center"><sub>Built to make AI design like it has taste.</sub></div>
