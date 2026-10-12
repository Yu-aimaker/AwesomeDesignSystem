---
title: "diagram-design (Mahip Kakan) and excalidraw-diagram-skill (coleam00)"
category: skills
type: skill
sources:
  - url: https://github.com/mahip-kakan/diagram-design
    title: "mahip-kakan/diagram-design: editorial-quality technical and product diagrams as standalone HTML"
  - url: https://raw.githubusercontent.com/mahip-kakan/diagram-design/main/README.md
    title: "diagram-design README"
  - url: https://raw.githubusercontent.com/mahip-kakan/diagram-design/main/skills/diagram-design/SKILL.md
    title: "diagram-design SKILL.md"
  - url: https://raw.githubusercontent.com/mahip-kakan/diagram-design/main/skills/diagram-design/references/style-guide.md
    title: "diagram-design references/style-guide.md (tokens)"
  - url: https://github.com/coleam00/excalidraw-diagram-skill
    title: "coleam00/excalidraw-diagram-skill: Excalidraw diagrams that argue visually"
  - url: https://raw.githubusercontent.com/coleam00/excalidraw-diagram-skill/main/README.md
    title: "excalidraw-diagram-skill README"
tags: [skill, diagram, svg, excalidraw, mermaid-alternative, editorial, design-tokens]
updated: 2026-09-07
---

# diagram-design (Mahip Kakan) と excalidraw-diagram-skill (coleam00)

## 概要

GitHub 検索「diagram-design」「diagram design skill」「design diagram claude」で見つかった Agent Skill のうち、名前が完全一致するのは `mahip-kakan/diagram-design`（2 stars、MIT、Claude Code 向け、最終更新 2026-08-26）で、13 種類の技術/製品図を自己完結した HTML + インライン SVG で生成する。一方、実際の採用規模で最も大きいのは Excalidraw 系の `coleam00/excalidraw-diagram-skill`（4,706 stars、Python、最終 push 2026-09-07）で、自然言語から編集可能な `.excalidraw` ファイルを生成し Playwright で自己検証する。両者とも Mermaid の代替として位置づけられ、AwesomeDS のトークン思想（役割ベースの色、タイポグラフィスケール、複雑さの上限）と直接比較できる具体的な値を持つ。

## 要点

`mahip-kakan/diagram-design`

- 13 種類: Architecture、Flowchart、Sequence、State Machine、ER / Data Model、Timeline、Swimlane、Quadrant、Nested、Tree、Layer Stack、Venn、Pyramid / Funnel。各 3 バリアント（Minimal light、Minimal dark、Full editorial）。
- 初回実行時にスタイルガイドの「first-run gate」があり、既定トークンのままなら「(a) 自分のサイトから色とフォントを抽出、(b) 手動でトークンを渡す、(c) 既定のまま進める」をユーザーに尋ねる。無断でブランド未反映のまま生成しない設計。
- 複雑さ予算: 1 図あたり最大 9 ノード・12 矢印。超えたら分割する。ターゲット密度は「10 段階中 4」。
- ユニバーサル・アンチパターン表: ダークモード+シアン/紫グロー、全面 JetBrains Mono、全ノード同一サイズ、図内に浮く凡例、マスクなしの矢印ラベル、`writing-mode` 縦書きテキスト、3 枚均等カード、シャドウ、`rounded-2xl`、コーラルアクセントの乱用。
- トークンは意味役割（`paper`、`ink`、`muted`、`accent` など）で参照し、hex 値を type-specific ファイルに直書きしない。
- 「最高品質の一手は大抵、削除である」という設計哲学（`.impeccable.md` から引用、「1 つのアクセント、2 つのフォントファミリー、小さな余白語彙」）。

`coleam00/excalidraw-diagram-skill`

- 「boxes-and-arrows ではなく、視覚的に主張する図」を掲げる。1 対多はファンアウト、時系列はタイムライン、集約は収束といった図形選びで概念そのものを表現する。
- Playwright ベースのレンダーパイプラインで自分の出力を実際に描画し、重なり・不揃いな余白などのレイアウト崩れを検出してループで直してから納品する（`references/render_excalidraw.py`）。
- ブランド色は `references/color-palette.md` の 1 ファイルに集約し、そこを差し替えるだけで全図に反映される。
- ファイル構成: `SKILL.md`（設計方法論とワークフロー）、`references/color-palette.md`、`element-templates.md`（要素種別ごとの JSON テンプレート）、`json-schema.md`（Excalidraw JSON 形式リファレンス）、`render_excalidraw.py`、`pyproject.toml`（Python 依存、`uv sync` でセットアップ）。
- 導入は `.claude/skills/` へのコピーのみ（`npx skills add` のような外部レジストリを使わない）。

