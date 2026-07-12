# QA Report — AwesomeDS Platform

**Date:** 2026-07-13  
**Branch:** `feat/awesome-ds-platform`  
**Round:** final integration and localization hardening

## Environment

- Node: `>=22.12.0`
- pnpm: `10.5.2`
- Next.js: `16.2.10`
- React: `19.2.7`
- Playwright + `@axe-core/playwright`

## Commands & results

| Command | Result |
|---|---|
| `pnpm test` | **79 passed** (17 files) |
| `pnpm validate` | **97 refs / 42 rules / 20 artifacts / 6 signals / 0 issues** |
| `pnpm --filter @awesome-ds/docs build` | Pass (**217 generated pages**) |
| Focused flaky-test stress run | **39 passed**, three consecutive passes, retries disabled |
| Full Playwright matrix, retries disabled | **27 passed** (E2E + RTL/reflow + axe + visual) |
| Visual suite | **4 passed**, including English/Japanese home, components, and full Atlas |
| `pnpm tokens:build` | Pass |

## Research and implementation evidence

| Area | Outcome |
|---|---|
| Duolingo | 17/17 public Design pages audited; transferable doctrine implemented under `design-system/brand/duolingo-derived/` |
| Apple | Current HIG/platform guidance audited; product doctrine implemented under `design-system/platforms/apple-derived/` |
| Elite systems | Cross-system synthesis implemented under `design-system/case-studies/elite-systems/` |
| Localization | English/Japanese routes, negotiation, locale-preserving navigation, `html lang`, sitemap, and explicit canon fallback |

## A11y fixes this round

- Darkened accent/danger semantic tokens for AA contrast on white text
- Labeled Reference Atlas filter controls
- Accent badge border treatment (no low-contrast tinted text)
- Axe critical/serious allowlist removed after fixes

## Intentional constraints

- The site remains local-only; deployment and package publication are outside this phase.
- Canon Markdown is English-first. Japanese UI clearly labels English fallback content until reviewed translations are added.
