# 週次のデータ更新

ランキング、ブランド配色、新しい参考資料の候補を週 1 回集めます。AI は使いません。失敗しても main と本番は変わりません。

週次は二段です。

1. Actions は新しい候補を集め、Knowledge の OSS 候補とサイト候補、生成した Reference、Knowledge のプラグイン写しだけを PR にします。
2. AwesomeDS、Plugin の skills、web への反映は、別の AI 手順が行います。週次のジョブでは変えません。

## 流れ

```
月曜 09:30 JST（cron 30 0 * * 1）または手動の workflow_dispatch
  weekly-growth.yml
    collect（contents: read）
      fetch-repos.mjs / extract-brands.mjs / build-palettes / build-fonts
      discover-candidates.mjs
      validate-data.mjs と diff-guard.mjs
    propose（新しい候補があり、dry_run が false のときだけ）
      Knowledge に追記し、bot/weekly-growth を fast-forward して PR を 1 本出す
    checkbot（propose がコミットしたとき）
      check.yml を workflow_call で、そのコミットに対して同じ run の中で実行する
    settle（Check が成功したときだけ）
      作者の記録とパスが許可内なら、PR を eligible と報告する
      マージしない。PR も閉じない。ブランチも消さない
  候補が無いときも、開いている PR は残す
  Check が失敗、キャンセル、時間切れのときは PR もブランチも残す
```

- 手動実行の `dry_run` は既定 true です。PR、ラベル、issue、ブランチを変えません。Step Summary と artifact だけを残します。
- 検索が全部失敗したとき、またはリリース確認が途中で落ちたときは、成功した収集として扱いません。`candidates.json` は書き換えず、ジョブを失敗させます。
- ボットが push できるのは `bot/` で始まるブランチだけです。force push はありません。分岐していたブランチは残して報告します。
- main へ push する行はリポジトリにありません（`scripts/check-workflows.mjs` が CI で検査します）。
- 公開してよいパスは `Knowledge/`、`Reference/`、`Plugin/awesome-ds/knowledge/` だけです。それ以外が差分に入ると失敗します。収集中の diff-guard はデータ検査のままです。bot ブランチの Check は `check-publish-paths` を使います。
- OSS 候補のライセンスは MIT、Apache-2.0、BSD-2-Clause、BSD-3-Clause、ISC、0BSD、Unlicense、CC0-1.0 だけです。MPL-2.0 は弱いコピーレフトなので入れません。`NOASSERTION` やライセンス無しは、LICENSE ファイルがその許可リストの本文と一致するときだけ入れます。サイトの一覧、ランキング、Knowledge に既にあるリポジトリは候補にしません。
- `GITHUB_TOKEN` が開いた PR の `pull_request` Check は `action_required` のままジョブが 0 件になることがあります。settle はその Check を待ちません。同じ Weekly growth の run が Check を実行します。
- 開いている bot ブランチへ足すときは、すでにある候補行を消さず、新しい発見だけを追記してから Reference を再生成します。

## データの出どころ

| データ | 取り方 |
|---|---|
| ランキング | GitHub REST。取得結果は検査に使い、PR には入れない。失敗した項目は前回値を保持する |
| ブランド配色 | 収集して diff-guard の検査に使う。PR には入れない |
| 候補 | GitHub Search と watchlist のリリース。新しいものだけを Knowledge の候補表へ追記する。既に載っているもの、除外リスト、却下済みは出さない |
| おすすめサイト | 週次は `Knowledge/research/site-candidates.md` に候補を足すだけ。`sites.json` は変えない |

候補はサイトには出しません。採否は人が、その後の DS 反映の手順で決めます。

## 止める事故（diff-guard と CI）

| 検査 | 止める事故 |
|---|---|
| diff-guard | 上流の形式変更や API 障害で、データが空や激減のまま候補を足す（repos が 5% 以上か 50 件未満に減る、ブランドが 5 社以上減る、1 リポのスターが半分以下になる、1 ファイル 1MB 超） |
| check-publish-paths | bot の PR と dispatch の差分が Knowledge、Reference、Knowledge の写し以外を含む。収集中の diff-guard はデータ用のまま |
| discover-candidates | 検索の全失敗、リリース確認の失敗、または LICENSE 取得の失敗を成功扱いにしない。非許可ライセンスと既掲載のリポジトリは候補にしない |
| validate-data | 型、必須項目、重複、URL の形式 |
| check-workflows | main への push、force push、`secrets.`、大きいランナー、`ANTHROPIC_API_KEY`、`claude-code-action` |
| check-identity | PR 範囲の author、committer、または折り畳みを含む noreply 以外の Co-authored-by / Signed-off-by。main への push の例外は、API で verified、committer が web-flow、親が 2 つ以上、main へ merge された PR の merge_commit_sha と一致するコミットだけ。週次コミットは verified、web-flow、noreply の author、`weekly-growth-receipt` の全部が必要。失敗した API は拒否する |

## 失敗したとき

| 失敗 | 挙動 |
|---|---|
| GitHub API のレート制限や障害 | Retry-After と reset を見て、予算内だけ待つ。予算を超えたら理由を出して止める。前回値は残す |
| 発見が全部、または一部失敗 | ジョブを失敗させる。候補ファイルの更新日は進めない |
| ネットワークの一時的な失敗 | 共有の再試行で、永続的な 401 や 404 はやり直さない |
| dry-run | リモートを変えない。開いている PR も閉じない |
| CI が失敗、キャンセル、時間切れ | PR は開いたまま。ブランチは消さない |
| ボットブランチの前のコミットが、verified の web-flow 署名、noreply の author、このリポジトリの weekly-growth 実行を指す `weekly-growth-receipt` を全部持たない | push しない。履歴は消さない。API の失敗はジョブを失敗させる |
| ブランチが main と分岐している | fast-forward できないので止めて報告する |
| 同じ週に 2 回走った | 開いている PR は 1 本のまま追記する |
| ジョブが始まらない | Actions が無効なら実行自体がない。公開リポジトリの `ubuntu-24.04` だけを使う |

## 手元で試す

```
bash scripts/setup-git-identity.sh
node scripts/fetch-repos.mjs
node scripts/discover-candidates.mjs
node scripts/validate-data.mjs
node --test scripts/__tests__/weekly-growth.test.mjs
```

`GITHUB_TOKEN` を環境変数に置くとレート制限が緩くなります。トークンはコミットしません。ログや PR 本文にも出しません。
