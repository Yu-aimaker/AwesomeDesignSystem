# Plan 002: Make full browser QA a durable gate

> Drift check: `git diff --stat f2baed3..HEAD -- package.json playwright.config.ts .github/workflows tests docs/requirements-matrix.md docs/completion-audit.md docs/qa-report.md`

## Status

- **Priority**: P0
- **Effort**: S/M
- **Risk**: LOW
- **Depends on**: plan 001
- **Category**: tests / CI
- **Planned at**: `f2baed3`, 2026-07-13

## Why this matters

`package.json:17` defines `qa` without Playwright, and `.github/workflows/ci.yml:18`
runs only that command. Keyboard, locale, reflow, axe, and visual failures can
therefore merge while CI remains green. The approved spec requires these as
release evidence, not optional local checks.

## Scope

In scope: root scripts, Playwright config/tests, CI workflow, QA documentation.
Out of scope: deployment, browser clouds, and changing product UI merely to make
screenshots easier.

## Steps

1. Add `qa:core` for deterministic non-browser checks and `qa:full` that builds
   then runs Playwright with retries disabled. Make names and README usage clear.
2. Add a CI browser job using the production build and
   `pnpm exec playwright install --with-deps chromium`; upload traces/diffs only
   on failure. Keep the unit/content job fast and separate.
3. Expand visual coverage to deterministic light/dark/high-contrast, Japanese,
   320px mobile, RTL, and reduced-motion fixtures. Replace the whole-page 15%
   tolerance (`tests/visual/smoke-visual.spec.ts:35`) with tighter region-level
   assertions and small raster tolerance.
4. Make RTL assertions check overflow, logical alignment, focus order, and
   representative overlay/navigation behavior—not only heading visibility.
5. Update requirement statuses to `proven`, `partial`, or `open`; cite exact
   test files/commands. Never mark a broad row done from one narrow smoke test.

## Verification

- `pnpm qa:core` → exit 0.
- `PLAYWRIGHT_PORT=3421 pnpm qa:full` → all projects pass, retries disabled.
- Workflow YAML parses and contains both core and browser jobs.
- Deliberately perturbing one visual fixture makes its focused test fail; revert
  the perturbation and confirm it passes.

## STOP conditions

Stop if cross-platform font rendering cannot meet the tighter threshold without
masking meaningful regions, or if CI requires credentials/external services.
