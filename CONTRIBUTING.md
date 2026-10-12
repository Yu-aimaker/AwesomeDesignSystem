# Contributing

## 原則

- すべての主張に出典を付ける。URL は実際に開いて確認したものだけを書く。
- AwesomeDS の値を変えるときは、`foundations/` の該当ファイルに理由を書き、`CHANGELOG.md` にバージョンを追記する。
- 文章は短く、具体的に。比喩、飾りの形容詞、em ダッシュ（—）は使わない。

## Knowledge エントリの追加

ファイル: `Knowledge/<category>/<slug>.md`。frontmatter は次の形に固定します。

```yaml
---
title: "名前"
category: <フォルダ名>
type: <repo | library | skill | article | product | guideline | design-system>
sources:
  - url: https://...
    title: "ページやリポジトリの名前"
tags: [lowercase, tags]
updated: YYYY-MM-DD
---
```

本文の見出し: `概要` / `要点` / `具体的な値・ルール（あれば）` / `AwesomeDS への反映` / `出典`。

追加後に必ず実行:

```
node scripts/build-reference.mjs
```

これで `Knowledge/README.md` と `Reference/REFERENCE.md` が再生成されます。手で編集しないでください。

## AwesomeDS の変更

1. `AwesomeDS/DESIGN.md` の frontmatter と本文を更新する。
2. `AwesomeDS/tokens/tokens.css`, `tailwind.css`, `tokens.json` を同じ値に揃える。
3. `AwesomeDS/foundations/<topic>.md` に理由と出典を書く。
4. `AwesomeDS/CHANGELOG.md` に追記する（semver: 値の変更は minor、誤記修正は patch、役割の追加削除は major）。
5. `bash Plugin/awesome-ds/scripts/sync-ds.sh` を実行してプラグイン内のコピーを同期する。

## web

Node 22 と pnpm 10 を使います。コマンドは必ず `web/` で実行します。

```
cd web
pnpm install
pnpm dev
pnpm typecheck
pnpm build
pnpm screenshot   # 全ルートを 390 / 1280 幅、ライト / ダークで撮影
```

CI と同じ確認だけをしたいときは `node scripts/screenshot.mjs --check` を使います（PNG を書かず、コンソールエラーか横はみ出しがあれば exit 1）。

画面の文言は `web/src/i18n/messages/` のカタログに日本語と英語の両方を書きます。仕組みと言語の足し方は `docs/i18n.md`。

サイト内の色、余白、角丸、フォント、時間はすべて `AwesomeDS/tokens` から来ている必要があります。生の hex を書かないでください。ノブ（アクセント / 角丸 / 書体）は `accents.css`、`radius-families.css`、`font-pairings.css` を読みます。

## 検証コマンド（リポジトリ直下）

```
node scripts/build-reference.mjs          # Knowledge/README.md と Reference/REFERENCE.md を再生成
node scripts/validate-knowledge.mjs       # Knowledge の frontmatter と見出し
node scripts/validate-data.mjs            # AwesomeDS/data/*.json
node --test scripts/hosting-smoke.test.mjs scripts/preview-headers.test.mjs  # ヘッダ検査（ネットワークなし）
bash Plugin/awesome-ds/scripts/check-sync.sh   # プラグイン内の DS コピーが AwesomeDS と一致するか
```

本番またはプレビューの実応答を見るときは `node scripts/hosting-smoke.mjs <url> [url...]`。`/`、`/sources`、`/foundations`、`/en/sources`、存在しない `/missing-page` は `node scripts/preview-headers.mjs <url>`。切替手順は [docs/ops/cloudflare-cutover.md](docs/ops/cloudflare-cutover.md)。戻し手順は [docs/ops/cloudflare-rollback.md](docs/ops/cloudflare-rollback.md)。

- リンク確認: `node scripts/check-links.mjs`。相対リンクはファイルの有無で落とします。https は `scripts/external-link-allowlist.txt` に載った URL だけを、失敗時は再試行して確認します。それ以外の外部リンクは取得しません。

## PR

- 1 PR 1 テーマ。
- CI（`.github/workflows/check.yml`）が次を確認します。
  - Reference と Knowledge 索引が最新か（`build-reference.mjs` 後に差分なし）
  - `validate-knowledge.mjs`
  - プラグインの同期（`check-sync.sh`）
  - `validate-data.mjs`
  - `check-links.mjs`（相対リンクと、許容リストの外部リンク）
  - `hosting-smoke.test.mjs` と `preview-headers.test.mjs`（URL へのリクエストはしない）
  - web の typecheck、build、Cloudflare アセット検査（`check-cf-assets.test.mjs`、`check-cf-assets.mjs`、`wrangler deploy --dry-run`）、`screenshot.mjs --check`
