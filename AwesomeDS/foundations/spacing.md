# Spacing and layout grid

AwesomeDS spaces everything on a 4 px base. The scale, the three distance bands
(inside, between, section), the 1200 px container, the 12-column grid and the touch
target minimums are defined here with their reasons.

## Decisions

| Token | px | Typical use |
|---|---|---|
| space-1 | 4 | Icon to label gap, badge padding |
| space-2 | 8 | Inside compact controls, list item gap |
| space-3 | 12 | Input horizontal padding, ghost button padding |
| space-4 | 16 | Button horizontal padding, card gap on mobile |
| space-5 | 20 | Rare; between form fields when 16 is tight |
| space-6 | 24 | Card padding, grid gutter on desktop |
| space-8 | 32 | Between groups |
| space-10 | 40 | Control height (md), section padding on mobile |
| space-12 | 48 | Between groups (large), control height (lg) |
| space-16 | 64 | Section spacing on mobile |
| space-20 | 80 | Section spacing on tablet |
| space-24 | 96 | Section spacing on desktop |
| space-32 | 128 | Hero to first section on large screens |

Two centered page widths: 1200 px (galleries, home) and 760 px (document pages).
Page side margin 20 / 24 / 32 px at < 640 / 640 / 1024. Reading width 65ch Latin,
40em Japanese. Grid 12 columns, 24 px column gap desktop, 16 px mobile.
Breakpoints 640, 768, 1024, 1280, 1536.

## Why 4 px

- Every value divides cleanly into 8, 16, 24, 40 and 48, which are the sizes of the controls
  and icons. Atlassian and Carbon use an 8 px base; a 4 px base keeps those steps and adds
  the half step needed for 12 px padding and 20 px icons (Polaris also steps in 4 px).
- Type sizes 12/16/20/28/36 and line heights land on 4 px multiples (16 x 1.5 = 24,
  28 x 1.25 = 35 rounds to 36), so text blocks and boxes align without fractional pixels.
- Tailwind v4 uses a 4 px (0.25rem) spacing unit; `tailwind.css` maps tokens one to one.

## The three bands

Gestalt proximity: distance is read as relationship. The scale is split into bands so the
same gap always means the same relationship.

| Band | Range | Meaning | Examples |
|---|---|---|---|
| Inside | 8 to 16 | Parts of one component | Label to input (8), button padding (16), card content gap (16) |
| Between | 16 to 24 | Related elements | Form fields (16 to 20), cards in a grid (24) |
| Group | 32 to 48 | Different groups in a section | Form sections (32), heading to content (32 to 48) |
| Section | 64 to 96 | Page sections | 64 mobile, 80 tablet, 96 desktop |

NN/g's note on "Why Does a Design Look Good?" observes the same rule: one padding unit
between elements, double between groupings. Refactoring UI says the same in its spacing
chapter: start with too much space and remove.

Rule: never use two adjacent scale steps for the same relationship on one page (for example
cards at 20 px gap in one grid and 24 px in another).

## Container and grid

| Decision | Value | Reason |
|---|---|---|
| Content max width | 1200 px for galleries, 760 px for documents (see Page width) | Linear, Vercel, Notion and Stripe measured containers cluster between 1120 and 1280. 1200 keeps a 12-column grid with 24 px gutters at 78 px columns. |
| Reading max width | 65ch | Line length, see typography.md. Applies to paragraphs inside any container. |
| Columns | 12 | Divides into 2, 3, 4 and 6; the only common count that does. |
| Gutter | 24 px desktop, 16 px mobile | Matches card padding, so a grid of cards and the card interior share one rhythm. |
| Implementation | CSS Grid | `grid-template-columns: repeat(12, minmax(0, 1fr))`. No percentage flex math (`w-[calc(33%-1rem)]`). |

## Page width, side margin and reading width

| Decision | Value | Token | Reason |
|---|---|---|---|
| Side margin, phone (< 640) | 20 px | `--ds-gutter-sm` | 14 of 17 measured pages sit at 15 to 25 px (Stripe and GOV.UK 15 to 16, Apple, Linear, Vercel, shadcn about 24). impeccable flags body text under 16 px from the edge and prefers 24 to 32. |
| Side margin, tablet (640 to 1023) | 24 px | `--ds-gutter-md` | Between the phone and desktop values. GOV.UK gutter 30, Carbon md 32 in total (16 margin plus 16 column padding), Atlassian tablet 16. Material 3's 24 dp is not cited: m3.material.io did not load on 2026-10-21. |
| Side margin, desktop (1024 and up) | 32 px | `--ds-gutter-lg` | SmartHR main area 32, Carbon lg 32, Primer xlarge 24, GOV.UK 30. |
| Gallery and home width | 1200 px, centered | `--ds-container` | Room for 3 to 4 cards of 280 px with 16 px gaps. Measured product sites sit at 960 to 1266 px. |
| Document page width | 760 px, centered | `--ds-container-doc` | Measured doc sites hold the text column at 539 to 760 px (Material 3 760, GOV.UK Design System 722, shadcn and SmartHR 640). The column is the 640 px Japanese reading width plus room for figures, so the text itself sits near the middle of the screen. GOV.UK's page with the text in two thirds gives the same column: the source on `main` sets 960 px, while the layout page now says the default maximum is 1020 px. |
| Reading width, Latin | 65ch | `--ds-measure` | 45 to 75 characters (Butterick, Baymard, impeccable, Every Layout). |
| Reading width, Japanese | 40em (40 full-width characters) | `--ds-measure-ja` | WCAG 1.4.8 (CJK at most 40), デジタル庁「半角80文字（全角40文字）程度」 (typography accessibility page). `ch` is the width of "0", so `65ch` gives 43 full-width characters in Geist at 16 px; `em` is one full-width character. |

