---
name: ds-creator
description: Create a product-specific design system starting from AwesomeDS. Use when the user asks for "a design system for X", "our brand DS", "make DESIGN.md for this product", "brand tokens", or wants to adapt AwesomeDS to a logo, colour or brand brief. Runs a one-question-per-turn grill, then produces DESIGN.md, tokens.css, tailwind.css, RATIONALE.md and preview.html, and verifies contrast.
argument-hint: "[product name or brand brief]"
allowed-tools: Read, Grep, Glob, Bash(node *)
---

# ds-creator

Works in any language. If the user writes Japanese, run the interview and write RATIONALE.md in Japanese; DESIGN.md and CSS comments stay in English so other skills can read them.

Goal: a design system for `$ARGUMENTS` that keeps every AwesomeDS default the brand does not overrule, and documents every deviation with the interview answer that caused it.

Base: `${CLAUDE_PLUGIN_ROOT}/ds/DESIGN.md` and `${CLAUDE_PLUGIN_ROOT}/ds/tokens/`. Read them before Phase 1.

Two hard rules that apply to every phase:

- Never invent brand facts. A colour, a font, a tone, a platform list is either found in an asset, given by the user, or kept as the AwesomeDS default and marked `default, not decided`.
- The interview asks exactly one question per turn. Never batch questions, never number a list of questions, never "a few quick questions". Ask, stop, wait.

## Anti-jobs

The interview is the grill. Ask one question, then wait.

- Do not skip the grill, and do not ask a second question in the same turn.
- Do not invent a colour, a font, a tone, or a platform list.
- Do not build product screens. Stop at `design-system/`, then hand that folder to `awesome-ds`.
- Do not decide a public release or a marketplace listing.

## Phase 1: intake (no questions yet)

Collect facts from the repo before asking anything. Facts are your job; decisions are the user's.

1. Brand assets: Glob for `**/*logo*.{svg,png,jpg,webp}`, `**/brand/**`, `**/assets/**/*.svg`, `favicon*`, `og-image*`. Read SVG logos as text and list the fill colours found.
2. Existing styling: `**/*.css`, `**/tailwind.config.*`, `**/theme.*`, `**/tokens.*`, `**/DESIGN.md`, `**/styleguide*`. Extract font-family declarations, the most frequent colours (count hex occurrences), radius values, and any dark-mode switch.
3. Words: `README.md`, `package.json` description, `docs/**`, marketing copy. Note product category, audience hints, tone words, platform hints (mobile app, admin tool, marketing site).
4. Screenshots: any `*.png|jpg` under `docs/`, `screenshots/`, `design/`. View them with Read and note the current density, radius family and accent.
5. Print an intake summary: `Found: <facts with file paths>. Missing: <list of interview topics still open>.` Every topic in the interview guide starts as open; intake closes the ones with hard evidence (a logo colour closes "existing colours", it does not close "accent preference").

## Phase 2: interview, one question per turn

Method: `${CLAUDE_PLUGIN_ROOT}/skills/ds-creator/reference/interview-guide.md`. It is a decision tree. Work the frontier: ask the single most upstream open question first, because its answer changes the later ones.

Format of every interview turn, nothing else in that message:

```
Q<n>: <one question, one sentence, with 2 to 5 lettered options when options exist>
Recommended: <your default and why, one sentence>
(答えは英語でも日本語でも構いません / answer in any language; say "enough" to stop)
```

Rules

- One question. If you notice a second question forming, cut it and keep it for the next turn.
- Offer options with the letters A to E and always include "other". For brand adjectives, offer the list from the guide and ask for exactly 3.
- After each answer, restate it in one line (`Noted: audience = internal ops staff, desktop, daily use.`) then ask the next question in the same message. Do not add commentary, praise, or a summary of the plan.
- When an answer resolves later branches (for example, "no dark mode"), skip those questions and say which you skipped.
- Skip a question when intake already produced hard evidence, and say so: `Skipping logo colours: found #1d4ed8 and #0f172a in public/logo.svg.`
- Stop when every branch is resolved or the user says "enough", "十分", "以上", or "proceed". If the user stops early, every unresolved branch becomes `default, not decided`.
- Topics to cover, in tree order: audience, product category and density, brand adjectives (3 from the offered list), existing colours and logo, accent preference, type preference (sans default; serif only if the brand says so), tone of copy, motion appetite (low, medium, high), dark mode need, platforms, accessibility constraints, references liked and disliked.

