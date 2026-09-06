# Accessibility

WCAG 2.2 Level AA is the floor for every AwesomeDS page. This file maps each relevant
success criterion to the token or rule that satisfies it, so an agent can check a page
against the tokens instead of re-reading the standard.

## Decisions

| Area | AwesomeDS spec | WCAG 2.2 criterion |
|---|---|---|
| Text contrast | `ink` 19.8:1, `ink-secondary` 7.8:1, `ink-muted` 4.7:1 on canvas | 1.4.3 Contrast (Minimum), AA: 4.5:1 normal, 3:1 large |
| Non-text contrast | Focus ring and input border pairs reach 3:1; `hairline` is decorative only | 1.4.11 Non-text Contrast, AA |
| Focus ring | `outline: 2px solid --ds-focus-ring; outline-offset: 2px` on `:focus-visible` | 2.4.7 Focus Visible (AA); 2.4.13 Focus Appearance (AAA) met: 2 px, 3:1 against adjacent |
| Focus not hidden | Sticky nav is 64 px; scroll-padding-top 80 px so focused items are not under it | 2.4.11 Focus Not Obscured (Minimum), AA |
| Target size | 44 px touch, 24 px pointer, 44 px table rows | 2.5.8 Target Size (Minimum), AA |
| Reduced motion | `prefers-reduced-motion` block in tokens.css | 2.3.3 Animation from Interactions (AAA, treated as floor) |
| Color independence | Status colors always with icon or text | 1.4.1 Use of Color, A |
| Language | `<html lang="en">` or `lang="ja"`; `:lang(ja)` styles depend on it | 3.1.1 Language of Page, A |
| Errors | Error text below the field, in `danger`, with icon, linked by `aria-describedby` | 3.3.1 Error Identification (A), 3.3.3 Error Suggestion (AA) |
| Labels | Visible `<label>` above every input; placeholder never the label | 3.3.2 Labels or Instructions (A), 1.3.1 Info and Relationships (A) |
| Keyboard | Everything reachable by Tab, operable by Enter/Space, dismissible by Escape | 2.1.1 Keyboard (A), 2.1.2 No Keyboard Trap (A) |
| Structure | One `h1`, headings in order, landmarks (`header`, `nav`, `main`, `footer`) | 1.3.1, 2.4.6 Headings and Labels (AA) |
| Images | `alt` on every `<img>`; empty `alt=""` for decorative | 1.1.1 Non-text Content (A) |
| Text spacing | Line height 1.6 body; layout survives 200 percent zoom and 1.5 line spacing | 1.4.4 Resize Text (AA), 1.4.12 Text Spacing (AA) |
| Reflow | Single column below 768; no horizontal scroll at 320 px | 1.4.10 Reflow (AA) |

## Contrast

Computed values are in color.md. Rules for agents:

- Body and label text: `ink` or `ink-secondary`. `ink-muted` only for placeholders and
  timestamps on `canvas`/`surface`.
- Light `warning` text fails 4.5:1; use the warning color for the icon and border, text in `ink`.
- Dark `ink-muted` fails 4.5:1 on canvas; use `ink-secondary` for any dark-mode text a user
  must read.
- Disabled controls are exempt from contrast (WCAG 1.4.3 exception) but must remain visible;
  `ink-disabled` `#a3a3a3` is the floor.
- Large text (24 px regular or 18.66 px bold) may go to 3:1; AwesomeDS has no text role
  that depends on this exemption.

## Focus

```css
:focus-visible {
  outline: var(--ds-focus-width) solid var(--ds-focus-ring); /* 2px, accent */
  outline-offset: var(--ds-focus-offset);                    /* 2px */
}
```

- `:focus-visible`, not `:focus`, so mouse clicks do not paint the ring on buttons while
  keyboard users always get it.
- `outline: none` is never written without an equivalent replacement of at least 2 px and 3:1.
- Ring color is the accent (`#2f5bea` light, `#7a9cff` dark). Light accent on white is 5.5:1;
  dark accent on `#0a0a0a` is 7.6:1. Against a `primary` (black) button the light ring is
  offset 2 px so it sits on the canvas, where it has contrast.
- Inputs also switch border to `accent` on focus so the ring and border read as one.
- Inside dialogs, focus moves to the first focusable element on open and returns to the
  trigger on close (Radix and Base UI do this).

## Target size

- Buttons: 40 px default, 32 small, 48 large. Small buttons on touch screens get a 44 px
  hit area through margin or `::before` padding.
- Inline text links are exempt under 2.5.8; still keep line height 1.6 so adjacent links
  are separable.
- Checkbox and radio visuals are 16 px; the clickable `<label>` extends the target to the
  full row (44 px).
- Icon buttons: 40 px box, 44 on touch.

## Reduced motion

The global block sets `animation-duration` and `transition-duration` to 0.01 ms and
`animation-iteration-count` to 1. Component authors additionally:

- Replace transforms with opacity in Motion when `useReducedMotion()` is true.
- Stop skeleton shimmer, marquees and auto-rotating content.
- Keep `scroll-behavior: auto`.

