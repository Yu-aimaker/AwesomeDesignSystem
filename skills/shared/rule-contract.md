# AwesomeDS rule & evidence contract

## IDs
- Canon rules: `rule.<domain>.<slug>` in `content/canon/`
- References: `ref.<owner>.<slug>` in `content/references/`
- Signals (not canon): `signal.*` in `content/signals/`
- Artifacts: `artifact.*` in `content/artifacts/`

## Agent obligations
1. Load `DESIGN.md` + `design-system/INDEX.md` before inventing UI.
2. Cite `rule.*` IDs in design decisions.
3. Compose from `@awesome-ds/react` + `@awesome-ds/tokens` + `@awesome-ds/motion` when implementing.
4. Use IQ-* checklist in `design-system/review/interface-quality-checklist.md` for reviews.
5. Never promote X/social posts into canon without human corroboration.
6. Validate graph with `pnpm validate` when adding doctrine.
7. For AwesomeDS-facing surfaces, load `design-system/brand/awesomeds-brand.md` and preserve its proof-mark, ember, registration-label, voice, and motion grammar across media. Third-party products keep their own brand contracts.

## Local docs
```bash
pnpm --filter @awesome-ds/docs dev
```
Routes: `/canon`, `/components`, `/motion`, `/references`, `/playground`, `/status`, `/review`
