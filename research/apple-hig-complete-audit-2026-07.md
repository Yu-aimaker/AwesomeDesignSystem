# Apple HIG / Design Resources complete audit (2026-07-13)

> Scope: first-party Apple design guidance only. This is an evidence and gap
> audit for AwesomeDS, not a reproduction of Apple’s visual identity. Apple’s
> fonts, symbols, templates, product bezels, and platform chrome remain subject
> to Apple’s licenses and usage rules.

## Executive verdict

AwesomeDS has a useful Apple-shaped foundation — content deference, semantic
materials, Dynamic Type, 44 pt targets, safe areas, springs, Reduce Motion, and
an introductory visionOS section — but it does **not** yet represent Apple’s
current design system comprehensively.

The largest issue is freshness. `research/apple-design.md` describes a June
2026 world in which iOS 26 and SF Symbols 7 are current and SF Symbols 8 is only
briefly noted. Apple’s live Design Resources page now offers **iOS 27 and
iPadOS 27 UI kits**, a **macOS 27 UI kit**, **SF Symbols 8 beta**, and Icon
Composer alongside the still-current watchOS 26 and visionOS 26 kits. Apple’s
WWDC26 guidance also introduces a materially different canonical design
principle set and an explicit agent-driven UI prototyping workflow. Those are
absent from AwesomeDS.

The corrective move is not to add another Apple summary. AwesomeDS should turn
Apple’s guidance into four reusable layers:

1. **Platform-adaptation contracts** — input, navigation, layout, density,
   capabilities, and accessibility per context.
2. **Canonical cross-platform rules** — purpose, agency, responsibility,
   familiarity, flexibility, simplicity, craft, and delight.
3. **Production matrices and tests** — every component/pattern checked across
   pointer, keyboard, touch, voice, gaze, text scaling, contrast, motion
   preferences, window sizes, languages, and degraded capabilities.
4. **Agent-era design protocol** — generate divergent options, use realistic
   content and edge cases, tune key interactions, retain human judgment, and
   evaluate risk before shipping AI features.

## What changed in Apple’s current guidance

### 1. Apple’s canonical WWDC26 principles are broader than the old shorthand

Apple’s WWDC26 session **“Principles of great design”** defines design as
making something with intention and frames every feature as a request for a
person’s time, attention, and trust. It names eight principles:

| Principle | Operational meaning for AwesomeDS |
|---|---|
| Purpose | Start with the value to people; deciding what not to build is a design act. |
| Agency | Avoid predetermined paths; support exploration, undo, recovery, and proportionate confirmation for destructive actions. |
| Responsibility | Request the minimum data at the moment it is needed, explain why, model misuse and harm, add safeguards, and remove a feature when risk exceeds value. |
| Familiarity | Reuse learned metaphors and conventions; things that look alike must behave alike; keep recurring actions in predictable places. |
| Flexibility | Adapt to device, input, situation, ability, expertise, language, and personal preference instead of stretching one layout everywhere. |
| Simplicity | Simplicity is not visual minimalism. Remove friction and jargon, establish hierarchy, and add context when it helps informed action. |
| Craft | Typography, color adaptation, graphics, performance, responsive feedback, reliability, security, and continual iteration jointly create trust. |
| Delight | Design for an intended emotion. Delight is the result of consideration across the system, not confetti added at the end. |

This supersedes treating Apple primarily as “clarity / deference / depth.” That
older triad remains useful as visual-interface shorthand, but it is too narrow
for product decisions, privacy, AI safety, personalization, recovery, and
maintenance.

### 2. Apple now publishes a concrete AI-agent prototyping method

WWDC26 **“Create UI prototypes using agents in Xcode”** is unusually relevant
to AwesomeDS. Apple explicitly says not to delegate critical thinking to an
agent and presents the agent as a collaborator whose native code is a means of
exploration, not the source of product judgment. The demonstrated loop is:

