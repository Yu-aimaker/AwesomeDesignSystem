# Principles

AwesomeDS is a set of defaults. Each default exists because a documented finding
about human perception or behaviour says it works. This file lists the seven
principles, then maps each law or heuristic we lean on to the concrete rule it
produced in `DESIGN.md`.

## The seven principles

| # | Principle | Plain statement | Where it shows up |
|---|---|---|---|
| 1 | Content first | Write the words, then draw the box around them. | DESIGN.md section 9, 12 |
| 2 | Hierarchy by type and space | Importance is shown with size, weight and distance. Color is last. | Typography scale, spacing scale |
| 3 | One accent | A single hue carries "interactive" meaning. Everything else is gray. | Color roles |
| 4 | Honesty of materials | A surface looks like what it does. No fake glass, no fake depth. | Elevation, anti-patterns |
| 5 | Feedback | Every action gets a visible response within 100 ms. | Motion, component states |
| 6 | Consistency | Same thing, same look, same place, every time. | Radius family, icon family, layout |
| 7 | No generated tells | A choice models repeat is not a design decision. Replace it. | `anti-patterns.md`, content and tone |

### 1. Content first

Nielsen Norman Group recommends that content precede layout so that templates fit
real text instead of forcing text into placeholders (NN/g, "Which Comes First?
Layout or Content?"). AwesomeDS therefore asks the agent to write copy before
choosing a layout, and to cut copy that does not change what the user will do.

### 2. Hierarchy by type and space

Users scan rather than read; NN/g eyetracking has shown the F-shaped pattern since
2006. Scanning works when size, weight and whitespace mark the structure. Color is
weak for this job because it is not perceived by everyone (NN/g, "5 Visual
Treatments that Improve Accessibility"). Hence the scale 12 to 56, weights 400/500/600,
and section spacing 64 to 96 px.

### 3. One accent

The Gestalt similarity principle says elements sharing a trait are read as related.
If blue means "link" and also "decorative badge", the signal is lost. Vercel's
Geist system uses blue as "the sole interactive accent" for links and focus rings.
AwesomeDS copies that: accent `#2f5bea` only for links, focus, selection, one highlight.

### 4. Honesty of materials

NN/g documented that flat design with weak signifiers produces click uncertainty,
and that skeuomorphic decoration should copy only the useful parts of the real
object. AwesomeDS keeps real signifiers (borders, hover, cursor) and drops imitation
(glass, glow, mesh) that adds no information.

### 5. Feedback

Nielsen's first heuristic is visibility of system status. His response-time limits
are 0.1 s for "instant", 1 s for uninterrupted thought, 10 s for attention. AwesomeDS
maps these to `duration-instant` 100 ms for hover and every interactive component
shipping hover, focus, active, disabled and loading states.

### 6. Consistency

Heuristic 4 (consistency and standards) and Jakob's Law both say users transfer
expectations from other products. AwesomeDS enforces one radius family, one icon
family, left-aligned logo and label-above forms because these are the conventions
users already know.

### 7. No generated tells

Language models share a high-probability center: purple gradients, three equal cards,
Inter on a dark mesh, and Japanese that says nothing (`ことができます`, `シームレス`,
`革新的`). Anthropic's `web-artifacts-builder` names the same visual cluster (centered
layouts, purple gradients, uniform radii, Inter). taste-skill's pre-flight and
ui-skills `baseline-ui` ban the same items. AwesomeDS already lists the replacements
in `anti-patterns.md` and `content-and-tone.md`. Principle 7 says to apply that list
before shipping, including in copy. The catalog of sources and before/after lines is
`Knowledge/skills/anti-ai-slop.md`.

## Laws and how they became rules

| Law or heuristic | Finding | AwesomeDS rule it produced |
|---|---|---|
| Fitts's Law | Time to hit a target rises with distance and falls with size. | Buttons 40 px default, 44 px touch minimum, 24 px desktop minimum (WCAG 2.5.8). Table rows 44 px. |
| Hick's Law | Decision time grows with the number of choices. | One primary button per view. Max two nav levels in dropdowns. Progressive disclosure for advanced options. |
| Miller's Law | Short-term memory is limited; chunking helps. The number 7 is not the point. | Spacing scale groups related items (16 to 24 px) and separates groups (32 to 48 px). Forms chunk fields with white space. |
| Jakob's Law | Users expect your site to work like the sites they already use. | shadcn/Radix behaviours, logo top-left, label above input, Escape closes dialogs. |
| Doherty threshold / Nielsen 0.1 s | Under about 100 to 400 ms feels immediate. | 100 to 200 ms for UI transitions, never 500 ms except page level. Skeletons for loads of 400 ms to 3 s. |
| Gestalt: proximity | Things close together read as one group. | Inside-component spacing 8 to 16, between related 16 to 24, between groups 32+. |
| Gestalt: similarity | Shared traits read as shared function. | One accent hue, one radius family, one icon stroke width. |
| Gestalt: common region | A border or background groups its contents. | Cards use `1px solid hairline` before any shadow. Tab panel shares a region with its tab. |
| Norman: affordance and signifier | Perceptible cues must show what an action does. | Buttons have borders or fills, links are accent colored, hover states exist on every control. |
| Norman: feedback | Every action needs a timely result. | Loading states, toasts for background results, `:active` scale 0.98. |
| Norman: mapping | Control placement should match the result. | Error text directly below the field it concerns. Toast appears near the corner the action came from. |
| Nielsen H1 visibility of status | Keep users informed. | Skeleton, empty, error, success states required for every data view. |
| Nielsen H3 user control | Provide an emergency exit and undo. | Dialogs close on Escape and backdrop click; destructive toasts offer undo. |
| Nielsen H5 error prevention | Prevent before you message. | Inline validation, disabled states with reason, confirmation for destructive actions. |
| Nielsen H6 recognition over recall | Make options visible. | Icons always carry visible labels in navigation. No placeholder-as-label. |
| Nielsen H8 aesthetic and minimalist | Every extra element competes with the relevant ones. | No gradients, glow, or decorative blobs by default. Max one eyebrow per three sections. Principle 7: drop the generated default even when it looks finished. |
| Nielsen H9 recover from errors | Plain-language messages with a fix. | Error copy states what happened and what to do, in `danger` with an icon. |
| Progressive disclosure | Show primary options first; defer the rest. | Advanced settings behind a disclosure, sheets for secondary flows, command menu for power users. |

## Alternatives considered

| Alternative | Why rejected |
|---|---|
| Brand-led principles ("bold", "playful") | Adjectives do not produce testable rules. AwesomeDS is a base; brand adjectives belong in `ds-creator`. |
| Material 3 principles as-is | Material's tonal elevation and 48 dp targets are optimised for Android; the web default here is 44/24 px. Material remains a cited reference. |
| Apple HIG as-is | Platform-specific (SF Pro, vibrancy materials). We keep its 44 pt target and dark-mode elevation logic. |
| "Aesthetic usability effect" as a licence for decoration | NN/g warns it masks usability problems in testing. Decoration is never a substitute for hierarchy. |

## Sources

- https://www.nngroup.com/articles/ten-usability-heuristics/ : the 10 heuristics referenced above.
- https://www.nngroup.com/articles/layout-vs-content/ : NN/g on content-first layout.
- https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ : scanning behaviour that justifies type-and-space hierarchy.
- https://www.nngroup.com/articles/principles-visual-design/ : scale, hierarchy, contrast, Gestalt in UX.
- https://www.nngroup.com/articles/gestalt-proximity/ : proximity principle.
- https://www.nngroup.com/articles/gestalt-similarity/ : similarity principle.
- https://www.nngroup.com/articles/common-region/ : common region principle.
- https://www.nngroup.com/articles/fitts-law/ : Fitts's Law in UX.
- https://www.nngroup.com/videos/hicks-law-long-menus/ : Hick's Law applied to menus.
- https://www.nngroup.com/articles/chunking/ : chunking and Miller's Law, and why 7 is not a rule.
- https://www.nngroup.com/videos/jakobs-law-internet-ux/ : Jakob's Law.
- https://www.nngroup.com/articles/response-times-3-important-limits/ : 0.1 / 1 / 10 second limits.
- https://lawsofux.com/fittss-law/ : Laws of UX summary of Fitts.
- https://lawsofux.com/law-of-common-region/ : Laws of UX summary of common region.
- https://uxmag.com/articles/understanding-don-normans-principles-of-interaction : Norman's affordance, signifier, mapping, feedback.
- https://www.nngroup.com/articles/clickable-elements/ : signifiers for clickable elements.
- https://www.nngroup.com/articles/flat-design/ : click uncertainty in flat design.
- https://www.nngroup.com/videos/skeuomorphic-design-tog/ : copy only the useful parts of real objects.
- https://www.nngroup.com/articles/visibility-system-status/ : heuristic 1.
- https://www.nngroup.com/articles/user-control-and-freedom/ : heuristic 3.
- https://www.nngroup.com/articles/aesthetic-minimalist-design/ : heuristic 8.
- https://www.nngroup.com/articles/progressive-disclosure/ : progressive disclosure.
- https://www.nngroup.com/videos/aesthetic-usability-effect/ : why attractiveness masks problems.
- https://www.nngroup.com/articles/visual-treatments-accessibility/ : do not rely on color alone.
- https://vercel.com/geist/colors : blue as the sole interactive accent.
- https://github.com/Leonxlnx/taste-skill : anti-default list and pre-flight (stars 94,574 on 2026-10-11).
- https://github.com/ibelick/ui-skills : `baseline-ui` discrete MUST / NEVER rules (stars 9,606 on 2026-10-11).
- https://raw.githubusercontent.com/anthropics/skills/main/skills/web-artifacts-builder/SKILL.md : names centered layouts, purple gradients, uniform radii, and Inter as AI slop (fetched 2026-10-11).
- https://github.com/53able/no-ai-slop-ja : Japanese patterns such as `ことができます` and unsupported `注目されています` (README fetched 2026-10-11).
