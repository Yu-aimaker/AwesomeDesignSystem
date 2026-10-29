# Anti-pattern detection recipes

Each item: what it is, why it is banned, how to detect it mechanically. Run the Grep patterns over files you touched before finishing. `design-verifier` runs the same checks with `scripts/static-audit.mjs`.

| # | Pattern | Why | Detect |
|---|---|---|---|
| 1 | Raw color in components | Breaks dark mode and the one-accent rule | `#[0-9a-fA-F]{3,8}\b`, `rgba?\(`, `hsla?\(`, `\[#` (Tailwind arbitrary) in `*.tsx,*.jsx,*.vue,*.svelte,*.css` excluding `tokens.css`, `tailwind.css` |
| 2 | Accent as button fill or >1 accent element per view | Accent must stay meaningful | Grep `bg-accent\b`, `background: var\(--ds-accent\)`; count `text-accent`/`var(--ds-accent)` per page file, expect 1 plus links |
| 3 | Gradient, glow, glass, blob decoration | The AI default look; hides weak hierarchy | `linear-gradient|radial-gradient|conic-gradient`, `backdrop-filter`, `blur-\d`, `bg-gradient-`, `drop-shadow`, `blur\(` |
| 4 | Inter + slate + purple | The most recognisable AI default | `font-family:.*Inter`, `Inter`, `slate-`, `violet-|purple-|indigo-` |
| 5 | Eyebrow | Templated feel | Any `uppercase.*tracking` or `text-transform: uppercase` block placed above a heading; eyebrows are banned |
| 6 | Three identical cards / repeated layout family | Templated feel | `grid-cols-3` with three same-shaped children; two consecutive sections with the same wrapper classes |
| 7 | Mixed radius | Breaks the shape family | Grep every `rounded-` and `border-radius`; the set must be a subset of {md, lg, xl, full} with each element type using one value |
| 8 | Focus removed | WCAG 2.4.7 failure | `outline:\s*(none|0)` without a `:focus-visible` rule in the same file |
| 9 | Text too small / tight | Legibility | `text-\[?1[01]px`, `font-size:\s*(1[01]|[0-9])px`, `leading-(none|tight)` on body, `line-height:\s*1\.[0-4]` on paragraphs |
| 10 | Weight 700+ | Hierarchy by size and spacing, not shouting | `font-bold|font-extrabold|font-black`, `font-weight:\s*(7|8|9)00` outside display |
| 11 | `100vh`, scroll listeners | Mobile viewport bugs, jank | `100vh`, `h-screen`, `addEventListener\(['"]scroll` |
| 12 | Em dash, filler, placeholders, hidden agent, unsupported claims | Copy tells | `—`, `seamless|unlock|empower|elevate|next.generation|revolutioni|supercharge|effortless|cutting.edge|robust`, `ことができます|シームレス|革新的|次世代|を実現`, `lorem ipsum|Acme|John Doe|Jane Doe`, `させていただく|させていただきます|させて頂く|させて頂きます|形となっております`, and `注目されています|ご注目ください|注目を集めて` or `多くの人[がは]見落とし` unless the same line or the next two name a URL or 出典. Skip a line when the key is `bad` or `before`, the phrase sits inside `「」`, the line is a comment, or the line contains `ads-audit-ignore`. |
| 13 | Color-only status | WCAG 1.4.1 | Status color class without an adjacent `<svg`, icon component or text label in the same element |
| 14 | Missing or wrong `lang` | Font fallback, line breaking, screen readers | `<html` without `lang=`; `lang="en"` with Japanese characters in the file (`[぀-ヿ一-鿿]`) |
| 15 | Shadows at rest | Elevation model | `shadow-(sm|md|lg|xl)` or `box-shadow` on `.card`, `Card`, inputs, without being a popover or dialog |

Recommended Grep invocation (ripgrep syntax):

```
rg -n --glob '!**/tokens.css' --glob '!**/tailwind.css' -e '#[0-9a-fA-F]{3,8}\b' -e 'rgba?\(' -e 'hsla?\(' -e '\[#' src
rg -n -e 'gradient' -e 'backdrop-filter' -e 'blur' -e 'drop-shadow' src
rg -n -e '—' -e '(?i)seamless|unlock|empower|elevate|revolutioni|supercharge|effortless|cutting.edge' src
rg -n -e 'outline:\s*(none|0)' -e 'h-screen' -e '100vh' -e "addEventListener\(['\"]scroll" src
```

Report matches as `file:line  pattern  fix`. A match inside a comment or test fixture is still reported, then marked "accepted" with a reason.
