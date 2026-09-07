# Density

AwesomeDS ships two densities, comfortable and compact, switched by one attribute. Density
changes control heights, row heights and cell padding together; it never changes type size,
color or radius. Compact exists for data-heavy screens used all day by trained people, not for
fitting more marketing onto a page.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Modes | comfortable (default), compact | Two is enough: Material 3 and Carbon both stop at two useful steps for web. |
| Switch | `<html data-density="compact">` | One attribute, tokens change, components never opt out. |
| Control heights | comfortable 32 / 40 / 48, compact 28 / 32 / 40 | 40 px keeps a 44 px touch target with margin; 32 px is the smallest that stays 3:1 legible at 14 px text. |
| Row height | comfortable 44 px, compact 36 px | 44 px is the iOS minimum tap height; 36 px matches Linear and Notion compact tables. |
| Cell padding | comfortable 16 / 12, compact 12 / 8 | Padding steps down one 4 px unit per side. |
| Type | unchanged | Smaller text is a legibility cut, not a density gain; WCAG 1.4.4 resize still applies. |
| Touch | compact is desktop only: media `(pointer: coarse)` falls back to comfortable | WCAG 2.5.8 target size 24 px minimum, 44 px recommended. |
| Choice | remembered per user, exposed in settings, never per page | Density is a preference, not a layout decision. |

## Tokens

`tokens.css` defines `--ds-control-sm/md/lg`, `--ds-row`, `--ds-pad-inline`, `--ds-pad-block`
and overrides them inside `[data-density="compact"]`. Components size themselves from these
tokens only; a component that hard-codes `h-10` breaks the switch.

## What compact is not

- Not smaller text. Body stays 16 px, table cells 14 px.
- Not tighter line height. Leading stays 1.6 (1.8 for Japanese).
- Not for forms. Inputs stay comfortable even in compact mode when they are the main task.

## Alternatives considered

- Three densities (Material 3 density scale -1 to -3): the middle step was never chosen in
  testing; two named modes are easier to reason about.
- Per-component density props: drift within one screen; the attribute keeps a page consistent.

## Sources

- Material 3, Applying density: https://m3.material.io/foundations/layout/applying-layout/density
- Carbon Design System, Layout density: https://carbondesignsystem.com/guidelines/spacing/overview/
- WCAG 2.2, 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- Apple HIG, Layout (44 pt minimum): https://developer.apple.com/design/human-interface-guidelines/layout
