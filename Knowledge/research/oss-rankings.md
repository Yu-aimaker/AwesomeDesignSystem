---
title: "OSS ランキング (/rankings) の設計"
category: research
type: guideline
sources:
  - url: https://github.com/Yu-aimaker/AwesomeDesignSystem
    title: "このリポジトリ本体 (scripts/fetch-repos.mjs と .github/workflows/weekly-growth.yml)"
  - url: https://github.com/tt-a1i/archify
    title: "tt-a1i/archify (本タスクで観測した高スター数の実例、51,537 stars)"
  - url: https://github.com/obra/superpowers
    title: "obra/superpowers (本タスクで観測した高スター数の実例、282,566 stars)"
tags: [rankings, github-stars, oss, data-pipeline, caveats, github-api]
updated: 2026-10-11
---

# OSS ランキング (/rankings) の設計

## 概要

本リポジトリの `AwesomeDS/data/repos.json` は、デザイン / AI フロントエンド関連 OSS の GitHub スター数ランキングを保持するデータファイルで、`scripts/fetch-repos.mjs` が GitHub REST API から生成する。選定リストは `AwesomeDS/data/sources/curated-repos.json` にあり、`topic:design-system` の検索結果は `stars:>500`、直近 90 日に push があるもの、`AwesomeDS/data/sources/blocklist.json` に無いものに限る。`web/SITE-DESIGN.md` の `/rankings` はこのデータを表示する画面で、原則 5「壊れない: 外部 API はビルド時に読まず、コミット済み JSON だけを表示する」に従い、サイトのビルドやページ表示は GitHub API を直接叩かない。更新は `.github/workflows/weekly-growth.yml` が `bot/weekly-growth` への PR でのみ行い、main へは push しない。

## 要点

- 更新の仕組み: `.github/workflows/weekly-growth.yml` は `workflow_dispatch` のみ（スケジュールなし、`dry_run` 既定 true）。`node scripts/fetch-repos.mjs` → `node scripts/extract-brands.mjs` → `node scripts/build-palettes.mjs` → `node scripts/build-fonts.mjs` → `node scripts/discover-candidates.mjs` → `node scripts/validate-data.mjs` → `Plugin/awesome-ds/scripts/sync-ds.sh` → `node scripts/diff-guard.mjs` の順に実行する。意味のある差分があり、かつ dry-run でないときだけ `bot/weekly-growth` に 1 コミットして PR を作る。main への push はしない。
- データ取得の 2 系統: (1) `AwesomeDS/data/sources/curated-repos.json` の owner/repo とカテゴリ（`/repos/{owner}/{name}` を個別取得）、(2) `topic:design-system stars:>500 pushed:>{90日前}` の GitHub 検索 API 上位 20 件から blocklist を除いたもの。両方を 1 つの `repos[]` 配列にマージし、`stars` の降順で並べる。
- カテゴリ一覧（`CURATED` のキーで確認できる区分）: `component-library`、`headless`、`animation`、`animated-components`、`3d`、`icons`、`dataviz`、`styling`、`design-tokens`、`fonts`、`agent-skills`、`ai-ui`、`design-tools`、`framework`、`tooling`、および検索由来の `topic:design-system`。Knowledge のカテゴリ（component-libraries、animation、skills など）とは名前も粒度も一致しない、独立した分類であることに注意。
- レート制限対策: `GITHUB_TOKEN` があれば 60/時間から 5,000/時間に上がる（スクリプト冒頭のコメント）。403/429 かつ `x-ratelimit-remaining: 0` を検知すると `x-ratelimit-reset` まで最大 15 分（`MAX_WAIT_MS`）待って再試行し、それを超えるとエラーで打ち切る。5xx と 429 は最大 3 回まで指数的に間隔を空けて再試行する。
- 失敗時のフォールバック: 1 リポジトリの取得に失敗しても全体を止めず、`meta.fetchErrors` に記録した上で「前回ファイルの値を維持」または「`stars: null`、`note: "fetch failed: ..."`」で埋める。`repos.length` が `CURATED` のキー数より少ない（内部エラー）場合のみファイルを書き込まずに終了する（`missing` 件数は `meta.counts.missing` に記録）。
- 出力形式（`AwesomeDS/data/repos.json`）: `meta`（`description`、`updated`、`sources`、`license`、`generator`、`counts`、`categories`、`fetchErrors`）と `repos[]`（`owner`、`name`、`url`、`description`、`stars`、`forks`、`language`、`topics`、`pushedAt`、`license`、`archived`、`category`、`fetchedAt`、任意で `inTopicTop` / `note`）。

