# Components

Component rules for AwesomeDS. Behaviour comes from shadcn/ui on Base UI or Radix
primitives; visuals come from the `--ds-*` tokens in `tokens/tokens.css`. Each entry
gives anatomy, tokens, states, and do / do not. Install components into the project
(`npx shadcn@latest add button`) and restyle them; never ship the default theme.

Common rules for every component:

- Radius: controls `--ds-radius-md` (8), cards and menus `--ds-radius-lg` (12), dialogs `--ds-radius-xl` (16), badges and avatars `--ds-radius-pill`.
- Focus: `:focus-visible` ring, `--ds-focus-width` 2 px `--ds-focus-ring`, offset 2 px.
- Motion: `--ds-duration-instant` for color, `--ds-duration-base` with `--ds-ease-out` for enters, exits shorter.
- Text: `--ds-text-sm` (14) for labels and controls, `--ds-text-base` (16) for content.
- Every interactive component has hover, focus-visible, active, disabled and loading states.

## Maturity

Every component carries one maturity level. The site shows it on `/components` (安定 / ベータ / アルファ / 非推奨) as a text label, never color alone. The level is `maturity` in `web/src/ds/registry.tsx`.

| Level | Promise | What is done |
|---|---|---|
| alpha | Experiment. API and look can change without notice. Do not use in production. | Renders from `--ds-*` tokens. Nothing else is promised. |
| beta | Usable. A minor release may change props; the change is listed in `CHANGELOG`. | Tokens only, all states in the Common rules, keyboard operable. Spec or review still incomplete (no entry in this file, or a11y checks not finished). |
| stable | Props are frozen. A breaking change needs a major version and a migration note. | Spec in this file, every item of `checklist.md` passes, keyboard and screen reader behaviour checked, tokens only (no raw hex), demo on `/components`. |
| deprecated | Will be removed. Do not use in new work. | The replacement is named in this file and in `CHANGELOG`; the component stays for at least one minor version before removal. |

Moving between levels:

- alpha to beta: the API has survived use in one real screen and every state exists.
- beta to stable: the spec is written here and `checklist.md` passes, with the check recorded in the PR.
- any level to deprecated: the PR names the replacement and adds a `CHANGELOG` line.
- A stable component never goes back to beta; a regression is a bug fix.

The same four-step idea is published by other systems. AwesomeDS borrows the intent, not their names:

