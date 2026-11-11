# AGENTS.md

このリポジトリで作業するエージェントのルールです。人間向けの手順は `README.md` と `CONTRIBUTING.md`、詳細は `CLAUDE.md` を優先してください。

## コミットの作者

author と committer は、名前とメールの両方を次の一組にします。

`Yu-aimaker <200000358+Yu-aimaker@users.noreply.github.com>`

- 作業を始める前に `bash scripts/setup-git-identity.sh` を実行する。このスクリプトは今のリポジトリの local 設定だけを書く。global は変えない。
- 自動化も `GIT_AUTHOR_NAME`、`GIT_AUTHOR_EMAIL`、`GIT_COMMITTER_NAME`、`GIT_COMMITTER_EMAIL` の 4 つをこの一組にする。
- コミットする前に、PR の base から head までの全コミットを `node scripts/check-identity.mjs --base <base> --head <head>` で確認する。最後の 1 件だけを見ない。
- メールアドレスをログ、コミットメッセージ、PR 本文に出さない。`Co-authored-by` と `Signed-off-by` に noreply 以外のメールを書かない。検査は trailer として失敗させる。
- pull_request の検査は、その PR が作った範囲の author と committer をこの一組に限る。
- main への push では、GitHub の API が署名を確認した merge だけを追加で許す。条件は `verification.verified` が true、committer が web-flow、親が 2 つ以上、その SHA が main へ merge された PR の `merge_commit_sha` と一致すること。API が失敗したか項目が欠けたら拒否する。merge でない親には noreply と trailer の検査を掛ける。

## ブランチ

- main へ直接 push しない。変更は PR で出す。
- force push をしない。`bot/weekly-growth` も fast-forward だけにする。分岐していたら止めて報告し、履歴は消さない。
- 承認済みのマージ経路を確認するまで、自動マージしない。pull_request の検査が緑でも、squash の作者は別途確認する。main への push が許す merge コミットは、上の狭い条件だけ。

## 週次は二段

1. Actions の週次は、新しい情報を集めて Knowledge に追記する PR を 1 本出す。追記先は Knowledge のエントリ、サイト候補、OSS 候補、生成した Reference、および Knowledge のプラグイン写しだけ。
2. AwesomeDS、Plugin の skills、web は週次では変えない。DS とサイトへの反映は、別の AI 手順が行う。
3. 週次の差分が許可パスの外に出たら、その実行は失敗させる。

候補は未採用のまま Knowledge に残す。ウェブで見つけた項目を、その実行の中で DS やサイトへ採用しない。開いている週次 PR を次の週が更新するときは、前回の候補行を残して新しい行を足す。

週次の作者の信頼は、コミットメッセージの actor や、メールとアカウントの対応では決めない。週次は Git Data API でコミットを作り、GitHub に署名させ、そのコミットへ `weekly-growth-receipt` という check run を付ける。`external_id` は workflow run id。前のコミットを信頼するのは、次が全部そろうときだけ。API の `verification.verified` が true。committer が web-flow。author のメールが `@users.noreply.github.com` で終わる。check run の名前が `weekly-growth-receipt` で、`app.slug` が `github-actions`。その `external_id` がこのリポジトリの `weekly-growth.yml` の実行。`head_sha` がそのコミット SHA。どれか欠けたら拒否する。API が失敗したらジョブを失敗させる。
