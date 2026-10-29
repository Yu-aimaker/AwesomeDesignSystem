# Responsive

Layouts are designed at 390 px first and grow through four width classes: phone, tablet
portrait, tablet landscape and desktop. Rules fix what changes at each step (columns, panes,
navigation, density of information) and what never changes (type size, touch targets, the
order of content, the set of functions). This file gives the decisions, the CSS for each
pattern, the usual causes of horizontal overflow with their fixes, and how to verify.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Breakpoints | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 (Tailwind defaults); 840 for two panes | Shared vocabulary with the tooling; content, not devices, decides where to use them. 840 is where Android starts showing list and detail side by side. |
| Width classes | phone 320 to 599, tablet portrait 600 to 839, tablet landscape 840 to 1199, desktop 1200 and up | Android window size classes: 99.96 percent of phones in portrait are under 600, 93.73 percent of tablets in portrait are 600 to 839, 97.22 percent of tablets in landscape are 840 to 1199. |
| Review widths | phone 320, 360, 375, 390, 414; tablet 768, 820, 1024, 1180; desktop 1280, 1440 | The most used phone and tablet sizes in StatCounter (worldwide and Japan), plus the WCAG floor. Screenshots kept with a PR: 390 and 1280 always, 768 and 1024 when the layout changes there. |
| Floor width | 320 must still work: no lost content, no two-direction scrolling | WCAG 1.4.10 Reflow; 320 is 1280 at 400 percent zoom. |
| Height | under 480 px of height: one pane, one sticky bar at most | Android: 99.78 percent of phones in landscape are under 480 dp tall, and two panes are not practical there. |
| Container | `max-width: 1200px` (galleries) or `760px` (documents), centered; side padding 20 / 24 / 32 below 640 / from 640 / from 1024 | Measure stays under 75 characters on wide screens (spacing.md). |
| Type | same scale at every width; display sizes use `clamp()` with a `rem` term, interpolated between 360 and 1240 | Shrinking body text on phones is a readability cut. `vw` alone blocks text resizing (web.dev). |
| Form inputs | text in `input`, `select` and `textarea` is 16 px or larger on `(pointer: coarse)`; 14 px only for fine pointers | iOS Safari zooms the page into a focused field under 16 px (CSS-Tricks); DADS sets 16 CSS px as the floor for body and UI text. `tokens.css` applies it. |
| Touch | 44 px targets on `(pointer: coarse)`, 40 px controls elsewhere | Apple HIG 44 pt; WCAG 2.5.8. |
| Pointer and hover | size by `pointer`; gate hover effects with `(hover: hover)`; never gate content on hover | `pointer` and `hover` report the primary input only. density.md explains why sizes read `pointer`, not `any-pointer`. |
| Navigation | visible links from lg (1024) up, never a menu button there. Below lg, visible links when there are 4 or fewer and they fit; otherwise a menu button and a sheet | NN/g: hidden navigation on desktop halves discoverability; on phones, show 4 or fewer links and hide more. See Navigation. |
| Canonical layouts | list-detail and supporting pane: one pane under 840, two from 840; feed: auto-fill grid | Android canonical layouts; Primer splits list-detail into pages on narrow screens. |
| Tables | horizontal scroll inside the table with a sticky first column under md; never card-ify silently | Comparison is the point of a table; cards lose it. |
| Grids | `repeat(auto-fill, minmax(min(280px, 100%), 1fr))` for galleries | One rule handles every width; `min()` prevents overflow at 320. |
| Grid tracks | `minmax(0, 1fr)`, not bare `1fr`, for columns that hold text or code | A bare `1fr` track cannot shrink below its content. |
| Flex children | `min-width: 0` on any flex child that holds text, code or a scroller | The automatic minimum of a flex item is its min-content width. |
| Images | fluid, `max-width: 100%`, `aspect-ratio` set; `srcset` and `sizes` per imagery.md | No layout shift, no overflow, no oversized download. |
| Overflow | the page never scrolls horizontally; wide content scrolls inside its own container with a visible scrollbar | CI checks `scrollWidth <= clientWidth` at 390 and 1280. DADS: do not hide the horizontal scrollbar. |
| Viewport meta | `width=device-width, initial-scale=1`; never `user-scalable=no` or `maximum-scale` | MDN: disabling zoom stops people with low vision from reading the page. WCAG 1.4.4 needs 200 percent. |
| Virtual keyboard | default `resizes-visual`; `interactive-widget=resizes-content` only when a footer must sit above the keyboard | The default keeps the layout still while typing (MDN). |
| Viewport units | `svh` for a hero; `dvh` for an app shell whose footer must stay on screen; never `vh` | `vh` equals `lvh`, so content sits under the expanded browser bar. `svh` does not change while the bar slides, so a hero does not jump. |
| Widths from the viewport | `100%` for full-bleed blocks, never `100vw` | `vw` is sized as if scrollbars did not exist, so with a classic scrollbar `100vw` is wider than the page and overflows by the scrollbar width. |
| Safe areas | `env(safe-area-inset-*)` added to the padding of fixed bars and sheets | Notches and the home indicator cover content otherwise. |
| Content order | DOM order is reading order at every width; no `order` tricks that break focus order | WCAG 1.3.2, 2.4.3; DADS: `order` and grid placement are for visual order only. |
| Functions | the same data and functions at every width; a phone may split one screen into steps | Apple: change how much is visible, not what the app can do. See Adaptive or responsive. |
| Container queries | `@container` for components that appear in sidebars and main columns alike | A card decides by its own width, not the viewport. |

