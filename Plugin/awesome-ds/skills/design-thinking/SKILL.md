---
name: design-thinking
description: 'UX design-thinking pass for a feature or product: personas with real constraints, user stories with acceptance criteria, a journey map, a Mermaid page flow with empty/error/loading states, a per-persona UI walk-through of screenshots, and prioritised recommendations mapped to AwesomeDS rules. Use when the user asks for personas, user stories, a journey map, "UX review", "who is this for", information architecture, or before building a new flow.'
argument-hint: "[feature or product] [--personas N]"
allowed-tools: Read, Grep, Glob, Bash(node *), Bash(mkdir *)
---

# design-thinking

Works in any language. If the user writes Japanese, write every output file in Japanese; keep template headings bilingual as they appear in the templates.

Subject: `$ARGUMENTS`. Persona count: `--personas N` if given, otherwise 3 (allowed 2 to 4).

Output folder: `docs/ux/<feature-slug>/`. Create it. Files: `personas.md`, `user-stories.md`, `journey-map.md`, `page-flow.md`, `walkthrough.md` (only when a URL is available), `recommendations.md`, and `README.md` linking them with the goal statement.

Methods reference: `${CLAUDE_PLUGIN_ROOT}/skills/design-thinking/reference/methods.md` (Laws of UX, Nielsen's 10 heuristics, Norman's principles, with the check each one gives you). Read it before step 3.

## 1. Clarify goal and users (assumptions first, questions only when blocked)

1. Read what exists: README, product docs, issue text, existing `docs/ux/`, the DESIGN.md (project's own or `${CLAUDE_PLUGIN_ROOT}/ds/DESIGN.md`), routes (`app/`, `pages/`, `src/routes`), analytics or support notes if present.
2. Write the goal statement: `Goal: <who> can <do what> so that <outcome>, measured by <one metric>.`
3. State assumptions as `Assuming: ...` lines (audience, device mix, frequency of use, language, accessibility needs). Proceed on them.
4. Ask a question only when an assumption would change the whole output (for example, consumer vs internal tool). One question per turn, with options and a recommended answer. Never a list of questions.

## 2. Personas (2 to 4)

Use `${CLAUDE_PLUGIN_ROOT}/skills/design-thinking/templates/persona.md` for each. Rules:

- Each persona has real constraints: device and screen size, network, physical context (commuting, on a call, at a counter), ability (vision, motor, reading level, language), time budget in minutes, frequency of use.
- Personas differ on at least two constraint axes. Three office workers on laptops are one persona.
- Include one persona with an accessibility need or a low-end device unless the audience makes that impossible; say why if you skip it.
- Names are realistic and locale-appropriate. No "John Doe", no "Taro Yamada". No stock-photo descriptions.
- Every persona has a "will abandon when" line. That line drives the journey map pain points.

## 3. User stories

Use `${CLAUDE_PLUGIN_ROOT}/skills/design-thinking/templates/user-story.md`. For each persona, 2 to 5 stories: `As <persona>, I want <action> so that <outcome>.` Each story has 2 to 4 acceptance criteria written as checks (Given / When / Then, or a measurable statement). Criteria must include at least one non-happy path (error, empty, slow, interrupted). Tag each story with the heuristic it protects (from methods.md) and a priority (must, should, could).

## 4. Journey map

Use `${CLAUDE_PLUGIN_ROOT}/skills/design-thinking/templates/journey-map.md`. One map for the primary persona, a shorter one for each other persona when their path differs. Stages: aware, enter, do, verify, leave, return. For each stage: actions, thoughts (quoted, first person), pain points (tied to a constraint from the persona), opportunities (each mapped to a concrete UI change). Mark the moment of highest drop-off risk.

## 5. Page flow

Use `${CLAUDE_PLUGIN_ROOT}/skills/design-thinking/templates/page-flow.md`. A Mermaid `flowchart TD` of routes and states. Required: every route has loading, empty and error states drawn as nodes; every user decision is a diamond; dead ends are marked; back navigation exists for every forward step. Below the diagram, a table: `route | purpose | primary action | states covered | persona who arrives here first`.

## 6. UI walk-through (when a URL or static build exists)

1. Capture: `node ${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/scripts/capture.mjs --urls <urls> --widths 390,1280 --schemes light --out docs/ux/<feature-slug>/shots --states`. If Playwright is not installed, follow `${CLAUDE_PLUGIN_ROOT}/skills/design-verifier/reference/capture-playbook.md`; if it still fails, skip this step and say so in README.md.
2. View each screenshot with Read. For each screen and each persona, write in `walkthrough.md`: what the persona is trying to do here, what they see first (name the element), the friction (tied to the persona's constraints: text size for the low-vision persona, tap target size for the commuter, time-to-primary-action for the time-pressed one), and the heuristic violated.
3. Every friction item gets a screenshot filename and, when code is available, a `file:line`.

## 7. Recommendations

Use an impact × effort table in `recommendations.md`: `# | recommendation | persona(s) served | impact 1-3 | effort 1-3 | score (impact/effort) | AwesomeDS rule | where`. Sort by score. "AwesomeDS rule" names the section of DESIGN.md that the change follows (for example "section 10: hero fits first viewport at 390", "section 8: every data view ships empty state", "section 11: targets 44px mobile"). A recommendation without a rule reference or a location is not allowed.

End with the top three as one line each, and the one metric from the goal statement that each should move.

## Output discipline

- Concrete, checkable. "Improve onboarding" is not allowed; "Move the Create project button into the first viewport at 390 and make it the only primary button" is.
- No filler, no em dashes, no praise.
- Print the file list and the top three recommendations in the chat. Offer once to hand the fix list to `/awesome-ds:awesome-ds` for implementation.
