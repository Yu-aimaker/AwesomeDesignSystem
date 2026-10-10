# Elevation

AwesomeDS separates surfaces with 1 px borders first. Shadows are allowed only for
things that float above the page: popovers, dropdowns, tooltips, dialogs, the command
menu and a dragged item. On dark canvas, elevation is a lighter surface plus a stronger
hairline, not a shadow.

## Decisions

| Level | Treatment | Token | Use |
|---|---|---|---|
| 0 | none | | Page, sections, tables, list rows |
| 1 | `1px solid hairline` | `--ds-shadow-1: none` + border | Cards, inputs, inline panels, code blocks |
| 2 | border + `0 4px 12px -2px rgb(10 10 10 / 0.08)` | `--ds-shadow-2` | Popover, dropdown, tooltip, toast, hover-lifted card |
| 3 | border + `0 16px 48px -12px rgb(10 10 10 / 0.18)` | `--ds-shadow-3` | Dialog, sheet, command menu, drag layer |

Dark theme:

| Level | Treatment |
|---|---|
| 1 | surface `#141414` on canvas `#0a0a0a`, `1px hairline #262626` |
| 2 | surface-raised `#1a1a1a`, `0 0 0 1px hairline-strong #666666` |
| 3 | surface-raised, `0 0 0 1px #666666, 0 24px 64px -16px rgb(0 0 0 / 0.6)` |

## Why borders before shadows

1. Cost of noise. Every shadow adds a soft edge that the eye must resolve. A hairline is
   one crisp line. NN/g's minimalist heuristic: every element competes with the relevant ones.
2. Consistency with the measured field. Linear carries depth almost entirely with a surface
   ladder and hairlines; Vercel's cards "sit on the page held by hairline + soft glow";
   Apple's marketing chrome has "no shadows on chrome". Heavy drop shadows on cards are
   now a tell of template UI.
3. Common region needs only an edge. The Gestalt principle requires a boundary; a border is
   the cheapest boundary.
4. Performance. Layered `box-shadow` on many cards costs paint time on low-end phones.
   Josh Comeau notes that five layered shadows means five times the work.

## Why three levels

Material 3 defines six elevation levels; Apple uses base and elevated. Three is the
smallest number that separates "on the page", "above the page" and "above everything".
Users do not distinguish more. A fourth level would need a fourth visual difference, and
there is none left that stays subtle.

## Shadow recipe

- Tinted, not black. Shadows use the ink color (`10 10 10`) at low alpha, so they sit on the
  canvas rather than gray it out. Refactoring UI and Comeau both recommend matching the
  shadow hue to the surface. Stripe's measured shadows are navy-tinted (`rgba(0,55,112,...)`).
- Negative spread. `-2px` and `-12px` spread pulls the shadow under the element so it reads
  as depth, not a halo.
- Vertical offset only. Light comes from above; y-offset 4 or 16, x-offset 0.
- One shadow per level. Layered stacks are allowed in `ds-creator` for brands that want a
  softer look; the base keeps one so audits are simple.

## Dark mode elevation via surface lightness

Shadows have little contrast against `#0a0a0a`, so they cannot carry hierarchy. Material's
dark theme brightens surfaces as elevation increases (elevation overlays, later tonal
surface containers in M3). Apple's Dark Mode uses base and elevated background pairs where
"the elevated colors are brighter, making foreground interfaces appear to advance."

AwesomeDS ladder: canvas `#0a0a0a`, canvas-soft `#111111`, surface `#141414`,
surface-raised `#1a1a1a`. Each step is about 3 to 4 percent lighter, enough to see, not
enough to read as a different color. The hairline steps up with it: `#262626` for dividers, `#666666` for control borders.

Material tints the overlay with the primary color; AwesomeDS does not, because a tinted
gray would break the true-gray rule and fight brand accents.

## When a shadow is allowed

| Situation | Shadow | Reason |
|---|---|---|
| Card at rest | No | Border is enough |
| Card on hover (clickable card) | Level 2 optional | Signals interactivity; remove on `:active` |
| Input | No | Border plus focus ring |
| Dropdown, popover, tooltip | Level 2 | Floats above content |
| Dialog, sheet | Level 3 plus backdrop `rgb(10 10 10 / 0.4)` | Modal, needs separation from everything |
| Toast | Level 2 | Floats, temporary |
| Drag preview | Level 3 | Lifted item |
| Sticky header | No shadow; `1px hairline` bottom | A scroll shadow is decoration; the line is enough |
| Marketing hero image on surface | Level 2, at most | Apple uses one product shadow for this |
| Decorative glow, neon, colored shadow | Never | Anti-pattern |

## Rules

1. Level 1 is a border, never a shadow.
2. A shadow always comes with the border of the level below it.
3. Shadow color is `--ds-shadow-color` (ink), never `#000` on a light canvas.
4. Do not animate shadow blur; animate `opacity` of a pseudo-element or `transform` instead.
5. In dark mode, express lift with `surface-raised` before adding any shadow.
6. `backdrop-filter` blur is not an elevation level. It may be used on a sticky nav over
   imagery with a solid-color fallback, and nowhere else by default.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Material 3 tonal elevation (primary-tinted surfaces) | Ties surface color to brand hue; conflicts with true-gray neutrals and accent swapping. |
| Six elevation levels | More levels than users can tell apart; more tokens to misuse. |
| Layered 5-shadow palettes (Comeau's generator) | Beautiful, but per-brand; the base needs one line per level. |
| Glassmorphism | Depends on what is behind it; unreadable over busy content; listed as an AI tell. |
| Shadow on every card (Bootstrap style) | Adds noise; the measured leaders do not do it. |

## Sources

- https://m3.material.io/styles/elevation : Material 3 elevation, tonal overlays in dark themes.
- https://github.com/material-components/material-components-android/blob/master/docs/theming/Dark.md : lighter surfaces at higher elevation in dark theme.
- https://developer.apple.com/design/human-interface-guidelines/dark-mode : base and elevated background colors.
- https://developers.apple.com/design/human-interface-guidelines/foundations/materials/ : materials and vibrancy (why blur needs a fallback).
- https://www.joshwcomeau.com/css/designing-shadows/ : tinted, layered shadows; vertical light source; performance cost.
- https://www.joshwcomeau.com/shadow-palette/ : shadow palette generator (considered).
- https://refactoringui.com/ : fixed elevation scale, vertical offset advice.
- https://www.nngroup.com/articles/common-region/ : a boundary is enough to group.
- https://www.nngroup.com/articles/aesthetic-minimalist-design/ : every extra element competes.
- https://www.nngroup.com/articles/flat-design/ : why some signifier (border, hover) must remain.
- https://github.com/voltagent/awesome-design-md : Linear surface ladder, Vercel stacked hairline shadows, Apple single product shadow, Stripe tinted shadows.
- https://github.com/Leonxlnx/taste-skill : "tint shadows to the background hue; no pure-black drop shadows", glass approximations.
- https://atlassian.design/foundations/elevation : Atlassian pairs surfaces with shadows only for the top two levels (raised, overlay), and leans on lighter surfaces in dark theme (opened 2026-10-08).
- https://stripe.com/ : the stylesheet linked from the page defines its shadow tokens with a navy tint, `rgba(0,55,112,.06)` to `rgba(0,55,112,.1)` (opened 2026-10-08).
