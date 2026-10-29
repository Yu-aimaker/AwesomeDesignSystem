---
title: "Google Stitch DESIGN.md spec"
category: design-md-collections
type: guideline
sources:
  - url: https://github.com/google-labs-code/design.md
    title: "google-labs-code/design.md: A format specification for describing a visual identity to coding agents"
  - url: https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md
    title: "design.md docs/spec.md (full specification)"
  - url: https://raw.githubusercontent.com/google-labs-code/design.md/main/PHILOSOPHY.md
    title: "design.md PHILOSOPHY.md"
  - url: https://github.com/google-labs-code/stitch-skills
    title: "google-labs-code/stitch-skills: Agent skills and plugins for Google Stitch"
  - url: https://stitch.withgoogle.com/docs/design-md/overview/
    title: "Stitch docs: DESIGN.md overview (proxy blocked, link recorded)"
  - url: https://stitch.withgoogle.com/docs/design-md/specification/
    title: "Stitch docs: DESIGN.md specification (proxy blocked, link recorded)"
tags: [design-md, stitch, specification, frontmatter, tokens, google-labs]
updated: 2026-09-06
---

# Google Stitch DESIGN.md spec

## 概要

DESIGN.md は Google Labs（Stitch チーム）が公開した、視覚的アイデンティティをコーディングエージェントに伝えるためのファイル形式。YAML frontmatter に機械可読なトークン、Markdown 本文に設計の理由を書く二層構造で、ステータスは alpha。仕様の一次ソースは stitch.withgoogle.com のドキュメントだが、本セッションのプロキシでは取得できなかったため、同内容を収める GitHub リポジトリ `google-labs-code/design.md` の `docs/spec.md` と README を読んだ。

## 要点

- 二層構造: `---` で囲む YAML frontmatter（トークン）と、`##` 見出しで区切る Markdown 本文（理由と制約）。トークンは参照値であり、本文が規範。
- frontmatter キー: `version`（任意、現在 `"alpha"`）、`name`（必須）、`description`（任意）、`omitted`（任意）、`colors`、`typography`、`rounded`、`spacing`、`components`。
- 本文の必須セクション順序: 1 Overview、2 Colors、3 Typography、4 Layout、5 Elevation & Depth、6 Shapes、7 Components、8 Do's and Don'ts。`<h1>` は任意でパースされない。見出しの重複は拒否、未知のセクションやトークンは警告付きで保持。
- トークン参照は `{path.to.token}`。`components` 内では `{typography.label-md}` のような複合値も参照でき、それ以外では primitive のみ。
- Lint は WCAG コントラストを全色に対して検査する（内部で sRGB に変換）。
- CLI（npm `@google/design.md`）: `lint`（構造と WCAG コントラスト）、`diff`（版比較）、`export`（Tailwind 設定、CSS、W3C Design Tokens Format へ変換）、`spec`（仕様出力）。
- リポジトリ構成: `docs/spec.md`、`packages/cli/`、`examples/`、`.agents/skills/`、`PHILOSOPHY.md`、`CONTRIBUTING.md`。ライセンス Apache-2.0。
- 哲学（PHILOSOPHY.md）: 設計意図の主な乗り物は散文。「1970 年代の大学院講義配布資料」のような具体的参照は形容詞よりモデルに多くを伝え、否定制約も一緒に持ち込む。既存のトークンシステムやデザインツールを置き換えることは意図しない。motion、iconography、elevation などは領域ごとの拡張に任せる。
- 関連: `google-labs-code/stitch-skills` は Stitch MCP 向けのスキル集で、`stitch::extract-design-md`、`stitch::manage-design-system`、`design-md`、`taste-design` などが DESIGN.md を中心に回る。Claude Code / Cursor では `npx plugins add google-labs-code/stitch-skills`。

## 具体的な値・ルール（あれば）

frontmatter スキーマ（README の記法）。

```yaml
version: <string>          # optional, current: "alpha"
name: <string>
description: <string>      # optional
omitted: <string[] | OmittedSection[]>
colors:
  <token-name>: <Color>
typography:
  <token-name>: <Typography>
rounded:
  <scale-level>: <Dimension>
spacing:
  <scale-level>: <Dimension | number>
components:
  <component-name>:
    <property>: <value or token reference>
```

