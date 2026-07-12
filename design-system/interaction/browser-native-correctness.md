---
title: "Browser-Native Correctness"
updated: 2026-07-13
status: canonical
---

# Browser-Native Correctness

Design is incomplete if it breaks browser contracts. Synthesized from Vercel guidelines + platform docs.

## Non-negotiables

1. **URL state** for filters, tabs, dialogs, pagination when shareable.
2. **Back/Forward** restores prior UI + scroll when expected.
3. **Real links** for navigation (middle-click, open in new tab).
4. **Forms**: Enter submits, Escape cancels where modal, errors announced.
5. **Zoom & reflow** work at 200% and 320px width.
6. **Safe areas** on notched devices.
7. **Autofill & paste** never broken for credentials/fields.
8. **Hydration** does not steal focus or wipe values.
9. **Locale** from language prefs, not IP.
10. **`translate="no"`** on brand/code tokens.

## Linked rules
- `rule.interaction.url-state`
- `rule.interaction.interface-quality`
