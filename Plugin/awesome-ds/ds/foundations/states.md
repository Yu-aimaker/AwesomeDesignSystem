# States

Every control in AwesomeDS has the same set of interactive states, drawn the same way. Every
data view has the same set of data states. This file is the matrix: which states exist, what
each looks like in tokens, when a spinner is allowed to appear, and how optimistic updates
behave.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Interactive states | default, hover, focus-visible, active, disabled, loading, selected, invalid, readonly | The union of what shadcn, Radix and NN/g's button-states guidance name; nine is the full set a control can be in. |
| Data states | loading (skeleton), empty, error, partial, offline | Every list, table and chart can be in each. |
| Hover | background one step (`canvas-soft` or `surface-sunken`), 100 ms | Color only, no movement; hover is confirmation, not decoration. |
| Focus-visible | 2 px `focus-ring`, offset 2 px | WCAG 2.4.7 and 2.4.13; one ring for every control. |
| Active | `scale(0.98)` for 100 ms, or background two steps | Press feedback under 100 ms reads as instant (NN/g response limits). |
| Disabled | opacity 0.5, `cursor: not-allowed`, no hover, still in the tab order only if it explains itself | Exempt from contrast (WCAG 1.4.3) but must stay visible. |
| Loading | spinner replaces the leading icon, label stays, `aria-busy="true"`, pointer events off | The user must still read what they asked for. |
| Selected | `selection` background plus `ink` text, or a 2 px `ink` indicator | Selection is the one place the accent tint appears as a fill. |
| Invalid | `danger` border, `aria-invalid="true"`, error text below with icon | 3.3.1 Error Identification. |
| Readonly | `canvas-soft` background, normal text, no border change on hover | Distinct from disabled: the value can be copied. |
| Spinner delay | show nothing under 400 ms; skeleton from 400 ms to 10 s; progress bar over 10 s | Doherty threshold 400 ms; NN/g skeleton and progress guidance. |
| Optimistic UI | apply the expected result at once, reconcile when the server answers, roll back with a toast on failure | React `useOptimistic`; the wait disappears for the common case. |

## Interactive state matrix

Columns are states; cells are the token change from default. "same" means no change.

| Control | hover | focus-visible | active | disabled | loading | selected | invalid | readonly |
|---|---|---|---|---|---|---|---|---|
| Button primary | fill `primary-hover` | ring | scale 0.98 | opacity 0.5 | spinner, label kept | n/a | n/a | n/a |
| Button secondary | fill `canvas-soft` | ring | fill `surface-sunken` | opacity 0.5 | spinner | fill `surface-sunken`, border `ink` (toggle) | n/a | n/a |
| Button ghost | fill `surface-sunken` | ring | fill `hairline` | opacity 0.5 | spinner | fill `surface-sunken`, text `ink` | n/a | n/a |
| Link | underline, `accent-hover` | ring | same | `ink-disabled`, no underline | n/a | `aria-current`, text `ink`, 500 | n/a | n/a |
| Input, textarea | border `ink-disabled` | border `accent` plus ring | same | fill `surface-sunken`, text `ink-disabled` | trailing spinner (async check) | n/a | border `danger`, text below | fill `canvas-soft`, border `hairline` |
| Select, combobox | as input | as input | same | as input | spinner in the list | item: fill `surface-sunken`, check icon | as input | as input |
| Checkbox, radio | border `ink-secondary` | ring | same | opacity 0.5 | n/a | fill `primary`, white mark | border `danger` | greyed mark, no pointer |
| Switch | track one step | ring | thumb scale 0.95 | opacity 0.5 | thumb spinner (rare) | track `primary` | n/a | n/a |
| Tab | text `ink` | ring inside the tab | same | opacity 0.5 | n/a | text `ink`, 2 px `ink` indicator | n/a | n/a |
| Menu item | fill `surface-sunken` | fill `surface-sunken` (roving focus) | same | `ink-disabled` | n/a | check icon | n/a | n/a |
| Table row | fill `canvas-soft` | ring on the row's focusable | same | text `ink-disabled` | skeleton cells | fill `selection` | cell border `danger` | same |
| Card (clickable) | border `hairline-strong`, `shadow-2` | ring | shadow off | opacity 0.5 | skeleton inside | border `ink` 2 px inside | n/a | n/a |
| Chip (filter) | as secondary | ring | same | opacity 0.5 | n/a | fill `ink`, text `canvas` | n/a | n/a |
| Slider | thumb border `ink` | ring on thumb | thumb scale 1.1 | opacity 0.5 | n/a | n/a | track `danger` | thumb hidden |

Rules that follow

1. Hover never moves or resizes anything. Motion is for enters and presses.
2. Focus-visible is the only 2 px stroke on the page. Nothing else borrows the ring.
3. Disabled controls do not react to hover, and a tooltip on a disabled control must be
   attached to a wrapper so it can still open.
