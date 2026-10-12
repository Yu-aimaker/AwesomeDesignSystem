---
title: "Motion Primitives と Animata"
category: animation
type: library
sources:
  - url: https://github.com/ibelick/motion-primitives
    title: "ibelick/motion-primitives: UI kit for animated interfaces (motion-primitives.com)"
  - url: https://raw.githubusercontent.com/ibelick/motion-primitives/main/README.md
    title: "motion-primitives README"
  - url: https://github.com/codse/animata
    title: "codse/animata: animation and interaction code, copy-paste (animata.design)"
  - url: https://raw.githubusercontent.com/codse/animata/main/README.md
    title: "animata README"
tags: [motion-primitives, animata, motion, framer-motion, tailwindcss, copy-paste, shadcn-style]
updated: 2026-09-07
---

# Motion Primitives と Animata

## 概要

どちらも React コンポーネントを「インストールではなくコピー&ペースト」で配る、shadcn/ui 系の配布思想を持つアニメーション UI キット。Motion Primitives（`ibelick/motion-primitives`、motion-primitives.com）は Motion（旧 Framer Motion）を土台にした汎用アニメーションキット、6,224 stars、MIT、最終 push 2026-03-19。Animata（`codse/animata`、animata.design）はより幅広いインタラクション効果を集めたコレクションで、2,784 stars、MIT、最終 push 2026-09-06。既存の Knowledge/component-libraries/react-bits.md（React Bits）と同じ「コピー&ペーストのアニメーション部品集」というカテゴリの、別系統の 2 大リポジトリとして並べて記録する。

## 要点

Motion Primitives

- 作者は ibelick（本 Knowledge の skills/ui-skills.md と同一人物）。GitHub の repository description は「UI kit to make beautiful, animated interfaces, faster. Customizable. Open Source.」。README 冒頭は「Beautifully designed, easy-to-integrate motion components for engineers and designers, built with motion and Tailwind CSS.」で、現在も beta でコンポーネントを継続追加中と明記する。
- 技術基盤は motion.dev（Motion for React）と Tailwind CSS。コンポーネントはプロジェクトにソースごとコピーする方式で、npm パッケージとしての配布はしない。
- トピックタグ（GitHub）: animate、animated、animation、components、framer-motion、library、motion、tailwindcss、ui。

Animata

- GitHub の repository description は「Bring your site to life with easy to use animation & interaction code. Copy. Paste. Animate.」、README 冒頭は「Handcrafted interaction animations and visual effects sourced from across the internet, ready for you to copy and paste into your project seamlessly.」。技術基盤バッジは Next.js、React、Tailwind CSS、Framer Motion、TypeScript。
- Hacktoberfest 対応（`hacktoberfest`、`hacktoberfest-accepted` トピック）で、コミュニティからのコンポーネント追加を積極的に受け入れている。GitHub Pages（`has_pages: true`）でサイトを配信。
- オーガニゼーション `codse` が所有し、Motion Primitives より新しいコンポーネントの追加頻度が高い（最終 push が本セッション確認時点で当日）。

両者に共通する設計思想

- コンポーネントを「インストールする依存パッケージ」ではなく「コピーしてそのまま所有するソースコード」として配る点は shadcn/ui と同じ思想。ライブラリのバージョンアップに引きずられず、必要な部分だけ改変できる。
- どちらもブランド差別化の主戦場をマイクロインタラクションとエントランスアニメーションに置き、レイアウトやトークン体系そのものには踏み込まない（配色やタイポグラフィは利用側のプロジェクトに依存する）。

## 具体的な値・ルール（あれば）

| 項目 | Motion Primitives | Animata |
|---|---|---|
| stars | 6,224 | 2,784 |
| 主要言語 | TypeScript | TypeScript |
| ライセンス | MIT | MIT |
| 最終 push | 2026-03-19 | 2026-09-06 |
| 技術基盤 | Motion (motion.dev)、Tailwind CSS | React、Next.js、Tailwind CSS、Framer Motion |
| 配布方式 | ソースコピー（npm パッケージなし） | ソースコピー |
| サイト | motion-primitives.com | animata.design |

## AwesomeDS への反映

- 反映不要: どちらのリポジトリも配色・角丸・余白などのトークン値を規定しないため、AwesomeDS のトークンファイル（`tokens.css` / `tailwind.css` / `tokens.json`）に直接反映する値はない。
- 記録: 「コンポーネントをコピーして所有する」配布方式は、Knowledge/component-libraries/react-bits.md や shadcn/ui（Knowledge/component-libraries/shadcn-ui.md）と同じ結論であることの追加事例として記録する。AwesomeDS 第 8 節の「CLI でプロジェクトにコンポーネントを複製し、あらかじめスタイル済みのキットを import しない」方針をさらに補強する。
- 記録: taste-skill（Knowledge/skills/taste-skill.md）のスポンサー一覧に React Bits と animations.dev（Emil Kowalski）が並ぶのと同様、Motion Primitives と Animata もこの「コピー&ペースト系アニメーションキット」の生態系に属することを横断参照として残す。
- 不採用: Animata のマイクロインタラクション過多になりがちなデモ（ホバーで大きく変形するカードなど）は、AwesomeDS 第 7 節「200ms を超えるインタラクション feedback を避ける」「transform と opacity のみをアニメーションする」という既存ルールの範囲内でのみ参照する。過度な演出はそのまま採用しない。

## 出典

- https://github.com/ibelick/motion-primitives : リポジトリ本体。6,224 stars、TypeScript、MIT、最終 push 2026-03-19（GitHub 検索 API で確認）。
- https://raw.githubusercontent.com/ibelick/motion-primitives/main/README.md : 説明文とベータ状況。取得済み。
- https://github.com/codse/animata : リポジトリ本体。2,784 stars、TypeScript、MIT、最終 push 2026-09-06（GitHub 検索 API で確認）。
- https://raw.githubusercontent.com/codse/animata/main/README.md : 説明文と技術基盤。取得済み。
