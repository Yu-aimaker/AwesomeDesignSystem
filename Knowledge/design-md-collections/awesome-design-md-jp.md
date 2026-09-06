---
title: "awesome-design-md-jp"
category: design-md-collections
type: repo
sources:
  - url: https://github.com/kzhrknt/awesome-design-md-jp
    title: "kzhrknt/awesome-design-md-jp: DESIGN.md collection for Japanese web services"
  - url: https://kzhrknt.github.io/awesome-design-md-jp/gallery.html
    title: "Awesome Design MD JP Gallery (486 sites)"
  - url: https://github.com/VoltAgent/awesome-design-md
    title: "VoltAgent/awesome-design-md (the upstream the JP edition extends)"
tags: [design-md, japanese, typography, noto-sans-jp, yu-gothic, hiragino, collection]
updated: 2026-09-06
---

# awesome-design-md-jp

## 概要

日本の Web サービスを対象にした DESIGN.md コレクション。README は「Gallery (486 sites)」を掲げ、クローン時点の `design-md/` には 487 ディレクトリがある。VoltAgent 版に欠けている日本語タイポグラフィ（和文フォールバック、行間、字間、禁則、OpenType 機能、混植）を第 3 節に 8 つのサブセクションとして持つテンプレートが特徴。セクション見出しは英語、値の説明は日本語で書く。

## 要点

- リポジトリ構成: `README.md`（日英併記）、`CONTRIBUTING.md`、`LICENSE`、`template/DESIGN.md`、`gallery.html`（9,062 行）、`designmd-jp.jpg`、`design-md/<service>/` に `DESIGN.md`、`preview.html`、`preview-screenshot.png`。
- 9 セクション: 1 Visual Theme & Atmosphere、2 Color Palette & Roles、3 Typography Rules、4 Component Stylings、5 Layout Principles、6 Depth & Elevation、7 Do's and Don'ts、8 Responsive Behavior、9 Agent Prompt Guide。第 3 節は 3.1 和文フォント、3.2 欧文フォント、3.3 font-family 指定、3.4 文字サイズ・ウェイト階層、3.5 行間・字間、3.6 禁則処理・改行ルール、3.7 OpenType 機能、3.8 縦書き。
- VoltAgent 版と違い frontmatter を持たず、本文だけで構成される（テンプレートは `# DESIGN.md — [サービス名]` から始まる）。
- テンプレートの日本語ルール: 本文 line-height 1.5 以上（1.7 から 2.0 が読みやすい）、見出し 1.3 から 1.5、本文 letter-spacing 0.04em から 0.1em、見出し 0 から 0.05em。禁則は `line-break: strict`、`overflow-wrap: break-word`、`word-break: break-all` または `keep-all`。行頭禁止 `）」』】〕〉》、。，．・：；？！`、行末禁止 `（「『【〔〈《`。`palt` は見出しやナビに有効で本文には適用しない方が良い場合がある。
- テンプレートの Don't: 和文フォント 1 つだけの `font-family` 指定、本文 line-height 1.2 以下、全角・半角スペースの混在、テキスト色に純黒 `#000000`。
- gallery.html: 背景 `#0a0a0a`、カード `#141414`、`grid-template-columns: repeat(auto-fill, minmax(420px, 1fr))`、各カードは 1440x900 の `preview.html` を `iframe` に読み込み `scale(0.3)` で縮小表示。フィルタは `data-category` 属性で consumer 380、media 43、saas 40、agency 23。
- 貢献ワークフロー（CONTRIBUTING.md）: `template/DESIGN.md` をコピーして `design-md/<サービス名>/DESIGN.md` を作る。computed style や公開デザイントークンに基づき推測を避ける。font-family のフォールバックチェーンと hex 値、line-height と letter-spacing は実測値。ディレクトリ名はローマ字小文字ハイフン区切り（`smart-hr` ではなく `smarthr`）。コミットメッセージは `add: <サービス名> DESIGN.md`。VoltAgent 版と違い新規追加の PR を歓迎する。

## 具体的な値・ルール（あれば）

