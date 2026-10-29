# UX methods reference

Each entry: the principle, the check it gives you (a yes/no question or a number), and the AwesomeDS rule that implements it. Cite the entry name in stories, journey maps and recommendations.

## Laws of UX (Jon Yablonski's collection)

| Law | Check | AwesomeDS rule |
|---|---|---|
| Fitts's law | Are primary targets large (44px mobile, 40px controls) and near where the pointer or thumb already is? | DESIGN.md 4 (targets), 8 (button 40/48) |
| Hick's law | Does any screen present more than 7 choices of equal weight without grouping? | 9 (one primary per view), 1 (hierarchy by spacing) |
| Jakob's law | Does navigation, search and form behaviour match what the user's other apps do? | 8 (shadcn/Radix patterns) |
| Miller's law | Are lists and forms chunked into groups of 5 to 9 with headings? | 4 (spacing between groups 32 to 48) |
| Doherty threshold | Does feedback arrive within 400ms (optimistic UI, skeletons, button loading state)? | 7 (durations), 8 (loading states) |
| Aesthetic-usability effect | Does the page look consistent (one radius, one accent, aligned grid)? Users forgive less when it does not. | 5, 2, 4 |
| Von Restorff effect | Is the one thing that must stand out the only thing that stands out? | 2 rule 1 (accent once), 8 (one primary) |
| Zeigarnik effect | Do multi-step flows show progress and allow resume? | components/README.md (stepper, drafts) |
| Peak-end rule | Is the success state designed, not an alert()? Is the error state kind and specific? | 8 (states), 9 (copy) |
| Tesler's law | Is complexity absorbed by defaults rather than pushed to the user (sensible prefilled values)? | 8 (forms) |
| Postel's law | Do inputs accept messy data (spaces in phone numbers, full-width digits in Japanese forms)? | components/README.md (input) |
| Goal-gradient effect | Do long flows show how close the user is to done? | components/README.md (progress) |
| Serial position effect | Are the most important nav items first and last? | 10 (navigation) |

## Nielsen's 10 heuristics

| # | Heuristic | Check |
|---|---|---|
| 1 | Visibility of system status | Every async action shows loading within 400ms and result within view. |
| 2 | Match between system and real world | Labels use the user's words (no internal jargon, no "entity"). Japanese: natural です・ます, not machine-translated. |
| 3 | User control and freedom | Undo or cancel exists for destructive and multi-step actions; Escape closes overlays. |
| 4 | Consistency and standards | One DS, one radius family, one icon set, same label for the same action everywhere. |
| 5 | Error prevention | Confirm destructive actions, validate inline, disable impossible options rather than erroring later. |
| 6 | Recognition rather than recall | Recently used items, visible filters, no hidden gestures as the only path. |
| 7 | Flexibility and efficiency | Keyboard shortcuts and bulk actions for frequent users; defaults for novices. |
| 8 | Aesthetic and minimalist design | Every element changes what the user will do; cut the rest. |
| 9 | Help users recognise, diagnose, recover from errors | Error text says what happened and the next step, in plain language, next to the field. |
| 10 | Help and documentation | Inline help where the question arises, not a separate manual. |

## Norman (The Design of Everyday Things)

| Principle | Check |
|---|---|
| Affordance | Does a button look pressable (fill or border, 40px, cursor pointer)? Does a link look like a link (accent, underline)? |
| Signifier | Are interactive elements distinguishable from static ones without hovering? |
| Feedback | Does every action produce a visible, immediate response (hover, active, toast, state change)? |
| Mapping | Do controls sit next to what they control? Do arrows and positions match direction? |
| Constraint | Are impossible actions disabled or absent rather than allowed and then rejected? |
| Conceptual model | Can the user predict what a screen will do before clicking? Does the page flow diagram have surprises? |
| Gulf of execution / evaluation | How many steps from intent to action? How clearly can the user tell it worked? |

## Accessibility checks that belong in every walk-through (WCAG 2.2 AA)

- 1.4.3 contrast 4.5:1 body, 3:1 large text and UI. Compute with `skills/ds-creator/scripts/contrast.mjs`.
- 1.4.4 text resizes to 200% without loss; 1.4.10 reflow at 320px without horizontal scroll.
- 2.4.7 focus visible; 2.4.11 focus not obscured by sticky headers.
- 2.5.8 target size 24x24 minimum (AwesomeDS: 44 on mobile).
- 3.3.1 errors identified in text; 3.3.7 redundant entry avoided (no retyping).
- 2.3.3 animation from interactions can be disabled (prefers-reduced-motion).

## Japanese UX specifics

- Forms: accept full-width digits and convert; furigana fields only when the business needs them; postal code lookup fills the address.
- Copy: です・ます in product UI; avoid katakana loanwords when a Japanese word exists; no exclamation marks in system messages.
- Names: family name first; separate fields for 姓 and 名 when sorting or formal documents need it.
- Dates: 2026年9月6日 in prose, 2026-09-06 in tables; era names only when a legal form requires them.
- Line length: 40 full-width characters max for body; headings break at phrase boundaries (`word-break: auto-phrase` where supported).

## Impact × effort scoring

Impact 3: removes an abandonment cause for the primary persona or fixes an S1 accessibility issue. 2: shortens the primary task or fixes S2. 1: polish.
Effort 1: CSS or copy change in one file. 2: one component or route. 3: new flow, backend or data change.
Score = impact / effort. Ship score 3 and 1.5 first, then 1, then discuss the rest.
