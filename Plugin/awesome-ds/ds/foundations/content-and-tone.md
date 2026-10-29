# Content and tone

Interface text is part of the design system. These rules make copy short, concrete and
consistent, in Japanese first and English second, and remove the tells of generated text.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Voice | plain, direct, second person implied; ですます in Japanese | 公用文作成の考え方: 「です・ます」体を基本として簡潔に敬意を表す. Apple: check each word to be sure it needs to be there. |
| One register | never mix ですます and である in one screen or document | 公用文作成の考え方: do not mix 敬体 and 常体 in one document. |
| Who acts | name who does the action; no 「させていただく」, no "we" in errors | 公用文作成の考え方: too much 敬語 hides the content. Apple: "we" is unclear in "We're having trouble loading this content". |
| Buttons | verb, 2 to 4 characters in Japanese (保存, 送信する, 削除), verb phrase in English | The label says what happens; "OK" says nothing. Apple: "Send" works better than "Let's do it!". |
| Links | the link text names the destination; no 「こちら」, "click here" or "read more" alone | WCAG 2.4.4. NN/g: generic links fail out of context and there are no clicks on touch screens. |
| Destructive | name the object and the loss: 「3件を削除」, never 「本当に？」 | NN/g confirmation guidance; the user decides with the facts. |
| Errors | what happened, why, what to do next; no error codes in the first line; no blame | WCAG 3.3.1 and 3.3.3. NN/g and GOV.UK error message guidance. |
| Empty states | one sentence of what belongs here plus one primary action | Apple: give people a button or link to the next step on a blank screen. |
| Titles | noun phrase, sentence case in English, no trailing period | Headings are labels (WCAG 2.4.6). GOV.UK writes buttons in sentence case. |
| Numbers | half-width digits, `tabular-nums` in tables, thousands separator; no typed space before a Japanese unit (`12,480件`); space before a Latin unit (`184 ms`) | Japanese/digit gaps come from `text-autospace`. |
| Dates | 2026年9月7日 in Japanese prose (`Intl` `dateStyle: "long"`), `2026-09-07` in tables and code | The month is a word, so 10/08 cannot be read two ways. W3C date formats. |
| Punctuation | no exclamation marks, no em dashes, no ellipsis for suspense | Calm; three tells of generated copy. |
| Forbidden words | the list in [Forbidden words](#forbidden-words) | Marketing filler that describes nothing. The same list is in both checkers. |
| Unsupported claims | no 「注目されています」 or 「多くの人が見落とし」 without a source on the same line or the next two | no-ai-slop-ja patterns 13 and 15; design-verifier flags both. |
| Mixed script | do not type spaces between Japanese and Latin or digits; rely on CSS `text-autospace`; unsupported browsers show no gap and do not break, which is acceptable | Same rule as japanese-typography.md. |
| Length | body sentences under 60 characters in Japanese, 20 words in English | 公用文作成の考え方: past 50 to 60 characters, check whether the sentence still reads. One idea per sentence. |

## Patterns

| Situation | Write | Not |
|---|---|---|
| Save succeeded | 保存しました | 正常に保存が完了しました！ |
| Network error | 接続できません。ネットワークを確認して、もう一度お試しください。 | エラーが発生しました (E1042) |
| Delete confirm | 「請求書INV-1044」を削除します。元に戻せません。 | 本当に削除しますか？ |
| Empty list | まだ請求書がありません。最初の請求書を作成 | データがありません |
| Loading | 読み込み中 (with `aria-busy`) | Please wait... |
| Form hint | 8文字以上。数字を1つ含めてください。 | パスワードが無効です |

## Words per component

One row per place where text appears. Feedback types (toast, banner, inline) have their
own placement rules in feedback.md; this table covers the words.

| Component | Rule | Japanese | English |
|---|---|---|---|
| Primary button | Verb that names the result. Same verb as the dialog or page title. | 請求書を送信 | Send invoice |
| Secondary button | The other choice, also a verb. Not 「いいえ」. | 下書きに戻す | Keep editing |
| Multi-step flow | One pair of words for the whole flow: start, next, finish. | 始める / 次へ / 完了 | Get started / Next / Done |
| Link in prose | The words a reader scans for. The destination, not the gesture. | 料金の詳細を見る | See pricing details |
| Field label | A noun. Visible above the field. Never the placeholder alone (forms.md). | メールアドレス | Email address |
| Hint | The format or the limit, before the user types. | 例: name@example.com | For example, name@example.com |
| Placeholder | An example value only, or nothing. It disappears when the user types. | (empty) | (empty) |
| Inline error | What to do, using the label's words. | メールアドレスに @ を入れてください | Enter an email address with an @ |
| Error summary | One line per field, each a link to the field. Same text as the inline error. | 3か所に入力の誤りがあります | There are 3 problems with this form |
| Empty state | What belongs here, then one action. | まだ請求書がありません。最初の請求書を作成 | No invoices yet. Create your first invoice |
| Confirm dialog | Title states the action and object. Buttons say what each choice does. | 「INV-1044」を削除しますか / 削除 / 残す | Delete INV-1044? / Delete / Keep |
| Toggle in settings | Describe what it does when on. The off state is implied. | 毎週月曜に集計をメールで送る | Email a summary every Monday |
| Success | The outcome. A link to the created thing when there is one. | 請求書を送信しました。表示 | Invoice sent. View |
| Toast | Same outcome formula as Success, only when the result is off screen (feedback.md). One optional action. Three lines at 390. | 請求書を送信しました | Invoice sent |
| Loading | The noun being loaded, when it is known. | 請求書を読み込み中 | Loading invoices |

Rules behind the table:

- Apple's writing guidance asks for a verb on buttons and links, the same step words through
  a flow ("Get Started", "Next", "Done"), a direct description of what a setting does when on,
  and a next action on every empty screen.
- NN/g's confirmation guidance replaces Yes and No with options that say what happens
  ("Delete file", "Keep file").
- GOV.UK's error message component asks for the label's own words in the error
  ("Enter address line 1" for the field "Address line 1") and rejects context-free errors
  such as "This field is required".

## Error messages

The formula is what happened, why if it helps, and what to do now. The fix is the part
users read, so it comes first when the cause is obvious.

| Field or case | Write | Not | Why |
|---|---|---|---|
| Required field | 氏名を入力してください | この項目は必須です | GOV.UK: "This field is required" means nothing out of context. |
| Format | 郵便番号は7桁の数字で入力してください（例: 1000001） | 郵便番号が不正です | Name the format. 不正, invalid and illegal blame the user. |
| Too short | 8文字以上のパスワードを入力してください | パスワードが短すぎます | Apple: "Choose a password with at least 8 characters" beats "That password is too short". |
| Range | 1から99の数を入力してください | 範囲外の値です | WCAG 3.3.3: give the correction when it is known. |
| Server | 保存できませんでした。入力内容は残っています。もう一度お試しください。 | 申し訳ございません。予期せぬエラーが発生しました。 | Say what was kept. Apology and 予期せぬ add nothing. |
| Permission | この請求書を編集する権限がありません。管理者に依頼してください。 | アクセスが拒否されました (403) | The code goes in a details area, not the first line. |

Words to leave out of errors: 不正, 無効, エラーが発生しました, 申し訳ございません, invalid,
illegal, oops, sorry. GOV.UK lists forbidden, illegal, you forgot, please, sorry,
valid and invalid, and oops. Apple calls "oops" and "uh-oh" insincere. AwesomeDS keeps
「ください」 in Japanese because it is the plain request form, not an apology.

The error text for a field is the same in the inline message and in the error summary. A
screen reader user hears the summary first and then the field, so two different sentences
for one problem read as two problems.

## Japanese notation

Japanese text has more than one correct spelling for many words. Pick one and keep it.
AwesomeDS follows 「公用文作成の考え方」 (文化審議会, 2022), which is the current government
reference and is close to what most Japanese product teams use.

| Category | Write | Not | Exception |
|---|---|---|---|
| Formal nouns | こと, とき, もの, ところ | 事, 時, 物, 所 | Kanji when a concrete object is meant: 物を置く |
| Auxiliary verbs | てください, ていく, てみる | て下さい, て行く, て見る | Kanji for the real action: 店へ行く, しっかり見る |
| Ability | できる | 出来る | 出来が良い |
| Empty ability | 送れます, 利用できます | 送ることができます, 利用することができます | none |
| Keigo ceiling | ですます. Name the actor. 「ください」 for the request. | させていただく, 形となっております, stacked お/ご + いただ + おり | Humble forms that hide who acts. `static-audit.mjs` flags the first two as `hidden-agent` |
| Brackets | 「」 for quoted words and UI labels, （） for notes | 『』 and 【】 as decoration | 『』 inside 「」 for a quote in a quote |
| Period and bracket | 「保存」を押します。 / （任意） | a period before the closing bracket of a word | A full sentence inside brackets ends with 。 before the bracket |
| Question mark | 削除しますか | 削除しますか？ | Use ？ only when the sentence is not a question without it |
| Half-width | digits, Latin letters, `%`, `@`, `/` | ２０２６年, ＡＩ | none |
| Currency | 1,280円 in prose; `Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" })` in tables | ¥1280, 1280円 | `ja-JP` prints the full-width ￥ (U+FFE5); do not swap it by hand |
| Relative time | `Intl.RelativeTimeFormat("ja")` (may insert a space, e.g. 3 分前), 昨日 | 3分前 typed by hand | Older than seven days: the date |

The brackets, the formal nouns, the auxiliary verbs, できる and the
「利用することができる → 利用できる」 rewrite are all examples in 公用文作成の考え方.
The same guide asks for ですます with short respect, and for not burying the point under 敬語.
The currency and relative time outputs were checked on Node 20.19.2:
`￥1,280`, `昨日` (`numeric: "auto"`), `3 分前`.

## Numbers, dates, money

| Kind | Write | Not |
|---|---|---|
| Count or measure | half-width digits, thousands separator; Japanese unit with no typed space: `12,480件`; Latin unit keeps a space: `184 ms` | １２４８０件, typed space before 件 (`12,480 件`) |
| Table numbers | `font-variant-numeric: tabular-nums` (tokens) | proportional digits in columns that align |
| Date in Japanese prose | `Intl.DateTimeFormat("ja-JP", { dateStyle: "long" })` → 2026年9月7日 | `10/08`, `2026/09/07` |
| Date in tables and code | `2026-09-07` (ISO 8601) | slash dates that swap month and day by locale |
| Money in prose | `1,280円` | `¥1280`, `1280円` |
| Money in tables | `Intl.NumberFormat("ja-JP", { style: "currency", currency: "JPY" })` | hand-built `¥` + digits |

`static-audit.mjs` flags slash-joined dates as `hand-rolled-date`. Amounts and counts stay a review check.

## Accessible wording

Text is part of the accessible name, so these are WCAG requirements, not style.

| Criterion | What it means for copy |
|---|---|
| 2.4.4 Link Purpose | 「こちら」 or "Read more" alone fails when a screen reader lists the links. Put the destination in the link text. |
| 2.4.6 Headings and Labels | A heading says the topic. 「概要」 on every page says nothing; 「請求書の概要」 does. |
| 2.5.3 Label in Name | The accessible name contains the visible text, best at the start. A voice user says what they see. |
| 3.3.1 Error Identification | The error names the field in text. Red alone is not an error message. |
| 3.3.2 Labels or Instructions | Every input has a label, and a hint when there is a format. |
| 3.3.3 Error Suggestion | When the fix is known, the message says it. |

```html
<!-- 2.5.3 fails: visible "送信", spoken name starts with something else -->
<button aria-label="フォームを確定する">送信</button>

<!-- passes: the visible word comes first -->
<button aria-label="送信 請求書INV-1044">送信</button>

<!-- 2.4.4 fails out of context -->
詳しくは<a href="/pricing">こちら</a>

<!-- passes -->
<a href="/pricing">料金の詳細</a>を見る
```

## Length at 390

At 390 px the content width is 358 px after 16 px padding on each side (the container row
in responsive.md).
Japanese full-width characters are 1 em wide, so 16 px body text holds 22 characters per
line. A 60-character sentence is three lines on a phone.

| Element | Budget at 390 | When it does not fit |
|---|---|---|
| Button | one line; about 10 Japanese characters next to a second button | shorten the verb phrase; never truncate (internationalization.md) |
| Field label | one line | move detail to the hint |
| Inline error | two lines | cut the cause, keep the fix |
| Toast | three lines (feedback.md) | move to a banner or a page |
| Card title | two lines with `line-clamp-2` only when the full title is on the next screen | shorten the title |
| Nav item | one word | rename; the nav does not wrap |

English runs longer than Japanese for the same meaning. Check the en copy at 390 too, and
use the expansion rules in internationalization.md for every other language.

## Forbidden words

These are the words `scripts/check-copy.mjs` and design-verifier's `static-audit.mjs` look
for. `scripts/content-tone.test.mjs` fails when this table and either checker disagree.

| Word | Lang | Write instead |
|---|---|---|
| `seamless` | en | name the step that was removed |
| `unlock` | en | the action: "Turn on", "Use" |
| `empower` | en | what the user can now do |
| `elevate` | en | what improves, and by how much |
| `next-gen` | en | the version or the feature |
| `revolutionize` | en | what changes |
| `supercharge` | en | the number that goes up |
| `effortless` | en | the number of steps |
| `cutting-edge` | en | the technique by name |
| `robust` | en | the failure it survives |
| `game-changer` | en | the result |
| `unleash` | en | the action |
| `leverage` | en | "use" |
| `シームレス` | ja | 省いた手順を書く（「ログインなしで開ける」） |
| `革新的` | ja | 何が変わるかを書く |
| `次世代` | ja | 版や機能の名前 |
| `を実現` | ja | 動詞で言い切る（「3分で送れる」） |
| `ことができます` | ja | 「できます」「〜れます」 |

Also drop absolute claims such as 「世界初」「究極」「完全に」 (Long form below). They are not
in the checkers because each needs a human to decide whether a source backs it.

## Generated Japanese

These two lines are composed examples of principle 7, not quotes from a live page.
The before line stacks an empty `ことができます`, two forbidden words, and an
unsupported `注目`. The patterns are from no-ai-slop-ja and the forbidden-word row
above.

| | Copy |
|---|---|
| Before | 本サービスは、あらゆるシーンにおいて、革新的でシームレスな体験を実現することができます。最新の機能にご注目ください。 |
| After | 請求書を3分で作り、そのまま送れます。送ったあとの入金も1画面で確かめられます。 |

## Long form

UI sentences stay at 60 Japanese characters (Length row). Reports, Knowledge prose,
and speaker notes use the ceilings below. The UI catalog is still checked for the
tells in the Decisions table. Intentional bad examples use a key that contains
`bad` or `before` (as in `badBody` or `heroBadTitle`), and the checker skips those keys.

| Decision | Value | One-line reason |
|---|---|---|
| Sentence length | 100 Japanese characters or fewer | Default of `textlint-rule-preset-ja-technical-writing`. The README says the defaults are strict. UI stays at 60. |
| Commas | at most 3 `、` in one sentence | Same preset. |
| Empty ability | 「送れます」, not 「送ることができます」 | `ai-tech-writing-guideline` rewrites `〜することができます` to `〜します`. |
| List items | no bold label, no emoji, no em dash before the text | `no-ai-list-formatting`. |
| Hype | Forbidden words still apply. Also drop absolute claims such as 「世界初」「究極」「完全に」 | `no-ai-hype-expressions` names this class. The preset's example sentences are not copied here. |

Not adopted: the same preset's "at most 6 kanji in a row". Its README says that rule always needs exceptions.

## Checks

| Rule | Where it is checked | Rule id |
|---|---|---|
| Forbidden words, English | `scripts/check-copy.mjs` (site messages), `static-audit.mjs` (any product) | `forbidden-en`, `filler-word` |
| Forbidden words, Japanese, `ことができます` | both | `forbidden-ja`, `empty-ability`, `ja-filler` |
| Em dash | both | `em-dash` |
| Exclamation mark | `check-copy.mjs` only | `exclamation` |
| 「注目されています」 without a source | `static-audit.mjs` | `unsupported-attention` |
| 「多くの人が見落とし」 without a source | `static-audit.mjs` | `unsupported-overlook` |
| 「させていただく」「形となっております」 | `static-audit.mjs` | `hidden-agent` |
| Dates joined with slashes | `static-audit.mjs` | `hand-rolled-date` |
| Placeholder content (lorem ipsum, John Doe) | `static-audit.mjs` | `placeholder-content` |
| Placeholder used as the label | `static-audit.mjs` | `placeholder-as-label` |
| Icon-only button without a name | `static-audit.mjs` | `icon-button-no-label` |
| Sentence length, link text, error wording, notation, register | review | none |

The review row is not automated on purpose. Sentence length depends on whether the text is UI
or long form, and the rest needs someone who reads the screen.

## Review procedure

Before a UI change ships:

1. Run `node scripts/check-copy.mjs` (this repository) or design-verifier's static audit
   (any product). Fix every finding or mark the line as a counterexample.
2. Read every button and link on the screen without the surrounding text. Each one should
   still say what it does.
3. Trigger each error. Check that the inline text and the summary match and name the fix.
4. Open the screen at 390 in Japanese and in English. No button wraps or truncates.
5. Read one paragraph aloud. Apple recommends it; sentences that run out of breath are too long.

## Alternatives considered

- Playful voice (Slack, Mailchimp early): needs a brand to carry it; the neutral system stays plain
  and lets a product DS add personality.
- Typed half-width spaces between Japanese and Latin or digits: they double up where
  `text-autospace` is supported; unsupported browsers show no gap and that is acceptable
  (japanese-typography.md).
- Japanese question marks in dialog titles: common in apps. 公用文作成の考え方 allows ？ where
  the meaning is lost without it. 「削除しますか」 is already a question through か, so
  AwesomeDS leaves ？ out and keeps one rule for every title.
- Placeholder as the only hint: Apple allows hint text in the placeholder. AwesomeDS keeps the
  hint outside the field because the placeholder disappears on input (forms.md).

## Sources

- 文化審議会, 公用文作成の考え方（建議, 2022）: ですます as the base, short respect (not stacked 敬語), no mixed register, 50 to 60 characters, formal nouns and auxiliary verbs in kana, できる, brackets: https://www.bunka.go.jp/seisaku/bunkashingikai/kokugo/hokoku/pdf/93651301_01.pdf (opened 2026-10-21)
- デジタル庁デザインシステム, リンクテキスト: destination in the link words, not gesture text: https://design.digital.go.jp/dads/foundations/link-text/ (opened 2026-10-21).
- Apple HIG, Writing: verbs on buttons, "Click here", step words, "we" in errors, empty states, error messages, settings, read aloud: https://developer.apple.com/design/human-interface-guidelines/writing (opened 2026-10-21)
- Material 3, Style guide for UX writing: https://m3.material.io/foundations/content-design/style-guide/ux-writing-best-practices (opened 2026-10-21)
- GOV.UK Design System, Error message (label words, words to avoid) and Button (sentence case): https://design-system.service.gov.uk/components/error-message/ , https://design-system.service.gov.uk/components/button/ (opened 2026-10-21)
- NN/g, Writing hyperlinks: https://www.nngroup.com/articles/writing-links/ (opened 2026-10-21)
- NN/g, Confirmation dialogs: https://www.nngroup.com/articles/confirmation-dialog/ (opened 2026-10-21)
- NN/g, Error message guidelines: https://www.nngroup.com/articles/error-message-guidelines/ (opened 2026-10-21)
- WCAG 2.2 Understanding 2.4.4, 2.4.6, 2.5.3, 3.3.1, 3.3.2, 3.3.3: https://www.w3.org/WAI/WCAG22/Understanding/link-purpose-in-context , https://www.w3.org/WAI/WCAG22/Understanding/headings-and-labels , https://www.w3.org/WAI/WCAG22/Understanding/label-in-name , https://www.w3.org/WAI/WCAG22/Understanding/error-identification , https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions , https://www.w3.org/WAI/WCAG22/Understanding/error-suggestion (opened 2026-10-21)
- MDN, `aria-busy`: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy
- no-ai-slop-ja, patterns including `ことができます` and unsupported `注目されています`: https://github.com/53able/no-ai-slop-ja (README fetched 2026-10-11)
- textlint-ja/textlint-rule-preset-ja-technical-writing, sentence length 100 and at most 3 `、`: https://github.com/textlint-ja/textlint-rule-preset-ja-technical-writing (README fetched 2026-10-14)
- textlint-ja/textlint-rule-preset-ai-writing, `ことができます`, list labels, hype: https://github.com/textlint-ja/textlint-rule-preset-ai-writing (README fetched 2026-10-14)
