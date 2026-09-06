---
title: "taste-skill (Leonxlnx)"
category: skills
type: skill
sources:
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill: The Anti-Slop Frontend Framework for AI Agents"
  - url: https://github.com/vercel-labs/agent-skills
    title: "vercel-labs/agent-skills (the `npx skills add` CLI taste-skill installs through)"
tags: [skill, anti-slop, dials, gsap, motion, landing-page, pre-flight, em-dash]
updated: 2026-09-06
---

# taste-skill (Leonxlnx)

## 概要

`design-taste-frontend` を中心にした Agent Skills 集。ランディングページ、ポートフォリオ、リデザインを対象に、ブリーフを読んで設計方向を推論し、3 つのダイヤル（DESIGN_VARIANCE / MOTION_INTENSITY / VISUAL_DENSITY）で出力を調整する。v2（experimental）が既定で、v1 は `design-taste-frontend-v1` として残る。ダッシュボードやデータテーブル、多段フォームは対象外と明記している。

## 要点

- インストール: `npx skills add https://github.com/Leonxlnx/taste-skill`。単体は `--skill "<install name>"`。install name は SKILL.md の `name:` フィールドで、フォルダ名ではない。
- v2 SKILL.md の構成: §0 Brief Inference、§1 The Three Dials、§2 Brief → Design System Map、§3 Default Architecture、§4 Design Engineering Directives、§5 Context-Aware Proactivity（GSAP skeletons）、§6 Performance & Accessibility、§7 Dial Definitions、§8 Dark Mode Protocol、§9 AI Tells、§10 Reference Vocabulary、§11 Redesign Protocol、§12 Block Library、§13 Out of Scope、§14 Final Pre-Flight Check。
- §0 Brief inference: ページ種別、vibe 語、参照 URL、対象読者、既存ブランド資産、規制などの静かな制約を読む。生成前に一行の「Design Read」を宣言する（例: "Reading this as: B2B SaaS landing for technical buyers, with a Linear-style minimalist language, leaning toward Tailwind utilities + Geist + restrained motion."）。曖昧なら質問は 1 つだけ。
- §0.D Anti-Default: AI 紫グラデーション、ダークメッシュ上の中央ヒーロー、3 枚の均等カード、全面グラス、無限ループの微アニメ、`Inter + slate-900` を既定にしない。
- §2 Design System Map: Microsoft 風なら `@fluentui/react-components`、Material なら `@material/web`、IBM なら `@carbon/react`、Shopify なら Polaris、Atlassian なら `@atlaskit/*`、GitHub 風なら `@primer/*`、英公共なら `govuk-frontend`、米公共なら `uswds`、React 基盤なら `@radix-ui/themes`、自分でコードを持つ SaaS なら shadcn/ui、Tailwind 系なら Tailwind v4。「One system per project」、「公式パッケージを再実装しない」。アエステティック（glassmorphism、bento、brutalism、editorial、aurora）は公式パッケージがないので Web 標準で作り、Apple Liquid Glass は近似と明記する。
- §3 Stack: React / Next.js（RSC 既定、Motion を使う部品は `'use client'` の葉に隔離）、Tailwind v4（PostCSS では `@tailwindcss/postcss`、または Vite プラグイン）、Motion（`import { motion } from "motion/react"`）、フォントは `next/font` か自前 `@font-face` + `font-display: swap`。
- §5 GSAP skeletons: 5.A Sticky-Stack（`start: "top top"`、`endTrigger` は最後のカード、`pin: true`、`pinSpacing: false`、次カードのトリガーで `scale: 0.92` / `opacity: 0.55`）、5.B Horizontal-Pan、5.C Scroll-Reveal Stagger。`useReducedMotion()` が真なら何もしない。`gsap.context` でクリーンアップ。
- §5.D 禁止: `window.addEventListener("scroll")`、`window.scrollY` を React state に入れる、`requestAnimationFrame` で state を触る。代替は Motion `useScroll()`、ScrollTrigger、IntersectionObserver、CSS `animation-timeline: view()`。
- §6: `transform` と `opacity` のみアニメーション、`MOTION_INTENSITY > 3` は `prefers-reduced-motion` 必須、ダークモードは消費者向けページで必須。
- §9.G Em-dash ban: em dash 文字はページ上のどこにも置かない。見出し、eyebrow、本文、引用、alt まで。ハイフンに置換か文を組み替える。
- §14 Pre-flight: 約 55 項目のチェックリスト。ヒーロー見出し 2 行以内、サブテキスト 20 語以内、ナビ 1 行で高さ 80px 以下、8 セクションで 4 種以上のレイアウト族、`min-h-[100dvh]` で `h-screen` 禁止、eyebrow 数は `ceil(sectionCount / 3)` 以下、など。
- research/: `laziness/`（LLM が出力を省略する原因と対策）。CHANGELOG.md に v1 から v2 の差分。
- スポンサーに interfaces.dev、React Bits、animations.dev（Emil Kowalski）、IMG.LY、Kimi、Vercel OSS Program が並ぶ。

