# [SPEC] 週次自動成長の作り直し（Actions・PR経由・本番無影響）

状態: 実装済み（STA-91。PR #17 は main に入っている）。2026-10-14 に冒頭を現行へ合わせた。対象リポは `Yu-aimaker/AwesomeDesignSystem`。

## 現行（2026-10-14）

配信は Cloudflare Workers Static Assets。本番は https://awesomeds.yumaker.studio 。プレビューは Workers Builds が PR にコメントする。workers.dev は https://awesomeds.yumaker.workers.dev 。Vercel プロジェクト `awesome-design-systems-claude` は 2026-10-12 に pause した。手順の正本は [cloudflare-cutover.md](../ops/cloudflare-cutover.md) と [cloudflare-rollback.md](../ops/cloudflare-rollback.md)。

週次は `.github/workflows/weekly-growth.yml`。月曜 09:30 JST（cron `30 0 * * 1`）の schedule は PR を出せる。手動の `workflow_dispatch` は `dry_run` 既定 true で PR を作らない。候補は `AwesomeDS/data/candidates.json` に溜め、サイトには出さない。Actions は AI API を呼ばない。

自動マージは `.github/workflows/weekly-growth-settle.yml`。Check が成功し、差分が `AwesomeDS/data/` と `Plugin/awesome-ds/ds/data/` だけで、作者がボットだけのとき、`bot/weekly-growth` を squash merge する。失敗、人のコミット、許可外のパスではその PR を閉じ、消すブランチは `bot/weekly-growth` だけ。main へは push しない。この段落は下の §9「2026-10-12 追記」と同じ。D-1 の「当面なし」よりこちらが優先する。

`update-data.yml` と `weekly-research.yml` はリポジトリに無い。

下の §0 以降は 2026-10-11 05:00 JST の設計記録（v0.2）。当時の「デプロイは Vercel」「実装は承認後」「`update-data.yml` が残っている」は現行ではない。

関連: STA-17（[SPEC] Knowledge収集と週次更新。本 SPEC で置き換える案）、STA-42 の Sir FB「参考DS／ガイドライン／クックブックをもっと増やす（Sir 指定以外も調査して入れる）」、STA-94 の対応表は [sta-94-cause-map.md](../extensions/sta-94-cause-map.md)。

## 0. 根拠にした現状（2026-10-11 の読み取り。現行は冒頭）

| 項目 | 現状 | 出典 |
|---|---|---|
| `update-data.yml` | 月曜 00:30 UTC（09:30 JST）。`fetch-repos` → `extract-brands` → `build-palettes/fonts` → `validate-data` → `sync-ds.sh` → **main へ直接 push**。`contents: write`。10-11 04:28 JST に PR Watch が `gh workflow disable` で停止（`disabled_manually`） | main の workflow、`gh workflow list` |
| `weekly-research.yml` | 月曜 00:00 UTC に「Weekly research」Issue を開くだけ。Claude 課金ジョブは削除済み。テンプレ `.github/weekly-research-template.md` には「`ANTHROPIC_API_KEY` を設定すると自動で走る」と古い記述が残っている | main |
| `check.yml` | PR と main push。repo ジョブ（build-reference 差分、validate-knowledge、check-sync、validate-data、manifest JSON）と web ジョブ（tsc、build、Playwright 全ルート smoke）。`timeout-minutes` なし、Playwright キャッシュなし。`scripts/check-links.mjs` は CI で呼ばれていない | main |
| `scripts/fetch-repos.mjs` | CURATED（109 件、コード内に直書き）＋ `topic:design-system` 上位 20。失敗時は前回値を保持し、部分ファイルは書かない設計 | main |
| topic 検索のノイズ | 上位に `donnemartin/system-design-primer`（37 万★、デザインシステムと無関係）、`gztchan/awesome-design` など。ランキングに混ざっている | `AwesomeDS/data/repos.json`（10-05） |
| `extract-brands.mjs` | voltagent/awesome-design-md と kzhrknt/awesome-design-md-jp を clone して brands.json（261 社）を生成。新ブランドは自動で増える | main |
| /sources（フラッグシップ DS 27 件） | `web/src/lib/design-systems.ts`（606 行）に直書き。OGP 画像は `web/public/ogp/*.jpg` にコミット。`scripts/fetch-flagship-ogp.mjs` は検査のみで書き込まない | PR #9〜#14 のブランチ |
| リポ設定 | private。main の branch protection なし、rulesets なし。`allow_auto_merge: false`。Actions の既定権限 `read`、`can_approve_pull_request_reviews: false`（= GITHUB_TOKEN で PR を作れない設定） | `gh api` |
| デプロイ | Vercel Git 連携。本番は main のみ。PR はプレビュー（SSO 保護） | status-2026-10-11.md |

