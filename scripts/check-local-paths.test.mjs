// Local machine paths fail the repo check. Run: node --test scripts/check-local-paths.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { findLocalPaths } from "./check-local-paths.mjs";

const rules = (text) => findLocalPaths(text).map((h) => h.rule);

test("agent scratchpads, home folders, sandbox paths, and session folders fail", () => {
  assert.deepEqual(rules('const c = "/tmp/claude-0/-home-user-Repo/scratchpad";'), ["agent-scratchpad"]);
  assert.deepEqual(rules("cp out /home/box/bin/tool"), ["home-folder"]);
  assert.deepEqual(rules("cd /home/user"), ["home-folder"]);
  assert.deepEqual(rules("open ~/home/alice/notes"), ["home-folder"]);
  assert.deepEqual(rules('path: "/home/alice/project/x"'), ["home-folder"]);
  assert.deepEqual(rules("see /Users/alice/Desktop/a.png"), ["home-folder"]);
  assert.deepEqual(rules("output in /workspace/build/out.md"), ["sandbox-workspace"]);
  assert.deepEqual(rules('cache = "/var/cache/12345678-90ab-4cde-8f01-23456789abcd/scratch"'), ["session-path"]);
  assert.deepEqual(rules('dir = "/runs/12345678-90AB-4CDE-8F01-23456789ABCD"'), ["session-path"]);
});

test("URLs, home-relative docs, CI scratch dirs, and bare ids pass", () => {
  assert.deepEqual(rules('src: "https://lawsofux.com/home/social.en.png"'), []);
  assert.deepEqual(rules('"https://github.com/user-attachments/assets/8562a9a5-a1e4-4722-9ec7-47ebccd5901e"'), []);
  assert.deepEqual(rules("cp -r skills/x ~/.claude/skills/x"), []);
  assert.deepEqual(rules("mkdir -p /tmp/growth-data"), []);
  assert.deepEqual(rules('id: "12345678-90ab-4cde-8f01-23456789abcd"'), []);
  assert.deepEqual(rules("example.com/workspace/a"), []);
});

test("one finding per line, with the line number", () => {
  const hits = findLocalPaths("ok\n/home/box/a /tmp/claude-1/b\nok");
  assert.equal(hits.length, 1);
  assert.equal(hits[0].line, 2);
});
