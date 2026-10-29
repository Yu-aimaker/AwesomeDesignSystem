# Radius

AwesomeDS uses one radius family: 8 px on controls, 12 px on cards and menus, 16 px on
dialogs and sheets, pill on badges, avatars and toggles. Nested elements subtract the
padding. This file shows where the numbers come from and why mixing families is banned.

## Decisions

| Token | px | Use |
|---|---|---|
| radius-xs | 4 | Checkbox, small chips, code inline |
| radius-sm | 6 | Table cells with selection, tiny buttons (rare) |
| radius-md | 8 | Button, input, select, tab, menu item |
| radius-lg | 12 | Card, popover, dropdown menu, toast |
| radius-xl | 16 | Dialog, sheet, large media |
| radius-2xl | 24 | Full-bleed image blocks, hero media |
| radius-pill | 9999 | Badge, avatar, switch, pill tabs |

Borders are 1 px. The focus ring is the only 2 px stroke.

## Evidence from measured systems

Values below are the `rounded` scales recorded in the cloned awesome-design-md corpus.

| System | xs | sm | md | lg | xl | pill | Notes |
|---|---|---|---|---|---|---|---|
| Linear | 4 | 6 | 8 | 12 | 16 | 9999 | Cards at 12 px with hairline; "never pill, rarely 16" |
| Vercel | 4 | 6 | 8 | 12 | 16 | 100 (marketing CTA) | 6 px on in-app nav buttons; 100 px pill for marketing CTAs |
| Stripe | 4 | 6 | 8 | 12 | 16 | 9999 | Pill buttons; cards on near-white |
| Notion | 4 | 6 | 8 | 12 | 16 | 9999 | Plus 20 and 24 for large tiles |
| Claude | 4 | 6 | 8 | 12 | 16 | 9999 | Same ladder |
| Cursor | 4 | 6 | 8 | 12 | 16 | 9999 | Same ladder |
| Raycast | 4 | 6 | 8 | 10 | 16 | 9999 | 10 px cards on dark |
| Apple | 5 | 8 | 11 | 18 | | 9999 | Store cards at 18 px; SF-style continuous corners |
| Figma | 2 | 6 | 8 | 24 | 32 | 50 | Larger jumps for marketing tiles |
| Material 3 | 4 | 8 | 12 | 16 | 28 | 50% | Tokens: extra-small to extra-large |
| shadcn/ui default | `--radius` 0.625rem (10 px) with computed sm/md/lg/xl | | | | | | Single variable; themes offer 0 to 1rem |

Seven of the eleven share the exact 4 / 6 / 8 / 12 / 16 ladder. AwesomeDS adopts it and
adds 24 for large media. Material's 12 px for cards and 8 px for menus agree with the
"controls 8, cards 12" split.

## Why 8 on controls

- A 40 px button with an 8 px radius has a corner arc that is one fifth of its height. It
  reads as rounded without becoming a pill, so a pill can still mean "badge" or "toggle".
- 6 px looks sharp next to 12 px cards; 10 px starts to compete with the card.
- Vercel uses 6 px in-app and 8 px on marketing controls; Linear uses 8 px controls.

## Why 12 on cards and 16 on dialogs

- A card holds 8 px controls inside 24 px padding. With the nesting formula
  (below) the outer radius can be anything at or above 8 + padding; 12 px is the smallest
  value that still looks softer than its contents.
- Dialogs float above cards, so they take the next step, 16 px. Sheets share it.
- Anything larger than 16 px on a text container starts to eat the corner of the content
  and forces extra padding.

## Nested radius formula

```
inner radius = outer radius - padding
```

Same curvature center means the gap between the two arcs stays constant. Equal radii
produce a visibly thicker gap at the corner than along the edge.

Examples in AwesomeDS:

| Outer | Padding | Inner |
|---|---|---|
| Card 12 | 4 (image inset) | 8 |
| Card 12 | 8 | 4 |
| Dialog 16 | 8 | 8 |
| Button 8 | 2 (inner highlight) | 6 |

When the formula gives a value under 4, use 4 or 0. Below 4 px the arc is not visible.

```css
.card { --r: var(--ds-radius-lg); --p: var(--ds-space-1); border-radius: var(--r); padding: var(--p); }
.card > img { border-radius: calc(var(--r) - var(--p)); }
```

## One family per product

- Gestalt similarity: shared shape reads as shared role. A pill button next to a sharp card
  tells the user two systems are on the page.
- taste-skill's "shape consistency lock" bans mixed radii unless a documented rule assigns
  each value to a component class. That rule is the table at the top of this file.
- Switching families (all-sharp or all-pill) is a `ds-creator` brand decision. When it is
  made, every token in the ladder changes together; components never opt out.

## Rules

1. Controls 8, cards 12, dialogs 16, badges pill. No exceptions inside one product.
2. Nested elements use the subtraction formula.
3. Tables have square cells; only the table container takes `radius-lg`.
4. Images inside cards inherit the computed inner radius; images alone take `radius-lg` or `radius-2xl`.
5. Never radius a single corner unless it is a tab or a split button.
6. `border-radius: 50%` on avatars is written as `radius-pill`; both give a circle on square boxes.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| shadcn single `--radius` variable | Convenient, but computed steps (`calc(var(--radius) - 4px)`) hide intent. Named steps are auditable. |
| Apple continuous (squircle) corners | Not expressible in CSS `border-radius`; `corner-shape` is not broadly shipped. |
| Material 28 px extra-large | Fits bottom sheets on phones; on desktop dialogs it looks like a toy. |
| All-pill controls (Stripe marketing) | Valid brand choice; as a default it removes the pill's role as "badge or toggle". |
| Zero radius (brutalist) | Valid brand choice via `ds-creator`. |

## Sources

- https://github.com/voltagent/awesome-design-md : measured `rounded` scales for Linear, Vercel, Stripe, Apple, Notion, Figma, Raycast, Claude, Cursor.
- https://m3.material.io/styles/shape/corner-radius-scale : Material 3 corner tokens (4, 8, 12, 16, 28, full).
- https://cloudfour.com/thinks/the-math-behind-nesting-rounded-corners/ : the subtraction formula explained.
- https://www.30secondsofcode.org/css/s/nested-border-radius/ : CSS `calc()` implementation.
- https://css-tricks.com/public-service-announcement-careful-with-your-nested-border-radii/ : why equal radii look wrong.
- https://frontendmasters.com/blog/the-classic-border-radius-advice-plus-an-unusual-trick/ : classic advice restated.
- https://www.nngroup.com/articles/gestalt-similarity/ : shared traits read as shared role.
- https://github.com/Leonxlnx/taste-skill : shape consistency lock.
- https://ui.shadcn.com/docs/changelog/2026-07-base-ui-default : shadcn component base (radius variable convention lives in its themes).
- https://raw.githubusercontent.com/Shopify/polaris/main/polaris-tokens/src/themes/base/border.ts : Polaris `border-width-025` is 1px and `border-width-050` is 2px, and `border-radius-full` is 9999px (fetched 2026-10-08).
