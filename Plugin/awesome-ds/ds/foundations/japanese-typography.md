# Japanese typography

Japanese text needs different defaults from Latin: more leading, no negative tracking,
strict line-break rules, and a font stack that behaves on macOS, Windows and Android.
AwesomeDS applies these through `:lang(ja)` so a page with `<html lang="ja">` gets them
without extra classes. The values come from the measured corpus in awesome-design-md-jp
(487 Japanese sites) and from the Digital Agency design system.

## Decisions

```css
:lang(ja) {
  line-height: 1.8;
  letter-spacing: 0;          /* 0 to 0.02em allowed, never negative */
  line-break: strict;
  overflow-wrap: anywhere;
  text-autospace: normal;     /* progressive enhancement */
}
:lang(ja) :is(h1, h2, h3) {
  font-feature-settings: "palt" 1;
  line-height: 1.4;
}
```

| Property | Value | Reason |
|---|---|---|
| line-height (body) | 1.8 | Kanji are denser than Latin; CJK guidance is 1.7 or more. In the corpus 1.8 and 2.0 are the two most common non-default body values after 1.5. |
| line-height (headings) | 1.4 to 1.5 | Enough for descender-free glyphs; 1.2 clips full-width brackets. |
| letter-spacing | 0 to 0.02em | The Digital Agency uses 0 / 0.01em / 0.02em by size. Negative tracking makes kana touch. |
| line-break | strict | Applies kinsoku rules to small kana and prolonged sound marks; 223 of 487 sites set it explicitly. |
| overflow-wrap | anywhere | Long URLs and product codes must not overflow; `anywhere` also counts for min-content sizing. Prefer over `word-break: break-all`, which breaks Latin words mid-syllable. |
| text-autospace | normal | Inserts 1/8 of the CJK advance (0.125ic) between kana/kanji and Latin or digits, narrower than the traditional quarter space on purpose. Shipped in Safari 18.4 and Chrome; Firefox 145. Harmless where unsupported. |
| palt | headings only | Proportional metrics tighten large kana nicely; on body text it makes 16 px lines uneven and breaks justified alignment. |

## Mixed Latin and Japanese

| Rule | Detail |
|---|---|
| Latin font first, Japanese second | `"Geist", "Noto Sans JP"` so Latin letters and digits use Geist, everything else falls to Noto. |
| Match x-height | Geist's x-height sits close to Noto Sans JP's Latin, so mixed lines do not step. Check `Aa日本語123` at 16 px. |
| Weight offset | Noto Sans JP looks one step heavier than Geist at the same value. Use 500 Geist with 500 Noto for labels; if headings look heavy on Windows, drop Noto to 500 while Geist stays 600 via a second `@font-face` with `font-weight: 600` mapped to Noto 500. |
| Spacing between scripts | Let `text-autospace` do it. Do not type manual half spaces (`日本語 UI`); they double up where the property is supported. Unsupported browsers show no gap and do not break, which is acceptable. |
| Digits | Tabular Geist digits in tables. Full-width digits (１２３) only inside quoted proper nouns. |

Example (correct):

> 2026年9月6日にAwesomeDS v0.1.0を公開しました。詳細はCHANGELOGを参照してください。

Example (avoid): manual spaces around Latin, or `word-break: break-all` splitting "CHANGELOG" as "CHANGE / LOG".

## Punctuation

- Use full-width punctuation in Japanese sentences: 「」、。・！？. Half-width `,` and `.` inside
  Japanese text is a translation artefact.
- Do not add a space after 。or 、.
- Brackets: 「」 for quotes, （） full-width parentheses. Latin `()` only around Latin content.
- No dash characters U+2015 or U+2014 in UI copy. Use 、 or a new sentence. Latin copy uses a period or comma.
- Ellipsis is 三点リーダ …… (two characters) in prose; UI truncation uses one `…`.

## Kinsoku (line-break prohibitions)

`line-break: strict` handles the standard set from JIS X 4051 and the W3C
Requirements for Japanese Text Layout (JLReq):

| Cannot start a line (行頭禁則) | 、。，．・：；？！ゝゞヽヾ々ー）］｝」』〉》〕〗 small kana ぁぃぅぇぉっゃゅょゎ |
| Cannot end a line (行末禁則) | （［｛「『〈《〔〖 and opening quotes |
| Cannot split (分離禁止) | …… ーー and digit groups like 1,000 |

Do not implement kinsoku with JavaScript. Set the property and let the browser apply it.

## Vertical writing

Not a default. When a brand needs 縦書き for a title or a quote:

```css
.tategaki {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  line-height: 1.8;
  font-feature-settings: "vert" 1;
}
```

Keep it to short passages; form controls and tables stay horizontal. Test in Safari, where
`text-combine-upright` behaviour differs.

## Font fallbacks by OS

