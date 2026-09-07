# Navigation

AwesomeDS has one top bar (64 px), one optional sidebar (240 px), and a small set of
secondary devices: tabs, breadcrumbs, pagination, a command menu. Each has one job. Active
state is shown with `ink` and `aria-current`, never with the accent alone. Depth is capped
so a user is never more than three levels from the top.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Top bar | 64 px, sticky, `canvas`, 1 px `hairline` bottom, one row | Fits a 40 px control with 12 px padding; two rows on desktop is a failure (layout.md). |
| Logo | Left, links home, 24 to 32 px tall | NN/g: centered logos make returning home six times harder. |
| Top-level links | 14/500 `ink-secondary`, active `ink`, max 6 | Miller's range and one row at 1024 px. |
| Primary action | One button at the right end | One primary per view. |
| Sidebar | 240 px (280 max), items 36 px, icon 16 plus label, groups with 12 px caption | 240 fits 24-character labels at 14 px without truncation. |
| Sidebar active | `surface-sunken` fill, `ink` text, 500 weight, `aria-current="page"` | Fill plus weight survives grayscale. |
| Collapse | Sidebar to icon rail (56 px) with tooltips at `lg`; to a drawer below `lg` | Labels stay reachable; icons alone are an anti-pattern for primary nav. |
| Tabs | 40 px, 14/500, 2 px `ink` indicator, three to seven tabs | Tabs switch views in place; they are not page navigation. |
| Breadcrumbs | 14 px, `ink-secondary`, chevron 16 px, current item `ink` and not a link | Location, not history (NN/g). |
| Pagination | Numbered pages plus Previous and Next for goal-directed lists; Load more for feeds | NN/g: infinite scroll only for browsing without a goal. |
| Command menu | `Cmd/Ctrl+K`, complements the visible UI | Accelerator for experts (heuristic 7); never the only route. |
| Depth | Three levels: top bar, sidebar or tabs, in-page | Deeper trees need a breadcrumb and are a sign of poor grouping. |
| Mobile | Top bar with menu button (44 px) opening a sheet; bottom tab bar only for apps with three to five equal destinations | Thumb reach and platform convention (Apple HIG, Material). |

## Top bar

```
|  Logo   Product  Docs  Pricing  Blog                          [Search]  Sign in  [Primary] |
   64px tall, container 1200, items 14/500, gap 24, hairline bottom
```

- Sticky by default; a 1 px hairline, no scroll shadow.
- `scroll-padding-top: 80px` on `html` so anchors and focus are not hidden under it (WCAG 2.4.11).
- Below 768: logo, optional search icon, menu button. The menu opens a right sheet with the
  same links at 48 px rows.
- Dropdown menus in the bar open on click, one level, max 8 items, with a 200 ms enter.
- Do not put the primary action inside the menu on mobile; keep it in the bar or in the sheet
  footer.

## Sidebar (application)

```
| 240px                    |
|  Workspace switcher 40   |
|  ------------------------|
|  Overview          36    |   item: icon 16 + label 14/500, padding 0 12, radius 8
|  Inbox        (12) 36    |   badge count right-aligned, ink-secondary
|  Projects          36    |
|    Alpha           32    |   nested item indented 28px, max one nesting level
|    Beta            32    |
|  ------------------------|
|  GROUP CAPTION 12/500    |   ink-muted, 0.02em tracking, one of the two allowed uppercase uses
|  Settings          36    |
|  ...                     |
|  User menu         48    |   bottom, sticky
```

- Active: `surface-sunken` fill, `ink` text. Hover: `canvas-soft`.
- Nesting: one level. A second level becomes tabs or a page-level list.
- Collapse to a 56 px rail: icons 20 px, tooltip with the label on hover and focus,
  `aria-label` on each item.
- Sidebar and top bar together: the top bar shrinks to a 56 px page header with breadcrumbs,
  page title and the primary action.

## Tabs

- Three to seven. Two options are a segmented control; more than seven is a select or a list.
- Content type is the same in every tab (NN/g). Sequential steps are a stepper.
- URL-backed when the tab changes what a link would point at (`?tab=billing`).
- Keyboard: arrow keys between tabs, Tab into the panel (APG).