守るべきロック（CLAUDE.md）: Funnel-free、日本語 UI ファースト、非 LP（docs + gallery）、トークン経由、秘密をコミットしない、**usage credits / `ANTHROPIC_API_KEY` を使わない、GitHub Actions の Claude Action を本線にしない**、1 PR 1 テーマ。

## 0.5 Sir の意図との対応（AwesomeDS-Leadノート §2・§3）

| Sir の意図・ロック | この SPEC での扱い |
|---|---|
| 課金はサブスクのみ。API キー・従量課金は使わない（Vault SSOT 09-06、CLAUDE.md） | Actions 内の AI は 0。AI が要る作業は箱 Claude の Teams サブスク枠だけ（§5）。`ANTHROPIC_API_KEY`・`claude-code-action`・usage credits を CI で禁止パターンとして検査（§6.3） |
| 意味のある CI。儀式的な CI は禁止。TDD 重要（Vault SSOT 追記-CI-TDD方針） | 追加するチェックはすべて「実際に起きた、または起こりうる壊れ方」を 1 つずつ止めるものに限る（§6.3 の「止める事故」列）。新スクリプトは先に失敗するテスト（壊したデータの fixture）を書き、赤を確認してから実装する（§6.7） |
| 実装前に SPEC/ADR（Vault SSOT） | この票で設計を固め、Sir 承認まで実装しない（§8 Phase 0） |
| Sir 承認と PR が必須。破壊的な force 禁止 | main への変更は必ず PR。ボット PR のマージは当面 Sir（または Sir が委任した Jarvis）の承認後。force push はボット専用ブランチ `bot/weekly-growth` の作り直しに限り、他ブランチでは行わない（§6.1） |
| 参照は自分で調べて増やす（STA-41/42 Sir） | 候補の機械収集（§4.3）で毎週の調査を自動化。採用は人が判断 |
| /sources は実 OGP 画像付きカード。URL の羅列は禁止。実 OGP が出ないのは重大（STA-35、STA-41 Sir、Vault 知見） | /sources 候補は「og:image が実在し、取得でき、1200x630 前後」でなければ候補に出さない。採用 PR では OGP 画像をコミットし、CI の画像検査（§6.3）で欠落・壊れ画像を失敗にする。ポスター（代替画像）での採用は例外として PR 本文に理由を書く |
| AI スロップの排除。デザイン思考必須（Vault カード） | AI 生成文の自動コミットはしない。Knowledge 本文と ja/en 説明は箱 Claude が書き、出典 URL 付き・CONTRIBUTING の文体規則（em ダッシュ・飾りの形容詞なし）を validate-knowledge で検査し、人がレビューしてから別 PR でマージ。候補は「誰の何の役に立つか」を 1 行で書けないものは採用しない |
| 検証は自分たちでやる。Sir に頼まない（STA-55 Sir） | dry-run・本番手動実行・PR 画面の確認は STARK 側（箱 Claude の Playwright、Grok Bot のデスクトップ）で行い、スクショを残す |
| Funnel-free、非 LP、日本語 UI ファースト（CLAUDE.md） | データ更新だけで UI 文言・ブランド要素は変えない。候補をサイトに出さない（D-6）。PR 本文・通知は日本語 |
| 1 PR 1 テーマ | 実装は PR-a〜d に分ける（§8）。ボット PR もデータ更新だけ |

