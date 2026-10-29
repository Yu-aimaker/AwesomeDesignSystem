# Forms

Forms in AwesomeDS have the label above the field, helper text below, the error below the
helper, required fields marked in words, and validation that runs when the user leaves a
field and then re-runs on each change until it passes. Japanese forms accept full-width
input and normalise it; they never reject it. This file gives the rules and the attributes.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Label position | Above the field, left-aligned, 14/500 `ink` | Fastest completion in eye-tracking; one column, one scan path (NN/g web form design). |
| Helper text | Below the field, 12 to 14 `ink-secondary`, always visible | Instructions hidden in placeholders vanish on focus (NN/g placeholders). |
| Error text | Below the helper, 14 `danger`, 16 px icon, linked by `aria-describedby` | 3.3.1 and 3.3.3; the fix sits next to the field. |
| Required marking | "(required)" or "(optional)" in the label text; mark whichever is the minority; asterisk allowed only with a legend | Baymard: users guess wrong when only one kind is marked; a bare asterisk is not announced. |
| Sizes | control 40 (md), 32 (sm), 48 (lg); compact density 32 / 28 / 40 | Same ladder as buttons so rows align. |
| Input text | 14 px on fine pointers; 16 px on `(pointer: coarse)` for `input`, `select` and `textarea` (set in `tokens.css`) | iOS Safari zooms the page into a focused field under 16 px, and the user has to zoom back out (CSS-Tricks; DADS sets 16 CSS px as the floor). |
| Field width | Match the expected length: postal code 8ch, year 6ch, email full width | Width is a hint about the answer (Baymard). |
| Validation timing | On blur; then on every change of a field that is already invalid; whole form on submit | Errors appear after the user finishes, and clear as soon as they fix them. Never on first focus. |
| Gap | Label to field 8, field to field 16 to 20, group to group 32 | Spacing bands from spacing.md. |
| Grouping | `fieldset` with `legend` for radio groups and address blocks; heading plus 32 px for sections | 1.3.1 relationships; proximity groups without boxes. |
| Multi-step | Stepper at top, one topic per step, Back never loses data, review step before submit | NN/g wizards: fewer fields per screen, but never hide progress. |
| Autofill | `autocomplete` token on every field that has one; `name` also set | Browsers fill only when tokens are present; WCAG 1.3.5. |
| Mobile keyboards | `inputmode` and `type` per field | The right keyboard cuts errors; see the table. |
| Submit | One primary button, left-aligned under the form in a page, right-aligned in a dialog | One rule per surface. |

## Anatomy

```
Label (required)                      <- 14/500 ink, `for` points at the input
[ control 40px                      ] <- surface, 1px hairline-strong, radius 8, padding 0 12
Helper text in one sentence.          <- 12-14 ink-secondary, id referenced by aria-describedby
(!) Error: what happened and the fix. <- 14 danger, icon 16, id referenced by aria-describedby
```

Placeholder text is an example of the answer ("name@company.com"), never the label and never
the instruction. It uses `ink-muted` on `surface`, which passes 4.5:1.

## Validation

| Moment | Behaviour |
|---|---|
| Focus | Nothing. A field is not wrong before it has been touched. |
| Typing | Nothing for a clean field. For a field already in error, re-validate on each change and clear the error the moment it passes. Password strength and character counts are the exception: they update live because the user is asking a question. |
| Blur | Validate the field. Show the error below it. |
| Submit | Validate all. Move focus to the first invalid field. Above eight fields, also render an error summary at the top with links to each field. |
| Server error | Map field errors to their fields; show an unmapped error at the top in a `role="alert"` banner. Keep every value. |

Error text follows the formula in content-and-tone.md: what happened, why, what to do.
"Enter an email address with an @" beats "Invalid input".

Do not disable the submit button while the form is invalid. A disabled button does not
explain itself; a click that focuses the first error does.

## Attributes per field

| Field | `type` | `inputmode` | `autocomplete` | Notes |
|---|---|---|---|---|
| Full name | text | text | `name` | Japanese: one field, family name first; do not split by default |
| Given / family (when split) | text | text | `given-name`, `family-name` | Order by locale: family first for ja |
| Email | email | email | `email` | Trim; lowercase the domain only |
| Phone | tel | tel | `tel` | Accept hyphens and full-width digits, normalise |
| Postal code (JP) | text | numeric | `postal-code` | 7 digits, accept `123-4567` and `１２３４５６７` |
| Address | text | text | `street-address`, `address-level1` (prefecture), `address-level2` (city) | ja order: prefecture, city, street, building |
| Organization | text | text | `organization` | |
| Password (login) | password | text | `current-password` | Show/hide toggle; allow paste (WCAG 3.3.8) |
| Password (new) | password | text | `new-password` | Live strength meter, requirements listed before typing |
| One-time code | text | numeric | `one-time-code` | 6 boxes or one field; one field is more robust |
| Card number | text | numeric | `cc-number` | Group by 4; detect brand |
| Amount | text | decimal | off | Right-aligned, `tabular-nums`, currency from locale |
| Search | search | search | off | Clear button inside the field |
| URL | url | url | `url` | |

