# knowledge-curator watchlist

Sources the weekly routine (SKILL.md section 4) checks for changes. Each row names what to diff and against what baseline. "Baseline" is the `updated` field of the matching Knowledge entry unless noted; when no entry exists yet, the baseline is the last 7 days.

How to check a GitHub repo without spending a full clone on every one: `git ls-remote --heads <url> main` for a quick "did anything move" signal, then `git clone --depth 1` (or `mcp__github__search_repositories` for stars/pushed_at) only for repos that moved or that you are about to write an entry for. Never invent a version, date, or star count; if a source cannot be reached, say so in the digest instead of guessing.

## Core libraries and specs (existing Knowledge entries, keep current)

| Source | What to check | Knowledge entry |
|---|---|---|
| https://github.com/shadcn-ui/ui | releases, `apps/v4/content/docs/changelog/` | component-libraries/shadcn-ui.md |
| https://github.com/radix-ui/primitives, https://github.com/radix-ui/themes | releases | component-libraries/radix-primitives-and-colors.md |
| https://base-ui.com (releases page), https://github.com/mui/base-ui | releases | component-libraries/base-ui.md |
| https://motion.dev/docs, https://github.com/motiondivision/motion | releases | animation/motion.md |
| https://tailwindcss.com/blog, https://github.com/tailwindlabs/tailwindcss | releases | tech-stack/tailwind-v4.md |
| https://developer.apple.com/design/whats-new/ | page diff | platform-guidelines/apple-hig.md |
| https://m3.material.io/blog, https://github.com/material-components/material-web | releases | platform-guidelines/material-3.md |
| https://github.com/vercel/geist-font | releases | typography/geist-font.md |
| https://github.com/notofonts/noto-cjk (Noto Sans JP) | releases | typography/noto-sans-jp.md |
| https://github.com/assistant-ui/assistant-ui | releases, `apps/docs/lib/examples.ts`, `components/pages/design/registry-meta.ts` | component-libraries/assistant-ui.md |
| https://github.com/vercel/ai-elements | releases, `packages/elements/src/` component count | component-libraries/vercel-ai-elements.md |
| https://github.com/google-labs-code/design.md | `docs/spec.md`, releases | design-md-collections/google-stitch-design-md.md |
| https://github.com/VoltAgent/awesome-design-md | new `design-md/<site>/` directories | design-md-collections/voltagent-awesome-design-md.md |
| https://github.com/kzhrknt/awesome-design-md-jp | new `design-md/<service>/` directories | design-md-collections/awesome-design-md-jp.md |

## Agent Skills to watch (fast-moving, check stars and README for scope changes)

| Source | Why it matters | Knowledge entry |
|---|---|---|
| https://github.com/ibelick/ui-skills | registry size (`src/data/registry.ts` slug count), new skills under `skills/` | skills/ui-skills.md |
| https://github.com/Leonxlnx/taste-skill | version bumps in `CHANGELOG.md`, new sub-skills | skills/taste-skill.md |
| https://github.com/tt-a1i/archify | `CHANGELOG.md`, schema changes under `schemas/` | skills/archify.md |
| https://github.com/mahip-kakan/diagram-design | new diagram types, style-guide default token changes | skills/diagram-design.md |
| https://github.com/coleam00/excalidraw-diagram-skill | README changes, new element templates | skills/diagram-design.md |
| https://github.com/obra/superpowers | new skills under `skills/`, new harness adapters | skills/superpowers.md |
| https://github.com/ibelick/motion-primitives | new components, beta -> stable | animation/motion-primitives-and-animata.md |
| https://github.com/codse/animata | new components | animation/motion-primitives-and-animata.md |

## Products with no public repo (check via WebSearch, cite third-party reporting explicitly)

| Source | Why it matters | Knowledge entry |
|---|---|---|
| Claude Design (claude.ai/design), announced via Anthropic Labs | pricing tier changes, new export formats, GA out of research preview | skills/anthropic-claude-design.md |
| "design system launch" / "design tokens" news, last 7 days (WebSearch) | notable new design systems worth their own entry | design-systems/*.md (new entry if warranted) |

## This repository's own ranking pipeline

| Source | What to check | Knowledge entry |
|---|---|---|
| `scripts/fetch-repos.mjs`, `AwesomeDS/data/repos.json`, `.github/workflows/update-data.yml` (owned by another workstream) | new categories added to `CURATED`, schedule changes, new fetch errors worth noting | research/oss-rankings.md |

## Cadence

- Weekly (the `weekly-research` trigger, Monday): walk every row above whose baseline is more than 6 days old. Sources with a Knowledge entry: compare the source's latest release/push date against the entry's `updated` field. No entry yet: check the last 7 days of activity.
- On demand (`/awesome-ds:knowledge-curator <url or topic>`): research and write or update the single entry the user asked for, no need to touch the rest of the watchlist that run.
- Add a new row here whenever a new Knowledge entry is created for a repo, product, or spec that is likely to change again (has releases, a changelog, or an active maintainer). Static, one-off articles (Nielsen's heuristics, a book) do not need a watchlist row.
