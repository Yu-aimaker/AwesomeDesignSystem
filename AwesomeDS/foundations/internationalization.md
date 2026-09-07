# Internationalization

AwesomeDS products ship in Japanese and English at minimum. The system assumes text will be
1.5 times longer in another language, that scripts mix inside one sentence, and that formats
for dates, numbers and names differ. These rules keep layouts from breaking when the language
changes.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| `lang` | set on `<html>` and on any element in another language | Selects fonts, hyphenation, quotes and `:lang()` rules (japanese-typography.md). |
| Expansion | every text container survives 150 percent length; buttons grow, never truncate | English to German or Japanese to English routinely grows 30 to 50 percent. |
| Truncation | only in tables and lists, with a `title` or tooltip carrying the full text | Truncated labels on buttons and tabs hide the action. |
| Line height | 1.6 Latin, 1.8 Japanese via `:lang(ja)` | Japanese has no ascenders; it needs more leading. |
| Fonts | per-script stacks: Geist for Latin, Noto Sans JP for Japanese, system fallbacks per OS | One font family never covers both well. |
| Formats | `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`, `Intl.ListFormat` | Never hand-format dates or numbers. |
| Names | one "name" field by default; family and given fields only when required, order by locale | Not every culture has a first and last name. |
| Direction | `dir` attribute honoured; logical properties (`margin-inline-start`) everywhere | RTL support costs nothing when written this way from the start. |
| Icons | no text inside icons; arrows flip with direction | Text in images cannot be translated. |
| Pluralization | ICU MessageFormat or `Intl.PluralRules` | Japanese has no plural; English has two; Arabic has six. |
| Input | `inputmode` and `autocomplete` set; IME composition respected (`compositionend`) in search boxes | Japanese input fires `keydown` during composition. |
| Sorting | `localeCompare` with the current locale | Kana and kanji order differs from code point order. |

## Layout survival checklist

- Tabs and segmented controls wrap to a second row or scroll; they never shrink text.
- Labels above inputs, not beside them; side labels break at 30 percent longer.
- Table headers wrap; columns have `min-width`.
- Cards use `min-height`, not `height`.
- Numbers use `tabular-nums` so columns stay aligned in every language.

## Alternatives considered

- Fixed-width buttons with truncated labels: the most common i18n bug; rejected.
- A single "international" font (Noto Sans for everything): Latin looks generic and wide;
  per-script stacks look designed.

## Sources

- W3C Internationalization, Text size in translation: https://www.w3.org/International/articles/article-text-size
- MDN, Intl: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- W3C, Personal names around the world: https://www.w3.org/International/questions/qa-personal-names
- MDN, CSS logical properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- W3C, Requirements for Japanese Text Layout (JLREQ): https://www.w3.org/TR/jlreq/