Prefix with `shipping` or `billing` and group with `section-*` when a form has two addresses.

## Japanese input specifics

| Topic | Rule |
|---|---|
| IME composition | Do not validate or filter keystrokes between `compositionstart` and `compositionend`. Reading text is not the value. Run blur validation on the committed value. |
| Full-width digits and Latin | Accept them. Normalise with `String.prototype.normalize("NFKC")` on blur and on submit, then validate. Never show "半角で入力してください" as the only path. |
| Half-width katakana | Convert to full-width on blur for names and addresses (NFKC does this). |
| Furigana | Ask only when the service needs it (banking, government). Separate field, `autocomplete` off, `inputmode="text"`. Auto-fill from the name field when the IME exposes reading, but let the user edit. |
| Name order | Family name then given name. A single "お名前" field is the default. |
| Postal code | `〒` is decoration, not part of the value. Look up the address from the code and prefill prefecture and city; keep them editable. |
| Address order | 都道府県, 市区町村, 番地, 建物名. Prefecture as a `select` with 47 entries. |
| Phone | Accept `090-1234-5678`, `09012345678`, and full-width; store digits only. |
| Dates | Western year by default; show 和暦 in helper text when the audience expects it ("2026年（令和8年）"). Never force era input. |
| Error copy | Polite form, no blame: "メールアドレスの形式で入力してください" rather than "不正な入力です". |

The Digital Agency design system publishes form templates with the same intent: accept what
users type, convert on their behalf, and keep labels visible.

## Layout

- Single column. Two columns only for pairs that belong together (given and family name,
  city and postal code) at 640 px and above.
- Long forms are split by topic with a heading (h3) and 32 px; over about eight fields or two
  topics, use steps.
- Actions: primary submit first (left) then Cancel as ghost, under the last field, 24 px gap.
  In dialogs the order flips (secondary then primary, right-aligned).
- Sticky action bar only when the form scrolls beyond one viewport on mobile.

## Multi-step forms

1. Stepper shows all steps with names, current step marked, completed steps clickable.
2. One topic per step; three to seven fields.
3. Back keeps entered values. Refresh keeps them too (session storage).
4. Last step is a review with an Edit link per section.
5. Save draft when the flow takes more than five minutes or requires documents.
6. Do not ask for anything twice (WCAG 3.3.7 Redundant Entry).

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Floating labels (Material) | Label shrinks into the border; harder to read; conflicts with helper text placement. |
| Left-aligned labels in a second column | Longer scan path; breaks at 390 px. |
| Validate on every keystroke | Errors while typing; measured as annoying (Baymard, NN/g). |
| Validate only on submit | Users hunt for errors after a long form. |
| Reject full-width input | Forces the user to switch IME modes; the browser can normalise. |
| Disabled submit until valid | Hides why the form cannot be sent. |
| `maximum-scale=1` in the viewport meta to stop the input zoom | Also blocks pinch zoom for everyone (MDN; WCAG 1.4.4). Raise the text to 16 px instead. |
| Asterisk only for required | Not announced; users still guess which fields matter. |

## Sources

- https://www.nngroup.com/articles/web-form-design/ : labels above fields.
- https://css-tricks.com/16px-or-larger-text-prevents-ios-form-zoom/ : iOS Safari zooms into inputs under 16 px (2021, secondary source, opened 2026-10-21).
- https://design.digital.go.jp/dads/foundations/typography/ : 16 CSS px or more for body and UI text (opened 2026-10-21).
- https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/viewport : disabling zoom harms people with low vision (opened 2026-10-21).
- https://www.nngroup.com/articles/form-design-placeholders/ : placeholders are not labels.
- https://www.nngroup.com/articles/errors-forms-design-guidelines/ : inline errors next to the field, error summary.
- https://www.nngroup.com/articles/error-message-guidelines/ : precise, constructive, no blame.
- https://www.nngroup.com/articles/wizards/ : wizard definition and benefits.
- https://baymard.com/blog/inline-form-validation : inline validation after the user leaves the field; premature validation harms.
- https://jakobnielsenphd.substack.com/p/required-fields : mark required and optional.
- https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/reference/attributes/autocomplete/index.md : autocomplete tokens, `section-*`, `shipping`, `billing` (fetched).
- https://raw.githubusercontent.com/mdn/content/main/files/en-us/web/html/reference/global_attributes/inputmode/index.md : `inputmode` values and keyboards (fetched).
- https://raw.githubusercontent.com/w3c/wcag/main/understanding/22/target-size-minimum.html : 24 px target minimum for controls (fetched).
- https://www.allaccessible.org/blog/wcag-338-accessible-authentication-minimum-guide : 3.3.8 Accessible Authentication, allow paste and password managers.
- https://www.digital.go.jp/en/policies/servicedesign/designsystem/20230531-1 : Digital Agency form templates (seen in search; host not fetchable here).
- https://qiita.com/nozomi2025/items/3b18e3acba63e9d6fdd6 : why Japanese forms demand full-width and how to normalise instead.
- https://www.w3.org/International/jlreq/ : Japanese layout requirements referenced for character classes.