## Screen shapes

Design for the window, not the device. An iPad window can be any width, and a laptop
browser can be 800 px wide. Each class below is a width range; a device lands in a class
by its current window.

| Class | Width | Panes | Columns | Navigation | Sidebar | Dialogs | Tables |
|---|---|---|---|---|---|---|---|
| Phone | 320 to 599 | 1 | 1 | links if 4 or fewer fit, else menu and sheet | sheet | full-screen sheet from bottom | scroll, sticky first column |
| Tablet portrait | 600 to 839 | 1 | 1, or 2 for fixed-size cards | links if they fit, else menu and sheet | sheet | centered, 90 percent width, max 560 | scroll, sticky first column below 768 |
| Tablet landscape | 840 to 1199 | 2 | 8 / 4 or 12 | menu and sheet allowed below 1024; visible links from 1024 | 240 px fixed from 1024, sheet below | centered, max 560 / 720 | scroll when wider than the container |
| Desktop | 1200 and up | 2, or 3 from 1400 | 12 | visible links or a sidebar, never a menu button | 240 px fixed | centered, max 560 / 720 / 960 | full |

Review widths inside each class:

| Class | Widths | Why these |
|---|---|---|
| Phone | 320, 360, 375, 390, 414 | 320 is the WCAG floor. 414, 390 and 375 are the top three in Japan; 360 and 414 lead worldwide (StatCounter, September 2026). |
| Tablet portrait | 768, 820 | 768 x 1024 and 820 x 1180 are the top tablet sizes worldwide. 768 is also the md breakpoint. |
| Tablet landscape | 1024, 1180 | The same tablets turned. Android tests at 1024 x 640 and 1280 x 800 dp. |
| Desktop | 1280, 1440 | 1280 is the xl breakpoint and 1280 x 720 is common; 1440 shows how the 1200 container sits on a wide screen. 1920 as a spot check (28 percent of desktops). |

What 390 leaves for text: 390 minus the 20 px side margin on each side is 350 px. At the
16 px body size that is 21 full-width Japanese characters per line, or about 43 Latin
characters. Plan labels, button text and table headers for that line, not for the desktop one.

Headings fit in two lines at every width. On the 350 px line an `h1` at 32 px holds about 10
full-width characters per line and an `h2` at 28 px about 12, so a Japanese `h1` stays near
20 characters and an `h2` near 24. A longer heading is cut, not shrunk. The arithmetic is
taste-skill's `characters ≈ width ÷ (size × k)` with k = 1 for full-width characters.