## Semantic structure

- One `<h1>` per page, levels in order, no skipped levels for styling. Use the type scale
  class (`text-2xl`) to change size without changing the element.
- Landmarks: `<header>`, `<nav aria-label="Main">`, `<main>`, `<footer>`. One `<main>`.
- Lists are `<ul>`/`<ol>`; nav items are lists of links.
- Tables use `<th scope="col">`, `<caption>` or `aria-labelledby`.
- Buttons are `<button>`, links are `<a href>`. A `<div onClick>` is never acceptable.

## Keyboard

| Component | Keys |
|---|---|
| Button | Enter, Space |
| Link | Enter |
| Dialog, Sheet, Popover, Dropdown | Escape closes; Tab cycles inside (dialog traps focus) |
| Tabs | Arrow keys move between tabs; Tab moves into the panel (APG tabs pattern) |
| Menu | Arrow keys, Home/End, type-ahead, Enter selects, Escape closes |
| Command menu | Arrow keys, Enter, Escape; `Cmd/Ctrl+K` opens |
| Switch, Checkbox | Space toggles |
| Radio group | Arrow keys move selection |
| Table with row actions | Tab to the row action, never a click-only row |

shadcn/ui components on Radix or Base UI implement these; do not rebuild them.

## ARIA

- `aria-label` on every icon-only control; `aria-hidden="true"` on the icon itself.
- `aria-describedby` from input to its helper and error text.
- `aria-invalid="true"` on a field in error.
- `aria-live="polite"` region for toasts; `role="alert"` only for errors that block.
- `aria-expanded` on disclosure triggers; `aria-current="page"` on the active nav link.
- Prefer native semantics over ARIA. If a native element does the job, use it.

## Forms

- Label above, always visible. Helper text below the input. Error below the helper, in
  `danger` with an icon and plain-language fix ("Enter an email with an @").
- Required fields marked in the label text, not only by color or asterisk.
- Validation on blur or submit, not on every keystroke.
- Error summary at the top of long forms, linking to each field.

## Color independence

- Success, warning, danger each pair a color with an icon (check, triangle, circle-x) and a
  word. The grayscale test: print the screen in gray; meaning must survive.
- Links inside body text are underlined or accent-colored with at least 3:1 against
  surrounding text; AwesomeDS underlines links inside paragraphs.
- Charts use pattern or label in addition to hue.

## Language attribute

- `<html lang="en">` for English, `<html lang="ja">` for Japanese. Mixed pages set `lang`
  on the element that switches.
- `:lang(ja)` in tokens.css depends on this attribute for line height 1.8, `line-break: strict`
  and `text-autospace`. Without it Japanese text gets Latin metrics.
- Screen readers select pronunciation rules from `lang`.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| WCAG 2.1 AA as target | 2.2 adds focus appearance, target size and focus-not-obscured, all cheap to meet with tokens. |
| AAA contrast (7:1) everywhere | `ink-secondary` passes it; `ink-muted` and the accent do not. AAA is a `ds-creator` option for public-sector work. |
| Removing focus rings for mouse users with `:focus` overrides | `:focus-visible` solves this without a script. |
| `title` attributes as labels | Not announced consistently; no touch equivalent. |
| Color-only status chips | Fails 1.4.1 and the grayscale test. |

## Sources

- https://www.w3.org/TR/WCAG22/ : WCAG 2.2 normative text.
- https://www.w3.org/WAI/WCAG22/quickref/ : quick reference with all criteria.
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html : 2 px and 3:1 for focus indicators.
- https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast : 3:1 for components and graphics.
- https://www.w3.org/WAI/WCAG21/Techniques/css/C39 : `prefers-reduced-motion` technique.
- https://w3c.github.io/wcag21/understanding/language-of-page.html : `lang` attribute requirement.
- https://wcag22aa.org/new-criteria/target-size/ : 2.5.8 summary.
- https://www.digitala11y.com/understanding-sc-2-5-8-target-size-minimum/ : 2.5.8 exceptions.
- https://www.allaccessible.org/blog/wcag-2411-focus-not-obscured-minimum-implementation-guide : 2.4.11 and sticky headers.
- https://webaim.org/resources/contrastchecker/ : contrast checker.
- https://www.nngroup.com/articles/keyboard-accessibility/ : keyboard users and focus indicators.
- https://www.nngroup.com/articles/visual-treatments-accessibility/ : contrast, color alone, alt text.
- https://www.nngroup.com/articles/form-design-placeholders/ : placeholders as labels are harmful.
- https://www.nngroup.com/articles/errors-forms-design-guidelines/ : error placement and wording.
- https://www.nngroup.com/articles/write-alt-text/ : writing alt text.
- https://www.nngroup.com/articles/alt-text-usability/ : decorative images need empty alt.
- https://www.radix-ui.com/primitives/docs/components/dialog : focus trap, Escape, return focus.
- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default : Base UI default with same behaviours.
- https://accessibility.build/guides/accessible-tabs : APG tabs keyboard pattern summary.
- https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion : media feature.
