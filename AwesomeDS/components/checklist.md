# Pre-ship checklist

Run this before declaring any AwesomeDS UI done. Each item is a yes/no test. "Yes" passes.
If an item cannot be checked, say so in the hand-off instead of skipping it silently.
Items marked (mechanical) can be checked with grep or a script.

## 1. Color and contrast

| # | Test | Pass condition |
|---|---|---|
| 1.1 | Is every text color a `--ds-*` role, not a raw hex? (mechanical) | `grep -E "#[0-9a-f]{3,8}" src/` returns nothing outside tokens files |
| 1.2 | Does every text/background pair reach 4.5:1 (3:1 for 24 px+ text)? | Checked against the table in `foundations/color.md`; no `ink-muted` on `surface-sunken`; no light `warning` text at 14 to 16 px |
| 1.3 | Do UI boundaries (input borders plus focus ring, checkbox borders, icons) reach 3:1? | Yes for each control class |
| 1.4 | Is the accent used only for links, focus, selection and at most one highlight? (mechanical) | Count of `accent` fills outside links and focus is 0 or 1 per view |
| 1.5 | Is the primary button ink on canvas? | Yes; no accent-filled buttons |
| 1.6 | Does every status color carry an icon or a word? | Grayscale screenshot still communicates status |
| 1.7 | Does dark mode use the dark tokens and lighter surfaces for elevation, with no shadows on cards? | Yes, both `[data-theme="dark"]` and `prefers-color-scheme` render correctly |

## 2. Focus and keyboard

| # | Test | Pass condition |
|---|---|---|
| 2.1 | Does `outline: none` appear without a replacement ring? (mechanical) | No occurrence, or each has a 2 px 3:1 alternative |
| 2.2 | Can every interactive element be reached with Tab and operated with Enter/Space? | Manual pass through the page; no dead ends |
| 2.3 | Do dialogs, menus and sheets close on Escape and return focus? | Yes |
| 2.4 | Is the focused element never hidden under the sticky nav? | `scroll-padding-top` set; manual check at 390 px |
| 2.5 | Are there no `div` or `span` elements with click handlers? (mechanical) | grep for `onClick` on non-button, non-anchor elements returns nothing |

## 3. Component states

| # | Test | Pass condition |
|---|---|---|
| 3.1 | Does every button, link, input and menu item have hover, focus-visible, active and disabled styles? | Visible in a states story or dev route |
| 3.2 | Does every async action have a loading state that keeps the label and sets `aria-busy`? | Yes |
| 3.3 | Does every data view have skeleton, empty and error states? | Three states rendered and checked |
| 3.4 | Does every form field have a visible label above, and an error message below with an icon? | Yes; no placeholder-only labels |
| 3.5 | Is there exactly one primary button per view? (mechanical) | Count of `variant="primary"` (or default) per route is 1 |

## 4. Copy

| # | Test | Pass condition |
|---|---|---|
| 4.1 | Are there any em dashes in UI strings, alt text, or headings? (mechanical) | `grep -rn "—" src/` returns nothing |
| 4.2 | Do any strings contain filler words (`seamless`, `unlock`, `elevate`, `empower`, `delightful`, `next-generation`, `revolutionize`)? (mechanical) | grep returns nothing |
| 4.3 | Are all numbers real, or clearly labelled as examples? | No `99.99%`, `4.1x`, `48k` without a source |
| 4.4 | Do button labels start with a verb and fit on one line at every breakpoint? | Yes |
| 4.5 | Is there one label per intent (no "Get started" and "Try free" on the same page)? | Yes |
| 4.6 | Are names, companies and avatars realistic or marked as sample data? | No "John Doe", "Acme", egg avatars |
| 4.7 | Are section labels plain ("Testimonials"), not poetic or numbered? | Yes |

## 5. Layout

| # | Test | Pass condition |
|---|---|---|
| 5.1 | Does each layout family appear at most once on the page? | List section families; no repeats |
| 5.2 | Are there at most two consecutive image/text split sections? | Yes |
| 5.3 | Is there no default row of three identical cards? | Yes, or justified: exactly three equal items and the only card grid |
| 5.4 | Eyebrow count: is it at most ceil(sections / 3), hero included? (mechanical) | Count of `uppercase tracking` labels above headings passes |
| 5.5 | Does the hero fit in the first viewport at 390 x 844 with heading (max 2 lines at 32 px), one paragraph, primary button visible? | Screenshot confirms |
| 5.6 | Does the hero have at most four text elements and no trust strip, pricing teaser or avatar row? | Yes |
| 5.7 | Is the nav one row at 1024 px and at most 80 px tall? | Yes |
| 5.8 | Is text left-aligned except short display headings and empty states? | Yes |
| 5.9 | Is `100vh` or `h-screen` absent? (mechanical) | grep returns nothing; `100dvh` used instead |
| 5.10 | Does every multi-column layout declare its `< 768` fallback in the same component? | Yes |
| 5.11 | Is the container 1200 px and paragraphs 65ch or narrower? | Yes |
| 5.12 | Are all spacing values from the 4 px scale? (mechanical) | No arbitrary values like `p-[13px]` or `mt-7` outside the scale |

