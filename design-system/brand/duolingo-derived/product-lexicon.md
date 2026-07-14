# Product lexicon schema and lint contract

## Principle

A product lexicon is governed domain data. It connects public language,
internal concepts, UI strings, localization, analytics, code, and support.

## Term record

Each canonical term declares stable ID, display form, definition, concept ID,
owner, audience scope (`public`, `internal`, or both), part of speech, plural or
inflection guidance, approved examples, aliases, discouraged and forbidden
forms with reasons, related/opposed terms, product/API/code names, locales,
status (`draft`, `active`, `deprecated`, `retired`), introduced date,
replacement, deprecation date, and review date.

Aliases aid search; they do not automatically become approved copy. A forbidden
form requires a replacement and rationale. Locale entries map concepts rather
than word-for-word strings and may record grammatical gender, counters,
inflection, pronunciation, or deliberate non-translation.

## Lint behavior

- Error: forbidden active term, retired public term, incorrect protected casing.
- Warning: discouraged form, internal-only term in public copy, deprecated term before removal date.
- Advice: ambiguous alias or a term due for review.
- Ignore code identifiers and quoted historical text only through scoped rules.

Every finding returns rule ID, matched span, concept, reason, replacement,
owner, and documentation link. Autofix is allowed only when replacement is
unambiguous and grammatical context cannot change it.

## Governance and QA

Term proposals identify the concept and affected surfaces. Owners coordinate
copy, code, API, analytics, search, support, and locale migrations. CI tests
golden fixtures, duplicate concepts, alias collisions, missing replacements,
invalid lifecycle dates, orphan locales, and stale review dates.

