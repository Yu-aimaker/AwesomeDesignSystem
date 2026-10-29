# Layers

Stacking order is a ladder of eight named steps. Every overlay takes its `z-index` from a token,
so two components can never fight over who is on top and a fix never needs a bigger number.
Two browser mechanisms can break the ladder: stacking contexts (a parent traps its children)
and the top layer (native `<dialog>` and popovers sit above every `z-index`). This file says how
to work with both.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Steps | base 0, raised 10, sticky 20, overlay 30, dropdown 40, dialog 50, toast 60, tooltip 70 | Eight covers every case in shadcn, Radix and Material; gaps of 10 leave room without ad hoc values. |
| Tooltip on top | 70, above toasts and dialogs | A tooltip belongs to the element under the pointer, wherever that element is. |
| Toast above dialog | 60 over 50 | A save confirmation must be readable while a dialog is open. |
| Scrim | `overlay` 30, `rgb(10 10 10 / 0.4)` light, `/ 0.6` dark | One scrim for sheets and dialogs; it dims, never blurs, for performance. |
| Portals | dialogs, dropdowns, toasts, tooltips render at `<body>`; overlays opened from inside a dialog render inside the dialog | Escapes `overflow: hidden` and transforms; stays above the dialog that owns it. |
| Native `<dialog>` | preferred; the top layer wins over any `z-index` | The browser handles focus trap, `Esc` and inert background. |
| Overlays over a native modal | rendered as children of the `<dialog>` element | Anything outside a modal dialog is inert, even a popover drawn above it (tested below). |
| Sticky offset | `scroll-padding-top` equal to the sticky header height | WCAG 2.4.11: a sticky header must not hide the focused element. |
| One modal | one dialog at a time; a confirmation replaces the dialog, it does not stack | components/README.md, Dialog: do not stack dialogs. |
| Forbidden | `z-index: 9999`, any value not from the ladder | If a component needs more, the ladder is wrong, not the number. |

## Tokens

```css
--ds-z-base: 0; --ds-z-raised: 10; --ds-z-sticky: 20; --ds-z-overlay: 30;
--ds-z-dropdown: 40; --ds-z-dialog: 50; --ds-z-toast: 60; --ds-z-tooltip: 70;
```

Tailwind: `z-raised`, `z-sticky`, `z-dialog` and so on, from `tokens/tailwind.css`. Never a bare
`z-50`.

Sticky headers use `sticky` (20). A card that lifts on hover uses `raised` (10) only while it
carries a shadow; the shadow, not the z-index, communicates elevation (see elevation.md).

## Which layer

| Component | Token | Elevation (elevation.md) |
|---|---|---|
| Page content, cards at rest | `base` | 0, or 1 (border) |
| Clickable card on hover, drag preview, text on a hero scrim | `raised` | 2 on hover, 3 while dragged, none for text |
| Sticky header, sticky table header, bottom nav at 390 | `sticky` | 1 (hairline, no shadow) |
| Scrim behind a sheet or dialog | `overlay` | none |
| Dropdown menu, select list, popover, combobox list | `dropdown` | 2 |
| Dialog, sheet, command menu | `dialog` | 3 |
| Toast region | `toast` | 2 |
| Tooltip | `tooltip` | 2 |

```
70 tooltip   ......[ Copy link ].......
60 toast     ................[ 保存しました  元に戻す ]
50 dialog          +-------------------+
40 dropdown        |  [ Select v ]     |   <- a dropdown opened in the dialog
30 overlay   ######|###################|#####  scrim
20 sticky    [ header ===================== ]
 0 base      page content
```

## Good and bad

A fixed number instead of the token:

```css
/* Bad */  .menu { z-index: 9999; }
/* Good */ .menu { z-index: var(--ds-z-dropdown); }
```

A dropdown trapped by its container. `transform`, `filter`, `opacity < 1`, `will-change`,
`backdrop-filter`, `container-type: inline-size` and `position: fixed` or `sticky` all create a
stacking context (MDN). The dropdown's 40 is then compared only with its siblings inside the card.

```tsx
// Bad: the menu is a child of a card that animates with transform
<div className="card hover:-translate-y-0.5">
  <DropdownMenu.Content className="z-dropdown">…</DropdownMenu.Content>
</div>

// Good: the content renders in a portal at <body>
<DropdownMenu.Portal>
  <DropdownMenu.Content className="z-dropdown">…</DropdownMenu.Content>
</DropdownMenu.Portal>
```

A dropdown opened from a dialog. Portalled to `<body>` with 40, it renders under the dialog's
50. Pass the dialog node as the portal `container` (Radix Portal supports this), so the menu is
painted inside the dialog's stacking context.

