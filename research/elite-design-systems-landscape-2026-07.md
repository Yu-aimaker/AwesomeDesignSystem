---
title: "Elite design systems landscape — operational doctrine, not a gallery"
description: "First-party audit of mature public design systems, brand bibles, design blogs, asset portals, and AI/motion/content sources; with explicit extraction and anti-copy guidance for AwesomeDS."
date: 2026-07-13
status: research
evidence_policy: first-party-only
---

# Elite design systems landscape — July 2026

## Executive conclusion

Duolingo Design is unusually good at making one personality propagate through words, shapes, characters, imagery, and downloadable assets. It is not, however, a complete product design system: it exposes little component behavior, accessibility, platform adaptation, governance, or code. No single public system covers the whole job AwesomeDS has chosen.

The correct target is therefore a **federated operating bible**:

1. Duolingo-class cross-medium brand coherence;
2. Apple/Material/Fluent-class platform and interaction literacy;
3. Spectrum/Primer/Gestalt-class accessible component behavior;
4. Carbon/Polaris/Atlassian-class enterprise content and workflow rigor;
5. GOV.UK/USWDS-class evidence, resilience, and public accountability;
6. Salesforce/Intuit/Uber-class domain patterns and system governance;
7. Spotify/Airbnb/Mailchimp/Slack/Wise-class brand expression and editorial craft;
8. executable tokens, components, motion, tests, review rules, and agent contracts tying the doctrine to shipped UI.

The existing repository knows many of these names, but coverage is uneven. Carbon, Spectrum, Fluent, Material, Apple, and Polaris recur across current material; GOV.UK, Mailchimp, Pinterest, Uber, and Salesforce are mostly shallow references; Zendesk Garden has no dedicated record; public design culture/blog sources are often summarized as aesthetic traits rather than traced to a specific first-party article or artifact. The next improvement is **depth and traceability, not more logos**.

## Method and evidence grades

Inspected 2026-07-13. All 22 primary system entry points in this report returned HTTP 200 after redirects. GitHub activity is a point-in-time maintenance signal, not proof that every documentation page is current.

| Grade | Evidence | How AwesomeDS may use it |
|---|---|---|
| A | Standard, official platform guidance, or maintained source code | Normative baseline, with version/date |
| B | First-party system documentation, changelog, content guide, or asset portal | Transferable doctrine after scope review |
| C | First-party product/design blog or case study | Contextual pattern; never universal law by itself |
| D | Observed product behavior or social signal | Research queue only until corroborated |

Every adopted rule should retain: source URL, evidence grade, observation date, scope, owner, implementation mapping, validation method, and recheck date. Brand assets and distinctive visual grammar are **reference material**, not a license to reproduce identity.

## Coverage audit of current AwesomeDS

Search across `content/references`, `design-system`, and `research` found broad name-level coverage but not equivalent doctrine-level coverage.

| Coverage state | Systems | Finding |
|---|---|---|
| Strong seed | Apple, Material, Carbon, Spectrum, Fluent, Atlassian, Polaris, Primer | Foundations and general lessons exist; still need page-level provenance and executable mappings |
| Present but shallow | GOV.UK, USWDS, Salesforce Lightning, Intuit, Uber Base, Pinterest Gestalt, Spotify, Airbnb, Slack, Wise, Mailchimp | Usually a catalog record or short synthesis; domain patterns, governance, contribution and failure modes remain under-extracted |
| Material gap | Zendesk Garden | No dedicated reference record; Garden appears only incidentally |
| Cross-cutting gap | Content operations, localization, data visualization, service design, AI trust, sound/haptics, design-system governance | Mentioned across chapters but not modeled as versioned contracts with owners and tests |
| Evidence gap | Design blogs and brand sites | Claims are often organization-level summaries instead of citations to the exact article/page that supports them |

The current `research/elite-design-orgs-2026-07.md` is useful orientation, but several statements (for example “dark UI mastery,” “micro-animation builds massive trust,” or “component minimalism”) are editorial generalizations. They should remain inspiration until linked to a first-party source and bounded by product context.

## Tier 1 — operational systems to mine deeply

### IBM Carbon

**Primary source bundle**

