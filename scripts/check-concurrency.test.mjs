import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const checkYml = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "..", ".github", "workflows", "check.yml"),
  "utf8",
);

test("Check cancels a superseded pull request run and leaves main queued", () => {
  const block = checkYml.match(/^concurrency:\n(?:  .+\n)+/m);
  assert.ok(block, "check.yml needs a top-level concurrency block");
  const text = block[0];
  assert.match(text, /github\.event\.pull_request\.number/);
  assert.match(text, /github\.ref/);
  assert.match(text, /cancel-in-progress:\s*\$\{\{\s*github\.event_name == 'pull_request'\s*\}\}/);
  assert.doesNotMatch(text, /cancel-in-progress:\s*true\s*$/m);
});
