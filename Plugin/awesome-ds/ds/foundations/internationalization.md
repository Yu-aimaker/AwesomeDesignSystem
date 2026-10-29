# Internationalization

AwesomeDS products ship in Japanese and English at minimum. The system assumes text will be
1.5 times longer in another language, that scripts mix inside one sentence, and that formats
for dates, numbers and names differ. These rules keep layouts from breaking when the language
changes. Japanese line breaking and font stacks live in japanese-typography.md; this file covers
everything that changes between locales.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| `lang` | set on `<html>` and on any element in another language | Selects fonts, hyphenation, quotes and `:lang()` rules; WCAG 3.1.1 and 3.1.2. |
| Expansion | every text container survives 150 percent length; labels under 10 characters survive 300 percent; buttons grow, never truncate | W3C (IBM data): strings up to 10 English characters expand 200 to 300 percent in European languages. |
| Truncation | only in tables and lists, with a `title` or tooltip carrying the full text | Truncated labels on buttons and tabs hide the action. |
| Line height | 1.6 Latin, 1.8 Japanese via `:lang(ja)` | Japanese has no ascenders; it needs more leading. |
| Fonts | per-script stacks: Geist for Latin, Noto Sans JP for Japanese, system fallbacks per OS | One font family never covers both well. |
| Formats | `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat`, `Intl.ListFormat` | Never hand-format dates or numbers. |
| Names | one "name" field by default; family and given fields only when required, order by locale | W3C and GOV.UK: not every name fits first name plus last name. |
| Direction | `dir` attribute honoured; logical properties (`margin-inline-start`) everywhere; `dir="auto"` on user text | RTL support costs nothing when written this way from the start. |
| Icons | no text inside icons; arrows flip with direction | Text in images cannot be translated. |
| Pluralization | ICU MessageFormat or `Intl.PluralRules` | Japanese has one plural category; English two; Polish four; Arabic six. |
| Input | `inputmode` and `autocomplete` set; IME composition respected (`isComposing`, `compositionend`) | Japanese input fires `keydown` for Enter while the IME is still converting. |
| Sorting | `Intl.Collator` or `localeCompare` with the current locale | Kana and kanji order differs from code point order. |
| Time zone | pass `timeZone` explicitly; store UTC | A server in UTC renders 2026-10-09 08:30 JST as 2026/10/08 23:30. |

## Text expansion

W3C measured the Flickr label "views" across languages: Korean 0.8 times, Chinese 1.2,
French 2.6, German 2.8 ("-mal angesehen"), Italian 3.0 ("visualizzazioni"). Short strings
grow the most, and they live in the tightest places: buttons, tabs, table headers.

| English | German | Japanese | Ratio to English |
|---|---|---|---|
| Save | Speichern | 保存 | 2.3 (de) |
| Settings | Einstellungen | 設定 | 1.6 (de) |
| Notifications | Benachrichtigungen | 通知 | 1.4 (de) |
| Input processing features | Eingabeverarbeitungsfunktionen | 入力処理機能 | one word in German; cannot wrap without hyphenation |
| desktop | Desktop | デスクトップ | Japanese has fewer characters but each is full width |

Screen example, a tab bar at 390 px:

```
Bad: fixed 4 equal tabs, text clipped
| Allgem… | Benach… | Sicher… | Abrech… |

Good: tabs keep their width and the bar scrolls (or wraps to a second row)
| Allgemein | Benachrichtigungen | Sicherh>   <- scroll hint at the edge
```

```css
/* Bad */
.btn { width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* Good: content decides the width; long German compounds hyphenate when lang="de" */
.btn { min-width: 6rem; padding-inline: var(--ds-pad-inline); }
:lang(de) .prose { hyphens: auto; }        /* needs lang; MDN: no lang, no hyphenation */
.cell { overflow-wrap: anywhere; }         /* URLs and product codes, per japanese-typography.md */
```

## Mixed scripts and `lang`

```html
<!-- Bad: English quote inside Japanese, untagged; read with Japanese voice and Japanese hyphenation -->
<p>ガイドには "Design is how it works" とあります。</p>

<!-- Good -->
<html lang="ja">
<p>ガイドには <q lang="en">Design is how it works</q> とあります。</p>
```

