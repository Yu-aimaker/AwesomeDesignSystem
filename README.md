日本語 | [English](README.en.md)

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/brand/banner-dark.png">
    <img src="docs/assets/brand/banner-light.png" alt="AwesomeDS: AI コーディングエージェントのための汎用デザインシステム" width="100%">
  </picture>
</p>

<p align="center">
  <a href="#クイックスタート">クイックスタート</a> ·
  <a href="#スキル">スキル</a> ·
  <a href="AwesomeDS/DESIGN.md">DESIGN.md</a> ·
  <a href="https://awesomeds.yumaker.studio">体験サイト</a> ·
  <a href="Plugin/awesome-ds/">プラグイン</a> ·
  <a href="CONTRIBUTING.md">コントリビュート</a>
</p>

# Awesome Design Systems

AI コーディングエージェント（Claude Code, Cursor）でフロントエンドを作るときの、デザインの正本とプラグインです。中心にあるのが汎用デザインシステム **AwesomeDS** です。

白地に黒文字、アクセント 1 色（`#2f5bea`）、Geist + Noto Sans JP、4px グリッド、境界線優先、短いモーション。すべての値に理由と出典があります。

## 3つの用途

AwesomeDS は次の 3 つを同時に満たす。決めた内容は STA-12。

| 用途 | 何をするか | 主な置き場所 |
|---|---|---|
| 1. 開発中の UI にルールを当てる | プラグインを入れると、モダンで AI らしくない UI になる | `awesome-ds` |
| 2. そのプロダクト専用の DS を作る | ブランドを聞きながら DESIGN.md と tokens を作る | `ds-creator` |
| 3. 汎用の正本を 1 つ育てる | フォント、色、余白、部品、モーションの共通解を更新し続ける | `AwesomeDS/` と `Knowledge/` |

Phase のチケットがどの用途に効くか。

| チケット | 用途 |
|---|---|
| STA-7, STA-13, STA-14, STA-16, STA-17 | 3. 正本を育てる |
| STA-8, STA-9, STA-15 | 1. ルールを当てる。STA-9 と STA-15 は 2. 専用 DS も含む |
| STA-18 | 用途ではない。公開は Sir が決める |

方針が割れたときは Sir に上げる。

## 何が入っているか

| 置き場所 | 中身 | 最初に読むもの |
|---|---|---|
| [`AwesomeDS/`](AwesomeDS/) | 正本のデザインシステム。DESIGN.md、tokens、24 の foundations、コンポーネント規約 | [DESIGN.md](AwesomeDS/DESIGN.md) |
| [`Plugin/awesome-ds/`](Plugin/awesome-ds/) | Claude Code プラグイン（スキル 7 本）と Cursor 用ルール | [Plugin README](Plugin/awesome-ds/README.md) |
| [`web/`](web/) | AwesomeDS を触って確かめる体験サイト。サイト自身が AwesomeDS で作られている。Cloudflare Workers Static Assets で配信、noindex。本番は https://awesomeds.yumaker.studio 。プレビューは Workers Builds が PR にコメントする。workers.dev は https://awesomeds.yumaker.workers.dev 。Vercel は 2026-10-12 に pause（戻す手順は docs/ops/cloudflare-rollback.md） | [SITE-DESIGN.md](web/SITE-DESIGN.md) |
| [`Knowledge/`](Knowledge/) | 参考にしたスキル、OSS、デザインシステム、ガイドライン、記事の出典付き要約 | [Knowledge/README.md](Knowledge/README.md) |
| [`Reference/`](Reference/) | Knowledge が参照した外部リンク一覧（自動生成。手編集しない） | [REFERENCE.md](Reference/REFERENCE.md) |

## クイックスタート

目的に合わせて 1 つ選んでください。

### A. Claude Code にプラグインを入れる（推奨）

```
/plugin marketplace add Yu-aimaker/AwesomeDesignSystem
/plugin install awesome-ds@awesome-design-systems
```

入れたら「設定画面を作って」のように UI を作る指示を出すだけで `awesome-ds` スキルが発動します。

ローカルのチェックアウトから試す場合:

```
claude --plugin-dir ./Plugin/awesome-ds
```

このリポジトリへの導入は上の手順で足りる。Cursor Marketplace などの公開は Sir が明示するまでしない。

### B. Cursor で使う

`Plugin/awesome-ds/cursor/*.mdc` を自分のプロジェクトの `.cursor/rules/` にコピーします。

### C. プラグインなしで使う

1. `AwesomeDS/DESIGN.md` をプロジェクトのルートにコピーする。
2. `AwesomeDS/tokens/tokens.css` と `tokens/tailwind.css`（Tailwind v4 用）を読み込む。
3. エージェントに「DESIGN.md に従って作って」と伝える。

### D. 体験サイトをローカルで動かす

```
cd web && pnpm install && pnpm dev
```

## スキル

