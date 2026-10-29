---
title: "余白・グリッド・グルーピングの規則（2026-10 調査）"
category: layout
type: guideline
sources:
  - url: https://developer.apple.com/design/human-interface-guidelines/layout
    title: "Apple HIG: Layout"
  - url: https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
    title: "Android: Use window size classes"
  - url: https://carbondesignsystem.com/elements/2x-grid/overview/
    title: "Carbon: 2x Grid"
  - url: https://carbondesignsystem.com/elements/spacing/overview/
    title: "Carbon: Spacing"
  - url: https://atlassian.design/foundations/spacing
    title: "Atlassian: Spacing"
  - url: https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/space.ts
    title: "Polaris: space tokens"
  - url: https://primer.style/foundations/layout
    title: "Primer: Layout"
  - url: https://design-system.service.gov.uk/styles/layout/
    title: "GOV.UK Design System: Layout"
  - url: https://design-system.service.gov.uk/styles/spacing/
    title: "GOV.UK Design System: Spacing"
  - url: https://design.digital.go.jp/dads/foundations/layout/
    title: "デジタル庁デザインシステム: レイアウト"
  - url: https://design.digital.go.jp/dads/foundations/spacing/
    title: "デジタル庁デザインシステム: 余白"
  - url: https://design.digital.go.jp/dads/foundations/typography/
    title: "デジタル庁デザインシステム: タイポグラフィ"
  - url: https://smarthr.design/products/design-patterns/spacing-layout-pattern/
    title: "SmartHR Design System: 余白の取り方"
  - url: https://smarthr.design/products/design-tokens/width/
    title: "SmartHR Design System: 幅"
  - url: https://every-layout.dev/layouts/stack/
    title: "Every Layout: Stack"
  - url: https://utopia.fyi/space/calculator/
    title: "Utopia: Fluid space calculator"
  - url: https://www.nngroup.com/articles/gestalt-proximity/
    title: "NN/g: Proximity Principle"
  - url: https://www.nngroup.com/articles/why-does-design-look-good/
    title: "NN/g: Why Does a Design Look Good?"
  - url: https://www.nngroup.com/articles/illusion-of-completeness/
    title: "NN/g: The Illusion of Completeness"
  - url: https://practicaltypography.com/line-length.html
    title: "Butterick: Line length"
  - url: https://baymard.com/blog/line-length-readability
    title: "Baymard: Line length readability"
  - url: https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html
    title: "WCAG 2.2 Understanding 1.4.8 Visual Presentation"
  - url: https://www.w3.org/TR/jlreq/
    title: "W3C: Requirements for Japanese Text Layout (JLREQ)"
  - url: https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md
    title: "Anthropic frontend-design SKILL.md"
  - url: https://github.com/vercel-labs/web-interface-guidelines
    title: "Vercel Web Interface Guidelines"
  - url: https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/layout.md
    title: "taste-skill: references/layout.md"
  - url: https://github.com/pbakaus/impeccable/blob/main/cursor-plugin/skills/impeccable/reference/layout.md
    title: "impeccable: reference/layout.md"
  - url: https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/layout-and-space.md
    title: "hallmark: references/layout-and-space.md"
tags: [layout, spacing, grid, grouping, measure, gutter, container, japanese, proximity]
updated: 2026-10-21
---

# 余白・グリッド・グルーピングの規則（2026-10 調査）

## 概要

ページの幅、左右の余白、行の長さ、セクションの間隔、グループの作り方について、デザインシステムとガイドラインと、AI エージェント向けの Skill が書いていることを集めた。数値は出典どおり。実際のサイトの実測は [参考サイトの実測](reference-sites-measured.md) にある。AwesomeDS への反映先は `AwesomeDS/foundations/spacing.md` と `layout.md`。

## 要点

