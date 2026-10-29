---
title: "Motion (motion/react)"
category: animation
type: library
sources:
  - url: https://github.com/motiondivision/motion
    title: "motiondivision/motion: An open source animation library for JavaScript, React and Vue"
  - url: https://registry.npmjs.org/motion/latest
    title: "npm: motion latest"
  - url: https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/generators/spring.ts
    title: "motion-dom spring.ts (springDefaults)"
  - url: https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/utils/default-transitions.ts
    title: "motion-dom default-transitions.ts"
  - url: https://motion.dev/docs/react
    title: "Motion docs: React (proxy blocked, link recorded)"
tags: [motion, framer-motion, spring, layout, animatepresence, usescroll, usemotionvalue]
updated: 2026-09-06
---

# Motion (motion/react)

## 概要

Motion は Framer Motion を改名した JavaScript / React / Vue 向けアニメーションライブラリ。React では `import { motion } from "motion/react"`、素の JS では `import { animate } from "motion"`。npm 最新は 13.2.0（MIT）で、パッケージ `motion` は同版の `framer-motion` を依存として再エクスポートする。AwesomeDS の第 7 節で CSS transitions の次に使う既定ライブラリ。motion.dev はプロキシで取得できないため、GitHub のソースと npm メタデータを一次資料にした。

## 要点

- インストール: `npm install motion`。peer は react と react-dom の ^18 || ^19（任意）。`framer-motion` パッケージは旧来のエイリアスとして残るが、新規コードは `motion/react` を使う。
- README の主張: 120fps の GPU アクセラレーション、springs、layout transitions、gestures、scroll-linked effects、TypeScript、tree-shaking。330 以上の公式例と 100 以上のチュートリアルは motion.dev にある。
- 既定トランジション（`default-transitions.ts`）: scale 以外の transform 系（x、y、rotate など）は under-damped spring `stiffness: 500, damping: 25`。scale は critically-damped spring `stiffness: 550` で damping は目標値に応じて調整。3 キーフレーム以上は 0.8 秒のキーフレーム遷移。その他の値（opacity、色など）は 0.3 秒で、ブラウザ既定 ease より少し浅いイージング。
- spring の既定（`spring.ts` の `springDefaults`）: `stiffness 100`、`damping 10`、`mass 1.0`、`velocity 0.0`、`duration 800`（ms）、`bounce 0.3`、`visualDuration 0.3`（秒）、`restSpeed` は granular 0.01 / default 2、`restDelta` は granular 0.005 / default 0.5。
- duration / bounce 指定の変換: `dampingRatio = 1 - bounce`（0.05 から 1 にクランプ）。`visualDuration` があれば `stiffness = (2π / (visualDuration × 1.2))²`、`damping = 2 × clamp(0.05, 1, 1 - bounce) × √stiffness`。それ以外は `findSpring()` で数値解を求める。
- 主な API（taste-skill が使い方を規定しているもの）: `useMotionValue` / `useTransform` は React の再レンダーを経由せずに値を更新するので、マグネティックやポインタ追従はこれで書き `useState` を使わない。`useScroll()` は `scrollYProgress` を返し、`window.addEventListener("scroll")` の代替。`layout` と `layoutId` は並び替えやモーダル展開など見える状態変化に限って使い、静的な内容に「念のため」付けない。`staggerChildren` は親の `variants` と子が同じ Client Component ツリーにある必要がある。`useReducedMotion()` で静的にフォールバックする。
- `AnimatePresence` は exit アニメーションを担う（要素の `key` が必須）。motion.dev の該当ページは未取得のため、`mode` の各値の挙動は本エントリでは断定しない。
- Next.js: Motion を使うコンポーネントは `'use client'` の葉に隔離する（taste-skill §3.A）。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| バージョン | motion 13.2.0（依存 framer-motion ^13.2.0、tslib ^2.4.0） |
| import | `import { motion, AnimatePresence, useScroll, useMotionValue, useTransform, useReducedMotion } from "motion/react"` |
| transform の既定 spring | stiffness 500、damping 25 |
| scale の既定 spring | stiffness 550、critically damped |
| 非 transform の既定 | 0.3s tween |
| `type: "spring"` 明示時の既定 | stiffness 100、damping 10、mass 1 |
| visualDuration 既定 | 0.3s、bounce 0.3 |

AwesomeDS 用の spring 指定（`AwesomeDS/DESIGN.md` motion 節）。

```tsx
// gestures and drags
transition={{ type: "spring", stiffness: 400, damping: 30 }}   // spring-snappy
transition={{ type: "spring", stiffness: 170, damping: 26 }}   // spring-gentle
// enter / exit
transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}        // duration-base, ease-out
```

## AwesomeDS への反映

- 採用: Motion を「CSS transitions の次」の既定ライブラリにする（第 7 節）。理由は shadcn / React 環境での普及、`useReducedMotion` の組み込み、`useScroll` により scroll リスナーを書かずに済むこと。
- 採用: ジェスチャとドラッグには spring（第 7 節「Gestures and drags use springs (Motion type: "spring", stiffness: 400, damping: 30)」）。`spring-snappy` 400/30 と `spring-gentle` 170/26 の 2 つに固定し、Motion の既定（100/10）は使わない。既定はバウンスが強く、第 1 節「calm, precise」に合わないため。
- 採用: enter / exit は tween で `cubic-bezier(0.16, 1, 0.3, 1)`、100 から 300ms。Motion の transform 既定 spring（500/25）は使わない。理由は enter で跳ねを出さないため。
- 採用: `useMotionValue` / `useTransform` で React state を経由しない、`useScroll()` を使い `window.scrollY` を state に入れない、`layout` は見える状態変化のみ、Motion コンポーネントは `'use client'` の葉に隔離。これらは `components/checklist.md` の項目にする。
- 採用: `useReducedMotion()` が真なら transform を止め opacity のみ残す（第 7 節、第 11 節）。
- 変更: `AnimatePresence` の exit は enter より短く `ease-in`（第 7 節「Exit faster than enter and with ease-in」）。Motion の既定は enter と exit が同じ設定なので、必ず `exit` 側に別の transition を書く。
- 不採用: `framer-motion` パッケージ名での import。新規コードは `motion/react` に統一する。
- 記録: motion.dev の API ドキュメント（transitions、AnimatePresence の `mode`、layout の注意）は未取得。ソースコードで確認できた既定値のみ記載した。

## 出典

- https://github.com/motiondivision/motion : README（インストール、import パス、機能、MIT、改名の経緯）。取得済み。
- https://registry.npmjs.org/motion/latest : 13.2.0、依存、peer。取得済み。
- https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/generators/spring.ts : springDefaults と変換式。取得済み。
- https://raw.githubusercontent.com/motiondivision/motion/main/packages/motion-dom/src/animation/utils/default-transitions.ts : 値の種類ごとの既定トランジション。取得済み。
- https://motion.dev/docs/react : 公式ドキュメント。プロキシで取得不可、リンクのみ記録。
