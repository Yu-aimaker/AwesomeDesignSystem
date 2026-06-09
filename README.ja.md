<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — AIエージェントのためのテイスト層" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Cited sources: 270+](https://img.shields.io/badge/cited_sources-270%2B-E5484D?style=flat-square)](./research)
[![Skills: 5](https://img.shields.io/badge/skills-5-7C5CFC?style=flat-square)](./skills)
[![Color: OKLCH](https://img.shields.io/badge/color-OKLCH-D6409F?style=flat-square)](./design-system/foundations/color.md)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](./design-system/INDEX.md)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-46C26B?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · **日本語** · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</div>

---

> **凡庸（median）を避けよ。視点を持って言い切れ。** ソース付き・自己完結のデザインシステム知識ベース **＋** スキル群。あらゆるAIエージェントが、モダン（2026年）で人間味のあるフロントエンドを生み出し、ありがちな「AIスロップ」の量産をやめるために。

## 🧭 なぜ存在するのか

LLMに「ランディングページを作って」と頼んでも、返ってくるのは*デザイン*ではない — スクレイピングされた無数のTailwindチュートリアルの**統計的中央値**だ。Inter、白地に紫→青のグラデ、中央寄せのヒーロー、絵文字付き機能カード3枚。モデルに知識がないからではなく、**操舵（steering）しない限り中央に落ちる**からだ。

AwesomeDesignSystem はその操舵を供給する。**コードを埋め込んだ**、キュレーション済みで明確な視点を持つデザイン知識体 **＋** タスクに必要な分だけを読み込むスキル群。

| | |
|---|---|
| 🤖 **AIエージェントが直接読むために設計** | タスク途中でライブラリのドキュメントを取りに行かずに即戦力… |
| 🪶 **…しかしコンテキストを膨張させない** | …かといってシステム全体をコンテキストに丸呑みもしない。 |
| 📐 **一次情報の厳密さ** | Apple HIG & Liquid Glass、Material 3 Expressive、Nothing、Goodpatch、Linear/Stripe/Vercel/Raycast ＋ 公式ライブラリドキュメントから抽出。 |
| 🔬 **敵対的にファクトチェック済み** | 270以上の出典が [`research/`](./research) に。 |

## 📂 中身

3つのレイヤー：**知識**（読む）・**証拠**（検証する）・**動詞**（実行する）。

<details open>
<summary><b>リポジトリ・マップ</b></summary>

```
design-system/            ← 正典の知識ベース（コード埋め込み・単一の真実の源）
  INDEX.md                  ルーター：問い → 読むべきモジュール
  best-practice-design-for-ai.md   旗艦の統合ドキュメント（出典リンク付き）
  00-philosophy/            テイスト層 ・「モダン2026」・ 核心原則
  foundations/              color (OKLCH) ・ typography（日本語含む）・ spacing/layout ・ tokens
  motion/                   原則 ・ コピペ可能な Motion + CSS レシピ
  components/               button/card/input/dialog/… 状態 + a11y 付き
  patterns/                 hero/bento/sections/nav/backgrounds（アンチスロップ）
  accessibility/            WCAG 2.2 ・ focus ・ keyboard ・ contrast
  tech-stack-2026/          推奨 AIネイティブ スタック
research/                 ← 生の一次情報リサーチ（証拠）
skills/                   ← 5つのポータブルなスキル（動詞）
```

</details>

## 🛠️ 5つのスキル

| | スキル | 用途… |
|:--:|---|---|
| 🎨 | **/AwesomeDS** | システムのテイスト層で任意のUIを構築・洗練。必要なモジュールだけにルーティング。 |
| 🏗️ | **/MakeAwesomeDS** | ブランド/プロダクト*独自*のデザインシステムを生成（OKLCHトークン + `DESIGN.md` + プレビュー）。 |
| 📄 | **/AwesomeHTML** | Markdown / リサーチ / メモを、洗練された自己完結の単一HTMLドキュメントに変換。 |
| 🔍 | **/AwesomeReview** | 既存のUIやコードを監査 — AIスロップとa11yの失敗を検出し、優先度付きの修正を報告。 |
| ✨ | **/AwesomeMotion** | 目的駆動の上品なモーションを設計（Motion for React + CSSのみのレシピ）。 |

## 🚀 クイックスタート

#### AIエージェント向け — インストール不要

> [!TIP]
> エージェントをこのリポジトリに向け、**まず [`design-system/INDEX.md`](./design-system/INDEX.md) を読む**よう指示する。あとはタスクに必要なモジュールだけを開く。INDEX が地図、各モジュールは自己完結。

#### Claude Code スキルとして

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # 5つのスキルを ~/.claude/skills にsymlink（既存スキルはバックアップ）
```

その後 Claude Code で：`/AwesomeDS` · `/MakeAwesomeDS` · `/AwesomeHTML` · `/AwesomeReview` · `/AwesomeMotion`

> [!NOTE]
> `install.sh` はsymlinkを使うため、リポジトリはそのままの場所に保つこと — pullで更新すればスキルも更新される。サンドボックス環境では `--copy` を使う。

## 📐 一息で言う、標準

> 凡庸を避けよ。視点を持って言い切れ。支配的な1色 **＋** 鋭いアクセント、臆病で均等なパレットにはしない。意図的で個性ある書体 — Interを唯一の選択肢にしない。コントラストによる本物の階層；1画面に焦点は1つ。抑制 **＝** 自信。モーションは状態を伝えるためのもので装飾ではない — 散発的なマイクロインタラクションより、統率された1回のページロードが勝る。プリミティブにテーマを当て、素のデフォルトを出荷しない。エラー / 空 / ローディング状態を常に設計し、WCAG 2.2 AA を満たす。部品の寄せ集めではなく、一貫した**全体**を。

## 🎨 デザイントークン — 共有の語彙

すべてのモジュールが**1つのトークン言語**を話し、Tailwind v4 の `@theme {}` ブロックに反映される。

<details>
<summary><b>トークン契約の全体</b></summary>

| グループ | トークン |
|---|---|
| **Color**（セマンティック・OKLCH） | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space**（8ptスケール） | `--space-1` … `--space-32` |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full` |
| **Type**（流体） | `--text-xs` … `--text-7xl` · `--leading-*` · `--tracking-*` |
| **Font** | `--font-display` · `--font-body` · `--font-mono` |
| **Elevation** | ヘアライン境界 **+** `--shadow-sm/md/lg` |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow` |

値付きの全セット → [`foundations/tokens.md`](./design-system/foundations/tokens.md)

</details>

## 🤝 コントリビュート

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照。基準：すべての主張に**出典**があり、コードは**埋め込み**、スキルは**トークン倹約的**であり、アンチAIスロップの Pre-Flight に落ちるものは出荷しない。

## ⚖️ ライセンス

[MIT](./LICENSE) — 自由に使い、改変し、その上に作ってよい。

<div align="center"><sub>AIが、まるでテイストを持つかのようにデザインするために。🎨</sub></div>
