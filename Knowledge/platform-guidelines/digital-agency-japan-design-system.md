---
title: "デジタル庁デザインシステム (DADS)"
category: platform-guidelines
type: design-system
sources:
  - url: https://design.digital.go.jp/
    title: "デジタル庁デザインシステムβ版"
  - url: https://github.com/digital-go-jp/design-tokens
    title: "digital-go-jp/design-tokens: デジタル庁デザインシステム（Figma）のデザイントークン"
  - url: https://raw.githubusercontent.com/digital-go-jp/design-tokens/develop/README.md
    title: "design-tokens README (develop)"
  - url: https://github.com/digital-go-jp/design-system-example-components
    title: "digital-go-jp/design-system-example-components (React / Tailwind)"
  - url: https://github.com/digital-go-jp/design-system-example-components-html
    title: "digital-go-jp/design-system-example-components-html (HTML/CSS/JS)"
  - url: https://www.figma.com/community/file/1255349027535859598
    title: "デジタル庁 デザインシステム (Figma Community)"
tags: [japan, government, design-system, accessibility, tokens, noto-sans-jp, figma]
updated: 2026-10-07
---

# デジタル庁デザインシステム (DADS)

## 概要

デジタル庁デザインシステム (Digital Agency Design System, DADS) は日本政府のウェブサービス向けデザインシステムで、Figma ファイル、デザイントークン npm パッケージ (`@digital-go-jp/design-tokens`)、React / Tailwind 実装、プレーン HTML 実装を MIT ライセンスで公開している。WCAG 2.2 と JIS X 8341-3:2016 への準拠を前提に、コントラスト 4.5:1、タッチターゲット 44x44 px、最小フォントサイズなどをトークンで担保する。design.digital.go.jp は本環境からアクセス不可のため、GitHub 上の公開リポジトリと、クローン済み `awesome-design-md-jp/design-md/digital-go/DESIGN.md` (公式 Foundations とトークンに基づく整理) を一次資料にした。

## 要点

- 配布物: Figma (Community file 1255349027535859598)、`@digital-go-jp/design-tokens` (tokens.css は全トークン、tokens-simple.css は「色、フォントおよびエレベーション」のみ)、React 実装 (`design-system-example-components`、Tailwind v3 + `@digital-go-jp/tailwind-theme-plugin`)、HTML 実装 (`design-system-example-components-html`)。いずれも MIT。
- トークンは Tokens Studio for Figma と Style Dictionary で生成し、GitHub Actions で npm に公開する。Figma 2.0.4 から 2.14.0 がパッケージ 2.0.0 に対応。
- Foundations は 8 分類: Color, Typography, Icon, Layout, Link Text, Spacing, Corner Shapes, Elevation。
- 色は Primitive (11 色相 × 13 段階 50 から 1200)、Neutral (Solid Gray / Opacity Gray)、Semantic (Success / Error / Warning) の 3 階層。CSS 名は `--color-primitive-blue-900` のように階層を含む。
- Solid Gray に `420` `536` という不規則な段階がある。それぞれ AAA と AA (4.5:1) のコントラスト閾値を意識した値。
- ボタン既定色は blue-900 `#0017c1`、リンクとボタン hover は blue-1000 `#00118f`、フォーカスリングは yellow-300 `#ffd43d`。
- アクセシビリティ要件: テキスト 4.5:1 以上、非テキスト UI 3:1 以上、タッチターゲット 44x44 CSS px 以上、14px 未満の文字は原則使用禁止。
- 本文の line-height 標準は 1.7。ブレークポイントは 768px の 1 点のみ。
- 角丸は 5 段階、エレベーションは 8 段階の box-shadow。

## 具体的な値・ルール

### Primitive (抜粋、13 段階のうち 50 / 500 / 1000)

