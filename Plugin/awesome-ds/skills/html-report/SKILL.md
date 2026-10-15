---
name: html-report
description: Write a one-page HTML report or plan. Use when the user asks for a report, a readout, an HTML plan, a status page, or a visual summary that a person will read. Outputs one self-contained HTML file on a white canvas with dark text, using AwesomeDS tokens. Does not build the marketing site.
argument-hint: "[what the report must decide]"
allowed-tools: Read, Grep, Glob
---

# html-report

Works in any language. If the user writes Japanese, the report is Japanese. Identifiers stay as they are.

This skill writes a report a person can open in a browser. It is one HTML file. It is not a React app, and it is not a page in the AwesomeDS site.

## When this is the wrong skill

- A running product UI: use `awesome-ds`.
- A slide deck: use `slides` when that skill is installed. Otherwise say so and do not fake a deck inside this report.
- A complex claude.ai artifact that needs state, routing, or shadcn: Anthropic's `web-artifacts-builder` is the reference (`anthropics/skills`, `skills/web-artifacts-builder`). That path bundles React. This skill stays one file because a report is read once.

## 1. Read before writing

1. Read `${CLAUDE_PLUGIN_ROOT}/ds/foundations/content-and-tone.md` and `anti-patterns.md`.
2. Copy color and type from `${CLAUDE_PLUGIN_ROOT}/ds/tokens/tokens.css` into the report's `<style>` as custom properties. Do not type a second palette. If the file is missing, use the values in the skeleton below. They match AwesomeDS: canvas `#ffffff`, ink `#0a0a0a`, secondary `#525252`, hairline `#e5e5e5`, accent `#2f5bea` for links only.
3. State one line: `Report: <decision> for <reader>, lang <ja|en>.`

## 2. Shape

Order is fixed.

1. Title. A noun phrase. No period.
2. Conclusion. Three sentences. What is true, what changes, what the reader does next.
3. One figure or one table. Not both, unless the user asked for data that does not fit one.
4. Body under 1,500 Japanese characters (about 700 English words). Cut a sentence that does not change the decision.
5. Sources. Real URLs the report used. No invented numbers.

Large reading surfaces stay white with dark text. Accent is for links and the one number that is the point. No purple gradient, no dark mesh, no glass, no three equal cards.

## 3. Skeleton

Write this file, then replace the comments. Keep the CSS.

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>報告の題</title>
  <style>
    :root {
      --canvas: #ffffff;
      --ink: #0a0a0a;
      --muted: #525252;
      --hairline: #e5e5e5;
      --accent: #2f5bea;
    }
    body {
      margin: 0;
      background: var(--canvas);
      color: var(--ink);
      font-family: "Noto Sans JP", "Hiragino Sans", sans-serif;
      font-size: 16px;
      line-height: 1.6;
    }
    main { max-width: 40rem; margin: 0 auto; padding: 3rem 1.25rem 4rem; }
    h1 { font-size: 1.75rem; line-height: 1.25; font-weight: 600; margin: 0 0 1rem; }
    .conclusion { margin: 0 0 2rem; }
    .conclusion p { margin: 0 0 0.5rem; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 0.5rem 0; border-bottom: 1px solid var(--hairline); vertical-align: top; }
    a { color: var(--accent); }
    .meta { color: var(--muted); font-size: 0.875rem; }
  </style>
</head>
<body>
  <main>
    <h1><!-- noun phrase --></h1>
    <section class="conclusion">
      <p><!-- what is true --></p>
      <p><!-- what changes --></p>
      <p><!-- what to do next --></p>
    </section>
    <!-- one table or one figure -->
    <p class="meta"><!-- sources --></p>
  </main>
</body>
</html>
```

At 390px the main column is the viewport minus padding. Do not set a min-width that forces sideways scroll.

## 4. Before / after

Before: a dark page, a gradient hero, and the sentence 「革新的でシームレスな体験を実現することができます」.

After: white page, three short sentences, one table, the sentence 「3 件を直します。次はプレビューを開きます。」

## 5. Done

Print the file path and the three conclusion lines in chat. Do not paste the whole HTML into chat.

## 6. Check the file

From a checkout of this plugin:

`node ${CLAUDE_PLUGIN_ROOT}/skills/html-report/scripts/check-report.mjs path/to/report.html`

The script fails unless all of these hold: `lang` on `<html>`, `--canvas: #ffffff`, `--ink: #0a0a0a`, exactly three `<p>` elements in `section.conclusion`, exactly one `<table>` or one figure (`<figure>`, `<img>`, or `<svg>`), and no gradient. Body text outside the title, the conclusion, and the source line stays under 1,500 characters when the file contains Japanese, otherwise under 700 words.

Another repository uses the same command on its own HTML file. Do not copy that repository into AwesomeDS.

## 7. Structured input

When the facts are already JSON, generate the file. Do not retype the skeleton.

```
node ${CLAUDE_PLUGIN_ROOT}/skills/html-report/scripts/render-report.mjs report.json -o report.html
```

The script fills section 3 and keeps that CSS. It exits 1 and writes nothing when section 2 is broken (three conclusion sentences, one table or one `img`, white canvas, dark text, Japanese body at most 1,500 characters). Contract: `docs/specs/sta-102-html-report.md`.

Another repository runs the same command on its own JSON. Do not copy that HTML into this repository. Do not add a page to the AwesomeDS site from this script.