Rules:

1. Running text stops at the reading width, inside any container. Figures, tables, code
   and card grids may use the full page width.
2. Pick the page width by content: a page that is mostly text and figures uses 760; a page
   that is mostly a grid of things to compare uses 1200. Never let a short paragraph sit
   in a 1200 px box with the right half empty (taste-skill: one empty half of a section is
   a "hole").
3. The header, main area and footer share the same side margin, so their left edges line up.

## Vertical rhythm and grouping

| Relationship | Value | Reason |
|---|---|---|
| Heading to its lead | 8 | The lead belongs to the heading (NN/g proximity). |
| Lead (or heading) to content | 24 | SmartHR: heading to content 16; measured doc sites 13.6 to 24. |
| Between groups inside a section | 32 to 48 | About twice the gap inside a group (NN/g, SmartHR 32 / 24 / 16). |
| Between sections, document and gallery pages | 48 mobile, 64 desktop | Measured doc sites put 33 to 64 above an h2. With 8 to 24 below, the ratio stays 2 to 4. |
| Between sections, home page | 64 mobile, 96 desktop | The home page stacks large visual blocks; the gap must stay clearly larger than the 24 inside them. |
| Card grid gap | 16 at every width | Polaris card gap 16; measured grids 12 to 24 and rarely change by breakpoint. |
| Card padding | 20 under 640, 24 from 640 | Shrink only large spaces on small screens (GOV.UK, Carbon, SmartHR). |

Rules:

1. Space above a heading is at least twice the space below it (taste-skill, impeccable
   `heading-rhythm`). A heading that sits as close to the previous block as to its own
   text reads as a caption of the previous block.
2. Never use one value for everything. Inside < between groups < between sections, in
   roughly 2x steps (hallmark: "If every gap is 24px, the page is a template").
3. Gaps of 16 and below are the same at every width. Only section gaps and large padding
   step down on phones.
4. Pick the column count from the number of items. Four items get two or four columns,
   never three; a single item on its last row spans the row or moves.

## Too much space

Large empty areas fail as surely as cramped ones.

| Failure | Fix | Source |
|---|---|---|
| A wide container with a short paragraph: the right half is empty | Put text in the reading width and the page in the narrower container | taste-skill, GOV.UK two-thirds |
| A blank band of more than about 40 percent of a screen between sections | Reduce the section gap or fill the space with the content that belongs there | taste-skill, NN/g "The Illusion of Completeness" (large gaps read as the end of the page) |
| A title on the left and a number on the far right of a 1200 px row | Keep related items within one reading line of each other | NN/g proximity |
| A grid with one lone card and a wide empty row | Change the column count | taste-skill |

## Breakpoints

| Name | Min width | Typical change |
|---|---|---|
| sm | 640 | Two-column forms, inline button rows |
| md | 768 | Multi-column layouts appear |
| lg | 1024 | Sidebar layouts, three-column grids; navigation is always visible (responsive.md, Navigation) |
| xl | 1280 | Container reaches max width |
| 2xl | 1536 | Extra margin only, no new layout |

These are the Tailwind defaults, so utilities and tokens agree. NN/g notes there is no
industry standard set of breakpoints; picking the tooling's set avoids a second vocabulary.
Every multi-column layout declares its `< 768` fallback in the same component.

## Touch and pointer targets

| Standard | Minimum | Scope |
|---|---|---|
| WCAG 2.2 SC 2.5.8 (AA) | 24 x 24 CSS px, or 24 px spacing circle | All pointer targets, with exceptions for inline text links |
| Apple HIG | 44 x 44 pt | Touch controls |
| Material 3 | 48 x 48 dp, 8 dp between targets | Touch controls; visual can be smaller |

AwesomeDS rule: 44 x 44 on touch (the button `lg` size is 48, `md` is 40 with 4 px of
padding around it counts as 44), 24 x 24 minimum on desktop. Icon buttons at 32 px visual
size get a 44 px hit area through padding on mobile. Table rows are 44 px so the row itself
is a valid target.

