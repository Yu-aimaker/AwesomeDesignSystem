# AwesomeDS Platform Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a local-first, evidence-backed design bible with an installable React component and motion library, searchable Reference Atlas, documentation website, and repeatable quality/freshness verification.

**Architecture:** A pnpm/Turborepo monorepo shares versioned schemas, semantic tokens, and stable rule/reference IDs across knowledge, React, motion, validation, and the Next.js docs app. Existing Markdown remains GitHub-readable while typed metadata and loaders create a bidirectional evidence graph. Work is split by owned directories and converges through root verification scripts.

**Tech Stack:** pnpm workspaces, Turborepo, TypeScript strict mode, React 19, Next.js 16, Tailwind CSS v4, Base UI primitives where behavior risk warrants it, Motion for React, Zod, Vitest, Testing Library, axe-core, Playwright.

## Global Constraints

- Local-first only; do not deploy or publish packages in this phase.
- React is the reference implementation; tokens, CSS, schemas, and component contracts remain framework-independent.
- Components consume semantic tokens only; no raw product colors in component source.
- WCAG 2.2 AA and WAI-ARIA Authoring Practices behavior are release gates.
- All canon rules, sources, components, motion recipes, and tests use stable IDs and validate as one graph.
- X/social items remain emerging signals until corroborated; automation never promotes them into canon.
- Preserve existing README entry points, Markdown knowledge, translations, installer, and five skills.
- Use copyright-safe synthesis and explicit anti-imitation notes for books and brand references.
- No unresolved critical/high QA findings at completion.

---

### Task 0: Requirement matrix and compatibility baseline

**Files:**

- Create: `docs/requirements-matrix.md`
- Create: `tests/baseline/repository.test.ts`, `tests/baseline/install.test.ts`
- Create: `tests/fixtures/legacy-links.json`

**Interfaces:**

- Produces stable requirement IDs `REQ-001` onward, each mapped to an artifact and automated/manual evidence.
- Produces the compatibility contract consumed by the final audit.
- Records, but does not modify, pre-existing untracked `.claude/` and `.tokensave/` paths.

- [ ] **Step 1: Inventory every approved specification requirement** and map it to an owner, planned artifact, validation command, and evidence status; assert there are no unmapped requirements.
- [ ] **Step 2: Snapshot the current public repository contract**: README links, `design-system/` paths, five skill names and relative paths, `install.sh --copy`, and symlink mode.
- [ ] **Step 3: Write baseline tests** that fail if existing Markdown entry points or installed skill routing disappear during migration.
- [ ] **Step 4: Run the baseline tests** with `rtk pnpm exec vitest run tests/baseline`; before Task 1, expect only the documented missing-tooling failure.
- [ ] **Step 5: Commit** with `test: capture AwesomeDS compatibility baseline` after Task 1 supplies the runner.

### Task 1: Monorepo foundation and verification shell

**Files:**

- Create: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, `.npmrc`
- Create: `vitest.workspace.ts`, `playwright.config.ts`
- Modify: `.gitignore`

**Interfaces:**

- Produces root scripts: `dev`, `build`, `typecheck`, `lint`, `test`, `test:a11y`, `test:e2e`, `validate`, `qa`.
- Produces shared TypeScript compiler rules consumed by every package.

- [ ] **Step 1: Add the workspace manifests** with `packageManager: pnpm@10`, Node `>=22`, strict TypeScript, deterministic scripts, and workspace globs `apps/*` and `packages/*`.
- [ ] **Step 2: Add a root smoke test** at `tests/workspace.test.ts` that reads `pnpm-workspace.yaml` and asserts both workspace globs and all required root scripts exist.
- [ ] **Step 3: Run the test before install** with `rtk pnpm exec vitest run tests/workspace.test.ts`; expect dependency resolution failure or a failing manifest assertion.
- [ ] **Step 4: Install dependencies** with `rtk pnpm install` and rerun the smoke test; expect one passing test file.
- [ ] **Step 5: Run `rtk pnpm typecheck` and `rtk git diff --check`**; expect exit code 0.
- [ ] **Step 6: Commit** with `chore: establish AwesomeDS monorepo`.

