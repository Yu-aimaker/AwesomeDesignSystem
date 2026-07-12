# Architecture

AwesomeDS platform is a pnpm monorepo:

- `content/` — Reference Atlas, canon rules, signals, artifact claims
- `packages/content` — Zod schemas, evidence graph, loaders, freshness
- `packages/tokens` — semantic multi-theme tokens + generators
- `packages/core` — framework-independent utilities/CSS
- `packages/motion` — intent recipes + reduced motion
- `packages/react` — accessible React reference components
- `apps/docs` — local Next.js documentation and explorers
- `design-system/` — human-readable canon Markdown
- `skills/` — agent entry points (legacy names preserved)

Data flows: sources → structured records → canon rules → tokens/components/motion → docs/skills → validation.
