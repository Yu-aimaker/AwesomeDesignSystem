# サイト設計 v2

v1 は文章が多く、要件をなぞっただけだった。v2 は「見せる」サイトにする。文章は GitHub に置き、サイトは実物、比較、操作で伝える。

## 原則

1. 1 画面 1 メッセージ。見出しは短い名詞、説明は 1 行（12 語以内）。それ以上は GitHub へのリンク。
2. すべての要素は実物。トークンの値を書く代わりに、その値で描いた物を置く。
3. 触れる。色、角丸、書体、密度はサイト全体で切り替えられ、AwesomeDS の「ブランドに合わせて変えられる」を体感させる。
4. 大胆さは装飾ではなく、スケールとリズムで出す。見出しは 72〜128px。色は AwesomeDS のまま。
5. 壊れない。外部 API はビルド時に読まず、コミット済み JSON だけを表示する。すべてのルートに ErrorBoundary、画像とフォントにはフォールバック。
6. 幅と余白は `AwesomeDS/foundations/spacing.md` に従う。左右の余白 20 / 24 / 32px、ページは中央寄せで、ホームとギャラリーは 1200px、文書（基盤の各ページ、スタック、レポート、スライド、脱 AI スロップ、ナレッジ、このサイトについて）は 760px。本文は全角 40 字（英語 65ch）で止める。セクション間は文書とギャラリーで 48 / 64、ホームで 64 / 96。どちらの幅かは `web/src/layout/Shell.tsx` の `isDocRoute` が決める。

## 情報設計

```
/                 ホーム。巨大な書体見本、ノブ（色・角丸・書体・密度）、実物、各ギャラリーへの入口
/foundations      基盤の一覧。実物ページ（文字 / 色 / 余白 / 角丸 / 奥行き / モーション）とその他は GitHub へ
/foundations/:id  各基盤の詳細（結論 1 行 + 実物 + 良い悪い + 出典）
/fonts            一流企業のフォント一覧。実際の書体で描く見本壁。フィルタ（用途、日本語対応、ライセンス）
/palettes         カラーの組み合わせ一覧。261 社の canvas / ink / accent を実測値で。クリックでサイトのアクセントに適用
/components       コンポーネント。プレイグラウンド付きカード（props を触る）。48
/motion           アニメーション。テキスト、マイクロインタラクション、レイアウト、スクロール、3D、Lottie。35 デモ
/stack            2026 年のフロントエンド技術スタック地図。層ごとに「採用」と「代替」
/rankings         人気のデザイン / AI 関連 OSS ランキング。スター数のバー。毎週自動更新
/sites            おすすめサイト。部品、動き、読み込み表示、見本帳、道具と資料、スキルの 6 分類。取り込み基準の検査を通ったものだけ
/knowledge        ナレッジ。出典付きの要約一覧
/knowledge/:c/:s  本文
/sources          出典リンクをドメインごとに
/about            リポジトリ、プラグイン、更新の流れ
```

トップバーは 1024px 以上で横並び（デスクトップではナビを隠さない。`AwesomeDS/foundations/responsive.md`）。1024 から 1279 はランキングとガイドラインを「その他」メニューに入れ、1280 以上で全項目を並べる。1024 未満はメニューのシート（リンク 44px、閉じるボタンは上に固定）。⌘K でコマンドパレット（ページ、コンポーネント、フォント、パレットを横断検索）。ハッシュ（`/components#button`）は遅延読み込み後に対象へスクロールする。

## ノブ（サイト全体の生きた設定）

`<html>` の data 属性で CSS 変数を上書きする。localStorage に保存。

| 属性 | 値 | 上書きする変数 |
|---|---|---|
| `data-accent` | ink, blue, violet, emerald, rose, amber, cyan, orange | --ds-accent, --ds-accent-hover, --ds-accent-soft, --ds-focus-ring, --ds-selection |
| `data-radius` | sharp, soft(既定), round, pill | --ds-radius-xs..2xl |
| `data-font` | geist(既定), inter, plex, manrope, source-serif | --ds-font-sans |
| `data-density` | compact, comfortable(既定) | --ds-control-*, --ds-space-* の一部 |

ノブは実物を変えるだけで、DS の規則（コントラスト、1 アクセント、余白の帯）は保つ。アクセントの各値はライトとダークで 4.5:1 以上を満たすものだけを載せる。サイトの `knobs.css` はこれらのトークン CSS を読み、独自の hex を持たない。

## ページの型

- **ギャラリー**: フィルタ行（チップ）+ タイル壁（`Wall`）。タイルはホバーで 1 段浮く（shadow-2、150ms）。クリックで詳細かプレイグラウンドを開く。
- **プレイグラウンド** (`Playground`): 左に実物、右にコントロール（range / select / toggle）。下にコードタブ。コントロールの状態からコードを生成する。
- **見本** (`Specimen`): 端まで使う大きな 1 枚。キャプション 1 行。
- **比較** (`Compare`): 左右 2 枚。左が採用、右が避ける例。ラベルは「採用」「避ける」の 2 語だけ。

## 文言

- 見出し: 名詞 1〜3 語。
- キャプション: 12 語以内、動詞で終える。
- 説明は書かない。理由は「なぜ」ボタンで開く折りたたみに 3 行まで、それ以上は GitHub の foundations へ。
- 数値はモノスペースで、単位付き。

## 実装メモ

- データは `AwesomeDS/data/*.json` を `web/scripts/sync-tokens.mjs` で `web/src/ds/data/` にコピーして読む。`import.meta.glob` は Knowledge の Markdown だけ。
- ノブ用 CSS は `AwesomeDS/tokens/accents.css`、`radius-families.css`、`font-pairings.css` を読む。swatch 色は sync 時に `accent-chips.css` へ書き出す。
- 各ルートは `lazy` + `ErrorBoundary`。three / gsap / lottie は `/motion` でだけ読み込む。
- フォントの見本はフォントソースの variable フォントを使い、無い書体は system 代替で描いて「代替で表示」と明記する。
- スクリーンショット検査は全ルート × 390 / 768 / 1280 × ライト / ダーク。320 は手元で確認する。コンソールエラー 0 を CI で確認する。
