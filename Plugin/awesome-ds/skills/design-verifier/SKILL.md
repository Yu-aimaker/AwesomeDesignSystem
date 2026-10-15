---
name: design-verifier
description: Adversarial design review of a running URL or static UI files against AwesomeDS or the project's own DESIGN.md. Use when the user asks to "review the design", "check the UI", "does this follow the DS", "design QA", "audit accessibility/contrast", or before shipping a page. Runs a static audit, captures screenshots at 390/768/1280 in light and dark, scores a rubric 0 to 5, and writes design-review.md with file:line findings and a fix list.
argument-hint: "[url or path] [--ds path/to/DESIGN.md]"
allowed-tools: Read, Grep, Glob, Bash(node *), Bash(npx playwright *), Bash(ls *), Bash(mkdir *)
---

# design-verifier

Works in any language. If the user writes Japanese, write design-review.md in Japanese; keep rubric section names, file paths and scores as they are.

You are the reviewer, not the author. Assume the page has problems and go find them. Never soften a finding, never add "but overall it looks good". A finding is a fact with a location; the author decides what to do with it.

## Anti-jobs

- Do not edit the UI until the user names which findings to fix.
- Do not change tokens or the rubric to hide a finding.
- Do not skip browser capture when the target is a URL or an HTML file. The static audit is not the review.

## Inputs

- Target: `$ARGUMENTS[0]`. A URL (`http://localhost:3000`, `https://...`), a folder of static files, or a single `.html`. If empty, look for a dev server hint in `package.json` scripts and ask one question: "Which URL or path should I review?"
- Design system: `--ds <path>` if given. Otherwise the project's `DESIGN.md` (search repo root, `docs/`, `design-system/`). Otherwise `${CLAUDE_PLUGIN_ROOT}/ds/DESIGN.md`. Say which one you used in the report header.
- Routes: every internal link found on the start page, capped at 8, plus any routes the user names. List them before capturing.

Read the DESIGN.md you selected fully before step (a). Read `${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/reference/rubric.md` before step (b).

## Procedure

Run all five steps. Do not stop after the static audit because "it already found a lot".

### (a) Static audit

1. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/static-audit.mjs <src-dir-or-file> [--json]`. It reports, with `file:line`: raw hex/rgb/hsl outside token files, Tailwind arbitrary colours, `outline: none` without `:focus-visible`, gradients, blur and glow, `100vh` and `h-screen`, scroll listeners, font sizes below 12px, weights 700+, em dashes, filler words, placeholder names, missing or wrong `lang`, `Inter`, slate and purple defaults, eyebrow count, shadow on cards, a bar chart `<YAxis>` whose domain does not start at 0 (`bar-baseline`, S2), and an `.html` file with `<head>` but no `og:image` or `twitter:card` (S2).
1. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/static-audit.mjs <src-dir-or-file> [--json]`. It reports, with `file:line`: raw hex/rgb/hsl outside token files, Tailwind arbitrary colours, `outline: none` without `:focus-visible`, gradients, blur and glow, `100vh` and `h-screen`, scroll listeners, font sizes below 12px, weights 700+, em dashes, filler words, placeholder names, missing or wrong `lang`, `Inter`, slate and purple defaults, eyebrow count, shadow on cards, a chart title that only repeats its column names (`column-title`, S2), and an `.html` file with `<head>` but no `og:image` or `twitter:card` (S2).
1. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/static-audit.mjs <src-dir-or-file> [--json]`. It reports, with `file:line`: raw hex/rgb/hsl outside token files, Tailwind arbitrary colours, `outline: none` without `:focus-visible`, gradients, blur and glow, `100vh` and `h-screen`, scroll listeners, font sizes below 12px, weights 700+, em dashes, filler words, placeholder names, missing or wrong `lang`, `Inter`, slate and purple defaults, eyebrow count, shadow on cards, a bar, line, area, pie, or composed chart with no source name and URL in the 12 lines under it (`chart-source`, S2), and an `.html` file with `<head>` but no `og:image` or `twitter:card` (S2).
1. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/static-audit.mjs <src-dir-or-file> [--json]`. It reports, with `file:line`: raw hex/rgb/hsl outside token files, Tailwind arbitrary colours, `outline: none` without `:focus-visible`, gradients, blur and glow, `100vh` and `h-screen`, scroll listeners, font sizes below 12px, weights 700+, em dashes, filler words, placeholder names, missing or wrong `lang`, `Inter`, slate and purple defaults, eyebrow count, shadow on cards, a `<Legend>` inside a line, area, or pie chart (`color-key`, S2), and an `.html` file with `<head>` but no `og:image` or `twitter:card` (S2).
1. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/static-audit.mjs <src-dir-or-file> [--json]`. It reports, with `file:line`: raw hex/rgb/hsl outside token files, Tailwind arbitrary colours, `outline: none` without `:focus-visible`, gradients, blur and glow, `100vh` and `h-screen`, scroll listeners, font sizes below 12px, weights 700+, em dashes, filler words, placeholder names, missing or wrong `lang`, `Inter`, slate and purple defaults, eyebrow count, shadow on cards, two `<YAxis>` in one file (`dual-axis`, S2), and an `.html` file with `<head>` but no `og:image` or `twitter:card` (S2).
1. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/static-audit.mjs <src-dir-or-file> [--json]`. It reports, with `file:line`: raw hex/rgb/hsl outside token files, Tailwind arbitrary colours, `outline: none` without `:focus-visible`, gradients, blur and glow, `100vh` and `h-screen`, scroll listeners, font sizes below 12px, weights 700+, em dashes, English filler words, Japanese filler (`ことができます`, `シームレス`, `革新的`, `次世代`, `を実現`), placeholder names, missing or wrong `lang`, `Inter`, slate and purple defaults, eyebrow count, shadow on cards, and an `.html` file with `<head>` but no `og:image` or `twitter:card` (S2). Lines whose key is `bad` or `before`, phrases inside `「」`, and `ads-audit-ignore` are not Japanese-filler findings.
2. Add what the script cannot see by reading the component files: missing states (hover, focus-visible, active, disabled, loading, empty, error), accent used on more than one element per view or as a button fill, radius mixing across element types, layout repetition (two consecutive sections with the same family, three identical cards), one primary button per view, label-above-input, icon-only buttons without `aria-label`.
3. Record every item as a finding (section "Findings" format below). Do not deduplicate across files; a repeated mistake is worth counting.

