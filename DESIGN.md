# AwesomeDS — DESIGN.md (agent-readable)

> Machine-oriented design contract for coding agents. Humans should start at `design-system/INDEX.md`.

## Product thesis
Avoid the median. Compose approved tokens and components. Cite `rule.*` IDs. Trace claims to `ref.*` evidence.

## Visual language (semantic tokens only)
- Background: `--color-bg` (white base for light)
- Text: `--color-fg` / muted roles
- Accent actions: `--color-accent` + `--color-accent-fg`
- Borders: hairline `--color-border`
- Space: `--space-*` (4/8pt rhythm)
- Type: `--font-display` for headings, `--font-body` for UI, JP stacks included
- Motion: `--dur-*` + recipes in `@awesome-ds/motion`; honor `prefers-reduced-motion`

## Component policy
- Use `@awesome-ds/react` primitives for interactive UI.
- Every control needs idle/hover/focus/disabled (+ loading/error where relevant).
- No raw hex/oklch in product UI code — tokens only.
- Empty/loading/error are required product states.

## Evidence policy
- Canon rules: `content/canon/`
- References: `content/references/`
- Emerging X/social: `content/signals/` only (never auto-promote)
- Validate graph: `pnpm validate`

## Agent workflow
1. Read this file + `design-system/INDEX.md`
2. Pick rule IDs for the task
3. Implement with tokens/components
4. Run `pnpm test` / `pnpm validate` as applicable
5. Link new doctrine to references before claiming canon

## Docs site (local)
```bash
pnpm install
pnpm --filter @awesome-ds/docs dev
```