1. State the actual features and problem rather than asking for a generic app.
2. Give mood and stylistic cues tied to the intended experience.
3. Ask for many named, divergent variations, each independently previewable.
4. Select promising parts, remix, reduce redundancy, and repeat — “go wide,
   remix, repeat.”
5. Populate the interface with plausible, audience-specific content.
6. Preview explicit states and edge cases: empty states, unscheduled content,
   long text, large collections, unbounded lists, account and creation paths.
7. Test with real people; synthetic content is only a head start.
8. Tune key moments using dedicated control panels for springs, easing,
   phases, stagger, friction, inertia, device motion, haptics, state, type,
   color, and offsets.

This is stronger and more actionable than generic “prompt better” advice. It
should become AwesomeDS’s core agent-driven design iteration contract.

### 3. The resource surface is a maintained production system

Apple’s live Design Resources page currently exposes:

- iOS 27 / iPadOS 27 and macOS 27 UI kits in Figma and Sketch;
- watchOS 26 and visionOS 26 UI kits, plus older platform kits where useful;
- technology-specific production assets and guidelines for Live Activities,
  App Clips, Apple Pay, Wallet, Siri and App Shortcuts, TipKit, Messages,
  Camera Control, AirPlay, HomeKit, Health, games, and others;
- SF Pro, SF Compact, SF Mono, New York, and script-specific SF families;
- SF Symbols 8 beta and SF Symbols 7;
- Icon Composer for a single layered Liquid Glass icon across iPhone, iPad,
  Mac, and Apple Watch;
- parallax production/preview tools and product bezels governed by marketing
  identity guidelines.

The transferable lesson is not “download Apple assets.” It is that a mature
design system publishes **platform kits, production templates, tooling,
localized typography, icon construction, technology-specific guidance, and
marketing-use constraints as one governed resource surface**.

## Domain-by-domain coverage audit

Ratings: **Strong** = reusable doctrine exists; **Partial** = a useful mention
without a complete contract; **Missing** = no operational AwesomeDS coverage.

