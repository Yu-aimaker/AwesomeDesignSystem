# Claude plugin surfaces

One line each for why this plugin uses a Claude Code surface, or why it does not. STA-101. Checked against the files in this folder on 2026-10-12.

| Surface | What this plugin does | Why |
|---|---|---|
| Skill `awesome-ds` | Applies tokens and the anti-pattern list when the user asks for UI. | The agent otherwise samples a generic page. The description is the trigger, so no slash command is required. |
| Skill `ds-creator` | Interviews one question at a time and writes a brand DESIGN.md. | A brand DS is a different job from applying the neutral system. Grill stays in this skill (`reference/interview-guide.md`). |
| Skill `design-verifier` | Reviews a URL or files and writes `design-review.md`. | Review is a separate pass from authoring. The skill tells the model it is not the author. |
| Skill `design-thinking` | Writes personas, stories, a journey, and a page flow before UI. | UI without a user and a task repeats a template. |
| Skill `html-report` | Writes one HTML file: a three-sentence conclusion and one table or figure. | A report is read once. It is not a product UI and not a slide deck. |
| Skill `slides` | Writes one 16:9 HTML file, one claim per slide. | A deck is not a report. pptx only when the user asks for PowerPoint. |
| Skill `knowledge-curator` | Updates Knowledge and proposes DS changes. `disable-model-invocation: true`. | A weekly research pass must not start because the user mentioned a library in passing. |
| Command | None. | A slash command would repeat the skill description. Add one only when the invocation is a fixed script, not a judgment. |
| Subagent `design-reviewer` | Runs `design-verifier` in its own context and returns only the S1/S2 findings. | A review in the context that wrote the UI inherits the author's assumptions. The agent loads the existing skill, so the rubric stays in one place. |
| Hook PostToolUse | After a Write or Edit of a UI file, runs the static audit on that one file and returns S1/S2 findings as `additionalContext`. | The agent fixes a raw hex or a removed focus ring in the same turn instead of at review time. It never blocks, skips token files, `node_modules` and the plugin's own files, and `AWESOME_DS_HOOK=off` turns it off. A PreToolUse block is still not used: it would also stop legitimate token edits. |
| `ds/` copy | `scripts/sync-ds.sh` copies `AwesomeDS/`. | An installed plugin cannot read the repo root. The copy is the copy, not a second source. |
| `knowledge/` copy | `scripts/sync-ds.sh` copies the `Knowledge/` entries. `scripts/build-reference.mjs` writes `knowledge/README.md`. | The agent reads sourced notes instead of searching the web for each library or pattern. CI fails when the copy drifts. |

Not in this file: the site pages for anti-slop, reports, and slides. Those are frontend work for Opus (STA-100, STA-102, STA-103).
