# Iconography

AwesomeDS uses Lucide as the default icon family at stroke width 1.75, in three sizes:
16 px inline, 20 px in buttons, 24 px standalone. One family per product. Every icon
without visible text has an accessible name; every decorative icon is hidden from
assistive technology.

## Decisions

| Decision | Value | Reason |
|---|---|---|
| Family | Lucide (`lucide-react`) | ISC licensed, 1,500+ icons, consistent 24 px grid and stroke, ships with shadcn/ui so components and app icons match. |
| Stroke width | 1.75 | Lucide's default is 2. At 16 px on a 14 px label, 2 px strokes look heavier than 400-weight Geist; 1.75 matches text weight. 1.5 gets thin on Windows. |
| Sizes | 16 / 20 / 24 | 16 sits inside 14 px text lines, 20 centers in a 40 px button next to 14 px labels, 24 is the native grid for standalone use. |
| `absoluteStrokeWidth` | on | Keeps the stroke at 1.75 px regardless of size, so 16 px icons do not get relatively heavy. |
| Color | `currentColor` | Icons inherit text color so they pass the same contrast checks as the text they sit with. |

```tsx
import { Search } from "lucide-react";
<Search size={16} strokeWidth={1.75} absoluteStrokeWidth aria-hidden="true" />
```

Set the defaults once with Lucide's global styling approach (a wrapper component or the
`lucide` CSS class) so no call site repeats the numbers.

## Why one family

- Similarity: users read shared stroke, corner radius and optical size as "the same kind of
  thing". Two families produce two visual voices on one page. NN/g: icons support a
  product family when the same style is used everywhere.
- Mixing also breaks alignment. Phosphor's regular weight is 1.5 on a 256 grid; Tabler is 2
  on 24; Radix is on a 15 px grid. Side by side they do not sit on one baseline.
- taste-skill: "one family per project. Standardize strokeWidth globally."

## Alternatives considered

| Library | Strengths | Why not the default |
|---|---|---|
| Phosphor (`@phosphor-icons/react`) | 9,000+ icons, 6 weights (thin to fill, duotone), MIT | Multiple weights invite mixing; the regular weight is lighter than Geist 400. Best choice when a brand wants a fill or duotone style via `ds-creator`. |
| Radix Icons (`@radix-ui/react-icons`) | Crisp 15 px grid, made for Radix | Small set (about 300), 15 px grid does not scale to 20/24 cleanly. |
| Tabler (`@tabler/icons-react`) | 5,000+, MIT, consistent 2 px stroke | Stroke 2 fixed heavier; larger bundle when tree-shaking is imperfect. Good alternative if Lucide lacks a glyph. |
| Hugeicons (`@hugeicons/react`) | Very large set, several styles, free core | Free tier is a subset; styles vary in optical size. |
| Heroicons | Tailwind's set, MIT | Two styles (outline 1.5, solid); smaller set; no size axis. |
| Hand-drawn SVG | Total control | Never. Optical inconsistencies are immediate; taste-skill bans it. If a glyph is missing, add one library as a documented exception and wrap it to match stroke. |

Note: taste-skill prefers Phosphor and lists Lucide as "on explicit request". AwesomeDS
overrides this because it ships shadcn/ui, whose components already import Lucide; a second
family would violate the one-family rule inside the component library itself.

## Sizing rules

| Context | Icon | Text next to it | Gap |
|---|---|---|---|
| Inline in body or label | 16 | 14 or 16 | 4 to 8 px (`space-1` or `space-2`) |
| Button (md 40, lg 48) | 20 | 14 label | 8 px |
| Button (sm 32) | 16 | 14 label | 6 to 8 px |
| Icon-only button | 20 inside a 40 px box (44 touch) | none | |
| Standalone (empty state, feature row) | 24, or 32 for empty states | heading | 12 to 16 px below |
| Nav item | 16 or 20 with visible label | 14 | 8 px |

Icons never scale with `em` alone; pick the size token so strokes stay on the pixel grid.

## Accessibility rules

| Case | Markup |
|---|---|
| Icon next to visible text | `aria-hidden="true"` on the icon; the text is the name |
| Icon-only button | `<button aria-label="Search">` and the icon `aria-hidden="true"` |
| Icon that conveys status (success check, error) | Provide text too (`<span class="sr-only">Success</span>` or visible label). Color alone is not enough. |
| Decorative icon (bullet, ornament) | `aria-hidden="true"`, `focusable="false"` |
| Icon as link content | `aria-label` on the `<a>` |

NN/g: icons need text labels; universal icons are rare and hover-revealed labels fail on
touch. Navigation icons in AwesomeDS always carry a visible label; icon-only is allowed
for toolbar actions with a tooltip and an `aria-label`.

Contrast: because icons use `currentColor`, an icon in `ink-secondary` passes 7.8:1 and an
icon in `ink-muted` passes 4.7:1 on canvas. Icons as UI components (checkbox marks, chevrons
on selects) must meet 3:1 (WCAG 1.4.11).

## Do and do not

- Do keep the same icon for the same action across the product (search, close, more).
- Do use the outline style only; no filled variants in the base.
- Do not use emoji as icons in product UI.
- Do not recolor icons with the accent unless they are part of a link.
- Do not animate icons on hover except a 100 ms color change; spinning and bouncing icons
  are an anti-pattern.
- Do not draw a custom logo-style icon for a common action.

## Sources

- https://lucide.dev/guide/packages/lucide-react : `lucide-react` package.
- https://lucide.dev/guide/react/basics/stroke-width : default stroke 2 and `absoluteStrokeWidth`.
- https://lucide.dev/guide/react/advanced/global-styling : setting defaults once.
- https://www.shadcndesign.com/blog/5-best-icon-libraries-for-shadcn-ui : Lucide as the shadcn default and alternatives.
- https://iconsearch.info/compare/phosphor-icons-vs-radix-icons : Phosphor weights, Radix 15 px grid.
- https://react-icons.github.io/react-icons/ : set sizes (Tabler 6,146, Phosphor 9,072, Lucide 1,541).
- https://www.nngroup.com/articles/icon-usability/ : icons need labels; 5-second rule.
- https://www.nngroup.com/videos/icon-text-labels/ : "Yes, icons need text labels".
- https://www.nngroup.com/videos/anatomy-of-good-icons/ : consistent stroke and corners.
- https://www.nngroup.com/articles/consistency-and-standards/ : internal and external consistency.
- https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast : 3:1 for graphical objects.
- https://github.com/Leonxlnx/taste-skill : one family, global strokeWidth, no hand-rolled SVG icons.
