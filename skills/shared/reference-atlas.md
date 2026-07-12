# Reference Atlas

Structured evidence for AwesomeDS conclusions.

## Where
- Data: `content/references/*.json` (schema via `@awesome-ds/content`)
- Site: `/references` and `/references/[id]`
- Status: `/status`

## How to use
1. Search by topic/sourceClass/region/freshness.
2. Read lessons + linked `rule.*` IDs.
3. Follow anti-imitation notes — transfer principles only.
4. Duolingo Design is fully inventoried as `ref.duolingo.*` (hub + subpages).

## Adding a source
1. Create JSON matching ReferenceRecord schema.
2. Link `linkedRuleIds`.
3. Run `pnpm validate`.
