---
title: "three.js, react-three-fiber and drei"
category: animation
type: library
sources:
  - url: https://registry.npmjs.org/three/latest
    title: "npm: three latest"
  - url: https://registry.npmjs.org/@react-three/fiber/latest
    title: "npm: @react-three/fiber latest"
  - url: https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/getting-started/introduction.mdx
    title: "R3F docs: Introduction (source of r3f.docs.pmnd.rs, which is proxy blocked)"
  - url: https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/advanced/scaling-performance.mdx
    title: "R3F docs: Scaling performance"
  - url: https://github.com/pmndrs/drei
    title: "pmndrs/drei: useful helpers for react-three-fiber"
tags: [three, r3f, drei, webgl, 3d, performance, reduced-motion, frameloop]
updated: 2026-09-06
---

# three.js, react-three-fiber and drei

## 概要

three.js は JavaScript の 3D ライブラリ（npm `three` 0.185.1、MIT）。`@react-three/fiber`（R3F、9.7.0、MIT）は three.js の React レンダラで、`<mesh />` が `new THREE.Mesh()` に対応する宣言的モデルを提供する。`@react-three/drei` はカメラ、コントロール、ローダー、性能ヘルパーの集まり。AwesomeDS では「製品そのものが 3D であるとき」に限って使い、装飾的な 3D 背景には使わない。

## 要点

- バージョン: `three` 0.185.1。`@react-three/fiber` 9.7.0 の peer は react >=19 <19.3、three >=0.156、react-dom は任意。R3F 8 は React 18、R3F 9 は React 19 に対応。
- インストール: `npm install three @types/three @react-three/fiber`。drei は `npm install @react-three/drei`。
- 宣言的モデル: シーンを JSX で書き、React の状態に反応する。R3F は React の描画フローの外でレンダリングするため「オーバーヘッドなし」で、スケジューリングにより規模が大きいほど素の three.js より有利と説明される。
- エコシステム: `@react-three/drei`（ヘルパー）、`@react-three/postprocessing`、物理（Rapier、Cannon）、アニメーション（react-spring、framer-motion）、状態（zustand、jotai）、XR、アクセシビリティ、シェーダー合成。
- 性能ガイド（scaling-performance）: `frameloop="demand"` で必要なときだけ描画し、カメラコントロールなど React 外で props が変わる場合は `invalidate()` を呼ぶ。geometry と material はグローバルに作って共有する。`useLoader` はアセットをキャッシュする。繰り返しのオブジェクトは `InstancedMesh` で 1 回の draw call にまとめる（個別 mesh は 1000 程度が上限、instancing なら数十万）。距離に応じて drei の `<Detailed />`（LOD）で低解像度モデルに切り替える。`PerformanceMonitor` でフレームレートを監視し `performance.regress()` で操作中は一時的に解像度を落とす。React 18 の `startTransition` で重い計算を分散する。`THREE.ColorManagement.enabled = true`。
- drei の主なカテゴリ: Cameras（PerspectiveCamera、OrthographicCamera、CubeCamera）、Controls（CameraControls、ScrollControls、KeyboardControls、PresentationControls）、Abstractions（Image、Text、Text3D、Billboard、Effects、Audio）、Shaders（MeshReflectorMaterial、MeshDistortMaterial、MeshTransmissionMaterial、SoftShadows）、Staging（Environment、ContactShadows、AccumulativeShadows、Sky、Cloud、Stage）、Loaders（GLTF、FBX、Texture、Font、Video、CubeTexture）、Performance（Instances、Merged、Points、Detailed、Bvh、PerformanceMonitor、AdaptiveDpr）。
- taste-skill §10: Three.js / WebGL は canvas 背景と 3D シーン用。専用の葉コンポーネントに隔離し、Motion と同じツリーで混ぜない。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| three | 0.185.1、MIT |
| @react-three/fiber | 9.7.0、MIT、react >=19 <19.3、three >=0.156 |
| @react-three/drei | MIT |
| 描画ループ | `<Canvas frameloop="demand">` + `invalidate()` |
| draw call の目安 | 個別 mesh 約 1000 まで、それ以上は `InstancedMesh` |
| 解像度制御 | `dpr={[1, 2]}` と `<AdaptiveDpr />`、`PerformanceMonitor` |
| 色管理 | `THREE.ColorManagement.enabled = true` |

AwesomeDS での使用条件。

1. 製品の中心が 3D（プロダクトビューア、地図、データの 3D 可視化、ゲーム）であること。装飾背景（浮遊する球、パーティクル、グロー）には使わない。
2. `'use client'` の葉に隔離し、`<Canvas>` は `frameloop="demand"` を既定にする。常時描画はインタラクション中のみ。
3. `prefers-reduced-motion: reduce` では自動回転やカメラアニメーションを止め、静止したシーンかフォールバック画像を出す。`useReducedMotion()` か `matchMedia` で判定する。
4. WebGL 非対応や低性能端末には `<Suspense fallback>` と静止画の代替を必ず用意する。
5. 初期表示は skeleton か画像で埋め、Canvas の高さを `aspect-ratio` で予約する（第 10 節のレイアウトシフト対策）。
6. Motion と同じツリーで混ぜない。3D 内のアニメーションは R3F の `useFrame` か react-spring 系で完結させる。

## AwesomeDS への反映

- 採用: 第 7 節「three.js (via react-three-fiber) only when the product is 3D」。順序の最後尾に置き、装飾目的を明示的に除外した。第 1 節「no decorative blobs」と第 9 節の禁止項目に 3D 背景が該当するため。
- 採用: `frameloop="demand"` を既定にし、`invalidate()` で描き直す方針。バッテリーとメインスレッドを守り、第 1 節「unhurried」に沿う。
- 採用: reduced motion で自動回転とカメラ移動を止める規則を `components/checklist.md` に追加。R3F 自体は reduced motion を扱わないので、アプリ側で `useReducedMotion()` を読んで `autoRotate` などを切る。
- 採用: `Suspense` fallback と静止画の代替を必須にする。3D は読み込みが重く、AwesomeDS 第 8 節の loading / empty / error 状態の規則に 3D も従わせる。
- 変更: drei の Shaders（MeshTransmissionMaterial、MeshDistortMaterial）や Staging（Cloud、Sky）は演出寄りなので、製品要件（材質の再現など）がある場合のみ使う。
- 不採用: ヒーローの WebGL 背景。taste-skill は canvas 背景を用途に含めるが、AwesomeDS は「content-first」を理由に採用しない。
- 記録: r3f.docs.pmnd.rs はプロキシで取得不可。GitHub 上の同じ mdx を読んだ。

## 出典

- https://registry.npmjs.org/three/latest : 0.185.1、MIT。取得済み。
- https://registry.npmjs.org/@react-three/fiber/latest : 9.7.0、peer 依存。取得済み。
- https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/getting-started/introduction.mdx : 概要、インストール、宣言的モデル、エコシステム、React 版対応。取得済み。
- https://raw.githubusercontent.com/pmndrs/react-three-fiber/master/docs/advanced/scaling-performance.mdx : on-demand rendering、instancing、LOD、PerformanceMonitor、startTransition、色管理。取得済み。
- https://github.com/pmndrs/drei : README（ヘルパーのカテゴリ、インストール、MIT）。取得済み。
