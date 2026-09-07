---
title: "2026 年の DESIGN.md エコシステム"
category: design-md-collections
type: article
sources:
  - url: https://github.com/google-labs-code/design.md
    title: "google-labs-code/design.md: DESIGN.md format specification"
  - url: https://github.com/VoltAgent/awesome-design-md
    title: "VoltAgent/awesome-design-md"
  - url: https://github.com/kzhrknt/awesome-design-md-jp
    title: "kzhrknt/awesome-design-md-jp"
  - url: https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/create-design-md/SKILL.md
    title: "ui-skills: create-design-md SKILL.md"
  - url: https://code.claude.com/docs/en/skills
    title: "Claude Code docs: Agent Skills (SKILL.md format)"
tags: [design-md, stitch, claude-design, ecosystem, frontmatter, agent-skills]
updated: 2026-09-07
---

# 2026 年の DESIGN.md エコシステム

## 概要

2026 年時点で、AI エージェントに視覚的アイデンティティを伝える手段として DESIGN.md 形式が複数の独立した取り組みで収斂しつつある。本エントリは、本 Knowledge が既に持つ 3 つの個別エントリ（Google Stitch の仕様、VoltAgent の欧米コレクション、日本語版コレクション）と、今回新たに調べた `create-design-md`（ui-skills）、Claude Design（Anthropic の closed-source なビジュアルキャンバス製品）を横断して、それぞれの関係を整理する。個々の詳細は各エントリを参照し、本エントリは「誰が何を、どの立場で作っているか」の地図に徹する。

## 要点

- 仕様の源流は Google Labs（Stitch チーム）の `google-labs-code/design.md`（Knowledge/design-md-collections/google-stitch-design-md.md）。YAML frontmatter（`colors`、`typography`、`rounded`、`spacing`、`components`）+ Markdown 本文（Overview から Do's and Don'ts の 8 見出し）という二層構造を定義し、alpha ステータス、Apache-2.0。
- この仕様を「実例集」として横展開したのが VoltAgent（欧米 74 サイト、Knowledge/design-md-collections/voltagent-awesome-design-md.md）と kzhrknt 版（日本 487 サイト、日本語タイポグラフィのサブセクションを追加、Knowledge/design-md-collections/awesome-design-md-jp.md）。どちらも既存サイトの CSS を後付けで観測して DESIGN.md 化する「リバースエンジニアリング型」のコレクション。
- 「生成する側」のツールとして、`ui-skills`（Knowledge/skills/ui-skills.md）の `create-design-md` スキルが Repository mode（ソースコードが正）と URL mode（DOM 観測が正で確定度は低い）の 2 モードを提供する。VoltAgent / 日本語版コレクションが手作業でこれを行っているのに対し、`create-design-md` はエージェントが同じ evidence pipeline（`role → value → source → scope → recurrence → confidence`）で自動化する。
- Stitch 自身も `google-labs-code/stitch-skills` で DESIGN.md を中心にした Agent Skills（`stitch::extract-design-md`、`stitch::manage-design-system` など）を配布しており、コレクション側とツール側の両方に Google が関与している。
- Claude Design（Knowledge/skills/anthropic-claude-design.md）は、DESIGN.md のような機械可読なテキスト仕様ではなく、closed-source のビジュアルキャンバス製品としてブランド反映を行う点で別系統。third-party 記事によれば「コードリポジトリを読んで実際の React コンポーネントにブランドを適用する」とされ、DESIGN.md のような中間ファイルを公開の形では持たない（一次情報源未確認）。
- AwesomeDS の `DESIGN.md` はこのエコシステムのうち Google Stitch 仕様（frontmatter のキー構成）を土台にしつつ、本文セクションを 8 から 12 節に拡張し、`motion` トークンを frontmatter に追加するなど独自拡張を行っている（詳細は Knowledge/design-md-collections/google-stitch-design-md.md の「AwesomeDS への反映」を参照）。
- 2026 年時点でのエコシステムの構成要素をまとめると次の 3 層になる。

  1. 仕様層: `google-labs-code/design.md`（frontmatter + 本文の形式そのもの）
  2. 実例層: VoltAgent、kzhrknt 版（既存サイトを観測して DESIGN.md 化したデータセット）
  3. 生成/運用層: `create-design-md`（ui-skills）、`stitch-skills`、そして本リポジトリの `ds-creator` / `knowledge-curator`

## 具体的な値・ルール（あれば）

3 層構造の対応表。

| 層 | 代表 | 入力 | 出力 | Knowledge エントリ |
|---|---|---|---|---|
| 仕様 | google-labs-code/design.md | なし（形式定義） | frontmatter スキーマ、CLI（lint/diff/export） | design-md-collections/google-stitch-design-md.md |
| 実例（欧米） | VoltAgent/awesome-design-md | 公開サイトの CSS 観測 | 74 件の DESIGN.md | design-md-collections/voltagent-awesome-design-md.md |
| 実例（日本） | kzhrknt/awesome-design-md-jp | 公開サイトの CSS 観測 + 和文タイポグラフィ | 487 件の DESIGN.md | design-md-collections/awesome-design-md-jp.md |
| 生成ツール | ibelick/ui-skills の create-design-md | リポジトリまたは URL | DESIGN.md ドラフト（Stitch 仕様準拠） | skills/ui-skills.md |
| 生成ツール（Google） | google-labs-code/stitch-skills | Stitch MCP 経由 | DESIGN.md 管理 | design-md-collections/google-stitch-design-md.md |
| 別系統（closed） | Anthropic Claude Design | コードリポジトリ + チャット | ビジュアルキャンバス上のデザイン（テキスト仕様は非公開） | skills/anthropic-claude-design.md |

## AwesomeDS への反映

- 反映不要: 本エントリは既存 3 エントリと新規 2 エントリの関係を整理する横断ドキュメントであり、新たな値の変更提案はない。値の変更提案は個々のエントリ（google-stitch-design-md.md、voltagent-awesome-design-md.md、ui-skills.md）側にすでに記録済み。
- 記録: AwesomeDS の `DESIGN.md` が「仕様層に準拠しつつ実例層の観測値を参考に、本文セクションを拡張する」という設計であることが、この地図によって説明しやすくなった。今後 Knowledge に DESIGN.md 関連のエントリを追加する際は、この 3 層のどこに位置するかを明記することを `knowledge-curator` の運用ルールとして推奨する（`Plugin/awesome-ds/skills/knowledge-curator/SKILL.md` 側で言及）。

## 出典

- https://github.com/google-labs-code/design.md : 仕様層の一次リポジトリ。既存エントリで取得済み。
- https://github.com/VoltAgent/awesome-design-md : 実例層（欧米）。既存エントリで取得済み。
- https://github.com/kzhrknt/awesome-design-md-jp : 実例層（日本）。既存エントリで取得済み。
- https://raw.githubusercontent.com/ibelick/ui-skills/main/skills/create-design-md/SKILL.md : 生成ツール層の evidence pipeline。今回取得。
- https://code.claude.com/docs/en/skills : Agent Skills の一般仕様（SKILL.md 形式）。今回取得。Claude Design 固有の情報は含まれない。
