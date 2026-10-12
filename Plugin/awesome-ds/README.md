# awesome-ds (Claude Code plugin)

AwesomeDS design system plus five skills for AI coding agents. Japanese instructions work in every skill.

Install: `/plugin marketplace add Yu-aimaker/AwesomeDesignSystem` then `/plugin install awesome-ds@awesome-design-systems`. Local: `claude --plugin-dir ./Plugin/awesome-ds`.

| Skill | What it does |
|---|---|
| `awesome-ds` | Apply AwesomeDS to any web UI: wire tokens, restyle shadcn/ui, forbid anti-patterns, run the checklist. Auto-invoked. |
| `ds-creator` | Brand DS from AwesomeDS through a one-question-per-turn interview. Outputs DESIGN.md, tokens, RATIONALE.md, preview.html, computed contrast. |
| `design-verifier` | Adversarial review: static audit, Playwright screenshots at 390/768/1280 light and dark, rubric scores, `design-review.md`. |
| `design-thinking` | Personas, user stories, journey map, Mermaid page flow, screenshot walk-through, prioritised recommendations. |
| `knowledge-curator` | Add Knowledge entries, update Reference/REFERENCE.md, propose AwesomeDS changes with CHANGELOG. Weekly routine. User-invoked only. |

| Agent | What it does |
|---|---|
| `design-reviewer` | Runs `design-verifier` in a fresh context that did not write the UI, and returns the S1/S2 findings. Delegate to it before calling UI work done. |

| Hook | What it does |
|---|---|
| PostToolUse `Write\|Edit\|MultiEdit` | Runs the static audit on the one UI file just written and gives the S1/S2 findings back to Claude. Advisory, never blocks. `AWESOME_DS_HOOK=off` turns it off. |

`knowledge/` holds the repo's Knowledge entries (index: [knowledge/README.md](knowledge/README.md)), so the agent can read sourced notes on libraries, motion, Japanese typography and reference brands without searching.

Why each Claude Code surface is used, or left unused: [SURFACES.md](SURFACES.md).

`ds/` and `knowledge/` are synced copies of the repo's `AwesomeDS/` and `Knowledge/` (`scripts/sync-ds.sh`; the index is written by `scripts/build-reference.mjs`; CI runs `scripts/check-sync.sh`). Do not edit them by hand.

Scripts (Node 18+, no dependencies except Playwright for capture):

- `skills/ds-creator/scripts/contrast.mjs <tokens.css|DESIGN.md>` WCAG contrast for every text role, light and dark.
- `skills/design-verifier/scripts/static-audit.mjs <dir>` anti-pattern scan with `file:line`.
- `skills/design-verifier/scripts/capture.mjs --urls ... --widths 390,768,1280 --schemes light,dark` screenshots (`npx playwright install chromium` if missing).

Cursor users: copy `cursor/*.mdc` into `.cursor/rules/` (see `cursor/README.md`).
