# Density

AwesomeDS ships two densities, comfortable and compact, switched by one attribute. Density
changes control heights, row heights and cell padding together; it never changes type size,
color or radius. Compact exists for data-heavy screens used all day by trained people, not for
fitting more marketing onto a page.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Modes | comfortable (default), compact | Material 3 has a scale from 0 to -3 in 4 dp steps and Carbon tables have five row sizes (24 to 64); AwesomeDS keeps the two steps that differ enough to notice. |
| Switch | `<html data-density="compact">` | One attribute, tokens change, components never opt out. |
| Control heights | comfortable 32 / 40 / 48, compact 28 / 32 / 40 | md 40 clears WCAG 2.5.8 (24 px) with room; lg 48 is the Material 3 touch target; compact sm 28 is the Apple HIG default control size on macOS. |
| Row height | comfortable 44 px, compact 36 px | 44 is the Apple HIG default control size on iOS; 36 is one 8 px step down, between Carbon's 32 (sm) and 40 (md) rows. |
| Cell padding | comfortable 16 / 12, compact 12 / 8 | Padding steps down one 4 px unit per side. |
| Type | unchanged | Material 3: text size should not change as the container scales; WCAG 1.4.4 resize still applies. |
| Touch | compact is desktop only: media `(pointer: coarse)` falls back to comfortable | WCAG 2.5.8 sets 24 px; Material 3 asks for 48 px targets by default. |
| Choice | remembered per user, exposed in settings, never per page | Material 3: people opt in to dense layouts; density is a preference, not a layout decision. |
| Opt-in control | the density setting itself always renders at comfortable size | Material 3: settings must use default target sizes so density can be reverted. |

## Tokens

| Token | Comfortable | Compact | Used by |
|---|---|---|---|
| `--ds-control-sm` | 32 | 28 | small buttons, chips, icon buttons in toolbars |
| `--ds-control-md` | 40 | 32 | default buttons, inputs, selects |
| `--ds-control-lg` | 48 | 40 | primary actions on mobile, search field |
| `--ds-row` | 44 | 36 | table row, list item, menu row |
| `--ds-pad-inline` | 16 | 12 | horizontal padding of md controls and cells |
| `--ds-pad-block` | 12 | 8 | vertical padding of cells and list rows |

`tokens.css` overrides these inside `[data-density="compact"]`. Tailwind exposes them as
`h-control-md`, `h-row`, `px-pad-inline`, `py-pad-block`. A component that hard-codes `h-10`
breaks the switch.

The touch fallback is a rule on top of the tokens. It is not in `tokens.css` yet; until it is,
products add it next to the token import:

```css
@media (pointer: coarse) {
  [data-density="compact"] {
    --ds-control-sm: 32px; --ds-control-md: 40px; --ds-control-lg: 48px;
    --ds-row: 44px; --ds-pad-inline: 16px; --ds-pad-block: 12px;
  }
}
```

`pointer` reads the primary input. A touch laptop with a trackpad reports `fine` and keeps
compact; `any-pointer: coarse` would also match it, which is why the rule uses `pointer`.

## Screen example

A 1280 x 800 window, 80 px of app header, leaves 720 px for a table:

```
comfortable (row 44)                  compact (row 36)
+--------------------------------+    +--------------------------------+
| 名前        | 状態   | 更新日   |    | 名前        | 状態   | 更新日   |
|-------------+--------+----------|    |-------------+--------+----------|
| 請求書 #1042 | 送信済 | 10/08    |    | 請求書 #1042 | 送信済 | 10/08    |
| 請求書 #1041 | 下書き | 10/07    |    | 請求書 #1041 | 下書き | 10/07    |
|  ...  16 rows visible           |    |  ...  20 rows visible           |
+--------------------------------+    +--------------------------------+
```

Compact shows four more rows (720 / 44 = 16, 720 / 36 = 20) with the same 14 px text. That is
the whole gain; if it is not worth it for a screen, the screen stays comfortable.

## Good and bad

```tsx
// Bad: fixed Tailwind height ignores the density attribute
<button className="h-10 px-4">保存</button>

// Good: token-backed utilities follow data-density
<button className="h-control-md px-pad-inline">保存</button>
```