## 6. Shape and elevation

| # | Test | Pass condition |
|---|---|---|
| 6.1 | Do controls use 8, cards 12, dialogs 16, badges pill, with no other radii? (mechanical) | grep for `rounded-` values outside the token set returns nothing |
| 6.2 | Do nested elements use outer minus padding? | Spot check cards with media |
| 6.3 | Do cards at rest have a border and no shadow? | Yes |
| 6.4 | Are shadows only on popovers, menus, tooltips, toasts, dialogs and drag layers, using `--ds-shadow-2/3`? | Yes |
| 6.5 | Is there any gradient, glow, glass or blurred blob used as decoration? | None, or a documented `ds-creator` exception |

## 7. Motion

| # | Test | Pass condition |
|---|---|---|
| 7.1 | Is every animation triggered by a user action, a state change, or a load? | No motion on static informational content |
| 7.2 | Are durations 100 to 300 ms inside a view, using `--ds-ease-out` for enters? (mechanical) | No `ease`, `linear` (except progress), or durations over 300 ms in UI |
| 7.3 | Do enters travel at most 8 px and scale from at least 0.98? | Yes |
| 7.4 | Does anything loop forever besides progress indicators and skeletons? | No |
| 7.5 | Are only `transform` and `opacity` animated? (mechanical) | No transitions on `width`, `height`, `top`, `box-shadow`, `filter` |
| 7.6 | Does `prefers-reduced-motion: reduce` remove transforms, loops and parallax? | Emulated in devtools; page is still usable |
| 7.7 | Is there no scroll or pointer value stored in React state? (mechanical) | No `useState` fed by scroll or mousemove listeners |
| 7.8 | Is only one animation library loaded per page? | Yes |

## 8. Accessibility and semantics

| # | Test | Pass condition |
|---|---|---|
| 8.1 | Does every `<img>` have `alt` (empty for decorative)? (mechanical) | Yes |
| 8.2 | Does every icon-only button have `aria-label` and the icon `aria-hidden`? (mechanical) | Yes |
| 8.3 | Is `<html lang="...">` set and correct (`ja` for Japanese pages)? (mechanical) | Yes |
| 8.4 | Is there one `h1` and are heading levels in order? (mechanical) | Yes |
| 8.5 | Are landmarks present (`header`, `nav`, `main`, `footer`)? | Yes |
| 8.6 | Do inputs link to helper and error text via `aria-describedby`, with `aria-invalid` on error? | Yes |
| 8.7 | Do all pointer targets meet 44 px on touch and 24 px on desktop? | Yes |
| 8.8 | Does the page reflow to one column at 320 px without horizontal scroll? | Yes |
| 8.9 | For Japanese pages: is `:lang(ja)` active (line-height 1.8, `line-break: strict`), no negative tracking, `palt` only on headings? | Yes |

## 9. Assets and dependencies

| # | Test | Pass condition |
|---|---|---|
| 9.1 | Are all fonts self-hosted with `font-display: swap` and a fallback with `size-adjust`? | No runtime font `<link>`; CLS under 0.1 |
| 9.2 | Are Latin and Japanese fonts loaded as separate subsets? | Yes |
| 9.3 | Do all images have `width`, `height` or `aspect-ratio`, and do external URLs resolve? | Yes |
| 9.4 | Are there any div-built fake screenshots or fake terminals? | None |
| 9.5 | Is every imported package present in `package.json`? (mechanical) | Yes |
| 9.6 | Is the shadcn default theme replaced by `--ds-*` tokens? | Yes |

## 10. Hand-off

| # | Test | Pass condition |
|---|---|---|
| 10.1 | Did the response state the page kind and audience in one line before code? | Yes |
| 10.2 | Are skipped checks listed with a reason? | Yes, or nothing skipped |
| 10.3 | Are needed real assets listed with size and placement (`hero image 1600x1200`)? | Yes, if placeholders remain |

## Sources

- https://www.w3.org/TR/WCAG22/ : criteria behind sections 1, 2, 8.
- https://www.nngroup.com/articles/ten-usability-heuristics/ : states, feedback and consistency checks.
- https://www.nngroup.com/articles/keyboard-accessibility/ : keyboard-only pass.
- https://www.nngroup.com/articles/animation-duration/ : duration bounds.
- https://playwright.dev/docs/test-snapshots : screenshot checks for 5.5 and 1.7.
- https://web.dev/articles/font-best-practices : font loading checks.
- https://github.com/Leonxlnx/taste-skill : mechanical eyebrow count, layout-family, hero fit, copy audit, em dash and dependency checks (section 14 pre-flight).