4. A loading button keeps its width. Reserve the spinner's 20 px so the label does not jump.
5. Selected and hover can coexist. Selected is the stronger cue; hover adds one step on top.
6. Invalid stays until the value changes. It does not clear on blur.

## Data state matrix

| State | What the user sees | Tokens | ARIA |
|---|---|---|---|
| loading | Skeleton blocks in the final layout's shape | flat `surface-sunken` bars at the final size, `radius-xs` text lines, no shimmer, no shift when data lands | `aria-busy="true"` on the region |
| empty | Icon 32 px `ink-muted`, heading 16/600, one sentence, one action | centered in the container | none |
| error | Icon `danger`, heading, cause, fix, Retry | `danger-soft` background only for inline banners | `role="alert"` when blocking, `role="status"` otherwise |
| partial | The rows that loaded plus an inline notice: "Showing 40 of 120. Some items did not load. Retry." | notice in `warning-soft` with icon | `role="status"` |
| missing value | A grey dash at body size in the cell; a real zero printed as `0` in the normal style | `ink-muted` dash | `aria-label` on the cell ("なし" or "Not available") |
| offline | Banner at the top of the content: "You are offline. Changes will sync when you reconnect." | `surface-sunken`, `ink` text, icon | `role="status"`, persistent |

Partial and offline are the two states products forget. A list that silently shows 40 of 120
is worse than an error.

## Timing

| Wait | Show | Reason |
|---|---|---|
| under 400 ms | nothing; the old content stays | Doherty threshold: interaction under 400 ms feels continuous. A spinner that flashes for 200 ms adds noise. |
| 400 ms to 1 s | skeleton or inline spinner appears | NN/g: under 1 s the flow of thought is kept; the indicator confirms the system heard. |
| 1 s to 10 s | skeleton for regions, spinner for a single control | NN/g: skeletons for 2 to 10 s page loads, spinners for isolated elements. |
| over 10 s | determinate progress bar with percent or step count, and a cancel | NN/g: users lose attention after 10 s and need to know how long. |

Implementation: start a 400 ms timer when the request begins; render the indicator only when
the timer fires and the request is still pending. Once shown, keep it for at least 300 ms so
it does not flicker.

## Optimistic UI

Use it when the action almost always succeeds and the result is predictable: toggling a
favourite, renaming, reordering, sending a message, marking read.

1. Apply the expected state at once (React `useOptimistic` or a local cache update).
2. Send the request. Do not show a spinner unless it passes 400 ms.
3. On success, replace the optimistic state with the server state. If they match, nothing moves.
4. On failure, revert and show a toast with the reason and a Retry action. Keep the user's
   input (the typed message, the new name) so nothing is lost.

Do not use optimistic UI for payments, deletions without undo, permission changes, or anything
where a false success has a cost.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Spinner immediately on every request | Flashes for fast requests; measured as noise (NN/g). |
| Hover effects with lift or scale | Movement on hover reads as unstable and fails on touch. |
| Disabled controls hidden from the tab order | Screen reader users lose the information that the action exists. |
| Empty state that only says "No data" | Does not explain what will appear or how to add it. |
| Pessimistic UI everywhere | Every toggle waits on a round trip; the product feels slow. |

## Sources

- https://github.com/Leonxlnx/taste-skill/tree/6010f91a9935f1c167dfc500fb1a475681892e6b/skills/taste-skill/references : `app-screens.md` section 7 (table header without a fill band, no zebra, numbers right-aligned, narrow tables about 760 px) and section 11 (real zero, grey dash for missing, flat skeleton bars without shimmer). Read in a local clone at commit 6010f91 (2026-10-21).
- https://lawsofux.com/doherty-threshold/ : 400 ms threshold (seen in search results; host not fetchable here).
- https://www.nngroup.com/articles/response-times-3-important-limits/ : 0.1 s, 1 s, 10 s.
- https://www.nngroup.com/articles/skeleton-screens/ : skeleton screens 101.
- https://www.nngroup.com/videos/skeleton-screens-vs-progress-bars-vs-spinners/ : skeletons 2 to 10 s, spinners for isolated elements, progress bars over 10 s.
- https://www.nngroup.com/videos/button-states-101/ : the five button states.
- https://www.nngroup.com/videos/empty-states-in-application-design-guidelines/ : empty state guidance.
- https://www.nngroup.com/articles/error-message-guidelines/ : error content.
- https://raw.githubusercontent.com/reactjs/react.dev/main/src/content/reference/react/useOptimistic.md : `useOptimistic` shows the result of an action immediately and converges with the real state when the action completes (fetched).
- https://raw.githubusercontent.com/w3c/wcag/main/understanding/21/status-messages.html : 4.1.3 Status Messages, `role="status"` (fetched).
- https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html : focus ring size and contrast.
- https://www.radix-ui.com/primitives/docs/components/dialog : state attributes (`data-state`) on primitives.
- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default : component states inherited from Base UI.