### Task 2: Versioned content contracts and evidence graph

**Files:**

- Create: `packages/content/package.json`, `packages/content/tsconfig.json`
- Create: `packages/content/src/schema.ts`, `ids.ts`, `graph.ts`, `loaders.ts`, `index.ts`
- Create: `packages/content/src/schema.test.ts`, `graph.test.ts`
- Create: `content/schema-version.json`

**Interfaces:**

- Produces `ReferenceRecord`, `CanonRule`, `ArtifactClaim`, `FreshnessState`, `EvidenceLevel`.
- Produces `loadReferenceRecords()`, `loadCanonRules()`, `buildEvidenceGraph()`, and `validateEvidenceGraph()`.
- IDs follow `ref.<owner>.<slug>`, `rule.<domain>.<slug>`, and `artifact.<kind>.<slug>`.

- [ ] **Step 1: Write failing schema tests** covering a complete reference, rejection of invalid URLs/dates/enums, and rejection of duplicate IDs.
- [ ] **Step 2: Write failing graph tests** for missing reference IDs, orphaned rules, artifacts without rules, and a valid bidirectional graph.
- [ ] **Step 3: Run `rtk pnpm --filter @awesome-ds/content test`**; expect failures because the schema and graph functions do not exist.
- [ ] **Step 4: Implement Zod schemas and pure graph validation** with deterministic, file-qualified error messages.
- [ ] **Step 5: Rerun package tests and root typecheck**; expect exit code 0.
- [ ] **Step 6: Commit** with `feat(content): add evidence graph contracts`.

### Task 3: Semantic token system and generated outputs

**Files:**

- Create: `packages/tokens/package.json`, `packages/tokens/tsconfig.json`
- Create: `packages/tokens/src/tokens.ts`, `types.ts`, `build.ts`, `index.ts`
- Create: `packages/tokens/src/tokens.test.ts`
- Generate: `packages/tokens/dist/tokens.css`, `tailwind-theme.css`, `tokens.json`

**Interfaces:**

- Produces typed `tokens`, `lightTheme`, `darkTheme`, `highContrastTheme`, `motionTokens`.
- Produces CSS semantic variables and Tailwind v4 `@theme` mappings.
- Token names preserve the existing contract (`--color-bg`, `--color-fg`, `--space-*`, `--dur-*`) and add component-independent state roles.

- [ ] **Step 1: Write failing tests** for unique names, OKLCH color values, semantic light/dark/high-contrast completeness, 4/8pt spacing rhythm, reduced-motion values, and deterministic generation.
- [ ] **Step 2: Run the token test**; expect missing module failures.
- [ ] **Step 3: Implement typed source tokens and the generator**; generated files must include a header saying they are derived artifacts.
- [ ] **Step 4: Run generation twice and compare Git state**; expect the second run to produce no diff.
- [ ] **Step 5: Run token tests and `rtk pnpm typecheck`**; expect exit code 0.
- [ ] **Step 6: Commit** with `feat(tokens): add semantic multi-theme contract`.

### Task 4: Reference Atlas seed and freshness tooling

**Files:**

- Create: `content/references/*.json`
- Create: `content/signals/*.json`
- Create: `packages/content/src/freshness.ts`, `freshness.test.ts`
- Create: `scripts/validate-content.mjs`, `scripts/check-links.mjs`, `scripts/check-freshness.mjs`
- Create: `reports/.gitkeep`
- Modify: `research/reference-landscape-2026-07.md`, `research/reference-repos.md`

**Interfaces:**

- Consumes content schemas and graph validators from Task 2.
- Produces at least 40 curated first-party records spanning standards, systems, design engineering, AI UI, brand, motion, typography, and the requested repositories.
- Produces JSON reports distinguishing `changed`, `stale`, `fetch_failed`, and `healthy`.