## 具体的な値・ルール（あれば）

```bash
# 手動実行（ローカル、GITHUB_TOKEN を推奨）
GITHUB_TOKEN=... node scripts/fetch-repos.mjs

# ネットワークなしで前回値を維持したまま再生成（テスト用）
node scripts/fetch-repos.mjs --no-fetch

# 既知の GitHub API レスポンス配列をオフラインで取り込む
node scripts/fetch-repos.mjs --seed <file.json>
```

| 項目 | 値 |
|---|---|
| 更新スケジュール | 手動の `weekly-growth.yml` のみ。定期実行は未設定 |
| トークンなしのレート制限 | 60 リクエスト/時間 |
| トークンありのレート制限 | 5,000 リクエスト/時間 |
| topic 検索の対象 | `topic:design-system stars:>500`、直近 90 日、blocklist 除外、上位 20 件 |
| 待機上限 | 15 分（`MAX_WAIT_MS`）を超える reset 待ちはエラーで打ち切り |
| 失敗時の挙動 | 前回値を維持、または `stars: null` + `fetchErrors` に記録、部分書き込みはしない |

本タスクで実測したスター数の桁差の例（GitHub 検索 API、2026-09-07 時点、`fetch-repos.mjs` の `CURATED` にも `tt-a1i/archify`、`obra/superpowers`、`ibelick/ui-skills` などが含まれる）。

| リポジトリ | 分野 | stars |
|---|---|---|
| obra/superpowers | Agent Skills / SDLC 方法論 | 282,566 |
| tt-a1i/archify | 図生成 Agent Skill | 51,537 |
| ibelick/ui-skills | Agent Skills レジストリ | 8,206 |
| ibelick/motion-primitives | アニメーション UI キット | 6,224 |
| coleam00/excalidraw-diagram-skill | 図生成 Agent Skill | 4,706 |
| codse/animata | アニメーション UI キット | 2,784 |
| vercel/ai-elements | AI チャット UI コンポーネント | 2,407 |
| mahip-kakan/diagram-design | 図生成 Agent Skill | 2 |

## AwesomeDS への反映

- 反映不要: `/rankings` と `AwesomeDS/data/repos.json` は Web サイトのデータ機能であり、AwesomeDS のトークンやコンポーネント規約そのものには影響しない。
- 提案（web / データ担当との協議事項として記録、AwesomeDS 本体の変更ではない）: `stars` だけを唯一の指標として並べ替えると、本タスクで実測したように同カテゴリ内でも 4 桁近く差が開くことがある（マーケットプレイス掲載やバイラルな紹介記事などコード品質と直接関係しない要因の影響を受けやすい）。`/rankings` の UI に脚注として「スター数は人気の一指標であり品質を保証しない」旨と `meta.updated`（最終取得日）を明示することを推奨する。
- 記録: `Plugin/awesome-ds/skills/knowledge-curator/reference/watchlist.md` に `scripts/fetch-repos.mjs` の週次実行を監視対象として追記済み。`knowledge-curator` の週次ルーティン（SKILL.md 4.2）から参照する。

## 出典

- このリポジトリの `scripts/fetch-repos.mjs`、`AwesomeDS/data/sources/curated-repos.json`、`.github/workflows/weekly-growth.yml`。2026-10-11 にファイルを直接読んで確認した。2026-09-07 の計測値は下の表のまま残している。
- https://github.com/tt-a1i/archify : スター数の実例。GitHub 検索 API で 2026-09-07 に確認。
- https://github.com/obra/superpowers : スター数の実例。GitHub 検索 API で 2026-09-07 に確認。
