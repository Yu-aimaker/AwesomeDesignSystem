# Plan 004: Create one executable component-contract registry

> Drift check: `git diff --stat f2baed3..HEAD -- packages/react apps/docs/lib/components-catalog.ts apps/docs/components/component-live.tsx 'apps/docs/app/components/[slug]/page.tsx' content/artifacts tests`

## Status

- **Priority**: P1
- **Effort**: L
- **Risk**: MED
- **Depends on**: plans 001 and 002
- **Category**: architecture / docs / tests
- **Planned at**: `f2baed3`, 2026-07-13

## Why this matters

The 32-item docs catalog is a second metadata source and is already divergent:
implementation and docs claim different rule IDs for Button and Link. Detail
pages (`apps/docs/app/components/[slug]/page.tsx:24-47`) omit the required API,
anatomy, keyboard, screen-reader, RTL, high-contrast, reduced-motion, and content
contracts. Example strings are displayed but never compiled.

## Target contract

One typed, server-safe registry owns name/family/rules/states/contracts/examples;
React components may attach or import the same metadata, but cannot redefine it.
Every rule ID resolves in the evidence graph and every interactive component has
named automated coverage.

## Scope

In scope: React metadata/tests, docs registry/detail renderer/live fixtures,
artifact claims and registry validation. Out of scope: redesigning public props
unless documentation proves an actual accessibility defect; adding hundreds of
new components.

## Steps

1. Define a Zod/TypeScript component contract containing anatomy, typed API,
   variants/states, keyboard behavior, screen-reader behavior, content rules,
   RTL, high contrast, reduced motion, rule IDs, test IDs, and reviewed examples.
2. Migrate 32 components into that registry and remove duplicated metadata.
   Reconcile each mismatch against implementation and canon evidence.
3. Render all contract sections on detail pages with locale-aware headings and
   explicit fallback language for untranslated prose.
4. Replace free-form example strings with typed fixtures that both render and
   produce copyable source. Add compile/import smoke tests for every example.
5. Add manifest validation: unique slugs/imports, resolvable rules/artifacts,
   live preview for every slug, required contracts by interactivity class, and
   automated test linkage.
6. Add missing direct tests for Textarea, AlertDialog, every keyboard overlay,
   and disabled/error/controlled edge cases revealed by the registry.
7. Correct AlertDialog's false confirmation contract: Confirm and Cancel must
   have distinct callbacks, async confirmation/loading/error behavior must be
   representable, and destructive work must never run from the close path.

## Verification

- Registry test covers exactly 32 unique entries and reports zero missing fields.
- Every example compiles against public `@awesome-ds/react` exports.
- AlertDialog tests prove confirm, cancel, Escape, async pending, and failure are
  distinct paths with correct focus restoration.
- `pnpm test`, `pnpm validate`, `pnpm typecheck`, and full Playwright all pass.
- Search confirms component rule metadata has a single authoritative definition.

## STOP conditions

Stop if consolidation would import client-only React modules into server content,
if a documented behavior cannot be proven by implementation/tests, or if a
public API break is needed; report that component separately before changing it.
