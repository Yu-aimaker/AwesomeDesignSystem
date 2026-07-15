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

## Security and rendering boundary

Localized HTML is intentionally request-rendered. The proxy creates a fresh nonce for every document response and sends a strict `script-src` policy; Next.js applies that nonce to its bootstrap scripts and AwesomeDS applies it to JSON-LD. Static HTML/ISR would require a fixed inline-script hash manifest or a weaker `unsafe-inline` policy, so the site chooses nonce-based XSS containment and deduplicates data work within the document boundary instead. Machine assets (`opengraph-image`, manifest, robots, sitemap, icons, and APIs) bypass locale rewriting and remain directly cacheable.

Performance is guarded separately: persistent navigation does not prefetch every documentation route, fonts are unicode-ranged and self-hosted, and `pnpm performance:check` caps each route's uncompressed first-load JavaScript at 850 kB. Treat Cache Components/PPR as the next optimization boundary; do not weaken CSP to make the route table appear static.