## 1. ゴール

1. 週 1 回、ランキング（GitHub スター等）とブランド配色データを最新にする。
2. 週 1 回、新しいデザインシステム・ガイドライン・OSS・DESIGN.md・Agent Skill の**候補**を機械的に集め、人（または箱の Claude サブスク枠）が採否を決められる形で出す。Sir FB「参考をもっと増やす」を継続的に満たす仕組みにする。
3. どの変更も**ボットブランチ → PR → CI 緑 → マージ**の経路だけで main に入る。
4. 失敗しても本番（awesomeds.yumaker.studio）と main は一切変わらない。
5. 変化があった週と失敗した週だけ通知する。何もない週は静か。

## 2. 非ゴール

- AI による Knowledge 本文や DS 値（DESIGN.md / tokens / foundations）の自動書き換え。DS 値の変更は従来どおり人の判断で別 PR。
- 候補の自動採用（ランキングの CURATED や /sources への自動追加はしない。採用は PR 上の人の判断）。
- Cloudflare 移行（Jarvis 判断待ち。本 SPEC はホスティングに依存しない）。
- 宣伝・マーケティング要素（Funnel 等）の追加、LP 化。
- 研究リポ（design-thinking-plugin）への適用。

## 3. 全体像

```
[月 09:30 JST schedule / workflow_dispatch]
  weekly-growth.yml
    job collect   (contents: read, ネットワーク取得だけ)
      ├─ fetch-repos.mjs        → AwesomeDS/data/repos.json
      ├─ extract-brands.mjs     → brands.json
      ├─ build-palettes / fonts → palettes.json / fonts.json
      ├─ discover-candidates.mjs（新）→ AwesomeDS/data/candidates.json
      ├─ probe-ogp.mjs（新、/sources の og:image 生存確認。書き込みは report のみ）
      ├─ validate-data.mjs ＋ diff-guard.mjs（新）
      └─ artifact: 変更ファイル一式 + report.md
    job propose   (needs collect、変更ありかつ dry_run=false のときだけ)
      ├─ main から bot/weekly-growth を作り直し、artifact を適用して commit
      ├─ bot ブランチにだけ push（main への push 経路はコードに存在しない）
      ├─ 既存の open ボット PR があれば更新、なければ作成（常に 1 本）
      └─ check.yml を bot ブランチで起動（後述 6.2）
    job notify    (失敗時のみ、Issue 1 本に集約)

  check.yml（既存を強化）→ PR の必須チェック
```

## 4. データソース

### 4.1 ランキング（決定的、AI なし）

- GitHub REST `/repos/{owner}/{name}`（現行）。将来は GraphQL で 1 クエリ 100 件ずつにまとめ、API 呼び出しを約 110 → 2 回に減らす（任意改善）。
- CURATED をコードから `AwesomeDS/data/sources/curated-repos.json`（`{ "owner/name": "category" }`）へ移す。候補の採用が「JSON 1 行追加の PR」で済むようにするため。
- topic 検索は `topic:design-system` 単独をやめ、`topic:design-system stars:>500 pushed:>{90日前}` ＋ 除外リスト `AwesomeDS/data/sources/blocklist.json`（`system-design-primer` 等）にする。ランキングへの自動混入は「topic 枠」として現行どおり残すかは決定事項 D-5。

### 4.2 ブランド配色（決定的、AI なし）

- 現行の `extract-brands.mjs` を継続（awesome-design-md / -jp の新ディレクトリで自然に増える）。
- 減少（上流で削除）は diff-guard で検知し、5 社以上減ったら PR を作らず失敗扱い。

### 4.3 新リソース候補（決定的に収集、採否は人）

`scripts/discover-candidates.mjs`（新）が次を集めて `AwesomeDS/data/candidates.json` に追記する。

