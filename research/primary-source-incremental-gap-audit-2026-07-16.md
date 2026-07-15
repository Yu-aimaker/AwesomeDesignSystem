---
title: "Primary-source incremental gap audit — elite systems, Japan, and agentic UI"
description: "A de-duplicated, first-party-only source plan for advancing AwesomeDS beyond its existing 105-record Reference Atlas."
date: 2026-07-16
status: research
evidence_policy: first-party-only
---

# Primary-source incremental gap audit — 2026-07-16

## Decision

AwesomeDS does **not** need another broad list of famous design-system homepages.
The current Atlas already has 105 structured references and covers the requested
baseline: Duolingo, Apple, Google Material and PAIR, Vercel, Carbon, Fluent,
Atlassian, Polaris, Primer, Spectrum, GOV.UK, SmartHR, and the principal web and
accessibility standards.

The next useful ingestion is narrower:

1. register the missing operational pages behind systems already in the Atlas;
2. add first-party Japanese systems that expose implementation and accessibility
   practice, not just brand inspiration;
3. model agentic UI as four separate layers — generation, transport, embedded UI,
   and user-agency policy — instead of calling all of them “generative UI”;
4. turn sources into linked rules, artifacts, tests, and freshness obligations.

This report recommends only incremental additions or canonical URL corrections.
It deliberately does not repeat a source already present at the same level of
specificity.

## Method

- Compared official URLs against every `content/references/*.json` URL and owner.
- Re-read the current research syntheses and the AI contract rules under
  `content/canon` to avoid proposing doctrine that is already represented.
- Followed redirects and live-checked every recommended URL on 2026-07-16. All
  recommended URLs returned HTTP 200 at observation time.
- Used first-party documentation and publisher-owned repositories only.
- Queried current public repository metadata as a maintenance signal. A recent
  push proves activity, not correctness or documentation freshness.

### Grades

- **Freshness A** — visible current version or publisher repository active within
  the last 30 days.
- **Freshness B** — official live documentation, but no trustworthy page-level
  update date was exposed.
- **Freshness C** — official source is live, but its implementation repository is
  dormant or the page contains known historical material.
- **Trust A** — normative standard, platform owner documentation, or official
  system documentation/code.
- **Trust B** — first-party engineering/design article or case study; useful only
  in its stated context.

## De-duplicated coverage verdict

| Requested publisher/system | What is already structured | Incremental verdict |
|---|---|---|
| Duolingo Design | Hub plus the audited identity, writing, illustration, marketing, and resources routes (17 records) | **No new record.** Preserve it as a high-value but partially historical brand-coherence case study; do not treat it as a current component, accessibility, or product-fact source. |
| Apple HIG | HIG hub, foundations, accessibility, color, spatial layout, typography, Apple Design | Add only the operational **Motion** and **Machine learning** pages below; the July Apple audit already prevents broad duplication. |
| Google Material / PAIR | Material 3 hub/blog/accessibility and PAIR Guidebook | Add only current motion/adaptive implementation evidence. PAIR is already the right human-AI baseline. |
| Vercel / Geist | Vercel Design, Web Interface Guidelines, AI Elements, AI SDK Generative UI | Add Geist itself. The current Atlas cites Vercel’s design practice but not its public component/foundation system. |
| IBM Carbon | Hub, content, motion, accessibility, Carbon for AI | Add Data Visualization; it is a separate operational body of doctrine. |
| Microsoft Fluent | Hub, motion, accessibility, Human-AI Interaction Guidelines | Add Design tokens and AI harm. They cover enforceable architecture and a risk dimension absent from the hub records. |
| Atlassian | Hub, content, accessibility | Add Design tokens; its semantic migration contract is independently useful. |
| Shopify Polaris | Polaris React hub and accessibility | Add current Shopify App Design Guidelines. They define host-integrated workflow and quality expectations that the component hub does not. |
| GitHub Primer | Hub and accessibility | Add the official primitives implementation, not another overview page. |
| Adobe Spectrum / React Aria | Spectrum hub/principles/accessibility and React Aria | **No broad duplicate.** React Aria already supplies behavioral and internationalization evidence; add narrower records only when a rule needs page-level provenance. |
| GOV.UK | Design System hub and accessibility | Add one evidence-rich component pattern and the public community backlog to model research traceability and system governance. |
| デジタル庁 | Absent | Add the versioned DADS documentation and official React samples. |
| SmartHR | Hub only | Add its accessibility quality/process material. |
| freee | Absent | Add Vibes with a freshness warning; useful as a Japanese enterprise implementation case, not a current universal baseline. |
| Ameba | Absent | Add Spindle: an unusually complete Japanese source spanning principles, tokens, components, accessibility, code, and an MCP server. |
| Mercari | Hub present | No duplicate in this pass; deepen only from a precise first-party page tied to a missing rule. |

