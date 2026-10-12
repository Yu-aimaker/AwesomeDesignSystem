---
title: "日本語 Web タイポグラフィ"
category: typography
type: article
sources:
  - url: https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/properties/line-break/index.md
    title: "line-break - CSS (MDN content source)"
  - url: https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/properties/text-autospace/index.md
    title: "text-autospace - CSS (MDN content source)"
  - url: https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/properties/font-feature-settings/index.md
    title: "font-feature-settings - CSS (MDN content source)"
  - url: https://github.com/w3c/jlreq
    title: "w3c/jlreq: Text Layout Requirements for Japanese"
  - url: https://github.com/yuki-takei/awesome-design-md-jp/blob/main/template/DESIGN.md
    title: "awesome-design-md-jp: template/DESIGN.md (日本語向けテンプレート)"
tags: [japanese, typography, line-height, letter-spacing, kinsoku, palt, text-autospace, jlreq]
updated: 2026-09-06
---

# 日本語 Web タイポグラフィ

## 概要

日本語の本文は欧文より広い行間、原則として負にしない字間、禁則処理 (`line-break: strict`)、和欧間のアキ (`text-autospace`)、そして OpenType 機能 `palt` の使い分けが品質を決める。W3C の JLReq (Requirements for Japanese Text Layout) が組版の要件を定義し、CSS では `line-break`、`word-break`、`overflow-wrap`、`text-autospace`、`font-feature-settings` / `font-variant-east-asian` で実装する。MDN と w3.org は本環境からアクセス不可のため、MDN のソースリポジトリと jlreq のリポジトリ、awesome-design-md-jp のテンプレートを資料とした。

## 要点

- 行間: テンプレートは「日本語本文は `line-height: 1.5` 以上を推奨 (1.7〜2.0 が読みやすい)」「見出しは 1.3〜1.5」。「日本語本文に `line-height: 1.2` 以下を使わない」。実測では Goodpatch 2.0、デジタル庁 1.7、SmartHR 1.5 (業務 UI)。
- 字間: テンプレートは本文 0.04em 程度で可読性が上がるとし、見出しは 0 から 0.05em。欧文混じりでは letter-spacing が欧文にも影響する点に注意。負の字間は和文では避ける。
- 禁則: `line-break: strict` は「Break text using the most stringent line break rule.」 `normal` は「the most common line break rule」、`loose` は新聞のような短い行向け。`anywhere` は「a soft wrap opportunity around every typographic character unit」で、禁則を無視する。
- 折り返し: `overflow-wrap: break-word` (長い URL や英単語)、`word-break: keep-all` (ことばの途中で折り返さない場合) をテンプレートが挙げる。
- 和欧間: `text-autospace` は「the space applied between Chinese/Japanese/Korean (CJK) and non-CJK characters」。値は `normal` (既定、CJK と非 CJK の間と約物周りに自動でアキ)、`no-autospace`、`ideograph-alpha` (漢字・カナと Latin 文字の間のみ)、`ideograph-numeric` (漢字・カナと数字の間のみ)、`punctuation`、`insert`、`replace`、`auto`。対応ブラウザは限られるため、未対応環境では手動の四分アキやスペースなしを前提にする。
- OpenType: `font-feature-settings: "palt" 1` はプロポーショナル字詰め。テンプレートは「見出しやナビゲーションに有効」「本文には `palt` を適用しない方が可読性が高い場合がある」。MDN は「Whenever possible, Web authors should instead use the font-variant shorthand property or an associated longhand property such as ... font-variant-east-asian ...」と、低レベルの `font-feature-settings` より `font-variant-*` を推奨する。
- JLReq: W3C の「Text Layout Requirements for Japanese」。公開版は https://www.w3.org/TR/jlreq 、編集者草案は https://www.w3.org/International/jlreq/ (いずれもリポジトリ README で確認、取得不可)。ルビ配置の簡易規則の文書も併載。
- 書体切り替え: Goodpatch は要素ごとに欧文と和文の `font-family` を切り替えるが、一般には `"Geist", "Noto Sans JP"` の 1 チェーンで Latin と和文を分担させる方が保守しやすい。

## 具体的な値・ルール

| 項目 | 推奨値 | 出典 |
|---|---|---|
| 本文 line-height | 1.7 から 2.0 (最低 1.5) | template、digital-go、goodpatch |
| 見出し line-height | 1.3 から 1.5 | template |
| 本文 letter-spacing | 0 から 0.04em、負は禁止 | template |
| 見出し letter-spacing | 0 から 0.05em | template |
| 禁則 | `line-break: strict` | MDN、template |
| 折り返し | `overflow-wrap: break-word` または `anywhere` | MDN、template |
| 和欧間 | `text-autospace: normal` (対応環境) | MDN |
| 字詰め | `palt` は見出しのみ | template |

AwesomeDS の実装:

```css
:lang(ja) {
  line-height: 1.8;
  letter-spacing: 0;
  line-break: strict;
  overflow-wrap: anywhere;
  text-autospace: normal; /* 対応ブラウザのみ */
}
:lang(ja) h1, :lang(ja) h2, :lang(ja) h3 {
  line-height: 1.4;
  font-feature-settings: "palt" 1;
}
```

## AwesomeDS への反映

- 採用: 日本語本文 1.8、見出し 1.4 から 1.5 (DESIGN.md 3. Typography「Line height: 1.6 body (Japanese 1.8), 1.2 to 1.35 headings (Japanese 1.4 to 1.5)」)。テンプレートの 1.7 から 2.0 の範囲内で、Goodpatch の 2.0 より詰め、SmartHR の 1.5 より広げた。
- 採用: 「Japanese text: 0 to 0.02em, never negative」。テンプレートの 0.04em より控えめにしたのは、Noto Sans JP の字面が大きく、0.04em では UI が間延びするため。
- 採用: `line-break: strict`、`overflow-wrap: anywhere`、`text-autospace` where supported。
- 採用: 「`palt` on headings only, never on body」。
- 採用: 和文の測度 40 全角文字 (Latin の 65ch に相当)。
- 翻案: `word-break: keep-all` は既定にしない。長い複合語で行が極端に空くため、必要な見出しだけに限定する。
- 不採用: 要素単位の font-family 切り替え (Goodpatch 方式)。
- 不採用: 本文への `palt`。
- 不採用: 和文見出しの負トラッキング (Goodpatch の -0.04em)。

## 出典

- https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/properties/line-break/index.md : 取得済み。`auto / loose / normal / strict / anywhere` の定義。
- https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/properties/text-autospace/index.md : 取得済み。値と意味。
- https://raw.githubusercontent.com/mdn/content/HEAD/files/en-us/web/css/reference/properties/font-feature-settings/index.md : 取得済み。構文と `font-variant-*` 推奨。
- https://github.com/w3c/jlreq : 取得済み。JLReq の位置づけと公開 URL。https://www.w3.org/TR/jlreq 本体は取得不可。
- https://github.com/yuki-takei/awesome-design-md-jp/blob/main/template/DESIGN.md : クローン済みテンプレート。行間、字間、禁則、`palt` の推奨値。ローカルコピーを読了。
