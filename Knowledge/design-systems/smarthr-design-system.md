---
title: "SmartHR Design System"
category: design-systems
type: design-system
sources:
  - url: https://github.com/kufu/smarthr-ui
    title: "kufu/smarthr-ui: React components for creating SmartHR applications"
  - url: https://raw.githubusercontent.com/kufu/smarthr-ui/master/packages/smarthr-ui/src/themes/createColor.ts
    title: "smarthr-ui createColor.ts (色トークン)"
  - url: https://raw.githubusercontent.com/kufu/smarthr-ui/master/packages/smarthr-ui/src/themes/createFontSize.ts
    title: "smarthr-ui createFontSize.ts (フォントサイズ)"
  - url: https://raw.githubusercontent.com/kufu/smarthr-ui/master/packages/smarthr-ui/src/themes/createLeading.ts
    title: "smarthr-ui createLeading.ts (行間)"
  - url: https://github.com/kufu/smarthr-design-system
    title: "kufu/smarthr-design-system (smarthr.design のソース)"
  - url: https://github.com/yuki-takei/awesome-design-md-jp/blob/main/design-md/smarthr/DESIGN.md
    title: "awesome-design-md-jp: smarthr/DESIGN.md"
tags: [smarthr, japan, saas, design-system, accessibility, yu-gothic, warm-gray, tokens]
updated: 2026-09-06
---

# SmartHR Design System

## 概要

SmartHR Design System は人事労務 SaaS SmartHR のデザインシステムで、smarthr.design にドキュメント、`smarthr-ui` に React 実装 (MIT)、Figma にデザインデータを公開している。ウォームグレー (Stone 系) の neutrals、product main `#0077c7`、6px の角丸、line-height 1.5 という業務 UI 向けの密度が特徴で、アクセシビリティを明示的な要件にしている。smarthr.design は本環境からアクセス不可のため、トークンの値は `smarthr-ui` のソースコード、構成はクローン済みの DESIGN.md から取った。

## 要点

- ブランド色 SmartHR Blue `#00c4cc` はロゴ・イラスト・チャート用。白背景でコントラスト不足のため「テキストや UI 要素には非推奨」。UI の primary は `#0077c7` (MAIN / OUTLINE)。
- 文字: TEXT_BLACK `#23221e`、TEXT_GREY `#706d65`、TEXT_DISABLED `#c1bdb7`、TEXT_LINK `#0071c1`。すべて暖色寄りのグレー。
- 面: WHITE `#fff`、BACKGROUND / COLUMN `#f8f7f6`、BASE_GREY `#f5f4f3`、OVER_BACKGROUND `#f2f1f0`、HEAD `#edebe8`、BORDER / ACTION_BACKGROUND `#d6d3d0`。
- Semantic: DANGER `#e01e5a`、WARNING_YELLOW `#ffcc17`。OVERLAY `rgba(#030302, 0.15)`、SCRIM `rgba(#030302, 0.5)`。
- グレースケール: GREY_5 `#f8f7f6`、GREY_6 `#f5f4f3`、GREY_7 `#f2f1f0`、GREY_9 `#edebe8`、GREY_20 `#d6d3d0`、GREY_30 `#c1bdb7`、GREY_65 `#706d65`、GREY_100 `#23221e`。
- フォントサイズは 7 段 (XXS から XXL) で、`${scaleFactor / (scaleFactor + diff)}rem`、scaleFactor = 6。M = 1rem、L = 6/5 = 1.2rem、XL = 1.5rem、XXL = 2rem、S = 6/7 ≈ 0.857rem、XS = 0.75rem、XXS = 6/9 ≈ 0.667rem。
- 行間トークン: NONE 1、TIGHT 1.25、NORMAL 1.5、RELAXED 1.75。
- 書体は游ゴシックを公式推奨。Windows で Medium を通常ウェイトに割り当てる `@font-face { font-family: AdjustedYuGothic; font-weight: 400; src: local("Yu Gothic Medium"); }`。
- コンポーネント: primary button 背景 `#0077c7`、白文字、6px 角丸、16px / 700、padding 8px 16px。input は 1px `#d6d3d0`、focus は 2px `#0077c7`、6px。テーブルヘッダー `#edebe8`。
- 余白は 8px 基準: XS 4、S 8、M 16、L 24、XL 32。
- アクセシビリティ: 色のコントラスト比は WCAG AA 以上を確保する (クローン DESIGN.md の記述)。smarthr.design のアクセシビリティ方針ページは取得できなかった。

