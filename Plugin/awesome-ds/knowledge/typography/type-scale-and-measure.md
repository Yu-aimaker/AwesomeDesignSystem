---
title: "タイプスケールと測度 (行長)"
category: typography
type: article
sources:
  - url: https://github.com/modularscale/modularscale-sass
    title: "modularscale/modularscale-sass: Modular scale calculator built into your Sass"
  - url: https://raw.githubusercontent.com/nathanlane/nathanstypographynotes/HEAD/butterick.md
    title: "nathanstypographynotes: butterick.md (Practical Typography のノート)"
  - url: https://raw.githubusercontent.com/xCYBERx01/NEXPLACE/HEAD/docs/research/08-refactoring-ui.md
    title: "NEXPLACE docs: 08-refactoring-ui.md (Refactoring UI のノート)"
  - url: https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/scale.ts
    title: "carbon/packages/type scale.ts"
  - url: https://practicaltypography.com/line-length.html
    title: "Line length | Butterick's Practical Typography"
tags: [type-scale, modular-scale, measure, line-length, 65ch, butterick, refactoring-ui]
updated: 2026-09-06
---

# タイプスケールと測度 (行長)

## 概要

タイプスケールは本文サイズを基準に見出しから注釈までのサイズを決める規則で、比率で作る modular scale と、手で選んだ値の列 (hand-picked scale) の 2 流派がある。測度 (measure、行長) は 1 行の文字数で、Butterick は 45 から 90 文字、CSS では `max-width: 65ch` が一般的な実装になる。practicaltypography.com、typescale.com、alistapart.com は本環境から取得できず、GitHub 上のノートとツールの README、Carbon のスケール式を資料とした。

## 要点

- Modular scale: 「a list of values that share the same relationship」。modularscale-sass の比率は minor second 1.067、major second 1.125、major third 1.25、fourth 1.333、augmented fourth 1.414、fifth 1.5、minor sixth 1.6、major sixth 1.667、minor seventh 1.778、major seventh 1.875、octave 2、golden 1.618。既定は `$fifth`、base 1em。
- 比率で作ると 16 × 1.25^n = 16, 20, 25, 31.25, 39.06 のように端数が出る。Refactoring UI のノートは「Hand-picked scale: 12, 14, 16, 18, 20, 24, 30, 36, 48, 64」「avoid fractional values」を勧める。
- Carbon は式 `Yn = Yn-1 + {FLOOR[(n - 2) / 4] + 1} * 2` で 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 68, 76, 84 を得る。小さいサイズは 2px 刻み、大きくなるほど刻みが広がる。
- Butterick (ノート経由): Web の本文は「15-25 pixels」、行送りは「120-145% of point size」、行長は「45-90 characters per line (including spaces)」。本文の見た目が文書の品質の大半を決める。
- 行長の CSS 実装: `max-width: 65ch` は「0」の幅 × 65 で、多くの sans では 60 から 70 文字に相当する。和文は全角 1 文字 = 1em なので 40 文字なら `max-width: 40em`。
- Refactoring UI のノート: 余白も同様に 25% 以上の差を保つ制約付きスケール (4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256) を使う。ウェイトは 400 から 500 と 600 から 700 の 2 グループで足りる。

## 具体的な値・ルール

| スケール | 値 (px) |
|---|---|
| modular 1.25 (base 16) | 12.8, 16, 20, 25, 31.25, 39.06, 48.8 |
| modular 1.333 (base 16) | 12, 16, 21.3, 28.4, 37.9, 50.5 |
| Refactoring UI (hand-picked) | 12, 14, 16, 18, 20, 24, 30, 36, 48, 64 |
| Carbon | 12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 54, 60, 68, 76, 84 |
| AwesomeDS | 12, 14, 16, 18, 20, 28, 36, 56 |

| 測度 | 値 |
|---|---|
| Butterick | 45 から 90 文字 |
| CSS 実装 | `max-width: 65ch` |
| 和文 (AwesomeDS) | 40 全角文字 |

| 本文 | 値 |
|---|---|
| Butterick サイズ | 15 から 25px |
| Butterick 行送り | 120 から 145% |
| AwesomeDS | 16px / 160% (和文 180%) |

## AwesomeDS への反映

- 採用: hand-picked scale。AwesomeDS の 12, 14, 16, 18, 20, 28, 36, 56 は端数がなく、4 の倍数を優先している (DESIGN.md 3. Typography)。比率で言えば 16 → 20 → 28 → 36 → 56 は約 1.25 から 1.55 の間で、大きくなるほど跳ねる。
- 採用: 「Measure: body text max 65ch Latin, 40 full-width characters Japanese」。Butterick の 45 から 90 の中央付近。
- 採用: 本文 16px は Butterick の 15 から 25px の下端。UI では 16 より大きい本文は密度を落とすため、読み物では body-lg 18px を用意した。
- 翻案: 行送り 1.6 は Butterick の 145% を超える。画面上の sans と、和文との混植で 1.6 の方が読みやすいと判断した。
- 翻案: Refactoring UI の余白スケールは 192 と 256 を落とし、128 までにした (4. Spacing and layout)。
- 不採用: 純粋な modular scale。小数 px が出ることと、UI の 14px を含められないため。
- 不採用: Carbon の 16 段。8 段で十分と判断。

## 出典

- https://github.com/modularscale/modularscale-sass : 取得済み。比率の一覧、既定 `$fifth`、base 1em。
- https://raw.githubusercontent.com/nathanlane/nathanstypographynotes/HEAD/butterick.md : 取得済み。Butterick の本文サイズ、行送り、行長のノート。
- https://raw.githubusercontent.com/xCYBERx01/NEXPLACE/HEAD/docs/research/08-refactoring-ui.md : 取得済み。hand-picked scale と余白スケールのノート。
- https://raw.githubusercontent.com/carbon-design-system/carbon/HEAD/packages/type/src/scale.ts : 取得済み。スケール式と 16 段。
- https://practicaltypography.com/line-length.html : ネットワーク制限で取得不可。数値はノート経由。
