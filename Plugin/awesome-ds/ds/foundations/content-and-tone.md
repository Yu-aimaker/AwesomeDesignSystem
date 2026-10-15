# Content and tone

Interface text is part of the design system. These rules make copy short, concrete and
consistent, in Japanese first and English second, and remove the tells of generated text.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Voice | plain, direct, second person implied; ですます in Japanese | Matches Digital Agency and Apple guidance; polite without being wordy. |
| Buttons | verb, 2 to 4 characters in Japanese (保存, 送信する, 削除), verb phrase in English | The label says what happens; "OK" says nothing. |
| Destructive | name the object and the loss: 「3 件を削除」, never 「本当に？」 | NN/g confirmation guidance; the user decides with the facts. |
| Errors | what happened, why, what to do next; no error codes in the first line | WCAG 3.3.1 and 3.3.3. |
| Empty states | one sentence of what belongs here plus one primary action | An empty screen is the first onboarding step. |
| Titles | noun phrase, sentence case in English, no trailing period | Headings are labels. |
| Numbers | half-width digits, `tabular-nums` in tables, thousands separator, unit after a thin space | 12,480 件, 184 ms. |
| Dates | 2026年9月7日 in Japanese prose (`Intl` `dateStyle: "long"`), `2026-09-07` in tables and code | The month is a word, so 10/08 cannot be read two ways. W3C date formats. |
| Punctuation | no exclamation marks, no em dashes, no ellipsis for suspense | Calm; three tells of generated copy. |
| Forbidden words | 「シームレス」「革新的」「次世代」「〜を実現」, "unleash", "seamless", "elevate", "empower" | Marketing filler that describes nothing. |
| Mixed script | half-width space between Japanese and Latin or digits (or `text-autospace`) | Legibility; see japanese-typography.md. |
| Length | body sentences under 60 characters in Japanese, 20 words in English | One idea per sentence. |

## Patterns

| Situation | Write | Not |
|---|---|---|
| Save succeeded | 保存しました | 正常に保存が完了しました！ |
| Network error | 接続できません。ネットワークを確認して、もう一度お試しください。 | エラーが発生しました (E1042) |
| Delete confirm | 「請求書 INV-1044」を削除します。元に戻せません。 | 本当に削除しますか？ |
| Empty list | まだ請求書がありません。最初の請求書を作成 | データがありません |
| Loading | 読み込み中 (with `aria-busy`) | Please wait... |
| Form hint | 8 文字以上。数字を 1 つ含めてください。 | パスワードが無効です |

## Generated Japanese

These two lines are composed examples of principle 7, not quotes from a live page.
The before line stacks an empty `ことができます`, two forbidden words, and an
unsupported `注目`. The patterns are from no-ai-slop-ja and the forbidden-word row
above.

| | Copy |
|---|---|
| Before | 本サービスは、あらゆるシーンにおいて、革新的でシームレスな体験を実現することができます。最新の機能にご注目ください。 |
| After | 請求書を 3 分で作り、そのまま送れます。送ったあとの入金も 1 画面で確かめられます。 |

## Alternatives considered

- Playful voice (Slack, Mailchimp early): needs a brand to carry it; the neutral system stays plain
  and lets a product DS add personality.
- Sentence-case Japanese punctuation rules from print (全角スペース): web practice and the Digital
  Agency guide prefer half-width spaces between scripts.

## Sources

- デジタル庁デザインシステム, ライティング: https://design.digital.go.jp/guidelines/writing/
- Apple HIG, Writing: https://developer.apple.com/design/human-interface-guidelines/writing
- Material 3, Style guide for UX writing: https://m3.material.io/foundations/content-design/style-guide/ux-writing-best-practices
- NN/g, Confirmation dialogs: https://www.nngroup.com/articles/confirmation-dialog/
- NN/g, Error message guidelines: https://www.nngroup.com/articles/error-message-guidelines/
- no-ai-slop-ja, patterns including `ことができます` and unsupported `注目されています`: https://github.com/53able/no-ai-slop-ja (README fetched 2026-10-11)