Fitts's Law is the reason: larger and closer targets are hit faster with fewer errors.

## Alignment rules

1. Left-align text and controls. Center only short display headings and empty states.
   Users scan from the top left; NN/g measured centered logos as six times more likely to
   fail home navigation.
2. Align to the grid, not to each other. A card's text aligns to the column line, not to
   the image inside the neighbouring card.
3. Optical alignment for icons: a 16 px icon next to 14 px text sits on the text baseline
   with `vertical-align: -0.125em` or flex `align-items: center`.
4. Buttons in a row: right-aligned in dialogs (primary last), left-aligned in forms
   (primary first). One rule per surface, applied everywhere.
5. Section spacing is symmetric (same top and bottom) unless the section has a background
   band, in which case the band's padding is 64 to 96 and the outer margin is 0.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| 8 px base only | Cannot express 12 px input padding or 20 px icons without breaking the grid. |
| Golden-ratio or modular spacing (1.618) | Produces values like 21 and 34 that do not align with control heights. |
| 1400 or 1440 px container | Lines of 16 px text at full width exceed 65ch by a wide margin; taste-skill's `max-w-[1400px]` is for image-heavy marketing pages, not the base. |
| Fluid `clamp()` spacing everywhere | Good for hero padding; as a default it makes token audits impossible. Allowed for section padding only. |
| Material's 48 dp as the web minimum | Correct on Android; on desktop it forces oversized controls. 44 touch / 24 pointer covers both platforms. |

## Sources

- https://www.w3.org/TR/WCAG22/ : WCAG 2.2 including SC 2.5.8 Target Size (Minimum).
- https://wcag22aa.org/new-criteria/target-size/ : plain-language summary of 2.5.8 and its exceptions.
- https://developers.apple.com/design/human-interface-guidelines/foundations/accessibility : 44 x 44 pt hit target.
- https://developer.apple.com/design/human-interface-guidelines/layout : group related items with space, containers or separators; restrict the width of text (2026-10-21).
- https://design-system.service.gov.uk/styles/layout/ : two-thirds layout, at most 75 characters per line, default maximum page width 1020 px (2026-10-21).
- https://raw.githubusercontent.com/alphagov/govuk-frontend/main/packages/govuk-frontend/src/govuk/settings/_measurements.scss : `$govuk-page-width: 960px` on `main` (2026-10-21). The docs and the source disagree; AwesomeDS's 760 px column does not depend on either.
- https://design.digital.go.jp/dads/foundations/typography/accessibility/ : 「半角80文字（全角40文字）程度」 (2026-10-21).
- https://smarthr.design/products/design-patterns/spacing-layout-pattern/ : section 32, element 24, heading to content 16 (2026-10-21).
- https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html : at most 80 characters, 40 for CJK (2026-10-21).
- https://www.nngroup.com/articles/illusion-of-completeness/ : large empty gaps read as the end of the page (2026-10-21).
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/layout.md : holes, one empty half, column count from item count (2026-10-21).
- https://github.com/pbakaus/impeccable/blob/main/cursor-plugin/skills/impeccable/reference/layout.md : more space above a heading than below; body text at least 16 px from the edge (2026-10-21).
- ../../Knowledge/layout/reference-sites-measured.md : measured side margins, widths and gaps of 17 pages (2026-10-21).
- https://m3.material.io/foundations/designing/structure : 48 dp touch targets.
- https://support.google.com/accessibility/android/answer/7101858?hl=en : 48 dp size and 8 dp spacing.
- https://www.nngroup.com/articles/fitts-law/ : target size and distance.
- https://www.nngroup.com/articles/gestalt-proximity/ : proximity as grouping.
- https://www.nngroup.com/articles/why-does-design-look-good/ : one unit between elements, two between groups.
- https://www.nngroup.com/articles/breakpoints-in-responsive-design/ : no standard breakpoint set.
- https://www.nngroup.com/articles/mobile-first-not-mobile-only/ : mobile first without harming desktop.
- https://www.nngroup.com/articles/centered-logos/ : left alignment and navigation success.
- https://www.nngroup.com/articles/form-design-white-space/ : grouping form elements with space.
- https://tailwindcss.com/docs/theme : Tailwind v4 theme variables (spacing and breakpoints).
- https://refactoringui.com/ : spacing system guidance ("start with too much white space").
- https://github.com/voltagent/awesome-design-md : measured containers of Linear, Vercel, Notion, Stripe.
- https://atlassian.design/foundations/spacing : Atlassian space tokens are multiples of an 8px base unit, down to `space.050` = 4px (opened 2026-10-08).
- https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/size.ts : Polaris size scale steps in 4px (`100` = 4px) (fetched 2026-10-08).
