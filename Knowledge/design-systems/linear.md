---
title: "Linear"
category: design-systems
type: product
sources:
  - url: https://github.com/voltagent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md
    title: "awesome-design-md: linear.app/DESIGN.md (実測)"
  - url: https://linear.app/now/how-we-redesigned-the-linear-ui
    title: "How we redesigned the Linear UI (part II) - Linear"
  - url: https://blog.logrocket.com/ux-design/linear-design/
    title: "Linear design: The SaaS design trend that's boring and bettering UI - LogRocket Blog"
  - url: https://raw.githubusercontent.com/marcus/marcus-skills/main/skills/linear-design-patterns/references/linear-design-system.md
    title: "marcus-skills: linear-design-system.md (二次資料)"
tags: [linear, dark-mode, saas, inter, monochrome, hairline, density]
updated: 2026-09-06
---

# Linear

## 概要

Linear はソフトウェア開発チーム向けの課題管理ツールで、そのマーケティングサイトとプロダクト UI は「Linear 風」と呼ばれる SaaS の視覚様式の起点になった。クローン済みの実測 DESIGN.md によれば、キャンバスは `#010102` という収集中で最も深い黒に近い面、テキストは `#f7f8f8`、唯一の有彩色は lavender-blue `#5e6ad2` で、階層は影ではなく 4 段の面色と 1px hairline で作られる。2024 年から 2025 年の UI 再設計では Inter Display を見出しに採用し、色数をさらに減らし、罫線で構造を作り、影と角丸は浮くもの (modal, popover, dropdown, command palette) だけに限定した。linear.app は本環境からアクセス不可のため、記事の内容は検索結果と LogRocket の要約から引いた。

## 要点

- キャンバス `#010102`、surface-1 `#0f1011`、surface-2 `#141516`、surface-3 `#18191a`、surface-4 `#191a1b` の面色ラダー。「Four-step surface ladder carries hierarchy without shadow.」
- hairline `#23252a`、hairline-strong `#34343a`、hairline-tertiary `#3e3e44`。1px のみ。
- accent は `#5e6ad2` (hover `#828fff`、focus `#5e69d1`)。用途は「brand mark, primary CTA, focus ring, link emphasis」のみ。他の有彩色は success `#27a644` だけ。
- 書体は自社カスタム (Linear Display / Linear Text / Linear Mono)。フォールバックは SF Pro Display。オープンな代替として Inter 500 / 600 / 700、Geist Sans、JetBrains Mono。
- 見出しの負のトラッキング: 80px で -3.0px、56px で -1.8px、28px で -0.6px。本文 16px は -0.05px、14px は 0。
- 角丸 4 / 6 / 8 / 12 / 16 / 24 / pill。カードは 12px。ボタンは 8px、padding 8px 14px、14px / 500。
- 余白 4 / 8 / 12 / 16 / 24 / 32 / 48、セクション間 96px。カード内 24px。
- 影は事実上なし。フォーカスリングは「2px `primary-focus` outline at 50% opacity」。
- 再設計記事 (検索結果要約): サイドバー、タブ、ヘッダー、パネルを調整して「reduce visual noise, maintain visual alignment, and increase the hierarchy and density of navigation elements」。見出しに Inter Display、本文に Inter。ブランド色は「1–10% lightness」で面に混ぜる。「Structure comes from border lines, with shadows and border-radius reserved for elements that float above the page.」
- 二次資料 (marcus-skills) は LCH 色空間による 3 変数テーマ (base, accent, contrast) と約 200ms のマイクロインタラクションを挙げるが、原典 URL への直接の対応付けは示していない。

## 具体的な値・ルール

| Token | 値 | 用途 |
|---|---|---|
| canvas | `#010102` | ページ背景 |
| surface-1 | `#0f1011` | カード、パネル |
| surface-2 | `#141516` | 強調カード |
| hairline | `#23252a` | 1px 罫線 |
| ink | `#f7f8f8` | 本文と見出し |
| ink-subtle | `#8a8f98` | 補助テキスト |
| primary | `#5e6ad2` | CTA、focus、link |
| primary-hover | `#828fff` | hover |

| Type role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| display-xl | 80px | 600 | 1.05 | -3.0px |
| display-lg | 56px | 600 | 1.10 | -1.8px |
| headline | 28px | 600 | 1.20 | -0.6px |
| body | 16px | 400 | 1.50 | -0.05px |
| body-sm | 14px | 400 | 1.50 | 0 |
| button | 14px | 500 | 1.20 | 0 |
| mono | 13px | 400 | 1.50 | 0 |

## AwesomeDS への反映

- 採用: 「罫線で構造を作り、影と角丸は浮くものだけ」。DESIGN.md 6. Depth and elevation の Level 1 = `1px solid hairline`、Level 2 / 3 のみ影という構造は Linear の二層モデルをそのまま踏襲した。
- 採用: 単一 accent を「links, focus ring, selected state, one highlight」に限定する規則 (2. Color 規則 1, 2)。Linear の「Treat lavender as scarce」に対応する。
- 採用: 暗いテーマの面色ラダー。AwesomeDS dark は `#0a0a0a → #111111 → #141414 → #1a1a1a`。Linear の `#010102` は AwesomeDS では採用せず、コントラストと OLED の黒つぶれを避けて `#0a0a0a` を下限にした。
- 採用: 角丸 4 / 6 / 8 / 12 / 16 / 24 / pill と、余白 4 の倍数、セクション 96px。AwesomeDS の `rounded` と `spacing` は Linear の実測値と同じ刻み。
- 採用: 14px / 500 のボタンラベル。AwesomeDS `label` は 14px / 500 / 1.2。
- 翻案: 見出しの負トラッキング。Linear は px 指定 (-3.0px at 80px = -0.0375em)。AwesomeDS は em 指定で display と h1 を -0.02em に抑えた。日本語混在時に負のトラッキングが崩れるため、Latin のみで適用する規則を加えた (3. Typography)。
- 翻案: 本文 line-height 1.5 は 1.6 に広げた (日本語 1.8)。
- 不採用: ダークモード既定。AwesomeDS は白キャンバスを既定にし、ダークは輝度反転で提供する。「content-first」の製品では白地の方が画像と文書の再現性が高いため。
- 不採用: 自社カスタム書体。オープンライセンスの Geist を採用。Linear 自身が代替として Geist Sans を挙げている。
- 不採用: 本文の負トラッキング (-0.05px)。AwesomeDS は本文 0。

## 出典

- https://github.com/voltagent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md : クローン済みの実測トークン (色、型、角丸、余白、コンポーネント)。ローカルコピーを読了。
- https://linear.app/now/how-we-redesigned-the-linear-ui : 2024 年の UI 再設計記事。linear.app はアクセス不可、検索結果で URL と要約を確認。
- https://blog.logrocket.com/ux-design/linear-design/ : Linear 風デザインの解説。アクセス不可、検索結果の要約 (Inter Display、1–10% lightness、border lines vs shadows) を引用。
- https://raw.githubusercontent.com/marcus/marcus-skills/main/skills/linear-design-patterns/references/linear-design-system.md : 二次資料。取得済み。原典 URL の列挙のみで、直接引用の対応は不明。
- https://linear.app/method は取得不可 (ネットワーク制限)。
