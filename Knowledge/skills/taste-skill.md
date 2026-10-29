---
title: "taste-skill (Leonxlnx)"
category: skills
type: skill
sources:
  - url: https://github.com/Leonxlnx/taste-skill
    title: "Leonxlnx/taste-skill (commit 6010f91, v2.1.4)"
  - url: https://github.com/Leonxlnx/taste-skill-classics
    title: "Leonxlnx/taste-skill-classics (v1 and v2-experimental skills)"
  - url: https://github.com/vercel-labs/agent-skills
    title: "vercel-labs/agent-skills (the `npx skills add` CLI taste-skill installs through)"
tags: [skill, anti-slop, inspector, landing-page, app-screens, house-rules, responsive]
updated: 2026-10-21
---

# taste-skill (Leonxlnx)

## 概要

Web ページのアートディレクションを行う Agent Skill。2026-10-21 にコミット `6010f91`（2026-10-20、プラグイン版 2.1.4）をローカルクローンで読んだ。リポジトリにはスキルが 1 つだけある（`skills/taste-skill/`、install name は `design-taste-frontend`）。CHANGELOG 2.1.3 は「One repo, one skill.」と書く。2.0.0（2026-10-13）で中身を作り直し、旧 v1 と旧 v2（experimental）は `Leonxlnx/taste-skill-classics` に移った。対象はランディングページ、マーケティングサイト、ポートフォリオなどの公開ページと、ダッシュボード、設定、受信箱などのアプリ画面。アプリ画面は旧版では対象外だったが、今は専用の章と手順がある。

## 要点