| 種類 | 収集方法 | 判定に使う機械的な指標 |
|---|---|---|
| OSS（コンポーネント、ヘッドレス、モーション、トークン、Agent Skill） | GitHub Search: `topic:design-system` / `design-tokens` / `ui-components` / `shadcn` / `agent-skills`＋`design` 等、`stars:>300 pushed:>90日前` | stars、7 日差分（前回値との比較）、license、archived |
| デザインシステム・ガイドライン（/sources 候補） | 監視リポ（awesome-design-systems 系のキュレーションリスト、awesome-design-md / -jp の新ディレクトリ）の差分から URL を抽出 | URL 200 応答、**og:image が実在し取得でき 1200x630 前後**（満たさないものは候補にしない）、https |
| 既存エントリの更新 | `knowledge-curator/reference/watchlist.md` の GitHub リポの releases（`/repos/{r}/releases?per_page=1`）と `git ls-remote` | 新 tag の有無 |

- 既に CURATED / /sources / blocklist / 却下済み（`status: rejected`）にあるものは出さない。これで毎週同じ候補が出ない（冪等）。
- `candidates.json` の各要素: `id, kind, url, title, description(原文), stars, firstSeen, lastSeen, signals{}, status(new|accepted|rejected|watching), note`。
- サイトには表示しない（D-6 で「ウォッチ中」表示を検討）。

## 5. AI を使う場所と手段

原則: **Actions の中では AI を使わない**。トークン 0、外部課金 0。

| 作業 | 方法 | AI | 費用 |
|---|---|---|---|
| スター・配色・パレット更新 | Node スクリプト | 不要 | 0（GITHUB_TOKEN） |
| 候補の収集・重複排除・足切り | Node スクリプト＋閾値 | 不要 | 0 |
| 候補の採否、カテゴリ付け | PR 上で人がチェック、または箱 Claude（Teams サブスク枠、`claude -p --model sonnet`）が週 1 回 PR を読んで提案コメント | 必要（軽い分類） | 追加課金 0（既存サブスク） |
| 採用した資料の Knowledge 本文、/sources の ja/en 説明文 | 箱 Claude（Opus、tmux）で `knowledge-curator` を実行し、別 PR | 必要（要約・翻訳） | 追加課金 0（既存サブスク） |

- `ANTHROPIC_API_KEY` と `anthropics/claude-code-action` は使わない（CLAUDE.md の禁止事項）。
- 代替案として GitHub Models（GITHUB_TOKEN の `models: read`、無料枠・レート制限あり）で候補の 1 行要約を Actions 内で作る案がある。従量課金を有効にしない限り無料だが、外部 AI 呼び出しが Actions に入るので D-3 として Sir 判断に回す。既定は使わない。

## 6. PR・CI・安全設計

### 6.1 ブランチと PR

- ブランチ名は固定 `bot/weekly-growth`。毎回 main の最新から作り直す（rebase や merge をしない）。
- push 先は `bot/` で始まるブランチだけ。workflow 内で `[[ "$BRANCH" == bot/* ]] || exit 1` を必ず通す。`git push origin HEAD:main` 相当の行はリポに存在させない（CI で grep して禁止、6.3）。
- open のボット PR は常に最大 1 本。既にあれば force-with-lease で同じブランチを更新し、PR 本文を書き換える。
- 人がボットブランチに手でコミットしていたら（author が bot 以外）、上書きせず失敗通知だけ出す。
- main との差分が「`updated` / `fetchedAt` / `meta.counts` などの日付・集計だけ」の場合は意味のある変更なしとみなし、PR を作らない（既存 PR があれば閉じる）。
- PR 本文（日本語）: 変化の要約（スター上位の増減、新規ブランド、削除、fetchErrors）、新候補一覧（チェックボックス）、diff-guard の数値、実行ログへのリンク。
- ラベル `bot:weekly-growth`。タイトル `data: 週次更新 YYYY-MM-DD`。
- コミットは 1 つ。squash マージ前提。戻すときは revert 1 回で済む。
- マージは当面 Sir（または Sir が委任した Jarvis）の承認後に人が行う。自動マージは D-1。