## Navigation

One rule for every AwesomeDS page. layout.md, spacing.md and navigation.md point here.

1. From lg (1024) up, top-level navigation is always visible: links in the top bar or a
   sidebar. Never a menu button that hides top-level items. NN/g: "Do not use hidden
   navigation (such as hamburger icons) in desktop user interfaces." A 1024 to 1279 window
   is a laptop, a zoomed desktop or a tablet in landscape; it is a desktop context.
2. When the items do not fit in one row at 1024, make them fit before anything else: shorter
   labels, a smaller gap between items, fewer top-level items (navigation.md caps them at 6),
   or a sidebar. Measure the row with the logo and header actions in every shipped language;
   labels can grow 200 to 300 percent in translation (internationalization.md).
3. Below lg, show the items as links when there are 4 or fewer and they fit on one row with
   their full labels. Otherwise use a menu button (44 px) that opens a sheet. NN/g: "If your
   site has 4 or fewer top-level navigation links, display them as visible links."
4. The navigation never wraps to a second row at any width.
5. In the sheet, every link is at least 44 px tall. The sheet header with the close button is
   sticky, so the close button stays visible when the list scrolls. The sheet uses `h-dvh`,
   bottom padding `calc(16px + env(safe-area-inset-bottom))`, traps focus and closes on Escape.
6. Apps with three to five equal destinations may use a bottom tab bar on phones, a rail on
   tablets and a sidebar on desktops (Apple tab bars: five or fewer; Android: navigation bar
   on compact windows, rail elsewhere).

The AwesomeDS site has 9 top-level items. From lg it shows all of them inline with a shorter
gap between items. Below lg it uses the menu button and the sheet.

```css
.sheet-header {
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 56px;
  background: var(--ds-surface);
  border-bottom: 1px solid var(--ds-hairline);
}
.sheet-link { display: flex; align-items: center; min-height: 44px; }
```

## Canonical layouts

Three layouts cover most product screens. Each states what happens below 840 px.

### List-detail

A list on the left and the selected item on the right, from 840 up. Below 840 the list and
the detail are two screens with a back link. When a two-pane window narrows while an item is
selected, keep the detail on screen and hide the list (Android canonical layouts).

```css
.list-detail { display: grid; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 840px) and (min-height: 480px) {
  .list-detail { grid-template-columns: minmax(280px, 1fr) minmax(0, 2fr); }
}
```

Tailwind: `grid min-[840px]:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]`. Give each pane its
own URL (`/items` and `/items/:id`) so the back link, the browser back button and a shared link
all work.

### Supporting pane

The main content takes about two thirds and a supporting pane (filters, details, comments)
takes the rest, from 840 up. Below 840 the supporting content follows the main content in the
DOM, or opens in a bottom sheet from a button.

```css
.supporting { display: grid; gap: 24px; grid-template-columns: minmax(0, 1fr); }
@media (min-width: 840px) {
  .supporting { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
}
```

### Feed

A grid of items that adapts from one column to many with no breakpoint. Set the minimum item
width, not the column count. Carbon: when the user wants to see more items, tile fixed boxes;
when the user wants to see more of each item, scale the boxes and keep the column count.

```css
.feed {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
}
```

## Height

Width is the main axis, but a phone in landscape (844 x 390) is a medium-width window with a
compact height. Below 480 px of height:

- One pane. Two-pane layouts wait for both `min-width: 840px` and `min-height: 480px`.
- One sticky bar at most, 64 px or less. A sticky footer becomes part of the page.
- Sheets and dialogs scroll inside themselves; their header stays.
- Never lock the orientation (WCAG 1.3.4).

```css
@media (max-height: 479px) {
  .page-footer-bar { position: static; }
}
```

The on-screen keyboard does not trigger this query under the default `resizes-visual`,
because the layout viewport keeps its height.

## Viewport meta and the keyboard

Every page starts with:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

Never add `user-scalable=no` or `maximum-scale`. MDN: disabling zoom "prevents people
experiencing low vision conditions from being able to read and understand page content".

