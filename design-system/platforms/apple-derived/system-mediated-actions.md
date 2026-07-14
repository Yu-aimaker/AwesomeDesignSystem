# System-mediated actions

Model product capabilities as a semantic API, not as screen automation. A
system surface needs identifiable entities, bounded actions, concise results,
and direct destinations even when the main interface is not visible.

## Entity contract

Each exposed entity declares stable identity, display representation, privacy
class, searchable terms, destination, stale/missing behavior, and which actions
are permitted. Each action declares inputs, defaults, validation, authorization,
latency, progress, cancellation, confirmation, result, and undo/recovery.

## Result contract

- Rank by user intent and relevance, not promotional preference.
- Return a small, legible set; disclose ambiguity instead of pretending certainty.
- Identify each result within a few text lines and give it a precise accessible
  label.
- Open the selected entity or result directly, preserving context.
- Keep foreground work lightweight; communicate progress for longer work.
- Handle zero, denied, unavailable, partial, stale, duplicate, and failed results.
- Preview consequential actions and require confirmation proportional to risk.

## Cross-surface review matrix

Test voice-only, text query, keyboard, visual result, no-screen, locked/private,
offline, and interrupted execution. Verify localized synonyms, ambiguous names,
large result sets, no results, revoked permission, and account changes.

When a platform capability is unavailable, provide a normal deep link or app
workflow. Never trap a core task inside a proprietary system surface.

Sources: [Apple HIG Siri](https://developer.apple.com/design/human-interface-guidelines/siri),
[Apple HIG App Shortcuts](https://developer.apple.com/design/human-interface-guidelines/app-shortcuts),
and [WWDC26 visual intelligence guidance](https://developer.apple.com/videos/play/wwdc2026/297/),
observed 2026-07-13.