- Primer labels components Experimental, Ready and Deprecated; Ready means breaking changes bump the major version and come with a migration path (https://primer.style/product/getting-started/component-status/).
- Atlassian uses Early Access, Beta and General Availability, plus Intent to Deprecate and Deprecated; nothing at General Availability is removed without an announced deprecation period (https://atlassian.design/release-phases).
- Carbon marks pages Stable, publishes accessibility test tags per component, and sends experimental components to Carbon Labs, separate from stable assets (https://carbondesignsystem.com/components/overview/accessibility-status/, https://carbondesignsystem.com/getting-started/contributing/overview).

Current spread: 34 stable, 14 beta, 0 alpha, 0 deprecated. Beta components are those without a spec in this file yet (Combobox, TagInput, Slider, FileUpload, DatePicker, Calendar, Rating, SegmentedControl, ToggleGroup, DataTable, StatTile, Timeline, MediaCard, Accordion).

## Button

Anatomy: container, optional leading icon (20 px), label (one line), optional trailing icon,
loading spinner replacing the leading icon.

| Variant | Background | Text | Border | Use |
|---|---|---|---|---|
| primary | `--ds-primary` (ink) | `--ds-on-primary` | none | The one main action per view |
| secondary | `--ds-surface` | `--ds-ink` | `1px --ds-hairline-strong` | Supporting actions |
| ghost | transparent | `--ds-ink-secondary` | none | Toolbar, tertiary, inside cards |
| danger | `--ds-danger` | white | none | Destructive confirm only, never the default focus |

| Size | Height | Padding x | Text | Icon |
|---|---|---|---|---|
| sm | `--ds-control-sm` 32 | 12 | 14 / 500 | 16 |
| md | `--ds-control-md` 40 | 16 | 14 / 500 | 20 |
| lg | `--ds-control-lg` 48 | 20 | 16 / 500 | 20 |

States: hover (primary `--ds-primary-hover`, secondary border to `--ds-hairline-strong` and
background `--ds-canvas-soft`, ghost background `--ds-surface-sunken`), active
(`transform: scale(0.98)` for 100 ms), disabled (opacity 0.5, `cursor: not-allowed`, no hover),
loading (spinner, label kept, `aria-busy="true"`, pointer events off).

Do: one primary per view (Apple HIG and Hick's Law). Label starts with a verb, max three words.
Do not: use the accent as a fill; wrap labels; use danger as the pre-focused default in a dialog.

## Input, Textarea, Select

Anatomy: label above (14 / 500, `--ds-ink`), optional helper below (12 to 14, `--ds-ink-secondary`),
control (40 px, `--ds-surface`, `1px --ds-hairline-strong`, `--ds-radius-md`, padding x 12,
text 14 `--ds-ink`), error text below helper (14, `--ds-danger`, with 16 px icon).

States: hover border `--ds-ink-disabled`; focus border `--ds-accent` plus ring; error border
`--ds-danger` plus `aria-invalid`; disabled background `--ds-surface-sunken`, text `--ds-ink-disabled`;
read-only background `--ds-canvas-soft` with normal text.

Textarea: min 3 rows, resize vertical only. Select: shadcn Select on the primitive; chevron
16 px `--ds-ink-secondary`; native `<select>` on mobile when the list is over 15 items.

Do: placeholder as an example ("name@company.com"), never as the label (NN/g). Gap label to
input 8, field to field 16 to 20. Do not: validate on every keystroke; use `ink-muted` on
`surface-sunken` for placeholder text (fails 4.5:1).

## Checkbox, Radio, Switch

| Control | Visual | Use |
|---|---|---|
| Checkbox | 16 px, `--ds-radius-xs`, border `--ds-hairline-strong`; checked fill `--ds-primary`, white check | Zero or more of many; a single opt-in |
| Radio | 16 px circle; checked `--ds-primary` dot | Exactly one of two to five visible options |
| Switch | 36 x 20 track, 16 px thumb, `--ds-radius-pill`; on `--ds-primary` | Immediate on/off of a setting; no Save button |

Label is a `<label>` wrapping or linked to the control; the whole row (44 px) is the target.
States: hover border `--ds-ink-secondary`; focus ring; disabled opacity 0.5; indeterminate
checkbox shows a 2 px dash. Switch animates the thumb with `--ds-duration-fast` and `--ds-ease-out`.

Do: radio for mutually exclusive options that should all stay visible (NN/g). Switch only when
the change applies at once. Do not: use a switch inside a form that has a Submit button;
use a checkbox for a yes/no question when two radios would be clearer.

## Card

Anatomy: container `--ds-surface`, `1px --ds-hairline`, `--ds-radius-lg`, padding 24
(16 on mobile); optional media (inner radius 8 when inset 4), heading (`h3` or `h4`), body
(`--ds-ink-secondary`), footer actions.

States: static by default. Clickable card: whole card is one `<a>` or `<button>`; hover raises to
`--ds-shadow-2` and border `--ds-hairline-strong`; focus ring on the card. No nested interactive
elements inside a clickable card.

Do: use a card when items are a summary that links to detail (NN/g card definition). Group
with `border-t`/`divide-y` when items are just a list. Do not: shadow at rest; three identical
cards as the default layout; card inside card.

## Dialog and Sheet

Anatomy: backdrop `rgb(10 10 10 / 0.4)` (dark theme `rgb(0 0 0 / 0.6)`), panel `--ds-surface`,
`1px --ds-hairline`, `--ds-radius-xl`, padding 24, `--ds-shadow-3`; header (title `h2` 20/600,
optional description `--ds-ink-secondary`), body, footer with actions right-aligned
(secondary then primary), close icon button top right (`aria-label="Close"`).

Sizes: dialog max width 480 (sm), 640 (md), 800 (lg). Sheet: side panel 400 to 480 px wide,
full height, radius on the inner edge only; on mobile a bottom sheet with 16 px top radius.

Behaviour (Radix and Base UI provide): focus trapped, Escape closes, backdrop click closes
unless the dialog is a destructive confirmation, focus returns to the trigger, body scroll
locked. `role="dialog"`, `aria-modal="true"`, `aria-labelledby` the title.

Motion: enter opacity 0 to 1 plus `scale(0.98)` to 1 over `--ds-duration-slow`, exit 200 ms.
Sheet slides 8 px, not from off-screen. Reduced motion: opacity only.

Do: use a modal only when the user must respond (NN/g modal guidance). Prefer a sheet for
edit forms that reference the page behind. Do not: stack dialogs; put more than one primary
button in the footer; open a dialog on page load. Menus, popovers and toasts opened from a
dialog are portalled into that dialog, not into `<body>`, or they render under it
([`foundations/layers.md`](../foundations/layers.md)).

## Popover, Dropdown Menu, Tooltip

| Component | Surface | Trigger | Content |
|---|---|---|---|
| Popover | `--ds-surface`, hairline, `--ds-radius-lg`, `--ds-shadow-2`, padding 16 | Click | Any content, focusable |
| Dropdown menu | same, padding 4, items 32 px, `--ds-radius-md` on items | Click (never hover) | Actions; arrow keys, type-ahead; destructive items in `--ds-danger` at the end |
| Tooltip | `--ds-ink` background, `--ds-canvas` text 12 px, radius `--ds-radius-sm`, padding 4 8 | Hover and focus, 300 ms delay | One short line; never essential information |

Offset from trigger 8 px. Enter with `--ds-duration-base`, translate 4 px from the trigger side.
Do: keep menus to one level; a second level is the maximum (NN/g). Do not: hover-open menus;
place form fields in a tooltip; use a popover where a dialog is needed for a decision.

## Tabs

Anatomy: tab list with `1px --ds-hairline` bottom; tabs 40 px tall, 14 / 500, `--ds-ink-secondary`,
selected `--ds-ink` with a 2 px `--ds-ink` indicator; panel below with 24 px top spacing.
Behaviour: arrow keys move between tabs, Tab enters the panel; `role="tablist"`, `aria-selected`.
Indicator slides with `--ds-duration-fast`.

Do: three to seven tabs, short labels, same content type in each (NN/g). Do not: use tabs for
sequential steps (use a stepper) or as page navigation (use links with `aria-current`).

## Table

Anatomy: container `1px --ds-hairline`, `--ds-radius-lg`, overflow-x auto; header row
`--ds-surface-sunken`, sticky, 12 to 14 / 500 `--ds-ink-secondary`, `<th scope="col">`; rows
44 px, `1px --ds-hairline` between; cells padding 12 16; numeric cells right-aligned with
`font-variant-numeric: tabular-nums`; row hover `--ds-canvas-soft`; selected row `--ds-selection`.

Features as needed: sort indicator (16 px chevron, `aria-sort`), checkbox column 44 px wide,
row actions in the last column (icon buttons with `aria-label`), pagination or virtual scroll
above 100 rows, empty state inside the table body.

Do: support the four table tasks (find, compare, view or edit a row, act on rows). Do not:
center numbers; use hover-only row actions on touch; wrap header labels.

## Toast

Sonner via shadcn. Anatomy: `--ds-surface`, hairline, `--ds-radius-lg`, `--ds-shadow-2`,
padding 12 16, 14 px text, status icon 16 px in `success`/`warning`/`danger`, optional single
action button (ghost), close button. Position bottom right (bottom center on mobile), max 3
visible, 5 s default for toasts without an action. Errors, warnings and toasts with an
action (Undo) stay until dismissed (WCAG 2.2.1). `aria-live="polite"`.

Do: toasts for background results ("Exported 24 rows"); offer Undo for destructive actions.
Do not: toast a result that is already visible on screen; toast form validation errors
(inline instead); stack more than three; auto-dismiss errors or actions. Choosing between
inline, banner, toast and dialog: [`foundations/feedback.md`](../foundations/feedback.md).
With a native modal `<dialog>` open, render the toast inside the dialog (top layer; see
[`foundations/layers.md`](../foundations/layers.md)).

## Badge

Anatomy: `--ds-radius-pill`, padding 2 8, 12 / 500, `--ds-surface-sunken` background,
`--ds-ink-secondary` text. Status variants use `-soft` backgrounds with the status icon and
text in `--ds-ink` (see color.md for which status texts pass contrast). Height 20 px.
Read-only; a badge never has hover. Interactive filters are chips (secondary button, sm).

Do: one badge per row cell; text under 16 characters. Do not: color-only badges; badge as a button.

## Avatar

Sizes 24, 32, 40. `--ds-radius-pill`. Image with `alt` of the person's name, or initials
(two letters, 12 to 14 / 500) on `--ds-surface-sunken`, or a neutral fallback icon with an
`aria-label`. Group: overlapping by 8 px with a 2 px `--ds-canvas` ring, max 4 plus "+N".
Do not: generic egg avatars in testimonials; different sizes in one row.

## Skeleton, Empty, Error states

| State | Spec |
|---|---|
| Skeleton | `--ds-surface-sunken` blocks matching the final layout's shape, `--ds-radius-xs` for text lines and the component radius for boxes; shimmer 1.2 s loop that stops under reduced motion; `aria-busy` on the container; show for loads of 400 ms to 3 s (NN/g); under 400 ms show nothing |
| Empty | Icon 32 px `--ds-ink-muted`, heading 16 / 600, one sentence `--ds-ink-secondary`, one primary or secondary action; centered inside its container; explains what will appear and how to add it |
| Error | Icon in `--ds-danger`, heading, plain-language cause and fix, Retry button; inline for a component, full-panel for a page; `role="alert"` when blocking |

Every data view ships all three. Do not: spinner alone for full-page loads; empty states
that only say "No data".

## Navigation

Top nav: 64 px, `--ds-canvas` with `1px --ds-hairline` bottom, sticky, logo left, links 14 / 500
`--ds-ink-secondary` (active `--ds-ink`, `aria-current="page"`), one primary button right.
Below 768: logo plus menu button (44 px target) opening a sheet. Sidebar (app): 240 to 280 px,
items 36 px, icon 16 plus label, active item `--ds-surface-sunken` with `--ds-ink`.
Breadcrumbs: 14 px, `--ds-ink-secondary`, separator chevron 16 px, current item `--ds-ink`.
Do not: hide labels behind icons; center the logo; let the nav wrap.

## Command menu

cmdk via shadcn Command inside a Dialog. Opens on `Cmd/Ctrl+K`. Anatomy: input 48 px with
search icon, list grouped with 12 px group labels, items 40 px with icon 16, label, optional
shortcut hint (12 px `--ds-ink-muted`), footer with key hints. Surface `--ds-surface`,
`--ds-radius-xl`, `--ds-shadow-3`, max width 640, top at 20 percent of the viewport.
Behaviour: arrow keys, Enter, Escape; filtering handled by cmdk; empty result state text.
Do: keep every command also reachable through the visible UI (heuristic 7: accelerators
complement, never replace). Do not: make the command menu the only route to a feature.

## Sources

- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default : component base (Base UI default, Radix supported).
- https://www.radix-ui.com/primitives/docs/components/dialog : dialog focus, Escape and return-focus behaviour.
- https://accessibility.build/guides/accessible-tabs : APG tabs keyboard pattern.
- https://github.com/emilkowalski/sonner : Sonner toast component.
- https://emilkowal.ski/ui/building-a-toast-component : toast behaviour decisions.
- https://www.npmjs.com/package/cmdk : cmdk command menu.
- https://vercel.com/geist/button : Geist button types (primary, secondary, error) and icon-only `aria-label` rule.
- https://www.nngroup.com/articles/form-design-placeholders/ : placeholders as labels.
- https://www.nngroup.com/articles/web-form-design/ : labels above fields.
- https://www.nngroup.com/articles/checkboxes-vs-radio-buttons/ : checkbox versus radio.
- https://www.nngroup.com/articles/toggle-switch-guidelines/ : switches take immediate effect.
- https://www.nngroup.com/articles/cards-component/ : card definition.
- https://www.nngroup.com/articles/modal-nonmodal-dialog/ : when to use modal dialogs.
- https://www.nngroup.com/articles/confirmation-dialog/ : confirmation for destructive actions.
- https://www.nngroup.com/articles/drop-down-menus/ : click-open menus, one to two tiers.
- https://www.nngroup.com/articles/tooltip-guidelines/ : tooltips are not for essential content.
- https://www.nngroup.com/articles/tabs-used-right/ : tab guidelines.
- https://www.nngroup.com/videos/designing-tables-desktop-apps/ : four table tasks.
- https://www.nngroup.com/articles/skeleton-screens/ : skeleton timing.
- https://www.nngroup.com/videos/empty-states-in-application-design-guidelines/ : empty state guidelines.
- https://www.nngroup.com/articles/error-message-guidelines/ : error wording.
- https://www.nngroup.com/videos/button-states-101/ : five button states.
- https://www.nngroup.com/articles/flexibility-efficiency-heuristic/ : accelerators for experts.
- https://www.nngroup.com/articles/bottom-sheet/ : bottom sheets on mobile.
- https://developers.apple.com/design/human-interface-guidelines/foundations/accessibility : 44 pt targets.
- https://primer.style/product/getting-started/component-status/ : Primer component status (Experimental, Ready, Deprecated) and what Ready promises (opened 2026-10-08).
- https://atlassian.design/release-phases : Atlassian release phases and deprecation phases (opened 2026-10-08).
- https://carbondesignsystem.com/components/overview/accessibility-status/ : Carbon accessibility tags per stable component (opened 2026-10-08).
- https://carbondesignsystem.com/getting-started/contributing/overview : Carbon Labs for experimental components (opened 2026-10-08).
