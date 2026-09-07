# Layers

Stacking order is a ladder of eight named steps. Every overlay takes its `z-index` from a token,
so two components can never fight over who is on top and a fix never needs a bigger number.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Steps | base 0, raised 10, sticky 20, overlay 30, dropdown 40, dialog 50, toast 60, tooltip 70 | Eight covers every case in shadcn, Radix and Material; gaps of 10 leave room without ad hoc values. |
| Tooltip on top | 70, above toasts and dialogs | A tooltip belongs to the element under the pointer, wherever that element is. |
| Toast above dialog | 60 over 50 | A save confirmation must be readable while a dialog is open. |
| Scrim | `overlay` 30, `rgb(10 10 10 / 0.4)` light, `/ 0.6` dark | One scrim for sheets and dialogs; it dims, never blurs, for performance. |
| Portals | dialogs, dropdowns, toasts, tooltips render at `<body>` | Escapes `overflow: hidden` and transforms that create new stacking contexts. |
| Native `<dialog>` | preferred; the top layer wins over any `z-index` | The browser handles focus trap, `Esc` and inert background. |
| Forbidden | `z-index: 9999`, any value not from the ladder | If a component needs more, the ladder is wrong, not the number. |

## Tokens

```css
--ds-z-base: 0; --ds-z-raised: 10; --ds-z-sticky: 20; --ds-z-overlay: 30;
--ds-z-dropdown: 40; --ds-z-dialog: 50; --ds-z-toast: 60; --ds-z-tooltip: 70;
```

Sticky headers use `sticky` (20). A card that lifts on hover uses `raised` (10) only while it
carries a shadow; the shadow, not the z-index, communicates elevation (see elevation.md).

## Stacking contexts

`transform`, `filter`, `opacity < 1` and `will-change` create stacking contexts. A dropdown
inside a transformed card is trapped under its siblings no matter its z-index. Render it in a
portal, or drop the transform from the container.

## Alternatives considered

- Single `z-index: 1000` for all overlays: order between two open overlays becomes DOM order,
  which changes with code splitting.
- Float-based ordering (no z-index at all): fails for sticky headers over content with shadows.

## Sources

- MDN, Stacking context: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context
- MDN, The top layer: https://developer.mozilla.org/en-US/docs/Glossary/Top_layer
- Material 3, Elevation and z-order: https://m3.material.io/styles/elevation/applying-elevation
- Radix Primitives, Portal: https://www.radix-ui.com/primitives/docs/utilities/portal
