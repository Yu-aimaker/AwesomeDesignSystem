---
title: "Rive state machines"
category: animation
type: product
sources:
  - url: https://github.com/rive-app/rive-react
    title: "rive-app/rive-react: React runtime for Rive"
  - url: https://github.com/rive-app/rive-wasm
    title: "rive-app/rive-wasm: Web (JS/WASM) runtime for Rive"
  - url: https://github.com/rive-app/rive-docs
    title: "rive-app/rive-docs: source of rive.app/docs"
  - url: https://raw.githubusercontent.com/rive-app/rive-docs/main/editor/state-machine/state-machine.mdx
    title: "Rive docs: State Machine (editor)"
  - url: https://raw.githubusercontent.com/rive-app/rive-docs/main/runtimes/inputs.mdx
    title: "Rive docs: Inputs (runtimes, marked deprecated in favor of Data Binding)"
  - url: https://raw.githubusercontent.com/rive-app/rive-docs/main/runtimes/data-binding.mdx
    title: "Rive docs: Data Binding (runtimes)"
  - url: https://rive.app/docs/editor/state-machine/state-machine
    title: "rive.app docs: State Machine (proxy blocked, link recorded)"
tags: [rive, state-machine, inputs, data-binding, interactive, wasm, react]
updated: 2026-09-06
---

# Rive state machines

## 概要

Rive はインタラクティブなアニメーションのエディタとランタイム。エディタで作った State Machine（状態と遷移のグラフ）を、Web（JS / WASM）、React、React Native、Flutter、Apple、Android、Unity の各ランタイムが再生し、アプリ側は Inputs（boolean、number、trigger）または Data Binding（View Model）で状態を操作する。AwesomeDS では、Lottie では表現できない「ユーザー操作に反応するイラスト」（トグル、キャラクター、インタラクティブなオンボーディング）に限って候補にする。rive.app はプロキシで取得できないため、ドキュメントのソースリポジトリと各ランタイムの README を読んだ。

## 要点

- State Machine の構成（editor docs）: Graph、States、Transitions、Layers。State はタイムラインアニメーション（例: ボタンの Idle、Hovered、Clicked）。Transition は状態をつなぎ、State Machine が通る論理的な経路を作る。デザイナーとエンジニアが複雑な引き渡しなしに協業するための仕組み。
- Inputs: boolean、number、trigger の 3 種。Web / React では `stateMachineInputs` で取得し `.value` を書く。trigger は `.fire()`。React には `useStateMachineInput` フックがある。ドキュメントはこのページを「Data Binding を優先するため非推奨」と注記している。
- Data Binding: View Model を介してアプリコードと Rive ファイル内の要素を実行時に接続する。テキスト、数値、boolean をエディタで公開し、アプリから読み書きする。各ランタイムに専用 API がある。
- Web ランタイム（rive-wasm）: パッケージは canvas、WebGL、WebGL2、canvas-lite の変種。`new Rive({ src, canvas, stateMachines, autoplay, layout: new Layout({ fit, alignment }) })`。イベントは `EventType.RiveEvent` のリスナーで受ける。MIT。
- React ランタイム（rive-react）: `@rive-app/react-canvas`（`react-webgl` 変種あり）。`useRive` フックで `RiveComponent` と `rive` インスタンスを得て、`useStateMachineInput(rive, stateMachineName, inputName)` で入力を操作する。layout / fit オプションで拡縮と配置を制御。React 16.8.0 から 19.0.0 に対応。MIT。
- ドキュメントリポジトリ `rive-app/rive-docs` は Mintlify 製で、`runtimes/`（state-machines.mdx、inputs.mdx、data-binding.mdx、animation-playback.mdx、artboards.mdx、layout.mdx、text.mdx、fonts.mdx、loading-assets.mdx、rive-events.mdx、runtime-sizes.mdx、web/、react/ など）を持つ。
- Lottie との違い: Lottie は再生専用（ループ、フレーム移動）。Rive は状態遷移と入力を持つため、hover や toggle のような UI 状態にイラストを結びつけられる。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| Web パッケージ | `@rive-app/canvas`、`@rive-app/webgl`、`@rive-app/webgl2`、`@rive-app/canvas-lite` |
| React パッケージ | `@rive-app/react-canvas`、`@rive-app/react-webgl` |
| 入力型 | boolean（`.value = true`）、number（`.value = 42`）、trigger（`.fire()`） |
| React フック | `useRive({ src, stateMachines, autoplay })`、`useStateMachineInput(rive, "SM", "hover")` |
| イベント | `rive.on(EventType.RiveEvent, handler)` |
| 配置 | `Layout({ fit: Fit.Contain, alignment: Alignment.Center })` |
| 推奨 API | Data Binding（Inputs は非推奨扱い） |

React の最小例（README の API から構成）。

```tsx
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export function Toggle() {
  const { rive, RiveComponent } = useRive({ src: "/toggle.riv", stateMachines: "SM", autoplay: true });
  const on = useStateMachineInput(rive, "SM", "on");
  return <RiveComponent onClick={() => { if (on) on.value = !on.value; }} style={{ width: 48, height: 24 }} />;
}
```

## AwesomeDS への反映

- 位置づけ: 任意。第 7 節のライブラリ順序には入れていない。Lottie（イラストレーション）と同じ層で、「操作に反応する必要があるイラスト」のときだけ Lottie の代わりに選ぶ。
- 採用: 状態を持つイラストは Rive、再生だけなら dotLottie という使い分けを Knowledge/animation/lottie-and-dotlottie.md と対で記録する。
- 採用: Data Binding を優先し Inputs は既存資産の互換用途に限る（ドキュメントの非推奨注記に従う）。
- 条件: `prefers-reduced-motion: reduce` では `autoplay: false` にして初期状態の静止フレームを出す。WASM の読み込み中は `aspect-ratio` で領域を予約し、失敗時は静止画に落とす（第 8 節、第 10 節）。
- 条件: UI コンポーネント本体（Switch、Checkbox、Button）は shadcn の実装を使い、Rive はその上に載る装飾か、独立したイラストに限る。フォーカスリング、キーボード操作、aria は shadcn 側に残す（第 11 節）。
- 不採用: ナビゲーションや状態表示を Rive だけで作ること。色がトークンと連動しない、テキストが DOM に存在しない、支援技術から見えないため。
- 記録: rive.app のドキュメント本文は未取得。ソースリポジトリの mdx はランディング的な内容が多く、Web / React 固有の詳細ページ（`runtimes/web/`、`runtimes/react/`）は今回読めていない。

## 出典

- https://github.com/rive-app/rive-react : README（パッケージ変種、useRive、useStateMachineInput、RiveComponent、layout、React 対応版、MIT）。取得済み。
- https://github.com/rive-app/rive-wasm : README（変種、コンストラクタ、入力 API、イベント、MIT）。取得済み。
- https://github.com/rive-app/rive-docs : ドキュメントのソース。`runtimes/` の一覧を取得済み。
- https://raw.githubusercontent.com/rive-app/rive-docs/main/editor/state-machine/state-machine.mdx : Graph、States、Transitions、Layers。取得済み。
- https://raw.githubusercontent.com/rive-app/rive-docs/main/runtimes/inputs.mdx : 3 つの入力型と非推奨注記。取得済み。
- https://raw.githubusercontent.com/rive-app/rive-docs/main/runtimes/data-binding.mdx : View Model と対応ランタイム。取得済み。
- https://rive.app/docs/editor/state-machine/state-machine : 公式ページ。プロキシで取得不可、リンクのみ記録。