The on-screen keyboard resizes only the visual viewport by default (`resizes-visual`), so the
layout stays still and a sticky footer ends up under the keyboard. When a footer must sit
above the keyboard (a chat composer, a submit bar on a long form), add
`interactive-widget=resizes-content` to the meta and size the shell with `dvh`. Test the result
on iOS Safari and Android Chrome.

## Pointer, hover and hybrid devices

- Sizes read `pointer`. A touch laptop with a trackpad reports `pointer: fine` and keeps
  desktop sizes. An iPad with a trackpad is still a touch screen first; keep 44 px targets
  there. density.md explains why `any-pointer` is not used for sizes.
- Hover effects sit behind `@media (hover: hover)`. `hover` reports the primary input only
  (web.dev), so a secondary mouse may or may not get hover effects. Treat hover as an extra.
- No content, action or label is reachable only by hover. Tooltips repeat what is on the page.
- Never gate content behind `any-hover` or `any-pointer`; a device can report both `fine`
  and `coarse`.

## Type on small screens

- Body and UI text keep their desktop size (16 and 14). Input text is 16 on coarse pointers.
- Display sizes are fluid. The middle value of `clamp()` keeps a `rem` term so browser text
  size still works (web.dev: `vw` alone blocks text resizing). Interpolate between a 360 px and
  a 1240 px viewport (Utopia defaults).

```css
/* 32px at 360, 56px at 1240 */
.display { font-size: clamp(2rem, 1.386rem + 2.727vw, 3.5rem); }
```

- Japanese lines break with `line-break: strict` (japanese-typography.md). Headings follow
  the two-line budget in Screen shapes.

## Adaptive or responsive

- Responsive (default): the same elements, structure and data at every width; the layout
  changes. Adaptive: the structure or the flow changes by width or device (SmartHR's
  definitions).
- The set of functions and data is the same at every width. Apple: "Don't change your app's
  functionality based on the space it occupies." Hide less-used actions in a menu; never drop
  them.
- A phone may split one dense screen into steps. SmartHR: on mobile, employee-facing screens
  should not ask for several operations on one screen. Each step keeps Back and keeps the
  entered data (forms.md, Multi-step).

## Desktop-only screens

Some screens are built for large windows only: a dense admin table editor, a layout tool.
Decide this from evidence about who uses the screen. GOV.UK accepted it for a trade tariff
tool used mostly by office workers during office hours; the rule is still that services work
on every device their users have.

When a screen is desktop-only:

- Keep it usable at 390: the page does not break, wide parts scroll inside themselves.
- Show one notice at the top below 768, in plain words. SmartHR shows the same kind of
  notice on admin screens. Example:
  「この画面はパソコンでの利用を想定しています。スマートフォンでは表示が崩れる場合があります。」
- Do not block the screen or hide its content behind the notice.

## Patterns

### Page container

```css
.page {
  padding-inline: var(--ds-gutter-sm);           /* 20px */
}
@media (min-width: 640px)  { .page { padding-inline: var(--ds-gutter-md); } } /* 24px */
@media (min-width: 1024px) { .page { padding-inline: var(--ds-gutter-lg); } } /* 32px */
.page > .container     { max-width: var(--ds-container);     margin-inline: auto; } /* 1200 */
.page > .container-doc { max-width: var(--ds-container-doc); margin-inline: auto; } /* 760 */
.prose               { max-width: var(--ds-measure); }    /* 65ch */
:lang(ja) .prose     { max-width: var(--ds-measure-ja); } /* 40em */
```

The side margin sits on the outer element and the max width on the inner one, so the
content box is exactly 1200 or 760 px wide and the margin never eats into it. The left and
right margins are equal at every width.

Tailwind: `px-5 sm:px-6 lg:px-8` on the outer element, `mx-auto max-w-ds` or
`mx-auto max-w-ds-doc` on the inner one. Put `min-w-0` on the `main` element when it sits
in a flex or grid shell.

### Gallery grid

