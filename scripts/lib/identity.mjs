// Canonical author and committer for every commit in this repository.
// Workflows, local tooling, and CI all use this pair. Do not print it from logs.

export const CANONICAL_NAME = "Yu-aimaker";
export const CANONICAL_EMAIL = "200000358+Yu-aimaker@users.noreply.github.com";

// Schedule runs are attributed to this GitHub Actions actor. A matching
// email without this actor is not enough to treat a commit as the weekly bot.
export const BOT_ACTOR = "github-actions[bot]";
export const GROWTH_STATE = "weekly-growth";

export function identityEnv(base = process.env) {
  return {
    ...base,
    GIT_AUTHOR_NAME: CANONICAL_NAME,
    GIT_AUTHOR_EMAIL: CANONICAL_EMAIL,
    GIT_COMMITTER_NAME: CANONICAL_NAME,
    GIT_COMMITTER_EMAIL: CANONICAL_EMAIL,
  };
}