- **スマホの左右余白は 15 から 24px**。GOV.UK 15、Carbon・Primer・SmartHR 16、Material 3 Compact 16dp。impeccable は本文が画面端から 16px 未満なら検出し、24 から 32px を勧める。
- **タブレットは 24 から 32px、PC は 24 から 40px**。GOV.UK 30、Primer xlarge 24、SmartHR メイン 32、Carbon 32 から 40。
- **読む幅は欧文 45 から 75 字、和文は全角 40 字まで**。Butterick 45 から 90、Baymard 50 から 75、impeccable 65 から 75ch、frontend-design は 80 未満。和文は WCAG 1.4.8（CJK 40 以下）、デジタル庁「全角 40 文字程度」、JLREQ「横組では最大で 40 字くらい」。`ch` は「0」の幅なので、和文の 40 字は `40em`（1 字 = 1em）で書く。
- **ページの最大幅は文書・業務で 960 から 1280px**。GOV.UK 960（本文は 2/3 列で約 640）、SmartHR 880 / 1184 / 1336、Primer 1280。taste-skill は、ページ全体を 1200px で包んで本文も同じ幅に流すことを「stock」の型と呼び、走る本文だけを `ch` で制限することを勧める。
- **グループ間はグループ内の約 2 倍**。NN/g「要素間に 1 単位、グループ間に 2 単位」。SmartHR は 32 / 24 / 16、デジタル庁は 8 / 24 / 64 の例を挙げる。外側の余白ほど大きく、内側ほど小さい。
- **見出しの上は下の 2 倍以上**。taste-skill、impeccable（`heading-rhythm`）、NN/g（見出しは前の節より自分の本文に近く）。SmartHR は見出しと本文の間 16px。
- **セクションの間隔は文脈で変わる**。業務画面 24 から 64px（SmartHR 32）。宣伝ページは taste-skill の調査で PC 120 から 240px、スマホ 72 から 112px。
- **カードの間隔は 16 から 24px、内側は 16 から 24px**。Polaris 16 / 16、taste-skill の業務画面の中央値 16 / 20。間隔は画面幅で変えないサイトが多い。
- **小さい画面で縮めるのは大きい余白だけ**。GOV.UK の余白スケールは 0 から 3 段が全幅共通で、4 段以上だけ小画面で小さい。Carbon と SmartHR も同じ考え方。
- **列数は項目数から決める**。3 列に 4 枚、行に 1 枚と大きな空白は、業務画面で最も多い失敗（taste-skill）。

### AI が作りがちな余白の失敗

| 失敗 | 直し方 | 出典 |
|---|---|---|
| どこも同じ余白（カード内 = カード間 = セクション間） | 内側 < グループ間 < セクション間を 2 倍刻みで | impeccable `monotonous-spacing`、hallmark「If every gap is 24px, the page is a template」 |
| 見出しが前のブロックに近い | 見出しの上を下の 2 倍以上に | impeccable `heading-rhythm`、taste-skill |
| 広いコンテナに短い本文。右半分が無地 | 本文は読む幅で止め、図と表だけ広げる | taste-skill、GOV.UK 2/3 列、Every Layout |
| セクション間が開きすぎ。無地の帯がページの終わりに見える | 間隔を詰める。半画面を超える空白を作らない | NN/g Illusion of Completeness、taste-skill |
| 全部中央揃え | 左揃えを基本に、中央は 1 ページ 1 か所 | web-artifacts-builder、hallmark、taste-skill |
| グリッドとデータが合わない | 列数を項目数から。孤立したカードは広げるか並べ替える | taste-skill |
| スマホでも PC の余白のまま | 1 列にし、大きい余白だけ 1 段下げる | SmartHR、GOV.UK、Primer |

## 具体的な値・ルール（あれば）

| 項目 | 値 | 出典 |
|---|---|---|
| スマホの左右余白 | 15 から 24px | GOV.UK、Carbon、Primer、SmartHR、M3（要約）、impeccable |
| PC の左右余白 | 24 から 40px | Primer、SmartHR、Carbon、GOV.UK |
| 読む幅 | 欧文 45 から 75 字、和文 全角 40 字まで（16px で 640px） | Butterick、Baymard、WCAG 1.4.8、デジタル庁、JLREQ |
| 文書のページ幅 | 960 から 1280px | GOV.UK、SmartHR、Primer |
| グループ間 : グループ内 | 約 2 : 1 | NN/g、SmartHR、デジタル庁 |
| 見出しの上 : 下 | 2 : 1 以上 | taste-skill、impeccable |
| 段落の間 | 文字サイズの 2 倍以上を許容できること | WCAG 1.4.12、デジタル庁 2.25 倍 |
| カードの間隔 / 内側 | 16 / 16 から 24 | Polaris、taste-skill |

確認の方法: 2026-10-21 に各ページの本文を開いた。例外は次のとおり。Material 3 の画面端の余白は m3.material.io に届かず、検索要約で確認した。Refactoring UI は目次だけ。Every Layout の Center は既定値のコードだけ。NN/g の行長の記事は 404 だったため Baymard と WCAG で代えた。和文の「35 から 40 字」を Web 向けに示す一次資料は見つからなかった。上限 40 字は確認済み。JLREQ-d 草案は 30 から 35 字を「ともいわれている」と書く。

## AwesomeDS への反映

