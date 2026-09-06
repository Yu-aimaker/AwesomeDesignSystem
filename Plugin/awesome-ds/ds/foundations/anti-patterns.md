# Anti-patterns

Generated UI has recognisable habits. Each one below is a real default that language
models fall into, the reason it reads as generated, and the AwesomeDS replacement.
Most items come from the taste-skill production tests; the rest from measured leaders
and NN/g research.

## Visual

| Tell | Why it reads as generated | AwesomeDS replacement |
|---|---|---|
| Purple or violet gradient accents, "AI glow" | The most repeated default palette of 2023 to 2025 | One accent, saturation under 80 percent, no gradients on backgrounds. Purple only if the brand owns it. |
| Glass (backdrop blur) on every card | Depends on what is behind it; unreadable on busy content; Apple's material is platform-only | Borders before shadows. Blur only on a sticky nav over imagery with a solid fallback. |
| Centered hero over a dark mesh gradient | Composition with no content decision behind it | Left-aligned hero, real visual or none, `canvas` background. |
| Neon outer glows, colored drop shadows | No physical analogue; noise | Ink-tinted shadows at levels 2 and 3 only. |
| Pure `#000000` backgrounds or text | Harsh; halation on OLED | `#0a0a0a`. |
| Warm cream + brass + espresso palette for every "premium" brand | Second most repeated AI palette | True grays plus one brand accent; warm palettes via `ds-creator` only. |
| Decorative colored status dots on every list item | Dot without state means nothing | Dots only for real status, with a label. |
| Crosshair or hairline grid lines as decoration | Lines that organise nothing | Grid lines only around real content. |
| Custom cursors | Accessibility and performance cost | Never. |

## Typography and copy

| Tell | Why | Replacement |
|---|---|---|
| Inter + slate + purple | The default stack of generated SaaS pages | Geist + true gray + one accent. Inter is fine when a brief asks for it. |
| Serif display "because it feels premium" | The tested AI response to any "creative" brief | Sans display in the same family; serif only when the brand names one. |
| Em dashes in UI copy, headlines, captions, alt text | The single most-violated tell in production tests | Period, comma, or a new sentence. |
| Filler verbs and adjectives: seamless, unlock, elevate, empower, delightful, next-generation, revolutionize | Words that describe nothing the user can do | Concrete verbs and nouns: "Export as CSV", "Invite your team". |
| Fake-precise numbers: 99.99%, 4.1x, 48k users | Invented specs | Real numbers or none. If a metric is illustrative, say so in the copy. |
| Fake-round numbers: 50%, 1,000,000 | Read as placeholders | Same as above. |
| Generic names: John Doe, Sarah Chan, Acme, Nexus | Placeholder content | Locale-appropriate realistic names or clearly marked sample data. |
| Poetic section labels: "From the field", "Loose plates" | Performed craft | Plain labels: "Testimonials", "Latest writing". |
| Micro-meta sentences under headings ("The list will stay short on purpose.") | Padding | Heading plus body. |
| Oversized H1 that screams | Size used instead of hierarchy | 36 to 56 px; weight and space do the rest. |
| `<br>`-split italic headlines | Design move without a reason | Natural line breaks; italic only for emphasis within the same family. |

## Layout

| Tell | Why | Replacement |
|---|---|---|
| Three equal feature cards in a row | The template feature section | Two-column list, asymmetric grid, single column, or a table. Three cards only when exactly three equal items exist and it is the only card grid. |
| Eyebrow above every section heading | Templated rhythm | Max one eyebrow per three sections. |
| Section-number eyebrows (`01 / Features`), version labels (`v2.0 BETA`) in the hero | Decorative metadata | Plain-language topic or nothing. |
| Same layout family repeated down the page | The eye learns it in two sections and skips | Each family at most once per page; at least four families on an eight-section page. |
| Zigzag image/text alternation for six sections | Banal after two | Cap at two consecutive; then a full-width or stacked section. |
| Bento with empty cells | Planned for a template, not the content | Cells equal items. |
| Split header (big heading left, small paragraph right) | Decoration for a one-message section | Stack heading and paragraph, 65ch. |
| Trust logos, pricing teaser, avatar row stuffed into the hero | Hero as a feature list | Move below the hero. Hero has at most four text elements. |
| `h-screen` / `100vh` heroes | Jumps when mobile toolbars move | `min-height: 100dvh`. |
| Centered long paragraphs | Slow reading | Left-aligned, 65ch. |
| Nav wrapping to two lines on desktop | Broken layout | Condense labels, drop items, or use a menu; cap nav at 64 to 80 px. |