## Breadcrumbs

- Show hierarchy, not the back stack. Start at Home or the top-level section, end at the
  current page, which is plain text with `aria-current="page"`.
- Wrap in `nav aria-label="Breadcrumb"` with an ordered list.
- Over five items, collapse the middle into a `…` menu button.
- Do not use breadcrumbs as the only navigation and do not show them on top-level pages.
- Mobile: keep them at 14 px; if they wrap, show only the parent as "< Parent".

## Pagination

| Situation | Device |
|---|---|
| Users compare or return to items (search results, tables, admin lists) | Numbered pagination, 25 to 50 rows per page, page size selector, `aria-label="Page 3"`, current page `aria-current="page"` |
| Users browse without a goal (feed, gallery) | Load more button; infinite scroll only with a persistent footer route and back-button restore |
| Under 100 items | No pagination; a filter and a sticky header |

Pagination controls are 32 px buttons; the current page is `ink` fill with `canvas` text.
Show "1 to 25 of 240" next to the controls.

## Command menu

- Opens on `Cmd/Ctrl+K` and from a visible search button with the shortcut hint.
- Lists navigation, actions and recent items in groups; fuzzy filter; Enter runs, Escape closes.
- Everything in it is also reachable through the visible UI.
- Not a replacement for search over content unless the product is a search product.

## Active state rules

1. Active is `ink` text plus one structural cue: fill (sidebar), indicator (tabs), weight and
   `aria-current` (top bar). The accent is not the active color; it means "link".
2. Only one item is active per navigation device.
3. Active survives the grayscale test.
4. Hover on the active item does nothing.

## Depth limits

| Level | Device | Example |
|---|---|---|
| 1 | Top bar or sidebar | Projects |
| 2 | Sidebar nested item, or tabs on the page | Project Alpha, then Settings tab |
| 3 | In-page sections, table filters | Members section |

If a fourth level is needed, promote the second level to its own page with breadcrumbs.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Hover-opened mega menus | Accidental opens, no touch path; click-open menus with one level instead (NN/g). |
| Icon-only sidebar by default | Labels are the navigation; icons alone fail recognition for most items. |
| Hamburger on desktop | Hides the site structure; visible navigation wins (NN/g). |
| Infinite scroll for goal-directed lists | Users cannot return to an item or reach the footer. |
| Tabs as page navigation | Breaks the URL and back button; use links with `aria-current`. |
| Accent as active color | Multiplies the accent and weakens the link meaning. |

## Sources

- https://www.nngroup.com/articles/centered-logos/ : logo left, home link.
- https://www.nngroup.com/articles/menu-design/ : menu checklist.
- https://www.nngroup.com/videos/navigation-menu-visibility/ : visible navigation over hamburgers.
- https://www.nngroup.com/articles/drop-down-menus/ : click to open, one to two tiers.
- https://www.nngroup.com/articles/breadcrumbs/ : 11 breadcrumb guidelines, location not history, current page not a link.
- https://www.nngroup.com/articles/infinite-scrolling-tips/ : when infinite scroll fits and when a Load more button is better.
- https://www.nngroup.com/articles/item-list-view-all/ : pagination preferences.
- https://www.nngroup.com/articles/tabs-used-right/ : tab rules.
- https://www.nngroup.com/articles/local-navigation/ : local navigation as wayfinding.
- https://www.nngroup.com/articles/flexibility-efficiency-heuristic/ : accelerators complement the visible UI.
- https://raw.githubusercontent.com/w3c/aria-practices/main/content/patterns/breadcrumb/breadcrumb-pattern.html : breadcrumb ARIA pattern (fetched status 200).
- https://raw.githubusercontent.com/w3c/wcag/main/understanding/22/focus-not-obscured-minimum.html : sticky bars must not hide focus (fetched status 200).
- https://accessibility.build/guides/accessible-tabs : APG tabs keyboard model.
- https://www.npmjs.com/package/cmdk : command menu library.
- https://github.com/Leonxlnx/taste-skill : nav height cap and one-row rule.