| スキル | 何をするか | 呼び方 |
|---|---|---|
| `awesome-ds` | 開発中の UI に AwesomeDS を適用する。トークンを配線し、shadcn/ui をトークンで再スタイルし、出荷前チェックリストを通す | UI を作る指示で自動的に発動。明示するなら `/awesome-ds:awesome-ds` |
| `ds-creator` | プロダクトのブランドを grill する。1 問聞いて待ち、AwesomeDS を土台にそのプロダクト専用の DESIGN.md / tokens / preview を作る | `/awesome-ds:ds-creator <プロダクト名>` |
| `design-verifier` | 実際にブラウザでキャプチャを撮り、DS 準拠・ブランド反映・人間にとっての心地よさを敵対的に検証してレポートを出す | `/awesome-ds:design-verifier <URL>` |
| `design-thinking` | ペルソナ、ユーザーストーリー、ジャーニーマップ、ページフロー、画面ウォークスルーで UX を改善する | `/awesome-ds:design-thinking <機能名>` |
| `knowledge-curator` | Knowledge にエントリを追加し、Reference を再生成し、AwesomeDS への変更を提案する（毎週のリサーチ用） | `/awesome-ds:knowledge-curator` |
| `html-report` | 結論3文と、表か図を1つだけ置いた HTML を1ファイルで書く | レポートや計画の HTML を頼むと発動。明示するなら `/awesome-ds:html-report` |
| `slides` | 16:9 のスライドを HTML 1ファイルで書く。1枚につき主張は1つ。pptx は頼まれたときだけ | スライドを頼むと発動。明示するなら `/awesome-ds:slides` |

## AwesomeDS の要点

```
canvas #ffffff  ink #0a0a0a  secondary #525252  muted #6b6b6b  hairline #e5e5e5  入力枠 #8c8c8c
accent #2f5bea（リンク・フォーカス・選択のみ）  主ボタンは黒地に白文字
sans Geist + Noto Sans JP  mono Geist Mono  本文 16px / 1.6（日本語 1.8）
余白 4 8 12 16 24 32 48 64 96  角丸 8（操作部品） 12（カード） 16（ダイアログ）
モーション 150〜200ms cubic-bezier(.16,1,.3,1)  ジェスチャはスプリング  reduced-motion 対応
```

詳細は [AwesomeDS/DESIGN.md](AwesomeDS/DESIGN.md) と [AwesomeDS/foundations/](AwesomeDS/foundations/) を参照してください。

## リポジトリ構成

```
AwesomeDS/            正本のデザインシステム
  DESIGN.md           エージェントが読む 1 ファイル（Stitch DESIGN.md 形式 + 解説）
  tokens/             tokens.css / tailwind.css / tokens.json（W3C DTCG 形式）+ accents / radius-families / font-pairings
  data/               実測データ（261 社のブランド配色、24 の選定パレット、34 書体、23 層のスタック、OSS ランキング）
  foundations/        色・文字・余白・角丸・奥行き・モーション・レイアウト・状態・フォーム・ダークモード・密度・a11y など 24 の観点
  components/         コンポーネント規約と出荷前チェックリスト
  CHANGELOG.md        変更履歴（semver）
Knowledge/            出典付きの知見。カテゴリ別フォルダ
Reference/REFERENCE.md  外部リンク一覧（scripts/build-reference.mjs で生成）
Plugin/awesome-ds/    Claude Code プラグイン（skills/, cursor/, ds/ = AwesomeDS の同期コピー）
web/                  体験サイト（Vite + React + Tailwind v4 + Motion + three.js + Lottie）
scripts/              生成と検証（build-reference, extract-brands, build-palettes, build-fonts, fetch-repos, validate-*, hosting-smoke, preview-headers）
docs/ops/cloudflare-cutover.md  本番を Cloudflare Workers へ切り替えた手順と実施記録（2026-10-11 08:14 JST、停止 0 秒）
docs/ops/cloudflare-rollback.md  Cloudflare Workers から Vercel へ戻す手順（DNS の値と確認コマンド）
.claude-plugin/marketplace.json  プラグインマーケットプレイス定義
.github/workflows/    整合性チェック + 全ルートのスモークテスト、月曜 09:30 JST の週次データ更新（デプロイは Cloudflare Workers Builds。本番 https://awesomeds.yumaker.studio 、プレビューは PR コメント。Vercel は 2026-10-12 に pause）
```

## 更新の流れ

1. `Weekly growth`（`.github/workflows/weekly-growth.yml`）は月曜 09:30 JST（cron `30 0 * * 1`）に動く。スケジュール実行は PR を出し、差分が `AwesomeDS/data/` と `Plugin/awesome-ds/ds/data/` だけで Check が成功したとき `weekly-growth-settle.yml` が `bot/weekly-growth` を squash merge する。手動の `workflow_dispatch` は既定 dry-run で PR を作らない。候補は `AwesomeDS/data/candidates.json` に溜まり、サイトには出さない。従量課金の自動調査は動かさない。知見の本文は人間が `knowledge-curator` を実行する。
2. `knowledge-curator` スキルで新しい知見を Knowledge に追加し、`node scripts/build-reference.mjs` で Reference を再生成する。Actions では AI API を使わない。
3. AwesomeDS を変えるべき根拠が出たら DESIGN.md / tokens / foundations を更新し、CHANGELOG にバージョンを追記する。
4. `Plugin/awesome-ds/scripts/sync-ds.sh` でプラグイン内のコピーを同期し、PR を出す。CI が整合性を確認する。

## 参考にした主なもの

[voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md), [kzhrknt/awesome-design-md-jp](https://github.com/kzhrknt/awesome-design-md-jp), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), [shadcn/ui](https://ui.shadcn.com), [assistant-ui](https://github.com/assistant-ui/assistant-ui), Apple Human Interface Guidelines, Material Design 3, Duolingo Design, Nothing, Goodpatch, Linear, Vercel Geist, Stripe ほか。全リンクは [Reference/REFERENCE.md](Reference/REFERENCE.md)。

## ブランド素材

アイコンとバナーは [`docs/assets/brand/`](docs/assets/brand/) にあります。黒タイルに白の「A」、横棒だけをアクセント色にしたマークです。サイトの favicon も同じマークです。

## ライセンス

MIT。各社のデザインシステムに関する記述は公開情報の要約であり、それぞれの権利は各社に帰属します。
