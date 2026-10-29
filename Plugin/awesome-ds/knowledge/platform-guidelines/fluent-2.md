---
title: "Fluent 2 Design System"
category: platform-guidelines
type: guideline
sources:
  - url: https://fluent2.microsoft.design/
    title: "Fluent 2 Design System"
  - url: https://github.com/microsoft/fluentui
    title: "microsoft/fluentui: Fluent UI web (React v9, v8, Web Components)"
  - url: https://registry.npmjs.org/@fluentui/react-components/latest
    title: "npm: @fluentui/react-components latest"
  - url: https://react.fluentui.dev/
    title: "Fluent UI React v9 documentation"
tags: [fluent, microsoft, design-system, react, web-components, tokens, accessibility]
updated: 2026-10-07
---

# Fluent 2 Design System

## 概要

Fluent 2 は Microsoft のデザインシステムで、サイト fluent2.microsoft.design が公式ハブである。実装は microsoft/fluentui モノレポにあり、これから作る向けの React Components (v9)、広く使われている React (v8)、Edge が使う Web Components の 3 系統が並ぶ。v9 は Microsoft 365、v8 は Office が利用する。ライセンスは MIT。フォントとアイコンは別の assets license が適用される。

## 要点

- 公式サイトの og:title は「Fluent 2 Design System」。og:image は CDN 上の 1200x630 PNG。
- React v9 パッケージは `@fluentui/react-components`。npm 最新は 9.74.9 (2026-10-07 取得)、homepage は fluentui README。
- v8 は `@fluentui/react`、Web Components は `@fluentui/web-components`。v9 と v8 / v0 の混在は段階移行のために許容される。
- ドキュメント: v9 は https://react.fluentui.dev/ 、v8 は aka.ms/fluentui-react。
- Fluent UI React Northstar は v9 に置き換わり、2025-07 に End Of Life。
- README は v9 を「Accessible by default」と位置づけ、Griffel によるスタイリング、スロット API、テーマを Insights シリーズで説明する。

## 具体的な値・ルール

| 項目 | 値 |
|---|---|
| 公式サイト | https://fluent2.microsoft.design/ |
| v9 npm | `@fluentui/react-components` 9.74.9 |
| ライセンス (コード) | MIT |
| アセット | aka.ms/fluentui-assets-license |

## AwesomeDS への反映

- 反映不要: AwesomeDS は単一の Web 既定であり、Fluent の 3 系統や Microsoft 365 向けトークンを取り込まない。`foundations/stack.md` は Brief が Fluent を指名したとき公式パッケージを使うと既に書いている。
- 記録: アクセシブル既定とテーマ分離は DESIGN.md の「状態を CSS 変数で」「キーボード操作」と方向が一致する。

## 出典

1. https://fluent2.microsoft.design/ (取得日 2026-10-07)。title / og:title「Fluent 2 Design System」、og:image 1200x630。
2. https://github.com/microsoft/fluentui README (取得日 2026-10-07)。3 系統の表、利用者、MIT、assets license、Northstar EOL。
3. https://registry.npmjs.org/@fluentui/react-components/latest (取得日 2026-10-07)。version 9.74.9、MIT。
