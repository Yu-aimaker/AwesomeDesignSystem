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

Container 1200 px. Measure 65ch. Grid 12 columns, 24 px gutter desktop, 16 px mobile.
Breakpoints 640, 768, 1024, 1280, 1536.

## Why 4 px

- Every value divides cleanly into 8, 16, 24, 40 and 48, which are the sizes of the controls
  and icons. Apple's layout guidance uses 8, 16 and 32 point increments; a 4 px base keeps
  those and adds the half step needed for 12 px padding and 20 px icons.
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
| Content max width | 1200 px (72rem, up to 1280 acceptable) | Linear, Vercel, Notion and Stripe measured containers cluster between 1120 and 1280. 1200 keeps a 12-column grid with 24 px gutters at 78 px columns. |
| Reading max width | 65ch | Line length, see typography.md. Applies to paragraphs inside any container. |
| Columns | 12 | Divides into 2, 3, 4 and 6; the only common count that does. |
| Gutter | 24 px desktop, 16 px mobile | Matches card padding, so a grid of cards and the card interior share one rhythm. |
| Implementation | CSS Grid | `grid-template-columns: repeat(12, minmax(0, 1fr))`. No percentage flex math (`w-[calc(33%-1rem)]`). |

## Breakpoints

| Name | Min width | Typical change |
|---|---|---|
| sm | 640 | Two-column forms, inline button rows |
| md | 768 | Multi-column layouts appear; nav shows inline items |
| lg | 1024 | Sidebar layouts, three-column grids |
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
- https://developers.apple.com/design/human-interface-guidelines/foundations/layout/ : 8, 16, 32 point increments.
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
