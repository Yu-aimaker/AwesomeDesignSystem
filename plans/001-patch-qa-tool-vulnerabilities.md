# Plan 001: Close QA-tool and Canon-rendering security gaps

> Follow every step and verification gate. Do not publish or push. Drift check:
> `git diff --stat f2baed3..HEAD -- package.json apps/docs/package.json packages/*/package.json pnpm-lock.yaml apps/docs/lib/markdown.ts apps/docs/components/prose.tsx apps/docs/tests/markdown.test.ts apps/docs/next.config.ts`

## Status

- **Priority**: P0
- **Effort**: M
- **Risk**: LOW
- **Depends on**: none
- **Category**: security / dependencies
- **Planned at**: `f2baed3`, 2026-07-13

## Why this matters

`pnpm audit` reports a critical Vitest advisory and a high Playwright advisory.
Separately, `apps/docs/lib/markdown.ts:64` returns unsanitized HTML from `marked`,
and `apps/docs/components/prose.tsx:2` injects it through
`dangerouslySetInnerHTML`. External contributions make that a stored-XSS trust
boundary even though no current malicious document was found.
The completion matrix currently claims no unresolved Critical/High findings, so
all later QA evidence is built on an invalid baseline until these are patched.

## Current state

- `package.json:25` pins `@playwright/test` to `1.55.0`; the patched minimum for
  GHSA-7mvr-c777-76hp is `1.55.1`.
- Root and workspace manifests pin Vitest `3.2.4`; the patched minimum for
  GHSA-5xrq-8626-4rwp is `3.2.6`.
- The repository uses exact versions and pnpm `10.5.2`; preserve that convention.

## Scope

In scope: dependency manifests/lockfile, Markdown renderer and tests, and
defense-in-depth docs response headers. Out of scope: framework upgrades, public
package publication, and permitting arbitrary contributed HTML.

## Steps

1. Resolve the newest mutually compatible patched versions, keeping all
   workspace pins aligned. Update manifests and lockfile with pnpm.
2. Sanitize marked output server-side with a documented allowlist. Strip raw
   scripts, event attributes, dangerous URL protocols, unsafe SVG/MathML, and
   unsupported embedded HTML while preserving required headings, tables, code,
   links, and safe IDs.
3. Add regression tests for unsafe elements/attributes/protocols and safe
   Markdown. Add a restrictive CSP as defense in depth; sanitizer remains the
   primary boundary.
4. Run `pnpm audit --audit-level high`; expected: zero Critical/High advisories.
5. Run `pnpm typecheck && pnpm test`; expected: 7 workspaces and all tests pass.
6. Run `pnpm build` and `PLAYWRIGHT_PORT=3421 pnpm exec playwright test --retries=0`;
   expected: build exit 0 and all browser projects pass.
7. Inspect updated visual snapshots if the browser engine changed; never accept
   them solely because `--update-snapshots` produced files.

## Done criteria

- [ ] `pnpm audit --audit-level high` reports no Critical/High advisories.
- [ ] Unsafe Markdown fixtures cannot survive into rendered HTML.
- [ ] Unit, type, build, E2E, axe, RTL/reflow, and visual checks pass.
- [ ] Only in-scope security files and reviewed snapshots changed.

## STOP conditions

Stop if the patched versions require a major framework migration, an advisory
has no patched compatible release, or sanitization breaks a documented required
embed whose safe allowlist cannot be justified.
