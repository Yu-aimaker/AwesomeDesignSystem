// Tests for Plugin/awesome-ds/hooks/post-edit-audit.mjs. Run: node --test scripts/plugin-hook.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOOK = join(root, "Plugin/awesome-ds/hooks/post-edit-audit.mjs");

function runHook(filePath, env = {}) {
  const stdin = JSON.stringify({ hook_event_name: "PostToolUse", tool_name: "Write", tool_input: { file_path: filePath } });
  return execFileSync(process.execPath, [HOOK], { input: stdin, encoding: "utf8", env: { ...process.env, ...env } });
}

function fixture(name, body) {
  const dir = mkdtempSync(join(tmpdir(), "ads-hook-"));
  const file = join(dir, name);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, body);
  return file;
}

test("raw hex in a component comes back as additionalContext", () => {
  const file = fixture("Button.tsx", 'export const B = () => <button style={{ color: "#ff0000" }}>保存</button>;\n');
  const out = JSON.parse(runHook(file));
  assert.equal(out.hookSpecificOutput.hookEventName, "PostToolUse");
  assert.match(out.hookSpecificOutput.additionalContext, /raw-color/);
});

test("S1 findings (static-audit exit 1) are still reported", () => {
  const file = fixture("page.html", "<html><body><p style=\"font-size:10px\">x</p></body></html>\n");
  const out = JSON.parse(runHook(file));
  assert.match(out.hookSpecificOutput.additionalContext, /S1 (missing-lang|text-under-12)/);
});

test("token files are exempt from the raw-colour rule", () => {
  const file = fixture("tokens.css", ":root { --ds-accent: #2f5bea; }\n");
  assert.equal(runHook(file), "");
});

test("non-UI files and missing files produce no output", () => {
  assert.equal(runHook(fixture("notes.md", "#ff0000\n")), "");
  assert.equal(runHook(join(tmpdir(), "does-not-exist.tsx")), "");
});

test("node_modules is skipped", () => {
  assert.equal(runHook(fixture("node_modules/x/a.css", "a { color: #fff; }\n")), "");
});

test("AWESOME_DS_HOOK=off silences the hook", () => {
  const file = fixture("a.css", "a { color: #fff; }\n");
  assert.equal(runHook(file, { AWESOME_DS_HOOK: "off" }), "");
});

test("bad stdin exits 0 with no output", () => {
  const out = execFileSync(process.execPath, [HOOK], { input: "not json", encoding: "utf8" });
  assert.equal(out, "");
});
