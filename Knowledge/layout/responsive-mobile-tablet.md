---
title: "スマホ・タブレット・デスクトップのレスポンシブ規則（2026-10 調査）"
category: layout
type: guideline
sources:
  - url: https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes
    title: "Android Developers: Use window size classes"
  - url: https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts
    title: "Android Developers: Canonical layouts"
  - url: https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation
    title: "Android Developers: Build adaptive navigation"
  - url: https://developer.android.com/docs/quality-guidelines/adaptive-app-quality
    title: "Android Developers: Adaptive app quality"
  - url: https://developer.apple.com/design/human-interface-guidelines/layout
    title: "Apple HIG: Layout"
  - url: https://developer.apple.com/design/human-interface-guidelines/multitasking
    title: "Apple HIG: Multitasking"
  - url: https://developer.apple.com/design/human-interface-guidelines/tab-bars
    title: "Apple HIG: Tab bars"
  - url: https://www.w3.org/WAI/WCAG22/Understanding/reflow.html
    title: "WCAG 2.2 Understanding 1.4.10 Reflow"
  - url: https://www.w3.org/WAI/WCAG22/Understanding/orientation.html
    title: "WCAG 2.2 Understanding 1.3.4 Orientation"
  - url: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport
    title: "MDN: viewport meta"
  - url: https://web.dev/learn/design/interaction
    title: "web.dev Learn Design: Interaction"
  - url: https://web.dev/learn/design/typography
    title: "web.dev Learn Design: Typography"
  - url: https://web.dev/articles/responsive-web-design-basics
    title: "web.dev: Responsive web design basics"
  - url: https://www.nngroup.com/articles/hamburger-menus/
    title: "NN/g: Hamburger Menus and Hidden Navigation Hurt UX Metrics"
  - url: https://gs.statcounter.com/screen-resolution-stats/mobile/japan
    title: "StatCounter: Mobile Screen Resolution Stats Japan"
  - url: https://gs.statcounter.com/screen-resolution-stats/tablet/worldwide
    title: "StatCounter: Tablet Screen Resolution Stats Worldwide"
  - url: https://design.digital.go.jp/dads/foundations/layout/accessibility/
    title: "デジタル庁デザインシステム: レイアウト（アクセシビリティ）"
  - url: https://design.digital.go.jp/dads/foundations/typography/
    title: "デジタル庁デザインシステム: タイポグラフィ"
  - url: https://smarthr.design/products/design-patterns/mobile-friendly-layout/
    title: "SmartHR Design System: モバイルレイアウト"
  - url: https://primer.style/product/getting-started/foundations/responsive/
    title: "Primer: Responsive"
  - url: https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices
    title: "GOV.UK Service Manual: Designing for different browsers and devices"
  - url: https://utopia.fyi/type/calculator/
    title: "Utopia: Fluid type scale calculator"
  - url: https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/
    title: "CSS-Tricks: 16px or Larger Text Prevents iOS Form Zoom"
tags: [responsive, mobile, tablet, breakpoints, navigation, viewport, layout]
updated: 2026-10-21
---

# スマホ・タブレット・デスクトップのレスポンシブ規則（2026-10 調査）

## 概要

スマホ、タブレット、デスクトップで何を変え、何を変えないかを、OS ベンダー、WCAG、MDN と web.dev、公開デザインシステム、利用統計から集めた。2026-10-21 に各ページを開いて確認した。結論は 4 つ。幅は端末ではなくウィンドウで決める。タブレットは縦と横で別の形になる。デスクトップ幅ではナビゲーションを隠さない。入力欄の文字はタッチ端末で 16px 以上にする。

## 要点

