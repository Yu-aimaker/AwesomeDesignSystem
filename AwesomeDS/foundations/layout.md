# Layout

This file covers page anatomy for marketing and product pages built with AwesomeDS:
navigation height, hero rules, section rhythm, footer, the mobile-first requirement,
and the composition rules that stop a page from looking templated.

## Page anatomy

| Region | Spec | Reason |
|---|---|---|
| Navigation | 64 px tall, sticky, `1px hairline` bottom, one row; visible links from lg (1024) up | 64 fits a 40 px button with 12 px padding and takes 7 percent of a 900 px screen; taste-skill keeps the nav to about a tenth of the first screen. A two-line nav is a failure. When to use a menu: responsive.md, Navigation. |
| Logo | Top left, links home | NN/g: centered logos make home navigation fail six times more often. |
| Hero | Fits the first viewport on a 390 px phone; heading max 2 lines, one paragraph, one primary button, at most one secondary | Users spend most viewing time above the fold; NN/g measured 57 percent. A hero that scrolls to reach its CTA has failed. |
| Sections | Document and gallery pages 48 px apart on mobile, 64 on desktop; the home page 64 / 96. Alternate `canvas` and `canvas-soft` only when content needs separation | Rhythm comes from consistent spacing, not from background changes. Values and reasons in spacing.md. |
| Content width | Centered: 1200 px for galleries and home, 760 px for document pages. Paragraphs 65ch Latin, 40em Japanese. Side margin 20 / 24 / 32 | See spacing.md, "Page width, side margin and reading width". |
| Footer | Multi-column links, small type (14 px) at full contrast, same layout on every page | NN/g: users turn to footers for important tasks; tiny low-contrast footers are unreadable. |

## Hero rules

1. Text stack has at most three elements: heading, one paragraph (max 20 words, or 40
   Japanese characters), buttons (one primary, optional one secondary). No eyebrow, no pill
   badge, no "New" chip above the heading.
2. Heading size: 36 px (`h1`) to 56 px (`display`) on desktop; 32 px on a 390 px phone.
   Six or more words means start at 36, not 56.
3. Top padding max 96 px on desktop. More pushes the content to mid-screen and reads as a bug.
4. A hero needs a real visual or none. A div built to look like a screenshot is banned.
5. Trust logos, pricing teasers, avatar rows go in the section below the hero, never inside it.
6. Height uses `min-height: 100svh` when full-height, never `100vh` or `h-screen`. `svh` does
   not change while the mobile address bar slides, so the hero does not jump. `100dvh` is for
   an app shell whose footer must stay on screen (responsive.md, Full-height section).

## Mobile first

- Write the single-column layout first. Add columns at `md` (768) and `lg` (1024).
- Every multi-column layout declares its `< 768` fallback in the same component. No
  "the framework will handle it".
- Navigation follows the one rule in responsive.md, Navigation: visible links from lg (1024)
  up; below lg, visible links when 4 or fewer fit, otherwise a menu button and a sheet. It
  never wraps.
- Touch targets 44 px on mobile (spacing.md).
- Mobile first does not mean mobile only: desktop gets real multi-column layouts, not a
  stretched phone layout (NN/g, "Mobile First Is NOT Mobile Only").

## Composition rules

### Layout-family repetition ban

Once a layout family has been used for a section (three-column cards, split text and image,
full-width quote, logo wall, bento grid), it cannot appear again on that page. A page with
eight sections uses at least four families. Two consecutive text-and-image splits are the
maximum; the third must break the pattern with a full-width or stacked section.

Why: repeated families produce a rhythm the eye learns in two sections and then skips.
NN/g's scanning research shows users stop reading when the pattern looks the same.

### No three identical cards by default

The row of three equal feature cards is the single most recognised template layout.
Alternatives, in order of preference: a two-column list with icon and text, an asymmetric
grid with one wide cell, a single column with generous spacing, a table when the items are
comparable. Three cards are allowed when there are exactly three items of equal weight and
the section is the only card grid on the page.

### Left alignment

Text and controls are left-aligned. Center only short display headings (one or two lines)
and empty-state messages. Centered paragraphs longer than two lines make each line start at
a different x position and slow reading.

### Eyebrows

An eyebrow is the small label, often uppercase and letter-spaced, above a heading. AwesomeDS
does not use them. Put the topic in the heading or in the first sentence, or drop it. The
same goes for a pill badge above a headline, section numbers (`01 / Features`), index
numbering (01 / 02 / 03) and version tags (`v2.0`, `BETA`). An ordered list uses `<ol>`.

Why: in taste-skill's study of 247 sites, tiny uppercase letter-spaced labels appeared on 16
percent of the top sites and 57 percent of the weak ones, and eyebrow labels on 32 and 45
percent. Its earlier limit of one eyebrow per three
sections was dropped for an outright ban. The only exception is a page that shows eyebrows as
a "bad" example.

### Bento grids

Cells equal the number of items. No blank tiles. At least two cells carry a real image or a
tinted background; six white cards with text is a template.

### Section headers

Heading on top, paragraph below, both left-aligned, paragraph max 65ch. The "big heading
left, small explainer paragraph right" split header is not a default. Every section that
holds running text opens with a heading.

