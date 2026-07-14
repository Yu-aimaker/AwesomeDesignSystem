# Glanceable and live surfaces

These surfaces borrow attention; they are not miniature applications. Put the
most relevant, time-sensitive fact first, expose at most the few actions that
remain safe without full context, and deep-link into the destination app.

## Surface contract

| State | Must communicate | Required behavior |
|---|---|---|
| Placeholder/redacted | Shape and category without private content | Avoid layout jumps; respect locked/private contexts |
| Loading | That current data is pending | Preserve last trustworthy value when safer than blankness |
| Current | Primary value, freshness, identity | Use plain units and a stable hierarchy |
| Updating | Continuity, not noisy progress | Coalesce updates; preserve position and meaning |
| Stale | Last update and uncertainty | Never imply stale information is live |
| Paused/offline | Why updates stopped | Offer a relevant recovery or app handoff |
| Ended | Final outcome and terminal status | Stop animation and live claims; retain only useful history |
| Failed | Failure without sensitive internals | Provide safe retry or direct destination |

## Rules

- Design one information hierarchy across small, compact, expanded, lock,
  tinted, and accessibility presentations; do not squeeze one composition.
- Treat freshness, update cadence, privacy, and lifecycle as part of content.
- Use live animation only to explain meaningful change. Respect reduced motion,
  power, data, and attention constraints.
- Keep interactions few, reversible where possible, and proportionate to the
  context available. Consequential work belongs in the full app.
- Every actionable region has a precise accessible name and destination.
- Test with long values, missing imagery, unknown end times, simultaneous
  activities, locale expansion, and content redaction.

## Review prompts

- Can a person understand identity, value, and freshness in one glance?
- What appears when data is stale, hidden, late, interrupted, or complete?
- Does tapping any region open the exact related destination?
- Would showing this content on a shared or locked surface cause harm?

Sources: [Apple HIG Widgets](https://developer.apple.com/design/human-interface-guidelines/widgets)
and [Live Activities](https://developer.apple.com/design/human-interface-guidelines/live-activities),
observed 2026-07-13.