- 幅のクラス: Android は 600dp 未満を Compact（縦持ちスマホの 99.96%）、600 から 839 を Medium（縦持ちタブレットの 93.73%）、840 から 1199 を Expanded（横持ちタブレットの 97.22%）とする。高さ 480dp 未満は横持ちスマホの 99.78% で、2 ペインは実用的でない。
- 端末ではなくウィンドウ: Apple HIG Layout は「size classes, not device type or orientation」で決めるよう求める。現在の Multitasking ページでは iPad のウィンドウは自由に大きさを変えられる。web.dev も製品名やブランドでブレークポイントを決めないよう書く。
- 機能は同じ: Apple は「Don't change your app's functionality based on the space it occupies」。見える量は変えてよい。SmartHR の定義では、同じ要素とデータのままレイアウトを変えるのがレスポンシブ、構造やデータを変えるのがアダプティブ。モバイルの従業員向け機能では 1 画面で複数の操作をさせない。
- 正準レイアウト: Android の list-detail は Expanded で 2 ペイン、Medium 以下では片方だけを出す。2 ペインから狭くなったときは詳細を残す。supporting pane は主領域が約 3 分の 2。feed は最小幅を決めた可変グリッド。Primer も狭い画面では list-detail を別ページに分ける。
- ナビゲーション: NN/g（2016）は「Do not use hidden navigation (such as hamburger icons) in desktop user interfaces」と書く。モバイルでは上位リンクが 4 個以下なら見せ、5 個以上なら一部を隠すしかない。Android は Compact で下部のナビゲーションバー、それ以外でレール。Apple のタブバーは 5 個以下。
- 最小幅: WCAG 1.4.10 は 320 CSS px で縦スクロールだけにする。1280px を 400% に拡大した幅と同じ。データ表、地図、図は例外。
- 向き: WCAG 1.3.4 は縦横どちらかへの固定を禁じる。電動車椅子のアームに端末を固定している人がいる。
- viewport meta: MDN は `user-scalable=no` が弱視の人の閲覧を妨げると警告する。キーボードは既定で visual viewport だけを縮める（`resizes-visual`）。固定フッターをキーボードの上に出すときだけ `interactive-widget=resizes-content` を使う。
- ポインタ: `hover` と `pointer` は主入力だけを報告する（web.dev）。`any-pointer` は fine と coarse を両方返すことがある。
- 可変文字: `vw` だけで `font-size` を書くと文字サイズ変更が効かない。`rem` などの相対単位を混ぜる（web.dev）。Utopia の既定は 360px から 1240px の間で補間する。
- 横スクロール: DADS は「横スクロールバーを隠さないようにしてください」と書く。`order` やグリッド配置は視覚的な並び替えだけに使う。
- 文字サイズ: DADS は本文と UI で 16 CSS px 以上を基準にする。iOS Safari は 16px 未満の入力欄にフォーカスすると画面を拡大する（CSS-Tricks、二次資料）。
- 利用統計（StatCounter、2026 年 9 月）: 日本のモバイルは 414x896 が 23.26%、390x844 が 13.62%、375x667 が 5.5%。世界のタブレットは 768x1024 が 8.09%、820x1180 が 5.06%。
- 例外: GOV.UK は全端末で使えることを原則としつつ、主に勤務時間中の事務職が使う関税ツールを小さい画面向けにしなかった例を挙げる。SmartHR は携帯向けでない管理画面に注意表示を出す。

## 具体的な値・ルール（あれば）

| 項目 | 値 | 出典 |
|---|---|---|
| 幅クラス | スマホ 320 から 599、タブレット縦 600 から 839、タブレット横 840 から 1199、デスクトップ 1200 以上 | Android window size classes |
| 確認幅 | 320、360、375、390、414、768、820、1024、1180、1280、1440 | WCAG 1.4.10、StatCounter、Android adaptive app quality（1024x640、1280x800 dp） |
| 2 ペイン | 840 以上かつ高さ 480 以上 | Android canonical layouts、window size classes |
| 低い画面 | 高さ 480 未満は 1 ペイン、固定バーは 1 本まで | Android（Compact height） |
| ナビゲーション | 1024 以上は常に見せる。それ未満は 4 個以下ならリンク、5 個以上ならメニューとシート | NN/g hamburger menus |
| タップ領域 | タッチで 44px | Apple HIG（44x44 pt）、WCAG 2.5.8 |
| 入力欄の文字 | `pointer: coarse` で 16px 以上 | CSS-Tricks（二次資料）、DADS 16 CSS px |
| viewport meta | `width=device-width, initial-scale=1`。`user-scalable=no` と `maximum-scale` は使わない | MDN、web.dev |
| 可変文字 | `clamp(最小rem, rem + vw, 最大rem)`、360 から 1240 で補間 | web.dev typography、Utopia |
| 390 幅の 1 行 | 左右 20px の余白で 350px。16px で全角 21 文字 | AwesomeDS spacing.md の計算 |

未確認の項目。m3.material.io は 2026-10-21 に読み込めなかったので、Material の説明は developer.android.com から引いた。Apple の端末別ポイント幅（iPhone、iPad）は現在の HIG Layout に表がなく、確認できなかった。iOS の 16px 拡大は Apple と WebKit の一次資料が見つからない。StatCounter の 430、834、1194 の割合は上位行に入っておらず未確認。

