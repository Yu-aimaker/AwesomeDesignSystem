# CLAUDE.md — AwesomeDesignSystem

AI コーディングエージェント（Claude Code、Cursor など）がこのリポジトリで作業するときの前提です。人間向けの詳細は `README.md` と `CONTRIBUTING.md` を優先してください。

## このリポジトリ

AI コーディングエージェント向けの汎用デザインシステム **AwesomeDS** と、体験サイト `web/`、Claude Code プラグイン `Plugin/awesome-ds/` を置いています。

- 本番サイト: https://awesomeds.yumaker.studio （noindex。Cloudflare Workers Static Assets）。PR のプレビューは Workers Builds が PR にコメントします。workers.dev は https://awesomeds.yumaker.workers.dev 。
- PR に Vercel のステータスが出ても、配信は Cloudflare です。Vercel 側はビルドしない設定なので、その赤は無視してよい。

## 必守ロック（毎回）

1. **特定ブランドを持ち込まない** — 実在の企業・製品のロゴ、ブランド名、ブランド色を AwesomeDS の既定やサイトの装飾にしない。参照元として出典付きで紹介するのは可。図形の種類名（Pyramid、Funnel など）は一般語として可。
2. **青アクセント** — 既定アクセントは `#2f5bea`（リンク・フォーカス・選択）。主ボタンは黒地に白文字。
3. **日本語 UI ファースト** — ナビ・シート・人間向け文言は日本語。識別子・パス・コードは英語可。
4. **非 LP** — マーケティング LP にしない。IA は docs + interactive gallery（`web/SITE-DESIGN.md`）。
5. **モバイル ~390** — 横スクロール破綻なし。sticky / compact nav。変更後は 390 幅の確認を残す。
6. **トークン経由** — `web/` の色・余白・角丸・フォント・時間は `AwesomeDS/tokens` 由来。生 hex を `web/src` に書かない。

## ブランチとマージ（エージェントの仕事）

作業はマージして main を最新にするところまでがエージェントの仕事です。

- 作業ブランチは最新の main から切る。1 ブランチ 1 テーマ。
- 終わったら CI（`.github/workflows/check.yml`）を緑にし、main に入れる。Actions が使えないときは、check.yml の各ステップを手元で全部実行して通ったことを PR か コミットに書く。
- main に入ったら作業ブランチを消す。リモートに残すブランチは `main` と、動いている自動化のブランチ（`bot/weekly-growth`）だけ。
- 衝突は main 側の最新の内容を正として解く。両方の追加を残せるなら両方残す。生成物（`Reference/`、`Knowledge/README.md`、`Plugin/awesome-ds/ds/`、`Plugin/awesome-ds/knowledge/`）は手で直さず再生成する。
- 他のエージェントの開いているブランチと同じファイルを触るときは、そのブランチを先に main に入れてから重ねる。
- main の履歴を書き換える操作（force push、rebase で main を上書き）はしない。

## 非目標（メンテナーの承認が要る）

- リポジトリの可視性変更、Archive、削除
- 配信先（Cloudflare / Vercel）のドメイン・DNS・環境変数・プランの変更（通常の main デプロイ以外）
- 秘密（API キー・トークン）のコミット、ログやチャットへの貼り付け
- 有料機能・従量課金の有効化（Actions の課金、API キーでの AI 呼び出しを含む）
- プラグインの公開マーケットプレイスへの登録
- GitHub Actions から AI を呼ぶジョブ（`ANTHROPIC_API_KEY`、`claude-code-action`）。CI の `check-workflows.mjs` が止める

## 読む順

1. `README.md` — 全体像・スキル表
2. `CONTRIBUTING.md` — Knowledge / AwesomeDS / web / PR 規則
3. `web/SITE-DESIGN.md` — サイト IA・ノブ・検査定義
4. `AwesomeDS/DESIGN.md` + `AwesomeDS/foundations/` — DS 正本

## 構成（短縮）

```
AwesomeDS/     DESIGN.md, tokens/, foundations/, components/, data/, CHANGELOG
Knowledge/     出典付き知見
Reference/     自動生成リンク一覧（手編集しない）
Plugin/awesome-ds/  skills ×7 + cursor rules + ds 同期コピー
web/           Vite + React 19 + Tailwind 4 体験サイト
scripts/       validate / build-reference / 週次データ
docs/          週次の仕組み、i18n、キャラクター、レポートとスライドの生成仕様、ブランド素材
.github/workflows/  check, weekly-growth（docs/weekly-growth.md）
```

スキル: `awesome-ds` / `ds-creator` / `design-verifier` / `design-thinking` / `knowledge-curator` / `html-report` / `slides`

## 作業ルール

- **1 PR 1 テーマ**。CI 緑を目標
- AwesomeDS 値変更時: `DESIGN.md` + tokens 三本 + `foundations/` 理由 + `CHANGELOG` + `Plugin/awesome-ds/scripts/sync-ds.sh`
- Knowledge 追加後: `node scripts/build-reference.mjs` と `bash Plugin/awesome-ds/scripts/sync-ds.sh`（`Reference/`、Knowledge README、`Plugin/awesome-ds/knowledge/` は手編集しない）
- web ローカル:

```
cd web && pnpm install && pnpm dev
pnpm build
pnpm screenshot   # 全ルート × 390/1280 × ライト/ダーク（必要時）
```

- UI 変更の Done: 受け入れ条件を満たす + 可能なら 390 スクショメモ + コンソールエラー 0
- このリポジトリは公開を前提にする。個人の運用メモ、チケット番号だけの文書、内部のインフラ ID（DNS レコード id など）は置かない

## 書き方

- 短く具体的に。比喩・飾りの形容詞・em ダッシュ（—）は使わない（`CONTRIBUTING.md` と同じ）
- 主張には確認済み出典 URL を付ける