## P0 — sources to ingest now

Each row states the publisher, the specific learning, and the AwesomeDS landing
point. Proposed IDs follow the existing `ref.<owner>.<topic>` convention.

### Elite system operational depth

| Proposed ID and first-party URL | Publisher | What the source actually teaches | AwesomeDS adoption | Freshness / trust |
|---|---|---|---|---|
| `ref.vercel.geist` — [Geist Design System](https://vercel.com/geist/introduction) | Vercel | A public foundation/component system for consistent web experiences, including typeface and React building blocks. | Link Geist to the existing Vercel interface rules, then extract component anatomy, token naming, responsive behavior, and live examples. Keep Vercel’s monochrome brand recipe separate from universal rules. | **B / A** — official page live; no reliable page date exposed. |
| `ref.ibm.carbon-data-visualization` — [Carbon Data Visualization](https://carbondesignsystem.com/data-visualization/getting-started/) | IBM | Chart selection, visual encodings, legends, color, interaction, and accessibility as part of one maintained design system. | Create a first-class `data-visualization` rule family: question-to-chart decision, semantic series tokens, non-color encodings, empty/loading/error states, table fallback, keyboard/AT behavior, annotation and data-integrity checks. | **A / A** — official docs live; `carbon-design-system/carbon` pushed 2026-07-15. |
| `ref.microsoft.fluent-design-tokens` — [Fluent 2 Design tokens](https://fluent2.microsoft.design/design-tokens) | Microsoft | Global and alias tokens, naming, theme assignment, and avoiding raw pixels/hex values across platforms. | Compare Fluent global→alias mapping with AwesomeDS tokens; add a lintable ban on raw values where a semantic token exists and document platform mapping exceptions. | **A / A** — official docs live; `microsoft/fluentui` pushed 2026-07-15. |
| `ref.microsoft.fluent-ai-harm` — [Fluent 2 — AI harm](https://fluent2.microsoft.design/ai-harm) | Microsoft | Product-design framing for AI harms, beyond styling an assistant surface. | Link into `rule.ai.ux-failure-contract`, agency, uncertainty, and evaluation. Require a harm model and severity-weighted tests before high-impact automation ships. | **B / A** — official current Fluent documentation; no page date exposed. |
| `ref.atlassian.design-tokens` — [Atlassian Design tokens](https://atlassian.design/tokens/design-tokens) | Atlassian | Semantic token use and migration discipline in a large product ecosystem. | Add token lifecycle fields—introduced, replacement, deprecated, removed—and CI checks for deprecated/raw token usage. Do not import Atlassian product names or colors. | **A / A** — official docs live; related public implementation activity observed 2026-07-14. |
| `ref.shopify.app-design-guidelines` — [Shopify App Design Guidelines](https://shopify.dev/docs/apps/design) | Shopify | Predictability, host-surface consistency, adaptive/mobile behavior, accessibility, and merchant trust. The page provides a first-party Markdown representation at `/docs/apps/design.md`. | Add an “embedded/hosted product” profile: inherit host navigation and behavior, minimize novelty in cross-surface workflows, test mobile first, and define the boundary between product brand and host conventions. | **B / A** — official current developer docs; live machine-readable Markdown. |
| `ref.github.primer-primitives` — [Primer Primitives](https://github.com/primer/primitives) | GitHub | Inspectable base and functional tokens that back a dense, multi-theme product UI. | Use as evidence for base→functional→component token dependency and color-mode contracts. Link actual primitives to existing Primer guidance rather than summarizing the hub again. | **A / A** — official repository; active Primer React ecosystem pushed 2026-07-15. |
| `ref.govuk.error-summary` — [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/) | UK Government Digital Service | A complete, testable validation pattern: focus management, linked errors, content structure, and implementation guidance. | Turn form errors into a state-machine artifact and automated/AT acceptance suite; preserve field-level errors and error summary together. | **B / A** — official live pattern documentation. |
| `ref.govuk.community-backlog` — [GOV.UK Design System community backlog](https://design-system.service.gov.uk/community/backlog/) | UK Government Digital Service | Public status, evidence, contribution, and uncertainty around proposed patterns. | Add provenance status (`proposed`, `researching`, `specified`, `implemented`, `measured`) and an evidence ledger to every non-trivial AwesomeDS pattern. | **B / A** — official live governance artifact. |

### Current platform, motion, and adaptation evidence

| Proposed ID and first-party URL | Publisher | What the source actually teaches | AwesomeDS adoption | Freshness / trust |
|---|---|---|---|---|
| `ref.google.material-motion` — [Material 3 Motion](https://m3.material.io/styles/motion/overview/how-it-works) | Google | Spatial continuity and expressive motion roles in the current Material 3 system. | Add semantic motion roles and transition intent, but retain the existing rule that brand choreography is contextual. Every mapping needs interrupt/cancel and reduced-motion behavior. | **B / A** — official page live; current URL was reached through the official redirect. |
| `ref.google.android-adaptive-layout` — [Build adaptive apps](https://developer.android.com/develop/ui/compose/layouts/adaptive/get-started-with-adaptive-apps) | Google | Canonical, current platform implementation guidance for adapting navigation and panes to window posture/size rather than device labels. | Add capability/window-class decisions to the platform matrix. Keep Compose APIs as implementation evidence, not web requirements. | **B / A** — official Android docs; live canonical redirect. |
| `ref.apple.hig-motion` — [Apple HIG — Motion](https://developer.apple.com/design/human-interface-guidelines/motion) | Apple | Responsiveness, continuity, platform convention, and respect for system motion preferences. | Bind platform-specific motion guidance to AwesomeDS motion contracts and test Reduce Motion alternatives; never copy Apple choreography as a cross-platform default. | **B / A** — official HIG, version-sensitive. |
| `ref.apple.hig-machine-learning` — [Apple HIG — Machine learning](https://developer.apple.com/design/human-interface-guidelines/machine-learning) | Apple | Product-level considerations for ML-enabled experiences, scoped to Apple platforms. | Cross-check existing capability, agency, uncertainty, privacy, and feedback contracts. Add only claims supported by the page; do not use the existence of ML as justification for a feature. | **B / A** — official HIG, version-sensitive. |

### Japanese design-system depth

| Proposed ID and first-party URL | Publisher | What the source actually teaches | AwesomeDS adoption | Freshness / trust |
|---|---|---|---|---|
| `ref.digital-agency-jp.dads` — [デジタル庁デザインシステム β版](https://design.digital.go.jp/dads/) | デジタル庁 | A Japanese design language, UI components, and usability/accessibility implementation guidelines. The live page identified itself as **v2.16.0** on 2026-07-16. | Create a `ja-public-service` evidence profile: Japanese typography and content, form/error clarity, administrative-task resilience, keyboard/AT behavior, and direct comparison with GOV.UK/USWDS. | **A / A** — version visible on the official site. |
| `ref.digital-agency-jp.dads-react` — [DADS React samples](https://design.digital.go.jp/dads/react/) and [official repository](https://github.com/digital-go-jp/design-system-example-components-react) | デジタル庁 | React/TypeScript/Storybook examples, DADS tokens, testable component code, and documented React 18→19 compatibility caveat. | Link guidance to executable stories/tests. Preserve the source’s status as sample snippets, not a drop-in claim of full conformance. | **A / A** — official MIT repository pushed 2026-07-15. |
| `ref.smarthr.accessibility-process` — [SmartHR Accessibility](https://smarthr.design/accessibility/) and [quality standards/process](https://smarthr.design/accessibility/standards-and-process/) | SmartHR | Accessibility quality criteria, delivery process, testing guidance, low-vision insights, and multilingual quality/process in a Japanese B2B SaaS context. | Extend the generic WCAG rule with Japanese product checks: mixed scripts, text expansion, low-vision usability, multilingual QA, ownership and release gates. | **B / A** — official live documentation; no page date exposed. |
| `ref.freee.vibes` — [Vibes](https://vibes.freee.co.jp/) and [official repository](https://github.com/freee/vibes) | freee | A real Japanese financial-product React/CSS component system and contribution material. | Use for high-density financial workflows, Japanese labels/data, disclosure and error recovery case studies. Mark it implementation-history evidence; do not adopt old APIs as the AwesomeDS stack. | **C / A** — official site live, but repository last pushed 2024-08-01. Revalidate every implementation claim. |
| `ref.ameba.spindle` — [Spindle](https://spindle.ameba.design/) and [official repository](https://github.com/openameba/spindle) | CyberAgent / Ameba | A cross-medium Japanese system joining brand principles, accessibility, tokens, icons, React components, hooks, syntax themes, contribution, and an MCP server. | Model the missing bridge from narrative principle → semantic token → accessible component → machine-queryable context. Copy no Ameba identity; record icon license separately from MIT code. | **A / A** — official repository pushed 2026-07-15; code MIT, with icon assets separately licensed CC BY-NC-ND 4.0. |

## P0 — agentic UI sources and the layer they govern

These sources are complementary. AwesomeDS should not present them as competing
libraries or collapse them into a single “AI UI” record.

| Proposed ID and first-party URL | Governing layer | What the source actually teaches | AwesomeDS adoption | Freshness / trust |
|---|---|---|---|---|
| `ref.a2ui.protocol` — [A2UI](https://a2ui.org/) and [official repository](https://github.com/a2ui-project/a2ui) | **Generated UI schema/rendering** | Declarative JSON UI; a trusted client component catalog; incremental updates; framework-independent rendering; no arbitrary generated code. The official repository labels v0.9.1 production, v1.0 a release candidate, and the project early-stage. | Define an AwesomeDS component catalog schema with allowed types/props/actions, semantic-token-only values, validator errors, static fallback, trust tiers, and renderer conformance fixtures. Mark experimental until 1.0 stabilizes. | **A / A** — official Apache-2.0 repo pushed 2026-07-15; **high drift risk** before 1.0. The old `google/A2UI` URL redirects to `a2ui-project/a2ui`, so publisher should be recorded as the A2UI project, not assumed to be Google. |
| canonical update to `ref.copilotkit.ag-ui` — [AG-UI](https://docs.ag-ui.com/introduction) and [official repository](https://github.com/ag-ui-protocol/ag-ui) | **Agent↔frontend transport/state** | Open, bidirectional, event-based transport for streaming, multimodality, typed shared state, tool events, cancel/resume, and generative UI payloads. It explicitly distinguishes AG-UI transport from A2UI UI description. | Replace the generic `https://docs.copilotkit.ai/` URL and owner with the current protocol project. Define ordered event semantics, reconnect/idempotency, partial failure, cancellation, shared-state conflict and accessible streaming-announcement tests. | **A / A** — official MIT repo pushed 2026-07-15; protocol is evolving, so use a short review cadence. |
| `ref.mcp.apps` — [MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) | **Embedded interactive tool UI** | `ui://` resources, sandboxed iframe rendering, CSP/permissions, JSON-RPC host communication, tool calls, context updates, and when an embedded app is preferable to a normal link. | Add a hostile-boundary threat model: least privilege, CSP allowlist, explicit capability consent, origin isolation, tool-call approval, accessible iframe title/focus, responsive host sizing, fallback content and teardown. | **B / A** — official MCP extension docs; high drift risk. |
| `ref.openai.apps-sdk-ui-guidelines` — [OpenAI Apps SDK UI guidelines](https://developers.openai.com/apps-sdk/concepts/ui-guidelines) | **Conversational host UX** | Display-mode selection, inline cards, carousels and fullscreen, two-action limit, no nested scrolling/deep navigation in cards, persistent edits, and accessible host-native components. The page is available as first-party Markdown. | Generalize into a host-agnostic “conversation-embedded surface” contract: choose the smallest sufficient mode, eliminate duplicate assistant/card content, keep actions few and explicit, preserve edits, avoid nested scroll, and keep a non-chat/manual path. | **B / A** — official current OpenAI docs; vendor-host specifics must remain scoped to ChatGPT. |
| existing `ref.vercel.generative-ui` and `ref.vercel.ai-elements` | **React streaming/rendering implementation** | Typed React generative interfaces and production chat/agent UI elements. | Keep as implementation evidence beneath the schema/agency rules. Do not let framework APIs define the product contract. | **B / A** — already structured; high documentation drift risk. |
| existing `ref.google.pair-guidebook`, `ref.microsoft.human-ai-guidelines`, `ref.ibm.carbon-for-ai` | **Human-AI product policy** | Expectations, explanation, feedback, error recovery, agency, disclosure and AI presence. | Keep these as the normative product layer over protocol choices. A protocol-compliant agent can still be deceptive, inaccessible, or unsafe. | **B / A** — already structured first-party guidance. |
| `ref.anthropic.building-effective-agents` — [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | **Agent operating architecture** | Distinguishes predefined workflows from agents and recommends simple composable patterns before complex frameworks. | Use only to choose autonomy and orchestration levels. Map workflow/agent choice to visible user controls, approval boundaries, trace, stop, retry and escalation. It is not a visual-design source. | **B / B** — first-party engineering article; contextual, not a standard. |

## Canonical model AwesomeDS should derive

### 1. Protocol stack, not “one AI component library”

```text
human-AI policy  PAIR / Microsoft HAX / Carbon for AI / Apple ML
        ↓ constrains
surface UX       OpenAI Apps UI / host-specific display-mode rules
        ↓ rendered through
UI schema        A2UI or an equivalent finite AwesomeDS schema
        ↓ transported by
interaction      AG-UI events, shared state, cancellation, resume
        ↓ optionally embedded in
tool host        MCP Apps sandbox, CSP, permissions, tool calls
```

Vercel AI SDK/AI Elements can implement parts of this stack, but they do not
replace the policy, schema validation, transport recovery, or host security
contracts.

### 2. Generated-surface manifest

Every generated or agent-controlled surface should declare:

- allowed component catalog and prop schema;
- semantic token allowlist; no raw colors, spacing, z-index, or arbitrary CSS;
- permitted data origins and freshness/provenance display;
- action effect level (`read`, `local`, `reversible external`, `irreversible`);
- approval, cancel, undo, retry, manual takeover, and escalation behavior;
- streaming, reconnect, duplicate-event, out-of-order and partial-result behavior;
- accessibility semantics, focus ownership, live-region policy and reduced motion;
- locale, direction, formatting, text expansion and mixed-script fixtures;
- static/loading/empty/error/refusal/offline fallback;
- renderer/version compatibility and expiry/review date.

### 3. Source-to-runtime traceability

Extend the existing content graph without inventing a parallel documentation
system. A promoted source should link to:

```text
reference → canonical rule → artifact/component/pattern → automated/manual test
          → website example → compact agent instruction → owner/recheck date
```

For high-impact rules, the website should display the exact supporting source,
scope, exceptions, last verification, implementation status, and live example.
A logo grid or generic paragraph is not adequate evidence.

## Adoption order

### Batch 1 — highest leverage

1. Correct AG-UI to its canonical protocol URL/owner.
2. Add A2UI, MCP Apps, and OpenAI Apps SDK UI guidelines; publish the protocol
   stack comparison and bind them to existing AI UX rules.
3. Add DADS documentation/code, SmartHR accessibility process, and Spindle.
4. Add Carbon Data Visualization and make a data-vis rule/artifact/test family.
5. Add Geist and link its live foundations/components to existing Vercel rules.

### Batch 2 — system operability

1. Add Fluent and Atlassian token records; introduce token lifecycle and raw-value
   CI enforcement.
2. Add Shopify host-integration and GOV.UK error/evidence records.
3. Add Apple/Material motion and current Android adaptive evidence; wire them to
   actual interactive examples with reduced-motion and capability fallbacks.
4. Add freee Vibes only with the explicit stale-implementation warning.

## Rejection and caution ledger

- Do not add more Duolingo pages until its route inventory changes. Treat legacy
  product numbers, “Duolingo Plus,” old iOS assumptions, and assets as historical
  or licensed material, not current truth.
- Do not call A2UI “Google’s current production standard.” Its canonical public
  repository is now under `a2ui-project`, and its own README says early-stage.
- Do not cite a generic CopilotKit homepage as the AG-UI specification when the
  protocol project publishes canonical documentation.
- Do not infer current implementation quality from an HTTP 200, repository stars,
  or recent push. Preserve version, scope and recheck date.
- Do not turn Apple, Material, Geist, Carbon, Fluent, Shopify, DADS, SmartHR,
  freee, or Spindle visual identity into universal AwesomeDS defaults. Extract
  decisions, contracts and tests; keep brand recipes opt-in and licensed.
- Do not ingest proprietary fonts, icons, characters or illustrations. Spindle’s
  repository is MIT, but its icon assets declare a separate CC BY-NC-ND 4.0
  license; equivalent per-artifact checks are required for every system.
- Do not promote WCAG 3 draft language to a conformance claim. WCAG 2.2 remains
  the structured normative baseline already present in the Atlas.

## Verification ledger

Observed 2026-07-16:

- all recommendation URLs above resolved with HTTP 200 after redirects;
- `design.digital.go.jp/dads/` displayed v2.16.0;
- public GitHub metadata showed pushes on 2026-07-15 for DADS React, Spindle,
  A2UI, AG-UI, Carbon, Fluent, Primer React, and React Spectrum, and on
  2026-07-14 for Atlassian Pragmatic Drag and Drop;
- `freee/vibes` remained unarchived but its last code push was 2024-08-01;
- A2UI identified v0.9.1 as production, v1.0 as a release candidate, and the
  project as early-stage;
- Shopify, AG-UI, MCP Apps, and OpenAI Apps SDK exposed first-party Markdown
  representations suitable for scheduled source checks.

The decisive quality move is therefore not “more links.” It is **auditable
coverage with executable consequences**: precise first-party evidence, bounded
scope, implementation mapping, live demonstration, tests, ownership, and a
short enough review cadence for rapidly changing agentic protocols.
