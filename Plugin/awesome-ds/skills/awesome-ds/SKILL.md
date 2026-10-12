---
name: awesome-ds
description: Apply AwesomeDS when building or restyling any web UI (landing page, app screen, component, form, dashboard, email-safe HTML). Use whenever the user asks for UI, frontend, CSS, Tailwind, shadcn, a "design", "make it look good", or a restyle, and no other design system is named. Wires tokens, restyles shadcn/ui, forbids AI-default anti-patterns, and ends with the AwesomeDS checklist.
argument-hint: "[what to build or restyle]"
allowed-tools: Read, Grep, Glob
---

# awesome-ds

Works in any language. If the user writes Japanese, answer in Japanese and apply the Japanese typography rules in section 7; the rules below stay the same.

AwesomeDS is a neutral, content-first system: white canvas, near-black ink, one accent used only for links, focus and selection. Geist + Noto Sans JP on a 4px grid. Borders before shadows. Motion only as feedback. The full system is at `${CLAUDE_PLUGIN_ROOT}/ds/DESIGN.md`. The bundled copy is synced from the repo's `AwesomeDS/` folder.

## 0. Before writing any code

Do these in order. Do not skip step 1 because the cheat sheet below "looks like enough".

1. Read `${CLAUDE_PLUGIN_ROOT}/ds/DESIGN.md` top to bottom. Open the foundation file for each area you will touch: `${CLAUDE_PLUGIN_ROOT}/ds/foundations/{principles,color,typography,japanese-typography,spacing,layout,radius,elevation,motion,iconography,accessibility,stack,anti-patterns,content-and-tone}.md`, plus `${CLAUDE_PLUGIN_ROOT}/ds/components/README.md` when building components. Principle 7 (no generated tells) is mandatory on every UI task. The before/after catalog lives in the repo at `Knowledge/skills/anti-ai-slop.md`, not in the plugin copy.
2. Check for a project design system. Search the repo root for `DESIGN.md`, `design-system.md`, `docs/design/`, `tokens.css`, `theme.css`. If a project DESIGN.md exists, it wins. Use AwesomeDS only for the roles, rules and states it does not define, and say which gaps you filled.
3. Detect the stack (section 2) and decide how tokens get wired.
4. When the task touches a library, motion, a component kit, Japanese typography, or a reference brand, open `${CLAUDE_PLUGIN_ROOT}/knowledge/README.md` and read the matching entries before choosing. They are sourced summaries; you do not need to search the web for what they already cover.
5. State assumptions. Write a one-line "design read" and up to three assumptions (see section 1). Do not ask a list of questions. Ask exactly one question only when the answer changes the layout or the token wiring (for example, "Tailwind v3 or v4?" when both configs exist). Otherwise proceed with the stated assumption.

## 1. The design read (one line, always printed)

Format: `Design read: <page kind> for <audience>, <density>, <light | dark | both>, accent <hex or "AwesomeDS default">, lang <en | ja | mixed>.`

Example: `Design read: pricing page for SMB buyers, medium density, light + dark, accent AwesomeDS default #2f5bea, lang ja.`

Then list assumptions as `Assuming: ...` lines. The user can correct any of them; you do not wait for confirmation.

## 2. Stack detection and token wiring

Detect by files, not by guessing. Wiring recipes with exact snippets: `${CLAUDE_PLUGIN_ROOT}/skills/awesome-ds/reference/stack-wiring.md`.

