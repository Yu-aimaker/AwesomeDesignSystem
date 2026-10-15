# [SPEC] HTMLレポートの生成（STA-102）

状態: 下書き（2026-10-14 JST）。画面は変えない。
対象: `Plugin/awesome-ds/skills/html-report/`。サイトの `/report` は STA-152 で凍結（木曜以降に Claude が確認するまで CSS・SVG・画面を変えない）。

## 1. ゴール

構造化された事実から、Skill の骨格と同じ HTML を1枚書く。研究リポジトリ（STA-85）は同じコマンドを自分の JSON にかける。研究側の HTML は AwesomeDS に写さない。

## 2. 非ゴール

- `web/` のページ、CSS、SVG、トークンの変更。
- 色の追加。生成物の色は Skill の骨格と同じ（`--canvas: #ffffff`、`--ink: #0a0a0a`、`--muted: #525252`、`--hairline: #e5e5e5`、`--accent: #2f5bea` はリンクだけ）。
- グラデーション、暗い全面、同じカード3枚。
- React バンドル。`web-artifacts-builder` は使わない。

## 3. 入力

UTF-8 の JSON。

| フィールド | 規則 |
|---|---|
| `lang` | `ja` または `en` |
| `title` | 空でない1文字列。名詞句 |
| `conclusion` | 空でない文字列がちょうど3つ。順は、事実、変化、次の行動 |
| `table` または `figure` | どちらか1つ。両方、またはどちらも無しは失敗 |
| `table.headers` | 1列以上 |
| `table.rows` | 1行以上。各行の列数は見出しと一致 |
| `figure.src` | `https://` か、`/` で始まらない相対パス。`javascript:` は不可 |
| `figure.alt` | 空でない1文字列 |
| `sources` | `https://` の URL が1つ以上 |

図は `<img>` 1つだけにする。`<figure>` と `<img>` を重ねない。検査側（別 PR の `check-report.mjs`）は `figure` / `img` / `svg` の開始タグを数えるため。

## 4. 本文の長さ

タイトル、結論3文、`class="meta"` の出典は本文に数えない。表のセルか、図の alt だけを数える。

ファイルのどこかに日本語（ひらがな、カタカナ、漢字）があれば、本文は 1,500 字まで。無ければ 700 語まで。超えたらファイルを書かない。

## 5. コマンド

```
node Plugin/awesome-ds/skills/html-report/scripts/render-report.mjs report.json -o report.html
```

失敗時は exit 1。標準エラーに理由を1行ずつ出す。出力ファイルは作らない。成功時は `render-report: OK <path>` を出す。

文字列は HTML エスケープする。利用者が CSS や SVG を渡す欄は無い。

## 6. テスト

`node --test scripts/render-html-report.test.mjs`

止めるもの: 結論が3文でない、表と図が両方、本文が上限超過、タイトルへのタグ挿入、Skill の色トークンが骨格から外れること。