- System: https://carbondesignsystem.com/
- Guidelines and patterns: https://carbondesignsystem.com/guidelines/overview/
- Data visualization: https://carbondesignsystem.com/data-visualization/getting-started/
- Content: https://carbondesignsystem.com/guidelines/content/overview/
- AI guidance: https://carbondesignsystem.com/guidelines/carbon-for-ai/
- Implementation: https://github.com/carbon-design-system/carbon

**Maintenance signal.** The main repository was unarchived and pushed 2026-07-12 (Apache-2.0) at inspection. The public site exposes versioned packages, migration material, contribution paths, and coded components.

**Absorb.** Productive versus expressive motion; 2x Grid as a compositional system rather than “use 8px”; data-vis semantics, chart selection, legends, color and accessibility; enterprise content guidelines; contribution tiers; explicit AI-presence patterns and transparency. Carbon demonstrates that data visualization and AI behavior belong inside a design system, not in unrelated appendices.

**Do not copy.** Its 16-column grid, IBM Plex voice, dense enterprise defaults, or AI visual signifiers as universal defaults. Preserve the decision logic and accessibility contracts, then expose density and brand recipes as configurable profiles.

### Adobe Spectrum 2 and React Spectrum

**Primary source bundle**

- System and principles: https://spectrum.adobe.com/
- Accessibility: https://spectrum.adobe.com/page/accessibility/
- Color: https://spectrum.adobe.com/page/color/
- React Aria: https://react-spectrum.adobe.com/react-aria/
- Implementation: https://github.com/adobe/react-spectrum

**Maintenance signal.** `adobe/react-spectrum` was unarchived and pushed 2026-07-10 (Apache-2.0). The implementation combines behavior, internationalization, testing, and component APIs rather than treating accessibility as visual annotation.

**Absorb.** Separate behavior primitives from branded presentation; locale-aware interactions (direction, calendars, number/date conventions); forced-colors/high-contrast behavior; focus and modality contracts; adaptive scale and platform input; API consistency and composability. React Aria is a stronger behavioral reference than many visually polished libraries.

**Do not copy.** Adobe’s visual language, component API, or adaptive heuristics wholesale. AwesomeDS should specify observable behavior first and allow React implementation choices to evolve without rewriting doctrine.

### Microsoft Fluent 2 and Inclusive Design

**Primary source bundle**

- System: https://fluent2.microsoft.design/
- Motion: https://fluent2.microsoft.design/motion
- Accessibility: https://fluent2.microsoft.design/accessibility
- Inclusive Design: https://www.microsoft.com/design/inclusive/
- Implementation: https://github.com/microsoft/fluentui

**Maintenance signal.** `microsoft/fluentui` was unarchived and pushed 2026-07-10. Fluent publishes web and platform implementations and distinguishes system foundations from control-level mappings.

**Absorb.** Global → alias → control token dependencies; motion as duration/easing/transition vocabulary; input-modality and platform adaptation; inclusive-design methods that use exclusion to reveal broader opportunities; density and cross-platform divergence as explicit system decisions.

**Do not copy.** Acrylic, Windows depth, Segoe, or a single cross-platform visual skin. “Consistent” must mean consistent intent and behavior, not identical pixels across platforms.

### Shopify Polaris

**Primary source bundle**

- System: https://polaris.shopify.com/
- Content: https://polaris.shopify.com/content
- Patterns: https://polaris.shopify.com/patterns
- Current web components: https://shopify.dev/docs/api/app-home/polaris-web-components

**Maintenance signal.** The current content site announces Polaris Web Components and routes implementers toward Shopify’s developer documentation. This is also a migration warning: old Polaris React examples may be historical even when still indexed.

**Absorb.** Audience-specific language, actionable errors, resource naming, commerce/admin patterns, internationalization, selection/bulk actions, save/dirty-state behavior, and guidance that begins with merchant outcomes rather than component appearance.

**Do not copy.** Merchant terminology, Shopify admin information architecture, or deprecated React APIs. Model the workflow pattern and state machine independently of its host product.

### Atlassian Design System

**Primary source bundle**

- System: https://atlassian.design/
- Content design: https://atlassian.design/content/
- Tokens: https://atlassian.design/components/tokens/
- Accessibility: https://atlassian.design/foundations/accessibility/
- Drag-and-drop implementation: https://github.com/atlassian/pragmatic-drag-and-drop

