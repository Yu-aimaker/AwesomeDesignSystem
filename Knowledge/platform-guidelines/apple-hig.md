---
title: "Apple Human Interface Guidelines"
category: platform-guidelines
type: guideline
sources:
  - url: https://developer.apple.com/design/human-interface-guidelines
    title: "Human Interface Guidelines | Apple Developer Documentation"
  - url: https://developer.apple.com/design/human-interface-guidelines/typography
    title: "Typography | Apple Developer Documentation"
  - url: https://developer.apple.com/design/human-interface-guidelines/accessibility
    title: "Accessibility | Apple Developer Documentation"
  - url: https://developer.apple.com/design/human-interface-guidelines/materials
    title: "Materials | Apple Developer Documentation"
  - url: https://developer.apple.com/design/human-interface-guidelines/motion
    title: "Motion | Apple Developer Documentation"
  - url: https://developer.apple.com/design/human-interface-guidelines/color
    title: "Color | Apple Developer Documentation"
  - url: https://developer.apple.com/videos/play/wwdc2025/219/
    title: "Meet Liquid Glass - WWDC25"
tags: [apple, hig, ios, typography, dynamic-type, liquid-glass, motion, accessibility]
updated: 2026-10-07
---

# Apple Human Interface Guidelines

## 概要

Apple の Human Interface Guidelines (HIG) は iOS, iPadOS, macOS, watchOS, tvOS, visionOS 向けの公式デザイン指針である。タイポグラフィは San Francisco (SF Pro / SF Compact / SF Mono) と New York を前提に Dynamic Type のテキストスタイルで定義され、操作対象は 44x44 pt を推奨サイズとする。2025 年の Liquid Glass 以降は「機能レイヤー (ナビゲーション) とコンテンツレイヤーを分ける」ことが素材の中心ルールになった。HTML ページは JavaScript 描画のため本文取得ができず、同じ内容を返す `developer.apple.com/tutorials/data/design/human-interface-guidelines/*.json` から本文を取得した。

## 要点

- 書体は 2 系統。San Francisco (SF Pro, SF Compact, SF Mono, Rounded 派生) と New York (セリフ)。どちらも variable font で optical size を持つ。
- Dynamic Type の既定サイズ (Large) では Body が 17pt / 行送り 22pt。Large Title は 34pt / 41pt。
- プラットフォーム別の最小サイズ: iOS/iPadOS 11pt、macOS 10pt、watchOS 12pt、visionOS 12pt、tvOS 23pt。
- Ultralight, Thin, Light は避け、Regular, Medium, Semibold, Bold を使う。
- テキストは少なくとも 200% まで拡大できる設計にする (watchOS は 140%)。
- 操作対象は iOS/iPadOS で既定 44x44 pt、最小 28x28 pt。
- コントラストは WCAG AA を参照し、17pt 以下の文字は 4.5:1、18pt 以上または太字は 3:1。
- 色だけで情報を伝えない。「Avoid relying solely on color to differentiate between objects, indicate interactivity, or communicate essential information.」
- システムカラーの値をハードコードしない。「Avoid hard-coding system color values in your app.」 セマンティックカラー (label, secondaryLabel, separator) の意味を再定義しない。
- Motion の原則: 「Add motion purposefully」「Make motion optional」「Aim for brevity and precision in feedback animations」「generally avoid adding motion to UI interactions that occur frequently」。Reduce Motion が有効なら zoom, scale, 周辺の動きを減らす。
- Liquid Glass はタブバーやサイドバーなど「コンテンツの上に浮く機能レイヤー」専用。「Don't use Liquid Glass in the content layer.」 regular と clear の 2 種があり、clear は写真や動画など視覚的に濃い背景の上だけに使う。明るい背景では 35% の暗いディミング層を足す。
- 旧来の Material は ultraThin / thin / regular / thick の 4 段階。上に載せる文字は vibrant color (label, secondaryLabel, tertiaryLabel, quaternaryLabel) を使い、`systemGray3` のような静的色は避ける。

## 具体的な値・ルール

iOS / iPadOS Dynamic Type、Large (既定) の値。