## AwesomeDS への反映

- `AwesomeDS/foundations/responsive.md` に幅クラス 4 段、確認幅、正準レイアウト 3 種の CSS、高さ 480 未満の規則、viewport meta、仮想キーボード、ハイブリッド入力、可変文字の `rem` 項、スクロールバーを隠さない規則、アダプティブとレスポンシブの区別、デスクトップ専用画面の注意表示を足した。
- ナビゲーションを 1 つの規則にまとめた。lg（1024）以上は常に見せ、メニューボタンにしない。lg 未満は 4 個以下ならリンク、それ以上ならシート。シートのリンクは高さ 44px 以上、閉じるボタンは sticky のヘッダーに置く。`layout.md`、`spacing.md`、`navigation.md` はこの規則を指す。AwesomeDS のサイトも xl（1280）切り替えをやめ、lg から 9 項目を間隔を詰めて並べる。
- `AwesomeDS/tokens/tokens.css` に `@media (pointer: coarse)` で `input`、`select`、`textarea` を 16px 以上にする規則を足した。デスクトップのフォームは 14px のまま。
- 390 幅の 1 行を 358px（左右 16px）から 350px（左右 20px）に直した。全角 21 文字。
- ヒーローの全高は `100svh`、アプリシェルは `100dvh` に揃えた。
- 採用しなかったもの。端末名でのブレークポイント（web.dev が禁じる）。全幅で入力欄を 16px にすること（拡大はタッチ端末だけの問題で、デスクトップの密度を下げる理由がない）。

## 出典

- https://developer.android.com/develop/ui/compose/layouts/adaptive/use-window-size-classes : 幅 600 / 840 / 1200 / 1600、高さ 480 / 900 と各クラスの端末割合（2026-10-21 確認）。
- https://developer.android.com/develop/ui/compose/layouts/adaptive/canonical-layouts : list-detail、supporting pane、feed。
- https://developer.android.com/develop/ui/compose/layouts/adaptive/build-adaptive-navigation : Compact でナビゲーションバー、それ以外でレール。
- https://developer.android.com/docs/quality-guidelines/adaptive-app-quality : テスト端末 841x701、1024x640、1280x800、1600x900 dp。
- https://developer.apple.com/design/human-interface-guidelines/layout : size classes で決める、機能を変えない。
- https://developer.apple.com/design/human-interface-guidelines/multitasking : iPad のウィンドウはサイズ変更できる。
- https://developer.apple.com/design/human-interface-guidelines/tab-bars : タブは 5 個以下。
- https://www.w3.org/WAI/WCAG22/Understanding/reflow.html : 320 CSS px、400% 拡大、例外。
- https://www.w3.org/WAI/WCAG22/Understanding/orientation.html : 向きを固定しない。
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport : `user-scalable` の警告、`interactive-widget`。
- https://web.dev/learn/design/interaction : `hover` は主入力だけを報告する。
- https://web.dev/learn/design/typography : `vw` 単独の `font-size` は文字サイズ変更を妨げる。
- https://web.dev/articles/responsive-web-design-basics : 端末や製品名でブレークポイントを決めない。
- https://www.nngroup.com/articles/hamburger-menus/ : デスクトップで隠れたナビゲーションを使わない、モバイルは 4 個以下なら見せる（2016-06-26）。
- https://gs.statcounter.com/screen-resolution-stats/mobile/japan : 日本のモバイル解像度（2026 年 9 月）。
- https://gs.statcounter.com/screen-resolution-stats/tablet/worldwide : 世界のタブレット解像度（2026 年 9 月）。
- https://design.digital.go.jp/dads/foundations/layout/accessibility/ : 横スクロールバーを隠さない、`order` は視覚的な並び替えのみ。
- https://design.digital.go.jp/dads/foundations/typography/ : 本文と UI は 16 CSS px 以上。
- https://smarthr.design/products/design-patterns/mobile-friendly-layout/ : レスポンシブとアダプティブの定義、1 画面 1 操作、管理画面の注意表示。
- https://primer.style/product/getting-started/foundations/responsive/ : 狭い画面で list-detail を別ページにする。
- https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices : 全端末で使えること、根拠のある例外。
- https://utopia.fyi/type/calculator/ : 既定の補間幅 360 から 1240。
- https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/ : 16px 未満の入力欄で iOS が拡大する（Chris Coyier、2021、二次資料）。
