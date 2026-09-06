# Layout

This file covers page anatomy for marketing and product pages built with AwesomeDS:
navigation height, hero rules, section rhythm, footer, the mobile-first requirement,
and the composition rules that stop a page from looking templated.

## Page anatomy

| Region | Spec | Reason |
|---|---|---|
| Navigation | 64 px tall, sticky, `1px hairline` bottom, one row | 64 fits a 40 px button with 12 px padding. taste-skill caps nav at 80 and defaults 64 to 72; a two-line nav on desktop is a failure. |
| Logo | Top left, links home | NN/g: centered logos make home navigation fail six times more often. |
| Hero | Fits the first viewport on a 390 px phone; heading max 2 lines, one paragraph, one primary button, at most one secondary | Users spend most viewing time above the fold; NN/g measured 57 percent. A hero that scrolls to reach its CTA has failed. |
| Sections | 64 px apart on mobile, 96 px on desktop; alternate `canvas` and `canvas-soft` only when content needs separation | Rhythm comes from consistent spacing, not from background changes. |
| Content width | 1200 px container; paragraphs 65ch | See spacing.md and typography.md. |
| Footer | Multi-column links, small type (14 px) at full contrast, same layout on every page | NN/g: users turn to footers for important tasks; tiny low-contrast footers are unreadable. |

## Hero rules

1. Text stack has at most four elements: optional eyebrow, heading, one paragraph
   (max 20 words), buttons (one primary, optional one secondary).
2. Heading size: 36 px (`h1`) to 56 px (`display`) on desktop; 32 px on a 390 px phone.
   Six or more words means start at 36, not 56.
3. Top padding max 96 px on desktop. More pushes the content to mid-screen and reads as a bug.
4. A hero needs a real visual or none. A div built to look like a screenshot is banned.
5. Trust logos, pricing teasers, avatar rows go in the section below the hero, never inside it.
6. Height uses `min-height: 100dvh` when full-height, never `100vh` or `h-screen`, because
   mobile browser toolbars change the viewport.

## Mobile first

- Write the single-column layout first. Add columns at `md` (768) and `lg` (1024).
- Every multi-column layout declares its `< 768` fallback in the same component. No
  "the framework will handle it".
- Navigation collapses to a menu button at `< 768`; it never wraps.
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

An eyebrow is the small uppercase label above a heading. Maximum one per three sections,
hero included. If section A has one, sections B and C do not. Eyebrows name the topic in
plain words; no section numbers (`01 / Features`), no version tags (`v2.0`, `BETA`) and no
middle-dot chains.

### Bento grids

Cells equal the number of items. No blank tiles. At least two cells carry a real image or a
tinted background; six white cards with text is a template.

### Section headers

Heading on top, paragraph below, both left-aligned, paragraph max 65ch. The "big heading
left, small explainer paragraph right" split header is not a default.

### Backgrounds

`canvas` and `canvas-soft` only. A dark band (`ink` background, `canvas` text) is allowed
once per page for a pricing or CTA section. No gradients, mesh, glass or blurred blobs.

## Product (app) layout

| Region | Spec |
|---|---|
| App shell | Sidebar 240 to 280 px at `lg`, collapses to a drawer below |
| Page header | 56 to 64 px, title `h2` 28 px, one primary action right-aligned |
| Content padding | 24 px desktop, 16 px mobile |
| Data tables | Full container width, sticky header, 44 px rows |
| Panels | `surface` with `1px hairline`, `radius-lg`, 24 px padding |

## Responsive images

`aspect-ratio` set on every image container, `object-fit: cover`, `width` and `height`
attributes present so the browser reserves space and layout does not shift.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Centered hero over a mesh gradient | Named as the leading AI-generated layout tell. |
| Full-bleed 1440 px containers | Text lines exceed 65ch; only image-led brands need it. |
| Eyebrow on every section | Templated rhythm; the heading alone carries the topic. |
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
- https://web.dev/blog/viewport-units : `dvh` and mobile toolbars.
- https://github.com/Leonxlnx/taste-skill : nav height cap, hero stack rules, layout-family ban, eyebrow restraint, bento cell rule, split-header ban, three-card ban.
- https://github.com/voltagent/awesome-design-md : Apple section rhythm (light hero, dark tile, light tile), Linear product-screenshot heroes, Vercel single black CTA.
