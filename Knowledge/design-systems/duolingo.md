---
title: "Duolingo Design"
category: design-systems
type: design-system
sources:
  - url: https://raw.githubusercontent.com/kwakseongjae/oh-my-design/HEAD/design-md/duolingo/DESIGN.md
    title: "oh-my-design: duolingo/DESIGN.md (design.duolingo.com/identity/color と www.duolingo.com を照合した二次資料)"
  - url: https://raw.githubusercontent.com/nexu-io/open-design/main/design-systems/duolingo/DESIGN.md
    title: "open-design: duolingo/DESIGN.md (二次資料)"
  - url: https://web.archive.org/web/20260310155248/https://design.duolingo.com/
    title: "Duolingo Design (Wayback Machine, 2026-03-10)"
  - url: https://blog.duolingo.com/duologues-design-conversations/
    title: "Duologues: design conversations - Duolingo Blog"
  - url: https://www.figma.com/community/file/1460744749282136015
    title: "Duolingo Design System (Figma Community)"
tags: [duolingo, gamification, feather-green, motion, character, playful, 3d-button]
updated: 2026-09-06
---

# Duolingo Design

## 概要

Duolingo のデザインは Feather Green `#58CC02` を筆頭に動物の名前を付けた色、Feather Bold の丸いディスプレイ書体、押し込める 3D ボタン (下辺に 4px の濃い色の「lip」)、そしてキャラクターによるフィードバックで構成される。遊び心はあるが、色の役割、角丸、モーションの長さは厳密に決められている。design.duolingo.com、そのアーカイブ、blog.duolingo.com、Figma Community はいずれも本環境からアクセス不可だったため、`design.duolingo.com/identity/color` と live サイトを照合したと明記する GitHub 上の二次資料 2 件から値を取った。公式の一次資料は未確認である点に注意。

## 要点

- 色は動物名。Feather Green `#58CC02` (primary CTA、正解、Duo)、lip 用の濃い緑 `#58A700`、Macaw `#1CB0F6` (secondary、情報)、Cardinal `#FF4B4B` (エラー)、Bee `#FFC800` (XP、報酬)、Fox `#FF9600` (streak)、Beetle `#CE82FF` (特別イベント、Premium)。
- 文字色は Eel `#4B4B4B`。「never pure black」。補助は Wolf `#777777`、境界は Swan `#E5E5E5`。
- 書体は Feather Bold (自社、フォールバック Nunito 700/800) を見出しとボタンに、DIN Next Rounded (`din-round`) を本文に。ウェイトは 400 と 700 のみ。「There is no thin-weight body text.」
- サイズ: Display Hero 40px / 700、Title 24px / 700、Body 17px / 400、Button 15px / 700 UPPERCASE。
- 3D ボタン: 背景 Feather Green、白文字、radius 12px、padding 14px 20px、min-height 50px、`box-shadow: 0 4px 0 #58A700`。押下時に `translateY(4px)` で lip が潰れる。lip は常にその色の濃い版 (青 `#1899D6`、赤 `#EA2B2B`)。
- カードは白地、2px `#E5E5E5` の枠、16px radius、影なし。「the 2px outline is the elevation.」 境界は 2 から 3px で hairline は使わない。
- 角丸 8 (チップ) / 12 (ボタン、入力) / 16 (カード、モーダル) / pill (バー、バッジ)。余白は 8px 基準で 4, 8, 12, 16, 24, 32, 48。
- モーション: `motion-fast` 150ms (押下)、`motion-standard` 250ms、`motion-celebrate` 400 から 600ms (XP カウントアップ)。`ease-bounce cubic-bezier(0.34, 1.56, 0.64, 1)` は祝福の場面だけ。open-design 側は「180ms for button press; 320ms for skill-node unlock」と記す。
- 原則 (二次資料の整理): Fun is functional / One action per screen / Celebrate everything / Green means go / Tactile over flat / Kind to mistakes / Bold and legible (50px+ buttons) / Consistency builds habit。
- Duologues (公式ブログのデザイン対話シリーズ) は取得できず、内容は本エントリに含めていない。

## 具体的な値・ルール

| Name | Hex | 用途 |
|---|---|---|
| Feather Green | `#58CC02` | primary、正解、progress |
| Feather Green lip | `#58A700` | ボタン下辺 |
| Macaw | `#1CB0F6` | secondary、情報 |
| Macaw lip | `#1899D6` | 青ボタン下辺 |
| Cardinal | `#FF4B4B` | エラー、破壊的操作 |
| Cardinal lip | `#EA2B2B` | 赤ボタン下辺 |
| Bee | `#FFC800` | XP、報酬 |
| Fox | `#FF9600` | streak |
| Beetle | `#CE82FF` | Premium、イベント |
| Eel | `#4B4B4B` | 本文 |
| Wolf | `#777777` | 補助テキスト |
| Swan | `#E5E5E5` | 枠、トラック |

## AwesomeDS への反映

- 採用: フィードバックとしてのモーション。Duolingo の 150ms 押下 / 250ms 遷移は AwesomeDS の 150 / 200ms と同じ帯で、「Motion only as feedback」(DESIGN.md 7. Motion) の実例として参照した。
- 採用: 状態を色だけで伝えない設計 (キャラクターとコピーが常に伴う)。AwesomeDS 2. Color 規則 5「Status colors carry an icon or a label」。
- 採用: 「Kind to mistakes」のコピー方針。9. Do の「Write UI copy the way you would say it to a colleague」に対応する。
- 採用: One action per screen。「One primary button per view」(8. Components)。
- 翻案: 「Eel, not black」。AwesomeDS も純黒を避けるが、コントラストを優先して `#0a0a0a` を選び、`#4B4B4B` 相当は `ink-secondary #525252` に置いた。
- 不採用: 3D lip ボタンと 2 から 3px の枠。AwesomeDS は 1px hairline と 8px の平坦なコントロール (5. Shape)。触感表現はブランド固有と判断。
- 不採用: bounce イージング。「Scale enters start at 0.98, never 0.8」「Nothing loops forever」の原則と相容れない。祝福表現は `ds-creator` で追加する側。
- 不採用: 700 のみの見出しと UPPERCASE ボタン。AwesomeDS は 600 見出し、文ケースのラベル。
- 不採用: 動物名のトークン命名。AwesomeDS はロール名 (accent, danger) で命名する。

## 出典

- https://raw.githubusercontent.com/kwakseongjae/oh-my-design/HEAD/design-md/duolingo/DESIGN.md : 取得済み。色、書体、3D lip、radius、motion、原則。`design.duolingo.com/identity/color` と live サイトを Tier 1 として照合したと記載。
- https://raw.githubusercontent.com/nexu-io/open-design/main/design-systems/duolingo/DESIGN.md : 取得済み。`#58cc02`、4px bottom-shadow、Feather Bold + Mona Sans、180ms / 320ms。
- https://web.archive.org/web/20260310155248/https://design.duolingo.com/ : 指定されたアーカイブ。本環境から web.archive.org は取得不可。
- https://blog.duolingo.com/duologues-design-conversations/ : 取得不可 (ネットワーク制限)。
- https://www.figma.com/community/file/1460744749282136015 : 取得不可 (figma.com はネットワーク制限)。
