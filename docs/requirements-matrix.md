# AwesomeDS Platform — Requirements Matrix

Maps approved design-spec sections to owners, artifacts, validation, and evidence.
Generated for implementation tracking (Task 0). Status updates as tasks complete.

| ID | Spec area | Owner | Artifact(s) | Validation | Evidence status |
|---|---|---|---|---|---|
| REQ-001 | Product definition (bible + atlas + libs + site + skills + QA) | platform | monorepo root, packages/*, apps/docs | `pnpm qa` | done |
| REQ-002 | Synthesis over aggregation | content | `content/canon/*`, `design-system/**` | content graph validate | done |
| REQ-003 | Evidence-traceable doctrine | content | `ReferenceRecord`, `CanonRule` schemas | package tests + `pnpm validate` | done |
| REQ-004 | Principle → practice mapping | content/react/motion | rule IDs on components & recipes | graph validate | done |
| REQ-005 | Framework-independent core | tokens/core | CSS vars, contracts, no React in core | package tests | done |
| REQ-006 | WCAG 2.2 AA by construction | react/docs | component tests, axe, a11y suite | `pnpm test` + `pnpm test:a11y` | done |
| REQ-007 | Global/JP typography + RTL | docs/react | foundations, fixtures | browser/visual tests | done |
| REQ-008 | Intent-based motion + reduced-motion | motion | recipes + tokens | package tests | done |
| REQ-009 | AI operates inside contracts | skills | skill updates + rule contract | skill smoke tests | done |
| REQ-010 | Freshness visibility | content/scripts | freshness scripts + `/status` | `pnpm validate` | done |
| REQ-011 | Anti-imitation boundary | content | every reference `antiImitationNote` + brand-neutral derived doctrine | schema + manual audit | done |
| REQ-012 | Reference Atlas structured records | content | `content/references/*.json` | schema + graph | done |
| REQ-013 | Emerging signals not auto-canon | content | `content/signals/*` | graph tests | done |
| REQ-014 | Component baseline set | react | `packages/react` | unit + a11y tests | done |
| REQ-015 | Motion recipe set | motion | `packages/motion` | unit tests | done |
| REQ-016 | Docs routes (canon/components/motion/references/playground/status) | docs | `apps/docs` | route tests + build | done |
| REQ-017 | Bidirectional evidence graph | content | `buildEvidenceGraph` | graph tests | done |
| REQ-018 | Local-only; no deploy/publish | platform | scripts/docs | audit | intentional |
| REQ-019 | Preserve README/skills/install | platform | baseline tests | `tests/baseline/*` | done |
| REQ-020 | Unresolved Critical/High = 0 at completion | qa | `docs/completion-audit.md` | full QA loop | done |
| REQ-021 | English/Japanese website localization | docs | `/en/*`, `/ja/*`, proxy negotiation, dictionaries, fallback notice | i18n unit + E2E + visual + axe | done |

## Compatibility contract (pre-migration snapshot)

Must remain true after platform landing:

- Public README entry points exist (`README.md` + translations).
- `design-system/` modules listed in `design-system/INDEX.md` remain loadable.
- Five skills under `skills/` with public names: `awesome-ds`, `make-awesome-ds`, `awesome-review`, `awesome-motion`, `awesome-html`.
- `install.sh` supports `--copy` and symlink modes.
- Untracked pre-existing `.claude/` and `.tokensave/` in main tree are out of worktree scope (recorded only).
