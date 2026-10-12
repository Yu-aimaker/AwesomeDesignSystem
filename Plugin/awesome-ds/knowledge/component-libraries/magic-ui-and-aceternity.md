---
title: "Magic UI and Aceternity UI"
category: component-libraries
type: library
sources:
  - url: https://github.com/magicuidesign/magicui
    title: "magicuidesign/magicui: UI Library for Design Engineers"
  - url: https://raw.githubusercontent.com/magicuidesign/magicui/main/registry.json
    title: "magicui registry.json (item list)"
  - url: https://magicui.design/
    title: "Magic UI (site, proxy blocked, link recorded)"
  - url: https://registry.npmjs.org/aceternity-ui/latest
    title: "npm: aceternity-ui (CLI) latest"
  - url: https://ui.aceternity.com/
    title: "Aceternity UI (site, proxy blocked, link recorded)"
tags: [magic-ui, aceternity, animation, marketing, shadcn-registry, motion, optional]
updated: 2026-09-06
---

# Magic UI and Aceternity UI

## 概要

Magic UI と Aceternity UI は、shadcn/ui と Tailwind、Motion（framer-motion）を前提にした「見せるための」アニメーションコンポーネント集。どちらもマーケティングサイトのヒーローや装飾（ビーム、パーティクル、マーキー、グロー）を短時間で入れるのが目的で、製品 UI の基礎（フォーム、テーブル、ダイアログ）は提供しない。AwesomeDS では両方を任意扱いにし、既定の UI には使わない。

## 要点

- Magic UI: GitHub `magicuidesign/magicui`、22.2k stars、MIT。README は「UI Library for Design Engineers」。スタックは React、Next.js、TypeScript、Tailwind CSS、Framer Motion、shadcn/ui。ドキュメントは magicui.design/docs（本セッションでは取得不可）。
- Magic UI の registry.json: 218 項目。`registry:ui` が 87、example が 131。UI の例: magic-card、warp-background、aurora-text、morphing-text、scroll-progress、neon-gradient-card、meteors、grid-pattern、dot-pattern、flickering-grid、hero-video-dialog、marquee、globe、shimmer-button、bento-grid、particles、number-ticker、ripple、retro-grid、animated-list、animated-shiny-text、border-beam、animated-beam、text-reveal、hyper-text、animated-gradient-text、orbiting-circles、dock、word-rotate、avatar-circles、typing-animation、sparkles-text、confetti、pulsating-button、rainbow-button、terminal、safari、iphone-15-pro、blur-fade、highlighter、arc-timeline、animated-theme-toggler、grid-beams。
- Magic UI の導入: shadcn 形式の registry なので `npx shadcn@latest add <registry url>` で個別に複製する。
- Aceternity UI: サイト ui.aceternity.com はプロキシで取得不可。npm に CLI パッケージ `aceternity-ui`（0.2.2、MIT、description "Add Aceternity UI components to your apps."）がある。Next.js + Tailwind + framer-motion のコピー&ペースト型コンポーネント集で、有料の Pro テンプレートを持つことが知られているが、本セッションでサイト本文は確認できていない。
- 共通点: Motion（framer-motion）依存、Tailwind 前提、shadcn と同じ「コードを複製して所有する」配布。無限ループ、グラデーション、グロー、パーティクルを多用する。
- taste-skill §0.D と §9 が「AI 生成の tell」として挙げる要素（紫グラデーション、グラス、無限ループの微アニメ、装飾ドット）と重なる部品が多い。

## 具体的な値・ルール（あれば）

| 項目 | Magic UI | Aceternity UI |
|---|---|---|
| ソース | github.com/magicuidesign/magicui | 未取得（サイトのみ、ブロック） |
| 規模 | registry 218 項目（UI 87、example 131） | 未確認 |
| ライセンス | MIT | CLI パッケージは MIT。サイト規約は未確認 |
| 依存 | React、Tailwind、framer-motion、shadcn | Next.js、Tailwind、framer-motion |
| 導入 | shadcn registry | コピー&ペースト、`aceternity-ui` CLI |
| 用途 | マーケティング演出 | マーケティング演出 |

使ってよい場面と条件。

- 場面: ブランドサイトのヒーロー 1 箇所、製品紹介の 1 セクション。`ds-creator` で MOTION を高めると決めたときのみ。
- 条件: `prefers-reduced-motion: reduce` で停止する、無限ループは 1 ページ 1 つまで（進捗表示を除く）、色は AwesomeDS トークンに置換、グロー / グラデーション背景は使わない。

## AwesomeDS への反映

- 任意扱いの理由 1: 第 1 節「No gradients on backgrounds, no glass, no glow, no decorative blobs by default」と、両ライブラリの主力部品（aurora、neon、meteors、particles、border-beam）が正面から衝突する。
- 任意扱いの理由 2: 第 7 節「Nothing loops forever except a progress indicator」。marquee、orbiting-circles、pulsating-button、typing-animation は無限ループが既定。
- 任意扱いの理由 3: 第 9 節 Do not の「`Inter + slate + purple gradient`」「gradients, glow, glass, or blurred blobs」は、これらのライブラリが作りがちな見え方そのものを避けるための規則。AwesomeDS の目的は「AI 生成と分かる見え方」を避けることなので、既定には入れない。
- 採用できる部品: number-ticker（数値の変化）、blur-fade（4 から 8px の enter に調整すれば第 7 節に適合）、dock や animated-list のようなレイアウト系は、色とタイミングを AwesomeDS トークンに差し替えれば使える。
- 導入方法: Magic UI は shadcn registry 経由で個別に入れ、コードを所有する。AwesomeDS の `--duration-*`、`--ease-out` に置換してから使う。
- 記録: Aceternity UI はサイトを確認できていないため、ライセンス条件と Pro の扱いは未確認。使用前に確認すること。

## 出典

- https://github.com/magicuidesign/magicui : README（スタック、MIT、stars）。取得済み。
- https://raw.githubusercontent.com/magicuidesign/magicui/main/registry.json : 218 項目の一覧。取得済み。
- https://magicui.design/ : 公式サイト。プロキシで取得不可、リンクのみ記録。
- https://registry.npmjs.org/aceternity-ui/latest : CLI パッケージ 0.2.2、MIT。取得済み。
- https://ui.aceternity.com/ : 公式サイト。プロキシで取得不可、リンクのみ記録。
