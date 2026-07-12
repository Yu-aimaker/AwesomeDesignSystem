# Plan 003: Implement real source observation and freshness governance

> Drift check: `git diff --stat f2baed3..HEAD -- scripts packages/content content/references reports .github/workflows/freshness.yml apps/docs/app/status docs/maintenance.md`

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plan 001
- **Category**: correctness / direction
- **Planned at**: `f2baed3`, 2026-07-13

## Why this matters

The product promise is continuous design intelligence. Today
`scripts/check-freshness.mjs:16-17` compares the stored hash with itself, so
upstream changes are impossible to detect. `check-links.mjs:11-28` checks 97 URLs
sequentially once via HEAD and always exits zero. The current status is cadence
metadata, not source observation.

## Target contract

Every observation records `unchanged`, `changed`, or `fetch_failed`. A network
failure must never be called a content change. Promotion remains human-gated;
automation creates review work and never rewrites canon.

## Scope

In scope: content observation schemas/loaders, network scripts and fixture tests,
freshness workflow/report, Status rendering, maintenance docs. Out of scope:
automatic canon edits, scraping authenticated/private sources, deployment.

## Steps

1. Define a versioned observation record with source ID, adapter, observed time,
   normalized hash/HTTP metadata, previous value, result, and diagnostic category.
2. Implement bounded-concurrency HTTP observation with retry/backoff, HEAD then
   small GET fallback, timeout, user-agent, transient allowlist, and deterministic
   HTML normalization. Add a GitHub repository adapter for release/default-branch
   movement where a reference identifies a repository.
3. Persist a review-queue report separately from source records. In strict mode,
   fail only persistent, non-allowlisted failures older than policy thresholds.
4. Replace self-comparison in freshness with actual prior/current observations.
   Preserve cadence-based due/stale as a distinct axis.
5. Render human-readable changed/fetch-failed/review-needed groups on `/status`;
   do not dump only raw JSON.
6. Update scheduled workflow to retain previous observation state safely and
   upload both machine JSON and Markdown summary.

## Test plan and gates

Use local fixture HTTP servers—never real internet—in unit/integration tests:
unchanged, normalized-noise-only, real change, HEAD rejected/GET accepted,
timeout then retry, persistent failure, allowlisted failure, and GitHub fixture.

- `pnpm test` → all existing plus observation tests pass.
- `pnpm validate` → 97 references, 42 rules, 20 artifacts, 6 signals, 0 issues.
- Fixture strict run exits nonzero only for the aged persistent failure case.
- `pnpm check:freshness` produces separate freshness and observation summaries.

## STOP conditions

Stop if the design requires committing volatile remote content into reference
records, if source normalization would store copyrighted page bodies, or if the
workflow needs credentials not already authorized.
