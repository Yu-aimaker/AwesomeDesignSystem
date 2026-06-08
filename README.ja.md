<div align="center">

# AwesomeDesignSystem

**AIエージェントのためのテイスト層。**
完結型でソース引用付きのデザインシステム知識ベース + スキル群。あらゆるAIエージェントが
モダン（2026年版）で人間味のあるフロントエンドデザインを生み出し、ありきたりな「AIの量産品」から脱却できるようにします。

<sub>

[English](./README.md) · [日本語](./README.ja.md) · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</sub>

</div>

---

## なぜ存在するのか

LLMに「ランディングページを作って」と頼んでも、得られるのは*デザイン*ではありません。スクレイピングされた
あらゆるTailwindチュートリアルの**統計的中央値**です。Inter、白地に紫から青へのグラデーション、中央寄せのヒーロー、
絵文字つきの機能カード3枚。モデルに知識が足りないからではなく、**何も舵を取らなければ中央へ寄ってしまう**からです。

AwesomeDesignSystemはその舵取りを供給します。**コードを埋め込んだ**キュレーション済みの主張あるデザイン知識の集合体と、
タスクに必要な分だけを読み込むスキル群です。**AIエージェントが直接読むこと**を前提に作られているので、
エージェントはタスクの途中でライブラリのドキュメントを取りに行かずとも生産的に動けますし、
かといってシステム全体をコンテキストに丸呑みする必要もありません。

ここにあるものはすべて、**一次ソース**（Apple HIG & Liquid Glass、Google Material 3 Expressive、Nothing、
Goodpatch、Linear / Stripe / Vercel / Raycast、各ライブラリの公式ドキュメント）から抽出され、
**敵対的にファクトチェック**されています。引用元270件以上が [`research/`](./research) に収められています。

## 中身

```
design-system/            ← 正典となる知識ベース（コード埋め込み・唯一の信頼できる情報源）
  INDEX.md                  ルーター：質問 → どのモジュールを読むべきか
  best-practice-design-for-ai.md   旗艦となる統合ドキュメント、ソースリンク付き
  00-philosophy/            テイスト層 ・「モダン2026」・ 核となる原則
  foundations/              色（OKLCH）・ タイポグラフィ（日本語含む）・ スペーシング/レイアウト ・ トークン
  motion/                   原則 ・ コピペで使える Motion + CSS レシピ
  components/               button/card/input/dialog/… 状態とa11y付き
  patterns/                 hero/bento/sections/nav/backgrounds（脱・量産品）
  accessibility/            WCAG 2.2 ・ フォーカス ・ キーボード ・ コントラスト
  tech-stack-2026/          推奨するAIネイティブなスタック
research/                 ← 生の一次ソース調査（その根拠）
skills/                   ← 持ち運べる5つのスキル（その動詞）
```

## 5つのスキル

| スキル | 用途 |
|---|---|
| **/AwesomeDS** | システムのテイスト層を使って任意のUIを構築・改善。必要なモジュールだけにルーティングします。 |
| **/MakeAwesomeDS** | ブランドやプロダクト*自身*のデザインシステムを生成（OKLCHトークン + `DESIGN.md` + プレビュー）。 |
| **/AwesomeHTML** | Markdown / 調査資料 / メモを、洗練された完結型の単一ファイルHTMLドキュメントに変換。 |
| **/AwesomeReview** | 既存のUIやコードを監査。AIの量産品やa11yの不備を検出し、優先度をつけた修正案を報告。 |
| **/AwesomeMotion** | 目的に根ざした上質なモーションを設計（Motion for React + CSSのみのレシピ）。 |

## クイックスタート

### AIエージェント向け（インストール不要）
エージェントをこのリポジトリに向けて、**まず [`design-system/INDEX.md`](./design-system/INDEX.md) を読む**よう指示し、
そのタスクに必要なモジュールだけを開かせます。INDEXは地図であり、各モジュールはそれぞれ完結しています。

### Claude Codeのスキルとして
```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # 5つのスキルを ~/.claude/skills にシンボリックリンクし、既存スキルがあればバックアップ
```
あとは Claude Code 内で：`/AwesomeDS`、`/MakeAwesomeDS`、`/AwesomeHTML`、`/AwesomeReview`、`/AwesomeMotion`。
> `install.sh` はシンボリックリンクを使うため、リポジトリはその場に残しておいてください。更新をpullすればスキルも更新されます。サンドボックス環境では `--copy` を使ってください。

## ひと息で語る、その基準

> 中央値を避けよ。視点を持て。支配的な色を1つと、鋭いアクセント色を。臆病で均一なパレットは禁物。
> 意図的で個性のある書体を。Interを唯一の選択肢にするな。コントラストで本物の階層を生み、画面ごとに焦点は1つ。
> 抑制は自信の表れ。モーションは状態を伝えるもので、装飾ではない。整然と振り付けられたページ読み込みのほうが、
> 散らばったマイクロインタラクションに勝る。プリミティブはテーマ化し、素のデフォルトのまま出荷するな。
> エラー/空/読み込み中の状態を必ず設計し、WCAG 2.2 AAを満たせ。
> パーツの寄せ集めではなく、一貫した**全体**を。

## デザイントークン（共通の語彙）

すべてのモジュールが1つのトークン言語を話します（全セットは [`foundations/tokens.md`](./design-system/foundations/tokens.md) に）。
セマンティックなOKLCHカラー（`--color-bg/-surface/-fg/-border/-accent/-ring`）、8ptのスペーススケール
（`--space-*`）、`--radius-*`、流動的なタイプスケール（`--text-*` + `--leading-*`/`--tracking-*`）、
`--font-display/-body/-mono`、ヘアラインボーダー + `--shadow-*`、そしてモーショントークン（`--ease-*`、`--dur-*`）。
これらは Tailwind v4 の `@theme {}` ブロックにそのまま反映されます。

## コントリビュート

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照してください。基準はこうです。すべての主張に**ソースがあり**、コードは**埋め込まれ**、
スキルは**トークンを節約し**、脱・AI量産品のための事前チェック（Pre-Flight）に通らないものは何も出荷しない。

## ライセンス

[MIT](./LICENSE) — 自由に使い、改変し、その上に築いてください。

<div align="center"><sub>テイストを持っているかのようにAIがデザインできるように。</sub></div>
