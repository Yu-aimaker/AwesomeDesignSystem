# 週次のデータ更新

ランキング（GitHub のスター数）、ブランド配色、新しい参考資料の候補を週 1 回集め、ボットの PR で main に入れる仕組みです。AI は使いません。失敗しても main と本番は変わりません。

## 流れ

```
月曜 09:30 JST（cron 30 0 * * 1）または手動の workflow_dispatch
  weekly-growth.yml
    collect（contents: read）
      fetch-repos.mjs          → AwesomeDS/data/repos.json
      extract-brands.mjs       → brands.json
      build-palettes / fonts   → palettes.json / fonts.json
      discover-candidates.mjs  → AwesomeDS/data/candidates.json
      validate-data.mjs と diff-guard.mjs
    propose（変化があり、dry_run が false のときだけ）
      main から bot/weekly-growth を作り直して commit、PR を 1 本だけ出す
  weekly-growth-settle.yml
    Check が成功し、差分がデータだけで、作者がボットだけなら squash merge
    失敗・人のコミット・許可外のパスなら PR を閉じる
```

- 手動実行の `dry_run` は既定 true で、PR を作りません。Step Summary と artifact だけを残します。
- ボットが push できるのは `bot/` で始まるブランチだけです。main へ push する行はリポジトリにありません（`scripts/check-workflows.mjs` が CI で検査）。
- 自動マージで消すブランチは `bot/weekly-growth` だけです。

## データの出どころ

| データ | 取り方 |
|---|---|
| ランキング | GitHub REST。対象は `scripts/fetch-repos.mjs` の一覧と `topic:design-system` の上位。失敗した項目は前回値を保持し、途中のファイルは書かない |
| ブランド配色 | voltagent/awesome-design-md と kzhrknt/awesome-design-md-jp の DESIGN.md から抽出 |
| 候補 | GitHub Search（design-system、design-tokens、ui-components、shadcn、agent-skills など、stars と更新日で足切り）と、`knowledge-curator/reference/watchlist.md` のリポジトリの新しいリリース。既に載っているもの、除外リスト、却下済みは出さない |
| おすすめサイト | 週次の job にはまだ入れていない。手で `node scripts/sites.mjs --network --refresh` を回し、スターと更新日を更新し、基準を外れた項目を外す。新しい候補は `--intake <file> --write` で検査を通ったものだけ足す。基準は `Knowledge/research/recommended-sites.md` |

候補は `candidates.json` に貯めるだけで、サイトには出しません。採否は人が PR で決めます。/sources の候補は、og:image が実在して取得できるものだけです。

## 止める事故（diff-guard と CI）

| 検査 | 止める事故 |
|---|---|
| diff-guard | 上流の形式変更や API 障害で、データが空や激減のまま main に入る（repos が 5% 以上か 50 件未満に減る、ブランドが 5 社以上減る、1 リポのスターが半分以下になる、許可外のパスの変更、1 ファイル 1MB 超） |
| validate-data | 型、必須項目、重複、URL の形式。sites.json は取り込み基準のオフライン部分（`scripts/lib/sites.mjs`） |
| check-workflows | main への push、`ANTHROPIC_API_KEY`、`claude-code-action` の混入 |
| check-ogp-images と flagship-catalog | /sources の共有画像の欠落や壊れた画像 |
| check-links | サイト内リンクの 404 |

## 失敗したとき

| 失敗 | 挙動 |
|---|---|
| GitHub API のレート制限や障害 | 前回値を保持。取得失敗が 10% を超えたら PR を作らない |
| ネットワークの一時的な失敗 | 取得の手順を30秒あけて1回だけやり直す |
| 上流の形式変更でブランドが激減 | diff-guard で失敗。PR は作らない |
| 候補の URL が死んでいる | 候補から外し、PR 本文に件数だけ書く |
| CI が失敗 | PR を閉じる。main は変わらない |
| settle が PR を閉じた・失敗した | 「週次更新の失敗」issue に書く |
| 人がボットのブランチにコミットした | 自動マージしない。settle が PR を閉じる |
| 同じ週に 2 回走った | PR は 1 本のまま、中身が最新に置き換わる |
| ジョブが始まらない（Actions の枠切れ・課金） | Actions は何も書けない。GitHub の通知と Check の赤で分かる。公開リポの標準ランナーは無料 |

## 手元で試す

```
node scripts/fetch-repos.mjs
node scripts/discover-candidates.mjs
node scripts/validate-data.mjs
node --test scripts/__tests__/weekly-growth.test.mjs
```

`GITHUB_TOKEN` を環境変数に置くとレート制限が緩くなります。トークンはコミットしません。