- [ ] **Step 1: Add fixture-driven failing freshness tests** for cadence boundaries, HTTP failure separation, and content hash changes.
- [ ] **Step 2: Seed requested sources** including Duolingo, Vercel, VoltAgent, kzhrknt, WCAG, APG, DTCG, Open UI, Apple HIG, Material, Fluent, Primer, Spectrum, Carbon, Atlassian, Polaris, GOV.UK, USWDS, Storybook, Radix, React Aria, Motion, Stitch, shadcn registry, and AI Elements.
- [ ] **Step 3: Add source lessons and links to canon rule IDs**; mark X findings as signals rather than doctrine.
- [ ] **Step 4: Implement validation/link/freshness scripts** with retries, timeouts, caching, and non-destructive reports.
- [ ] **Step 5: Run `rtk pnpm validate` and `rtk pnpm check:freshness`**; expect schema/graph success and a generated actionable report.
- [ ] **Step 6: Commit** with `feat(references): launch evidence-backed Reference Atlas`.

### Task 5: Canon expansion and rule metadata

**Files:**

- Modify: `design-system/INDEX.md`, `design-system/best-practice-design-for-ai.md`
- Create: `design-system/brand/brand-system.md`, `content-design.md`, `illustration-iconography.md`
- Create: `design-system/interaction/product-quality.md`, `states-recovery.md`
- Create: `design-system/ai-driven/generative-ui.md`, `agent-workflow.md`, `evaluation.md`
- Create: `design-system/foundations/core-design-literacy.md`, `international-typography.md`
- Create: `design-system/governance/evidence-and-freshness.md`
- Create: `content/canon/*.json`

**Interfaces:**

- Produces canon records with stable rule IDs and source references.
- Connects existing modules to the graph without rewriting their substantive guidance unnecessarily.

- [ ] **Step 1: Add a failing content-coverage test** requiring every canon domain and every new document to have at least one validated rule and primary reference.
- [ ] **Step 2: Write the new synthesis modules** using primary sources and copyright-safe summaries; include principles, operational rules, do/don't guidance, implementation mapping, and verification.
- [ ] **Step 3: Add rule metadata records** for both new doctrine and high-value existing doctrine.
- [ ] **Step 4: Update INDEX and flagship routing** so agents load only relevant modules.
- [ ] **Step 5: Run content validation and link checks**; expect no missing IDs or broken internal links.
- [ ] **Step 6: Commit** with `docs(canon): expand AwesomeDS into a complete design bible`.

### Task 6: Framework-independent core and motion package

**Files:**

- Create: `packages/core/**`
- Create: `packages/motion/**`
- Test: `packages/core/src/*.test.ts`, `packages/motion/src/*.test.ts`

**Interfaces:**

- Core produces `cx`, polymorphic type helpers, state/data-attribute contracts, and layout utility CSS.
- Motion produces `motionTokens`, `getMotionPreference()`, recipe metadata, CSS recipes, and React helpers exported from a separate entry point.

- [ ] **Step 1: Write failing tests** for class composition, state attributes, intent metadata, reduced-motion alternatives, and recipe rule-ID links.
- [ ] **Step 2: Implement core utilities** without React dependencies.
- [ ] **Step 3: Implement intent-based motion recipes** for enter/exit, reveal, expand, shared layout, list change, feedback, drag, scroll, and page transitions.
- [ ] **Step 4: Verify CSS-first recipes work without JavaScript** and React helpers are interruptible where input-driven.
- [ ] **Step 5: Run package tests, typecheck, and graph validation**; expect exit code 0.
- [ ] **Step 6: Commit** with `feat(motion): add intent-based accessible motion system`.

### Task 7: React component baseline

**Files:**

- Create: `packages/react/package.json`, `tsconfig.json`, `src/index.ts`, `src/styles.css`
- Create: focused component directories under `packages/react/src/components/`
- Test: colocated `*.test.tsx` for each component family

**Interfaces:**

