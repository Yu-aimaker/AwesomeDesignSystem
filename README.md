# Awesome Design Systems for Claude

AI コーディングエージェント（Claude Code, Cursor）でフロントエンドを作るときの、デザインの正本とプラグインです。

- **AwesomeDS**: ブランドを持たないプロダクトがそのまま使える、汎用の設計済みデザインシステム。白地に黒文字、アクセント 1 色、Geist + Noto Sans JP、4px グリッド、境界線優先、短いモーション。すべての値に理由と出典があります。
- **Knowledge**: 参考にしたスキル、OSS、デザインシステム、ガイドライン、記事を出典リンク付きで要約した知見の集積。
- **Reference**: Knowledge が参照した外部リンクの一覧（自動生成）。
- **Plugin**: AwesomeDS を適用する、ブランド専用 DS を作る、デザインを敵対検証する、デザイン思考で UX を改善する、の 4 スキル（+ ナレッジ更新スキル）を Claude Code プラグインとして配布。Cursor 用ルールも同梱。
- **web**: AwesomeDS を体験できるサイト。サイト自身が AwesomeDS で作られています。
  公開先: https://yu-aimaker.github.io/Awesome-Design-Systems-Claude/

## 使い方

### 1. プラグインを入れる（Claude Code）

```
/plugin marketplace add Yu-aimaker/Awesome-Design-Systems-Claude
/plugin install awesome-ds@awesome-design-systems
```

ローカルで試す場合:

```
claude --plugin-dir ./Plugin/awesome-ds
```

Cursor は `Plugin/awesome-ds/cursor/*.mdc` を `.cursor/rules/` にコピーしてください。

### 2. スキル

| スキル | 何をするか | 呼び方 |
|---|---|---|
| `awesome-ds` | 開発中の UI に AwesomeDS を適用する。トークンを配線し、shadcn/ui をトークンで再スタイルし、出荷前チェックリストを通す | UI を作る指示で自動的に発動。明示するなら `/awesome-ds:awesome-ds` |
| `ds-creator` | プロダクトのブランドを 1 問ずつ聞き取り、AwesomeDS を土台にそのプロダクト専用の DESIGN.md / tokens / preview を作る | `/awesome-ds:ds-creator <プロダクト名>` |
| `design-verifier` | 実際にブラウザでキャプチャを撮り、DS 準拠・ブランド反映・人間にとっての心地よさを敵対的に検証してレポートを出す | `/awesome-ds:design-verifier <URL>` |
| `design-thinking` | ペルソナ、ユーザーストーリー、ジャーニーマップ、ページフロー、画面ウォークスルーで UX を改善する | `/awesome-ds:design-thinking <機能名>` |
| `knowledge-curator` | Knowledge にエントリを追加し、Reference を再生成し、AwesomeDS への変更を提案する（毎週のリサーチ用） | `/awesome-ds:knowledge-curator` |

### 3. AwesomeDS を直接使う（プラグインなし）

1. `AwesomeDS/DESIGN.md` をプロジェクトのルートにコピーする。
2. `AwesomeDS/tokens/tokens.css` と `tokens/tailwind.css`（Tailwind v4 用）を読み込む。
3. エージェントに「DESIGN.md に従って作って」と伝える。

## リポジトリ構成

```
AwesomeDS/            正本のデザインシステム
  DESIGN.md           エージェントが読む 1 ファイル（Stitch DESIGN.md 形式 + 解説）
  tokens/             tokens.css / tailwind.css / tokens.json（W3C DTCG 形式）
  foundations/        色・文字・余白・角丸・奥行き・モーション・レイアウト・a11y・技術スタック・アンチパターンの理由と出典
  components/         コンポーネント規約と出荷前チェックリスト
  CHANGELOG.md        変更履歴（semver）
Knowledge/            出典付きの知見。カテゴリ別フォルダ
Reference/REFERENCE.md  外部リンク一覧（scripts/build-reference.mjs で生成）
Plugin/awesome-ds/    Claude Code プラグイン（skills/, cursor/, ds/ = AwesomeDS の同期コピー）
web/                  体験サイト（Vite + React + Tailwind v4 + Motion + three.js + Lottie）
scripts/              生成スクリプト
.claude-plugin/marketplace.json  プラグインマーケットプレイス定義
.github/workflows/    Pages デプロイ、整合性チェック、毎週のリサーチ Issue 作成
```

## 更新の流れ

1. 毎週月曜に GitHub Actions が「Weekly research」Issue を開く。
2. `knowledge-curator` スキルで新しい知見を Knowledge に追加し、`node scripts/build-reference.mjs` で Reference を再生成する。
3. AwesomeDS を変えるべき根拠が出たら DESIGN.md / tokens / foundations を更新し、CHANGELOG にバージョンを追記する。
4. `Plugin/awesome-ds/scripts/sync-ds.sh` でプラグイン内のコピーを同期し、PR を出す。CI が整合性を確認する。

## AwesomeDS の要点

```
canvas #ffffff  ink #0a0a0a  secondary #525252  muted #737373  hairline #e5e5e5
accent #2f5bea（リンク・フォーカス・選択のみ）  主ボタンは黒地に白文字
sans Geist + Noto Sans JP  mono Geist Mono  本文 16px / 1.6（日本語 1.8）
余白 4 8 12 16 24 32 48 64 96  角丸 8（操作部品） 12（カード） 16（ダイアログ）
モーション 150〜200ms cubic-bezier(.16,1,.3,1)  ジェスチャはスプリング  reduced-motion 対応
```

詳細は [AwesomeDS/DESIGN.md](AwesomeDS/DESIGN.md) と [AwesomeDS/foundations/](AwesomeDS/foundations/) を参照してください。

## 参考にした主なもの

[voltagent/awesome-design-md](https://github.com/voltagent/awesome-design-md), [kzhrknt/awesome-design-md-jp](https://github.com/kzhrknt/awesome-design-md-jp), [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill), [shadcn/ui](https://ui.shadcn.com), [assistant-ui](https://github.com/assistant-ui/assistant-ui), Apple Human Interface Guidelines, Material Design 3, Duolingo Design, Nothing, Goodpatch, Linear, Vercel Geist, Stripe ほか。全リンクは [Reference/REFERENCE.md](Reference/REFERENCE.md)。

## ライセンス

MIT。各社のデザインシステムに関する記述は公開情報の要約であり、それぞれの権利は各社に帰属します。