**Maintenance signal.** The public system contains release/migration guidance and token tooling; Atlassian’s public drag-and-drop implementation was pushed 2026-07-10. Public availability differs across packages, so source and license must be checked per artifact.

**Absorb.** Semantic color/elevation roles, token migration tooling, complex collaboration patterns, content structure and inclusive language, and deeply specified drag-and-drop behavior (keyboard, screen reader, drop indicators, auto-scroll). Add migration status to every AwesomeDS component contract.

**Do not copy.** Jira terminology, Atlassian blue, or package-specific APIs. Avoid importing product complexity into simpler contexts.

### GitHub Primer

**Primary source bundle**

- System: https://primer.style/
- Foundations: https://primer.style/foundations/
- Accessibility: https://primer.style/accessibility/
- React implementation: https://github.com/primer/react
- Primitives/tokens: https://github.com/primer/primitives

**Maintenance signal.** `primer/react` was unarchived and pushed 2026-07-10 (MIT). Documentation, primitives, React code, and accessibility guidance are publicly inspectable.

**Absorb.** Base/functional/component token tiers; functional color names that survive theme changes; compact data-dense interfaces; composable primitives; accessibility annotation near components; support for multiple color modes and contrast needs.

**Do not copy.** GitHub-specific navigation, code-hosting patterns, or density as the default for consumer experiences. Density must be a declared mode with minimum target and readability constraints.

### GOV.UK Design System

**Primary source bundle**

- System: https://design-system.service.gov.uk/
- Design principles: https://www.gov.uk/guidance/government-design-principles
- Service Manual: https://www.gov.uk/service-manual
- Community backlog: https://design-system.service.gov.uk/community/backlog/

**Maintenance signal.** The public site exposes versioned releases, community contribution, backlog status, research notes, and implementation guidance. That visible uncertainty is itself a maturity signal.

**Absorb.** Start with user needs; do the hard work to make it simple; progressive enhancement; plain language; ask only for necessary information; error summaries that move focus and link fields; evidence attached to patterns; contribution proposals with research and multi-service need.

**Do not copy.** Government visual identity or assume a public-service pattern fits commercial discovery, creation, or entertainment. Copy the evidence discipline and resilience bar.

### U.S. Web Design System (USWDS)

**Primary source bundle**

- System: https://designsystem.digital.gov/
- Maturity model: https://designsystem.digital.gov/maturity-model/
- Performance: https://designsystem.digital.gov/performance/
- Implementation: https://github.com/uswds/uswds

**Maintenance signal.** `uswds/uswds` was unarchived and pushed 2026-07-10. The system publishes packages, release information, implementation guidance, and an adoption maturity model.

**Absorb.** Accessibility plus real-world performance, explicit maturity/adoption stages, plain-language public tasks, configuration tokens, and agency implementation guidance. AwesomeDS needs a comparable maturity score for doctrine-only → implemented → tested → adopted → measured.

**Do not copy.** Federal branding or compliance claims. A component inspired by a conforming system is not automatically compliant in a different application.

### Google Material 3

**Primary source bundle**

- System: https://m3.material.io/
- Foundations: https://m3.material.io/foundations
- Components: https://m3.material.io/components
- Adaptive design: https://m3.material.io/foundations/layout/applying-layout/window-size-classes
- Android design: https://developer.android.com/design

**Maintenance signal.** Material’s official site and Android guidance are current platform sources; Google’s public Material icon repository was pushed 2026-07-10. Component implementation freshness must be checked separately for Web, Android, Compose, and Flutter.

**Absorb.** Reference/system/component tokens; complete interaction-state layers; dynamic-color constraints; adaptive window classes; expressive motion roles; canonical component anatomy and behavior; platform-specific implementation mappings.

**Do not copy.** Material appearance as “neutral best practice,” dynamic color for brand-critical surfaces without governance, or Android behavior on the web. It is one mature design language, not the universal visual baseline.

### Salesforce Lightning Design System

**Primary source bundle**

- System: https://www.lightningdesignsystem.com/
- Guidelines: https://www.lightningdesignsystem.com/guidelines/overview/
- Components: https://www.lightningdesignsystem.com/components/
- React implementation: https://github.com/salesforce/design-system-react

**Maintenance signal.** The React repository was pushed 2026-06-02 and remains unarchived, but implementation guidance should be cross-checked against the current Salesforce platform and SLDS version. A repository’s activity does not establish that it is the preferred path for new Salesforce apps.

