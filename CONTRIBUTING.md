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

```
cd web
pnpm install
pnpm dev
pnpm build
node scripts/screenshot.mjs   # 全ルートを 390 / 1280 幅、ライト / ダークで撮影
```

サイト内の色、余白、角丸、フォント、時間はすべて `AwesomeDS/tokens` から来ている必要があります。生の hex を書かないでください。

## PR

- 1 PR 1 テーマ。
- CI（`.github/workflows/check.yml`）が Reference の再生成、プラグインの同期、web のビルドを確認します。
