---
name: slides
description: Make a slide deck as one HTML file, or edit a .pptx when the user already has one. Use when the user asks for slides, a deck, a presentation, or a 16:9 talk. Defaults to a white canvas and dark text. Does not add a page to the AwesomeDS site.
argument-hint: "[audience and the one point of the deck]"
allowed-tools: Read, Grep, Glob
---

# slides

Works in any language. If the user writes Japanese, slide text is Japanese.

A deck is a sequence of claims, not a document pasted onto rectangles. Default output is one HTML file the speaker can open locally. Use `.pptx` only when the user already has a PowerPoint file or names `.pptx`.

## When this is the wrong skill

- A written report: use `html-report` when that skill is installed.
- A product UI: use `awesome-ds`.
- The AwesomeDS site's Slide page: that page is frontend work. Do not add it here.

## 1. Read before writing

1. Read `${CLAUDE_PLUGIN_ROOT}/ds/foundations/content-and-tone.md` and `anti-patterns.md`.
2. One line before any slide: `Deck: <point> for <audience>, <n> slides, lang <ja|en>, format <html|pptx>.`
3. Ask one question only when the answer changes the format (HTML or pptx) and the user did not say.

## 2. HTML deck

One file. No build step. Each `<section class="slide">` is 16:9.

Rules:

- Canvas `#ffffff`, text `#0a0a0a`, secondary `#525252`, hairline `#e5e5e5`. Accent `#2f5bea` on at most one element per slide (a link or the one number).
- Title slide plus one claim per slide. A slide holds a heading and either one sentence or one list of at most four items.
- Body text at least 18px. Do not put a paragraph of more than 40 Japanese characters, or 20 English words, on a slide.
- Keyboard: ArrowRight and ArrowLeft change the slide. The current index is text, not only a dot (`3 / 8`).
- `prefers-reduced-motion: reduce` turns off the transform. The slide still changes.
- No purple gradient, no dark full-bleed as the default, no three equal cards, no emoji as icons.

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>デッキの題</title>
  <style>
    :root { --canvas: #ffffff; --ink: #0a0a0a; --muted: #525252; --accent: #2f5bea; }
    html, body { margin: 0; background: #111; color: var(--ink); }
    .slide {
      display: none;
      width: min(100vw, calc(100vh * 16 / 9));
      aspect-ratio: 16 / 9;
      margin: 0 auto;
      background: var(--canvas);
      box-sizing: border-box;
      padding: 8%;
      font-family: "Noto Sans JP", "Hiragino Sans", sans-serif;
    }
    .slide.active { display: block; }
    h1 { font-size: 2.5rem; line-height: 1.2; font-weight: 600; margin: 0; }
    p { font-size: 1.25rem; line-height: 1.5; }
    .index { position: fixed; right: 1rem; bottom: 1rem; color: #fff; font-size: 0.875rem; }
    @media (prefers-reduced-motion: reduce) { .slide { transition: none; } }
  </style>
</head>
<body>
  <section class="slide active"><h1><!-- claim --></h1></section>
  <p class="index">1 / 1</p>
  <script>
    const slides = [...document.querySelectorAll(".slide")];
    const index = document.querySelector(".index");
    let i = 0;
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle("active", k === i));
      index.textContent = (i + 1) + " / " + slides.length;
    }
    addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") show(i + 1);
      if (e.key === "ArrowLeft") show(i - 1);
    });
  </script>
</body>
</html>
```

The area around the 16:9 frame may be dark so the slide reads as a screen. The slide itself stays white. That outer frame is not a reading surface.

## 3. pptx

Do not invent a second PowerPoint library. Point at Anthropic's `pptx` skill in `anthropics/skills` (`skills/pptx/SKILL.md`, fetched 2026-10-11):

- New decks: pptxgenjs. Set `pres.layout` before adding slides. Default `LAYOUT_16x9` is 10 by 5.625 inches.
- Colors are 6 hex digits with no `#`. A leading `#` corrupts the file.
- Do not share one shadow options object across two `add*` calls.
- After `writeFile()`, the skill's `scripts/office/validate.py` is the check.

Map AwesomeDS onto that file: canvas `FFFFFF`, ink `0A0A0A`, accent `2F5BEA` once per slide.

## 4. Other skills, with what they are for

| Skill | Use it when | URL |
|---|---|---|
| This skill | An AwesomeDS deck, white slides, one claim each | this folder |
| Frontend Slides | The user wants that plugin's style previews or a pptx-to-HTML conversion. 30,450 stars, MIT, last push 2026-06-23 (GitHub API, 2026-10-11) | https://github.com/zarazhangrui/frontend-slides |
| Anthropic pptx | A real `.pptx` | https://github.com/anthropics/skills/blob/main/skills/pptx/SKILL.md |

Frontend Slides says it avoids purple gradients. It does not promise a white canvas. If the user installs it, still keep large reading surfaces white unless they pick a dark preset on purpose.

## 5. Done

Print the file path, the slide count, and the title of each slide. Do not paste the file into chat.

## 6. Structured input

When the claims are already JSON, generate the file. Do not retype the skeleton.

```
node ${CLAUDE_PLUGIN_ROOT}/skills/slides/scripts/render-slides.mjs deck.json -o deck.html
```

The script fills section 2 and keeps that CSS. It exits 1 and writes nothing when a slide breaks the rules (one sentence or a list of at most four items, heading and body at most 40 Japanese characters or 20 English words, white slide, dark text). Contract: `docs/specs/sta-103-slides.md`.

Another repository runs the same command on its own JSON. Do not copy that HTML into this repository. Do not add a page to the AwesomeDS site from this script.
