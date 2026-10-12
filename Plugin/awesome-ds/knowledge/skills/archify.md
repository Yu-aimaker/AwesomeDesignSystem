---
title: "Archify (tt-a1i)"
category: skills
type: skill
sources:
  - url: https://github.com/tt-a1i/archify
    title: "tt-a1i/archify: agent skill for architecture, workflow, sequence, data-flow and lifecycle diagrams"
  - url: https://raw.githubusercontent.com/tt-a1i/archify/main/README.md
    title: "Archify README (English)"
  - url: https://raw.githubusercontent.com/tt-a1i/archify/main/archify/SKILL.md
    title: "Archify SKILL.md"
  - url: https://raw.githubusercontent.com/tt-a1i/archify/main/archify/package.json
    title: "Archify archify/package.json (version, bin)"
tags: [skill, archify, diagram, architecture-diagram, mermaid-alternative, json-ir, svg, agent-skill]
updated: 2026-09-07
---

# Archify (tt-a1i)

## 概要

Archify は `tt-a1i/archify` が公開する Agent Skill で、GitHub 検索 `archify` の中で群を抜いて最も星の多いプロジェクト（51,537 stars、JavaScript、MIT、最終 push 2026-09-07、開発版 v2.17.0-dev.1）。ソフトウェアアーキテクチャや処理フローを対象にした診断書であり、AI エージェントが書いた型付き JSON（IR）を、決定的なレンダラーが自己完結した HTML + インライン SVG に変換する。Cursor、Claude Code、Codex CLI、OpenCode 向けに `npx skills add tt-a1i/archify -g` で導入する。他の候補（Oct4Pie/archify は macOS の universal binary 縮小ツール、Salah-XD/archify はブラウザ拡張のセキュリティ解析ツール）はいずれもソフトウェア設計や AI エージェント向けの図生成とは無関係で、名前が一致するだけの別プロジェクトだった。

## 要点

- 5 つの図種別（type router）: `architecture`（コンポーネント、クラウド/セキュリティ境界、インフラ）、`workflow`（プロセス、承認ゲート、CI/CD）、`sequence`（API 呼び出し連鎖、非同期トレース）、`dataflow`（パイプライン、ETL/ELT、リネージ）、`lifecycle`（状態遷移、リトライ、終端状態）。曖昧な場合は `node bin/archify.mjs guide "<scenario>"` で判定する。
- 生成手順は固定: (1) 種別を選ぶ、(2) `schemas/` と `examples/` から一致するスキーマと例を 1 つずつだけ読む、(3) 候補 JSON をまず書く、(4) `node bin/archify.mjs validate <type> <candidate.json> --quality showcase --json` で検証、(5) `node bin/archify.mjs deliver <type> <candidate.json> <output.html> --quality showcase --json` で最終成果物を書き出す。showcase 合格は 9 項目の artifact check すべてが 0 エラー・0 警告であることを要求し、4 項目だけの basic validation とは区別する。
- Mermaid 入力を受け付けるが、そのままスタイルを再現するのではなく、トポロジーと意味だけを読み取って新規に Archify JSON を書き直す方針（`flowchart`/`graph` → `workflow` か `architecture`、`sequenceDiagram` → `sequence`、`stateDiagram` → `lifecycle`）。
- 出力機能: ダーク/ライト 2 テーマの切り替え、PNG/SVG/WebM/1200x630 の共有カード書き出し、経路（route）や上流/下流の到達範囲（reach）を辿るインタラクティブなビューア、2 つの検証済みスナップショットを Before/Delta/After で比較する差分レビュー。
- authoring invariants（抜粋）: 1 本の主経路と短い側枝、`meta.quality_profile` は既定で `"showcase"`、`meta.visual_preset` は既定で省略（`classic` になる）し、明示要求時のみ `signal-flow` / `blueprint` / `editorial`。コンポーネント種別は `frontend` / `backend` / `database` / `cloud` / `security` / `messagebus` / `external` の 7 種、バリアントは `default` / `emphasis` / `security` / `dashed` の 4 種。1440x900、1600x1000、1920x1080（大画面では 2048x1320 も）で `scrollWidth <= innerWidth` かつ `scrollHeight <= innerHeight` を要求する。
- 更新通知は既定でオンだが、成功チェックはおよそ 72 時間（±20%）間隔、送信するのはバージョンなし・プロンプトなし・アカウント/デバイス ID なしの通常の HTTP メタデータのみで、自動更新は一切行わない。`ARCHIFY_UPDATE_CHECK_DISABLED=1` で無効化できる。
- `Cocoon-AI/architecture-diagram-generator`（MIT、v1.0）を基にした派生であることを SKILL.md の `metadata.based_on` に明記している。

## 具体的な値・ルール（あれば）

```bash
# インストール（グローバル）
npx skills add tt-a1i/archify -g

# Cursor 向け非対話インストール
npx -y skills add tt-a1i/archify --skill archify --agent cursor --global --copy --yes

# 検証（showcase 品質）
node bin/archify.mjs validate <type> <candidate.json> --quality showcase --json

# 最終書き出し
node bin/archify.mjs deliver <type> <candidate.json> <output.html> --quality showcase --json
```

| 項目 | 値 |
|---|---|
| 図種別 | architecture / workflow / sequence / dataflow / lifecycle |
| 主経路の複雑さ上限 | 明示なし。「1 本の主経路、短い側枝」を優先し過密を避ける |
| ビューポート検証 | 1440x900, 1600x1000, 1920x1080（大画面向けは 2048x1320 も追加） |
| コンポーネント種別 | frontend, backend, database, cloud, security, messagebus, external |
| バリアント | default, emphasis, security, dashed |
| 更新チェック間隔 | 成功時 約72時間(±20%)、失敗時 6時間 → 24時間で再試行 |

## AwesomeDS への反映

- 記録: AwesomeDS 自体にはアーキテクチャ図の生成規約がないため、値の変更提案はない（反映不要）。ただし本リポジトリの `foundations/` や `components/` の設計判断を将来 README や CONTRIBUTING の図で説明する際、Mermaid ではなく「意味を読み取ってから専用フォーマットで描き直す」という Archify の方針は、図を保守する上での参考として記録する。
- 記録: `transform: perpendicular from side` のような幾何制約や、コンポーネント種別を 7 種に固定する設計は、Knowledge/skills/diagram-design.md（同じく図生成スキル）と合わせて比較参照する。
- 反映不要: 角丸・配色・タイポグラフィなど AwesomeDS のトークンに直接対応する値をこのスキルは持たない（診断書のレンダラーは自前の配色プリセットを使う）。

## 出典

- https://github.com/tt-a1i/archify : リポジトリ本体。51,537 stars、JavaScript、MIT、最終 push 2026-09-07（GitHub 検索 API で確認）。同名の無関係リポジトリ（Oct4Pie/archify、Salah-XD/archify）も検索結果で確認し、除外した。
- https://raw.githubusercontent.com/tt-a1i/archify/main/README.md : 機能概要、インストール、更新チェックの挙動。`git clone` で取得。
- https://raw.githubusercontent.com/tt-a1i/archify/main/archify/SKILL.md : 生成手順、type router、authoring invariants の全文。取得済み。
- https://raw.githubusercontent.com/tt-a1i/archify/main/archify/package.json : バージョン 2.17.0-dev.1、bin エントリ。取得済み。
