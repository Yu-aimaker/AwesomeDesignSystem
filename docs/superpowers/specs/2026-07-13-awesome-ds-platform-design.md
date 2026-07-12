# AwesomeDS Platform Design

**Date:** 2026-07-13  
**Status:** Approved for implementation  
**Scope:** Local-first monorepo; public deployment is explicitly out of scope for this phase.

## 1. Product definition

AwesomeDS is a maintained, evidence-backed design bible and executable design platform. It combines:

1. a canonical body of design principles and current best practices;
2. a structured Reference Atlas that shows where each conclusion came from;
3. framework-independent tokens, contracts, and CSS foundations;
4. an installable React component and motion library;
5. a local documentation website with searchable guidance, live examples, and copyable code;
6. AI-agent skills and machine-readable design instructions;
7. automated freshness, quality, accessibility, and consistency checks.

The repository must never degrade into either a bookmark collection or an undocumented component kit. Every important recommendation links backward to evidence and forward to an executable artifact or validation rule.

## 2. Product principles

- **Synthesis over aggregation.** References are evidence; AwesomeDS owns the conclusion.
- **Evidence is traceable.** Every doctrine records source class, observation date, confidence, and freshness.
- **Principle becomes practice.** Guidance maps to tokens, component contracts, recipes, tests, or agent rules.
- **Framework-independent core.** React is the reference implementation, not the definition of the system.
- **Accessible by construction.** WCAG 2.2 AA and WAI-ARIA behavior are release requirements.
- **Global by default.** Japanese typography remains first-class and the model expands to multiple scripts and RTL.
- **Motion communicates.** Animation must explain state, hierarchy, causality, or spatial continuity.
- **AI operates inside contracts.** Agents compose approved primitives and cite rules instead of inventing arbitrary style.
- **Freshness is visible.** Old knowledge is labelled, queued for review, and never silently presented as current.
- **Avoid imitation.** Brand references yield transferable principles, not copied identity.

## 3. Information architecture

### 3.1 Canonical knowledge

The current `design-system/` content evolves into a browsable canon with these domains:

- philosophy: design principles, anti-slop, CRAP principles, gestalt, hierarchy, restraint, originality;
- brand: personality, voice, tone, content design, iconography, illustration, imagery, sound, cross-medium coherence;
- foundations: color, typography, spacing, layout, grids, tokens, elevation, iconography;
- interaction: navigation, forms, feedback, states, responsive behavior, input modalities;
- components: anatomy, variants, state matrices, accessibility, content rules, composition;
- patterns: product, marketing, data-dense, editorial, commerce, AI-native, onboarding, empty/error/recovery;
- motion: principles, choreography, springs, gestures, scroll, view transitions, reduced motion, performance;
- accessibility: WCAG, APG, cognitive access, zoom/reflow, internationalization, assistive technology;
- design engineering: browser platform, performance, testing, theming, distribution, governance;
- AI-driven design: prompt contracts, generative UI boundaries, agent review, DESIGN.md, evals, provenance;
- reference implementations: React, CSS, Storybook-style examples, recipes, and starter patterns.

The Non-Designer's Design Book concepts are represented as durable foundational doctrine, with copyright-safe summaries rather than reproduced text.

### 3.2 Reference Atlas

References live as structured records, not prose-only link lists. Each record contains:

- stable ID, title, canonical URL, owner, source class, region, language, topic tags;
- observed date, last verified date, review cadence, freshness state, drift risk;
- evidence level: standard, first-party guidance, first-party implementation, observed behavior, inferred pattern, emerging signal;
- summary, transferable lessons, caveats, license/usage note, anti-imitation note;
- linked canon rules, tokens, components, patterns, tests, and agent instructions.

The website exposes full-text search and filters for topic, organization, medium, geography, language, source class, evidence level, and freshness. A reference page shows both “what this source teaches” and “where AwesomeDS applied it.” Canon pages show their supporting references.

X and other social sources enter an emerging-signals queue. They are promoted into canon only after corroboration from a primary source, working implementation, repeated product evidence, and accessibility/performance review.

### 3.3 Executable system

The monorepo contains:

- `packages/tokens`: typed source tokens plus generated CSS variables and Tailwind v4 theme output;
- `packages/core`: framework-independent contracts, metadata, state models, and utility CSS;
- `packages/react`: accessible React components consuming semantic tokens only;
- `packages/motion`: framework-independent motion values plus React helpers and recipes;
- `packages/content`: schemas and loaders for canon and Reference Atlas records;
- `apps/docs`: local Next.js documentation and component explorer;
- `scripts`: source validation, link/freshness checks, content graph checks, and reports;
- retained `design-system/`, `research/`, and `skills/` content, migrated gradually without breaking existing consumers.

Use pnpm workspaces and Turborepo. TypeScript is strict. React is the reference UI target. The docs app is local-first and requires no hosted service.

## 4. Component library

The first complete release provides a coherent baseline rather than hundreds of shallow components:

- Button, IconButton, Link, Badge;
- Input, Textarea, Checkbox, RadioGroup, Switch, Select;
- Dialog, AlertDialog, Popover, Tooltip, DropdownMenu;
- Tabs, Accordion, Breadcrumb, Pagination;
- Card, Callout, Skeleton, Spinner, Progress;
- Toast, EmptyState, ErrorState;
- Stack, Cluster, Grid, Container, VisuallyHidden.