| Style | Weight | Size (pt) | Leading (pt) |
|---|---|---|---|
| Large Title | Regular | 34 | 41 |
| Title 1 | Regular | 28 | 34 |
| Title 2 | Regular | 22 | 28 |
| Title 3 | Regular | 20 | 25 |
| Headline | Semibold | 17 | 22 |
| Body | Regular | 17 | 22 |
| Callout | Regular | 16 | 21 |
| Subhead | Regular | 15 | 20 |
| Footnote | Regular | 13 | 18 |
| Caption 1 | Regular | 12 | 16 |
| Caption 2 | Regular | 11 | 13 |

| Platform | 既定サイズ | 最小サイズ |
|---|---|---|
| iOS, iPadOS | 17 pt | 11 pt |
| macOS | 13 pt | 10 pt |
| watchOS | 16 pt | 12 pt |
| visionOS | 17 pt | 12 pt |
| tvOS | 29 pt | 23 pt |

システムカラー (Unified、Color ページの表から抜粋)。

| Color | Light (R,G,B) | Dark (R,G,B) |
|---|---|---|
| Red | 255, 56, 60 | 255, 66, 69 |
| Blue | 0, 136, 255 | 0, 145, 255 |
| Green | 52, 199, 89 | 48, 209, 88 |

補足として、クローン済み `awesome-design-md/design-md/apple/DESIGN.md` の apple.com 実測値は本文 17px / 1.47、Action Blue `#0066cc`、ink `#1d1d1f`、背景 `#f5f5f7`、radius 5 / 8 / 11 / 18 / pill。

## AwesomeDS への反映

- 採用: 44x44 のタッチターゲット (DESIGN.md 4. Spacing and layout)。HIG の既定値をそのまま採用し、デスクトップは WCAG 2.2 の 24x24 を下限にした。
- 採用: 「色だけで伝えない」「セマンティックカラーの意味を再定義しない」を色の規則 5 と「Roles, not hues」に反映 (DESIGN.md 2. Color)。
- 採用: モーションの原則。「目的があり、短く、精密で、任意化できる」を 7. Motion の「Motion only as feedback」と `prefers-reduced-motion` 対応に反映。
- 翻案: 本文 17pt は iOS のネイティブ値。Web では 16px を本文にし、最小は 12px にした (HIG の 11pt より 1 段大きい)。
- 翻案: Light 系ウェイトを避ける指針は「400 body / 500 label / 600 heading、700+ は display 以外で使わない」に置き換えた (3. Typography)。
- 不採用: Liquid Glass および Material の半透明表現。AwesomeDS は「No gradients on backgrounds, no glass, no glow」を既定にしている (1. Visual theme)。Apple 自身も「Use Liquid Glass effects sparingly」とし、コンテンツレイヤーでの使用を禁じているため、Web の一般的なプロダクト UI では採用しない判断とした。
- 不採用: SF Pro は Apple プラットフォーム外で配布できないため、Geist + Noto Sans JP を採用。フォールバックに `-apple-system` を残す。

## 出典

- https://developer.apple.com/design/human-interface-guidelines (取得日 2026-10-07): og:title「Human Interface Guidelines | Apple Developer Documentation」、og:image は Developer Documentation 共通 JPEG。
- https://developer.apple.com/design/human-interface-guidelines/typography : Dynamic Type 表、最小サイズ、ウェイト指針 (JSON エンドポイントから取得)。
- https://developer.apple.com/design/human-interface-guidelines/accessibility : 44x44 pt、コントラスト、Reduce Motion、Dynamic Type 200%。
- https://developer.apple.com/design/human-interface-guidelines/materials : Liquid Glass の regular / clear、コンテンツレイヤー禁止、Material 4 段階、vibrancy。
- https://developer.apple.com/design/human-interface-guidelines/motion : モーション 5 原則の原文。
- https://developer.apple.com/design/human-interface-guidelines/color : システムカラー、セマンティックカラー、色単独禁止。
- https://developer.apple.com/videos/play/wwdc2025/219/ : Liquid Glass 発表セッション (検索結果で確認、未取得)。