### (b) Capture and look

1. Run the capture script (details in `${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/reference/capture-playbook.md`):
   ```
   node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/capture.mjs \
     --urls <url1>,<url2> --widths 390,768,1280 --schemes light,dark \
     --out design-review/shots --full-page
   ```
   Static files: pass `file:///abs/path/index.html`. If Playwright is missing, follow the playbook's install steps (`npx playwright install chromium`) and retry once. If it still fails, record "capture skipped: <reason>" in the report and continue with (a), (c), (d).
   The capture also checks images: after load it scrolls the page, then every `<img>` must be `complete` with `naturalWidth > 0` and no image request may answer 4xx/5xx. Each broken image is printed with its `src` (exit 1). On a page with `section[aria-labelledby=flagship]` it prints `flagship images: N/M real, K fallback, B broken`. Record every broken image as an S1 finding under Consistency.
2. View every screenshot with the Read tool. For each, write two or three observations against the rubric before moving to the next one. Look at the 390 shots first; mobile hides nothing.
3. Score each rubric section 0 to 5 using the anchors in rubric.md. A section with any severity-1 finding cannot score above 2.

### (c) DS conformance

- Token usage: percentage of colour declarations that use tokens (from the static audit counts). Below 95% is a finding.
- Component conformance: compare buttons, inputs, cards, dialogs, badges against the `components:` block of the DESIGN.md (heights, radii, borders, padding). Measure from the screenshots when the code is not available (1280 shots are 1:1 CSS px unless the playbook says otherwise).
- Brand reflection: read the DESIGN.md atmosphere section (adjectives, accent, type). Then answer, with evidence from the screenshots, whether the page would be recognised as that brand with the logo removed. If the accent appears nowhere, or the type is not the declared family, that is a finding.

### (d) DS self-audit

The DESIGN.md can be wrong. Run `node ${CLAUDE_PLUGIN_ROOT}/skills/ds-creator/scripts/contrast.mjs <path to tokens.css or DESIGN.md>` and report every FAIL as a finding against the DS, not the page. Then check: every role used by the page exists in the DS; the type scale has no gaps or duplicates; dark values exist for every light value; radii form one family; motion tokens exist. Findings here are labelled `DS:`.

### (e) Human-comfort check

From the 390 and 1280 light screenshots of the start page, answer each with yes or no and one line of evidence:

1. Can a first-time user find the primary action within 5 seconds? (One primary button, in the first viewport, label says what happens.)
2. Is anything moving without a user action? (Marquees, auto-carousels, looping animations, pulsing dots.)
3. Is body text at least 16px and small UI text at least 14px? (Measure from code or the 1280 shot.)
4. Are interactive targets at least 24x24 desktop and 44x44 mobile?
5. Does the first viewport at 390 show heading, one paragraph and the primary action without scrolling?
6. Japanese pages: is `lang="ja"` set, line height 1.7 or more on body, no negative letter spacing, no line starting with 。、」?

## Output: design-review.md

Write to `design-review/design-review.md` (create the folder). Structure:

```
# Design review: <target>  (<date>)
DS used: <path>. Routes: <list>. Viewports: 390, 768, 1280 x light, dark. Screenshots: design-review/shots/.

## Scores (0-5)
| Section | Score | Worst finding |
hierarchy | alignment | rhythm | contrast | density | consistency | states | first-viewport hero | copy | japanese typography | ds conformance | human comfort
Total: <sum>/60

## Findings (sorted by severity 1 to 3)
S1 <id> <one-line problem>. Where: <file:line or shots/<name>.png>. Rule: <DESIGN.md section or rubric item>. Fix: <one line>.
...

## Fix list (ordered, each one PR-sized)
1. ...

## Not checked
<anything skipped, with the reason>
```

Severity: S1 breaks use or law (contrast fail, missing focus, target size, unreadable text, missing lang on ja page). S2 breaks the DS (raw colour, accent misuse, radius mix, missing state). S3 taste and copy (eyebrows, filler, repetition).

Every finding has a location. A finding without `file:line` or a screenshot name is not allowed in the report.

## After the report

Print the scores table and the count of S1/S2/S3 in the chat, then offer once: "I can apply the fix list now. Say which items, or 'all'." Do not start fixing before the user answers.
