---
title: "Duolingo Design complete absorption audit"
description: "Page-by-page primary-source audit of the live Duolingo brand bible against AwesomeDS canon, artifacts, docs, components, and motion."
updated: 2026-07-13
status: research-audit
primary_source: https://design.duolingo.com/
---

# Duolingo Design — complete absorption audit (2026-07-13)

## Executive answer

**All public canonical pages are inventoried, scraped, and represented in the Reference Atlas; all of their useful systems are not yet operationalized.** The current repository has excellent high-level synthesis around cross-medium coherence, voice/tone, character anatomy, and illustration grammar. It does not yet turn several equally important Duolingo lessons into reusable AwesomeDS doctrine, schemas, examples, components, or automated checks.

The live SPA exposes one hub and 16 canonical content routes: identity 5, writing 6, illustration 3, marketing assets 1, and resources 1. All 17 have a `ref.duolingo.*` record and a dated local primary-source extract in `research/case-studies/raw/`. The current claim in `design-system/case-studies/duolingo-lessons.md` that the inventory is covered is therefore true at the **source-registration** layer. It is too strong if read as **complete absorption**.

Current absorption by deliverable depth:

| Layer | Result | Evidence |
|---|---:|---|
| Route inventory | 17/17 | `research/case-studies/raw/inventory.json` |
| Primary-source extracts | 17/17 | `research/case-studies/raw/duolingo-*.md` |
| Reference Atlas records | 17/17 | `content/references/ref-duolingo-*.json` |
| Explicit page synthesis | 17/17, shallow | `design-system/case-studies/duolingo-lessons.md` |
| Transferable canon rules | 4 broad rules | personality, coherence, content design, illustration grammar |
| Linked implementation artifacts | 3 documents | brand coherence, voice/tone, character/illustration |
| Brand-specific components | 0 | no logo, lockup, type specimen, imagery, character, copy, or asset-governance primitives |
| Brand motion contract | partial doctrine only | cross-medium contract names motion; no character-motion artifact |
| Machine-enforced writing/brand checks | 0 | no glossary/style schema or linter |

The correct target is not to clone Duolingo's proprietary expression. It is to make the **production-system patterns** reusable while requiring every AwesomeDS consumer to supply original identity, type, palette, imagery, character, and copy.

## Method and source integrity

- Canonical routes were confirmed from the live Duolingo Design SPA bundle and rendered content was captured from each route on 2026-07-13.
- Each finding below cites the first-party page that owns the claim. Local extracts preserve the rendered text and URL for reproducibility.
- Duolingo's public guide is a historical brand-system case study, not current product truth. Legacy terms and facts include Duolingo Plus, old course/product structures, 2019 examples, old learner counts, and outdated English Test claims. AwesomeDS must transfer the **system**, never those facts.
- Proprietary logos, mascots, fonts, palette names, copy, and downloadable assets must not be redistributed or presented as AwesomeDS assets.

## Page-by-page absorption matrix

Legend: **absorbed** = reusable doctrine plus linked artifact exists; **partial** = summarized or represented but not operational; **missing** = no meaningful reusable artifact.

### Hub

