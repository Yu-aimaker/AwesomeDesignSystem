# Plan 005: Make dynamic docs localized and link-safe

> Drift check: `git diff --stat f2baed3..HEAD -- apps/docs/lib/i18n.ts apps/docs/lib/markdown.ts apps/docs/lib/components-catalog.ts apps/docs/app/components apps/docs/app/motion apps/docs/app/references apps/docs/app/canon tests apps/docs/app/sitemap.ts`

## Status

- **Priority**: P1
- **Effort**: M
- **Risk**: LOW
- **Depends on**: plans 002 and 004
- **Category**: correctness / docs / i18n
- **Planned at**: `f2baed3`, 2026-07-13

## Why this matters

REQ-021 claims English/Japanese site localization, but component detail headings
are hard-coded at `apps/docs/app/components/[slug]/page.tsx:26-47`; motion labels
are hard-coded at `apps/docs/app/motion/[slug]/page.tsx:14-20`; reference-detail
headings are hard-coded at `apps/docs/app/references/[id]/page.tsx:21-30`.
The component breadcrumb also links to unlocalized `/components`.
Canon rendering has two separate correctness defects: `markdown.ts:64` sends
frontmatter through `marked`, exposing YAML as headings, and relative `.md`
links are not rewritten to locale-aware Canon routes, producing 404s.

## Target contract

All route chrome and instructional labels are reviewed English/Japanese. Domain
content may remain canonical English only when an explicit, localized fallback
notice identifies the source language. Locale, query, and hash survive every
internal navigation. Frontmatter is metadata, never body content, and internal
Markdown links resolve to existing localized Web routes.

## Scope

In scope: dictionaries/locale schemas, component/motion/reference details,
localized links/metadata/sitemap, i18n/E2E/visual/axe tests. Out of scope: machine
translation of canonical research, adding a third locale, deployment.

## Steps

1. Inventory every visible literal under `apps/docs/app` and components used by
   docs. Classify as shell label, translatable product prose, canonical source,
   code identifier, or proper noun.
2. Parse and schema-check frontmatter before Markdown rendering; pass only the
   body to `marked` and expose approved metadata separately.
3. Rewrite relative internal `.md` links at the Markdown AST/token stage using
   the current document path and locale. Preserve external URLs, anchors,
   downloads, code, and images. Reject traversal outside `design-system/`.
4. Add typed dictionary keys for all shell/contract labels. Store reviewed JA
   component/recipe prose in the registry where available; otherwise render the
   same fallback notice contract used by Canon.
5. Replace every hard-coded internal path with `localizePathname`; verify query
   and fragment preservation and correct `html lang` after full-document locale
   switches.
6. Localize per-route metadata and accessible names, not just visible headings.
7. Add route-crawl tests over every `/ja` primary and dynamic route: no unexpected
   English chrome, no locale-dropping internal link, one explicit fallback notice
   for English canonical content, no missing translations.
8. Add JA detail visual/axe coverage at desktop and 320px; inspect line breaks,
   palt/strict breaking, code overflow, focus, and table containment.

## Verification

- Dictionary parity test passes with no missing keys.
- Frontmatter keys do not appear in rendered body HTML; all 39 known internal
  Markdown links resolve, and a repository-wide link crawl finds zero Canon 404s.
- Dynamic route crawl covers all 32 component, all motion, and all reference IDs.
- Full Playwright matrix passes with retries disabled; axe has zero serious or
  critical findings; 320px pages have no viewport overflow outside intentional
  scroll containers.
- REQ-021 returns to `done/proven` only after those gates pass.

## STOP conditions

Stop if a translation changes a canonical technical meaning, if source license
does not permit translated reproduction, or if locale preservation requires a
new routing architecture outside these files.