### Headings fit in two lines

Every `h1` and `h2` fits in two lines at every width from 320 up. At 390 the text line is
350 px, so a Japanese `h1` (32 px) holds about 20 characters and an `h2` (28 px) about 24. Cut
words first; do not shrink the heading. The arithmetic is in responsive.md, Screen shapes.

### Rows of cards

- Cards that share a row share a bottom edge. Balance the content first (same number of list
  rows, blocks of similar height). When the content cannot balance, use `align-items: start`
  and let each card keep its own height, or pin only a footer action ("すべて見る", a total)
  to the bottom of the stretched card. A stretched card with an empty band of more than
  40 px is a hole.
- Pick the column count from the number of items so the last row is not a lone orphan. Four
  items get two or four columns; five get a row of three and a row of two with the two
  spanning, or one column on a phone. A single item on its last row spans the row.
- An auto-fill gallery with many items may end on a short row; that is a feed, not an orphan.

### Frame

- Left and right margins are equal at every width. The header, main area and footer share
  them (spacing.md).
- Text never sits closer than 20 px to the screen edge. taste-skill's floor is 16; AwesomeDS
  keeps 20.

### Backgrounds

`canvas` and `canvas-soft` only. A dark band (`ink` background, `canvas` text) is allowed
once per page for a pricing or CTA section. No gradients, mesh, glass or blurred blobs.
No `backdrop-filter: blur` on a bar or panel that sits over a plain canvas: there is nothing
behind it to blur, so the blur only costs paint time. A sticky bar over plain canvas is solid
`canvas`.

## Product (app) layout

| Region | Spec |
|---|---|
| App shell | Sidebar 240 to 280 px at `lg`, collapses to a drawer below |
| Page header | 56 to 64 px, title `h2` 28 px, one primary action right-aligned |
| Content padding | 24 px desktop, 16 px mobile |
| Data tables | Width follows the content: a table of five columns or fewer runs to about 760 px and does not stretch across a 1200 px container. Sticky header, 44 px rows. Header and cell rules in components/README.md, Table |
| Panels | `surface` with `1px hairline`, `radius-lg`, 24 px padding |

## Responsive images

`aspect-ratio` set on every image container, `object-fit: cover`, `width` and `height`
attributes present so the browser reserves space and layout does not shift.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Centered hero over a mesh gradient | Named as the leading AI-generated layout tell. |
| Full-bleed 1440 px containers | Text lines exceed 65ch; only image-led brands need it. |
| Eyebrows, one per three sections | The limit still produced the templated rhythm; the heading alone carries the topic. Replaced by a ban. |
| Zigzag text-image alternation for the whole page | Banal after two repeats; capped at two. |
| `h-screen` heroes | Jumps on iOS Safari when the address bar hides. |
| Parallax and scroll-jacking as default | Motion for its own sake; allowed only through the motion decision tree. |

## Sources

- https://www.nngroup.com/articles/centered-logos/ : logo position and navigation success.
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ : scanning behaviour.
- https://www.nngroup.com/reports/how-people-read-web-eyetracking-evidence/ : users scan, 20 to 28 percent of text read.
- https://www.nngroup.com/articles/mobile-first-not-mobile-only/ : desktop still needs real layouts.
- https://www.nngroup.com/articles/breakpoints-in-responsive-design/ : breakpoint definitions.
- https://www.nngroup.com/videos/footers/ : footers are underrated.
- https://www.nngroup.com/articles/113-design-guidelines-homepage-usability/ : navigation adjacent to main body, grouped items.
- https://www.nngroup.com/videos/navigation-menu-visibility/ : visible navigation.
- https://www.nngroup.com/articles/menu-design/ : menu design checklist.
- https://www.nngroup.com/articles/local-navigation/ : local navigation as wayfinding aid.
- https://www.nngroup.com/articles/back-to-top/ : sticky menus versus back-to-top.
- https://www.nngroup.com/articles/cards-component/ : when cards are the right container.
- https://web.dev/blog/viewport-units : `svh`, `dvh` and mobile toolbars.
- https://github.com/Leonxlnx/taste-skill/tree/6010f91a9935f1c167dfc500fb1a475681892e6b/skills/taste-skill : current house rules (`SKILL.md`: two-line headlines, no eyebrows, equal margins, no glass); `references/layout.md` (nav about a tenth of the first screen, no two neighbouring sections in one layout); `references/app-screens.md` sections 4 and 7 (column count from item count, cards in a row share a bottom edge, narrow tables about 760 px); `references/research.md` (tiny uppercase labels on 16 percent of top sites and 57 percent of weak ones). Read in a local clone at commit 6010f91 (2026-10-21).
- https://github.com/Leonxlnx/taste-skill-classics : the older v1 and v2-experimental skills, where the nav cap of 80 px, the four-families-per-eight-sections rule, the bento cell rule, the split-header ban and the three-card ban were first written (section 14 pre-flight). taste-skill's CHANGELOG 2.1.3 says those skills moved there with the same files. Repository confirmed with `git ls-remote` on 2026-10-21.
- https://github.com/voltagent/awesome-design-md : Apple section rhythm (light hero, dark tile, light tile), Linear product-screenshot heroes, Vercel single black CTA.
