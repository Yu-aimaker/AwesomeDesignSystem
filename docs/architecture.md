# Architecture

AwesomeDS platform is a pnpm monorepo:

- `content/` — Reference Atlas, canon rules, signals, artifact claims
- `packages/content` — Zod schemas, evidence graph, loaders, freshness
- `packages/tokens` — semantic multi-theme tokens + generators
- `packages/core` — framework-independent utilities/CSS
- `packages/motion` — intent recipes + reduced motion
- `packages/react` — accessible React reference components
- `packages/brand` — executable brand manifests, lexicon contracts, and copy linting
- `apps/docs` — local Next.js 16 documentation and explorers, localized under `/en/*` and `/ja/*`
- `design-system/` — human-readable canon Markdown
- `skills/` — agent entry points (legacy names preserved)

Data flows: sources → structured records → canon rules → tokens/components/motion → docs/skills → validation.

Locale negotiation lives at the request boundary (`proxy.ts` and server-only locale helpers); browser-safe dictionaries and path helpers remain separate. English is the canonical Markdown source. Japanese UI is first-class, while untranslated canon pages display an explicit fallback notice and source language.