| Domain | Current AwesomeDS evidence | Rating | Required upgrade |
|---|---|---:|---|
| Product principles | `00-philosophy/principles.md` has strong general doctrine but centers the older Apple triad. | Partial | Add the eight WWDC26 principles as decision gates with examples, anti-patterns, and review questions; link each to components/patterns. |
| Platform adaptation | `foundations/platform-literacy.md` is six short rules; `apple-design.md` sketches iOS and visionOS. | Partial | Create a platform-capability matrix: viewport/window model, density, navigation, primary input, secondary input, reach/comfort, system surfaces, multitasking, text scaling, and adaptation triggers. |
| Navigation and search | Navigation appears throughout patterns, but there is no Apple-style taxonomy or adaptation matrix. | Partial | Specify hierarchy vs peer destinations; tab/sidebar/split-view/toolbars/search placement; back/close/dismiss semantics; restoration and deep links; compact-to-regular adaptation; keyboard and focus order. |
| Inputs and controls | Web components cover forms, targets, keyboard, and focus. Apple modalities are scattered. | Partial | Define one intent across touch, pointer, keyboard, controller, remote, Digital Crown, voice, gaze/pinch, drag-and-drop, and haptics. Add hover/focus/pressed/disabled/loading/error contracts. |
| Materials / Liquid Glass | `apple-design.md`, `modern-2026.md`, and patterns correctly say glass belongs to navigation/chrome, not main content, and should not stack. | Strong but stale | Separate semantic elevation from an Apple-specific rendering recipe. Add Reduce Transparency, Increase Contrast, low-power/performance, and content-legibility fallbacks. Revalidate against iOS/macOS 27 rather than freezing WWDC25 APIs as universal doctrine. |
| Typography | Dynamic Type, semantic styles, SF family roles, and fluid web type are documented. | Strong | Add script-aware fallback and multilingual layout validation; test the largest accessibility sizes, bold text, narrow columns, tv viewing distance, and spatial comfort. Treat SF files as Apple-platform assets, not portable AwesomeDS defaults. |
| Color | Semantic/dynamic colors, light/dark/high contrast, OKLCH, gamut, and glass restraint are covered. | Strong | Add a state matrix for light/dark/increased contrast/differentiate-without-color/reduce-transparency and environmental conditions. Do not equate Apple dynamic colors with a fixed web hex palette. |
| Icons and app icons | SF Symbols and layered app icons are summarized only in `apple-design.md`; the case study merely says icon systems need rigor. | Partial | Create an icon contract: meaning, grid, baseline, optical weight, RTL mirroring, localization, text pairing, badge/state use, animation semantics, accessible label. Separate product icon construction from interface glyphs. |
| Layout and spatial design | Safe areas, concentricity, targets, and a visionOS introduction exist. | Partial | Add window/volume/full-space choice, depth budgets, ornaments, immersion transitions, gaze target spacing, head/neck comfort, stable reference frames, passthrough safety, privacy of gaze, and shared-space-first defaults. |
| Accessibility | `accessibility/a11y.md` is extensive and stronger than a simple Apple summary. | Strong | Add Apple-specific test profiles: Dynamic Type at all accessibility sizes, VoiceOver rotor/order, Voice Control labels, Switch Control, Full Keyboard Access, Assistive Access, Reduce Transparency, Increase Contrast, Differentiate Without Color, Bold Text, Mono Audio/captions, spatial comfort. |
| Motion and haptics | Springs, continuity, reduced-motion alternatives, and recipes are detailed. | Strong | Add a “key moment” tuning workflow, phased transition vocabulary, interruption/reversal tests, input-velocity continuity, haptic/audio synchronization, and device-motion opt-out. Motion quality must be verified with representative content and hardware. |
| Widgets | Only a broad case-study mention is present. | Missing | Add glanceable, relevance-first, privacy-aware, multiple-family surfaces; content hierarchy, timelines, placeholder/redaction states, deep links, controls, tinting/appearance adaptation, and “app is the destination” boundaries. |
| Live Activities / Dynamic Island | No substantive coverage. | Missing | Define start/update/end lifecycle, compact/minimal/expanded/Lock Screen variants, high-signal live values, stale/ended states, action economy, privacy, update frequency, and handoff into the app. |
| System intelligence / Siri / App Intents / visual intelligence | Only a case-study noun; no pattern. | Missing | Model app entities and actions as a cross-surface semantic API. Results must be fast, ranked, limited, identifiable in a few text lines, and deep-link directly to the selected content. Keep foreground work lightweight. |
| Generative / AI UX | AwesomeDS has substantial AI guidance, but current Apple principles are absent. | Partial | Add risk modeling, minimum-data and just-in-time permission, uncertainty/failure states, preview and confirmation for consequential actions, provenance where relevant, human edit/undo, and a feature-removal threshold when safeguards cannot bound harm. |
| Privacy and permissions | Mentioned, not a first-class design pattern. | Missing | Add a permission-request contract: wait until intent makes benefit clear, request only necessary scope, explain purpose in plain language, support denial and later enablement, and avoid coercive pre-prompts. |
| Platform technologies and production assets | No governed kit/template taxonomy. | Missing | Add AwesomeDS equivalents: component kits, motion tuning tools, icon templates, surface-specific patterns, marketing asset rules, localization resources, and versioned compatibility metadata. |

## Concrete synthesis for AwesomeDS

### A. Add canonical rules, not Apple prose

The following should become structured rules linked to implementations and
tests:

- `rule.product.purpose-before-feature`
- `rule.interaction.agency-and-forgiveness`
- `rule.product.responsible-data-request`
- `rule.ai.harm-model-and-removal-threshold`
- `rule.interaction.familiar-semantics`
- `rule.adaptation.context-capability-first`
- `rule.content.simple-not-merely-minimal`
- `rule.quality.craft-is-continuous`
- `rule.emotion.delight-is-systemic`
- `rule.agent.go-wide-remix-repeat`
- `rule.agent.real-content-edge-cases`
- `rule.motion.tune-key-moments`