- Consumes tokens, core state contracts, and motion preferences.
- Produces all components named in the approved spec with AwesomeDS-owned public APIs.
- Every component exports `metadata` containing implemented rule IDs and supported behavior states.

- [ ] **Step 1: Implement primitives/layout family test-first**: Button, IconButton, Link, Badge, Stack, Cluster, Grid, Container, VisuallyHidden.
- [ ] **Step 2: Implement form family test-first**: Input, Textarea, Checkbox, RadioGroup, Switch, Select.
- [ ] **Step 3: Implement disclosure/overlay family test-first**: Dialog, AlertDialog, Popover, Tooltip, DropdownMenu, Tabs, Accordion.
- [ ] **Step 4: Implement navigation/status family test-first**: Breadcrumb, Pagination, Card, Callout, Skeleton, Spinner, Progress, Toast, EmptyState, ErrorState.
- [ ] **Step 5: For every family, test** keyboard behavior, accessible names/roles, disabled/loading/error states, RTL, high contrast hooks, and reduced motion.
- [ ] **Step 6: Run component tests, axe checks, typecheck, and build**; expect exit code 0 and no serious/critical axe violations.
- [ ] **Step 7: Commit** with `feat(react): add accessible AwesomeDS component library`.

### Task 8: Documentation application shell and visual system

**Files:**

- Create: `apps/docs/**` including route layout, global styles, navigation, search, error boundaries, and shared page components.
- Create: `apps/docs/tests/**`

**Interfaces:**

- Consumes packages/content, tokens, React, and motion through public entry points only.
- Produces responsive shell, command/search navigation, theme controls, language-ready layouts, and development integrity errors.

- [ ] **Step 1: Write route and shell tests** for navigation landmarks, skip link, visible focus, theme persistence, responsive navigation, and missing-content errors.
- [ ] **Step 2: Implement the token-driven visual language** with distinctive typography, editorial hierarchy, restrained atmosphere, and no raw template defaults.
- [ ] **Step 3: Implement server-rendered navigation and client-only enhancements** so core reading/navigation works without hydration.
- [ ] **Step 4: Add metadata, sitemap generation, 404, and isolated example error boundaries.**
- [ ] **Step 5: Run docs tests, typecheck, and production build**; expect exit code 0.
- [ ] **Step 6: Commit** with `feat(docs): build the AwesomeDS documentation shell`.

### Task 9: Canon, component, motion, and Reference Atlas routes

**Files:**

- Create: `apps/docs/app/(canon)/**`, `components/**`, `motion/**`, `references/**`, `status/**`
- Create: `apps/docs/components/reference-filter.tsx`, `code-example.tsx`, `component-preview.tsx`, `evidence-links.tsx`
- Test: route and filter tests under `apps/docs/tests/`

**Interfaces:**

- Produces every route required by the specification.
- Reference filters are URL-addressable and preserve Back/Forward behavior.
- Canon and artifact pages expose bidirectional evidence links.

- [ ] **Step 1: Write failing tests** for all required routes, filter serialization, empty results, stale labels, evidence backlinks, and code-copy fallback.
- [ ] **Step 2: Implement canon rendering** from existing Markdown plus structured rule metadata.
- [ ] **Step 3: Implement component and motion explorer pages** with live state matrices, a11y contracts, and copyable examples.
- [ ] **Step 4: Implement Reference Atlas** with full-text search and all specified filters.
- [ ] **Step 5: Implement status dashboard** from validation and freshness reports.
- [ ] **Step 6: Run route tests and production build**; expect exit code 0.
- [ ] **Step 7: Commit** with `feat(docs): connect canon artifacts and Reference Atlas`.

### Task 10: Playground and AI-agent integration

**Files:**

- Create: `apps/docs/app/playground/**`, `apps/docs/components/playground/**`
- Modify: `skills/awesome-ds/SKILL.md`, `skills/make-awesome-ds/SKILL.md`, `skills/awesome-review/SKILL.md`, `skills/awesome-motion/SKILL.md`, `skills/awesome-html/SKILL.md`
- Create: `skills/shared/reference-atlas.md`, `skills/shared/rule-contract.md`

