---
title: "Reference Landscape — First-party refresh (2026-07)"
description: "A primary-source review of Duolingo Design, Vercel Design, DESIGN.md corpora, and the modern design-engineering sources ADS should continuously track."
audience: ai-agents
status: research
date: 2026-07-13
---

# Reference Landscape — First-party refresh (2026-07)

> Scope: primary sources inspected on 2026-07-13. GitHub activity figures are a point-in-time maintenance signal, not a quality ranking. This note complements, rather than replaces, `reference-repos.md` and `design-systems-anatomy.md`.

## Executive read

The four requested references serve different jobs:

| Source | What it actually is | Best contribution to ADS | Important limit |
|---|---|---|---|
| Duolingo Design | A public brand bible: identity, writing, illustration, marketing assets, and resources | Treat personality as a coherent visual/verbal production system, not a palette | It is a materially stale brand snapshot, not a current product/component system |
| Vercel Design | A recruiting/editorial front door plus a living Web Interface Guidelines checklist and the Geist system | Encode hundreds of product-quality interaction details as machine-checkable review rules | The showcase itself is not a comprehensive design-system manual |
| VoltAgent `awesome-design-md` | 73 brand-style snapshots in an extended Google Stitch `DESIGN.md` schema | Agent-readable art-direction schema and visual previews | Static imitation corpus; weak on provenance, accessibility, interaction, and enforcement |
| `awesome-design-md-jp` | 381-site Japanese UI corpus with CJK typography extensions and previews | Japanese font stacks, line-height, tracking, 禁則, OpenType, mixed-script rules | Very large snapshot corpus; the same drift/provenance risks remain |

The strategic opportunity is not to become a larger bookmark list. ADS can become the **maintained translation layer** between first-party doctrine, executable tokens/components, agent instructions, and automated verification.

## 1. Duolingo Design

### What the site contains

Duolingo presents a connected visual and verbal brand language. The accessible canonical content found in the live site is the hub plus 15 pages:

- Identity: [logos](https://design.duolingo.com/identity/logos), [color](https://design.duolingo.com/identity/color), [typography](https://design.duolingo.com/identity/typography), [imagery](https://design.duolingo.com/identity/imagery), [brand family](https://design.duolingo.com/identity/brand-family).
- Writing: [brand narrative](https://design.duolingo.com/writing/brand-narrative), [voice](https://design.duolingo.com/writing/voice), [tone](https://design.duolingo.com/writing/tone), [Duo](https://design.duolingo.com/writing/duo), [style](https://design.duolingo.com/writing/style), [glossary](https://design.duolingo.com/writing/glossary).
- Illustration: [shape language](https://design.duolingo.com/illustration/shape-language), [Duo construction](https://design.duolingo.com/illustration/duo), [characters](https://design.duolingo.com/illustration/characters).
- [Marketing assets](https://design.duolingo.com/marketing/assets) and [resources](https://design.duolingo.com/resources).

The identity pages provide production-ready constraints: logo color/clear-space/minimum-size/rotation and lockups; named color values across digital and print; custom Feather Bold and DIN Next Rounded hierarchy and substitutes; imagery direction; and sub-brand construction. The writing system is exceptionally operational: narrative, four voice qualities, context-sensitive tone, a strict Duo character contract, channel/editorial rules, and canonical/prohibited terminology. Illustration is also treated as a scalable grammar: rounded geometric primitives, complexity budgets, flat perspective, palette/shadow rules, repeatable character anatomy, emotional variants, poses, and explicit misuse examples.

### What ADS should extract

- Add **Brand character** as a first-class layer: personality traits, emotional range, signature shapes, and explicit “in character / out of character” examples.
- Treat **illustration systems** as production systems: primitive geometry, complexity budgets, silhouettes, anatomy, poses, cropping, perspective, palette roles, asset families, and misuse examples.
- Add **content design** beside components: narrative, voice qualities, contextual tone matrix, character-specific behavior, channel style, canonical terms, localization, and AI-generated-copy guardrails.
- Reuse Duolingo's strongest documentation sequence: principle → concrete rule/token → good/bad examples → downloadable artifact → related guidance.
- Fill the public bible's missing domains: product UI/components, interaction/motion, sound, accessibility specifications, AI UX, governance, and engineering implementation.

### Gap/opportunity

ADS already has foundations, motion, accessibility, and anti-slop guidance, but these are mostly separate chapters. Duolingo’s strongest lesson is operational coherence: one declared character propagates into words, shapes, imagery, assets, and hard production constraints. ADS should add a cross-medium “brand coherence contract,” then extend it into the interaction/accessibility domains Duolingo's public site does not cover.

### Maintenance signal and warning

The delivery object was recently written (`Last-Modified: Thu, 09 Apr 2026 18:44:51 GMT` via S3/CloudFront), but that is **not evidence of current content**. The pages contain clear historical fossils: “Duolingo Plus,” iOS 11/Emoji 5.0 support assumptions, 2019 examples, 300M learner and 35+ language claims, old Duolingo English Test acceptance/funding figures, and legacy product terminology. Classify this source as an excellent preserved brand-system case study with revalidation required for all product facts and vocabulary. The site exposes no real changelog/version/owner/date, component code, motion system, accessibility spec, or machine-readable token package. `sitemap.xml` and `robots.txt` misleadingly return the generic SPA shell rather than useful indexes.

Primary source: https://design.duolingo.com/

## 2. Vercel Design and Geist

### What the current site contains

The `/design` home is a highly crafted team/showcase page. Its useful exits are:

- **Web Interface Guidelines**: a living, explicitly non-exhaustive checklist spanning interactions, animations, layout, content, forms, performance, design, Vercel-specific copywriting, and agent integration.
- **Geist Design System**: Vercel’s system entry point.
- **Brand resources** and a design-team directory, connecting authored work to practitioners.

The guidelines are unusually implementation-specific. Examples include keyboard-complete flows, visible focus and focus management, minimum hit targets, hydration-safe inputs, URL-addressable UI state, optimistic updates with rollback/undo, semantic links, async announcements, reduced motion, CSS/WAAPI preference over main-thread animation, transform/opacity preference, interruptible input-driven motion, intrinsic layout, exact skeleton geometry, locale-aware formatting, native semantics before ARIA, resilient content, stable loading states, form behavior, performance discipline, and agent-facing review instructions.

### What ADS should extract

- Convert the living checklist into **review rules with severity and evidence**: automated, browser-inspection, keyboard/manual, assistive-technology/manual.
- Make “all states designed” concrete: empty, sparse, dense, loading, error, offline, permission-denied, partial-success, stale, and recovery states.
- Add **browser-native correctness** to design review: URL state, Back/Forward, scroll restoration, zoom, safe areas, overscroll, autofill, paste, hydration, and locale behavior.
- Ship an **agent review command / rubric** that can cite the violated rule and suggest a minimal repair.
- Keep craft details (optical alignment, tooltip timing, ellipsis semantics, typographic punctuation) beside larger a11y and performance constraints; product quality is cumulative.

### Maintenance signal

On 2026-07-13 the page labels itself a “living, non-exhaustive list,” includes React/Next.js-specific guidance and an “Integrate with agents” section, and is served by the current Vercel application stack. This is a high-value watch source because its content is operational and actively aligned with AI-assisted development.

Primary sources:

- https://vercel.com/design
- https://vercel.com/design/guidelines
- https://vercel.com/geist/introduction
- https://vercel.com/geist/brands

## 3. VoltAgent/awesome-design-md

### Current contents

The README reports **73 DESIGN.md entries** grouped across AI/LLM, developer tools, backend/devops, productivity/SaaS, creative tools, finance, commerce, consumer/media, automotive, and retro web. Each design analysis follows an extended Stitch-oriented structure:

1. visual theme and atmosphere;
2. color palette and roles;
3. typography rules;
4. component styling and states;
5. layout principles;
6. depth/elevation;
7. do/don’t guardrails;
8. responsive behavior;
9. agent prompt guide.

Entries pair `DESIGN.md` with light/dark HTML previews. The project’s explicit use case is copying a style document into a project so an AI coding agent can generate a visually consistent interface.

### Maintenance signal

GitHub’s repository API reported: created 2026-03-31, last push 2026-06-16, metadata updated 2026-07-12, not archived, MIT licensed, 73-entry README badge. This is current and extremely visible, but “last push” is the more meaningful content freshness signal than stars or repository metadata updates.

### Gaps ADS can own

- Require provenance per claim/token: source URL, observed date, viewport/theme, extraction method, and confidence.
- Separate **inspiration** from **reproduction**; avoid implying brand authorization or pixel-faithful identity cloning.
- Extend the schema with accessibility contracts, interaction/motion semantics, content/voice, localization, performance budgets, data states, and validation.
- Add drift detection and review status rather than presenting snapshots as timeless truth.
- Generate previews from structured data and test them; do not let handwritten prose and previews diverge.

Primary sources:

- https://github.com/VoltAgent/awesome-design-md
- https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main/README.md
- https://stitch.withgoogle.com/docs/design-md/overview/
- https://stitch.withgoogle.com/docs/design-md/specification/

## 4. kzhrknt/awesome-design-md-jp

### Current contents

The README reports a **381-site gallery** covering Japanese services and brands. Its central contribution is not merely translation: it explicitly models Japanese typography that Western corpora omit—Japanese/Latin fallback chains, `1.5–2.0` line-height, Japanese body tracking, 禁則処理, `palt`/`kern`, and mixed Japanese/Latin composition. Entries include previews and the repository publishes a GitHub Pages gallery.

### Maintenance signal

GitHub’s repository API reported: created 2026-04-06, last push 2026-07-04, metadata updated 2026-07-12, not archived, MIT licensed. The repo therefore had more recent content activity than the upstream-style corpus at inspection time.

### Gaps ADS can own

- Generalize typography by locale: Japanese, Simplified/Traditional Chinese, Korean, Arabic/Hebrew/RTL, Thai, Indic scripts, and mixed-script numerals.
- Add ruby/furigana, vertical writing, line-breaking, variable-font and font-loading behavior, and OS/browser fallback tests.
- Distinguish directly observed tokens from inferred art direction and require provenance/date/confidence.
- Validate examples with language-tagged fixtures, zoom, reflow, font fallback, and real content lengths.

Primary sources:

- https://github.com/kzhrknt/awesome-design-md-jp
- https://raw.githubusercontent.com/kzhrknt/awesome-design-md-jp/main/README.md
- https://kzhrknt.github.io/awesome-design-md-jp/gallery.html

## 5. High-value primary sources ADS should continuously track

### Standards and platform baselines

| Source | Why it belongs in the watchlist |
|---|---|
| W3C WCAG 2.2 | Accessibility conformance baseline, not a design trend: https://www.w3.org/TR/WCAG22/ |
| WAI-ARIA APG | Canonical keyboard/role/state patterns for complex widgets: https://www.w3.org/WAI/ARIA/apg/ |
| W3C Design Tokens Community Group | Interoperable token format work; GitHub showed a 2026-06-22 push: https://www.designtokens.org/ and https://github.com/design-tokens/community-group |
| Open UI | Cross-vendor research and proposals for native controls: https://open-ui.org/ |
| Apple HIG | Current Apple interaction, typography, materials, iconography, and platform conventions: https://developer.apple.com/design/human-interface-guidelines/ |
| Android / Material 3 | Platform patterns, adaptive layouts, tokens, and expressive motion: https://m3.material.io/ |
| Microsoft Fluent 2 | Cross-platform enterprise system and accessibility guidance: https://fluent2.microsoft.design/ |

### Mature system implementations

| Source | What to mine |
|---|---|
| GitHub Primer | Token architecture, accessible React implementation, data-dense developer UI; `primer/react` pushed 2026-07-10: https://primer.style/ and https://github.com/primer/react |
| Adobe Spectrum 2 / React Spectrum | Internationalized accessible behavior, adaptive components, token/data tooling; repo pushed 2026-07-10: https://spectrum.adobe.com/ and https://github.com/adobe/react-spectrum |
| IBM Carbon | Enterprise density, data visualization, contribution/release discipline: https://carbondesignsystem.com/ |
| Atlassian Design System | Semantic tokens, migration tooling, product patterns, content design: https://atlassian.design/ |
| Shopify Polaris | Commerce/admin workflows, content guidance, framework-independent components: https://polaris.shopify.com/ |
| GOV.UK Design System / USWDS | Evidence-led public-service patterns, plain language, progressive enhancement: https://design-system.service.gov.uk/ and https://designsystem.digital.gov/ |

### Design engineering and verification

| Source | What to mine |
|---|---|
| Storybook | Component documentation, interaction/a11y/visual testing, portable stories; repo pushed 2026-07-10: https://storybook.js.org/ and https://github.com/storybookjs/storybook |
| Radix Primitives | Unstyled accessible behavior primitives; repo pushed 2026-07-10: https://www.radix-ui.com/primitives and https://github.com/radix-ui/primitives |
| React Aria | Internationalized, accessible behavior hooks/components: https://react-spectrum.adobe.com/react-aria/ |
| Motion | Production animation APIs and reduced-motion patterns; repo pushed 2026-07-01: https://motion.dev/ and https://github.com/motiondivision/motion |
| Chrome UI / web.dev patterns | Browser capability and performance guidance, especially View Transitions and Core Web Vitals: https://web.dev/ |

### AI-native design/build sources

| Source | Why it matters |
|---|---|
| Google Stitch DESIGN.md | Emerging agent-readable design brief/specification named by both requested corpora: https://stitch.withgoogle.com/docs/design-md/overview/ |
| Vercel Web Interface Guidelines | Explicit agent integration plus executable frontend quality details: https://vercel.com/design/guidelines |
| shadcn/ui registries | Owned-code component distribution and machine-consumable registries: https://ui.shadcn.com/docs/registry |
| Vercel AI Elements | UI primitives/patterns for AI product experiences: https://ai-sdk.dev/elements/overview |

## 6. Recommended ADS differentiation

1. **A source registry, not bookmarks.** Store owner, canonical URL, source type, topic tags, observed date, last verified date, drift risk, license/usage note, and responsible reviewer.
2. **An evidence ladder.** Label content as standard, first-party guidance, first-party implementation, observed production behavior, inferred pattern, or trend hypothesis.
3. **Executable artifacts.** Every doctrine should map to at least one of: token schema, component contract, story/fixture, lint rule, browser test, visual regression, or agent review instruction.
4. **A cross-medium brand contract.** Connect personality to type, shape, color, illustration, iconography, motion, sound, copy, and accessibility—the Duolingo lesson.
5. **A cumulative craft gate.** Capture the small browser/interaction/content details in Vercel’s living checklist, each with severity and validation method.
6. **Global-first typography.** Build on the JP corpus, but test multiple scripts, writing modes, fallback paths, locale formats, and content expansion.
7. **Freshness automation.** Scheduled link checks, GitHub release/commit monitoring, sitemap diffs, standard-version alerts, and human review queues. Never auto-promote social-media trends to doctrine.
8. **Trend intake with proof.** X and other social sources are discovery signals; promotion requires a primary source, a working implementation, repeat evidence across products, accessibility/performance review, and an expiry/revisit date.
9. **Originality safeguards.** Use brand analyses to learn transferable rules, not to clone protected identity. Require “inspiration transformed” notes and explicit anti-imitation constraints.
10. **Versioned agent outputs.** Generate compact `DESIGN.md`, richer human docs, and verification checklists from one structured source so they cannot silently diverge.

## 7. Immediate backlog suggested by this research

- Define a versioned ADS source-registry schema and seed it with the sources above.
- Extend the current design document model with provenance, content, illustration, sound, locale, state, performance, and validation sections.
- Turn Vercel’s guideline categories into a severity-tagged quality rubric.
- Add a Duolingo-inspired cross-medium brand-coherence template.
- Add multilingual test fixtures and locale-specific typography recipes beyond Japanese.
- Create a scheduled freshness report that opens review work instead of silently rewriting guidance.
- Keep X/social research in an “emerging signals” queue until corroborated by primary evidence.
