# Responsive

Layouts are designed at 390 px first and grow through five widths. Rules fix what changes at
each step (columns, navigation, density of information) and what never changes (type size,
touch targets, the order of content).

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Breakpoints | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 (Tailwind defaults) | Shared vocabulary with the tooling; content, not devices, decides where to use them. |
| Design widths | 390 (phone), 768 (tablet), 1280 (desktop) for review and screenshots | The three shapes; the rest are interpolation. |
| Container | `max-width: 1280px`, padding 16 / 24 / 32 at sm / md / lg | Measure stays under 75 characters on wide screens (spacing.md). |
| Type | same scale at every width; display sizes use `clamp()` | Shrinking body text on phones is a readability cut. |
| Touch | 44 px targets on `(pointer: coarse)`, 40 px controls elsewhere | Apple HIG 44 pt; WCAG 2.5.8. |
| Navigation | top bar under lg with a sheet, inline nav at lg and up | A hamburger hides less at 390 than a wrapped nav. |
| Tables | horizontal scroll inside the table with a sticky first column under md; never card-ify silently | Comparison is the point of a table; cards lose it. |
| Grids | `repeat(auto-fill, minmax(min(280px, 100%), 1fr))` for galleries | One rule handles every width; `min()` prevents overflow at 320. |
| Images | fluid, `max-width: 100%`, `aspect-ratio` set | No layout shift, no overflow. |
| Overflow | the page never scrolls horizontally; wide content scrolls inside its own container | CI checks `scrollWidth <= clientWidth` at 390 and 1280. |
| Hover | never the only way to reach content; `@media (hover: hover)` gates hover-only affordances | Touch has no hover. |
| Viewport units | `dvh` for full-height layouts, never `vh` | Mobile browser chrome changes the viewport. |
| Content order | DOM order is reading order at every width; no `order` tricks that break focus order | WCAG 1.3.2, 2.4.3. |
| Container queries | `@container` for components that appear in sidebars and main columns alike | A card decides by its own width, not the viewport. |

## Screen shapes

| Width | Columns | Sidebar | Dialogs | Tables |
|---|---|---|---|---|
| 390 | 1 | sheet | full-screen sheet from bottom | scroll, sticky first column |
| 768 | 2 (8 / 4) | collapsed rail or sheet | centered, 90 percent width, max 560 | scroll |
| 1280 | 12 | 240 px fixed | centered, max 560 / 720 / 960 | full |

## Alternatives considered

- Device-based breakpoints (iPhone, iPad): devices change yearly; content widths do not.
- Separate mobile pages: two codebases drift; one responsive layout with container queries covers it.

## Sources

- Tailwind CSS, Responsive design: https://tailwindcss.com/docs/responsive-design
- MDN, CSS container queries: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries
- Apple HIG, Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- WCAG 2.2, 1.4.10 Reflow: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
- web.dev, Learn Responsive Design: https://web.dev/learn/design