**Interfaces:**

- Playground edits theme roles and composes approved components without arbitrary code execution.
- Skills route agents through canon rule IDs, artifact metadata, and evidence validation.

- [ ] **Step 1: Write playground tests** for token editing, invalid values, theme reset, component state selection, and copy output.
- [ ] **Step 2: Implement safe playground controls** using allowlisted token and component schemas.
- [ ] **Step 3: Update all five skills** to use the new routing, evidence, accessibility, and QA contracts while preserving their public trigger names.
- [ ] **Step 4: Add skill smoke tests** that verify required files, references, and legacy entry points.
- [ ] **Step 5: Run playground, content, and skill tests**; expect exit code 0.
- [ ] **Step 6: Commit** with `feat(ai): connect agents and playground to AwesomeDS contracts`.

### Task 11: Automated accessibility, visual, and browser QA

**Files:**

- Create: `tests/e2e/*.spec.ts`, `tests/visual/*.spec.ts`, `tests/a11y/*.spec.ts`
- Create: `tests/fixtures/i18n.ts`
- Modify: `playwright.config.ts`, root QA scripts

**Interfaces:**

- Produces browser evidence for required routes, components, themes, Japanese, RTL, zoom/reflow, high contrast, reduced motion, and keyboard-only operation.

- [ ] **Step 1: Add Playwright coverage** for navigation, search/filter URL state, component interactions, playground, and status integrity.
- [ ] **Step 2: Add axe scans** across representative pages plus explicit APG keyboard assertions for complex components.
- [ ] **Step 3: Add visual snapshots** at mobile/tablet/desktop for light/dark/high-contrast/reduced-motion, Japanese, and RTL fixtures.
- [ ] **Step 4: Test 200% zoom and 320 CSS px reflow**, focus order, skip navigation, and motion suppression.
- [ ] **Step 5: Run the full browser suite**; triage failures as product bugs rather than snapshot updates by default.
- [ ] **Step 6: Commit** with `test: add full-story AwesomeDS browser QA`.

### Task 12: Repository experience, compatibility, and final audit loop

**Files:**

- Modify: `README.md`, translated READMEs, `CONTRIBUTING.md`, `install.sh`
- Create: `CHANGELOG.md`, `docs/architecture.md`, `docs/maintenance.md`, `docs/qa-report.md`, `docs/completion-audit.md`
- Create: `.github/workflows/ci.yml`, `.github/workflows/freshness.yml`

**Interfaces:**

- Produces onboarding commands, architecture/maintenance guidance, local QA evidence, and requirement mapping.
- CI definitions mirror local commands but are not represented as deployed or run remotely in this phase.

- [ ] **Step 1: Update repository documentation** with exact install, dev, build, test, Reference Atlas, and freshness workflows; preserve multilingual navigation.
- [ ] **Step 2: Verify `install.sh` and all five legacy skills** still work from a clean temporary home/config directory.
- [ ] **Step 3: Run `rtk pnpm qa`** and capture tool versions, commands, results, and known intentional constraints in `docs/qa-report.md`.
- [ ] **Step 4: Run an adversarial product audit** covering content depth, visual quality, responsive behavior, a11y, performance, API coherence, evidence traceability, freshness, and copy/paste examples.
- [ ] **Step 5: Rank every finding**, fix all critical/high and actionable lower findings, rerun the relevant narrow suite after each fix, then rerun the full QA suite.
- [ ] **Step 6: Repeat Step 4–5** until the defined audit scope yields no unresolved actionable findings.
- [ ] **Step 7: Write `docs/completion-audit.md`** mapping all 12 specification sections and eight definition-of-done items to current files and fresh command evidence.
- [ ] **Step 8: Run final `rtk pnpm qa`, `rtk git diff --check`, and `rtk git status --short`**; expect all checks green and only intentional pre-existing untracked paths.
- [ ] **Step 9: Commit** with `docs: complete AwesomeDS platform audit and handoff`.