### 6.2 PR で CI を確実に走らせる

GITHUB_TOKEN で作った PR / push では `pull_request` / `push` のワークフローが起動しない（GitHub の仕様）。対策は次のどちらか（D-2）。

- 案 A（新しい資格情報なし）: `check.yml` に `workflow_dispatch` を足し、propose ジョブが `gh workflow run check.yml --ref bot/weekly-growth` で起動する。チェックは head SHA に付くので PR に表示される。必要権限は `actions: write`。
- 案 B: このリポだけに入れた GitHub App（contents / pull_requests の write のみ）を `actions/create-github-app-token` で使う。PR 作成で通常どおり `pull_request` CI が走る。App の作成と秘密鍵の登録は Sir の作業。

どちらでも、リポ設定「Allow GitHub Actions to create and approve pull requests」の有効化が要る（案 A の場合。現在は無効）。設定変更なので Sir 判断。

### 6.3 CI（check.yml の強化。全 PR に効く）

各チェックは止める事故が言えるものだけを置く（儀式的な CI にしない）。

| チェック | 内容 | 失敗条件 |
|---|---|---|
| schema | `validate-data.mjs` に `candidates.json`、`sources/*.json` のスキーマを追加 | 型・必須項目・重複・URL 形式 |
| diff-guard（新、ボット PR だけ厳格。止める事故: 上流の形式変更や API 障害でデータが空・激減したまま本番に出る） | main との比較 | repos が 5% 以上 or 50 件未満に減る、CURATED の項目が消える、brands が 5 社以上減る、1 リポのスターが 50% 以上減る、許可パス以外の変更（許可: `AwesomeDS/data/**`、`Plugin/awesome-ds/ds/data/**`）、1 ファイル 1MB 超 |
| 禁止パターン（止める事故: main 直 push や課金ジョブの再混入。PR #7 で一度削除した経緯） | `.github/workflows/**` に main への push、`ANTHROPIC_API_KEY`、`claude-code-action` が無いこと | 見つかったら失敗 |
| 内部リンク（止める事故: STA-55 の /foundations 404） | 既存 `scripts/check-links.mjs` を CI に追加 | リンク切れ 1 件以上 |
| OGP 画像（止める事故: STA-41 の「実 OGP が出ていないのに検証が通った」） | `web/public/ogp/*` が参照と一致、1200x630（±2px）、200KB 以下、JPEG/SVG。/sources の参照先ファイルが存在 | 不一致 |
| 外部リンク（新候補だけ） | 候補 URL の HTTP 応答と og:image の実在 | 4xx/5xx・og:image なしの候補は候補から外し、PR 本文に件数だけ書く。外部要因でフレークするので CI はブロックしない |
| build | `tsc --noEmit`、`pnpm build` | 失敗 |
| smoke | Playwright 全ルート（既存）。`timeout-minutes: 20`、`~/.cache/ms-playwright` をキャッシュ | 失敗・タイムアウト |
| plugin 同期 | `check-sync.sh`（既存） | 差分 |

### 6.4 本番に影響しない理由（fail closed）

- collect は `contents: read`。書き込み権限があるのは propose だけで、push 先は bot ブランチに限定。
- どのステップが失敗しても、それ以降は走らない。main もボットブランチも変わらない。前回のデータがそのまま本番に残る。
- 本番デプロイは main だけ。ボット PR はプレビューのみ。
- 部分ファイルを書かない既存設計（fetch-repos / extract-brands）を維持。
- 自動マージは既定で無し（D-1）。

### 6.5 通知

- 変化あり: PR が通知そのもの（GitHub 通知）。Linear には書かない（ノイズを避ける）。
- 失敗: ラベル `bot:weekly-growth-failure` の Issue を 1 本だけ開くか、既存に追記。次に成功したら自動で閉じる。
- 変化なし: 何もしない（Step Summary にだけ記録）。
- `weekly-research.yml` の毎週 Issue は廃止し、候補がある週だけ PR 本文に載せる形に統合する。