**Absorb.** Object-centric enterprise patterns, record/detail layouts, data tables, path/progress, activity timelines, scoped CSS architecture, release/version compatibility, and domain language tied to CRM tasks.

**Do not copy.** Salesforce object model, dense layouts, or CSS architecture into unrelated products. Extract domain-agnostic state machines and task patterns.

### Intuit Design System

**Primary source bundle**

- System: https://designsystem.intuit.com/
- Content: https://contentdesign.intuit.com/
- Accessibility: https://www.intuit.com/accessibility/

**Maintenance signal.** The first-party design-system and content portals are live. Much of the implementation is not as openly inspectable as Carbon/Primer, so AwesomeDS must mark claims based on docs separately from claims verified in code.

**Absorb.** Fintech trust, disclosure, error prevention/recovery, tax/financial plain language, conversational content patterns, and designing high-stakes decisions for people with unequal domain expertise.

**Do not copy.** Product/legal language or assume a reassuring tone can replace disclosure and correctness. High-stakes patterns require domain review.

### Pinterest Gestalt

**Primary source bundle**

- System: https://gestalt.pinterest.systems/
- Accessibility: https://gestalt.pinterest.systems/web/accessibility
- Implementation: https://github.com/pinterest/gestalt

**Maintenance signal.** The repository was pushed 2026-03-18, remains unarchived, and is Apache-2.0. Recency is lower than several peers but still active-looking; release cadence should be tracked, not inferred from stars.

**Absorb.** Component accessibility scorecards, visual-discovery patterns, image loading/aspect-ratio behavior, masonry and responsive composition, bidirectional support, and explicit component-quality status.

**Do not copy.** Pinterest’s masonry/feed model or image dominance where task comprehension and scan order require predictable linear structure.

### Uber Base and Base Web

**Primary source bundle**

- Design system: https://base.uber.com/
- Base Web: https://baseweb.design/
- Implementation: https://github.com/uber/baseweb

**Maintenance signal.** `uber/baseweb` was unarchived and pushed 2026-07-07 (MIT). Base and Base Web are related but not identical artifacts; distinguish Uber’s brand system from the open React library.

**Absorb.** Mobility/map contexts, global localization, safety-critical status, multimodal input, compositional component APIs, overrides and extensibility, and separating a company’s brand language from an open implementation layer.

**Do not copy.** Override-heavy APIs as the default, map/mobility assumptions, or Uber’s visual identity. Excessive escape hatches can destroy system coherence.

### Zendesk Garden

**Primary source bundle**

- System: https://garden.zendesk.com/
- Components: https://garden.zendesk.com/components/
- GitHub organization: https://github.com/zendeskgarden

**Maintenance signal.** The first-party site and public organization are live, with component packages separated by concern. AwesomeDS currently lacks a dedicated Garden reference, so package-by-package activity should be captured during ingestion.

**Absorb.** Customer-support workflows, conversation/ticket states, compact toolbars, forms, theming, bidirectionality, package modularity, and the reality of long-lived enterprise UI.

**Do not copy.** Ticketing information architecture or support-agent density into general products.

## Tier 2 — brand bibles, culture, and editorial craft

These sources are valuable precisely because they are not complete component systems. Use them to understand how identity survives across channels, then validate UI behavior elsewhere.