```css
/* Bad: compact as smaller text */
[data-density="compact"] td { font-size: 12px; line-height: 1.3; }

/* Good: compact changes only the box */
td { min-height: var(--ds-row); padding: var(--ds-pad-block) var(--ds-pad-inline); }
```

```tsx
// Bad: per-component density prop; one screen ends up with three densities
<Table density="compact" /> <Toolbar density="comfortable" />

// Good: one attribute at the root, set from the user's saved preference
document.documentElement.dataset.density = prefs.density; // "comfortable" | "compact"
```

A small icon button in compact keeps its target. The box is 28 px; when icon buttons sit
closer than the 2.5.8 spacing rule allows, extend the hit area without changing the layout:

```css
.icon-btn { position: relative; height: var(--ds-control-sm); }
.icon-btn::after { content: ""; position: absolute; inset: -4px; } /* 36 px target */
```

## Where compact applies

| Applies | Does not apply |
|---|---|
| Data tables, lists, tree views | Forms that are the main task of the page; inputs stay comfortable |
| Toolbars, filter bars, tab bars inside panels | Dialogs and toasts (Material 3: do not densify components that alert) |
| Menus and select lists, on a fine pointer | Anything under `(pointer: coarse)` |
| Side navigation in apps | Marketing, docs and onboarding pages |

Material 3 also advises against density in focused selection tasks such as menus. AwesomeDS
keeps menu rows on `--ds-row` for desktop pointers, where a 36 px row is still above 24 px,
and falls back on touch.

## Edge cases

- Japanese text in a compact row: 14 px x 1.8 leading is 25.2 px plus 2 x 8 px padding, which
  is 41 px, more than 36. Rows use `min-height`, never `height`, so the row grows instead of
  clipping. Single-line table cells may set `line-height: 1.5` (21 px) to stay at 36.
- Wrapped cell text: the row grows; never `white-space: nowrap` plus clipping without a
  tooltip (internationalization.md, Truncation).
- Browser zoom at 200 percent: type is unchanged by density, so 1.4.4 behaves the same in both.
- Hybrid devices: a tablet with a keyboard and trackpad still reports `pointer: coarse` when
  touch is primary; it stays comfortable.
- Empty table: the empty state uses page spacing, not row spacing; density does not shrink it.
- Density in the settings page itself: always comfortable, so the switch back is easy to hit.

## Review checklist

- No `h-8`, `h-10`, `h-12`, `py-2` or pixel heights on controls and rows; only the density tokens.
- Font size and line height are the same in both modes.
- Rows use `min-height`; long and Japanese text grows the row.
- Under `(pointer: coarse)`, compact falls back to comfortable.
- Interactive targets are at least 24 x 24 px, or meet the 2.5.8 spacing exception.
- The density setting is per user, stored, and rendered at comfortable size.
- Forms, dialogs and toasts look the same in both modes.

## What compact is not

- Not smaller text. Body stays 16 px, table cells 14 px.
- Not tighter line height. Leading stays 1.6 (1.8 for Japanese).
- Not for forms. Inputs stay comfortable even in compact mode when they are the main task.

## Alternatives considered

- Three or four densities (Material 3 scale 0 to -3): the middle steps differ by 4 px and are
  hard to tell apart; two named modes are easier to reason about.
- Per-component density props: drift within one screen; the attribute keeps a page consistent.
- Automatic compact on wide screens: Material 3 says density should not change across
  breakpoints unless the person changes it.
- Carbon's 24 px extra-small row: below the comfortable reading height for Japanese at 14 px.

## Sources

- Material 3, Density: https://m3.material.io/foundations/layout/understanding-layout/density
- Carbon Design System, Data table style (row sizes): https://carbondesignsystem.com/components/data-table/style/
- Carbon Design System, Spacing: https://carbondesignsystem.com/guidelines/spacing/overview/
- Apple HIG, Accessibility (control sizes per platform): https://developer.apple.com/design/human-interface-guidelines/accessibility
- WCAG 2.2, 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
- WCAG 2.2, 1.4.4 Resize Text: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- MDN, pointer media feature: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer
- MDN, any-pointer media feature: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/any-pointer
