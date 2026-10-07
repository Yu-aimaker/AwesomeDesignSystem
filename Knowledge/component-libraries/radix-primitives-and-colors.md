---
title: "Radix Primitives and Radix Colors"
category: component-libraries
type: library
sources:
  - url: https://www.radix-ui.com/primitives
    title: "Radix Primitives"
  - url: https://raw.githubusercontent.com/radix-ui/website/main/data/primitives/docs/overview/introduction.mdx
    title: "Radix Primitives: Introduction (source of radix-ui.com, which is proxy blocked)"
  - url: https://raw.githubusercontent.com/radix-ui/website/main/data/primitives/docs/overview/accessibility.mdx
    title: "Radix Primitives: Accessibility"
  - url: https://raw.githubusercontent.com/radix-ui/website/main/data/colors/docs/palette-composition/understanding-the-scale.mdx
    title: "Radix Colors: Understanding the scale"
  - url: https://github.com/radix-ui/colors
    title: "radix-ui/colors: A gorgeous, accessible color system"
  - url: https://raw.githubusercontent.com/radix-ui/colors/main/src/light.ts
    title: "radix-ui/colors src/light.ts (scale values)"
  - url: https://registry.npmjs.org/radix-ui/latest
    title: "npm: radix-ui (unified package) latest"
tags: [radix, primitives, accessibility, wai-aria, colors, 12-step-scale, aschild]
updated: 2026-10-07
---

# Radix Primitives and Radix Colors

## 概要

Radix Primitives は WAI-ARIA の設計パターンを実装した unstyled な React コンポーネント群で、shadcn/ui の既定の土台。Radix Colors は 1 から 12 の段階に用途を固定した色スケールで、light、dark、alpha、P3 の変種を持つ。どちらも WorkOS が支援する MIT ライセンス。radix-ui.com はプロキシで取得できないため、同サイトのソースである `radix-ui/website` リポジトリの mdx を読んだ。

## 要点

- Primitives の動機: アコーディオン、チェックボックス、ダイアログなどのパターンは WAI-ARIA に文書化されているが、Web プラットフォームの実装は不十分。資金のある OSS として、誰でもアクセシブルなデザインシステムを作れる土台を提供する。
- 6 つの特徴: Accessible（aria と role 属性、フォーカス管理、キーボード操作を処理）、Unstyled（スタイルは任意の方法で）、Opened（各パーツに直接アクセスして event listener、props、ref を足せる）、Uncontrolled / Controlled（既定は非制御、制御も可能）、Developer Experience（型付き API、一貫したインターフェース、要素を差し替える `asChild`）、Incremental Adoption（単一パッケージか個別パッケージ、tree-shaking）。
- インストール: `npm install radix-ui`。統合パッケージの最新は 1.6.7 で、43 の `@radix-ui/react-*`（dialog、dropdown-menu、popover、tooltip、tabs、select、slider、switch、toast、navigation-menu、scroll-area、focus-scope、roving-focus、dismissable-layer、one-time-password-field、password-toggle-field など）を束ねる。
- アクセシビリティモデル: WAI-ARIA authoring practices に従う。非ネイティブ要素に role と aria を付与。Tabs や Dialog のようなコンポーネントはユーザーが期待するキーボード操作を持つ。フォーカスは操作に応じて移動し、AlertDialog は Cancel ボタンにプログラム的にフォーカスを移して応答を促す。Label primitive は複数のコントロールで使えるが、ラベル文言を用意するのは開発者の責任。主要ブラウザと支援技術でテスト済み。
- Colors: `npm install @radix-ui/colors`。31 のスケール（gray、mauve、slate、sage、olive、sand、tomato、red、ruby、crimson、pink、plum、purple、violet、iris、indigo、blue、cyan、teal、jade、green、grass、brown、bronze、gold、sky、mint、lime、yellow、amber、orange）に加えて blackA と whiteA。各スケールは light、dark、alpha（A）、P3 を持ち、CSS として import できる。
- 12 段階の意味: 1-2 背景（アプリ背景、控えめなコンポーネント背景、縞テーブル、コードブロック、カード、サイドバー）、3-5 コンポーネント背景（3 通常、4 hover、5 pressed / selected。透明が既定なら 3 を hover に使ってよい）、6-8 境界（6 非インタラクティブ要素の控えめな枠、7 インタラクティブ要素の控えめな枠、8 強い枠とフォーカスリング）、9-10 ソリッド背景（9 は白も黒も最も混ざらない純度の高い段で、Web 背景、ヘッダー、グラフィック、オーバーレイに。10 は 9 が通常時のときの hover）、11-12 テキスト（11 低コントラスト、12 高コントラスト）。
- コントラスト保証: 11 と 12 は同じスケールの step 2 の上で APCA Lc 60 と Lc 90 を保証。step 9 の多くは白文字と組むが、Sky、Mint、Lime、Yellow、Amber は暗い文字が必要。

