---
title: "おすすめサイト一覧 (/sites) の取り込み基準"
category: research
type: guideline
sources:
  - url: https://github.com/Yu-aimaker/AwesomeDesignSystem/blob/main/AwesomeDS/data/sites.json
    title: "AwesomeDS/data/sites.json（一覧の本体）"
  - url: https://github.com/Yu-aimaker/AwesomeDesignSystem/blob/main/scripts/sites.mjs
    title: "scripts/sites.mjs（検査と取り込み）"
  - url: https://docs.github.com/en/rest/repos/repos#get-a-repository
    title: "GitHub REST: Get a repository（stargazers_count、pushed_at、license、archived）"
tags: [sites, component-library, animation, loading, gallery, intake, criteria]
updated: 2026-10-21
---

# おすすめサイト一覧 (/sites) の取り込み基準

## 概要

UI を作るときに見に行くサイトの一覧を `AwesomeDS/data/sites.json` に置く。分類はコンポーネントライブラリ、アニメーション、ローディング、見本帳、道具と資料、スキルの 6 つ。どの項目も下の基準を `scripts/sites.mjs` で検査してから入れる。足すときも更新するときも同じ検査を通す。更新は今は手で `--network --refresh` を回す（週次の自動更新にはまだ入れていない）。

## 要点

基準（全部満たしたものだけ入れる）:

| 基準 | 中身 | 検査 |
|---|---|---|
| 一次情報 | `url` は公式サイトかリポジトリ。短縮 URL と X の投稿は不可。`source` も https | オフライン |
| リンクが生きている | リダイレクトをたどって 200。別のドメインへ移ったものは新しい URL に直す | `--network` |
| 更新が新しい | リポジトリの最終 push が、検査日から 12 か月以内 | オフライン（`meta.updated` 基準）と `--network` |
| ライセンスが分かる | コードを配る分類（部品、アニメーション、ローディング、スキル）は SPDX か、ライセンス文の URL 付きの名前。GitHub が NOASSERTION と返すもの（MIT + Commons Clause など）は名前と URL を書く | オフライン |
| 止まっていない | archived でない。説明に deprecated、unmaintained がない | `--network` |
| 重複なし | id、URL（www・大文字・末尾の / を無視）、リポジトリが一意 | オフライン |
| 分類 | 上の 6 分類のどれか。コードを配る分類はリポジトリ必須 | オフライン |
| 最低の信号 | スター 1,000 以上か、`publisher`（作っている組織）を書く。リポジトリのないサイトは `publisher` 必須 | オフライン |
| 説明 | 日本語の 1 行、80 字以内。em ダッシュ、改行、アカウント名（@...）を入れない | オフライン |
| 見つけ方を残さない | どこで見つけたか、誰が保存したかの項目（via、source_post、bookmark、like など）を持たない。あれば不合格 | オフライン |

12 か月にした理由: 半年だと、完成して変更の少ないライブラリ（Headless UI、Park UI など）まで落ちる。1 年 push がないものは、React やブラウザの変化に追いついていないことが多い（例: SpinKit は 2020 年、Vaul は 2025-10 が最後）。

コマンド:

```
node scripts/sites.mjs                              # オフライン検査。CI の validate-data.mjs からも呼ぶ
node scripts/sites.mjs --network                    # 全項目の URL と GitHub を実際に読む
node scripts/sites.mjs --network --refresh          # スターと更新日を更新し、落ちた項目を外す（今は手で回す）
node scripts/sites.mjs --intake candidates.txt      # 候補を検査して合否と理由を出す
node scripts/sites.mjs --intake candidates.txt --write --report report.json   # 合格だけ足す
```

候補の形式（1 行 1 件、`#` で始まる行は無視）:

```
category | url | 名前 | 一行説明 | repo=owner/name license=MIT licenseUrl=https://... publisher=組織名
```

- 値の空白は `_` で書く（`publisher=Tailwind_Labs`）。使えるキーは repo、license、licenseUrl、publisher、source だけ。ほかのキーは不合格にする。via、source_post、bookmark、like などの見つけ方の項目は、名前を挙げて不合格にする。
- 例は `AwesomeDS/data/sources/site-candidates.example.txt`。
- X で見つけた候補は、公式 URL と公開の事実（スター、ライセンス、更新日）だけをこの形式にする。保存やいいねの記録、元の投稿の URL はリポジトリに入れない。候補ファイル自体もコミットしない。
- 403、429、5xx、タイムアウトは一時的な失敗として扱う。`--refresh` では外さずに警告だけ出す。取り込み（`--intake`）では不合格にして、次の回に回す。

## AwesomeDS への反映

- サイトの `/sites` がこのデータを表示する。ビルドもページも外部 API を読まない（`web/SITE-DESIGN.md` の原則「壊れない」）。
- 一覧は紹介で、AwesomeDS の既定ではない。既定の部品は shadcn/ui と Base UI、動きは Motion のまま。
- Commons Clause 付き（React Bits、Animate UI）は販売に制限がある。使う前にライセンス文を読む。

## 出典

- [AwesomeDS/data/sites.json](https://github.com/Yu-aimaker/AwesomeDesignSystem/blob/main/AwesomeDS/data/sites.json)
- [scripts/sites.mjs](https://github.com/Yu-aimaker/AwesomeDesignSystem/blob/main/scripts/sites.mjs)
- [GitHub REST: Get a repository](https://docs.github.com/en/rest/repos/repos#get-a-repository)
