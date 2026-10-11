# Claude plugin surfaces

One line each for why this plugin uses a Claude Code surface, or why it does not. STA-101. Checked against the files in this folder on 2026-10-11. Skills added in open PRs are not listed here until they are on `main`.

| Surface | What this plugin does | Why |
|---|---|---|
| Skill `awesome-ds` | Applies tokens and the anti-pattern list when the user asks for UI. | The agent otherwise samples a generic page. The description is the trigger, so no slash command is required. |
| Skill `ds-creator` | Interviews one question at a time and writes a brand DESIGN.md. | A brand DS is a different job from applying the neutral system. Grill stays in this skill (`reference/interview-guide.md`). |
| Skill `design-verifier` | Reviews a URL or files and writes `design-review.md`. | Review is a separate pass from authoring. The skill tells the model it is not the author. |
| Skill `design-thinking` | Writes personas, stories, a journey, and a page flow before UI. | UI without a user and a task repeats a template. |
| Skill `knowledge-curator` | Updates Knowledge and proposes DS changes. `disable-model-invocation: true`. | A weekly research pass must not start because the user mentioned a library in passing. |
| Command | None. | A slash command would repeat the skill description. Add one only when the invocation is a fixed script, not a judgment. |
| Subagent | None as a separate agent file. | `design-verifier` already isolates the review. A second agent file would need its own copy of the rubric. |
| Hook | None. | A PreToolUse hook that blocks raw hex would also block `tokens.css`. The verifier's static audit is the check, and a person runs it. |
| `ds/` copy | `scripts/sync-ds.sh` copies `AwesomeDS/`. | An installed plugin cannot read the repo root. The copy is the copy, not a second source. |

Not in this file: the site pages for anti-slop, reports, and slides. Those are frontend work for Opus (STA-100, STA-102, STA-103).
