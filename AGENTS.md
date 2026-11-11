# AGENTS.md

このリポジトリで作業するエージェントのルールです。人間向けの手順は `README.md` と `CONTRIBUTING.md`、詳細は `CLAUDE.md` を優先してください。

## コミットの作者

author と committer は、名前とメールの両方を次の一組にします。

`Yu-aimaker <200000358+Yu-aimaker@users.noreply.github.com>`

- 作業を始める前に `bash scripts/setup-git-identity.sh` を実行する。このスクリプトは今のリポジトリの local 設定だけを書く。global は変えない。
- 自動化も `GIT_AUTHOR_NAME`、`GIT_AUTHOR_EMAIL`、`GIT_COMMITTER_NAME`、`GIT_COMMITTER_EMAIL` の 4 つをこの一組にする。
- コミットする前に、PR の base から head までの全コミットを `node scripts/check-identity.mjs --base <base> --head <head>` で確認する。最後の 1 件だけを見ない。
- メールアドレスをログ、コミットメッセージ、PR 本文に出さない。

## ブランチ

- main へ直接 push しない。変更は PR で出す。
- force push をしない。`bot/weekly-growth` も fast-forward だけにする。分岐していたら止めて報告し、履歴は消さない。
- 承認済みのマージ経路を確認するまで、自動マージしない。Check の identity 検査が緑でも、GitHub が後から作る squash や merge コミットの作者は別途確認する。

## 週次は二段

1. Actions の週次は、新しい情報を集めて Knowledge に追記する PR を 1 本出す。追記先は Knowledge のエントリ、サイト候補、OSS 候補、生成した Reference、および Knowledge のプラグイン写しだけ。
2. AwesomeDS、Plugin の skills、web は週次では変えない。DS とサイトへの反映は、別の AI 手順が行う。
3. 週次の差分が許可パスの外に出たら、その実行は失敗させる。

候補は未採用のまま Knowledge に残す。ウェブで見つけた項目を、その実行の中で DS やサイトへ採用しない。
