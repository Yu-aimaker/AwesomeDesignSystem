# design-verifier rubric

Twelve sections, each scored 0 to 5. Anchors are written so two reviewers reach the same number. A section with any S1 finding scores at most 2. A section you could not check scores `n/a` and is excluded from the total (state the new denominator).

Scoring anchors used by every section:
- 5: no finding after looking at all viewports and both schemes.
- 4: one S3 finding.
- 3: several S3 or one S2.
- 2: one S1, or several S2.
- 1: multiple S1.
- 0: the section is absent or broken (for example no focus styles anywhere, no dark mode when the DS requires it).

## 1. Hierarchy
What to look at: can you name the page's one most important element from the 390 light screenshot in one glance? Do heading sizes step down in the DS scale (56, 36, 28, 20, 16)? Is hierarchy carried by size, weight and spacing rather than colour?
Findings: two elements compete for attention (S2); a heading smaller than the body text near it (S2); hierarchy carried only by colour (S3); more than one h1 (S2).

## 2. Alignment
What to look at: draw imaginary lines down the left edges of text and cards at 1280. Everything starts on one of at most three vertical lines. Icons align to the text baseline or cap height. Buttons in a row share a baseline.
Findings: an element off the grid by a visible amount (S3); centred long paragraphs (S3); mixed left and centre alignment in one section (S2).

## 3. Rhythm
What to look at: vertical spacing between sections repeats one value (64 mobile, 96 desktop) and spacing inside groups is smaller than between groups. Related items are closer than unrelated ones.
Findings: section gaps varying without reason (S3); equal spacing between a heading and its paragraph and between the paragraph and the next heading (S2, hierarchy lost); cramped card padding under 16px (S2).

## 4. Contrast
What to look at: run the contrast script on the DS, then eyeball the screenshots for text on images, text on soft backgrounds, placeholders, disabled text used as body, and dark-mode muted text. Body needs 4.5:1, large text and borders 3:1.
Findings: any text role below its threshold (S1); placeholder used as the only label (S1); a border that vanishes on its background where the border is the only boundary (S2).

## 5. Density
What to look at: does the density match the DS declaration (comfortable: 16px body, 24px card padding, 40px controls; compact: 14, 16, 32)? Is body 16px minimum? Is any text under 12px?
Findings: text under 12px (S1); body under 16px on a consumer page (S1); a data table wrapped in cards with 24px padding per cell (S3); a marketing page packed like a dashboard or the reverse (S2).

## 6. Consistency
What to look at: one radius family (controls 8, cards 12, dialogs 16, badges pill), one icon family and stroke, one accent used identically, one button height per size, one shadow model. Compare across routes, not only within one page.
Findings: two radius families on one page (S2); two icon families (S2); accent used as a button fill (S2); a raw colour that differs slightly from the token (S2); different button heights for the same size (S3).; broken image (not `complete` or `naturalWidth` 0, or image request 4xx/5xx, from capture.mjs) (S1); `<head>` without `og:image` or `twitter:card` (S2, static audit)

## 7. States
What to look at: from code and from the screenshots taken with `--states` (focus on first button, hover on first link): hover, focus-visible, active, disabled, loading for every interactive element; loading, empty, error for every data view.
Findings: no visible focus ring (S1); a button with no hover or disabled style (S2); a list with no empty state (S2); a form with no error style (S2); a loading state that is a spinner in the middle of a table instead of a skeleton (S3).

## 8. First-viewport hero
What to look at: at 390 wide, without scrolling: heading of at most two lines, one paragraph, one primary action. Nav on one line. No version badge, no scroll cue, no trust strip inside the hero. At 1280: hero content starts within 96px of the nav, heading at most two lines.
Findings: primary action below the fold at 390 (S1 on a marketing page, S2 otherwise); heading wraps to three lines or more (S2); two CTAs with the same intent (S3); a decorative strip or badge in the hero (S3).

## 9. Copy
What to look at: read every visible string. Sentences are short and specific and say what happens next. No em dashes. No filler (seamless, unlock, empower, elevate, next generation, revolutionize, supercharge, effortless, cutting-edge, robust). No placeholder names or lorem ipsum. Button labels are verbs plus objects. Error messages say how to recover.
Findings: lorem ipsum or Acme in delivered UI (S2); em dash in UI copy (S3, one finding per occurrence); filler word (S3 each); a button labelled "Submit" or "Click here" (S3); an error message with no recovery step (S2).

## 10. Japanese typography
Only when the page has Japanese text. Otherwise `n/a`.
What to look at: `lang="ja"` on html or the subtree; body line height 1.7 to 1.8; headings 1.4 to 1.5; letter spacing 0 to 0.02em, never negative; `palt` not applied to body; no line starting with 。、」; Latin and numerals in the Latin face; no faux bold; no italics on Japanese; full-width punctuation in Japanese sentences.
Findings: missing or wrong lang (S1); negative letter spacing on Japanese text (S2); body line height under 1.6 (S2); 12px running Japanese text (S1); 。 or 、 at a line start (S2); half-width punctuation inside Japanese sentences (S3).

## 11. DS conformance
What to look at: token usage share from the static audit; component measurements against the DS `components:` block; brand reflection (accent, type and tone visible and matching the DS atmosphere).
Findings: token share under 95% (S2); component height, radius or border off the spec (S2 each type); declared font not loaded (S2); accent absent everywhere (S3); tone of copy contradicting the DS tone (S3).

## 12. Human comfort
What to look at: the six questions in SKILL.md step (e). Each "no" is a finding.
Findings: primary action not findable in 5 seconds (S1); motion without user action (S2, S1 if it loops with no pause control); targets under 24 or 44 (S1); body under 16 (S1).

## 13. Charts
What to look at: a bar's length must match the amount. An axis that starts above zero makes a small gap look large. Line charts may use another baseline when the caption says so.
Findings: bar chart Y domain not starting at 0 (S2, static audit `bar-baseline`). Source: https://clauswilke.com/dataviz/visualizing-amounts.html

## Report discipline

- Every finding: severity, id, one-line problem, location (`file:line` or `shots/<name>.png`), rule reference, one-line fix.
- Never write "consider", "might", "could be improved". Write what is wrong and what to change.
- Never total the score before every section has been checked or marked `n/a`.
- Count repeated mistakes. Twelve raw colours are twelve findings collapsed into one line with a count, not "some raw colours".