- 構成: `SKILL.md`（529 行）は Page or app screen、The run（手順 1 から 10）、House rules、Laws of the craft、Special cases、Files の 6 節。詳細は `references/` の 11 ファイル（`layout.md`、`type.md`、`colour.md`、`copy.md`、`critique.md`、`imagery.md`、`motion.md`、`scenes.md`、`tells.md`、`research.md`、`app-screens.md`）に分かれる。
- 方向の配布: 旧版の 3 つのダイヤル（DESIGN_VARIANCE など）は廃止。`scripts/draw.mjs` が 20 の方向から 3 つを配り、選んだ方向に合わせて書体、配色、ヒーロー、セクション構成をライブラリから配る。ライブラリは 247 の掲載サイトの調査から作った。
- 実ブラウザの検査: `scripts/inspect.mjs` がページを 1440、768、390 px で開き、見出しの行数、文字サイズ、読み込まれたフォント、色、罫線、影、グラデーション、コントラスト、はみ出し、余白の左右差、片側に寄ったセクション、空白の帯、見出しのないセクション、画面端に近すぎる文字を測る。`FAIL` はすべて直し、`WARN` は説明できなければ直す。`lint.mjs` はソースの禁止パターンを探す。
- House rules: 見出しは全幅で 2 行以内。最初の画面に `h1` を 1 つ、各セクションに見出し。左右の余白を揃える。半画面を超える空白を作らない。eyebrow、ピルバッジ、「New」チップは全面禁止。コード以外の等幅、01 / 02 / 03 の番号、細い罫線、グラデーション、静止時の影、グラス、小さい大文字の字間ラベル、強調語の装飾、紫と藍、クリーム地にテラコッタも禁止。書体は 2 つまで。
- 調査（`references/research.md`）: 248 サイトを集め 247 を読み込んだ。上位サイトと弱いサイトの比較で、小さい大文字の字間ラベルは 16% 対 57%、アイコン付き特徴カードは 1% 対 28%、グラデーションは 22% 対 52%、静止時の影は 24% 対 48%。
- アプリ画面の章（`references/app-screens.md`、1199 行）: 23 画面の調査から、表の見出し行に塗りがない（11 表中 0）、縞模様なし（23 画面中 0）、数値は右揃えで等幅数字、欠損は灰色のダッシュ、本物のゼロは 0 と書く、読み込み中は最終形と同じ大きさの平たい灰色バーで shimmer なし、同じ行のカードは下端を揃える、列数は項目数から決める、5 列以下の表は 1440 幅で約 760 px に収める、と書く。スマホでは 640 未満で表を 2 行の行に変え、項目は 2 行目に移して消さない。
- ページの余白: 左右の余白はどの幅でも同じ、16 px 未満にしない。ナビゲーションは最初の画面の約 10 分の 1 以下。スマホではワードマークと 1 つの操作を見せ、リンクは「Menu」から開く全画面シートに入れる。
- em dash: 旧版は全面禁止だったが、今は「ページに数個を超える」場合の copy tell に緩めた（`references/tells.md`、`references/copy.md`）。
- インストール: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`。旧スキルは `taste-skill-classics` から同じ install name で入る。

## 具体的な値・ルール（あれば）

| 項目 | taste-skill の値 | 場所 |
|---|---|---|
| 検査幅 | 1440、768、390 px | `SKILL.md`、`scripts/inspect.mjs` |
| 見出しの文字数 | 1 行の文字数 ≈ 行幅 ÷（文字サイズ × k）、k は 0.40 から 0.58。390 幅で行幅 350 px、44 px なら 2 行で約 32 字 | `references/copy.md` |
| 左右の余白 | 16 から 32 px、どの幅でも 16 px 以上、左右同じ | `references/layout.md` |
| セクション間 | デスクトップ 120 から 240 px、スマホ 72 から 112 px（ページ）。アプリ画面は 24 から 64 px | `references/layout.md`、`references/app-screens.md` |
| 表 | 見出し行の塗りなし、縞なし、数値右揃え、5 列以下は約 760 px | `references/app-screens.md` 7 節 |
| 状態 | 欠損は灰色ダッシュ、ゼロは 0、読み込みは平たいバーで shimmer なし | `references/app-screens.md` 11 節 |
| 動きの下限 | ページは 8 要素以上が動かないと FAIL。アプリ画面は入場アニメーションなし | `SKILL.md`、`references/app-screens.md` |
| 写真の下限 | ページに本物の写真 4 枚以上 | `SKILL.md` |

## AwesomeDS への反映

採用したもの（2026-10-21）。

- eyebrow の全面禁止。AwesomeDS は旧版由来の「3 セクションに 1 つまで」から禁止に変えた。根拠は調査の 16% 対 57%。`layout.md`、`anti-patterns.md`、`checklist.md` 5.4。
- 見出しは全幅で 2 行以内。taste-skill の計算式に全角文字の k = 1 を当て、390 幅（行幅 350 px）で `h1`（32 px）約 20 字、`h2`（28 px）約 24 字の目安を `layout.md` と `responsive.md` に書いた。
- 表の規則。見出し行に塗りなし、数値は右揃えの等幅数字、欠損は灰色のダッシュ、本物のゼロは 0、5 列以下の表を全幅に引き伸ばさない。`components/README.md` の Table、`states.md`、`layout.md`。`surface-sunken` は表の見出しの役割から外した。
- shimmer のない skeleton。AwesomeDS の「進捗表示以外はループさせない」とも合う。`states.md`、`motion.md`。
- 同じ行のカードは下端を揃える。列数は項目数から決め、最後の行に 1 枚だけ残さない。`layout.md` Rows of cards。
- 平らな背景の上でぼかしを使わない。左右の余白を揃える。文字と画面端の距離は taste-skill の 16 px より厳しい 20 px を保つ。
- 旧版の出典（§0.D、§9、§14）を、現行ファイルか `taste-skill-classics` に付け替えた。

採用しなかったもの。

- セクション間 120 から 240 px、コンテナなしの全幅、バーのないナビ、名前を大きく置くフッター。受賞サイト型の LP の習慣で、docs とギャラリーの AwesomeDS には合わない（非 LP のロック）。taste-skill 自身のアプリ画面調査でもセクション間は 24 から 64 px。
- 動きの下限（8 要素）と写真の下限（4 枚）。マーケティングページ向けの基準。AwesomeDS の動きはフィードバックだけ。taste-skill もアプリ画面には入場アニメーションを付けない。
- 「One live thing」、題材から考えるアイデア文、競合テスト。LP のアートディレクションで、AwesomeDS サイトの見せ場はノブがすでに担う。
- 細い罫線の禁止。AwesomeDS は製品 UI の DS で、1 px の hairline で区切る。taste-skill のアプリ画面の章も薄い 1 px の境界を認めている。
- display を本文の 4 倍以上にする規則、日本語見出しの負の字間と 1.0 未満の行間。CJK は行間が詰まると字が重なる。
- 紫の禁止をノブに当てること。AwesomeDS のアクセントノブは差し替えの見本で、既定は青 `#2f5bea` のまま。
- 角丸を 4 から 8 か 16 から 24 の二択にすること。根拠が 23 画面中 3 画面で、AwesomeDS のカード 12 px は `radius.md` で決めた値。
- em dash を「数個まで」に緩めること。AwesomeDS は全面禁止を保つ。

## 出典

- https://github.com/Leonxlnx/taste-skill : `SKILL.md`、`references/*.md`、`scripts/inspect.mjs`、`CHANGELOG.md`（2.0.0、2.1.3、2.1.4）、`README.md` をコミット `6010f91a9935f1c167dfc500fb1a475681892e6b` のローカルクローンで読んだ（2026-10-21）。
- https://github.com/Leonxlnx/taste-skill-classics : 旧 v1 と旧 v2（experimental）の移転先。`git ls-remote` で存在を確認した（2026-10-21）。
- https://github.com/vercel-labs/agent-skills : README がインストール手段として参照する `npx skills add` CLI。
