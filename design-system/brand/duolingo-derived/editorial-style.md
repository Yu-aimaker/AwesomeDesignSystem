# Editorial style contract

## Principle

Editorial style is executable policy by locale and channel. Universal rules
cover clarity and harm; locale profiles own grammar and convention.

## Profile schema

Each profile declares locale, channel, owner, reading level target, formality,
pronouns, capitalization, punctuation, numerals, dates, time, currency,
percentages, units, contractions, abbreviations, emoji, links/email, lists,
emphasis, product-name casing, inclusive-language rules, accessibility rules,
examples, exceptions, and version.

Rules have stable IDs and severity (`error`, `warning`, `advice`). Exceptions
must name scope, reason, approver, and expiry. Product UI, help, legal,
notification, social, and developer documentation may extend—not silently
contradict—the locale baseline.

## Interface rules

Front-load distinguishing words; buttons name the action; errors state problem
and recovery; labels remain stable; avoid directional language when structure
can change; never encode meaning in emoji alone; expose full link purpose;
respect screen-reader pronunciation and voice-control discoverability.

## Lint contract

Lint deterministic rules only: forbidden forms, casing, spacing, numeric
formats, unapproved emoji, inaccessible links, and lexicon terms. Subjective
voice scoring remains review evidence and must show rationale. Golden fixtures
contain accepted, rejected, and exception cases for every error-level rule.

## Agent rule

Load locale + channel profile + product lexicon before writing. If profiles
conflict or are missing, preserve meaning and flag review rather than applying
US-English defaults.