| Signal | Stack | Wiring |
|---|---|---|
| `@import "tailwindcss"` in a CSS file, `tailwindcss@^4` in package.json | Tailwind v4 | Copy `ds/tokens/tokens.css` and `ds/tokens/tailwind.css` into `src/styles/` (or the app's global CSS folder). Import both after `@import "tailwindcss"`. Use classes `bg-canvas text-ink border-hairline rounded-md`. |
| `tailwind.config.{js,ts}` with `theme.extend`, `tailwindcss@^3` | Tailwind v3 | Copy `tokens.css`. Map colors in `theme.extend.colors` to `var(--ds-*)` (recipe in stack-wiring.md). Do not paste hex into the config. |
| `app/` or `pages/` directory, `next` in package.json | Next.js | Import `tokens.css` in the root layout / `_app`. Load Geist with `next/font` (`geist` package) and Noto Sans JP with `next/font/google`, both `display: "swap"`, Japanese as a separate subset. |
| `vite.config.*` | Vite (React, Vue, Svelte) | Import `tokens.css` in `main.*`. Fonts via `@fontsource-variable/geist` and `@fontsource-variable/noto-sans-jp`, or a `<link>` in `index.html`. |
| No bundler, plain `.html` | Plain CSS | `<link rel="stylesheet" href="./tokens.css">` before the page CSS. Write component CSS with `var(--ds-*)` only. |
| `components.json` present | shadcn/ui installed | Map shadcn's CSS variables to `--ds-*` (recipe in stack-wiring.md) so existing components pick up the tokens without editing each one. |

Rules for wiring:

- Never redeclare a color, radius, duration or font in a component. Reference `var(--ds-*)` or the Tailwind class.
- Copy the two token files, do not link across repos. Add a comment at the top of the copy: `/* Synced from AwesomeDS v0.1.0. Edit via the DS, not here. */`
- If the project already has a `tokens.css`, do not overwrite it. Add the missing `--ds-*` variables in a new block and tell the user which ones you added.

## 3. Build rules

Components

- Use shadcn/ui on Radix (Base UI accepted). Install components into the project (`npx shadcn@latest add button input card dialog ...`); never import a pre-styled kit.
- Restyle every installed component with tokens: control height 40px, radius 8px, border `1px solid var(--ds-hairline-strong)` on inputs, `var(--ds-hairline)` on cards, focus ring `2px solid var(--ds-focus-ring)` offset 2px.
- Primary button: `background: var(--ds-primary); color: var(--ds-on-primary)`. Ink on canvas. The accent is never a button fill.
- Every interactive component ships hover, focus-visible, active, disabled, loading. Every data view ships loading (skeleton), empty, error. Write them in the first pass, not "later".
- Icons: Lucide, `strokeWidth={1.75}`, 16 inline, 20 in buttons, 24 standalone. One icon family.
- Forms: label above, helper below, error below in `var(--ds-danger)` with an icon. Placeholder is never the label.

Layout

- Mobile first. Every multi-column layout declares its `< 768px` fallback in the same commit.
- Page max width 1200px, reading width 65ch (40 full-width characters for Japanese).
- Sections 64px apart on mobile, 96px on desktop. Inside a card 24px. Related items 16px.
- Left-align text. Center only short display headings and empty states.
- Hero fits the first viewport at 390px wide: heading 2 lines max at 32px, one paragraph, one primary button.
- `min-height: 100dvh`, never `100vh`. Images set `aspect-ratio` and `object-fit: cover`.
- Touch targets 44x44 on mobile, 24x24 on desktop.

Copy

- Content first, then layout. Write the real strings before choosing the grid.
- Short, direct, specific. Cut any sentence that does not change what the user will do next.
- No em dashes in UI copy. Use a period or comma.
- No filler: seamless, unlock, empower, elevate, next generation, revolutionize, supercharge, effortless, cutting-edge, robust.
- No placeholder names like Acme, John Doe, Jane Doe, lorem ipsum in delivered UI. Use realistic, locale-appropriate content or a clearly marked `TODO(content)`.

Motion

- Durations: 100ms color/opacity, 150ms small movement, 200ms enter, 300ms dialog, 500ms page (rare).
- Enter `cubic-bezier(0.16, 1, 0.3, 1)`. Exit faster with `ease-in`. Never `linear` or the CSS default `ease` for anything the user watches.
- Enter transforms travel 4 to 8px, scale enters start at 0.98. Nothing loops except a progress indicator.
- `prefers-reduced-motion: reduce` keeps opacity only. `tokens.css` already handles it globally; do not undo it.
- Library order: CSS transition, then `motion/react`, then GSAP ScrollTrigger only for pinned or scrubbed sequences.

## 4. Forbidden (fail the build if present)

Check each one mechanically before finishing. Details and how to detect each: `${CLAUDE_PLUGIN_ROOT}/skills/awesome-ds/reference/anti-patterns.md`.

1. Raw hex, rgb() or hsl() in component code or Tailwind arbitrary values (`bg-[#...]`). Only tokens files may contain hex.
2. Accent used as a button fill, or on more than one element per view.
3. Gradient, glow, glass (`backdrop-filter: blur`), or blurred blob as decoration.
4. `Inter` as the font, slate gray neutrals, purple or violet gradient. This combination is the recognisable AI default.
5. An uppercase, letter-spaced eyebrow label above more than one third of section headings. Count them.
6. Three identical cards in a row as the default feature layout; two consecutive sections with the same layout family.
7. Mixed radius families on one page (pill buttons next to 4px cards). Controls 8, cards 12, dialogs 16, badges pill.
8. `outline: none` or `outline: 0` without a `:focus-visible` replacement.
9. Text below 12px. Body below 16px. Line height below 1.5 on body text.
10. Font weight 700 or heavier anywhere except display type.
11. `100vh` for full-height sections; `window.addEventListener('scroll')` for animation.
12. Em dashes or filler words in UI copy. Lorem ipsum, Acme, John Doe in delivered UI.
13. Color as the only carrier of status. Every status color pairs with an icon or a label.
14. A missing `lang` attribute on `<html>`, or `lang="en"` on a Japanese page.
15. Shadows on cards or inputs at rest. Level 1 is a border. Shadows are for popovers (level 2) and dialogs (level 3) only.

## 5. Token cheat sheet

Enough to build without opening files. Variables are `--ds-*` in `tokens.css`; Tailwind v4 class names in parentheses.

Color roles (light / dark)

```
canvas          #ffffff / #0a0a0a   page background            (bg-canvas)
canvas-soft     #fafafa / #111111   alternate section, code bg (bg-canvas-soft)
surface         #ffffff / #141414   cards, inputs, popovers    (bg-surface)
surface-sunken  #f5f5f5 / #1a1a1a   table header, wells, badge (bg-surface-sunken)
ink             #0a0a0a / #fafafa   headings, body, primary btn (text-ink)
ink-secondary   #525252 / #a3a3a3   supporting text, labels    (text-ink-secondary)  7.6:1 on white
ink-muted       #6b6b6b / #8a8a8a   placeholder, timestamp     (text-ink-muted)      5.3:1 on white
ink-disabled    #a3a3a3 / #525252   disabled text only, never body
hairline        #e5e5e5 / #262626   dividers, card border      (border-hairline)
hairline-strong #8c8c8c / #666666   input and control border   (border-hairline-strong) 3.4:1 on white
accent          #2f5bea / #7a9cff   links, focus, selected     (text-accent)
accent-hover    #264dd0 / #93afff
accent-soft     #e8eefc / #16203d   selected row bg, info chip (bg-accent-soft)
primary         #0a0a0a / #fafafa   primary button fill        (bg-primary text-on-primary)
success         #167534 / #4ade80   + success-soft #e6f4ea / #0f2a18
warning         #9a5c00 / #fbbf24   + warning-soft #fff4e0 / #2a1f05
danger          #c81e1e / #f87171   + danger-soft  #fdecec / #2f1010
focus-ring      #2f5bea / #7a9cff   2px solid, 2px offset
selection       #dbe4fd / #1e2a4d
```

Typography (`--ds-font-sans`, `--ds-font-mono`; Tailwind `font-sans`, `font-mono`, `text-xs ... text-4xl`)

```
sans  "Geist", "Noto Sans JP", system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif
mono  "Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace
display 56/1.1/600/-0.02em   h1 36/1.2/600/-0.02em   h2 28/1.25/600/-0.015em
h3 20/1.35/600/-0.01em       h4 16/1.5/600           body-lg 18/1.6/400
body 16/1.6/400              body-sm 14/1.55/400     caption 12/1.5/400/+0.01em
label 14/1.2/500             mono 13/1.6/400
weights: 400 body, 500 labels and buttons, 600 headings. 700+ only for display.
```

Spacing (`--ds-space-N`, Tailwind default scale matches: `p-4` = 16px)

```
1=4 2=8 3=12 4=16 5=20 6=24 8=32 10=40 12=48 16=64 20=80 24=96 32=128
inside component 8-16 | related 16-24 | groups 32-48 | sections 64 mobile, 96 desktop
container 1200px | measure 65ch | grid 12 col, gutter 24 desktop, 16 mobile
breakpoints 640 768 1024 1280 1536
```

Shape and elevation (`--ds-radius-*`, `--ds-shadow-*`; Tailwind `rounded-md/lg/xl`, `shadow-2/3`)

```
radius xs 4 | sm 6 | md 8 (controls) | lg 12 (cards, menus) | xl 16 (dialogs) | 2xl 24 | pill 9999
nested radius = outer radius - padding
level 0 none | 1 border 1px hairline | 2 border + 0 4px 12px -2px rgb(10 10 10 / .08)
level 3 border + 0 16px 48px -12px rgb(10 10 10 / .18) | dark: lighter surface + stronger hairline, no shadow
border 1px always; 2px only for the focus ring
```

Motion (`--ds-duration-*`, `--ds-ease-*`; Tailwind `duration-100..500`, `ease-out-ds`)

```
instant 100 | fast 150 | base 200 | slow 300 | slower 500
ease-out cubic-bezier(0.16, 1, 0.3, 1)   ease-in cubic-bezier(0.7, 0, 0.84, 0)
spring gentle 170/26 | snappy 400/30 (Motion: type "spring", stiffness, damping)
```

Component sizes

```
button 40 default | 32 sm | 48 lg; padding 0 16; label 14/500; one line; one primary per view
input 40 high, padding 0 12, body-sm text, border hairline-strong, radius 8
card padding 24, border hairline, radius 12 | dialog padding 24, radius 16, shadow-3
badge caption text, pill, padding 2 8, bg surface-sunken, text ink-secondary
```

## 6. Dark mode

`tokens.css` switches on `[data-theme="dark"]` and on the OS setting via `prefers-color-scheme` unless `data-theme="light"` is set. Build with roles only and dark mode is free. Do not write `dark:` variants with hex. Surfaces get lighter as they rise (`#0a0a0a` canvas, `#141414` surface, `#1a1a1a` raised). Do not add shadows in dark mode.

## 7. Japanese typography (when `lang="ja"` or Japanese copy is present)

- Set `<html lang="ja">` (or `lang="ja"` on the Japanese subtree). `tokens.css` applies `:lang(ja)` rules automatically: line-height 1.8, `line-break: strict`, `overflow-wrap: anywhere`, `text-autospace: normal`.
- Headings: line-height 1.4 to 1.5, letter-spacing 0 to 0.02em, never negative. Apply `font-feature-settings: "palt"` on headings only, never on body.
- Body 16px minimum, measure 40 full-width characters. Small UI text 14px, never 12px for running Japanese text (12 is for Latin captions and numerals only).
- Do not fake bold. Noto Sans JP variable covers 400 to 700; use 500 for labels, 600 for headings.
- Avoid italics for Japanese text. Use weight or color for emphasis.
- Load Noto Sans JP as a subset (`unicode-range` or `next/font` `subsets`), never one 5 MB file. Load Latin from Geist first so numerals and Latin stay consistent.
- Mixed text: keep Latin words and numbers in Geist; `text-autospace` handles the gap. Do not insert manual half-width spaces.
- Punctuation: use full-width 。、「」 in Japanese sentences. No em dashes; use 、 or 。 Line breaks must not start with 。、」 (`line-break: strict` enforces this).
- Dates and numbers: tabular-nums in tables; `2026年9月6日` in prose, `2026-09-06` in data views.

## 8. Finish: run the checklist and report

1. Open `${CLAUDE_PLUGIN_ROOT}/ds/components/checklist.md` and evaluate every item against what you built.
2. Print the result as a table: `item | pass | fail | skipped (reason)`. Never mark an item pass without a concrete check (a grep, a rendered screenshot, a computed contrast).
3. Run the forbidden-list scan (section 4) with Grep over the files you touched. Report matches with `file:line`.
4. If any item failed, fix it before handing over. If you cannot, say what you skipped and why in one line each.
5. Suggest `/awesome-ds:design-verifier <url>` for a screenshot-based review when a dev server is available.

## Reference files

- `${CLAUDE_PLUGIN_ROOT}/ds/DESIGN.md` canonical system (frontmatter tokens + rules)
- `${CLAUDE_PLUGIN_ROOT}/ds/tokens/tokens.css`, `tailwind.css`, `tokens.json`
- `${CLAUDE_PLUGIN_ROOT}/ds/foundations/*.md` reasons and sources per area (principles, color, typography, japanese-typography, spacing, layout, radius, elevation, motion, iconography, accessibility, stack, anti-patterns)
- `${CLAUDE_PLUGIN_ROOT}/ds/components/README.md`, `checklist.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/awesome-ds/reference/stack-wiring.md` exact wiring snippets per stack
- `${CLAUDE_PLUGIN_ROOT}/skills/awesome-ds/reference/anti-patterns.md` detection recipes for section 4
