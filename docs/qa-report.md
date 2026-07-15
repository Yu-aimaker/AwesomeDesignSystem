# QA Report — AwesomeDS Design Bible

**Date:** 2026-07-16  
**Branch:** `main` working tree, uncommitted by instruction  
**Round:** Opus implementation repair pass + independent strict verification

## Environment

- Node: `>=22.13.0`
- pnpm: `10.5.2`
- Next.js: `16.2.10`
- React: `19.2.7`
- Playwright: `1.61.1`
- Local OSV Scanner: `2.4.0` (`b56b5191101d5f27d4787d5583d8d01e9518a7af`)
- CI OSV action: latest released action `v2.3.8`, pinned to immutable commit `9a498708959aeaef5ef730655706c5a1df1edbc2`

## Current command evidence

| Command or gate                        | Result                                                                                                                             |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm test`                            | **238 passed / 33 files**                                                                                                          |
| `pnpm validate`                        | **128 refs / 47 rules / 54 artifacts / 6 signals / 0 issues**                                                                      |
| `pnpm --filter @awesome-ds/docs build` | Pass; **357** static generation units                                                                                              |
| Playwright, retries 0                  | **92 passed on macOS and official Playwright Ubuntu** across E2E, hydrated axe, visual, and no-JS projects                         |
| Visual suite                           | **16 passed on macOS and official Playwright Ubuntu**, including EN/JA brand desktop/mobile, themes, forced RTL and reduced motion |
| `pnpm packages:smoke`                  | **6** ESM/declaration artifact sets verified                                                                                       |
| `pnpm check:links -- --strict`         | **128 checked / 0 failed / 0 allowlisted**                                                                                         |
| Freshness inspection                   | **12 changed / 116 unchanged / 0 fetch failures / 0 persistent failures**                                                          |
| OSV lockfile scan                      | **611 packages / no issues**; downloaded binary checksum verified                                                                  |
| Runtime performance gate               | `/en`: 200,563 B scripts + 104,396 B fonts; `/ja`: 200,563 B scripts + 0 font bytes                                                |
| Bundle performance gate                | largest route: **713,913 B / 750,000 B**                                                                                           |

`pnpm audit` is not used as evidence because npm retired the historical audit endpoint used by this pnpm flow and returns HTTP 410. The repository instead uses the official OSV scanner locally and pinned OSV workflows in CI.

## Accessibility and interaction coverage

- Axe runs after hydration/network settling and blocks every automated WCAG 2.2 A/AA-tagged violation, not only critical/serious impacts.
- Keyboard coverage includes Dialog, Tooltip, DropdownMenu, Tabs, Select, Popover, Accordion, RadioGroup, focus restoration, and API table navigation.
- Forced-colors checks cover focus, disabled, invalid, danger, and dialog boundaries.
- Reflow is checked at 320px with a 1px tolerance on English and Japanese brand routes.
- Forced-RTL checks verify logical-property resilience: computed direction, visible navigation, viewport-bounded headings, and no horizontal overflow. The shipped EN/JA locales remain LTR.
- Visual comparison uses a 1% maximum differing-pixel ratio and cannot be disabled in CI.
- Routes with material platform-font differences carry reviewed Linux-specific baselines; the official Playwright 1.61.1 Ubuntu image passes all 16 visual cases.
- Reduced-motion and JavaScript-disabled reading/interaction paths are covered.

## Security and platform coverage

- Per-response cryptographic nonce is present in CSP and matching HTML script/style tags.
- CSP includes `strict-dynamic`, blocks script attributes, objects, frames, and foreign form actions, and does not allow inline scripts.
- HSTS, `nosniff`, strict referrer policy, COOP, CORP, Permissions-Policy, and frame protections are present on live responses.
- PR and scheduled dependency scans use the latest released OSV action (`v2.3.8`) pinned to an immutable workflow commit; the independent local lockfile scan uses the newer scanner CLI (`v2.4.0`). Dependabot covers npm and GitHub Actions.
- Locale-neutral manifest and machine-readable brand assets bypass locale redirects; canonical, hreflang, x-default, sitemap, robots, and localized metadata are tested.

## Performance evidence

- The docs no longer ship Noto Sans JP webfont subsets. Japanese uses native platform CJK stacks.
- Lightweight `@awesome-ds/core/metadata` and `@awesome-ds/core/runtime` entry points keep authoring-only Zod catalogs out of client bundles.
- Direct React primitive imports avoid the broad catalog path.
- Runtime budgets cover `/en`, `/ja`, and `/en/components/button`, while the bundle gate covers 22 routes.

## Freshness and provenance

- Strict source-liveness verifies all 128 maintained source URLs with no failures or allowlist exceptions.
- The current freshness observation intentionally preserves 12 upstream-content changes in the review queue; it is not rerun merely to erase review work.
- Recorded and age-calculated freshness match for all 128 sources; persistent failures are zero.
- README badges, banner evidence counts, completion audit, and this report are checked together by `scripts/check-brand-evidence-stats.mts` to prevent count drift.

## Remaining manual responsibility

- Review the 12 upstream changes in `reports/review-queue.json` before updating the corresponding evidence summaries.
- Run periodic manual screen-reader and device testing in addition to automated WCAG checks.
