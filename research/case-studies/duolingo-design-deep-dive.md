# Duolingo Design — Deep Dive Synthesis (2026-07-13)

## Coverage answer

**Yes — full public page inventory is now registered and synthesized.**

| Layer | Status |
|---|---|
| Hub + 15 subpages listed | ✅ `design-system/case-studies/duolingo-lessons.md` |
| Per-page Reference Atlas records | ✅ `ref.duolingo.*` (16 + hub) |
| Transferable brand modules | ✅ cross-medium / voice-tone / character |
| Proprietary asset copy | ❌ intentionally never |
| Live SPA full-text scrape | ⏳ Playwright scrape (site is JS SPA; curl returns shell only) |

## Page inventory

See `design-system/case-studies/duolingo-lessons.md` for identity/writing/illustration/marketing/resources URLs.

## What AwesomeDS took away

1. Brand as production system across media
2. Documentation sequence: principle → rule → examples → limits → related
3. Character verbal + visual contracts
4. Glossary + forbidden terminology as first-class content design
5. Explicit staleness warning for product facts on brand sites

Primary source: https://design.duolingo.com/


---

## Local Playwright scrape appendix (2026-07-13)

Full SPA extraction succeeded for **17/17** pages.

| Page | Chars | Title |
|---|---:|---|
| `home` | 916 | Duolingo Brand Guidelines |
| `identity-logos` | 4473 | Logos - Duolingo Brand Guidelines |
| `identity-color` | 3141 | Color - Duolingo Brand Guidelines |
| `identity-typography` | 6008 | Typography - Duolingo Brand Guidelines |
| `identity-imagery` | 3039 | Imagery - Duolingo Brand Guidelines |
| `identity-brand-family` | 2114 | Brand Family - Duolingo Brand Guidelines |
| `writing-brand-narrative` | 9813 | Brand Narrative - Duolingo Brand Guidelines |
| `writing-voice` | 4076 | Voice - Duolingo Brand Guidelines |
| `writing-tone` | 2662 | Tone - Duolingo Brand Guidelines |
| `writing-duo` | 2855 | Duo - Duolingo Brand Guidelines |
| `writing-style` | 13111 | Style - Duolingo Brand Guidelines |
| `writing-glossary` | 4097 | Glossary - Duolingo Brand Guidelines |
| `illustration-shape-language` | 4314 | Shape Language - Duolingo Brand Guidelines |
| `illustration-duo` | 1339 | Duo - Duolingo Brand Guidelines |
| `illustration-characters` | 4763 | Characters - Duolingo Brand Guidelines |
| `marketing-assets` | 1476 | Assets - Duolingo Brand Guidelines |
| `resources` | 1195 | Resources - Duolingo Brand Guidelines |

Raw files: `research/case-studies/raw/duolingo-*.md`

### High-signal transferable extractions (anti-imitation)

- Voice = 4 stable qualities with Means/Not + multi-channel examples
- Tone = empathy by audience state (hardship vs celebration; success vs stumble)
- Duo character = is/isn't traits + notification vs lesson do/don't (never threatening)
- Shape language = closed primitive set, complexity budget, flat perspective, pill shadows
- Logos = clear space, min size, allowed rotations, misuse list

AwesomeDS modules: `design-system/brand/*`, `design-system/case-studies/duolingo-lessons.md`, Atlas `ref.duolingo.*`
