# CLAUDE.md — Awesome-Design-Systems-Claude

このファイルは Claude Code（箱 / CI）向けの作業前提です。人間向けの詳細は `README.md` と `CONTRIBUTING.md` を優先してください。

## このリポジトリ

AI コーディングエージェント向けの **汎用デザインシステム AwesomeDS** と、体験サイト `web/`、Claude Code プラグイン `Plugin/awesome-ds/` の本線（Champion）です。

- 本番サイト: https://awesome-design-systems-claude.vercel.app （noindex）
- オーナー判断（Sir）以外で Archive / 可視性変更 / 他リポ削除はしない

## 必守ロック（毎 run）

1. **Funnel-free** — 製品ブランドとしての Funnel / FunnelOrange / STARK 製品バッジを入れない。Knowledge の図形種別名（例: Pyramid / Funnel）は一般語として可。
2. **青アクセント** — 既定アクセントは `#2f5bea`（リンク・フォーカス・選択）。主ボタンは黒地に白文字。
3. **日本語 UI ファースト** — ナビ・シート・人間向け文言は日本語。識別子・パス・コードは英語可。
4. **非 LP** — マーケティング LP にしない。IA は docs + interactive gallery（`web/SITE-DESIGN.md`）。
5. **モバイル ~390** — 横スクロール破綻なし。sticky / compact nav。変更後は 390 幅の確認を残す。
6. **トークン経由** — `web/` の色・余白・角丸・フォント・時間は `AwesomeDS/tokens` 由来。生 hex を `web/src` に書かない。

## 非目標（明示禁止）

次は **やらない**（別ゲート・Sir 承認が必要）:

- 他 AwesomeDS リポの Archive / private / 削除
- Vercel 本番の pause・ドメイン・環境変数変更（本リポの通常 push デプロイ以外）
- 秘密（API キー・トークン）のコミットやチャット貼付
- usage credits / 追加課金の有効化
- 公開 marketplace 化・リポ public 化の独断
- 森本研 Linear / Drive との混同

## 読む順

1. `README.md` — 全体像・スキル表
2. `CONTRIBUTING.md` — Knowledge / AwesomeDS / web / PR 規則
3. `web/SITE-DESIGN.md` — サイト IA・ノブ・検査定義
4. `AwesomeDS/DESIGN.md` + `AwesomeDS/foundations/` — DS 正本
5. （取り込み後）`docs/requirements/` — astra 由来の要件ロック

## 構成（短縮）

```
AwesomeDS/     DESIGN.md, tokens/, foundations/, components/, data/, CHANGELOG
Knowledge/     出典付き知見
Reference/     自動生成リンク一覧（手編集しない）
Plugin/awesome-ds/  skills ×5 + cursor rules + ds 同期コピー
web/           Vite + React 19 + Tailwind 4 体験サイト
scripts/       validate / build-reference / 週次データ
.github/workflows/  check, update-data, weekly-research
```

スキル: `awesome-ds` / `ds-creator` / `design-verifier` / `design-thinking` / `knowledge-curator`

## 箱 Claude（Teams）運用

- ログイン済み Teams 枠のみ。**usage credits / `ANTHROPIC_API_KEY` でサブスクを抜かさない**
- デフォルト本体: `--model opus`（Opus 5.5）。effort は medium が使えるなら medium
- サブエージェント・単純整形: `--model sonnet`
- 短タスク例（**`--bare` 禁止** — OAuth を読まなくなる）:

```
claude -p "..." --model opus --allowedTools "Read,Edit,Bash" </dev/null
```

- 長タスク: `tmux` 対話。GitHub Actions の Claude Action を本線にしない（Actions 分・遅い）

## 作業ルール

- **1 PR 1 テーマ**。CI（`.github/workflows/check.yml`）緑を目標
- AwesomeDS 値変更時: `DESIGN.md` + tokens 三本 + `foundations/` 理由 + `CHANGELOG` + `Plugin/awesome-ds/scripts/sync-ds.sh`
- Knowledge 追加後: `node scripts/build-reference.mjs`（`Reference/` と Knowledge README は手編集しない）
- web ローカル:

```
cd web && pnpm install && pnpm dev
pnpm build
pnpm screenshot   # 全ルート × 390/1280 × ライト/ダーク（必要時）
```

- UI 変更の Done: 受け入れ条件を満たす + 可能なら 390 スクショメモ + コンソールエラー 0

## 役割分担（覚書）

| 役割 | 担当 |
|------|------|
| 実行 | PR Watch＋箱Claude。JarvisはPMのみ。部屋名（Awesome DesignSystems）へのアサイン禁止 |
| 方針・merge・破壊的変更 | Sir |

## 書き方

- 短く具体的に。比喩・飾りの形容詞・em ダッシュ（—）は使わない（`CONTRIBUTING.md` と同じ）
- 主張には確認済み出典 URL を付ける
