# Capability-first adaptation

Preserve product intent; adapt its presentation and interaction. Device names
are weak proxies. Declare capabilities explicitly and provide a fallback for
every required capability.

| Axis | Values to test | Adaptation question |
|---|---|---|
| Input | coarse touch, pointer, keyboard, remote/controller, crown, voice, gaze + pinch, direct manipulation | Can the same intent be completed without precision, hover, or gesture memory? |
| Presentation | compact screen, resizable window, multi-pane canvas, widget, ambient/live surface, volume, shared/full space | What information and action survive this budget? |
| Attention | focus, divided attention, glance, hands-free, immersive | How quickly must meaning be acquired and interruption recovered from? |
| Navigation | peers, drill-down, selection + detail, modal task, system result | Are back, close, dismiss, restoration, and deep-link semantics unambiguous? |
| Access | text scale, bold text, contrast, transparency, motion, color differentiation, screen reader, switch/voice control, captions | Is the alternative semantically equivalent rather than merely present? |
| Environment | light/dark, variable background, distance, outdoor light, low power, limited performance, vestibular sensitivity | What degrades first, and does legibility or task completion ever degrade? |

## Component declaration

For each component or pattern record:

```yaml
intent: confirm a consequential action
presentation: [compact, window]
input: [touch, pointer, keyboard, voice-control]
focus-order: trigger -> explanation -> cancel -> confirm
text-scaling: reflow; no truncation at largest supported size
rtl: logical order; directional icon mirrors only when meaning mirrors
preferences: reduced-motion, increased-contrast, reduced-transparency
fallback: inline confirmation when modal presentation is unavailable
restoration: return focus and preserve form state
```

## Required tests

- Compact and regular widths; narrow and very wide windows.
- Touch, pointer, keyboard, screen reader, and voice/switch paths.
- Largest text, long localized content, RTL, bold text, increased contrast.
- Reduced motion and transparency, low-power or degraded rendering.
- Interruption, relaunch, deep link, and restoration.

Use system conventions as the baseline grammar. Brand divergence is valid only
when it remains learnable, complete, accessible, and consistent.

Sources: [Apple HIG Layout](https://developer.apple.com/design/human-interface-guidelines/layout),
[Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility),
and [Navigation and search](https://developer.apple.com/design/human-interface-guidelines/navigation-and-search),
observed 2026-07-13.
