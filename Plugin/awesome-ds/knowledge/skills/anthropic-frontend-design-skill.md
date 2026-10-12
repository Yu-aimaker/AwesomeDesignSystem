---
title: "Anthropic frontend-design skill"
category: skills
type: skill
sources:
  - url: https://github.com/anthropics/skills
    title: "anthropics/skills: Public repository for Agent Skills"
  - url: https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md
    title: "skills/frontend-design/SKILL.md (anthropics/skills)"
  - url: https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/frontend-design/skills/frontend-design/SKILL.md
    title: "plugins/frontend-design/skills/frontend-design/SKILL.md (anthropics/claude-code)"
  - url: https://claude.com/blog/improving-frontend-design-through-skills
    title: "Improving frontend design through Skills (Claude blog, proxy blocked, link recorded)"
tags: [skill, anthropic, frontend-design, typography, ai-tells, canvas-design, theme-factory]
updated: 2026-09-06
---

# Anthropic frontend-design skill

## 概要

Anthropic が公開する Agent Skills のうち、UI の見た目を決める `frontend-design`。同じ SKILL.md が `anthropics/skills` の `skills/frontend-design/` と、`anthropics/claude-code` の `plugins/frontend-design/skills/frontend-design/` の両方にある。「どの依頼にも他と見間違えられない視覚的アイデンティティを与えるスタジオ」として振る舞い、AI 生成 UI が集まりがちな 5 つの既定を避け、トークン体系を先に設計してからコードを書く手順を定める。

## 要点

- リポジトリ構成（anthropics/skills）: `.claude-plugin/`、`skills/`、`spec/`（Agent Skills 仕様）、`template/`、`README.md`、`THIRD_PARTY_NOTICES.md`。インストールは Claude Code で `/plugin marketplace add anthropics/skills`。ライセンスは大半が Apache 2.0、document skills（docx、pdf、pptx、xlsx）は source-available。
- `skills/` の一覧: academy-guide、algorithmic-art、brand-guidelines、canvas-design、claude-api、discernment-nudge、doc-coauthoring、docx、frontend-design、internal-comms、mcp-builder、pdf、pptx、skill-creator、slack-gif-creator、theme-factory、web-artifacts-builder、webapp-testing、xlsx。
- デザイン関連: `frontend-design`（UI の方向づけ）、`canvas-design`（キャンバス上の視覚デザイン）、`web-artifacts-builder`（Web アーティファクト構築）、`brand-guidelines`（ブランド規定）、`theme-factory`（テーマ生成）、`webapp-testing`（Web アプリのテスト）。
- frontend-design の description: 「Guidance for distinctive, intentional visual design when building new UI or reshaping existing designs. Helps with aesthetic direction, typography, and avoiding templated defaults.」
- 避けるべき 5 つの集まり（AI 生成の tell）: 1 暖色クリーム背景 + serif display + テラコッタ、2 ダーク背景 + acid green や vermilion、3 hairline と新聞段組の broadsheet、4 均一な角丸と柔らかい影の SaaS card kit、5 template chrome（ALL-CAPS ラベル、中黒、monospace のデータ、矢印付きリンク）。特定のブリーフでは正当だが、既定にしない。
- Typography: 書体はこのブリーフのために選ぶ。見出しの 1 語だけを別書体で強調しない。ALL-CAPS ラベルと不要な eyebrow を避ける。1 行 80 字以内。serif は sans より少し行間を広く。
- Motion: 控えめに。ページロード時の 1 回の統合されたシーケンスの方が、散らばった fade と slide より効く。動きはユーザーの操作に答えるもの。
- Structure: 罫線、区切り、番号は情報を符号化するために使い、装飾にしない。番号付きは内容が本当に順序を持つときだけ。
- Restraint: 大胆さは記憶に残る 1 要素に集中させ、周りは静かに。ブリーフに寄与しない装飾は取る。
- Writing: 能動態（「Submit」ではなく「Save changes」）、ユーザー視点、語彙の一貫性、エラー文は具体的、空状態は行動への誘い。
- Process: トークン体系（色、type、layout、原則）をまず考え、ブリーフに照らして generic な既定を消し、作ってから自己批評する。
- ブログ記事（claude.com）はプロキシで取得不可。検索結果の要約では「安全なデザインが訓練データを支配し、方向づけがないと高確率の中心からサンプリングされて generic になる」という問題設定と、`/frontend-design` での直接呼び出しが述べられている。

## 具体的な値・ルール（あれば）

| 項目 | 値 |
|---|---|
| name | `frontend-design` |
| 行長 | 80 字以内 |
| 見出しの部分強調 | 禁止（1 語だけ別書体、色替え） |
| ALL-CAPS ラベル / eyebrow | 原則禁止 |
| 番号付きシーケンス | 内容が順序を持つときのみ |
| Motion | ページロード 1 回 + ユーザー操作への応答。散発的な fade / slide は tell |
| コピー | 能動態、ユーザー視点、同じ概念に同じ語 |

## AwesomeDS への反映

- 採用: 5 つの tell のうち 4（SaaS card kit）と 5（template chrome）への対策を AwesomeDS 第 9 節に入れた。「Use three identical cards in a row as a default」「Put an uppercase eyebrow label above every heading」を Do not に置く。
- 採用: Writing 原則。第 9 節「Write UI copy the way you would say it to a colleague. Short, direct, specific.」と、第 8 節 Forms の「Never placeholder as label」はここに由来する。空状態を必ず出す（第 8 節）も同じ。
- 採用: Motion の考え方。第 7 節「Motion only as feedback」「Nothing loops forever except a progress indicator」。
- 採用: 「トークンを先に設計し、ブリーフに照らしてから実装」の手順を第 12 節 Agent prompt guide の 1 から 4 に反映（ページ種別を宣言、トークンを import、shadcn を選ぶ、内容を先に書く）。
- 変更: 「書体はブリーフごとに選ぶ」。AwesomeDS は既定を Geist + Noto Sans JP に固定し、書体選択を `ds-creator` の決定に限定した。理由は製品 UI の一貫性と日本語グリフ被覆を優先したため。tell 1（クリーム + serif + テラコッタ）を避ける意図は同じで、serif は既定にしない。
- 変更: 「大胆さを 1 要素に集中」は AwesomeDS では「accent を 1 ビューに 1 要素」に置き換えた（第 2 節 Rule 1、第 9 節）。
- 不採用: 行長 80 字。AwesomeDS は Latin 65ch、日本語 40 全角字とより短くした（第 3 節 Measure）。
- 記録: `canvas-design`、`theme-factory`、`brand-guidelines` は本リポジトリの `design-thinking` と `ds-creator` の参考候補。中身の精査は今後の課題。

## 出典

- https://github.com/anthropics/skills : README、フォルダ構成、`skills/` 一覧、インストール手順、ライセンス。取得済み。
- https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md : frontmatter と本文。取得済み。
- https://raw.githubusercontent.com/anthropics/claude-code/main/plugins/frontend-design/skills/frontend-design/SKILL.md : 同内容のプラグイン版。取得済み。
- https://claude.com/blog/improving-frontend-design-through-skills : 背景記事。プロキシで取得不可、リンクのみ記録（検索結果の要約に基づく記述は上記の 1 段落のみ）。
