---
title: "Lottie and dotLottie"
category: animation
type: library
sources:
  - url: https://github.com/airbnb/lottie-web
    title: "airbnb/lottie-web: Render After Effects animations natively on Web"
  - url: https://github.com/LottieFiles/dotlottie-web
    title: "LottieFiles/dotlottie-web: dotLottie Web player (Rust + WASM, ThorVG)"
  - url: https://registry.npmjs.org/@lottiefiles/dotlottie-react/latest
    title: "npm: @lottiefiles/dotlottie-react latest"
tags: [lottie, dotlottie, illustration, after-effects, bodymovin, wasm, thorvg]
updated: 2026-09-06
---

# Lottie and dotLottie

## 概要

Lottie は After Effects の Bodymovin プラグインで書き出した JSON アニメーションを Web、Android、iOS、React Native で再生する仕組み。`lottie-web` が Airbnb 由来の元祖プレイヤー。dotLottie（`.lottie`）は LottieFiles が定義した圧縮コンテナで、複数アニメーション、テーマ、state machine、アセットを 1 ファイルに束ね、Rust + WASM（ThorVG）で描画する。AwesomeDS ではイラストレーション目的のアニメーション（空状態、オンボーディング、ローディングの装飾）に限って使う。

## 要点

- lottie-web: MIT。`lottie.loadAnimation({ container, renderer: 'svg' | 'canvas' | 'html', loop: boolean | number, autoplay: boolean, path | animationData })`。`path`（JSON の URL）と `animationData`（オブジェクト）は排他。軽量版 `lottie_light` がある。README は JSON とプレイヤーの gzip 配信でサイズを大きく減らせると勧める。
- dotlottie-web: MIT。Rust + WASM の中核が ThorVG で、`.json`（従来 Lottie）と `.lottie` の両方を再生。描画バックエンドは Software（Canvas2D）、WebGL2、WebGPU の 3 つ。`.lottie` 形式は複数アニメーション、テーマ（実行時の色差し替え）、インタラクティブな state machine、音声の埋め込みに対応。
- パッケージ: `@lottiefiles/dotlottie-web`（素の JS）、`@lottiefiles/dotlottie-react`、`@lottiefiles/dotlottie-vue`、`@lottiefiles/dotlottie-svelte`、`@lottiefiles/dotlottie-solid`、`@lottiefiles/dotlottie-wc`（Web Component）。
- React: `@lottiefiles/dotlottie-react` 最新 0.19.16（MIT）、依存 `@lottiefiles/dotlottie-web` 0.80.0。

```jsx
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const App = () => (
  <DotLottieReact src="path/to/animation.lottie" loop autoplay />
);
```

- 使い分け: 既存の After Effects 資産を SVG で正確に出したい、DOM としてスタイルを当てたいなら lottie-web の `svg` レンダラ。ファイルサイズ、複数アニメーションの束ね、テーマ切り替え、Canvas / WebGL 描画が要るなら dotLottie。
- AwesomeDS 第 7 節のライブラリ順序では「Lottie for illustration」と位置づけられ、UI の状態遷移（hover、open、close）には使わない。

## 具体的な値・ルール（あれば）

| 項目 | lottie-web | dotlottie-web / react |
|---|---|---|
| 形式 | `.json` | `.json` と `.lottie` |
| 描画 | svg / canvas / html | Canvas2D / WebGL2 / WebGPU（ThorVG、WASM） |
| ライセンス | MIT | MIT |
| React 版 | 別途ラッパーが必要 | `@lottiefiles/dotlottie-react` 0.19.16 |
| テーマ差し替え | JSON を編集 | `.lottie` のテーマ機能 |
| 複数アニメーション | ファイル複数 | 1 ファイルに束ねる |
| 軽量化 | `lottie_light`、gzip | WASM ロード + 圧縮コンテナ |

AwesomeDS での使用条件。

1. 用途はイラストレーション（空状態、成功画面、オンボーディング）とブランド表現に限る。ボタンやメニューの状態遷移には使わない。
2. `loop` は進捗表示か装飾的な待機画面のみ。第 7 節「Nothing loops forever except a progress indicator」。
3. `prefers-reduced-motion: reduce` では `autoplay` を止め、最終フレームか静止画（ポスター）を表示する。
4. 色は AwesomeDS のトークンに揃える。dotLottie のテーマ機能か、書き出し前に After Effects 側で調整する。
5. 描画サイズを `aspect-ratio` で予約してレイアウトシフトを避ける（第 10 節）。

## AwesomeDS への反映

- 採用: Lottie を「イラストレーション専用」として第 7 節の順序に置く。Motion や CSS で表現できる UI 遷移に Lottie を使うと、トークン（duration、easing）の統一が崩れるため。
- 採用: 新規実装は dotLottie（`@lottiefiles/dotlottie-react`）を優先。理由は単一の React パッケージ、`.lottie` の圧縮、テーマによる色差し替えが AwesomeDS の役割ベースの色運用と相性が良いこと。
- 採用: reduced motion では自動再生を止め静止フレームを出す規則を `components/checklist.md` に追加。
- 変更: lottie-web の `svg` レンダラは、DOM に SVG を展開して CSS で色を当てられる利点があるため、ブランド色の差し替えを CSS 変数で行いたい場合の代替として残す。
- 不採用: ローディングスピナーへの Lottie 利用。AwesomeDS のローディングは skeleton（第 8 節）と CSS のスピナーで統一し、依存を増やさない。
- 不採用: `html` レンダラ。3D 変形が必要な特殊用途向けで、AwesomeDS の対象外。

## 出典

- https://github.com/airbnb/lottie-web : README（loadAnimation のオプション、レンダラ、lottie_light、gzip の推奨、MIT）。取得済み。
- https://github.com/LottieFiles/dotlottie-web : README（`.lottie` 形式、ThorVG、6 パッケージ、React 例、MIT）。取得済み。
- https://registry.npmjs.org/@lottiefiles/dotlottie-react/latest : 0.19.16、依存 dotlottie-web 0.80.0。取得済み。
