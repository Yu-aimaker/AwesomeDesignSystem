# Cursor rules for AwesomeDS

Cursor does not load Claude Code plugins. These `.mdc` files carry the same rules in Cursor's Project Rules format.

## Install

From your project root:

```bash
mkdir -p .cursor/rules
PLUGIN=path/to/AwesomeDesignSystem/Plugin/awesome-ds
cp "$PLUGIN"/cursor/*.mdc .cursor/rules/
# Copy the design system so the rules can point at a local file
mkdir -p design-system/awesome-ds && cp -R "$PLUGIN"/ds/. design-system/awesome-ds/
```

If you installed the plugin through the Claude Code marketplace, the plugin folder is under `~/.claude/plugins/` (run `claude plugin list` to see the path).

## What each rule does

| File | Trigger | Body |
|---|---|---|
| `awesome-ds.mdc` | Auto-attached when editing `*.tsx, *.jsx, *.css, *.vue, *.svelte, *.html` (`alwaysApply: false`, `globs` set) | Condensed AwesomeDS rules and token cheat sheet; points to `design-system/awesome-ds/DESIGN.md` |
| `design-verifier.mdc` | Mention `@design-verifier` in chat | Adversarial review procedure and report format |
| `ds-creator.mdc` | Mention `@ds-creator` | One-question-per-turn brand DS interview and outputs |
| `design-thinking.mdc` | Mention `@design-thinking` | Personas, stories, journey map, page flow, recommendations |
| `html-report.mdc` | Mention a report or HTML plan | One-page HTML report. Points at `skills/html-report/SKILL.md` |

Adjust the `design-system/awesome-ds/` path inside `awesome-ds.mdc` if you copied the DS somewhere else. If your project has its own `DESIGN.md`, the rule tells the agent to prefer it.

## Keeping in sync

The `.mdc` files are hand-maintained summaries of the SKILL.md files in `../skills/`. When a skill changes, update the matching `.mdc`. The DS copy is synced with `../scripts/sync-ds.sh`.
