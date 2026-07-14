<div align="center">

<img src="./assets/banner.svg" alt="AwesomeDesignSystem — AIエージェントのためのテイスト層" width="100%">

&nbsp;

[![License: MIT](https://img.shields.io/badge/License-MIT-1FB8B8?style=flat-square)](./LICENSE)
[![Reference Atlas: 105](https://img.shields.io/badge/Reference_Atlas-105-E5484D?style=flat-square)](./content/references)
[![Canon rules: 42](https://img.shields.io/badge/canon_rules-42-7C5CFC?style=flat-square)](./content/canon)
[![Components: 32](https://img.shields.io/badge/components-32-D6409F?style=flat-square)](./packages/react)
[![Skills: 5](https://img.shields.io/badge/skills-5-46C26B?style=flat-square)](#️-5つのスキル)
[![Built for: AI agents](https://img.shields.io/badge/built_for-AI_agents-18181D?style=flat-square)](#-クイックスタート)
[![PRs: welcome](https://img.shields.io/badge/PRs-welcome-1FB8B8?style=flat-square)](./CONTRIBUTING.md)

[English](./README.md) · **日本語** · [简体中文](./README.zh-Hans.md) · [한국어](./README.ko.md) · [Español](./README.es.md)

</div>

---

> **凡庸（median）を避けよ。視点を持って言い切れ。**  
> AwesomeDesignSystem はもう「Markdown + スキルだけ」ではない。**AIエージェント向けデザイン・プラットフォーム**だ。キュレーションされた教義、版管理された証拠グラフ、実行可能なトークン／コンポーネント／モーション、そして日英のローカル docs サイト——エージェントが「AIスロップ」ではなく、モダン（2026）で人間味のある UI を出荷するための一式。

## 🧭 なぜ存在するのか

LLM に「ランディングページを作って」と頼んでも、返ってくるのは *デザイン* ではないことが多い。Inter、紫→青グラデ、中央ヒーロー、絵文字カード3枚——**操舵しない限り中央値に落ちる**。

AwesomeDesignSystem は、次の **4層を互いにリンクしたまま** 操舵する。

| 層 | 内容 | 場所 |
| --- | --- | --- |
| **Doctrine（教義）** | コード埋め込みの意見あるデザイン知識 | `design-system/` |
| **Evidence（証拠）** | 構造化・検証済みの一次情報と canon ルール | `content/` |
| **Executable（実行系）** | トークン、React ベースライン、モーション、ブランド契約 | `packages/` |
| **Verbs（動詞）** | 段階的開示のエージェント・スキル | `skills/` + `install.sh` |

## 🎁 これを使うと得られること

| 得られるもの | 仕組み |
| --- | --- |
| **AIスロップを止める** | テイスト原則、アンチ中央値パターン、レビュー用スキル |
| **主張を辿れる** | Reference Atlas → canon ルール → artifact → テスト |
| **アクセシブル UI を速く** | 共有契約 + React Aria 付き 32 コンポーネント |
| **意図のあるモーション** | `prefers-reduced-motion` を尊重するレシピ群 |
| **ブランドをコードに** | Product Lexicon、ボイス規則、コピー lint 契約 |
| **鮮度を保つ** | freshness / リンク検査スクリプトと CI |
| **ローカルで閲覧** | Next.js docs（**英語 / 日本語**、`/en/*` `/ja/*`） |

現在の証拠グラフ（検証済み）: **105 Reference Atlas · 42 canon ルール · 54 artifact · 6 隔離 signal**。

## 📂 中身

```
design-system/     人が読む正典（哲学・基盤・ブランド・AI UX・a11y…）
content/           機械用グラフ: references / canon / artifacts / signals
packages/
  tokens/          セマンティック多テーマ OKLCH トークン + 生成器
  core/            フレームワーク非依存ユーティリティ + デザイン契約
  react/           アクセシブルな React コンポーネント基準
  motion/          意図ベースのモーションレシピ
  brand/           ブランドマニフェスト + Product Lexicon + コピー lint
  content/         Zod スキーマ、グラフ loader、バリデータ
apps/docs/         ローカル Next.js 16 docs + Reference Atlas + ライブプレビュー
skills/            5 つのポータブル・スキル
research/          一次情報リサーチノート
docs/              アーキテクチャ、運用、QA、完了監査
scripts/           validate / freshness / evidence / リンク検査
```

<details>
<summary><b>教義モジュール（design-system/）</b></summary>

- `00-philosophy/` — テイスト層、モダン 2026、アンチスロップ  
- `foundations/` — color (OKLCH)、typography（日本語含む）、spacing、tokens  
- `brand/` — ブランド体系、ボイス／トーン、イラスト、Duolingo 由来の教義  
- `platforms/apple-derived/` — Apple 由来のプロダクト教義  
- `case-studies/elite-systems/` — 一流デザイン組織の横断合成  
- `ai-driven/` — エージェント運用、生成 UI、評価  
- `interaction/` — 状態／リカバリ、プロダクト品質、ブラウザ正しさ  
- `motion/` · `components/` · `patterns/` · `accessibility/` · `governance/`

</details>

## 🛠️ 5つのスキル

|  | スキル | 用途 |
| :-: | --- | --- |
| 🎨 | **/AwesomeDS** | テイスト層で UI を構築・洗練。必要なモジュールだけ読む |
| 🏗️ | **/MakeAwesomeDS** | プロダクト独自 DS を生成（OKLCH + `DESIGN.md` + プレビュー） |
| 📄 | **/AwesomeHTML** | Markdown / メモを洗練された単一 HTML に |
| 🔍 | **/AwesomeReview** | AIスロップと a11y 失敗を監査し、優先度付き修正を出す |
| ✨ | **/AwesomeMotion** | 目的駆動のモーション設計（Motion for React + CSS） |

## 🚀 クイックスタート

### 1) AIエージェント — インストール不要

> [!TIP]
> エージェントをこのリポジトリに向け、まず **[`DESIGN.md`](./DESIGN.md)** と **[`design-system/INDEX.md`](./design-system/INDEX.md)** を読ませる。あとはタスクに必要なモジュールだけ。`rule.*` ID を引き、主張は `content/` の `ref.*` まで辿るのが正攻法。

### 2) Claude Code スキルとして

```bash
git clone https://github.com/Yu-aimaker/AwesomeDesignSystem.git
cd AwesomeDesignSystem
./install.sh        # 5 スキルを ~/.claude/skills に symlink（既存はバックアップ）
```

その後: `/AwesomeDS` · `/MakeAwesomeDS` · `/AwesomeHTML` · `/AwesomeReview` · `/AwesomeMotion`

> [!NOTE]
> symlink のため `git pull` でスキルも更新される。サンドボックスでは `./install.sh --copy`。

### 3) ローカル monorepo + docs サイト

**Node ≥ 22.12** と **pnpm 10.5.2** が必要。

```bash
pnpm install
pnpm --filter @awesome-ds/docs dev   # http://127.0.0.1:3000  (EN/JA)
pnpm validate
pnpm test
pnpm qa:core
# pnpm qa:full                       # Playwright 含む
```

詳細: [`docs/architecture.md`](./docs/architecture.md) · [`docs/maintenance.md`](./docs/maintenance.md) · [`docs/completion-audit.md`](./docs/completion-audit.md) · [`docs/qa-report.md`](./docs/qa-report.md)

## 📐 一息で言う、標準

> 凡庸を避けよ。視点を持って言い切れ。支配的な1色 **＋** 鋭いアクセント。意図的な書体 — Inter を唯一の選択肢にしない。本物の階層；1画面に焦点は1つ。抑制 **＝** 自信。モーションは状態を伝え、装飾しない。プリミティブにテーマを当てる。エラー / 空 / ローディングを設計する。WCAG 2.2 AA。部品の寄せ集めではなく、一貫した **全体** を。

## 🎨 デザイントークン — 共有の語彙

セマンティック OKLCH、多テーマ。`@awesome-ds/tokens` から CSS / Tailwind 向けに生成。

| グループ | 例 |
| --- | --- |
| **Color** | `--color-bg` · `--color-surface` · `--color-fg` · `--color-border` · `--color-accent` · `--color-ring` |
| **Space** | `--space-1` … `--space-32` |
| **Radius** | `--radius-sm` · `--radius-md` · `--radius-lg` · `--radius-full` |
| **Type** | `--text-xs` … `--text-7xl` · `--font-display` · `--font-body` · `--font-mono` |
| **Motion** | `--ease-out` · `--ease-spring` · `--dur-fast/base/slow` |

人が読む契約 → [`design-system/foundations/tokens.md`](./design-system/foundations/tokens.md)

## 🔬 証拠と鮮度

- **Reference Atlas**（`content/references/`）: Apple / Material / Fluent / Polaris / Carbon / Primer / Spectrum / Atlassian / GOV.UK / Duolingo / Vercel / W3C など。medium・drift risk・検証周期付き  
- **Canon ルール**（`content/canon/`）: 移植可能な教義。ref / artifact と双方向リンク  
- **Signals**（`content/signals/`）: 新興の X 等 — 昇格ゲート通過まで隔離  
- **運用**: `pnpm check:links` · `pnpm check:freshness` · `pnpm evidence:check`

**リンク集ではない。** 一次情報を教義と実行契約に落とし込み、グラフ検証で嘘をつかせない。

## 🌐 ローカライズ

- Docs UI: 英語 + 日本語（`/en/*` `/ja/*`）、ロケール交渉、hreflang + x-default  
- Canon Markdown は英語優先。未翻訳は日本語 UI が明示的フォールバック表示  
- スキルとエージェント導線は言語非依存

## 🤝 コントリビュート

[CONTRIBUTING.md](./CONTRIBUTING.md) を参照。基準：主張に**出典**、中身は**埋め込み**、スキルは**トークン倹約**、アンチAIスロップ Pre-Flight に落ちるものは出荷しない。

## ⚖️ ライセンス

[MIT](./LICENSE) — 自由に使い、改変し、その上に作ってよい。

<div align="center"><sub>AIが、まるでテイストを持つかのようにデザインするために。🎨</sub></div>