## Components and content

| Tell | Why | Replacement |
|---|---|---|
| Div-based fake screenshots (fake dashboard, fake terminal, fake task list) | The number one visual tell; it is a drawing of a product, not the product | Real screenshot, generated image, real component preview, or nothing. Leave a labelled `<!-- TODO: hero image 1600x1200 -->` slot. |
| Fake version footers inside mockups ("v0.6.2-rc.1 · last sync 4s ago") | Adds nothing | Remove. |
| Infinite micro-animations (pulse, float, shimmer, typewriter) on informational content | Motion without a trigger | Motion is feedback. Loops only for progress and skeletons; both stop under reduced motion. |
| Auto-forwarding carousel | NN/g: annoys users, hides content | Static hero, or user-controlled carousel with visible controls. |
| Icon-only buttons and nav without labels | Universal icons are rare; hover labels fail on touch | Visible label in nav; `aria-label` plus tooltip for toolbar icons. |
| Placeholder as label | Disappears on focus; fails recall and screen readers | Label above the input, always visible. |
| Success-state-only components | No loading, empty, error, disabled | Every interactive component ships all states; every data view ships skeleton, empty, error. |
| Generic avatar egg or user icon for testimonials | Placeholder content | Real photos or a specific initials style. |
| Two CTAs with the same intent ("Get started" and "Try free") | Duplicate choices slow decisions (Hick) | One label per intent, reused everywhere. |
| CTA label wrapping to two lines | Broken button | Max three words or a wider button. |
| Tooltip carrying essential information | Hidden on touch | Essential text on the page; tooltips for extras. |
| `outline: none` on focus | Removes the keyboard indicator | `:focus-visible` ring, 2 px accent. |
| Hand-rolled SVG icons | Optical inconsistency | One icon family. |
| Emoji as icons in product UI | Renders differently per OS | Icon family glyphs. |
| Mixed radii (pill buttons, sharp cards) | Two systems on one page | One radius family. |
| Mixed grays (warm in the header, cool in the footer) | Two palettes | One true-gray ramp. |
| Middle-dot chains (`a · b · c · d`) | Metadata soup | One separator per line max; prefer line breaks or columns. |
| Broken external image links (dead Unsplash URLs) | Unverified assets | Real assets, generated images, or seeded placeholders that are known to resolve. |

## Process tells

| Tell | Replacement |
|---|---|
| Starting from a layout and filling it with copy | Write the copy, then choose the layout (content first). |
| Choosing an aesthetic before reading the brief | State the page kind and audience in one line first (DESIGN.md section 12). |
| Importing a library that is not in `package.json` | Check first; print the install command. |
| Shipping the default shadcn theme | Restyle radii, colors, shadows with tokens. Never ship the default state. |
| Skipping the checklist because "it looks fine" | Run `components/checklist.md`; report what was skipped. |

## Why these matter

Users judge a page in about 50 ms and then scan rather than read. A page that matches the
generated template is read as low effort, and NN/g's credibility research ties visual
quality to trust. The anti-patterns above are the shortcuts that produce that template.
Avoiding them is not about novelty; it is about making decisions the content supports.

## Sources

- https://github.com/Leonxlnx/taste-skill : the production-test tells (sections 0.D, 4.1, 4.2, 4.7, 4.8, 9.A to 9.G, 14) that most of this file summarises.
- https://www.nngroup.com/articles/designing-effective-carousels/ : auto-forwarding carousels.
- https://www.nngroup.com/articles/icon-usability/ : icons need labels.
- https://www.nngroup.com/articles/form-design-placeholders/ : placeholders are harmful.
- https://www.nngroup.com/articles/tooltip-guidelines/ : tooltips must not carry essential information.
- https://www.nngroup.com/articles/low-contrast/ : low contrast signals indifference.
- https://www.nngroup.com/articles/trustworthy-design/ : design quality and credibility.
- https://www.nngroup.com/articles/aesthetic-minimalist-design/ : the 50 ms first impression; signal versus noise.
- https://www.nngroup.com/articles/centered-logos/ : left alignment.
- https://www.nngroup.com/articles/keyboard-accessibility/ : do not remove focus indicators.
- https://www.nngroup.com/videos/hicks-law-long-menus/ : duplicate choices slow decisions.
- https://web.dev/blog/viewport-units : `dvh`.
- https://www.nngroup.com/articles/ai-roles-ux/ : guiding AI-generated designs with UX judgment.
- https://github.com/voltagent/awesome-design-md : what the measured leaders do instead (one CTA, hairlines, surface ladders).