## 具体的な値・ルール（あれば）

gray（light）の 12 値。

| step | hex | 用途 |
|---|---|---|
| 1 | `#fcfcfc` | アプリ背景 |
| 2 | `#f9f9f9` | 控えめな背景 |
| 3 | `#f0f0f0` | コンポーネント背景 |
| 4 | `#e8e8e8` | hover |
| 5 | `#e0e0e0` | active / selected |
| 6 | `#d9d9d9` | 控えめな枠 |
| 7 | `#cecece` | インタラクティブ要素の枠 |
| 8 | `#bbbbbb` | 強い枠、フォーカスリング |
| 9 | `#8d8d8d` | ソリッド背景 |
| 10 | `#838383` | ソリッド hover |
| 11 | `#646464` | 低コントラスト文字 |
| 12 | `#202020` | 高コントラスト文字 |

## AwesomeDS への反映

- 採用: Radix Primitives を shadcn/ui 経由の既定 primitive にする（第 8 節）。フォーカス管理とキーボード操作を自作しないことが第 11 節「Keyboard: everything reachable by Tab, dismissible by Escape」の担保になる。
- 採用: 「境界は文字より薄く、文字は 2 段」というスケールの考え方。AwesomeDS の hairline `#e5e5e5`（step 6 相当）、hairline-strong `#d4d4d4`（step 7 相当）、ink-muted `#737373`（step 11 相当）、ink `#0a0a0a`（step 12 相当）は、Radix の用途区分を 4 段に圧縮したもの。
- 採用: 「hover は 1 段濃く、pressed はさらに 1 段」の規則を `components/README.md` の状態設計に使う。surface `#ffffff` → surface-sunken `#f5f5f5` を hover / selected の背景にする。
- 採用: フォーカスリングは step 8 相当の「強い枠」とする発想。ただし AwesomeDS は色を accent に固定した（第 11 節）。
- 変更: 12 段のフルスケールは持たない。AwesomeDS は役割名（canvas、surface、hairline、ink）で 4 から 5 段に絞り、`ds-creator` でブランド色を足すときに Radix Colors のスケールを参照して 9（solid）と 11（text）を選ぶ手順にする。
- 変更: 「step 9 に白文字」を AwesomeDS では検証必須にした。accent `#2f5bea` は白文字で 4.5:1 を超えるが、ブランド色が Sky / Mint / Lime / Yellow / Amber 系なら on-accent を ink にする分岐を `ds-creator` に入れる。
- 不採用: APCA。AwesomeDS は WCAG 2.2 AA の比率（4.5:1、3:1）で検査する（第 2 節 Rule 4、第 11 節）。ツールチェーン（axe-core）が WCAG 基準のため。
- 不採用: `asChild` を AwesomeDS 側の API 規約にすること。Base UI は `render` prop を使うので、AwesomeDS のコンポーネント仕様は両方を許容する書き方にする（Knowledge/component-libraries/base-ui.md）。

## 出典

- https://www.radix-ui.com/primitives (取得日 2026-10-07): og:title「Radix Primitives」、og:image 3025x1700 PNG。トップ radix-ui.com には twitter:image のみで og:image なし。
- https://raw.githubusercontent.com/radix-ui/website/main/data/primitives/docs/overview/introduction.mdx : 動機と 6 特徴、`npm install radix-ui`。取得済み。
- https://raw.githubusercontent.com/radix-ui/website/main/data/primitives/docs/overview/accessibility.mdx : WAI-ARIA、フォーカス管理、Label。取得済み。
- https://raw.githubusercontent.com/radix-ui/website/main/data/colors/docs/palette-composition/understanding-the-scale.mdx : 12 段の用途、APCA 保証、暗い文字が必要なスケール。取得済み。
- https://github.com/radix-ui/colors : README（インストール、変種、MIT、WorkOS）。取得済み。
- https://raw.githubusercontent.com/radix-ui/colors/main/src/light.ts : スケール名一覧と gray の 12 値。取得済み。
- https://registry.npmjs.org/radix-ui/latest : 統合パッケージ 1.6.7 と依存 43 件。取得済み。