| Primary page | Transferable system | Current state | Exact gap | Required AwesomeDS artifact |
|---|---|---|---|---|
| [Brand Guidelines hub](https://design.duolingo.com/) | A single portal connects identity, writing, illustration, marketing, downloads, help, and ownership; the purpose is consistency across every communication | **Partial**: cross-medium contract and `/brand` canon listing exist | No brand-system workspace that shows completion across every medium, owner/help route, or downloadable deliverables | `BrandSystemManifest` schema + docs dashboard with completeness, owner, contact, version, and export links |

### Identity (5/5 registered)

| Primary page | Transferable system observed | Current state | Missing operational detail | Required doctrine/artifact |
|---|---|---|---|---|
| [Logos](https://design.duolingo.com/identity/logos) | Separate wordmark, landscape lockup, portrait lockup, and icon roles; clear-space units; minimum screen/print sizes; positioning; restricted rotations; third-party-use rules; busy-background and deformation misuse; avatar optical framing | **Partial**: `cross-medium-coherence.md` says logo/clear space; case study mentions min size and misuse | No logo taxonomy, responsive lockup decision tree, safe-area schema, optical-avatar rules, print/digital measurement, or automated misuse checks | `brand/marks-and-lockups.md`; `BrandMark` React primitive; mark manifest (`variant`, `minPx`, `minMm`, `safeArea`, `allowedBackgrounds`); visual tests for distortion, clipping, and contrast |
| [Color](https://design.duolingo.com/identity/color) | Core color hierarchy, secondary delight palette, functional neutrals, character-specific palette, and both digital/print specifications | **Partial**: semantic token doctrine exists and the page is registered | No doctrine for separating master-brand, UI-semantic, campaign, illustration, and character palettes; no print/export metadata; no palette usage ratio or misuse matrix | `brand/color-architecture.md`; token extensions for media/asset gamut and role ownership; accessible palette specimen; contrast and gamut QA |
| [Typography](https://design.duolingo.com/identity/typography) | Display/body role split; measurable size, leading, tracking, casing, alignment, line-length-by-word-count; pairing scale; brand-name typesetting; fallback font; explicit misuses | **Missing at brand-production depth**: generic typography foundation only | No brand type-role contract, pairing rules, licensing/fallback requirements, language/script coverage, display-word budget, or specimen QA | `brand/typography-contract.md`; `TypeSpecimen` and `TypePairing` docs components; font manifest with license, scripts, fallback metrics, minimum size, max words; visual overflow/localization tests |
| [Imagery](https://design.duolingo.com/identity/imagery) | Illustration is default; photography has a defined job; authentic people and real stories; diversity; place/action contexts; portrait direction; art may express communication and connection | **Partial**: illustration grammar exists; photography is one row in coherence contract | No photography doctrine, consent/authenticity/accessibility metadata, casting/representation guidance, crop/focal-point rules, or decision rule for photo vs illustration | `brand/imagery-direction.md`; `ImageAssetManifest`; focal-point/crop preview; alt-text and rights fields; representation and synthetic-media disclosure checklist |
| [Brand Family](https://design.duolingo.com/identity/brand-family) | Master-brand inheritance, construction units derived from the wordmark, hierarchy by weight/scale, generic sub-brand lockup, alternate layout when master-brand recognition is weak | **Missing**: only a bullet in the case study | No brand architecture model for branded house/endorsed/independent offerings, inheritance/override rules, naming or lockup generator, deprecation policy | `brand/brand-architecture.md`; `BrandFamilyManifest`; lockup composition primitive; inheritance validation; migration/deprecation workflow |

### Writing (6/6 registered)

| Primary page | Transferable system observed | Current state | Missing operational detail | Required doctrine/artifact |
|---|---|---|---|---|
| [Brand Narrative](https://design.duolingo.com/writing/brand-narrative) | Mission → difference → proof pillars → audience stories → personality analogies → message hierarchy → reusable copy at multiple lengths → audience adaptations | **Partial**: narrative is a required field in coherence contract | No narrative canvas, evidence registry for claims, message hierarchy, audience-specific variants, or short/medium/long copy templates | `brand/narrative-and-messaging.md`; `NarrativeManifest`; claim-to-evidence links; message-length and audience matrix; stale-fact gate |
| [Voice](https://design.duolingo.com/writing/voice) | Four stable qualities, each expressed as definition + means/not + paired examples across product and notification channels; global/localization constraints | **Absorbed structurally**: `voice-tone-matrix.md` captures stable qualities, means/not, and channel examples | Still lacks a machine-readable voice profile, localization transcreation contract, and evaluation rubric | `VoiceProfile` schema; channel fixtures; agent evaluator that scores qualities without homogenizing prose; locale-owned exceptions |
| [Tone](https://design.duolingo.com/writing/tone) | Read the audience's emotional state; lower exuberance for hardship; celebrate achievement; support rather than shame on failure; paired good/bad examples | **Absorbed structurally**: minimum context matrix and empathy rule exist | Matrix is generic and does not model user state, risk, urgency, public/private context, or evidence examples as test fixtures | Extend to `ToneDecisionMatrix` with state/risk/urgency/channel axes; golden copy fixtures; failure-state no-shame lint |
| [Duo's voice](https://design.duolingo.com/writing/duo) | Character “is/isn't” bounds; character is an intensified but consistent brand voice; explicit speaking channels and attribution; forbidden threat/violence; movement and sound constraints connect verbal and visual character | **Partial**: speaking restrictions and anatomy/emotion limits exist | Missing provenance/attribution UI for character speech, channel permissions schema, relationship between character intensity and brand baseline, and motion/sound behavior contract | `CharacterPersonaManifest`; `CharacterMessage` component with explicit attribution; permission matrix; character motion recipes (idle, acknowledge, celebrate) with reduced-motion equivalents |
| [Style](https://design.duolingo.com/writing/style) | Operational editorial rules for numerals, emoji by channel, punctuation, capitalization, lists, emphasis, URLs/email, contractions, symbols, money/time/percentages, and product capitalization | **Missing**: current `content-design.md` is only four bullets | No locale-aware editorial style schema, lint rules, exception model, channel profiles, examples, or QA fixtures | `brand/editorial-style.md`; locale/channel YAML or JSON profile; remark/textlint integration; UI-capitalization and button-label checks; editor playground |
| [Glossary](https://design.duolingo.com/writing/glossary) | Canonical product definitions, preferred spelling, grammar-sensitive forms, public/internal terminology, words to avoid, and reason/context examples | **Partial**: canonical glossary and forbidden terms are required by rules | No actual glossary data model, term ownership, lifecycle, alias handling, public/internal scope, locale mapping, code/API-name linkage, or linter | `ProductLexicon` schema and sample; Atlas-like searchable glossary UI; CI term lint; owner/status/replacement/locale fields; stale-product-term detection |

### Illustration (3/3 registered)

| Primary page | Transferable system observed | Current state | Missing operational detail | Required doctrine/artifact |
|---|---|---|---|---|
| [Shape Language](https://design.duolingo.com/illustration/shape-language) | Closed primitive vocabulary, flat perspective, controlled depth, construction/complexity bounds, consistent rounded edges, shadow grammar, color roles, visual rhythm, explicit misuses | **Absorbed as doctrine**: `character-system.md` captures primitive set, complexity, perspective, shadow, color, rhythm | No executable primitive library, illustration token package, complexity measurement, specimen/misuse gallery, or output QA | `packages/illustration` primitives and tokens; `IllustrationSpecimen`; SVG lint for palette/stroke/filter/complexity; screenshot matrix at target sizes |
| [How to draw Duo](https://design.duolingo.com/illustration/duo) | Character construction is decomposed into recognizable anatomy and proportion rules; recognizability depends on silhouette and constrained details | **Absorbed structurally**: anatomy sheet, face zones, limb limits, silhouette, emotion/pose/crop rules | No neutral character-template asset, rig/anchor schema, construction-grid renderer, or accessibility treatment | Original-IP `CharacterConstructionTemplate`; anchor/rig manifest; silhouette test; alt-text/role policy; never include Duolingo geometry |
| [Characters](https://design.duolingo.com/illustration/characters) | Shared construction rules across a diverse cast; expressive pose/silhouette; distinctive anatomy, personality, clothing, color, and facial behavior; crop to emphasize expression/action | **Partial**: character anatomy and emotion guidance exists | No cast-system doctrine balancing common grammar with individual distinction; representation review; pose/emotion matrix; ensemble composition; cultural review | `brand/character-cast-system.md`; cast manifest; pose/emotion/crop preview; representation and stereotype review gate; ensemble collision/contrast tests |

### Marketing and resources (2/2 registered)

| Primary page | Transferable system observed | Current state | Missing operational detail | Required doctrine/artifact |
|---|---|---|---|---|
| [Marketing assets](https://design.duolingo.com/marketing/assets) | A “greatest hits” kit packages logo, core color, typography, mascot/characters, and usage guidance; assets support composable individual/pair/group use | **Missing**: source is registered; proprietary downloads are correctly not copied | No first-party AwesomeDS brand-kit packaging pattern, license/rights metadata, versioned downloads, export presets, or request/help workflow | `brand/asset-governance.md`; `AssetManifest`; local export pipeline for SVG/PNG/PDF and checksums; rights/version/owner metadata; docs download catalog |
| [Resources](https://design.duolingo.com/resources) | Central access to press, help, official products, social channels, and organizational context makes guidance actionable and supportable | **Partial**: Reference Atlas exists | No owner/contact/escalation and support lifecycle attached to brand modules; no “request an asset / report misuse” path; no official-vs-community distinction in downloads | Brand governance/resource center in docs; owner and SLA fields; support/request templates; official/community badge; changelog and migration notices |

## What is genuinely absorbed today

The following lessons are strong enough to retain as canon:

1. **Personality is a production contract, not an adjective list.** `cross-medium-coherence.md` correctly spans narrative, voice, tone, character, identity, imagery, illustration, iconography, motion, sound, and accessibility.
2. **Voice stays stable while tone reads the room.** `voice-tone-matrix.md` preserves the strongest distinction and correctly prohibits humor or shame in failure/destructive contexts.
3. **Character systems require bounded behavior.** `character-system.md` and `voice-tone-matrix.md` correctly require anatomy, emotional limits, speaking authority, and forbidden critical-message domains.
4. **Illustration is a grammar.** Primitive vocabulary, edge style, complexity, perspective, shadow, palette role, rhythm, silhouette, and misuse are captured.
5. **Case-study extraction must be anti-imitation.** The repository explicitly forbids copying Duo, proprietary geometry, palette, catchphrases, and assets.
6. **Product facts are perishable.** The staleness warning is correct and essential; historical brand guidance cannot certify current product terminology.

## Critical gaps by priority

### P0 — Make the brand system executable

1. Create machine-readable manifests for brand, mark/lockup, typography, narrative, voice, tone, lexicon, character, imagery, and assets.
2. Link every manifest field to a canon rule, source claim, docs renderer, and verifier.
3. Add a docs **Brand System Workbench**: overview completeness, identity specimens, voice/tone playground, glossary search, character contract, imagery direction, asset downloads, ownership, and changelog.
4. Convert good/bad guidance into test fixtures. A doctrine that cannot be rendered or checked remains advisory.

### P0 — Close writing-system depth

The largest content gap is `/writing/style`, not voice/tone. Add locale- and channel-aware editorial profiles plus automated linting. Add a real product lexicon with owners, definitions, allowed/forbidden terms, aliases, locale mappings, public/internal scope, lifecycle, and replacement guidance. AI agents must load both before generating interface copy.

### P1 — Complete identity production

Add marks/lockups, brand type, photography/imagery, and brand-family architecture as first-class modules. These are presently catalogued but not absorbed. Build original example assets solely for demonstrating the system.

### P1 — Connect character across copy, illustration, and motion

Character identity is cross-modal. One manifest should define anatomy/rig anchors, pose and emotion vocabulary, who can speak, attribution, allowed channels, movement intensity, sound permission, and reduced-motion alternatives. Add a `CharacterMessage` component and motion recipes without prescribing a mascot aesthetic.

### P1 — Treat assets and support as product surfaces

Create an asset manifest/export pipeline and a resource center with version, license, checksum, owner, deprecation, support, and request paths. Duolingo's downloads/resources pages demonstrate that guidance without usable artifacts and help is incomplete.

### P2 — Add evidence-preserving AI review

An agent review should answer:

- Which source-backed contract applies?
- Which required fields are absent?
- Does generated output violate the brand's own profile?
- Is it merely imitating a referenced company?
- Are copy claims current and evidenced?
- Does localization preserve intent rather than English surface form?
- Do accessibility preferences change motion, sound, image, and language behavior coherently?

## Proposed canonical rule set

The current four broad brand rules should remain, with these focused additions:

| Proposed rule ID | Invariant | Verification evidence |
|---|---|---|
| `rule.brand.marks-lockups` | Every mark variant has role, safe area, minimum size, background permission, and misuse cases | manifest validation + visual matrix |
| `rule.brand.color-architecture` | UI, brand, campaign, illustration, and character color roles are explicit and accessible | token graph + contrast/gamut tests |
| `rule.brand.typography-contract` | Every type role has size/leading/tracking/casing/alignment/script/fallback/license constraints | specimen snapshots + overflow/locale tests |
| `rule.brand.imagery-direction` | Photo, illustration, and synthetic imagery have distinct jobs, rights, consent, crop, and alt-text metadata | asset lint + crop/a11y review |
| `rule.brand.architecture` | Sub-brands declare inheritance, overrides, endorsement, naming, and deprecation | brand-family graph validation |
| `rule.brand.narrative-evidence` | Product promises and factual claims map to current evidence and approved audience variants | freshness and claim validation |
| `rule.brand.editorial-style` | Locale/channel editorial profiles are machine-readable and linted | text fixtures + CI lint |
| `rule.brand.product-lexicon` | Public nouns have definition, owner, scope, locale, status, and replacement | lexicon schema + stale-term lint |
| `rule.brand.character-behavior` | Character speech, movement, sound, emotional range, and critical-domain exclusions share one contract | component, motion, and copy fixtures |
| `rule.brand.asset-governance` | Distributed assets are versioned, licensed, owned, checksummed, and deprecatable | export manifest + download QA |

## Proposed component and tooling surface

These artifacts turn lessons into a component/animation/content library while staying brand-neutral:

- `BrandMark`: responsive variant selection, accessible label, safe-area wrapper, background validation.
- `TypeSpecimen` / `TypePairing`: role rules, live locale preview, overflow and fallback visualization.
- `PaletteSpecimen`: semantic/brand/illustration views with contrast and print-gamut warnings.
- `ImageDirectionCard`: intent, rights, subject consent, focal point, crop variants, alt text, synthetic-media disclosure.
- `CharacterMessage`: explicit speaker attribution, allowed-channel enforcement, fallback text, critical-domain prohibition.
- `CharacterStage`: pose/emotion/scale preview with idle/acknowledge/celebrate recipes and reduced-motion mode.
- `NarrativeComposer`: evidence-backed approved messages by audience and length, never free-form claim generation.
- `LexiconExplorer`: canonical term, definition, examples, aliases, forbidden terms, public/internal scope, locale, owner, lifecycle.
- `AssetCatalog`: versioned previews and exports with rights, checksum, format, color space, owner, and deprecation.
- `BrandAudit`: completeness and violation report linking rule → source → manifest field → artifact → test.

## Documentation information architecture

The current `/brand` page renders Markdown cards and one featured article. To absorb the source's operational model, add this navigation under Brand:

1. Overview and completeness
2. Narrative and claims
3. Voice, tone, and character speech
4. Editorial style and product lexicon
5. Marks and lockups
6. Color architecture
7. Typography
8. Imagery and illustration
9. Character/cast system
10. Motion, sound, and haptics
11. Brand family architecture
12. Assets, rights, and downloads
13. Governance, ownership, changelog, and help

Every page should follow: **principle → contract/schema → live specimen → correct/incorrect examples → production limits → accessibility/localization → source trail → verification status → related guidance**.

## Acceptance criteria for “Duolingo fully absorbed”

Do not claim complete absorption until all are true:

- [ ] All 17 source records remain fresh and content-hash changes trigger review.
- [ ] Each of the 16 content pages maps to at least one transferable canon rule or an explicit “case-study only / no transfer” decision.
- [ ] Identity has executable mark, color, type, imagery, and brand-family contracts.
- [ ] Writing has narrative, voice, tone, persona, editorial style, and lexicon contracts plus fixtures.
- [ ] Illustration has primitive, construction, cast, pose/emotion, crop, and misuse specimens.
- [ ] Marketing/resources have asset governance, download, ownership, support, version, and rights workflows.
- [ ] Character rules are shared by content, illustration, component, motion, sound, and accessibility layers.
- [ ] Original neutral demo assets prove the abstractions without copying Duolingo IP.
- [ ] Docs expose every contract as a searchable, interactive, locally working surface.
- [ ] CI verifies schemas, source links, claims/freshness, editorial rules, accessibility, visual states, localization overflow, reduced motion, and asset metadata.
- [ ] A traceability report proves source → claim → canon → artifact → test for every adopted lesson.

## Primary-source index

- Hub: https://design.duolingo.com/
- Identity: https://design.duolingo.com/identity/logos · https://design.duolingo.com/identity/color · https://design.duolingo.com/identity/typography · https://design.duolingo.com/identity/imagery · https://design.duolingo.com/identity/brand-family
- Writing: https://design.duolingo.com/writing/brand-narrative · https://design.duolingo.com/writing/voice · https://design.duolingo.com/writing/tone · https://design.duolingo.com/writing/duo · https://design.duolingo.com/writing/style · https://design.duolingo.com/writing/glossary
- Illustration: https://design.duolingo.com/illustration/shape-language · https://design.duolingo.com/illustration/duo · https://design.duolingo.com/illustration/characters
- Marketing/assets: https://design.duolingo.com/marketing/assets
- Resources: https://design.duolingo.com/resources

Local reproducibility evidence: `research/case-studies/raw/inventory.json` and `research/case-studies/raw/duolingo-*.md` (rendered live SPA text, fetched 2026-07-13).