## 具体的な値・ルール

| Token | Hex | 用途 |
|---|---|---|
| BRAND | `#00c4cc` | ロゴ、イラスト (UI 非推奨) |
| MAIN / OUTLINE | `#0077c7` | ボタン、focus ring |
| TEXT_LINK | `#0071c1` | リンク |
| DANGER | `#e01e5a` | エラー、削除 |
| WARNING_YELLOW | `#ffcc17` | 警告 |
| TEXT_BLACK | `#23221e` | 本文 |
| TEXT_GREY | `#706d65` | 補助 |
| TEXT_DISABLED | `#c1bdb7` | 無効 |
| BACKGROUND | `#f8f7f6` | ページ |
| HEAD | `#edebe8` | テーブルヘッダー |
| BORDER | `#d6d3d0` | 罫線、入力枠 |

| Size token | rem | px (16 基準) |
|---|---|---|
| XXS | 0.667 | 10.7 |
| XS | 0.75 | 12 |
| S | 0.857 | 13.7 |
| M | 1 | 16 |
| L | 1.2 | 19.2 |
| XL | 1.5 | 24 |
| XXL | 2 | 32 |

## AwesomeDS への反映

- 採用: 「ブランド色を UI の primary にしない」判断。SmartHR は `#00c4cc` をロゴ専用にし `#0077c7` を UI に使う。AwesomeDS はさらに進めて primary button を ink にし、accent は link / focus / selection のみとした (DESIGN.md 2. Color 規則 1)。
- 採用: フォーカスは 2px の accent 枠。AwesomeDS「Focus ring: 2px solid accent, 2px offset」(11. Accessibility)。
- 採用: 3 段の文字色 (black / grey / disabled) と 1px の罫線。AwesomeDS の ink / ink-secondary / ink-muted / ink-disabled と hairline に対応する。
- 採用: ウェイト 400 / 700 の 2 段ではなく、AwesomeDS は 400 / 500 / 600 の 3 段にしたが、「太字を多用しない」姿勢は同じ。
- 翻案: 行間。SmartHR の業務 UI は 1.5 が標準、RELAXED 1.75。AwesomeDS は本文 1.6 (日本語 1.8) で、読み物寄りに広げた。
- 翻案: 角丸 6px は AwesomeDS の `sm: 6px` として残したが、コントロール既定は 8px。
- 不採用: ウォームグレーの neutrals。AwesomeDS は true gray (規則 3)。ブランド色を入れ替えたときに面の色味が干渉しないため。
- 不採用: 游ゴシック依存。Windows / macOS / Linux で同じ描画を得るため Noto Sans JP を採用。
- 不採用: 10.7px (XXS)。AwesomeDS の最小は 12px。

## 出典

- https://github.com/kufu/smarthr-ui : 取得済み。React コンポーネント、MIT、Figma でデザインデータ公開、smarthr.design へのリンク。
- https://raw.githubusercontent.com/kufu/smarthr-ui/master/packages/smarthr-ui/src/themes/createColor.ts : 取得済み。色トークンの hex。
- https://raw.githubusercontent.com/kufu/smarthr-ui/master/packages/smarthr-ui/src/themes/createFontSize.ts : 取得済み。7 段のサイズ式。
- https://raw.githubusercontent.com/kufu/smarthr-ui/master/packages/smarthr-ui/src/themes/createLeading.ts : 取得済み。行間トークン。
- https://github.com/kufu/smarthr-design-system : 取得済み。Astro + React + Tailwind で構築されたドキュメントサイトのソース。
- https://github.com/yuki-takei/awesome-design-md-jp/blob/main/design-md/smarthr/DESIGN.md : クローン済み。書体、コンポーネント、余白の整理。
- https://smarthr.design/ (トップ、/products/design-tokens/color/、/accessibility/) はネットワーク制限で取得不可。
