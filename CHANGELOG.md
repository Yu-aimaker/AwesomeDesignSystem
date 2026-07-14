# Changelog

## 0.2.0 — AwesomeDS Platform (2026-07-13)

Major upgrade from a Markdown + skills knowledge base into an **executable, evidence-linked design platform**.

### Added

- pnpm / Turborepo monorepo (Node ≥ 22.12, pnpm 10.5.2)
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