- 反映済み（AwesomeDS CHANGELOG の Unreleased）: 左右余白 20 / 24 / 32px（`--ds-gutter-sm` / `-md` / `-lg`）、文書ページの幅 760px（`--ds-container-doc`。実測の本文列 539 から 760px の上限）、和文の読む幅 40em（`--ds-measure-ja`）。見出しの上下比、グループ比、文書とギャラリーのセクション間 48 / 64、ホーム 64 / 96、大きい余白だけ小画面で 1 段下げる規則、余白が多すぎる失敗。`foundations/spacing.md` と `layout.md`。
- 反映済み: 体験サイトの全ページ（幅 2 種、左右余白、セクションの間隔、ギャラリーの見出し）。
- 反映しない: 宣伝ページ向けの 120 から 240px のセクション間（AwesomeDS のサイトは docs とギャラリーで、LP ではない）。
- 不採用: spacing.md の「Apple は 8・16・32pt の刻み」という記述。現行の HIG Layout の本文に見当たらないので削った。

## 出典

- https://developer.apple.com/design/human-interface-guidelines/layout : 関連する項目を余白・容器・区切り線でまとめる、文字の幅を制限する。iOS と Web の余白の数値は本文にない（2026-10-21）。
- https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes : 幅のクラス Compact < 600、Medium 600 から 840、Expanded 840 から 1200（2026-10-21）。
- https://carbondesignsystem.com/elements/2x-grid/overview/ : ブレークポイントごとの列数と margin、padding 16px（2026-10-21）。
- https://carbondesignsystem.com/elements/spacing/overview/ : 余白スケール、ページ全体は混ませない、上位の見出しほど周りを広く（2026-10-21）。
- https://atlassian.design/foundations/spacing : 小 0 から 8、中 12 から 24、大 32 から 80 の 3 帯（2026-10-21）。
- https://github.com/Shopify/polaris/blob/main/polaris-tokens/src/themes/base/space.ts : `space-card-gap` 16px、`space-card-padding` 16px（2026-10-21）。
- https://primer.style/foundations/layout : 内容領域の padding 16 / 24、xlarge の max-width 1280px（2026-10-21）。
- https://design-system.service.gov.uk/styles/layout/ : two-thirds 列、75 字以下、ページ幅 960px（2026-10-21）。
- https://design-system.service.gov.uk/styles/spacing/ : 応答型の余白スケール 4 = 15/20 から 9 = 40/60（2026-10-21）。
- https://design.digital.go.jp/dads/foundations/layout/ : ガターは本文の文字サイズの 2 倍、カラムオフセット（2026-10-21）。
- https://design.digital.go.jp/dads/foundations/spacing/ : 8 / 24 / 64 の 3 段の例、関連の強さで余白を変える（2026-10-21）。
- https://design.digital.go.jp/dads/foundations/typography/ : 全角 40 文字程度、段落間は文字サイズの 2.25 倍以上（2026-10-21）。
- https://smarthr.design/products/design-patterns/spacing-layout-pattern/ : セクション 32、要素 24、見出しとコンテンツ 16、メイン padding 32 / モバイル 16（2026-10-21）。
- https://smarthr.design/products/design-tokens/width/ : Container 880 / 1184 / 1336（2026-10-21）。
- https://every-layout.dev/layouts/stack/ : margin は隣接関係の性質。入れ子の stack（2026-10-21）。
- https://utopia.fyi/space/calculator/ : 流動的な余白の対（2026-10-21）。
- https://www.nngroup.com/articles/gestalt-proximity/ : 近接は色や形より強い。見出しは自分の本文に近く（2026-10-21）。
- https://www.nngroup.com/articles/why-does-design-look-good/ : 要素間 1 単位、グループ間 2 単位（2026-10-21）。
- https://www.nngroup.com/articles/illusion-of-completeness/ : 大きな空白はページの終わりに見える（2026-10-21）。
- https://practicaltypography.com/line-length.html : 45 から 90 文字（2026-10-21）。
- https://baymard.com/blog/line-length-readability : 50 から 75 文字（2026-10-21）。
- https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html : 80 文字以下、CJK は 40 以下（2026-10-21）。
- https://www.w3.org/TR/jlreq/ : 横組は最大で 40 字くらい（2026-10-21）。
- https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md : 行長 80 字未満、SaaS カードの型（2026-10-21）。
- https://github.com/vercel-labs/web-interface-guidelines : すべての要素を意図して揃える、超横長でも確認（2026-10-21）。
- https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/references/layout.md : 外側の余白、コンテナ、セクション間、穴の原因（commit 6010f91、2026-10-21）。
- https://github.com/pbakaus/impeccable/blob/main/cursor-plugin/skills/impeccable/reference/layout.md : 見出しの上 > 下、65 から 75ch、画面端 16px 未満の検出（commit dad8dbb、2026-10-21）。
- https://github.com/Nutlope/hallmark/blob/main/skills/hallmark/references/layout-and-space.md : 同じ余白だけのページはテンプレート、全部中央揃えの禁止（commit 13ac0ec、2026-10-21）。
