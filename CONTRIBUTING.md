# Contributing to AwesomeDesignSystem

Thanks for helping make this the best AI-agent-first design system on the web. This repo is a **knowledge base for both humans and AI agents**, so contributions are held to a slightly unusual bar: every change must be _true_, _sourced_, and _token-efficient_.

## What this repo is

- `content/` — structured Reference Atlas, canon rules, artifact claims, and quarantined signals; the machine-validated evidence graph.
- `design-system/` — the human-readable canon. Code and actionable guidance are embedded for agents.
- `research/` — primary-source audit notes supporting structured records and canon conclusions.
- `packages/` — tokens, framework-neutral contracts, React components, motion, brand, and graph tooling.
- `apps/docs/` — the English/Japanese local learning and component-explorer website.
- `skills/` — five portable agent entry points using progressive disclosure.

## Golden rules

1. **Cite primary sources.** Any non-trivial claim, value, or code snippet must trace to an official doc, spec, or library source. Add it to the relevant `## Sources` section. No source → no claim.
2. **Embed the substance, not just links.** If an agent would need to fetch a page to use your contribution, inline the essential code/values instead.
3. **Stay token-thrifty.** `SKILL.md` files are lean routers. Heavy content lives in `design-system/` modules and is loaded only when needed. Don't bloat a SKILL.md with content that belongs in a reference module.
4. **No private context.** This is a public repo. Never commit personal data, internal URLs, API keys, or client-specific material.
5. **Framework-agnostic first.** Express principles and tokens in framework-neutral terms (CSS variables, OKLCH, plain HTML/CSS). Add a React / Tailwind v4 / Motion reference implementation alongside — never _instead of_.
6. **Show, don't preach.** Prefer a copy-paste-ready snippet over a paragraph of description.

## Quality bar (the anti-AI-slop standard)

Contributions are reviewed against `design-system/00-philosophy/` (anti-AI-slop + human-feel principles). Reject your own draft if it leans on: generic fonts (Inter/Roboto/Arial as the _only_ choice), purple-gradient-on-white clichés, centered-hero-plus-three-cards defaults, timid evenly-distributed palettes, or motion that decorates without intent.

## How to contribute

1. **Open an issue first** for anything beyond a typo, so we can align on scope.
2. Fork, branch (`feat/…`, `fix/…`, `docs/…`), and make your change.
3. **Verify sources** — confirm each link resolves, each version/value is current, and the structured observation date/cadence is accurate.
4. If you touch a `design-system/` module, update `design-system/INDEX.md` if the routing changed.
5. If you touch the skills, keep `SKILL.md` frontmatter valid (`name` in kebab-case matching the folder; `description` in third person stating _what_ + _when to trigger_).
6. Open a PR. Describe **what changed, why, and your sources.**

## Commit messages

Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`. Keep unrelated changes in separate commits.

## Adding a new design reference

1. Add `content/references/ref-<owner>-<slug>.json` using an existing record as the schema example. Include source class, evidence level, dates, cadence, license note, anti-imitation note, and linked rule/artifact IDs.
2. Add or update `research/<topic>.md` with the primary-source audit, concrete observations, limitations, and URLs. Research is supporting evidence, not an unindexed bookmark.
3. Fold only durable, transferable conclusions into `design-system/`; do not copy proprietary identity, voice, illustrations, or assets.
4. Add/update `content/canon/` rule IDs and `content/artifacts/claims.json` so evidence links backward to sources and forward to implementation/tests.
5. Run `pnpm validate`, then `pnpm check:links` and `pnpm check:freshness` when network observation is in scope.

## Verification before a PR

Run `pnpm qa:core` for every change. Changes to routes, components, motion,
localization, accessibility, or visual tokens must also run
`PLAYWRIGHT_PORT=3421 pnpm qa:full`. Review visual diffs manually; never update
snapshots solely to make a test green.

## Translations

READMEs are translated directly (see `README.md`'s language switcher). To add a language, copy `README.md` to `README.<lang>.md`, translate, and add it to every README's switcher row. Keep technical terms and code identifiers in their original form.

---

By contributing, you agree your work is licensed under the repository's [MIT License](./LICENSE).