| Platform | Font | Note |
|---|---|---|
| macOS, iOS | Hiragino Sans (ヒラギノ角ゴシック) | System default; supports `palt`. |
| Windows 10/11 | Yu Gothic UI, then Meiryo | Yu Gothic UI is tuned for UI sizes; Meiryo is the older default. |
| Android, ChromeOS | Noto Sans CJK JP | Same design as Noto Sans JP. |
| Linux | Noto Sans CJK JP | Common in distro font packages. |

Stack order in AwesomeDS: `"Geist", "Noto Sans JP", system-ui, -apple-system, "Hiragino Sans", "Yu Gothic UI", sans-serif`.
Because Noto Sans JP is self-hosted, the OS fonts only appear during the swap window or if
the font fails to load. Measured corpus: Hiragino appears in 326 stacks, Noto Sans JP in 275,
Meiryo in 225, Yu Gothic in 156.

## What the corpus shows

| Observation | Count (of 487) | AwesomeDS response |
|---|---|---|
| `line-break: strict` declared | 223 | Adopted as default. |
| `overflow-wrap: break-word` | 325 files mention it | `anywhere` chosen instead; same effect plus intrinsic sizing. |
| `word-break: break-all` | 97 | Rejected; splits Latin words. |
| `overflow-wrap: anywhere` | 7 | Newer property; adopted. |
| `"palt"` used | 179 | Adopted for headings only; Digital Agency and Cookpad avoid it on body. |
| Body line-height 1.5 / 1.8 / 2.0 | 509 / 239 / 236 occurrences | 1.8 chosen as the middle of the readable band; 1.5 (SmartHR, Cookpad) is dense UI, 2.0 (Goodpatch) is editorial. |
| Mercari body line-height 1.4 | 1 site | Noted as tight; not a default. |

## Digital Agency design system (DADS) as reference

- Font: `"Noto Sans JP", -apple-system, BlinkMacSystemFont, sans-serif`; mono `"Noto Sans Mono"`.
- Body: 17 px / 400 / line-height 1.7 / letter-spacing 0.02em (measured).
- Letter-spacing in three steps (0 / 0.01em / 0.02em) inversely by size, not a flat 0.02em.
- Line heights 1.4 / 1.5 / 1.6 / 1.7 / 1.75 by role; minimum 1.5 for reading text.
- `palt` not used (ベタ組).
- Tap target 44 x 44 px on all components.

AwesomeDS differs in two places: body 16 px instead of 17 px (shared scale with Latin), and
1.8 instead of 1.7 (the extra leading compensates for mixed Geist and Noto lines).

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| BIZ UDPGothic as default | Good for accessibility, but only 11 corpus sites use it and the Latin does not pair with Geist. |
| Zen Kaku Gothic | 68 sites; a brand voice more than a neutral. Fine in `ds-creator`. |
| Hiragino only (no web font) | Renders differently on Windows; cannot control weight axis. |
| `word-break: break-all` | Breaks Latin words and URLs at any character. |
| Flat `letter-spacing: 0.05em` | Common on marketing sites, but makes 14 px UI labels wide and slows reading. |

## Sources

- https://design.digital.go.jp/dads/foundations/typography/ : DADS typography (Noto Sans JP, leading, letter-spacing steps).
- https://github.com/digital-go-jp/design-tokens : DADS tokens as CSS and npm.
- https://fonts.google.com/knowledge/type_in_china_japan_and_korea/cjk_typesetting_rules : CJK leading around 1.7 and typesetting rules.
- https://www.w3.org/International/jlreq/?lang=ja : Requirements for Japanese Text Layout (kinsoku source).
- https://ja.wikipedia.org/wiki/JIS_X_4051 : JIS X 4051 overview.
- https://developer.mozilla.org/en-US/docs/Web/CSS/line-break : `line-break: strict`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap : `anywhere` versus `break-word`.
- https://developer.mozilla.org/en-US/docs/Web/CSS/word-break : why `break-all` is aggressive.
- https://developer.mozilla.org/en-US/docs/Web/CSS/text-autospace : property values.
- https://drafts.csswg.org/css-text-4/#text-autospace-property : the inserted space is 1/8ic.
- https://webkit.org/blog/16574/webkit-features-in-safari-18-4/ : Safari 18.4 ships `text-autospace`.
- https://developer.chrome.com/blog/css-i18n-features : Chrome international CSS features including `text-autospace`.
- https://caniuse.com/mdn-css_properties_text-autospace : support table.
- https://ics.media/en/entry/14087/ : `palt` behaviour and which fonts support it.
- https://learn.microsoft.com/en-us/typography/opentype/spec/features_pt : OpenType `palt` definition.
- https://www.w3.org/International/articles/vertical-text/ : vertical CJK text with `writing-mode`.
- https://developers.googleblog.com/google-fonts-launches-japanese-support/ : Japanese font slicing.
- https://gist.github.com/prantlf/fbd12acc69a022edd589dea48dafe3f8 : common Japanese OS font stacks.
- https://github.com/kzhrknt/awesome-design-md-jp : measured corpus (goodpatch, smarthr, mercari, cookpad, digital-go and 480 others).