| 色相 | 50 | 500 | 1000 | 役割 |
|---|---|---|---|---|
| blue | `#e8f1fe` | `#4979f5` | `#00118f` | コア色。リンク・focus は blue-1000 |
| light-blue | `#f0f9ff` | `#39abff` | `#00428c` | 補助 |
| green | `#e6f5ec` | `#2cac6e` | `#0c472a` | success |
| yellow | `#fbf5e0` | `#ebb700` | `#806300` | warning, focus |
| orange | `#ffeee2` | `#ff7628` | `#8b3200` | warning |
| red | `#fdeeee` | `#ff5454` | `#a90000` | error |

### Neutral Solid Gray

```
50 #f2f2f2 / 100 #e6e6e6 / 200 #cccccc / 300 #b3b3b3 / 400 #999999
420 #949494 (AAA) / 500 #7f7f7f / 536 #767676 (AA 4.5:1) / 600 #666666
700 #4d4d4d / 800 #333333 (本文標準) / 900 #1a1a1a
```

### Semantic

```
success-1 green-600 #259d63 / success-2 green-800 #197a4b
error-1 red-800 #ec0000 / error-2 red-900 #ce0000
warning-yellow-1 yellow-700 #b78f00 / warning-yellow-2 yellow-900 #927200
warning-orange-1 orange-600 #fb5b01 / warning-orange-2 orange-800 #c74700
```

### 要件

| 項目 | 値 |
|---|---|
| テキストコントラスト | 4.5:1 以上 |
| 非テキスト UI | 3:1 以上 |
| タッチターゲット | 44 x 44 CSS px 以上 |
| 最小フォントサイズ | 14px 未満は原則禁止 |
| 本文 line-height | 1.7 |
| breakpoint | 768px |

## AwesomeDS への反映

- 採用: 3 階層トークン (primitive → semantic → component) の考え方。AwesomeDS は `colors` にロール名のみを置き、「Never reference a raw hex in a component; reference a role」とした (DESIGN.md 2. Color)。
- 採用: コントラスト閾値を数値で明示する運用。DADS が `536 #767676` を AA 境界として名前に埋め込むのに対し、AwesomeDS は `ink-muted #737373` (4.7:1) を「Placeholders, timestamps」に限定する形で同じ意図を表した。
- 採用: 44x44 のタッチターゲット、日本語本文の広い行間 (DADS 1.7、AwesomeDS 1.8)、`overflow-wrap` と `line-break: strict` の明示 (3. Typography)。
- 翻案: 最小フォントサイズ。DADS は 14px 未満禁止、AwesomeDS は 12px を caption に許容し「Never below 12」とした。公共サービスより情報密度が高いプロダクト UI を想定したため。
- 翻案: フォーカスリング。DADS は黄色 `#ffd43d` の高視認リングを使うが、AwesomeDS は accent と同色の 2px リングにした。黄色は多くのブランド色と衝突するため、ブランド化する場合は `ds-creator` で差し替える。
- 不採用: 8 段階のエレベーション。AwesomeDS は 0 から 3 の 4 段階に絞り、border を優先する (6. Depth and elevation)。
- 不採用: 768px 単一ブレークポイント。AwesomeDS は 640 / 768 / 1024 / 1280 / 1536 を使う (4. Spacing and layout)。

## 出典

- https://github.com/digital-go-jp/design-tokens : パッケージ構成、Figma との対応表、Tokens Studio + Style Dictionary の生成手順。
- https://raw.githubusercontent.com/digital-go-jp/design-tokens/develop/README.md : `tokens.css` / `tokens-simple.css` の説明 (日本語)。
- https://github.com/digital-go-jp/design-system-example-components : React 18 + Tailwind 3 実装、MIT、Storybook。
- https://github.com/digital-go-jp/design-system-example-components-html : プレーン HTML/CSS/JS 実装、MIT。
- https://www.figma.com/community/file/1255349027535859598 : Figma ファイル (README 内リンクで確認、figma.com はアクセス不可)。
- https://design.digital.go.jp/ (取得日 2026-10-07): og:title「デジタル庁デザインシステムβ版」、og:image `https://design.digital.go.jp/dads/images/ogp_default.png` (1200x630)。本文トークンは GitHub とクローン DESIGN.md を一次資料とした。