| 型 | 許容値 |
|---|---|
| Color | hex（#RGB, #RGBA, #RRGGBB, #RRGGBBAA）、名前付き色、`rgb()` `rgba()` `hsl()` `hsla()` `hwb()`、`oklch()` `oklab()` `lch()` `lab()`、`color-mix()` |
| Dimension | 数値 + `px` / `em` / `rem` |
| Typography | `fontFamily`、`fontSize`（Dimension）、`fontWeight`（数値）、`lineHeight`（Dimension または単位なし倍率）、`letterSpacing`（Dimension）、`fontFeature`（font-feature-settings）、`fontVariation`（font-variation-settings） |
| Token reference | `{colors.primary}` のようなドット区切りパス |
| Component property | `backgroundColor`、`textColor`、`typography`、`rounded`、`padding`、`size`、`height`、`width`。バリアントは `button-primary-hover` のように名前で表す |
| omitted | 文字列の配列、または `{ section, reason }` オブジェクトの配列。意図的に省いたセクションの lint 警告を抑制 |

## AwesomeDS への反映

- 採用: frontmatter のキー構成（`version`、`name`、`description`、`colors`、`typography`、`rounded`、`spacing`、`components`）と `{colors.primary}` 形式の参照。`AwesomeDS/DESIGN.md` の `components` はすべて `{colors.*}` `{typography.*}` `{rounded.*}` を参照し、生の hex を持たない。
- 採用: Typography オブジェクトの 5 フィールド（fontFamily、fontSize、fontWeight、lineHeight、letterSpacing）。AwesomeDS は `lineHeight` を単位なし倍率で書いている（仕様が許容）。
- 採用: 「トークンは参照、散文が規範」という考え方。AwesomeDS は各節で `foundations/*.md` に理由を置き、本文の Rules を優先する。
- 採用: Lint 相当の WCAG コントラスト検査を設計時に行う方針（AwesomeDS 第 2 節 Rule 4「Check with the values above; do not eyeball」）。
- 変更: 本文セクション。仕様は 8 セクションを必須順序で求めるが、AwesomeDS は 12 節（Responsive、Accessibility、Agent prompt guide を追加）にした。Stitch の lint に通す場合は `omitted` か見出しの読み替えが必要になる。この差分は既知の未解決事項として記録する。
- 変更: `components` のプロパティ名。仕様の標準は `backgroundColor` `textColor` `typography` `rounded` `padding` `height` だが、AwesomeDS はそれに加えて `border` と `shadow` を使っている。仕様は未知プロパティを警告付きで保持するので致命的ではない。
- 不採用: motion トークンの省略。仕様は motion を領域拡張に任せるが、AwesomeDS は frontmatter に `motion`（duration と easing）を持つ。エージェントが動きの既定値を毎回発明しないためで、Stitch lint では未知キーの警告になる。
- 記録: 公式ドキュメント URL は取得不可のためリンクのみ。今後 `@google/design.md lint` を AwesomeDS の CI に組み込むかは別途判断。

## 出典

- https://github.com/google-labs-code/design.md : リポジトリ概要、README（スキーマ、セクション順序、CLI）。取得済み。
- https://raw.githubusercontent.com/google-labs-code/design.md/main/docs/spec.md : 型、参照解決、omitted、検証ルール。取得済み。
- https://raw.githubusercontent.com/google-labs-code/design.md/main/PHILOSOPHY.md : 形式の思想。取得済み。
- https://github.com/google-labs-code/stitch-skills : DESIGN.md を扱うスキル一覧とインストール手順。取得済み。
- https://stitch.withgoogle.com/docs/design-md/overview/ : 公式概要。プロキシで取得不可、リンクのみ記録。
- https://stitch.withgoogle.com/docs/design-md/specification/ : 公式仕様。プロキシで取得不可、リンクのみ記録（design.md README がこの URL を仕様の正として参照している）。
