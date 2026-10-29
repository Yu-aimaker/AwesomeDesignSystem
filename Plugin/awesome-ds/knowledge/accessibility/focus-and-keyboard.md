---
title: "フォーカスとキーボード操作"
category: accessibility
type: article
sources:
  - url: https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/selectors/_colon_focus-visible/index.md
    title: ":focus-visible - CSS (MDN content source)"
  - url: https://raw.githubusercontent.com/w3c/aria-practices/main/content/practices/keyboard-interface/keyboard-interface-practice.html
    title: "ARIA Authoring Practices Guide: Developing a Keyboard Interface (source)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-appearance.html
    title: "WCAG 2.4.13 Focus Appearance source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-not-obscured-minimum.html
    title: "WCAG 2.4.11 Focus Not Obscured (Minimum) source (w3c/wcag)"
  - url: https://raw.githubusercontent.com/wpaccessibility/wp-a11y-docs/HEAD/docs/topics/code/focus-handling/visual-focus.md
    title: "WordPress Accessibility Docs: Visual focus"
  - url: https://www.sarasoueidan.com/blog/focus-indicators/
    title: "A guide to designing accessible, WCAG-conformant focus indicators - Sara Soueidan"
tags: [focus, focus-visible, keyboard, roving-tabindex, focus-ring, wcag, aria-practices]
updated: 2026-09-06
---

# フォーカスとキーボード操作

## 概要

キーボード利用者にとって、今どこにフォーカスがあるかが見えることと、複合部品 (タブ、メニュー、リストボックス) を矢印キーで移動できることが操作の前提になる。CSS の `:focus-visible` はブラウザの判断でインジケーターを出すべき時だけ一致し、WCAG 2.4.7 / 2.4.11 / 2.4.13 と 1.4.11 が見え方の要件を定める。ARIA Authoring Practices は roving tabindex による focus 管理を示す。MDN と w3.org、Sara Soueidan のサイトは本環境から取得できず、それぞれのソースリポジトリと、彼女の記事を引用する WordPress Accessibility Docs を資料とした。

## 要点

- `:focus-visible` (MDN): 「applies while an element matches the `:focus` pseudo-class and the UA determines via heuristics that the focus should be made evident on the element」。マウスクリックでボタンに焦点が当たったときは通常表示せず、テキスト入力に焦点が当たったときは表示する。「`:focus-visible` respects user agents' selective focus indication behavior while still allowing focus indicator customization.」
- MDN のアクセシビリティ注記: フォーカスインジケーターは WCAG 1.4.11 の対象で「at least 3 to 1」。入力方法が混在する利用者にはインジケーターの出没が混乱を招く可能性がある。
- WCAG 2.4.7 (AA): キーボード操作可能な UI にはフォーカスが見えるモードがある。
- WCAG 2.4.11 (AA): フォーカスした要素が作者のコンテンツで完全に隠れない。
- WCAG 2.4.13 (AAA): インジケーターの面積は「a 2 CSS pixel thick perimeter of the unfocused component」以上、フォーカス前後で「a contrast ratio of at least 3:1」。
- WordPress a11y docs: 「The color contrast the focus outline or border color should have a contrast ratio of at least 3:1.」「Don't: remove the outline without adding custom styling」。Sara Soueidan の記事 (focus-indicators) を参照元として挙げる。
- Roving tabindex (APG): 「the element that is to be included in the tab sequence has `tabindex="0"` and all other focusable elements contained in the composite have `tabindex="-1"`」。矢印キーで値を入れ替えて `element.focus()` を呼び、複合部品全体を 1 つのタブストップにする。
- APG: 「Users need to be able to easily distinguish the keyboard focus indicator from other features of the visual design.」「It is essential that there is always a component within the user interface that is active (document.activeElement is not null or is not the body element) and that the active element has a visual focus indicator.」
- フォーカスリングの設計: `outline` と `outline-offset` を使うと角丸に追従し、レイアウトに影響しない。2 色リング (内側に白、外側に accent) は背景が何色でも 3:1 を確保しやすい。

## 具体的な値・ルール

AwesomeDS のフォーカスリング:

```css
:focus-visible {
  outline: 2px solid var(--color-focus-ring); /* #2f5bea */
  outline-offset: 2px;
}
:focus:not(:focus-visible) {
  outline: none; /* マウス操作時のみ非表示。:focus-visible が代替 */
}
```

| 要件 | 値 | 根拠 |
|---|---|---|
| 太さ | 2px | WCAG 2.4.13 の 2 CSS px 外周 |
| オフセット | 2px | 要素の枠と分離し、面積を確保 |
| 色 | accent `#2f5bea` (dark: `#7a9cff`) | 白地 5.4:1、黒地 7.9:1 で 3:1 超 |
| 対象 | 全ての focusable | 2.4.7 |
| 隠れない | sticky header、toast の下に来ない | 2.4.11 |

Roving tabindex の要点:

| 部品 | Tab | 矢印 |
|---|---|---|
| Tabs | タブリストに 1 回 | 左右で切り替え |
| Menu | トリガーに 1 回 | 上下で項目移動、Escape で閉じる |
| Listbox / Grid | 部品に 1 回 | 上下左右 |
| Toolbar | ツールバーに 1 回 | 左右 |

## AwesomeDS への反映

- 採用: 「Focus ring: 2px solid accent, 2px offset, on every focusable element via `:focus-visible`. Never `outline: none` without a replacement」(DESIGN.md 11. Accessibility)。2.4.13 (AAA) の面積要件を既定で満たす。
- 採用: 「Borders are 1px. Never 2px except the focus ring」(5. Shape)。リングだけが 2px なので、フォーカスが他の枠と混同されない。
- 採用: 「Keyboard: everything reachable by Tab, dismissible by Escape, operable by Enter/Space」。
- 採用: roving tabindex は shadcn/ui (Radix Primitives) の Tabs, Menu, Select が実装済みのため、独自実装せずそれを使う (8. Components)。
- 採用: accent を focus に使う (accent の用途は「Links, focus ring, selected state」)。
- 翻案: 2 色リングは既定にしない。AwesomeDS の面は白か `#0a0a0a` のどちらかで、accent の単色で 3:1 を満たすため。画像の上にボタンを置く場合のみ `box-shadow: 0 0 0 2px #fff` を内側に足す。
- 不採用: `:focus` 全体にリングを出すこと。マウス操作で常時リングが出ると「ノイズ」になり、Linear や Vercel の実測でもリングは focus 時のみ。

## 出典

- https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/selectors/_colon_focus-visible/index.md : 取得済み。定義、ヒューリスティクス、3:1 の注記。
- https://raw.githubusercontent.com/w3c/aria-practices/main/content/practices/keyboard-interface/keyboard-interface-practice.html : 取得済み。roving tabindex と discernible focus。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-appearance.html : 取得済み。2.4.13。
- https://raw.githubusercontent.com/w3c/wcag/main/guidelines/sc/22/focus-not-obscured-minimum.html : 取得済み。2.4.11。
- https://raw.githubusercontent.com/wpaccessibility/wp-a11y-docs/HEAD/docs/topics/code/focus-handling/visual-focus.md : 取得済み。3:1、outline を消さない、Sara Soueidan 記事への参照。
- https://www.sarasoueidan.com/blog/focus-indicators/ : ネットワーク制限で取得不可。URL は上記 WordPress docs 内で確認。