| サービス | Primary | Text | Background | Body font-family（実測） | 本文 size / line-height / letter-spacing | ボタン radius |
|---|---|---|---|---|---|---|
| goodpatch | `#096fc8` | `#333333` | `#f6f6f6` | `"A+EqpB-游ゴシック体 Pr6N M", sans-serif`（欧文要素は `"My Galano Grotesque", sans-serif`） | letter-spacing normal / line-height 2.0 | `1584px`（pill）、フッター CTA カードは 8px |
| smarthr | `#0077c7`（Product Main）、ブランド色 `#00c4cc` は UI 非推奨 | `#23221e` | `#f8f7f6`（Stone 01） | `AdjustedYuGothic, "Yu Gothic", YuGothic, "Hiragino Sans", sans-serif` | 16px / 1.5 / 0 | 6px |
| mercari | `#ff333f` | `#333333` | `#ffffff` | `"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN Custom", "Hiragino Sans Custom", "Meiryo Custom", sans-serif` | 15px / 1.4 / normal | 4px（入力欄は 0px） |
| cookpad | `#f28c06` | `#0f0f0f` | `#f8f6f2` | `noto-sans, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, arial, sans-serif` | 16px / 1.5 / -0.4px | 8px、入力欄高さ 40px |

補足。

- goodpatch は要素ごとに font-family を切り替え、游ゴシックの M と B をウェイトではなくファミリー名で切り替えている。ヒーロー H1 は Galano Grotesque 150px / 700 / line-height 0.85 / letter-spacing -0.035em。
- smarthr は `@font-face` で `Yu Gothic Medium` を weight 400 に、`Yu Gothic Bold` を 700 にマッピングする。タイプスケールは `scaleFactor / (scaleFactor + diff)` rem（scaleFactor 6）。Danger `#e01e5a`、Warning `#ffcc17`、Text Link `#0071c1`。
- mercari は欧文フォントを先に置き、和文は「Custom」サフィックス付きの独自 `@font-face`。全要素 line-height 1.4、`palt` 未使用。
- cookpad は `font-feature-settings: "liga"` のみ。`palt` 未使用。Semantic は Danger `#e53935`、Warning `#f9a825`、Success `#43a047`。

## AwesomeDS への反映

- 採用: 日本語本文の行間を欧文より広く取る規則。AwesomeDS 第 3 節は本文 1.6（日本語 1.8）、見出し 1.2 から 1.35（日本語 1.4 から 1.5）とし、テンプレートの「1.5 以上、1.7 から 2.0 が読みやすい」の範囲に収めた。
- 採用: `line-break: strict` と `overflow-wrap`。AwesomeDS は `overflow-wrap: anywhere` を選び、`text-autospace` を対応環境で足す。
- 採用: `palt` を見出しのみに限定し本文には使わない（AwesomeDS 第 3 節「palt on headings only, never on body」）。テンプレートの注記と cookpad / mercari の実測（palt 未使用）に基づく。
- 採用: 和文フォールバックチェーンの明示。`--font-sans` に `"Geist", "Noto Sans JP", system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif` を置き、smarthr の Hiragino / Yu Gothic フォールバック構成を参考にした。
- 変更: 字間。テンプレートは本文 0.04em から 0.1em を推奨するが、実測では goodpatch と mercari が normal、cookpad が -0.4px だった。AwesomeDS は日本語 0 から 0.02em、負値禁止とし、テンプレートより控えめにした。
- 不採用: 純黒禁止の理由づけ。AwesomeDS の ink は `#0a0a0a` で純黒ではないが、コントラストが「強すぎる」からではなく、ダークモード反転時に `#fafafa` と対にするための実務上の選択。
- 不採用: frontmatter を持たない構成。AwesomeDS は Stitch 仕様の frontmatter を維持し、機械可読性を優先した。
- 参考: gallery.html の iframe 縮小プレビュー方式は、本リポジトリの Web サイトでコンポーネント一覧を作る際の候補として記録する。

## 出典

- https://github.com/kzhrknt/awesome-design-md-jp : README、CONTRIBUTING.md、template/DESIGN.md、gallery.html、`design-md/{goodpatch,smarthr,mercari,cookpad}/DESIGN.md` をローカルクローンで読んだ。
- https://kzhrknt.github.io/awesome-design-md-jp/gallery.html : README がリンクする公開ギャラリー（486 sites）。内容はクローンの gallery.html と同一。
- https://github.com/VoltAgent/awesome-design-md : README が「欧米 55 以上のサービス」と参照する上流コレクション。