### 6.6 冪等性と同時実行

- `concurrency: { group: weekly-growth, cancel-in-progress: false }`。
- 同じ入力なら同じ出力（並び順固定、日付は差分判定から除外）。同じ週に 2 回走っても PR は 1 本、内容は最新に置き換わるだけ。
- 候補の状態は `candidates.json` に残るので、却下したものは再提案されない。

### 6.7 TDD の進め方

- `diff-guard.mjs`、`discover-candidates.mjs`、OGP 画像検査、`validate-data` 拡張は、先に `scripts/__tests__/`（`node --test`、依存追加なし）に失敗するテストを書く。
- fixture: 正常な週、repos が 30 件に減った週、brands が 10 社減った週、許可外パスの変更、日付だけの差分、既知候補・却下済み候補の再出現、og:image なし／小さすぎる画像。
- 赤を確認してから実装し、緑にする。テストは check.yml の repo ジョブで毎回走らせる。
- ネットワークを使う部分はアダプタに分け、テストでは記録済みレスポンス（fixture JSON）を使う。CI でテストが外部 API に依存しない。

## 7. 失敗モードと挙動

| 失敗 | 挙動 |
|---|---|
| GitHub API のレート制限・障害 | 前回値を保持（既存仕様）。fetchErrors が 10% 超なら PR を作らず失敗通知 |
| 上流 DESIGN.md コレクションの形式変更でブランドが激減 | diff-guard で失敗。PR なし |
| 候補 URL が死んでいる | 候補から除外、PR 本文に件数だけ記載 |
| CI 失敗 | PR は残る。マージされない。失敗 Issue に記録 |
| ボット PR が放置されたまま次週 | 同じ PR を最新内容で更新（1 本のまま） |
| 人がボットブランチを編集 | 上書きしない。失敗通知で知らせる |
| main と競合（人の PR が先にマージ） | 毎回 main から作り直すので競合しない |
| リポ改名・転送 | `${{ github.repository }}` だけを使い、リポ名を直書きしない |
| Playwright 取得で停止 | `timeout-minutes` で打ち切り。キャッシュで再発を減らす |
| 誤って秘密や大きなファイルが入る | 許可パス外の変更・1MB 超で失敗 |

## 8. ロールアウト

前提: PR #9〜#14 のマージとリポ改名が終わってから main から切る。PR Watch の作業中ブランチには触らない。

1. **Phase 0**: この SPEC を Sir の意図ノートと突き合わせ、Linear に起票。決定事項 D-1〜D-6 を確認。
2. **Phase 1（実装 PR、1 テーマずつ）**
   - PR-a: check.yml 強化（timeout、Playwright キャッシュ、check-links、OGP 画像検査、禁止パターン、`workflow_dispatch`）。データ処理なし。
   - PR-b: CURATED の JSON 化、blocklist、topic 検索の条件見直し、`diff-guard.mjs`、`validate-data` 拡張。
   - PR-c: `discover-candidates.mjs`、`candidates.json`。
   - PR-d: `weekly-growth.yml`（`workflow_dispatch` のみ、`dry_run` 既定 true）。`update-data.yml` 削除、`weekly-research.yml` 廃止、テンプレと README の「更新の流れ」を新方式に書き換え。
3. **Phase 2（dry-run）**: マージ後、`workflow_dispatch dry_run=true` を 2 回実行。artifact と Step Summary だけを確認（PR は作らない）。
4. **Phase 3（手動本番）**: `dry_run=false` で 1 回。ボット PR 作成、CI 起動、PR 本文、diff-guard を画面で確認し、人がマージ。
5. **Phase 4（定期化）**: `schedule`（月 00:30 UTC = 09:30 JST）を有効化。3 週観察。
6. **Phase 5（任意）**: D-1 で許可が出たら「スター数値だけの変更」に限り自動マージ。

## 9. 決定事項（Sir / Jarvis）