Close the interview with one message: a table of every topic and its resolved value, marked `decided`, `from asset`, or `default, not decided`. Ask nothing in that message; proceed to Phase 3.

## Phase 3: synthesis

Output directory: `design-system/` at the project root unless the project already keeps design docs elsewhere (then use that folder and say so). Files:

1. `DESIGN.md`: fill `${CLAUDE_PLUGIN_ROOT}/skills/ds-creator/templates/DESIGN.template.md`. Same frontmatter schema as AwesomeDS/DESIGN.md (version, name, description, colors, typography, rounded, spacing, motion, components). Keep every AwesomeDS value that was not overruled. Replace the atmosphere section with the three adjectives and what they change. Each rule you change gets `(changed: <reason>)` inline; each kept default that was not decided gets `(default, not decided)`.
2. `tokens.css`: start from `${CLAUDE_PLUGIN_ROOT}/skills/ds-creator/templates/tokens.template.css`. It imports the unchanged AwesomeDS `tokens.css` (copy it next to the file as `base.tokens.css`) and overrides only the variables that changed, in both light and dark blocks. Derived values (accent-hover, accent-soft, on-accent, focus-ring, selection) must be recomputed when the accent changes: hover is the accent darkened about 10% in lightness (lightened in dark mode), soft is the accent at roughly 10% over the canvas, on-accent is white or ink depending on the contrast script result.
3. `tailwind.css`: copy AwesomeDS `tailwind.css`. Change only lines whose token changed (for example a new font family or radius). If nothing changed, copy it unchanged and say so.
4. `RATIONALE.md`: one table. Columns: `token or rule | AwesomeDS value | new value | interview answer (Q number, quoted) | status`. Every deviation appears here. If a deviation has no interview answer, it is not allowed; revert it.
5. `preview.html`: fill `${CLAUDE_PLUGIN_ROOT}/skills/ds-creator/templates/preview.template.html`. It links `tokens.css` and renders: type scale (each role with its size and weight printed), colour roles as swatches with the computed contrast ratio, spacing scale bars, radius family, buttons in all five states, inputs (default, focus, error, disabled), a card, a badge set, one dialog mock, plus a `data-theme="dark"` copy of the whole page. No external JS. Include `lang` set to the product's primary language and a Japanese sample paragraph when Japanese is in scope.

Serif rule: use a serif only if the brand explicitly asked for one (interview or asset). When you do, name it, load it as a variable font, and keep it out of UI controls (buttons, inputs, labels stay sans).

Accent rule: the accent still is not a button fill. If the user insists on a coloured primary button, record it as a deviation with the quoted answer, set `--ds-primary` to the brand colour, and verify `on-primary` contrast at 4.5:1 or higher.

## Phase 4: verify

1. Contrast, computed, never eyeballed. Run:
   `node ${CLAUDE_PLUGIN_ROOT}/skills/ds-creator/scripts/contrast.mjs design-system/tokens.css`
   It resolves the `--ds-*` variables (including the imported base) for light and dark and prints every text-on-background pair with its ratio and the required threshold (4.5 body, 3.0 large text and UI borders). Any FAIL must be fixed by changing the token, not the threshold. Paste the output table into RATIONALE.md under "Contrast".
2. Checklist. Open `${CLAUDE_PLUGIN_ROOT}/ds/components/checklist.md`. Evaluate the DS files themselves (roles complete, scale consistent, dark values present, focus ring defined, motion tokens present). Print `item | pass | fail | n/a`.
3. Preview. If Playwright is available, capture `preview.html` with `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/capture.mjs --urls file://$PWD/design-system/preview.html --widths 390,1280 --schemes light,dark --out design-system/preview-shots` and view the images with Read. Confirm the accent appears only on links, focus and the selected sample; confirm no text is below 12px.
4. Open questions. List every `default, not decided` item as a bullet with the question that would decide it. This list is the last section of RATIONALE.md and the last thing you print.

## Hand-over message

Print in this order: file list with paths, the deviation table (short form), the contrast table summary (`N pairs, N pass, N fail`), the open questions, and one line on how to use it: `Run /awesome-ds:awesome-ds and it will detect design-system/DESIGN.md and prefer it.`

No summary of the interview, no praise of the brand.