```css
.gallery {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
}
```

One column at 320 and 390, two at 768, four at 1280. No breakpoint is written. Without
`min()`, a 280 px minimum overflows a 320 px screen once the container padding is taken out.

### Sidebar and main column

```css
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
}
@media (min-width: 1024px) {
  .layout { grid-template-columns: 240px minmax(0, 1fr); }
}
```

Below lg the sidebar moves into a sheet that the top bar opens. The sheet follows the sheet
rules in Navigation.

### Table that scrolls inside itself

```html
<div class="table-scroll" role="region" aria-label="Plan comparison" tabindex="0">
  <table>...</table>
</div>
```

```css
.table-scroll { overflow-x: auto; }
.table-scroll th:first-child,
.table-scroll td:first-child {
  position: sticky;
  left: 0;
  background: var(--ds-surface);
}
```

`tabindex="0"` and the label let keyboard users focus the region and scroll it with the arrow
keys. The page width stays fixed; only the table moves. Keep the scrollbar visible: no
`scrollbar-width: none` and no `::-webkit-scrollbar { display: none }` on a region that
scrolls. A hidden scrollbar hides the fact that there is more (DADS).

### Card that reads its own width

```css
.card-host { container-type: inline-size; }
.card { display: grid; gap: 12px; }
@container (min-width: 480px) {
  .card { grid-template-columns: 160px minmax(0, 1fr); }
}
```

The same card stacks in a 320 px sidebar and goes side by side in a 720 px column. Two
panels that sit side by side stack once either would be narrower than about 340 px.

### Full-height section

```css
.hero { min-height: 100svh; }
.app  { height: 100dvh; }
```

`svh` stays fixed while the mobile address bar slides, so a hero does not jump. `dvh` follows
the bar, which suits an app shell whose footer must stay on screen. Do not put `dvh` on long
scrolling content: it resizes during the scroll.

### Fixed bar on a notched phone

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

```css
.bottom-bar {
  position: sticky;
  bottom: 0;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
}
```

Add `viewport-fit=cover` only when a bar touches the screen edge. With the default `auto`
the whole page stays viewable and there is nothing to pad; with `cover` the page fills the
display and the insets become required.

### Form input on a touch screen

```css
@media (pointer: coarse) {
  input, select, textarea { font-size: max(var(--ds-text-base), 1em); }
}
```

`tokens.css` ships this rule. It keeps the 40 px control height and changes only the text size.

## Why a page scrolls sideways at 390

These are the usual causes of horizontal overflow. Each fix keeps the content and moves
the scrolling, if any, into the element that needs it.

| Cause | What you see | Fix |
|---|---|---|
| Fixed width (`w-[500px]`, `width: 600px`) | The whole page pans | `w-full max-w-[500px]`, or `min(500px, 100%)` |
| `width: 100vw` on a full-bleed block | Overflow by the scrollbar width on desktop; a stray scrollbar | `width: 100%`; for a bleed out of a padded container use negative margins equal to the padding |
| Flex child with long text or code | A row pushes past the edge although `flex: 1` is set | `min-width: 0` on the child (`min-w-0`) |
| Bare `1fr` grid track | A code block or long word widens its column | `minmax(0, 1fr)` |
| Long unbroken string (URL, file path, product code, hash) | One line runs off the screen | `overflow-wrap: anywhere` on the element that holds it (tokens.css sets it on `:lang(ja)` only, see japanese-typography.md); for code, scroll inside `pre` |
| `white-space: nowrap` on labels, badges or tabs | A row of chips runs off the edge | Let it wrap, or give the row `overflow-x: auto` and a visible edge |
| `pre` without its own scroll | The code block widens the page | `pre { overflow-x: auto; max-width: 100%; }` |
| Media without a limit | An image, `iframe` or `video` wider than the screen | `max-width: 100%; height: auto;` and `aspect-ratio` |
| Off-screen decoration (`translate-x`, negative `right`, a blurred blob) | A blank band to the right | `overflow-x: clip` on that section, when it holds no interactive content |
| A `min-width` on a table, chart or canvas | The component widens the page | Wrap it in a scroll region (Table pattern) |