Each rule needs: rationale, must/should/must-not language, positive and negative
examples, applicable platforms, automated checks where possible, manual review
questions, source links, observation date, and an explicit anti-imitation note.

### B. Establish an adaptation matrix

Do not create separate “mobile,” “desktop,” and “spatial” skins. Define a
capability model and map product intent to it:

| Axis | Values to support |
|---|---|
| Input precision | coarse touch; precise pointer; keyboard; remote/controller; crown; voice; gaze + pinch; direct spatial manipulation |
| Presentation | compact screen; resizable window; multi-column canvas; glanceable widget; ambient/live surface; volume; shared/full space |
| Attention | focused; divided; glance; hands-free; immersive |
| Navigation depth | peer destinations; drill-down; multi-pane selection; modal task; system-mediated result |
| Accessibility | text scale; bold text; contrast; transparency; motion; color differentiation; screen reader; switch/voice control; captions/audio |
| Environment | light/dark; variable background; outdoor lighting; distance; motion/vestibular sensitivity; low power/performance |

Every AwesomeDS component and pattern should declare which cells it supports
and which fallback it uses when a capability is unavailable.

### C. Add missing surface libraries

Create first-class pattern families rather than burying these in an Apple case
study:

1. **Glanceable surfaces** — widgets, complications, Live Activities, Dynamic
   Island, notifications; constrained hierarchy, privacy, freshness, lifecycle,
   and deep-link contracts.
2. **System-mediated actions** — Siri, App Intents, Shortcuts, Spotlight,
   visual intelligence; entities, actions, display representation, ranking,
   result limits, direct opening, and graceful empty results.
3. **Spatial interfaces** — window/volume/space selection, ornaments, depth,
   comfort, stable reference frames, focus feedback, immersion consent, and
   shared-space interoperability.
4. **Permission and trust moments** — contextual request, explanation, denial,
   recovery, privacy disclosure, and harm prevention.
5. **Icon systems** — interface glyph, product icon, status/badge, localized
   symbol, variable/animated state, and accessible naming.

### D. Make the agent workflow executable

The AwesomeDS agent skill should require these artifacts before accepting a
design as refined:

- a concise product-purpose and non-goals statement;
- 6–10 named divergent directions for an early concept, not one generated
  answer;
- a decision log identifying what was selected, rejected, remixed, and why;
- realistic seed content for the actual audience;
- a preview matrix covering empty, loading, error, offline, permission denied,
  destructive, very long, very large, multilingual, RTL, large type, reduced
  motion, and narrow/wide states;
- a tunable playground for the few interactions that carry product character;
- user feedback and accessibility review before declaring polish;
- an AI risk assessment for any generated recommendation or consequential
  action.

This protocol directly answers the repository’s core mission: an agent can
produce code quickly, but AwesomeDS supplies divergence, evidence, judgment,
failure coverage, and a repeatable path to craft.

## Immediate corrections to existing Apple material

1. Mark `research/apple-design.md` as a WWDC25/iOS 26 snapshot or rewrite it;
   do not label SF Symbols 7 as the current frontier while Apple distributes
   SF Symbols 8 beta and iOS/macOS 27 design resources.
2. Replace the claim that Apple HIG is mainly “Clarity / Deference / Depth”
   with the WWDC26 eight-principle framework, retaining the old triad only as
   historical visual-language shorthand.
3. Remove secondary sources from the Apple evidence chain where Apple’s own
   resource, session transcript, or documentation supports the fact. The
   current `apple-design.md` source list includes Wikipedia and 9to5Mac despite
   the repository’s first-party-evidence policy.
4. Upgrade Apple reference records. Current entries for color, typography,
   accessibility, foundations, and spatial design contain generic placeholder
   lessons (“Extract transferable doctrine”) and almost no linked artifacts.
   They should enumerate the actual extracted rules above and trace them to
   components, patterns, tests, and docs.
