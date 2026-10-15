// STA-6 names one X post. The Knowledge entry must keep the retrieved text, not the old "unread" stub.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const file = join(dirname(fileURLToPath(import.meta.url)), "../Knowledge/skills/neropursue-x-post.md");

test("STA-6 X post is recorded with the eight sites", () => {
  const text = readFileSync(file, "utf8");
  assert.doesNotMatch(text, /本文は未取得/);
  assert.match(text, /https:\/\/x\.com\/neropursue\/status\/2089263766428950683/);
  assert.match(text, /2026-08-17/);
  for (const host of [
    "originkit.dev",
    "orbs.jakubantalik.com",
    "transitions.dev",
    "beautifului.dev",
    "21st.dev",
    "ui.aceternity.com",
    "component.gallery",
    "agentation.com",
  ]) {
    assert.match(text, new RegExp(host.replaceAll(".", "\\.")));
  }
});