Do not fix overflow with `overflow-x: hidden` on a page wrapper, `html` or `body`. It hides
the content that overflows, so text and buttons become unreachable. `hidden` also makes the
element a scroll container, so a `position: sticky` header inside it sticks to that box and
stops following the page. `clip` does not create a scroll container, but focusable content
it hides still takes focus without scrolling into view, so keep it to decoration.

## Verification

Run these on every change that touches layout.

| Check | How | Pass |
|---|---|---|
| No page-level horizontal scroll | At 390 and 1280, `document.documentElement.scrollWidth <= clientWidth` on every route | Equal or less. The site runs this as `node web/scripts/screenshot.mjs --check` |
| Floor width | Load at 320 | Nothing cut off, no sideways scroll except inside tables, code and charts |
| Tablet | Load at 768 and 1024 | One pane under 840, two from 840; visible navigation at 1024 |
| Navigation | Load at 1024 in every shipped language | All top-level items visible in one row; no menu button |
| Text zoom | Browser text size 200 percent at 1280 | No clipped or overlapping text (WCAG 1.4.4) |
| Pinch zoom | Read the viewport meta | No `user-scalable=no`, no `maximum-scale` |
| Orientation and height | Phone landscape (844 x 390) | Not locked to portrait (WCAG 1.3.4); one pane; fixed bars cover at most a third of the height |
| Touch | Emulate `pointer: coarse` | Targets 44 px; input text 16 px; nothing is reachable by hover only |
| Headings | Read every `h1` and `h2` at 390, 768 and 1280 | Two lines or fewer |
| Side margins | Measure the main content's left and right inset at 390 and 1280 | Equal, and text at least 20 px from the screen edge |
| Long content | Swap one label for a 40-character Japanese string and one URL for a 120-character URL | The row wraps or scrolls inside itself |
| Screenshots | 390 and 1280, light and dark, kept with the PR | Reviewed by eye before merge |

## Alternatives considered

- Device-based breakpoints (iPhone, iPad): devices change yearly and iPad windows resize
  freely; content widths do not.
- A hamburger menu up to xl (1280) because the row does not fit at lg: it hides navigation
  on laptops and tablets in landscape. Shorten the row instead.
- One tablet class: portrait and landscape tablets fall on either side of 840, where two
  panes start to work, so they get different layouts.
- Separate mobile pages: two codebases drift; one responsive layout with container queries covers it.
- Card-ifying tables under md: each row becomes a card and the columns can no longer be
  compared. Kept only when the table is a list in disguise (one primary value per row). Then
  each row becomes two lines and the fields move to line 2; none are dropped.
- `overflow-x: hidden` on `body` as a safety net: hides bugs instead of fixing them and can
  turn the wrapper into the scroll container for sticky headers.
- 16 px inputs at every width: denser desktop forms lose their 14 px controls for no gain;
  the zoom happens on touch screens only.

## Sources