5. Shorten Apple’s 90-day review cadence around WWDC and beta season. Check the
   HIG, Design Resources, SF Symbols, Icon Composer, and relevant WWDC design
   sessions immediately after the June platform release, at major beta/RC
   milestones, and after the public OS release.

## Quality gates for claiming Apple-level coverage

Coverage is not complete until all of the following are evidenced:

- All eight current principles have canonical AwesomeDS rules and review
  prompts.
- Every component documents input modality, text scaling, RTL/localization,
  contrast/transparency, reduced-motion, and adaptive-layout behavior.
- Navigation patterns are tested at compact and regular widths and with touch,
  keyboard, pointer, screen reader, and restoration/deep links.
- Motion examples are interruptible, reversible where appropriate, and have a
  semantically equivalent reduced-motion treatment.
- Glanceable, live, spatial, system-mediated, and permission flows each have a
  lifecycle/state matrix, not just a screenshot.
- AI features have harm analysis, uncertainty/failure behavior, edit/undo,
  confirmation proportional to consequence, and a documented do-not-build
  boundary.
- Reference Atlas entries trace source → extracted rule → artifact → test and
  show the exact Apple platform/resource version observed.
- Apple visual assets are not redistributed or presented as AwesomeDS-owned;
  use is routed through Apple’s official downloads and licenses.

## First-party sources reviewed

- Apple, Human Interface Guidelines —
  https://developer.apple.com/design/human-interface-guidelines/
- Apple, Design Resources (live page observed 2026-07-13; iOS/iPadOS 27,
  macOS 27, SF Symbols 8 beta, platform kits, fonts, tools, and technology
  templates) — https://developer.apple.com/design/resources/
- Apple, “Principles of great design,” WWDC26 session 250 (full first-party
  transcript and chapter summaries reviewed) —
  https://developer.apple.com/videos/play/wwdc2026/250/
- Apple, “Create UI prototypes using agents in Xcode,” WWDC26 session 227
  (full first-party transcript reviewed) —
  https://developer.apple.com/videos/play/wwdc2026/227/
- Apple, “Best practices for integrating visual intelligence in your app,”
  WWDC26 session 297 —
  https://developer.apple.com/videos/play/wwdc2026/297/
- Apple HIG, Accessibility —
  https://developer.apple.com/design/human-interface-guidelines/accessibility
- Apple HIG, Color —
  https://developer.apple.com/design/human-interface-guidelines/color
- Apple HIG, Layout —
  https://developer.apple.com/design/human-interface-guidelines/layout
- Apple HIG, Materials —
  https://developer.apple.com/design/human-interface-guidelines/materials
- Apple HIG, Motion —
  https://developer.apple.com/design/human-interface-guidelines/motion
- Apple HIG, Navigation and search —
  https://developer.apple.com/design/human-interface-guidelines/navigation-and-search
- Apple HIG, Typography —
  https://developer.apple.com/design/human-interface-guidelines/typography
- Apple HIG, SF Symbols —
  https://developer.apple.com/design/human-interface-guidelines/sf-symbols
- Apple HIG, Spatial layout —
  https://developer.apple.com/design/human-interface-guidelines/spatial-layout
- Apple HIG, Widgets —
  https://developer.apple.com/design/human-interface-guidelines/widgets
- Apple HIG, Live Activities —
  https://developer.apple.com/design/human-interface-guidelines/live-activities
- Apple, SF Symbols — https://developer.apple.com/sf-symbols/
- Apple, Icon Composer — https://developer.apple.com/icon-composer/

## Bottom line

AwesomeDS currently captures Apple’s **surface vocabulary** better than its
full **product discipline**. The highest-leverage upgrade is to absorb Apple’s
2026 doctrine of purpose, agency, responsibility, flexibility, simplicity,
craft, and systemic delight, then operationalize it through an adaptation
matrix, missing surface libraries, and an agent workflow built around
divergence, real content, edge cases, tuning, safety, and human judgment.
