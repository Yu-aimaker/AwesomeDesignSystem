# Data visualization

Charts follow the same rules as the rest of the system: neutral surfaces, one message per
view, color as a label rather than decoration. AwesomeDS defines an eight-color categorical
palette, light and dark, and the handful of layout rules that make a chart readable at a glance.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Categorical palette | 8 colors, `--ds-chart-1..8`, hue-spread in OKLCH at fixed lightness | Eight is the most a legend can hold; equal lightness keeps no series louder than another. |
| Dark mode | separate 8 values, lighter and less saturated | Same hues, lightness raised so every series reaches 3:1 on `#0a0a0a`. |
| Single series | `ink`, never the accent | The accent means interactive; a bar is not a link. |
| Emphasis | one series in `chart-1`, the rest `hairline-strong` | Highlight by muting others, not by adding a color. |
| Grid | `--ds-chart-grid` (hairline), horizontal lines only, no vertical grid | Vertical grids compete with bars. |
| Axis text | 12 px, `ink-secondary`, tabular numerals | Numbers align; labels recede. |
| Color alone | never; add direct labels, patterns or shapes when series exceed 4 | WCAG 1.4.1 Use of Color; 1 in 12 men has a color vision deficiency. |
| Animation | 300 ms ease-out on first draw only; no animation on data updates | Motion shows what changed; on load it shows structure once. |
| Empty and loading | skeleton at the chart's size, then an empty state with the reason | A chart that appears as a blank box reads as broken. |
| Library | Recharts by default (shadcn/ui charts); visx for custom marks | Declarative, themeable through CSS variables. |

## Palette

| Token | Light | Dark | Use |
|---|---|---|---|
| chart-1 | `#356ddc` | `#689cfe` | first series, emphasis |
| chart-2 | `#b65403` | `#f67f2f` | second series |
| chart-3 | `#057a6b` | `#26b39d` | third series |
| chart-4 | `#ca2356` | `#f9678f` | fourth series |
| chart-5 | `#7544a3` | `#b48ee0` | fifth series |
| chart-6 | `#0e5a1a` | `#57a85f` | sixth series |
| chart-7 | `#ac8206` | `#e0b52e` | seventh series |
| chart-8 | `#7d8390` | `#a3a9b5` | other, remainder |

Status colors (`success`, `warning`, `danger`) are reserved for values that are good or bad,
never for series identity.

## Layout

- Title states the finding ("解約率は 3 か月連続で下がった"), not the metric name.
- Legend on top for up to 4 series, direct labels on the marks beyond that.
- Y axis starts at zero for bars; line charts may not, and then say so.
- Tooltip shows every series at the hovered x with tabular numbers, 200 ms delay.

## Alternatives considered

- Sequential ramps of the accent: reads as importance, not category; kept for heatmaps only.
- Rainbow (12+) palettes: indistinguishable past eight; group the tail as "other".

## Sources

- Observable, Color schemes: https://observablehq.com/@d3/color-schemes
- Datawrapper, What to consider when choosing colors for data visualization: https://blog.datawrapper.de/colors/
- WCAG 2.2, 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- shadcn/ui, Charts: https://ui.shadcn.com/docs/components/chart
- Edward Tufte, The Visual Display of Quantitative Information (data-ink ratio): https://www.edwardtufte.com/tufte/books_vdqi
