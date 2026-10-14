# [SPEC] スライドの生成（STA-103）

状態: 下書き（2026-10-14 JST）。画面は変えない。
対象: `Plugin/awesome-ds/skills/slides/`。サイトの `/slides` は STA-152 で凍結（木曜以降に Claude が確認するまで CSS・SVG・画面を変えない）。

## 1. ゴール

構造化された主張から、Skill の骨格と同じ HTML を1枚書く。研究リポジトリは同じコマンドを自分の JSON にかける。研究側の HTML は AwesomeDS に写さない。

## 2. 非ゴール

- `web/` のページ、CSS、SVG、トークンの変更。
- 色の追加。生成物の色は Skill の骨格と同じ（`--canvas: #ffffff`、`--ink: #0a0a0a`、`--muted: #525252`、`--accent: #2f5bea`）。枠の外は骨格どおり `#111`。読み面である `.slide` は白。
- 紫のグラデーション、暗い全面を読み面にすること、同じカード3枚、絵文字。
- `.pptx` の生成。PowerPoint は利用者が指定したとき、Anthropic の pptx スキルへ渡す。

## 3. 入力

UTF-8 の JSON。

| フィールド | 規則 |
|---|---|
| `lang` | `ja` または `en` |
| `title` | 空でない1文字列。`<title>` にだけ出す |
| `slides` | 1枚以上。各要素は `heading` と、`sentence` または `items` のどちらか1つ |
| `heading` | 空でない1文字列 |
| `sentence` | 空でない1文字列。`items` と同時には置かない |
| `items` | 空でない文字列が1つ以上4つまで |

利用者が CSS や SVG を渡す欄は無い。余分な欄は HTML に出さない。

## 4. 本文の長さ

`title` は本文に数えない。各スライドの見出しは、日本語なら 40 字、英語なら 20 語まで。本文（文1つか、箇条書きをすべて足したもの）も同じ上限。超えたらファイルを書かない。

字数は `lang` で決める。`ja` は文字数、`en` は空白区切りの語数。

## 5. コマンド

```
node Plugin/awesome-ds/skills/slides/scripts/render-slides.mjs deck.json -o deck.html
```

失敗時は exit 1。標準エラーに理由を1行ずつ出す。出力ファイルは作らない。成功時は `render-slides: OK <path>` を出す。

文字列は HTML エスケープする。アクセント色は骨格の `:root` に1回だけ書き、スライド要素には付けない（1枚あたり0個で、上限1個を守る）。本文の `p` と `li` は `1.25rem`（16px 基準で 20px、18px 以上）。矢印キーと `1 / N` の枚数、`prefers-reduced-motion` は骨格と同じ。

## 6. テスト

`node --test scripts/render-slides.test.mjs`

止めるもの: 本文が上限超過、箇条書きが5つ、文と箇条書きの両方、見出しへのタグ挿入、Skill の色が骨格から外れること。
