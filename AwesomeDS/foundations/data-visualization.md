# Data visualization

Charts follow the same rules as the rest of the system: neutral surfaces, one message per
view, color as a label rather than decoration. AwesomeDS defines an eight-color categorical
palette, light and dark, and the rules that make a chart readable at a glance, on a 390px
phone, with a screen reader, and in dark mode.

The design-verifier static audit enforces seven of these rules. The table under
[Verification](#verification) maps each rule to its finding id.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Categorical palette | 8 tokens, `--ds-chart-1..8`: 7 hues and 1 gray | Hues are spread around the OKLCH circle; the gray is for "other". |
| Series per chart | 7 at most. With more categories, keep the top 6 in `chart-1..6` and group the rest as その他 in `chart-8` | Datawrapper: past seven colors, change the chart type or group categories. |
| Series order | `chart-1` first, in token order; never reorder by taste | Neighbours in token order differ in hue, so the first series always stand apart. |
| Dark mode | separate 8 values, same hue per token, OKLCH lightness raised from 0.41-0.63 to 0.66-0.86 | Every mark stays at least 3:1 on `#0a0a0a` and `#141414`. |
| Single series | `ink`, never the accent | The accent means interactive; a bar is not a link. |
| Emphasis | one series in `chart-1`, the rest `hairline-strong` | Highlight by muting others, not by adding a color. |
| Status colors | `success`, `warning`, `danger` only for values that are good or bad | Series identity in a status color reads as an alert. |
| Grid | `--ds-chart-grid`, horizontal lines only | Vertical grids compete with bars and with the time axis. |
| Axis text | 12 px, `ink-secondary`, tabular numerals | Numbers align; labels recede. |
| Bar baseline | 0, always | Bar length must be proportional to the amount. |
| Y axes | one per chart | A general audience misreads dual-axis charts. |
| Labels | on the mark (line end, bar end, slice); a color key only where the label does not fit | The eye does not travel between key and mark. |
| Title | the finding, in one sentence | The title is the one statement the reader should remember. |
| Source | name and URL under every chart | The reader can check the number. |
| Color alone | never; direct labels, values or a table carry the same information | WCAG 1.4.1 Use of Color. About 1 in 12 men has a color vision deficiency. |
| Text alternative | a short label on the chart, the finding and the data in `<figcaption>` or a table | WCAG 1.1.1; a chart is a complex image. |
| Animation | 300 ms ease-out on first draw only; none on data updates; none under reduced motion | Motion shows structure once. |
| Empty and loading | skeleton at the chart's size, then an empty state with the reason | A chart that appears as a blank box reads as broken. |
| Library | Recharts by default (shadcn/ui charts); visx for custom marks | Declarative, themeable through CSS variables. |

## Palette

Values are the ones in `tokens/tokens.json` (`chart.light`, `chart.dark`).
`scripts/dataviz-palette.test.mjs` fails when this table and the tokens disagree.
Contrast is measured by `tokens/scripts/check-contrast.mjs` against canvas
(`#ffffff` light, `#0a0a0a` dark). `chart-1` leads, `chart-8` is その他, `chart-grid` is
for horizontal grid lines only.

| Token | Light | Dark | OKLCH hue | Contrast light | Contrast dark |
|---|---|---|---|---|---|
| chart-1 | `#356ddc` | `#689cfe` | 262 (blue) | 4.80 | 7.33 |
| chart-2 | `#b65403` | `#f67f2f` | 50 (orange) | 4.93 | 7.54 |
| chart-3 | `#057a6b` | `#59ceba` | 180 (teal) | 5.25 | 10.33 |
| chart-4 | `#ca2356` | `#ee5377` | 10 (rose) | 5.40 | 5.79 |
| chart-5 | `#7544a3` | `#d1a9ff` | 305 (violet) | 6.75 | 10.21 |
| chart-6 | `#0e5a1a` | `#8eeb92` | 145 (green) | 8.41 | 13.62 |
| chart-7 | `#ac8206` | `#e4b750` | 85 (ochre) | 3.53 | 10.55 |
| chart-8 | `#7d8390` | `#8c939f` | gray (chroma 0.02) | 3.80 | 6.40 |
| chart-grid | `#e5e5e5` | `#262626` | none | 1.26 | 1.31 |

What the palette guarantees, and what it does not:

- Every mark is at least 3:1 on canvas and surface in both modes (WCAG 1.4.11). The grid is
  decorative and only needs to be visible (1.2:1).
- Every pair of marks is apart in OKLab by at least 0.10 for normal vision, 0.06 under
  protanopia and deuteranopia, and 0.045 under tritanopia. `check-contrast.mjs` simulates
  each type and fails below those distances.
- Lightness is not equal. In light mode OKLCH L runs from 0.41 (`chart-6`) to 0.63
  (`chart-7`), so `chart-6` reads darker than the rest. Emphasis comes from muting the
  other series, not from picking a darker token.
- `chart-1` is close to the light accent `#2f5bea`. A chart is not interactive because its
  first series is blue; do not put links in that color next to a chart.

## Choosing the chart

Pick the chart from the question, not from the data shape. Chart families follow
Claus Wilke, Fundamentals of Data Visualization, chapter 5.

| Question | Chart | Rules |
|---|---|---|
| Which is bigger? (amounts) | Bar. Horizontal when the category labels would otherwise rotate | Sort by value unless the categories have a natural order (age groups, months). Start at 0. |
| How did it change? (time) | Line | Time on the x axis, left to right. Label each line at its right end. The y axis may start above 0; then say so in the description. |
| What share is each part? (proportions) | Stacked bar; pie for a few parts of one whole (the audit flags more than 7 slices) | The parts must add up to 100%. Label the share on the slice or segment. |
| How are the values spread? (distribution) | Histogram or box plot | State the bin width. |
| Do two measures move together? (x-y) | Scatter | Both axes labeled with units. A trend line only with its method in the description. |
| One number that matters | A stat with its comparison, not a chart | 「解約率 2.1%（前月 2.6%）」 is faster to read than a one-bar chart. |

## Text in the chart

The title, labels and source carry the meaning. The marks support them.

- **Title**: the finding. 「3月の入金は前年の2倍」, not 「入金の推移」.
- **Description** (one line under the title): the exact definition, unit and period.
  「月次、税込、2025年4月から2026年3月」.
- **Axis title**: the unit once, on the axis, not on every tick. 「万円」.
- **Ticks**: about 5 on the value axis. Japanese large numbers use 万 and 億 through
  `Intl.NumberFormat("ja-JP", { notation: "compact" })`, which prints `1.2万` and `1.2億`.
- **Direct labels**: on the line end or bar end, in the series color for lines, in `ink`
  for values.
- **Source**: under the chart. 「出典: 総務省統計局 家計調査（https://...）」.
- **Numbers in sentences** match the chart. A sentence that quotes a figure the chart does
  not show is a correctness tell (`anti-patterns.md`, Correctness).

## On a 390px phone

A chart is a fixed-aspect drawing inside a fluid page. On a phone it must shrink without
scrolling the page sideways (`responsive.md`).

- Width is 100% of the container; height is fixed (240 px is a good start), not an aspect
  ratio, so the plot does not become a strip.
- Long category labels: switch to horizontal bars instead of rotating the labels.
- Halve the ticks on the time axis (every other month, or quarters).
- Direct labels that collide: keep the labels for the highlighted series and for the last
  point only.
- Tooltips open on tap and close on a second tap or outside tap. The tap target of a bar or
  point is at least 44 px tall (`responsive.md`, touch).
- A chart that cannot be read at 390 gets a table below it, not a sideways-scrolling plot.
  A wide table scrolls inside its own container.

## Accessibility

A chart is a complex image (W3C WAI Images tutorial). It needs a short alternative and a
long one.

1. Wrap the chart in `<figure>`. Give the drawing `role="img"` and an `aria-label` that
   names the chart and its finding: 「棒グラフ: 3月の入金は前年の2倍」.
2. Put the long description in `<figcaption>`: the finding, the definition, and the
   source. Show it to everyone, not only to screen readers.
3. For any chart someone must read values from, offer the data as a `<table>` with a
   `<caption>`, under a 「表で見る」 disclosure or below the chart.
4. Direct labels and values satisfy WCAG 1.4.11 for the marks they label, and keep the chart
   readable without color (1.4.1). Text in the chart meets 4.5:1 like any other text.
5. Tooltips that hold information must be reachable by keyboard: focusable points or a
   table that holds the same numbers.
6. Under `prefers-reduced-motion: reduce`, draw the chart at its final state.

## Dark mode

- Switch the palette through the tokens; never pick dark colors per chart.
- Charts are drawn in SVG or canvas, so the photo dimming in `tokens.css` does not apply.
  A chart exported as an image (`<img>`) needs `data-no-dim`, or it is drawn at 88%
  brightness like a photo.
- The grid becomes `#262626` and axis text `ink-secondary` (`#a3a3a3`).
- A chart that must keep a white background in dark mode (a slide or a report preview)
  sits inside `data-theme="light"`, the same as other light examples.

## States

| State | What to show |
|---|---|
| Loading | Skeleton at the chart's final width and height, no spinner over an empty axis |
| Empty | The axes are gone. One line with the reason and the next action: 「この期間のデータはありません。期間を広げてください」 |
| Partial | Draw what exists. Mark the missing range and say why in the description |
| Error | Keep the last good chart if there is one; show the error under the title with a retry |

## Recharts example

```tsx
<figure>
  <h3>3月の入金は前年の2倍</h3>
  <p className="t-caption text-ink-secondary">月次、税込、単位は万円</p>
  <div role="img" aria-label="棒グラフ: 3月の入金は前年の2倍">
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={rows} layout="vertical">
        <CartesianGrid vertical={false} stroke="var(--ds-chart-grid)" />
        <XAxis type="number" domain={[0, "auto"]} tick={{ fill: "var(--ds-ink-secondary)", fontSize: 12 }} />
        <YAxis type="category" dataKey="month" width={56} />
        <Bar dataKey="amount" fill="var(--ds-ink)" isAnimationActive={!reducedMotion}>
          <LabelList dataKey="amount" position="right" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
  <figcaption className="t-caption text-ink-secondary">
    出典: 社内の入金記録（https://example.com/ledger）
  </figcaption>
</figure>
```

One series, so the bars are `ink`. The grid is horizontal, the value axis starts at 0, the
values are on the bars, there is no legend, and the source is under the chart.

## Verification

| Rule | How it is checked |
|---|---|
| Palette matches tokens | `node --test scripts/dataviz-palette.test.mjs` |
| Marks 3:1, pairs distinct under CVD | `node AwesomeDS/tokens/scripts/check-contrast.mjs` |
| Bar baseline at 0 | static audit `bar-baseline` (S2) |
| Title is a finding | static audit `column-title` (S2) |
| Source under the chart | static audit `chart-source` (S2) |
| No color key on line, area, pie | static audit `color-key` (S2) |
| One y axis | static audit `dual-axis` (S2) |
| 7 series at most | static audit `too-many-colors` (S2) |
| No vertical grid | static audit `vertical-grid` (S2) |
| 390 without sideways scroll | `web/scripts/screenshot.mjs --check` on the page that holds the chart |
| Text alternative | by hand: `role="img"` with a finding, `<figcaption>`, a table for read-off values |

The static audit lives in `Plugin/awesome-ds/skills/design-verifier/scripts/static-audit.mjs`;
the rubric with its sources is `reference/rubric.md` in the same skill.

## Alternatives considered

- Sequential ramps of the accent: reads as importance, not category; kept for heatmaps only.
- Rainbow (12+) palettes: indistinguishable past seven; group the tail as その他.
- A legend for every chart: costs eye travel; kept only for bar charts where labels do not fit.

## Sources

All opened 2026-10-21.

- Datawrapper, Lisa Charlotte Muth (2018), What to consider when choosing colors for data
  visualization: "If you need more than seven colors in a chart, consider using another
  chart type or to group categories together." https://www.datawrapper.de/blog/colors/
- Datawrapper, Text in data visualizations (2022): label on the mark, drop the key.
  https://www.datawrapper.de/blog/text-in-data-visualizations
- Datawrapper Academy, Annotate tab: title as the statement, source in the footer.
  https://www.datawrapper.de/academy/annotate-tab
- Datawrapper, Lisa Charlotte Muth (2018), on dual-axis charts: a general audience is
  likely to misread them. https://www.datawrapper.de/blog/dualaxis
- Claus Wilke, Fundamentals of Data Visualization, Directory of visualizations (amounts,
  distributions, proportions, x-y): https://clauswilke.com/dataviz/directory-of-visualizations.html
- Claus Wilke, Visualizing amounts: bars start at zero; swap the axes for long labels; order
  by value unless the order is natural. https://clauswilke.com/dataviz/visualizing-amounts.html
- WCAG 2.2, Understanding 1.4.11 Non-text Contrast: lines in a chart need 3:1; labels and
  values on the chart, or a table after it, can carry the information instead.
  https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- WCAG 2.2, Understanding 1.4.1 Use of Color: https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html
- W3C WAI, Complex images tutorial: a short and a long text alternative, `<figure>` and
  `<figcaption>`, a table in the long description. https://www.w3.org/WAI/tutorials/images/complex/
- Colour Blind Awareness: about 1 in 12 men (8%) and 1 in 200 women.
  https://www.colourblindawareness.org/colour-blindness/
- shadcn/ui, Charts: https://ui.shadcn.com/docs/components/chart
- Edward Tufte, The Visual Display of Quantitative Information (data-ink ratio):
  https://www.edwardtufte.com/tufte/books_vdqi