```tsx
const [root, setRoot] = useState<HTMLElement | null>(null);
<Dialog.Content ref={setRoot}>
  <Select.Portal container={root}>…</Select.Portal>
</Dialog.Content>
```

## Native dialog and the top layer

`showModal()` puts the dialog in the top layer. Top-layer elements paint in the order they
were added, last on top (CSS Positioned Layout 4), and outside any `z-index`. Two consequences,
checked in Chrome 154 with Playwright:

| Setup | Result |
|---|---|
| Toast at `z-index: 60`, `position: fixed`, child of `<body>`, modal dialog open | Hidden under the dialog and its backdrop. |
| Toast as `popover="manual"`, shown after `showModal()` | Painted above the dialog, but its "元に戻す" button does not receive clicks: the page outside the modal is inert. |
| Toast as a child of the `<dialog>`, `position: fixed` | Painted at the viewport corner above the dialog and clickable. |

So, while a native modal is open, the toast region, tooltips and menus render inside the
`<dialog>` element. Also note: opening a modal closes any open `popover="auto"` (MDN Popover
API), so a menu that triggers a dialog must not expect to stay open.

## Edge cases

| Case | Rule |
|---|---|
| Confirm on close ("保存せずに閉じますか?") | Replace the dialog content with the confirmation; do not open a second dialog. |
| Toast while a sheet is open on mobile | Toast at bottom center sits above the sheet (60 over 50) when the sheet is not a native modal; with a native modal sheet, render it inside the sheet. |
| Tooltip on a sticky header button | Tooltip portals to `<body>` at 70; the header's own stacking context (sticky) does not clip it. |
| Focus moves under a sticky header | `html { scroll-padding-top: 64px }` (the header height) so `Tab` scrolls the focused field into the visible area. |
| `backdrop-filter` on the sticky nav | Creates a stacking context; menus opened from the nav must portal out. |
| Nested popovers (submenu) | Same layer (`dropdown`); the child is later in the DOM, so it paints on top. |
| Debugging "my menu is behind" | Walk up from the element and find the first ancestor that creates a stacking context; see the snippet below. |

```js
// Paste in DevTools: list ancestors that create a stacking context
for (let el = $0.parentElement; el; el = el.parentElement) {
  const s = getComputedStyle(el);
  const hit =
    s.transform !== "none" || s.filter !== "none" || +s.opacity < 1 ||
    s.position === "fixed" || s.position === "sticky" ||
    s.isolation === "isolate" || s.willChange !== "auto" ||
    s.backdropFilter !== "none" || s.containerType !== "normal" ||
    (s.zIndex !== "auto" && s.position !== "static");
  if (hit) console.log(el, s.zIndex);
}
```

## Review checklist

- No `z-index` literal in components; only `var(--ds-z-*)` or the `z-*` utilities.
- Every dropdown, popover, tooltip and toast renders in a portal.
- Overlays opened from inside a dialog render inside the dialog.
- With native `<dialog>`, the toast region moves into the dialog while it is open.
- Sticky header height is mirrored in `scroll-padding-top`.
- Only one dialog open at a time.
- Tooltips can be dismissed with `Esc` and stay while the pointer moves onto them (WCAG 1.4.13).

## Alternatives considered

- Single `z-index: 1000` for all overlays: order between two open overlays becomes DOM order,
  which changes with code splitting.
- Float-based ordering (no z-index at all): fails for sticky headers over content with shadows.
- Popover API for toasts above native dialogs: renders above, but the content is inert, so a
  toast with an action fails.
- Raising `dropdown` above `dialog`: a page-level menu would then cover an open dialog; the
  portal `container` fixes the nested case without changing the ladder.

## Sources

- MDN, Stacking context: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_positioned_layout/Stacking_context
- MDN, The top layer: https://developer.mozilla.org/en-US/docs/Glossary/Top_layer
- CSS Positioned Layout Module Level 4, Top layer: https://drafts.csswg.org/css-position-4/
- MDN, `<dialog>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
- MDN, Using the Popover API: https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
- MDN, isolation: https://developer.mozilla.org/en-US/docs/Web/CSS/isolation
- MDN, scroll-padding-top: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-top
- WAI-ARIA APG, Dialog (Modal) pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- WCAG 2.2, 2.4.11 Focus Not Obscured (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html
- WCAG 2.2, 1.4.13 Content on Hover or Focus: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html
- Material 3, Applying elevation: https://m3.material.io/styles/elevation/applying-elevation
- Radix Primitives, Portal (`container` prop): https://www.radix-ui.com/primitives/docs/utilities/portal