- Tailwind CSS, Responsive design (breakpoints, container queries): https://tailwindcss.com/docs/responsive-design
- Android Developers, Use window size classes (600 / 840 / 1200, height under 480): https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
- Android Developers, Canonical layouts (list-detail, supporting pane, feed): https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts
- Android Developers, Build adaptive navigation (bar on compact, rail elsewhere): https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation
- Android Developers, Adaptive app quality (test sizes 1024 x 640, 1280 x 800 dp): https://developer.android.com/docs/quality-guidelines/adaptive-app-quality
- Apple HIG, Layout (size classes, do not change functionality by space): https://developer.apple.com/design/human-interface-guidelines/layout
- Apple HIG, Multitasking (resizable iPad windows): https://developer.apple.com/design/human-interface-guidelines/multitasking
- Apple HIG, Tab bars (five or fewer): https://developer.apple.com/design/human-interface-guidelines/tab-bars
- NN/g, Hamburger Menus and Hidden Navigation Hurt UX Metrics (2016): https://www.nngroup.com/articles/hamburger-menus/
- NN/g, Mobile First Is NOT Mobile Only (2016): https://www.nngroup.com/articles/mobile-first-not-mobile-only/
- StatCounter, mobile screen resolution, Japan (September 2026): https://gs.statcounter.com/screen-resolution-stats/mobile/japan
- StatCounter, mobile screen resolution, worldwide: https://gs.statcounter.com/screen-resolution-stats/mobile/worldwide
- StatCounter, tablet screen resolution, worldwide: https://gs.statcounter.com/screen-resolution-stats/tablet/worldwide
- StatCounter, desktop screen resolution, worldwide: https://gs.statcounter.com/screen-resolution-stats/desktop/worldwide
- MDN, viewport meta (`user-scalable`, `interactive-widget`, `viewport-fit`): https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
- MDN, `<length>` (viewport units, `vw` and `vh` are the large viewport): https://developer.mozilla.org/en-US/docs/Web/CSS/length
- web.dev, Large, small, and dynamic viewport units: https://web.dev/blog/viewport-units
- MDN, `pointer` media feature: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/pointer
- MDN, `hover` media feature: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/hover
- web.dev, Learn Design, Interaction (`hover` reports the primary input only): https://web.dev/learn/design/interaction
- web.dev, Learn Design, Typography (keep a relative unit in fluid type): https://web.dev/learn/design/typography
- web.dev, Responsive web design basics (no device or brand breakpoints): https://web.dev/articles/responsive-web-design-basics
- Utopia, Fluid type scale calculator (360 to 1240 defaults): https://utopia.fyi/type/calculator/
- CSS-Tricks, 16px or Larger Text Prevents iOS Form Zoom (2021, secondary source; no Apple or WebKit page documents it): https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
- デジタル庁デザインシステム, タイポグラフィ（16 CSS px 以上が基準値）: https://design.digital.go.jp/dads/foundations/typography/
- デジタル庁デザインシステム, レイアウト（アクセシビリティ）（横スクロールバーを隠さない、order は視覚的な並び替えのみ）: https://design.digital.go.jp/dads/foundations/layout/accessibility/
- SmartHR Design System, モバイルレイアウト（レスポンシブとアダプティブの定義、1 画面 1 操作、管理画面の注意表示）: https://smarthr.design/products/design-patterns/mobile-friendly-layout/
- GOV.UK Service Manual, Designing for different browsers and devices: https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices
- Carbon, 2x Grid (tile fixed boxes or scale boxes): https://carbondesignsystem.com/elements/2x-grid/overview/
- Primer, Responsive (list-detail split into pages on narrow screens): https://primer.style/product/getting-started/foundations/responsive/
- taste-skill at commit 6010f91, `references/copy.md` (headline budget arithmetic) and `references/app-screens.md` section 12 (two-line rows, panels stack under about 340 px): https://github.com/Leonxlnx/taste-skill/tree/6010f91a9935f1c167dfc500fb1a475681892e6b/skills/taste-skill/references
- MDN, CSS container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- MDN, `min-width` (automatic minimum size of flex and grid items): https://developer.mozilla.org/en-US/docs/Web/CSS/min-width
- MDN, `env()` and `safe-area-inset-*`: https://developer.mozilla.org/en-US/docs/Web/CSS/env
- MDN, `overflow` (`clip` versus `hidden`): https://developer.mozilla.org/en-US/docs/Web/CSS/overflow
- MDN, `position` (sticky and the nearest scrolling ancestor): https://developer.mozilla.org/en-US/docs/Web/CSS/position
- CSS Values 4, viewport-percentage lengths and scrollbars: https://www.w3.org/TR/css-values-4/#viewport-relative-lengths
- WCAG 2.2, 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- WCAG 2.2, 1.4.4 Resize Text: https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html
- WCAG 2.2, 1.3.4 Orientation: https://www.w3.org/WAI/WCAG22/Understanding/orientation.html
- web.dev, Learn Responsive Design: https://web.dev/learn/design
