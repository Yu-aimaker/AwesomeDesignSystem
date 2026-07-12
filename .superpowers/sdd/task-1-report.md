# Task 1 report: monorepo foundation

## Outcome

Established the pnpm 10/Turborepo workspace foundation with strict shared TypeScript rules, pinned root tooling, deterministic verification scripts, Vitest workspace discovery, and Playwright defaults.

## TDD evidence

### Red

After adding only `tests/workspace.test.ts`, ran:

```text
rtk pnpm exec vitest run tests/workspace.test.ts
```

Exit code: `1`

Expected failure:

```text
ERR_PNPM_RECURSIVE_EXEC_NO_PACKAGE No package found in this workspace
```

This proved the smoke test could not run before the workspace manifest and test dependencies existed.

### Green

After adding the manifests and running `rtk pnpm install`:

```text
rtk pnpm exec vitest run tests/workspace.test.ts
```

Result: `1` test file passed, `2` tests passed.

Broader verification:

```text
rtk pnpm test
rtk proxy pnpm typecheck
rtk git diff --check
```

Result: all commands exited `0`; TypeScript reported no errors and the diff has no whitespace errors.

## Files

- Added `.npmrc`
- Updated `.gitignore`
- Added `package.json`
- Added `pnpm-lock.yaml`
- Added `pnpm-workspace.yaml`
- Added `playwright.config.ts`
- Added `tests/workspace.test.ts`
- Added `tsconfig.base.json`
- Added `turbo.json`
- Added `vitest.workspace.ts`

## Concerns

- Vitest 3.2.4 emits a deprecation warning for the explicitly required `vitest.workspace.ts` convention. A later coordinated Vitest 4 migration should move workspace projects into `test.projects`.
- RTK's optimized `rtk pnpm typecheck` handler currently strips the package script's TypeScript project arguments and runs bare `tsc`, which exits `1` with help text because this task intentionally provides `tsconfig.base.json`, not `tsconfig.json`. `rtk proxy pnpm typecheck` executes the exact package script and exits `0`; direct `rtk pnpm exec tsc --noEmit --project tsconfig.base.json` also exits `0`.