Product names, code and URLs inside Japanese text do not need `lang`. Full quotes and
paragraphs do (WCAG 3.1.2 Language of Parts). In the `/en` routes the `<html lang>` changes
to `en`; do not leave `lang="ja"` on an English page.

## Dates, numbers and lists

Never build a date with string concatenation. The same instant, 2026-10-08 14:30 in Tokyo:

| Call | ja-JP | en-US | de-DE |
|---|---|---|---|
| `dateStyle: "medium", timeStyle: "short"` | 2026/10/08 14:30 | Oct 8, 2026, 2:30 PM | 08.10.2026, 14:30 |
| `dateStyle: "full"` | 2026年10月8日木曜日 | Thursday, October 8, 2026 | |
| `NumberFormat().format(1234567.891)` | 1,234,567.891 | 1,234,567.891 | 1.234.567,891 |
| `style: "currency", currency: "JPY"` | ￥1,234,567 | ¥1,234,567 | 1.234.567 ¥ |
| `notation: "compact"` on 123456789 | 1.2億 | 123M | 123 Mio. |
| `RelativeTimeFormat(…, {numeric: "auto"}).format(-1, "day")` | 昨日 | yesterday | gestern |
| `ListFormat().format(["A","B","C"])` | A、B、C | A, B, and C | A, B und C |

Outputs from Node 20 (ICU); browsers can differ in small details, so tests compare with
`Intl` output, not with hard-coded strings. Japanese era dates use the calendar extension:
`new Intl.DateTimeFormat("ja-JP-u-ca-japanese", { era: "long", year: "numeric" })` gives 令和8年.

```ts
// Bad: month/day order is a US convention; 10/08 reads as 10 August in Europe
const label = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

// Good: Japanese prose matches content-and-tone.md (2026年10月8日 on Node 20, ja-JP).
// dateStyle "medium" prints 2026/10/08. That slash form is not prose.
const label = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "long", timeZone: "Asia/Tokyo",
}).format(d);
```

`dateStyle: "medium"` in the table above is what Node 20 actually prints. It is not the
prose form. Japanese UI copy uses `dateStyle: "long"` (年月日). Tables, logs and code use
ISO 8601 (`2026-10-08`), which W3C lists as the locale-neutral option and which sorts as text.

When a date must be unambiguous in every locale (logs, exports), W3C suggests a month name
plus a four-digit year, or ISO 8601 (`2026-10-08`) where the reader is technical.

## Plurals

```ts
// Bad: English-only rule; wrong for Polish, meaningless for Japanese
`${n} item${n === 1 ? "" : "s"}`

// Good: one message per plural category
const rules = new Intl.PluralRules(locale);
const msg = { one: "# item", other: "# items" }[rules.select(n)];
```

`Intl.PluralRules(...).resolvedOptions().pluralCategories`: `ja` other; `en` one, other;
`pl` one, few, many, other; `ar` zero, one, two, few, many, other. Japanese strings use a
counter instead: 「3 件」.

## Names

| Case | Bad | Good |
|---|---|---|
| Sign-up form | 「名」「姓」 fields, given name first | One field 「氏名」 with `autocomplete="name"` (GOV.UK names pattern) |
| Split fields required (bank, government) | First / Last labels for Japanese users | 「姓」 then 「名」 for `ja`; "Given names" and "Family name" labels for international users (GOV.UK) |
| Japanese reading | none | Optional 「フリガナ」 field; W3C notes Japanese users commonly give a phonetic kana version |
| Greeting | "Hi Taro" built from a split field | Use the full name or a "what should we call you" field (W3C: ask for the part you need) |
| Display | 「Taro Tanaka」 on a ja page | 「田中 太郎」 as typed; never reorder a single-field name |

## Sorting

```ts
["さくら", "アオイ", "木村", "Zoe", "apple", "Émile"].sort();
// Zoe apple Émile さくら アオイ 木村      <- code point order: uppercase first, accents last
["さくら", "アオイ", "木村", "Zoe", "apple", "Émile"].sort(new Intl.Collator("ja").compare);
// apple Émile Zoe アオイ さくら 木村
```

