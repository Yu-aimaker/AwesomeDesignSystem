# Changelog

## 0.4.0 — CMY Rebrand + LP Site (2026-07-16)

- Restored the **CMY logomark** (cyan · magenta · yellow subtractive mixing) and designed OKLCH spectrum as the brand signature (banner, OG, icons, diagrams).
- Retired the ember “proof mark” identity; interactive chrome now uses deep magenta `--color-accent` in the docs brand layer only.
- Rebuilt the docs site shell as a top-header LP layout (mega “All docs” menu, no sidebar rail).
- Redesigned the home page as a playful LP: hero, Dotto mascot moods, promise cards, spectrum stage, live components, motion library, skill install, Atlas, closing doors.
- Updated brand bible, DESIGN.md, skills identity notes, EN/JA copy, and unit/e2e/no-js tests to the new IA.

## 0.3.0 — Proof Grammar Rebrand (2026-07-16)

- Rebuilt the docs narrative around START, EXPLORE, BUILD, and VERIFY, with an interactive Proof Calibrator and evidence-first home page.
- Established the AwesomeDS brand system across site, five localized READMEs, banner, OG, icons, diagrams, token boundaries, motion, copy, and distributed skills.
- Expanded the validated graph to **128** references, **47** canon rules, **54** artifacts, and **6** quarantined signals.
- Added native English/Japanese brand contract and personality content plus accessible stacked mobile diagrams.
- Separated neutral framework-package accents from the AwesomeDS-only ember brand layer.
- Added locale-aware metadata, locale-neutral PWA/OG surfaces, maskable icons, strict nonce CSP, OSV/Dependabot automation, and runtime/bundle budgets.
- Strengthened browser QA with hydrated WCAG scans, 1px mobile reflow, forced-RTL logical-layout bounds, 1% visual tolerance, and EN/JA brand desktop/mobile baselines for macOS and Linux.
- Removed Japanese webfont payloads and split lightweight metadata/runtime entry points from authoring-only catalogs.

## 0.2.0 — AwesomeDS Platform (2026-07-13)

Major upgrade from a Markdown + skills knowledge base into an **executable, evidence-linked design platform**.

### Added

- pnpm / Turborepo monorepo (Node ≥ 22.13.0, pnpm 10.5.2)
- `@awesome-ds/content` — Zod-validated evidence graph (references, canon rules, artifacts, signals)
- `@awesome-ds/tokens` — semantic multi-theme OKLCH tokens + CSS generators
- `@awesome-ds/core` — framework-neutral utilities and design / AI interaction contracts
- `@awesome-ds/motion` — intent-based motion recipes with reduced-motion support
- `@awesome-ds/react` — 32-component accessible baseline (React Aria overlays / keyboard contracts)
- `@awesome-ds/brand` — brand manifest, Product Lexicon schema, copy linting
- `apps/docs` — local Next.js 16 site: EN/JA routes, Reference Atlas, canon, components, motion, playground, Brand Workbench, status
- Structured Reference Atlas with **105** curated first-party records (medium, drift risk, verification cadence)
- **42** traceable canon rules and **54** implementation / verification artifacts
- **6** quarantined emerging signals (no auto-promotion)
- Brand / platform / AI-UX doctrine expanded from Duolingo Design (17/17 public pages), Apple HIG, and elite design-system landscape audits
- First-party accessibility operational guides for Material, Fluent, Polaris, Atlassian, Primer, Spectrum, Carbon, GOV.UK
- Visual, RTL, zoom/reflow, axe, keyboard, localization, graph-coverage, and freshness regression suites
- Governance scripts: `validate`, `check:links`, `check:freshness`, `evidence:check`, package smoke
- GitHub Actions CI + freshness workflow stubs
- Expanded `design-system/` modules: brand, AI-driven design, interaction recovery, platforms, case studies, governance

### Preserved

- Markdown design-system knowledge base and progressive-disclosure routing via `design-system/INDEX.md`
- Five public agent skills + `install.sh` (symlink / copy modes hardened)
- Multilingual READMEs (EN / JA / ZH-Hans / KO / ES), research notes, MIT license

### Intentional constraints (this release)

- Docs site is **local-only** (no production deploy in this phase)
- Package publication to npm is out of scope
- Canon Markdown remains English-first; Japanese UI labels English fallback content when translations are not yet reviewed

## 0.1.0 — Initial public knowledge base

- AI-agent-first Markdown design system + five Claude Code skills
- Research corpus and anti-slop principles
- Multilingual READMEs and install script