| Organization | First-party sources | Best extraction | Maintenance / confidence signal | Do not copy |
|---|---|---|---|---|
| Duolingo | https://design.duolingo.com/ and its identity, writing, illustration, marketing, resources subpages | Narrative → voice/tone → character contract → shape grammar → asset rules; good/bad examples | Public site is reachable but contains legacy product facts and terminology; case-study grade, not current product truth | Duo, Feather, owl anatomy, proprietary assets, or legacy facts |
| Mailchimp | https://mailchimp.com/about/brand-assets/ and https://styleguide.mailchimp.com/ | Voice-and-tone operationalization, humor boundaries, editorial mechanics, expressive illustration | Brand portal is live; classic voice guide can outlive current product strategy, so date and scope each rule | Freddie, Cavendish yellow, illustration style, or humor without context |
| Airbnb | https://airbnb.design/ and https://airbnb.design/building-a-visual-language/ | DLS origin story, trust, localization, research and design operations | First-party publication; article date and product era must accompany every extraction | Cereal, Bélo, travel-card layouts, unverified “Airbnb style” observations |
| Spotify | https://spotify.design/ | Personalization, audio/product storytelling, editorial design, cross-disciplinary culture | Article-level dates/authors make it suitable as case-study evidence, not a normative component spec | Wrapped aesthetics, duotones, dark-green identity, artist imagery |
| Slack | https://slack.design/ and https://slack.com/intl/en-gb/media-kit | Collaboration UX essays, brand voice, illustration and campaign assets | First-party blog/asset portal; validate old articles against current product behavior | Octothorpe, aubergine palette, proprietary illustration, playful copy in high-risk contexts |
| Wise | https://wise.design/ and https://wise.com/gb/blog/design | Global money UX, localization, transparent fees, distinctive brand expression | First-party system plus current product/design writing; regional/legal scope matters | Wise green, proprietary type/assets, or financial claims outside their jurisdiction |
| Dropbox | https://brand.dropbox.com/ and https://dropbox.design/ | Asset governance, expressive brand range, collaboration/design culture | Separate controlled asset portal from editorial publication; article dates matter | Brand assets, Sharp Grotesk, illustration/campaign compositions |
| Atlassian | https://atlassian.design/content/ and https://atlassian.design/foundations/illustration/ | Enterprise voice, inclusive language, illustration roles | Maintained alongside product system; stronger operational evidence than a standalone blog | Product terms and distinctive illustration grammar |
| IBM | https://www.ibm.com/design/language/ and Carbon content guidance | Enterprise brand expression linked to product foundations | Multiple IBM systems have distinct scopes; record which one supports each claim | IBM Plex/brand language as a universal system |

## Tier 3 — platform, asset, and craft sources

### Apple

**Primary source bundle**

- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Design resources: https://developer.apple.com/design/resources/
- Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- App icons: https://developer.apple.com/design/human-interface-guidelines/app-icons
- SF Symbols: https://developer.apple.com/sf-symbols/
- Design videos: https://developer.apple.com/videos/design/

**What to absorb.** Platform conventions by device, input, windowing and spatial context; content priority; Dynamic Type; VoiceOver; Reduce Motion/Transparency; safe areas; materials; symbol rendering; touch/pointer/keyboard/remote/eye/hand input; privacy and permission moments; platform-specific asset templates. Design resources are executable references, while HIG is doctrine and videos show rationale—AwesomeDS should model those artifact types separately.

**What not to copy.** Apple materials, SF typography, navigation conventions, app-icon construction, or “deference” outside Apple contexts as universal web law. Do not claim HIG conformance from visual resemblance. Rules need platform/version tags because Apple guidance changes with OS releases.

### Google

**Primary source bundle**

- Material 3: https://m3.material.io/
- Google Design: https://design.google/
- Android design: https://developer.android.com/design
- People + AI Guidebook: https://pair.withgoogle.com/guidebook/
- PAIR patterns: https://pair.withgoogle.com/

**What to absorb.** Keep platform UI doctrine (Material/Android), design culture/case studies (Google Design), and human-centered AI research (PAIR) as separate evidence streams. PAIR adds mental models, explainability, feedback, errors, control, and user trust to AI UX.

**What not to copy.** Material visuals into every product; Google’s AI patterns without validating model capability, risk, and user population; decorative “AI sparkle” as disclosure.

### Adobe

Use Spectrum/React Aria for product behavior, Adobe Design at https://adobe.design/ for culture/case studies, and official asset/license portals for actual asset use. Do not infer implementation requirements from campaign/editorial pages.

## Motion, animation, sound, and tactile interaction