## 具体的な値・ルール（あれば）

`diagram-design` の意味役割トークン（`references/style-guide.md`、ライト/ダーク）。

| Role | 用途 | Light | Dark |
|---|---|---|---|
| paper | ページ背景・既定ノード fill | `#f5f5f5` | `#2d3142` |
| paper-2 | 図コンテナ背景 | `#ececec` | `#393e53` |
| ink | 主文字・主枠線 | `#2d3142` | `#f5f5f5` |
| muted | 副文字・既定矢印線 | `#4f5d75` | `#bfc0c0` |
| accent | フォーカス（1 図に 1〜2 個まで） | `#eb6c36` | `#f08a59` |
| link | HTTP/API 呼び出し、外部矢印 | `#2e5aa8` | `#6a95d8` |

タイポグラフィ（`style-guide.md`）。

| Role | フォント | サイズ | ウェイト |
|---|---|---|---|
| title | Instrument Serif | 1.75rem | 400 |
| node-name | Geist (sans) | 12px | 600 |
| sublabel | Geist Mono | 9px | 400 |
| eyebrow | Geist Mono | 7-8px | 500, tracking 0.18em, uppercase |
| arrow-label | Geist Mono | 8px | 400, tracking 0.06em |

複雑さ予算: 最大 9 ノード / 12 矢印、4px グリッド（すべての座標・サイズ・間隔が 4 の倍数）、角丸は 6 から 10px またはなし。

インストール:

```bash
# diagram-design
cp -r skills/diagram-design ~/.claude/skills/diagram-design

# excalidraw-diagram-skill
git clone https://github.com/coleam00/excalidraw-diagram-skill.git
cp -r excalidraw-diagram-skill .claude/skills/excalidraw-diagram
cd .claude/skills/excalidraw-diagram/references && uv sync && uv run playwright install chromium
```

## AwesomeDS への反映

- 採用（記録済みの一致として）: `diagram-design` の「意味役割で色を参照し hex を直書きしない」方針は、AwesomeDS の `canvas` / `ink` / `accent` トークン設計とすでに同じ結論であることの追加出典として記録する。
- 採用（記録済みの一致として）: 「アクセントは 1 画面に 1〜2 個まで」「シャドウではなく境界線」「`rounded-2xl` のような過大な角丸を避ける」は、AwesomeDS 第 2 節・第 5 節・第 9 節の既存ルールと一致する。値そのものの変更は不要。
- 提案: `diagram-design` のユニバーサル・アンチパターン表にある「凡例が図内に浮いて要素と衝突する」「矢印ラベルにマスク矩形がないと線が透ける」は、本リポジトリが将来アーキテクチャ図や比較図を Knowledge や README に追加する際のチェック項目として `Plugin/awesome-ds/skills/knowledge-curator/reference/watchlist.md` に記録する。AwesomeDS のコンポーネント規約そのものへの変更は不要（反映不要）。
- 記録: `excalidraw-diagram-skill` の「レンダリングして自分の出力を目視検証してから納品する」ループは、`design-verifier` スキルが実ブラウザキャプチャで敵対的検証を行う設計と同じ考え方であることを比較用に記録する。AwesomeDS 本体の変更はない。

## 出典

- https://github.com/mahip-kakan/diagram-design : リポジトリ本体。2 stars、MIT、最終更新 2026-08-26（GitHub 検索 API で確認）。
- https://raw.githubusercontent.com/mahip-kakan/diagram-design/main/README.md : 13 種類の一覧とインストール。`git clone` で取得。
- https://raw.githubusercontent.com/mahip-kakan/diagram-design/main/skills/diagram-design/SKILL.md : 設計哲学、複雑さ予算、アンチパターン表。取得済み。
- https://raw.githubusercontent.com/mahip-kakan/diagram-design/main/skills/diagram-design/references/style-guide.md : 意味役割トークンとタイポグラフィ表。取得済み。
- https://github.com/coleam00/excalidraw-diagram-skill : リポジトリ本体。4,706 stars、Python、最終 push 2026-09-07（GitHub 検索 API で確認）。
- https://raw.githubusercontent.com/coleam00/excalidraw-diagram-skill/main/README.md : 設計方針、レンダーパイプライン、ファイル構成。`git clone` で取得。
