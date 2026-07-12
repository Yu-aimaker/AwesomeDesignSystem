---
title: "Sound & Haptics (Optional Brand Layer)"
updated: 2026-07-13
status: canonical
---

# Sound & Haptics

Many elite consumer brands treat sonic identity as part of the same personality contract as color and type (Apple HIG audio guidance, game/learning apps, hardware brands).

## Principles

1. Sound communicates state, not noise.
2. Respect system silent mode and user mute.
3. Pair critical alerts with visual + text (never sound-only).
4. Haptics follow the same intent recipes as motion (feedback, success, warning).
5. Reduced sensory settings: provide opt-out and non-sensory alternatives.

## Token sketch

- `--sound-success`, `--sound-error`, `--sound-tap` (asset IDs, not binary blobs in repo)
- Intensity roles: subtle / standard / emphatic
- Max concurrent sound events: 1 UI sound at a time unless orchestrated

## Linked rules
- `rule.brand.cross-medium-coherence`
- `rule.a11y.wcag-aa`
