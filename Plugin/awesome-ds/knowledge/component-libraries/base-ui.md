---
title: "Base UI (@base-ui/react)"
category: component-libraries
type: library
sources:
  - url: https://base-ui.com/
    title: "Unstyled UI components for accessible design systems · Base UI"
  - url: https://github.com/mui/base-ui
    title: "mui/base-ui: unstyled UI components for building accessible web apps"
  - url: https://raw.githubusercontent.com/mui/base-ui/master/docs/src/app/(docs)/react/overview/quick-start/page.mdx
    title: "Base UI docs: Quick start (source of base-ui.com, which is proxy blocked)"
  - url: https://raw.githubusercontent.com/mui/base-ui/master/docs/src/app/(docs)/react/handbook/composition/page.mdx
    title: "Base UI docs: Composition (render prop)"
  - url: https://registry.npmjs.org/@base-ui/react/latest
    title: "npm: @base-ui/react latest"
  - url: https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/changelog/2026-01-base-ui.mdx
    title: "shadcn/ui changelog: Base UI support"
  - url: https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/base-ui.mdx
    title: "assistant-ui docs: Radix UI and Base UI"
tags: [base-ui, mui, unstyled, render-prop, shadcn, accessibility, headless]
updated: 2026-10-07
---

# Base UI (@base-ui/react)

## 概要

Base UI は MUI チームが開発する unstyled（headless）な React コンポーネント群。Radix、Floating UI、Material UI を作った人たち（Colm Tuite、Marija Najdova、Flavien Delangle、James Nelson、Jenna Smith、Michał Dudak、Aarón García）が中核。要素の差し替えは `asChild` ではなく `render` prop で行う。2026-01-20 から shadcn/ui が Radix と並ぶ選択肢として正式対応し、AwesomeDS では「accepted alternative」の位置づけ。

## 要点

- パッケージ: `npm install @base-ui/react`。最新 1.8.0、MIT。全コンポーネントが 1 パッケージに入り tree-shakable。peer は react と react-dom の ^17 || ^18 || ^19。日付系コンポーネント用に `date-fns` ^4 と `@date-fns/tz` が任意 peer。
- ポータルの前提: ルート要素に `isolation: isolate` を与えて独立した stacking context を作る（`.root { isolation: isolate; }`）。ポータルで出るポップアップがページ内容の上に来るようにするため。iOS 26 以降の Safari では `body` に `position: relative` を足すとスクロール時の backdrop が正しく描かれる。
- スタイリング: 完全に unstyled。`className` と `data-*` 属性（状態を表す）で CSS Modules、Tailwind、CSS-in-JS のどれでも使える。ドキュメントの Popover 例は Tailwind と CSS Modules の両方で示される。
- Composition: `render` prop に React 要素を渡すと、その要素が描画対象になる（`<Menu.Trigger render={<MyButton size="md" />}>`）。カスタム要素は `ref` を forward し、受け取った props を DOM に spread する必要がある。
- `render` の関数形: `render={(props, state) => <span {...props}>{state.checked ? <CheckedIcon /> : <UncheckedIcon />}</span>}`。`props` は DOM に spread する属性、`state` はコンポーネント状態。props の spread を完全に制御でき、状態で内容を切り替えられる。render prop は入れ子にできる（Dialog、Tooltip、Menu とカスタムボタンの組み合わせ）。
- shadcn/ui との関係: `npx shadcn create` で Radix か Base UI を選ぶ。コンポーネント API は同一で「Only the underlying implementation changes」。全例が両方で再構築されている。
- assistant-ui の扱い: registry の style 名が `base-` で始まる（例 `base-nova`）と Base UI 版が配られ、それ以外は Radix 版。assistant-ui の headless primitive は Radix の `asChild` と Base UI の `render` の両方を受け付ける。tooltip、modal、selection 系は Base UI 専用の実装を持つ。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| パッケージ | `@base-ui/react` 1.8.0 |
| 要素差し替え | `render={<a />}` または `render={(props, state) => ...}` |
| 状態のスタイル | `data-*` 属性（例 `data-checked`、`data-open`） |
| 必須 CSS | `.root { isolation: isolate; }` |
| iOS 26 Safari | `body { position: relative; }` |
| shadcn の選択 | `npx shadcn create` の初期化時。以後変更不可（components.json の style と同様に固定） |
| assistant-ui の切り替え | style 名の `base-` 接頭辞 |

Radix との対応。

| 概念 | Radix | Base UI |
|---|---|---|
| 要素の差し替え | `asChild` + Slot | `render` prop |
| 状態属性 | `data-state="open"` など | `data-open` など個別属性 |
| パッケージ | `radix-ui`（43 パッケージの束） | `@base-ui/react`（単一） |
| 位置計算 | `@radix-ui/react-popper`（Floating UI） | 内蔵（Floating UI の作者が開発） |

## AwesomeDS への反映

- 採用: Base UI を「accepted alternative」として第 8 節に明記。shadcn 経由で選べば API が同一なので、AwesomeDS のトークンとコンポーネント仕様（`components/README.md`）はどちらでも変わらない。
- 採用: `isolation: isolate` をアプリのルートに入れる規則を `components/checklist.md` に追加する。Radix でも害はなく、Base UI では必須。
- 採用: 状態スタイルを `data-*` 属性セレクタで書く方針。Radix は `data-state`、Base UI は `data-open` などで名前が違うため、AwesomeDS の CSS では両方のセレクタを併記するか、shadcn の生成物に任せて自前 CSS では触らない。
- 変更: AwesomeDS のコンポーネント仕様は「`asChild` を使う」と書かず、「トリガー要素は差し替え可能であること」と抽象化する。実装は Radix なら `asChild`、Base UI なら `render`。
- 不採用: Base UI を既定にすること。理由は、shadcn の既定が Radix であること、Base UI 専用実装が必要なコンポーネント（tooltip、modal、selection）が周辺ライブラリに残ること、`isolation: isolate` などの前提 CSS が追加で必要なこと。既定は Radix、明示的に選んだ場合のみ Base UI。
- 記録: `ds-creator` の質問項目「Radix か Base UI か」は推奨回答を Radix とし、Base UI を選ぶ条件（既存プロジェクトが Base UI、`render` 関数形で状態依存の描画が必要、単一パッケージを好む）を提示する。

## 出典

- https://base-ui.com/ (取得日 2026-10-07): og:title「Unstyled UI components for accessible design systems · Base UI」、og:image 1200x630。
- https://github.com/mui/base-ui : README（保守者、位置づけ、MIT、10.8k stars）。取得済み。
- https://raw.githubusercontent.com/mui/base-ui/master/docs/src/app/(docs)/react/overview/quick-start/page.mdx : インストール、isolation、スタイリング、Popover 例、iOS 26 の注記。取得済み。base-ui.com 本体はプロキシで取得不可。
- https://raw.githubusercontent.com/mui/base-ui/master/docs/src/app/(docs)/react/handbook/composition/page.mdx : render prop の要素形と関数形、入れ子。取得済み。
- https://registry.npmjs.org/@base-ui/react/latest : 1.8.0、peer 依存。取得済み。
- https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/v4/content/docs/changelog/2026-01-base-ui.mdx : shadcn 側の対応告知（2026-01-20）。取得済み。
- https://raw.githubusercontent.com/assistant-ui/assistant-ui/main/apps/docs/content/docs/(getting-started)/base-ui.mdx : `base-` 接頭辞と両 API 受け付けの説明。取得済み。
