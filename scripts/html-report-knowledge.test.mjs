import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const text = readFileSync(new URL("../Knowledge/skills/html-report.md", import.meta.url), "utf8");

test("HTML report knowledge cites the official HTML post and keeps good and bad examples", () => {
  assert.match(text, /https:\/\/claude\.com\/blog\/using-claude-code-the-unreasonable-effectiveness-of-html/);
  assert.match(text, /良い例と悪い例/);
  assert.match(text, /session-report/);
  assert.doesNotMatch(text, /本文は未取得/);
  assert.doesNotMatch(text, /本文はこのセッションでは取得していない/);
});
