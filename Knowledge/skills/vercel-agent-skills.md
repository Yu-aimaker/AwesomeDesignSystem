---
title: "Vercel agent-skills and the skills CLI"
category: skills
type: repo
sources:
  - url: https://github.com/vercel-labs/agent-skills
    title: "vercel-labs/agent-skills: Vercel's official collection of agent skills"
  - url: https://github.com/vercel-labs/skills
    title: "vercel-labs/skills: the `npx skills` CLI"
  - url: https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/SKILL.md
    title: "react-best-practices SKILL.md"
  - url: https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/web-design-guidelines/SKILL.md
    title: "web-design-guidelines SKILL.md"
  - url: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
    title: "vercel-labs/web-interface-guidelines command.md (the rules web-design-guidelines fetches)"
  - url: https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-view-transitions/SKILL.md
    title: "react-view-transitions SKILL.md"
tags: [skill, vercel, cli, react, performance, web-interface-guidelines, view-transitions]
updated: 2026-09-06
---

# Vercel agent-skills and the skills CLI

## 概要

Vercel が公開する 2 つのリポジトリ。`vercel-labs/skills` は `npx skills add <owner/repo>` でスキルを任意のエージェントにインストールする CLI で、taste-skill や mattpocock/skills もこれを配布手段にしている。`vercel-labs/agent-skills` は Vercel 公式のスキル集で、React / Next.js のパフォーマンス規則 `react-best-practices`、UI コードの監査 `web-design-guidelines`、`react-view-transitions` などを含む。

## 要点

- CLI: `npx skills add vercel-labs/agent-skills`。75 以上のエージェント（Claude Code、Cursor、Codex、OpenCode、Cline、Windsurf、Zed、GitHub Copilot など）に対応。
- 主なフラグ: `-s, --skill <name>`（特定スキル、`'*'` で全部）、`-a, --agent <name>`、`-g, --global`（ホームに入れる）、`-y, --yes`、`--all`、`--copy`（symlink ではなくコピー）、`-l, --list`。
- インストール先: プロジェクトなら `./<agent>/skills/`（Claude Code は `.claude/skills/`）、`-g` なら `~/<agent>/skills/`。
- 他コマンド: `npx skills use`（インストールせずプロンプト生成）、`find`（検索）、`list`、`update`、`remove`、`init`（SKILL.md テンプレート作成）。ディレクトリは skills.sh。
- 探索ルール: リポジトリの `SKILL.md`、`skills/`、`skills/.curated/`、`skills/.experimental/`、`.claude/skills/`、`.agents/skills/` を 3 階層まで探す。SKILL.md は YAML frontmatter に `name` と `description` が必須。
- agent-skills の 8 スキル: `vercel-optimize`（デプロイ済みプロジェクトの費用・性能・キャッシュ監査）、`react-best-practices`、`web-design-guidelines`、`writing-guidelines`（80 以上の文章規則）、`react-native-guidelines`（16 規則）、`react-view-transitions`、`composition-patterns`（boolean prop の増殖への対処）、`vercel-deploy-claimable`。ライセンス MIT。
- `react-best-practices`（name: `vercel-react-best-practices`）: SKILL.md 本文は 8 カテゴリ 70 規則。README は 40 以上と書くので数字は版でずれる。優先順位: 1 Eliminating Waterfalls（CRITICAL、6）、2 Bundle Size（CRITICAL、6）、3 Server-Side Performance（HIGH、10）、4 Client-Side Data Fetching（MEDIUM-HIGH、4）、5 Re-render Optimization（MEDIUM、13）、6 Rendering Performance（MEDIUM、11）、7 JavaScript Performance（LOW-MEDIUM、14）、8 Advanced Patterns（LOW、4）。各規則は `rules/*.md` に分かれ、`AGENTS.md` が全文を結合。
- `web-design-guidelines`: 実行時に `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md` を取得し、指定ファイルを規則に照らして `file:line` 形式で報告する薄いラッパー。トリガー語は "review my UI"、"check accessibility"、"audit design"。
- `react-view-transitions`（name: `vercel-react-view-transitions`）: React の `<ViewTransition>`、`addTransitionType`、`::view-transition-old/new` 疑似要素で状態間アニメーションを作る。トリガーは `startTransition` / `useDeferredValue` / `Suspense`。対応ブラウザは Chromium 125+、Firefox 144+、Safari 18.2+。

## 具体的な値・ルール（あれば）

Web Interface Guidelines（command.md）の 11 カテゴリ: Accessibility、Focus States、Forms、Animation、Typography、Content Handling、Images、Performance、Navigation & State、Touch & Interaction、その他（Dark Mode、i18n、Hydration、Hover、Copy）。

具体規則の抜粋。

| 規則 | 値 |
|---|---|
| アイコンだけのボタン | `aria-label` 必須 |
| フォーカス | `:focus-visible` で可視化。`outline: none` を代替なしで使わない |
| ラベル | `htmlFor` かコントロールを包む |
| Motion | `prefers-reduced-motion` を尊重。`transform` と `opacity` のみアニメーション。`transition: all` 禁止 |
| 画像 | `width` と `height` を明示。fold 下は `loading="lazy"` |
| 省略記号 | `…`（U+2026）を使い `...` を使わない |
| 装飾アイコン | `aria-hidden="true"` |
| タップ | `touch-action: manipulation` |
| 長いリスト | 50 件超は仮想化（virtua）か `content-visibility: auto` |
| フォーム入力 | `autocomplete` と `name` を付ける |
| 非同期の結果 | toast や検証結果は `aria-live="polite"` |

## AwesomeDS への反映

- 採用: 配布手段。本リポジトリの `Plugin/awesome-ds` は Claude Code プラグイン形式だが、`skills/` 配下に SKILL.md を置く配置は `npx skills add` の探索ルールに合致するようにし、他エージェントからも取り込めるようにする。
- 採用: Web Interface Guidelines の規則群を AwesomeDS 第 11 節 Accessibility に反映。`aria-label` on icon-only buttons、`:focus-visible` の代替なし `outline: none` 禁止、`prefers-reduced-motion`、`transform` / `opacity` のみの原則は同一。
- 採用: `…`（U+2026）と `aria-live="polite"` を `components/checklist.md` の項目にする。
- 採用: `web-design-guidelines` の「規則を取得して `file:line` で報告する」形式を、本リポジトリの `design-verifier` スキルの出力形式の参考にする。
- 変更: `react-best-practices` はデザインシステムの範囲外だが、RSC 既定と Client Component の葉への隔離（waterfall と bundle の観点）を Knowledge/tech-stack/nextjs-and-vite.md に転記し、AwesomeDS の実装ガイドで参照する。
- 不採用: `react-view-transitions` を既定の遷移手段にすること。AwesomeDS 第 7 節のライブラリ順序は CSS transitions → Motion で、View Transition API は Next.js 環境でページ遷移が必要なときの選択肢に留める。Safari 18.2+ と Firefox 144+ の要件が理由。

## 出典

- https://github.com/vercel-labs/agent-skills : README（8 スキル、インストール、ライセンス）。取得済み。
- https://github.com/vercel-labs/skills : CLI のコマンド、フラグ、インストール先、探索ルール。取得済み。
- https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-best-practices/SKILL.md : 8 カテゴリ 70 規則と優先度。取得済み。
- https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/web-design-guidelines/SKILL.md : 取得先 URL と手順。取得済み。
- https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md : 11 カテゴリと具体規則。取得済み。
- https://raw.githubusercontent.com/vercel-labs/agent-skills/main/skills/react-view-transitions/SKILL.md : View Transition API の使い方とブラウザ要件。取得済み。
