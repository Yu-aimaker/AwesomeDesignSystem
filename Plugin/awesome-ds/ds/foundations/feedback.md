# Feedback and notifications

AwesomeDS has five ways to tell the user something: no message, an inline message, a banner,
a toast, and a dialog. This file picks one by two questions: where does the message belong
(a field, the page, the whole product, nowhere in view) and must the user act before going on.
The rules come from Carbon, Atlassian, Primer and GOV.UK, which agree on most points. Where
they differ, the rule says which one AwesomeDS follows.

## Decisions

| Decision | Value | One-line reason |
|---|---|---|
| Default | No message when the result is visible on screen (the row appears, the toggle flips) | Primer: a simple success is self-evident; an extra toast can lower trust. |
| Field problem | Inline message under the field, rules in forms.md | Carbon and Primer: feedback next to the input it is about. |
| Form problem on submit | Error summary at the top of the form, plus inline messages | GOV.UK: never a banner or toast for validation errors. |
| Page or section state | Banner at the top of the content, before the h1 | Carbon, Primer and GOV.UK place it where the reader starts. |
| Background result | Toast, only for results not shown in the current view | Carbon: toasts are for messages not tied to one section of the UI. |
| Must decide now | Dialog | Carbon and Atlassian: the most disruptive type, for critical or data-loss messages. |
| Fixed important note | Callout in the content: loads with the page, no close button, no status color | Carbon callout, GOV.UK inset text. |
| Auto-dismiss | Only toasts without an action, 5 s. Errors, warnings and toasts with an action stay until dismissed | WCAG 2.2.1 Timing Adjustable; Carbon and Atlassian both forbid timed critical messages. |
| How many | One banner per page, one dialog at a time, three toasts at most | GOV.UK and Carbon: merge related banners or show only the highest priority. |
| Banner with error summary | Never on the same page; show only the summary | GOV.UK notification banner guidance. |
| Actions | One action in a toast, two at most in a banner | Carbon: one action per notification; Atlassian: two links at most. |
| Status | Icon plus a word ("成功", "エラー"), never color alone | WCAG 1.4.1; GOV.UK uses a heading for the same reason. |

## Choosing

| The message is about | The user must act now | Use |
|---|---|---|
| One field | no | Inline message |
| The whole form, after submit | yes, to send it | Error summary + inline messages |
| What they just did, and the result is on screen | no | Nothing |
| What they just did, result off screen (export, send, background job) | no | Toast |
| What they just did, and it can be undone | no | Toast with "元に戻す", no timer |
| This page or section (read-only mode, quota near limit, sync failed) | no | Banner |
| The whole product (maintenance, outage) | no | Banner on every page, dismissible |
| Losing data or access | yes | Dialog |
| Something always true on this page | no | Callout |

Read the table top to bottom and stop at the first match. A message that fits two rows takes
the quieter one.

## Anatomy and tokens

| Type | Surface | Border | Radius | Icon | Placement |
|---|---|---|---|---|---|
| Inline | none | none | none | 16 px status icon | Under the field or the control it is about |
| Error summary | `danger-soft` | 1 px `danger` | `radius-lg` | 20 px | Top of the form; focus moves to it on submit |
| Banner | status `-soft`, or `surface-sunken` for neutral | 1 px status color, or `hairline` | `radius-lg` | 20 px | Above the h1, same width as the content; in a dialog, under the header |
| Toast | `surface` | `hairline` | `radius-lg` | 16 px | Bottom right, bottom center under 640 px; shadow level 2, layer 60 |
| Callout | `canvas-soft` | `hairline` | `radius-lg` | optional, `ink-secondary` | In the reading flow where it applies |
| Dialog | components/README.md, Dialog | | `radius-xl` | | Centered; sheet under 640 px |

Text stays `ink` on every `-soft` surface (color.md, Status colors). The status color goes to
the icon and the border.

## Accessibility

| Type | Markup |
|---|---|
| Inline | Linked with `aria-describedby`; field gets `aria-invalid="true"` |
| Error summary | Heading plus a list of links to each field; `tabindex="-1"` and focus on submit |
| Banner | `role="region"` and `aria-labelledby` pointing at its heading |
| Banner after a redirect that confirms success | Heading "完了しました", removed on the next page |
| Toast | Inside one `aria-live="polite"` region (`role="status"`); `role="alert"` only for a blocking error |
| Toast with an action | Reachable by keyboard without moving focus to it on arrival; Escape closes |
| Dialog | Focus trap, Escape closes, focus returns to the trigger (accessibility.md) |

Toasts are rendered at the end of the DOM, away from the control that caused them. Primer
lists this under WCAG 1.3.2 Meaningful Sequence. Keep anything the user must read to finish
the task out of toasts.

## Writing

Follow content-and-tone.md. Per type:

- Success: the outcome and, when something was created, a link to it. 「請求書を送信しました。表示」.
- Warning: something that will happen. 「残り 3 日で無料期間が終わります」. Something that already
  happened is an error.
- Error: what happened and the next step, no blame, no code in the first line.
- Length: inline two lines at most, toast three lines at most (Carbon). Longer content goes to a
  banner or a page.

## Long-running work

Show progress where the work started (Progress, states.md). When it finishes, use a banner on
that page if the user is still there, a toast if they moved on, and the product's notification
channel (email, notification list) when it took longer than a few minutes. Primer recommends
the same split for GitHub.

## Celebration

No confetti, bounce or mascot by default. Duolingo shows that celebration works for a learning
product with a brand to carry it; AwesomeDS is the neutral base, so celebration is added by
`ds-creator` when the brief asks for it. Motion stays under motion.md either way.

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Toast for every save | Primer: hides the message from screen readers in sequence and adds noise to a visible result. |
| Toast for form errors | The error ends up far from the field and disappears; GOV.UK and the components spec forbid it. |
| Auto-dismiss errors after 8 s | WCAG 2.2.1; some users need longer to read. |
| No toasts at all (Primer's direction) | Background results with no on-screen change still need a signal; AwesomeDS keeps the toast for that case only. |
| Several banners stacked | GOV.UK and Carbon: users miss them; merge or keep the highest priority. |
| Flags at bottom left (Atlassian) | AwesomeDS keeps Sonner's bottom right so one rule covers every product. |

## Sources

- https://carbondesignsystem.com/patterns/notification-pattern/ : inline, toast, actionable, callout, banner, modal; timed dismissal never for critical messages; one banner and one modal at a time.
- https://atlassian.design/components/flag/usage : never auto-dismiss critical warnings or errors; two actions at most; warning versus error wording.
- https://design-system.service.gov.uk/components/notification-banner/ : one banner per page, placed before the h1, `role="region"`; never for validation errors; not together with an error summary.
- https://primer.style/product/ui-patterns/notification-messaging/ : banner, inline message and dialog as the choices; banner placement inside dialogs.
- https://primer.style/accessibility/toasts/ : toast problems under WCAG 2.2.1, 1.3.2, 2.1.1, 4.1.3; alternatives per situation.
- https://www.w3.org/WAI/WCAG22/Understanding/timing-adjustable.html : 2.2.1 Timing Adjustable.
- https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html : 4.1.3 Status Messages.
