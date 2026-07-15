# QA Report — AwesomeDS Platform

**Date:** 2026-07-13  
**Branch:** `feat/awesome-ds-platform`  
**Round:** final integration and localization hardening

## Environment

- Node: `>=22.13.0`
- pnpm: `10.5.2`
- Next.js: `16.2.10`
- React: `19.2.7`
- Playwright + `@axe-core/playwright`

## Commands & results

| Command                                | Result                                                                            |
| -------------------------------------- | --------------------------------------------------------------------------------- |
| `pnpm test`                            | **194 passed** (26 files)                                                         |
| `pnpm validate`                        | **105 refs / 42 rules / 54 artifacts / 6 signals / 0 issues**                     |
| `pnpm --filter @awesome-ds/docs build` | Pass (**329 generated pages**)                                                    |
| `pnpm qa:full` Playwright, retries 0   | **78 passed** (E2E + JA SSR crawl + keyboard + RTL/reflow + axe + visual + no-JS) |
| Visual suite                           | **12 passed** (themes, JP details/mobile, RTL, reduced motion)                    |
| `pnpm packages:smoke`                  | **6 ESM + declaration artifact sets**                                             |
| `pnpm check:links -- --strict`         | **105 checked / 0 failures / 0 allowlisted**                                      |
| Two consecutive freshness observations | **105 unchanged / 0 false changes / 0 fetch failures** on second run              |
| `pnpm audit --audit-level low`         | **No known vulnerabilities**                                                      |

## Research and implementation evidence

| Area          | Outcome                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Duolingo      | 17/17 public Design pages audited; transferable doctrine implemented under `design-system/brand/duolingo-derived/`                   |
| Apple         | Current HIG/platform guidance audited; product doctrine implemented under `design-system/platforms/apple-derived/`                   |
| Elite systems | Cross-system synthesis implemented under `design-system/case-studies/elite-systems/`                                                 |
| Localization  | English/Japanese routes and Brand Workbench, locale-preserving navigation, `lang`/`dir`, hreflang + x-default, and explicit fallback |
| Traceability  | Reference/component/canon → rule → navigable artifact → sources/verification, plus test-to-artifact graph edges                      |

## A11y fixes this round

- Darkened accent/danger semantic tokens for AA contrast on white text
- Labeled Reference Atlas filter controls
- Accent badge border treatment (no low-contrast tinted text)
- Axe critical/serious allowlist removed after fixes
- Forced-colors system-color boundaries and focus states verified in Chromium
- Tooltip trigger composition prevents nested interactive controls for ADS, native, and custom children

## Final live governance evidence

- Strict links: 105 checked, 0 failed, 0 allowlisted.
- Freshness second observation: 105 unchanged, review queue 0, persistent failures 0.
- GitHub API adapter health is tracked separately from HTML content changes, including aged strict failures and recovery.
- Generated component claims and backlinks are both checked for drift: 32 component claims, 105 references, 42 rules, 54 artifacts.

## Intentional constraints

- The site remains local-only; deployment and package publication are outside this phase.
- Canon Markdown is English-first. Japanese UI clearly labels English fallback content until reviewed translations are added.