| Source | Primary URL | Transferable doctrine | Guardrail |
|---|---|---|---|
| Material motion | https://m3.material.io/styles/motion/overview | Spatial continuity, transition patterns, expressive roles | Material choreography is not universal brand motion |
| Fluent motion | https://fluent2.microsoft.design/motion | Duration, easing, direction, transition vocabulary | Avoid Windows-specific material mimicry |
| Carbon motion | https://carbondesignsystem.com/elements/motion/overview/ | Productive vs expressive motion; system curves | Categories require context, not blind token reuse |
| Apple motion | https://developer.apple.com/design/human-interface-guidelines/motion | Responsiveness, continuity, platform settings | Respect Reduce Motion and platform conventions |
| Motion library | https://motion.dev/ | Production web animation, gestures, layout animation | Library capability does not justify animation |
| Web Animations API | https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API | Browser-native timing/control model | MDN documents APIs; product semantics remain AwesomeDS’s job |
| View Transitions | https://developer.chrome.com/docs/web-platform/view-transitions/ | Progressive continuity across DOM/page transitions | Feature-detect and preserve navigation semantics |
| BBC GEL audio guidance | https://www.bbc.co.uk/gel/ | Media, accessibility, inclusive experience doctrine | Validate current availability/version before promotion |

AwesomeDS should add a **motion contract** per pattern: user intent, semantic role, trigger, spatial model, enter/exit symmetry, duration range, interrupt/cancel behavior, input coupling, reduced-motion equivalent, performance budget, and test evidence. Sound/haptics need the same treatment: meaning, user control, collision/priority, silent alternative, device capability, and accessibility impact.

## Content design and localization sources

| Source | Primary URL | Specific strength |
|---|---|---|
| GOV.UK Content Design | https://www.gov.uk/guidance/content-design | User-need-led plain English and service content |
| Shopify Polaris content | https://polaris.shopify.com/content | Product microcopy, merchant language, actionable feedback |
| Carbon content | https://carbondesignsystem.com/guidelines/content/overview/ | Enterprise UI writing integrated with components |
| Atlassian content | https://atlassian.design/content/ | Voice, inclusive language, grammar and UI conventions |
| Microsoft Writing Style Guide | https://learn.microsoft.com/style-guide/welcome/ | Large-scale technical/product terminology and mechanics |
| Mailchimp Content Style Guide | https://styleguide.mailchimp.com/ | Distinctive voice with explicit mechanics and boundaries |
| 18F Content Guide | https://content-guide.18f.gov/ | Public, plain, accessible, reusable content rules |
| W3C Internationalization | https://www.w3.org/International/ | Script, direction, layout and language technology baseline |

Required extraction is not “tone = friendly.” Build contracts for terminology, reading level, sentence/action structure, field labels, validation, destructive actions, empty/error/recovery states, translation expansion, grammatical variables, pluralization, RTL, mixed scripts, names/addresses, numbers/dates/currency, and prohibited anthropomorphic or certainty claims for AI.

## AI-driven product design: doctrine to add now

### Primary sources

- Google PAIR Guidebook: https://pair.withgoogle.com/guidebook/
- Microsoft Human-AI Interaction Guidelines: https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/
- IBM Carbon for AI: https://carbondesignsystem.com/guidelines/carbon-for-ai/
- NIST AI Risk Management Framework: https://www.nist.gov/itl/ai-risk-management-framework
- Apple machine-learning guidance within HIG topics: https://developer.apple.com/design/human-interface-guidelines/machine-learning
- Vercel AI SDK UI / AI Elements: https://ai-sdk.dev/elements/overview

### Synthesis for AwesomeDS

Every AI surface should declare:

1. **Capability contract:** what the system can and cannot do, data boundary, latency, cost, model/version where relevant.
2. **Uncertainty contract:** calibrated language, provenance/citations, confidence only when meaningful, freshness, and conflict handling.
3. **Agency contract:** preview, edit, confirm, cancel, undo, retry, take over manually, and escalation.
4. **Streaming contract:** stable layout, partial-output semantics, stop/regenerate, tool/activity visibility, and accessible live announcements.
5. **Failure contract:** refusal, timeout, rate limit, unavailable tool, malformed output, partial success, unsafe result, and recovery.
6. **Feedback contract:** what feedback changes, privacy, correction, and how users contest or report results.
7. **Automation contract:** autonomy level, approval boundary, durable audit trail, external side effects, and reversible checkpoints.
8. **Evaluation contract:** task success, accessibility, harmful-error severity, calibration, user trust, latency and cost—not “looks intelligent.”

**Do not copy.** Sparkle icons, gradients, chat bubbles, anthropomorphic typing, or hidden chain-of-thought as generic AI identity. Disclosure must communicate source and consequence, not decorate the UI. Never import a provider’s assistant persona into products with different stakes.

## What a Duolingo-complete ingestion actually means