## 具体的な値・ルール（あれば）

リポジトリ内の全スキルと install name（`skills/*/SKILL.md` の `name:`）。

| フォルダ | install name | 種別 |
|---|---|---|
| taste-skill | `design-taste-frontend` | 実装（v2 experimental、既定） |
| taste-skill-v1 | `design-taste-frontend-v1` | 実装（v1 保存版） |
| gpt-tasteskill | `gpt-taste` | 実装（GPT/Codex 向け強化） |
| image-to-code-skill | `image-to-code` | 実装（画像生成 → 解析 → コード） |
| redesign-skill | `redesign-existing-projects` | 実装（監査から始める） |
| soft-skill | `high-end-visual-design` | 実装（穏やかな高級感） |
| output-skill | `full-output-enforcement` | 実装（省略禁止） |
| minimalist-skill | `minimalist-ui` | 実装（Notion / Linear 風） |
| brutalist-skill | `industrial-brutalist-ui` | 実装（Swiss type、硬い対比） |
| stitch-skill | `stitch-design-taste` | 実装（Stitch 向け DESIGN.md 生成） |
| imagegen-frontend-web | `imagegen-frontend-web` | 画像生成 |
| imagegen-frontend-mobile | `imagegen-frontend-mobile` | 画像生成 |
| brandkit | `brandkit` | 画像生成 |

ダイヤル。

| ダイヤル | 既定 | 1-3 | 4-7 | 8-10 |
|---|---|---|---|---|
| DESIGN_VARIANCE | 8 | 対称 12 カラム、中央揃え | `-2rem` の重なり、比率の混在 | masonry、`2fr 1fr 1fr`、大きな空白。768px 未満は必ず 1 カラムに畳む |
| MOTION_INTENSITY | 6 | hover / active のみ | `transition 0.3s cubic-bezier(0.16, 1, 0.3, 1)`、遅延カスケード | スクロール連動、parallax、GSAP ScrollTrigger |
| VISUAL_DENSITY | 4 | `py-32` から `py-48` | `py-16` から `py-24` | カード禁止、1px 線で区切り、数値は `font-mono` |

ダイヤル推論の例: 「minimalist / Linear-style」→ 5-6 / 3-4 / 2-3。「public-sector / regulated」→ 3-4 / 2-3 / 4-5。プリセット「Landing (SaaS)」→ 7 / 6 / 4、「Public-sector service」→ 3 / 2 / 5。

## AwesomeDS への反映

- 採用: Anti-Default の禁止項目。AwesomeDS 第 9 節 Do not は「`Inter + slate + purple gradient`」「3 枚の同一カード」「全見出しの上の大文字 eyebrow」「グラデーション、glow、glass、blob」をそのまま引き継いだ。
- 採用: em dash 禁止。AwesomeDS 第 9 節「Use em dashes in UI copy. Use a period or a comma.」（Do not 側）。本ナレッジベースの執筆ルールも同じ。
- 採用: `transform` と `opacity` のみ、`prefers-reduced-motion` 必須、`min-height: 100dvh`（第 7 節、第 10 節）。
- 採用: ライブラリ順序。AwesomeDS 第 7 節「CSS transitions → Motion → GSAP ScrollTrigger（pin / scrub のみ）→ Lottie → three.js」は §10 Animation Library Choice と §5.D の禁止事項を整理したもの。「GSAP / Three.js と Motion を同じコンポーネントツリーで混ぜない」も採用。
- 採用: ヒーローは 390px 幅で 1 画面に収める、見出し 2 行以内（第 10 節）。§14 の Hero Discipline を数値で固定した。
- 採用: `useReducedMotion()` ガードと `gsap.context` クリーンアップを GSAP 利用時の必須手順とする（Knowledge/animation/gsap.md 参照）。
- 変更: ダイヤル。AwesomeDS はダイヤルを持たず、既定を「VARIANCE 3-4 / MOTION 2-3 / DENSITY 4」相当の静かな側に固定した。ブランド固有の振れ幅は `ds-creator` で決める。理由は AwesomeDS が製品 UI（ダッシュボードやフォームを含む）を対象にし、taste-skill が明示的に対象外にしている領域を含むため。
- 変更: 「MOTION_INTENSITY 4-7 で `transition: all 0.3s`」は採用しない。AwesomeDS は 100 から 300ms のスケールと、`transition: all` を避けて個別プロパティを書く方針。
- 不採用: 「centered hero を避ける」「asymmetric を既定にする」。AwesomeDS は左揃え既定だが、短い display 見出しと空状態の中央揃えは許す。
- 不採用: `Phosphor / HugeIcons / Tabler` を候補にすること。AwesomeDS は Lucide 一本（strokeWidth 1.75）。

## 出典

- https://github.com/Leonxlnx/taste-skill : README（install name 表、ダイヤル説明）、CHANGELOG.md、`skills/*/SKILL.md`（13 スキル）、`research/README.md` をローカルクローンで読んだ。
- https://github.com/vercel-labs/agent-skills : README がインストール手段として参照する `npx skills add` CLI。取得済み。
