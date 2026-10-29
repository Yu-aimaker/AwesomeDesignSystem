---
title: "スライド"
category: skills
type: guideline
sources:
  - url: https://github.com/zarazhangrui/frontend-slides
    title: "zarazhangrui/frontend-slides"
  - url: https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md
    title: "Frontend Slides README"
  - url: https://github.com/anthropics/skills
    title: "anthropics/skills"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md
    title: "pptx SKILL.md"
tags: [slides, skill, pptx, html, white-canvas]
updated: 2026-10-11
---

# スライド

## 概要

スライドは、16:9 の主張の列。AwesomeDS では大きな読み面を白、文字を濃くする。配布の本体は HTML 1 枚。`.pptx` は、相手が PowerPoint を指定したときだけ Anthropic の `pptx` スキルに渡す。

## 要点

- Frontend Slides（`zarazhangrui/frontend-slides`）: GitHub API で 2026-10-11 に確認。stars 30,450、最終 push 2026-06-23、MIT。HTML 1 枚、依存なし、16:9、pptx からの変換。README は紫グラデーションを避けると書く。白キャンバスを全プリセットの既定だとは書いていない。
- 導入（README）: `/plugin marketplace add https://github.com/zarazhangrui/frontend-slides` のあと `/plugin install frontend-slides@frontend-slides`。短縮形は SSH を試して失敗することがある、と README が注意する。
- Anthropic `pptx`（2026-10-11 に SKILL.md を取得）: 新規は pptxgenjs。`LAYOUT_16x9` は 10 x 5.625 インチ。色は `#` なしの 6 桁。`#FF0000` はファイルを壊す。
- AwesomeDS の Skill は `Plugin/awesome-ds/skills/slides/SKILL.md`。1 枚 1 主張。本文は 18px 以上。矢印キーで送り、`3 / 8` のように枚数を文字で出す。
- 人気 Skill の一覧（stars、ライセンス、良い例と悪い例）は `Knowledge/skills/slide-skills.md`。確認日は 2026-10-14。

## 具体的な値・ルール（あれば）

| 項目 | HTML | pptx |
|---|---|---|
| 比率 | `aspect-ratio: 16 / 9` | `LAYOUT_16x9` = 10 x 5.625 in |
| キャンバス | `#ffffff` | `FFFFFF` |
| 文字 | `#0a0a0a`、18px 以上 | `0A0A0A` |
| アクセント | `#2f5bea` を 1 スライドに 1 回まで | `2F5BEA` |
| 1 枚の中身 | 見出し + 文 1 つか、項目 4 つまで | 同じ |

## AwesomeDS への反映

- 反映不要: トークンは変えない。手順は Plugin の Skill。
- 反映不要: サイトの Slide ページ（別の変更で作る）。

## 出典

- https://raw.githubusercontent.com/zarazhangrui/frontend-slides/main/README.md : 機能、導入、紫グラデーションを避ける一文（2026-10-11）。
- https://api.github.com/repos/zarazhangrui/frontend-slides : stars 30,450、push 2026-06-23、MIT（2026-10-11）。
- https://raw.githubusercontent.com/anthropics/skills/main/skills/pptx/SKILL.md : キャンバス寸法と色の書き方（2026-10-11）。
