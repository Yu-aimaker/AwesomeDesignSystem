# Maintenance

## Local commands

```bash
pnpm install
pnpm dev                 # docs + package watchers via turbo
pnpm --filter @awesome-ds/docs dev
pnpm test
pnpm typecheck
pnpm validate
pnpm check:freshness
pnpm check:links
pnpm qa
```

## Adding a reference

1. Add `content/references/ref-*.json` matching the schema.
2. Link `linkedRuleIds` to existing or new canon rules.
3. Run `pnpm validate`.
4. Optionally refresh `pnpm check:freshness`.

## Promoting a signal

Signals in `content/signals/` never auto-promote. Require corroborating primary source, implementation evidence, and a11y/performance review before creating a canon rule.