Each component includes anatomy, variants, all interaction states, keyboard contract, screen-reader behavior, content rules, RTL behavior, high-contrast behavior, reduced-motion behavior, examples, and automated tests. Complex behavior uses proven accessible primitives where this materially reduces risk, while public APIs remain AwesomeDS-owned.

## 5. Motion library

Motion is expressed through semantic tokens and intent-based recipes:

- duration, easing, spring, distance, opacity, blur, stagger, and orchestration tokens;
- enter/exit, reveal, expand/collapse, shared-layout, list changes, feedback, drag, scroll, and page-transition recipes;
- CSS-first implementations for simple transitions and progressive enhancement;
- Motion for React helpers for interruption, gestures, layout, and springs;
- automatic reduced-motion alternatives;
- performance rules restricting layout-triggering animation and documenting exceptions.

Every recipe identifies purpose, allowed contexts, prohibited usage, performance implications, and accessibility fallback.

## 6. Documentation website

The local website is both a learning environment and a working component explorer. Primary routes:

- `/` — product thesis, navigation, freshness summary;
- `/foundations`, `/principles`, `/brand`, `/interaction`, `/patterns`, `/ai-design` — canon;
- `/components` and `/components/[slug]` — live examples, API, states, a11y, copyable code;
- `/motion` and `/motion/[slug]` — live recipes and reduced-motion comparison;
- `/references` and `/references/[id]` — searchable Reference Atlas;
- `/playground` — token/theme and component composition sandbox;
- `/status` — source freshness, broken links, coverage, and quality signals.

The visual language follows AwesomeDS itself: distinctive but restrained, excellent Japanese/Latin typography, token-driven color, visible focus, responsive layouts, and purposeful motion. It must not resemble a raw shadcn or generic Tailwind documentation template.

## 7. Data flow and consistency

Structured content and tokens are the shared contract:

1. Reference records validate against a versioned schema.
2. Canon documents declare stable rule IDs and reference IDs.
3. Components and motion recipes declare the rule IDs they implement.
4. Tests and review checks declare the rule IDs they verify.
5. The docs app renders this graph and reports unlinked evidence, unimplemented rules, and unverified artifacts.

Generated outputs are reproducible and checked for drift. Handwritten Markdown remains readable on GitHub; the website enhances rather than replaces it.

## 8. Freshness and governance

Local scripts and GitHub-ready workflows provide:

- schema and internal-link validation on every change;
- external-link checking with retries and allowlisted transient failures;
- GitHub release/push monitoring for tracked repositories;
- HTTP metadata and content-hash drift detection for tracked pages;
- scheduled freshness reports that open review work rather than rewriting canon automatically;
- stale/expired labels based on source-specific cadence;
- a human promotion gate for emerging trends;
- changelog entries for canon changes and traceable source updates.

Failure to fetch a source is recorded separately from evidence that a source changed. Automation never interprets a network error as a content update.

## 9. Error handling

- Invalid content fails builds with file, field, and remediation details.
- Broken internal graph links fail builds.
- External fetch failures produce a report and only fail strict CI after configured retry/age thresholds.
- Live examples are isolated so one component failure cannot crash the entire docs app.
- Missing references render an explicit integrity error in development.
- Motion and interactive components retain a functional no-JavaScript or reduced-capability baseline where appropriate.

## 10. Verification strategy

Completion requires all of the following evidence:

- unit tests for schemas, tokens, utilities, and component state logic;
- interaction and keyboard tests for every interactive component;
- accessibility scans plus targeted manual contracts for APG behaviors;
- visual regression coverage for themes, responsive breakpoints, RTL, Japanese content, high contrast, and reduced motion;
- production build and typecheck for every workspace;
- content graph, source schema, internal link, and freshness-report tests;
- browser QA across primary docs routes and component examples;
- copy/paste smoke tests for published examples;
- a requirement-by-requirement completion audit against this specification.

QA is iterative: audit, rank findings by severity, repair, rerun the full relevant checks, and repeat until no critical or high-severity findings remain and all lower-severity findings are either resolved or explicitly documented as intentional constraints. “No findings” means no unresolved actionable findings under the defined automated and manual audit scope; it does not claim unknowable perfection.

## 11. Migration and compatibility

- Existing README entry points and five skills remain usable throughout migration.
- Existing canonical URLs within the repository are preserved where practical or replaced with explicit redirects/cross-links.
- The first implementation does not publish npm packages or deploy the website.
- Public package APIs are versioned from the start, but remain marked pre-1.0 until the component and motion contracts pass full QA.
- Existing research content is preserved, normalized, and connected to the Atlas instead of discarded.

## 12. Definition of done

The phase is complete only when:

1. the monorepo installs reproducibly and all workspaces build locally;
2. the docs website exposes the canon, components, motion, Reference Atlas, playground, and status surfaces;
3. the component baseline and motion recipes are usable, documented, accessible, and tested;
4. source records and canon rules form a validated bidirectional evidence graph;
5. freshness tooling produces an actionable local report;
6. existing knowledge and skills remain functional;
7. full QA passes with no unresolved critical/high findings;
8. the final audit maps every requirement above to current evidence.
