# First-party design-system source coverage update (2026-07)

**Date:** 2026-07-13  
**Scope:** `content/references/*.json` versus current official, first-party design-system sources  
**Rule:** Recommend additions only when the Atlas lacks a distinct operational source, or when a registered URL now redirects to a different canonical location.

**Implementation status:** Completed in this branch on 2026-07-13. The eight recommended accessibility sources and three canonical metadata updates below are now incorporated; the Atlas contains 105 references. The findings retain the pre-implementation snapshot so the decision trail remains auditable.

## Verdict

The requested primary-source baseline is present: Duolingo Design, Apple HIG, Vercel Design, Material 3, Fluent 2, Polaris, Carbon, Atlassian, Primer, Spectrum, Lightning, GOV.UK, and W3C all have first-party records.

Coverage depth is uneven. Duolingo has the hub plus all 16 currently catalogued subpages, and Apple has the HIG hub plus accessibility, color, foundations, spatial layout, typography, and the broader Apple Design surface. Vercel and W3C also have multiple purpose-specific records. By contrast, Shopify, Primer, GOV.UK, and Material are represented primarily by a hub; Atlassian, Spectrum, and Lightning remain thin relative to the operational guidance their official sites expose.

| System | Atlas records | Current assessment |
| --- | ---: | --- |
| Duolingo Design | 17 | Complete for the page map audited in `duolingo-complete-audit-2026-07.md`; no source addition justified. |
| Apple | 7 | Strong HIG foundation coverage; no source addition justified by this pass. |
| Vercel | 4 | Design, interface guidelines, AI Elements, and Generative UI are covered; one canonical URL needs updating. |
| W3C | 5 | WCAG 2.2, WCAG 3 draft, APG, DTCG group, and DTCG format are covered; no addition justified. |
| Carbon | 4 | Hub, content, motion, and Carbon for AI are covered; accessibility remains a distinct missing operational source. |
| Material / Fluent | 3 each | Hubs and selected specialist sources exist; official accessibility guidance is not separately traceable. |
| Atlassian / Spectrum / Lightning | 2–3 | First-party baseline exists but page-level operational evidence is thin. |
| Polaris / Primer / GOV.UK | 1 each | Hub-only Atlas coverage; accessibility guidance is not independently traceable. |

## Canonical URL updates

These are not new sources. They are updates to existing records verified through the official redirect chain on 2026-07-13.

1. `ref.vercel.generative-ui`: replace `https://sdk.vercel.ai/docs/ai-sdk-ui/generative-user-interfaces` with the current official destination, [AI SDK — Generative User Interfaces](https://ai-sdk.dev/docs/ai-sdk-ui/generative-user-interfaces). The old URL returns HTTP 200 only after redirecting to `ai-sdk.dev`.
2. `ref.shopify.polaris`: replace `https://polaris.shopify.com/` with the current official destination, [Polaris React](https://polaris-react.shopify.com/). The old host redirects to this site.
3. `ref.salesforce.lightning-guidelines`: re-review rather than mechanically retaining its title. The registered `/guidelines/overview/` URL now lands on the official Lightning Design System 2 “Patterns” page, so “guidelines overview” no longer describes the fetched evidence. Use a stable, purpose-specific current page before updating the record.

## Genuine source additions

The following official pages are absent from `content/references` and add operational guidance not represented by their respective hub record. All resolved successfully on 2026-07-13.

| Priority | Proposed source | Why it is additive |
| --- | --- | --- |
| P1 | [Material 3 — Accessible design](https://m3.material.io/foundations/accessible-design/overview) | Makes Material-specific accessible color, layout, interaction, and assistive-technology guidance directly traceable instead of attributing it to the general M3 hub. |
| P1 | [Fluent 2 — Accessibility](https://fluent2.microsoft.design/accessibility) | Adds Microsoft’s product-level accessibility practices; the existing Fluent records cover the system hub and motion, not accessibility. |
| P1 | [Shopify Polaris React — Accessibility](https://polaris-react.shopify.com/foundations/accessibility) | Adds the operational accessibility foundation for the newly canonical Polaris site; current coverage is hub-only. |
| P1 | [Atlassian Design System — Accessibility](https://atlassian.design/foundations/accessibility) | Adds Atlassian’s foundation-level implementation guidance; existing records cover only the hub and content design. |
| P1 | [Primer — Accessibility](https://primer.style/accessibility/) | Adds GitHub’s system-specific accessibility contract; current Primer coverage is hub-only. |
| P1 | [Spectrum — Accessibility](https://spectrum.adobe.com/page/accessibility/) | Adds Spectrum’s accessibility principles independently of the system hub and general design-principles page. |
| P2 | [Carbon — Accessibility overview](https://carbondesignsystem.com/guidelines/accessibility/overview/) | Completes Carbon’s existing content, motion, and AI specialist set with its accessibility operating model. |
| P2 | [GOV.UK Design System — Accessibility](https://design-system.service.gov.uk/accessibility/) | Separates GOV.UK’s accessibility responsibilities and testing guidance from its hub-only record. |

Do not add another generic W3C accessibility record in this batch: WCAG 2.2 and APG already provide the normative and pattern-level evidence needed by AwesomeDS. Do not add more Duolingo or Apple records until their official navigation exposes a genuinely new page or the existing page-level records fail freshness review.

## Evidence notes

- Corpus counts were computed from the current `content/references/*.json` owner and URL fields.
- “Present” means a structured Atlas record exists, not merely that a URL appears in prose under `research/` or `design-system/`.
- Official redirects were followed to their final destination. A successful redirect is not treated as a freshness failure, but it is a metadata-quality issue when the stored URL or title no longer describes the final source.
- This pass did not recommend secondary blogs, community summaries, social posts, or repositories not owned by the system publisher.

WEB_ACCESS=YES