| ID | 内容 | 推奨 |
|---|---|---|
| D-1 | 自動マージを許すか | 当面なし。3 週安定後、「スター等の数値だけ・件数増減なし・CI 緑」に限り許可。ただし private リポで必須チェックを強制する branch protection / ruleset は有料プラン（Pro 以上）が要る可能性があり、未確認。強制できないなら自動マージはしない |
| D-2 | ボット PR で CI を起動する方式 | 案 A（`workflow_dispatch` 起動、新しい秘密なし）。そのためにリポ設定「Actions に PR 作成を許可」を有効化する必要あり（Sir の設定変更） |
| D-3 | Actions 内で AI を使うか | 使わない。採否と本文は箱 Claude（サブスク枠）。GitHub Models 無料枠は保留 |
| D-4 | 候補の採否を誰が見るか | 週 1 回、箱 Claude が PR に採否案をコメント → Jarvis 経由で Sir が承認、または Jarvis に委任 |
| D-5 | topic 検索の上位をランキングに自動で載せ続けるか | 載せる。ただし stars・pushed の条件と blocklist を付ける（現状 system-design-primer が混入） |
| D-6 | 候補（ウォッチ中）をサイトに出すか | 出さない（非 LP・品質優先）。必要なら後で /rankings に小さく |
| D-7 | main の branch protection（main 直 push 禁止を設定で強制） | 推奨。プランで不可なら CI の禁止パターン検査で代替 |
| D-8 | STA-17 の扱い | 本 SPEC で置き換え、Duplicate にする |

### 2026-10-12 追記

Sir は 2026-10-12 に、このパイプラインを月曜 09:30 JST に自動実行すると決めた。Check がそのコミットで成功し、差分がデータディレクトリの中だけかつ作者がボットだけのとき、`bot/weekly-growth` の PR を squash マージする。失敗、人のコミット、許可外のパスでは、その PR を閉じ、削除するのは `bot/weekly-growth` だけにする。main への直接 push はしない。上の D-1 の文は残す。3 週待つ条件と「スター数値だけ」は、このパイプラインについては 2026-10-12 の決定が優先する。diff-guard は安全限界として残る。

## 10. 受け入れ条件

- [ ] main への直接 push 経路がリポ内に 0（CI で検査）
- [ ] dry-run 2 回で PR が作られず、artifact と Summary に差分と候補が出る
- [ ] 本番実行でボット PR が 1 本だけでき、check.yml の全ジョブが PR 上で走る
- [ ] 意図的に壊したデータ（repos を 30 件に減らす）で diff-guard が失敗し、PR が作られない
- [ ] 変化のない実行で PR も Issue も作られない
- [ ] 失敗時は Issue 1 本、次の成功で閉じる
- [ ] `ANTHROPIC_API_KEY`・`claude-code-action`・従量課金の利用 0
- [ ] 新スクリプトのテストが fixture で赤→緑の順に作られ、CI で毎回走る
- [ ] /sources 候補はすべて実 OGP 画像を持つ（ない候補は出ない）
- [ ] README と CLAUDE.md の「更新の流れ」「workflows」記述が新方式と一致

## 11. 実装サブタスク（Linear チェックリスト用）

- [ ] 各 PR とも先に失敗するテストを書く（TDD、§6.7）
- [ ] PR-a check.yml 強化（timeout、Playwright キャッシュ、check-links、OGP 画像検査、禁止パターン、workflow_dispatch）
- [ ] PR-b CURATED の JSON 化、blocklist、topic 検索条件、diff-guard.mjs、validate-data 拡張
- [ ] PR-c discover-candidates.mjs と candidates.json（重複排除・却下記憶）
- [ ] PR-d weekly-growth.yml（dispatch のみ、dry_run 既定 true）、update-data.yml 削除、weekly-research.yml 廃止、README/CLAUDE.md/テンプレ更新
- [ ] dry-run 2 回の確認（artifact・Summary）
- [ ] 本番手動 1 回（ボット PR、CI、画面確認）
- [ ] schedule 有効化と 3 週観察
- [ ] （D-1 次第）数値だけの変更の自動マージ