“Read all pages” is not proven by having one Duolingo reference record. A complete ingestion ledger should include every current route and artifact category, with a disposition for each:

| Domain | Duolingo material | Required AwesomeDS output |
|---|---|---|
| Identity | Logos, color, typography, imagery, brand family | Brand identity contract, token mapping, misuse tests, asset/license metadata |
| Writing | Narrative, voice, tone, Duo, style, glossary | Voice traits, tone matrix, persona boundaries, term registry, localization/AI-copy rules |
| Illustration | Shape language, Duo construction, characters | Primitive grammar, anatomy/silhouette, pose/emotion, complexity, cropping, good/bad fixtures |
| Marketing | Assets and campaign use | Channel templates, approval/expiry/license metadata, handoff requirements |
| Resources | Downloads and linked tools | Artifact registry, version/hash, rights, owner, last verified date |

For each route: preserve URL, observed date, exact supported claims, historical/stale facts, extracted doctrine, rejected brand-specific material, target AwesomeDS module, executable artifact, and reviewer. The current repository captures much of the conceptual lesson, but a route-by-route extraction ledger and evidence-to-implementation links are still required before claiming complete ingestion.

## Canonical synthesis model for AwesomeDS

Each best practice should be a versioned object rather than a paragraph:

```yaml
id: interaction.async.optimistic-update
claim: Keep the prior state recoverable until the operation is confirmed.
scope: reversible low-risk mutations
exceptions: irreversible, regulated, or high-cost actions
evidence:
  - url: https://vercel.com/design/guidelines
    grade: B
    observed: 2026-07-13
  - url: https://pair.withgoogle.com/guidebook/
    grade: B
    observed: 2026-07-13
implementation:
  tokens: []
  components: [Toast, UndoAction, AsyncButton]
  patterns: [optimistic-update]
validation:
  automated: [rollback-on-failure, focus-preserved]
  manual: [screen-reader-announcement, offline-recovery]
freshness:
  owner: interaction
  recheck: 2026-10-13
```

This allows the website, component documentation, agent prompt, review rule, and Reference Atlas to be generated from the same decision.

## Expansion backlog, ordered by leverage

### P0 — close false-completeness gaps

1. Add a route-level Duolingo ingestion ledger; mark historical facts and assets explicitly.
2. Replace organization-level aesthetic claims with exact page/article citations and evidence grades.
3. Add dedicated Garden, GOV.UK, USWDS, Lightning, Gestalt, Base, Intuit and Mailchimp source records.
4. Add source scope: brand bible, product system, platform guide, code, blog/case study, asset portal, standard, or emerging signal.
5. Add “do not copy” and license/trademark fields to every company-derived record.

### P1 — missing bible chapters

1. Data visualization and data integrity (Carbon plus domain standards).
2. Content operations and localization (not only voice examples).
3. Service design and evidence lifecycle (GOV.UK/USWDS).
4. AI capability, uncertainty, agency, streaming, failure, feedback and automation contracts.
5. Sound, haptics and multimodal feedback.
6. Trust/safety, privacy, permissions and high-stakes decisions.
7. Design-system governance: ownership, RFC, contribution, adoption, migration, deprecation, support and measurement.

### P2 — make doctrine executable

1. Link each rule to tokens/components/patterns/stories/tests or label it “guidance-only.”
2. Add maturity: researched → synthesized → specified → implemented → tested → adopted → measured.
3. Generate human docs, compact agent instructions, and QA rules from one object.
4. Add scheduled URL/release/changelog checks; require human review before doctrine changes.
5. Test localization, forced colors, reduced motion, zoom/reflow, keyboard, touch, pointer, screen reader, low bandwidth, offline and partial failure.

## Quality bar for promoting external learning into AwesomeDS

A finding becomes canonical only when all are true:

- supported by a precise first-party source or standard;
- scoped to a user need and context, not framed as timeless taste;
- compared against at least one complementary system for high-impact rules;
- checked for accessibility, localization, performance, privacy and failure effects;
- stripped of proprietary identity and product-specific assumptions;
- expressed as a decision with exceptions, not a slogan;
- mapped to an executable artifact or honestly labeled guidance-only;
- assigned an owner, verification method, version and recheck date.

This is the decisive difference between the “best design link collection” and the **best maintained design operating system**.
