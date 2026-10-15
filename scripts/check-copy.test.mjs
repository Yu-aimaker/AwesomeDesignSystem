import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { findingsInMessages, findingsInSource, isCounterexampleKey } from "./check-copy.mjs";

describe("check-copy", () => {
  it("flags tells on ordinary keys and skips bad or before keys", () => {
    const source = [
      'label: "保存しました"',
      'badBody: "革新的でシームレスな体験を実現することができます。"',
      'before: "次世代 — 注目！"',
      'lead: "送ることができます。"',
      'title: "Unleash the seamless flow!"',
      'note: "「ことができます」は空です。「シームレス」も禁止です。"',
    ].join("\n");
    const rules = findingsInSource(source).map((f) => `${f.key}:${f.rule}`);
    assert.deepEqual(rules.sort(), [
      "lead:empty-ability",
      "title:exclamation",
      "title:forbidden-en",
    ]);
  });

  it("treats bad and before as counterexample keys", () => {
    assert.equal(isCounterexampleKey("badTitle"), true);
    assert.equal(isCounterexampleKey("heroBadBody"), true);
    assert.equal(isCounterexampleKey("before"), true);
    assert.equal(isCounterexampleKey("lead"), false);
    assert.equal(isCounterexampleKey("badge"), false);
  });

  it("finds no tells in the UI catalog", () => {
    const findings = findingsInMessages();
    assert.deepEqual(findings, []);
  });
});