Kanji cannot be sorted by reading without the furigana; sort Japanese name lists by the kana
field when it exists.

## IME input

```ts
// Bad: Enter that confirms a kana-to-kanji conversion also submits the search
input.addEventListener("keydown", (e) => { if (e.key === "Enter") search(); });

// Good: ignore keys that belong to the composition session
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.isComposing) search();
});
```

Live search runs on `compositionend` and on `input` events outside a composition, so 「とうきょう」
does not trigger five requests before it becomes 「東京」.

## Direction

```css
/* Bad */  .badge { margin-left: 8px; } .chevron { transform: none; }
/* Good */ .badge { margin-inline-start: 8px; } :dir(rtl) .chevron { transform: scaleX(-1); }
```

User-generated text gets `dir="auto"`; a user name inserted into a sentence goes in `<bdi>`
so an Arabic or Hebrew name does not reorder the punctuation around it.

## Edge cases

- Missing translation: fall back to the Japanese source string, never show the key
  (`settings.title`).
- Very long word: a German compound or a URL in a 390 px card wraps with `hyphens: auto` or
  `overflow-wrap: anywhere`; check for horizontal scroll.
- Shorter translation: English is often shorter than Japanese in meaning but wider per
  character; layouts should not depend on a fixed line count.
- Empty name: show 「名前未設定」 / "No name", not an empty string or "undefined".
- Numbers in Japanese text: keep half-width digits (「3 件」), use `tabular-nums` in tables.

## Review checklist

- `<html lang>` matches the route; foreign-language passages carry their own `lang`.
- Every button, tab and label survives the German test string at 390 px without clipping.
- No date, number, currency or list is built by string concatenation.
- Japanese prose uses `dateStyle: "long"` (2026年10月8日). Tables and code use `2026-10-08`.
- Every `Intl.DateTimeFormat` call passes `timeZone`.
- Plural strings go through `Intl.PluralRules` or ICU MessageFormat.
- Name fields: one field unless a split is required; order follows the locale.
- Enter handlers check `isComposing`.
- No `left` / `right` in new CSS for spacing; logical properties only.
- No text baked into icons or images.

## Alternatives considered

- Fixed-width buttons with truncated labels: the most common i18n bug; rejected.
- A single "international" font (Noto Sans for everything): Latin looks generic and wide;
  per-script stacks look designed.
- A date library with its own locale data: `Intl` ships with the browser and covers every
  format above.
- Abbreviating labels to fit ("Einst."): W3C notes many languages cannot replicate an
  abbreviation; the translation gets longer, not shorter.

## Sources

- W3C Internationalization, Text size in translation: https://www.w3.org/International/articles/article-text-size
- W3C, Personal names around the world: https://www.w3.org/International/questions/qa-personal-names
- W3C, Date formats: https://www.w3.org/International/questions/qa-date-format
- W3C, Structural markup and right-to-left text in HTML: https://www.w3.org/International/questions/qa-html-dir
- W3C, Requirements for Japanese Text Layout (JLREQ): https://www.w3.org/TR/jlreq/
- GOV.UK Design System, Names: https://design-system.service.gov.uk/patterns/names/
- MDN, Intl: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
- MDN, Intl.PluralRules: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
- MDN, Intl.DateTimeFormat: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
- MDN, Intl.Collator: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator
- MDN, KeyboardEvent.isComposing: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing
- MDN, compositionend event: https://developer.mozilla.org/en-US/docs/Web/API/Element/compositionend_event
- MDN, hyphens: https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens
- MDN, dir attribute: https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/dir
- MDN, :dir(): https://developer.mozilla.org/en-US/docs/Web/CSS/:dir
- MDN, `<bdi>`: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/bdi
- MDN, CSS logical properties: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_logical_properties_and_values
- WCAG 2.2, 3.1.1 Language of Page: https://www.w3.org/WAI/WCAG22/Understanding/language-of-page.html
- WCAG 2.2, 3.1.2 Language of Parts: https://www.w3.org/WAI/WCAG22/Understanding/language-of-parts.html
