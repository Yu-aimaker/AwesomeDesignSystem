# Brand typography contract

## Principle

Typography is a system of roles and measurable constraints. A recognizable
display face never excuses illegibility, missing scripts, or unlicensed use.

## Required contract

For every role record family, source and license, weights/styles, scripts,
fallback stack, variable axes, optical sizing, size range, line height,
tracking, case, alignment, maximum measure, maximum display-word count, and
allowed channels. Record fallback metric overrides (`size-adjust`, ascent,
descent, line-gap) to limit layout shift.

Define at least display, heading, body, UI, label, numeric/data, and code roles.
Pairings need a contrast rationale and hierarchy test, not merely two font
names. Brand names and product names need explicit typesetting rules.

## International contract

Script coverage is a release requirement. Assign locale owners and test real
strings for CJK line breaking, Arabic shaping, RTL mirroring, diacritics,
Devanagari clusters, long German compounds, and tabular numerals. Preserve
hierarchy across fallbacks rather than forcing identical metrics at any cost.

## QA evidence

- Specimens at viewport extremes, 200% zoom, bold-text settings, and all supported scripts.
- Overflow, wrapping, truncation, font-loading, CLS, and missing-glyph tests.
- Contrast and minimum-size checks in every state; print proof when print is supported.
- License, subset, preload, privacy, and performance review before distribution.

## Agent rule

Use role tokens only. Do not introduce a font because it resembles a reference,
compress copy to hide overflow, or apply display styling beyond its word budget.

