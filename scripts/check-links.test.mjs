import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { brokenRelative, checkExternal, isAllowlisted, loadAllowlist } from "./check-links.mjs";

describe("relative links", () => {
  it("flags a missing file and ignores fenced and https links", () => {
    const dir = mkdtempSync(join(tmpdir(), "check-links-"));
    writeFileSync(join(dir, "here.md"), "ok");
    const md = [
      "[ok](here.md)",
      "[missing](nope.md)",
      "[web](https://example.com/a)",
      "```",
      "[skip](not-a-file.md)",
      "```",
    ].join("\n");
    const { checked, broken } = brokenRelative(md, join(dir, "doc.md"), dir);
    assert.equal(checked, 2);
    assert.deepEqual(broken.map((b) => b.href), ["nope.md"]);
  });
});

describe("external allowlist", () => {
  it("loads prefixes and matches only those URLs", () => {
    const entries = loadAllowlist("# note\nhttps://awesomeds.yumaker.studio\n\n");
    assert.equal(isAllowlisted("https://awesomeds.yumaker.studio", entries), true);
    assert.equal(isAllowlisted("https://awesomeds.yumaker.studio/ja", entries), true);
    assert.equal(isAllowlisted("https://example.com/page", entries), false);
  });

  it("retries 503 then accepts 200", async () => {
    const statuses = [503, 200];
    const result = await checkExternal("https://awesomeds.yumaker.studio", {
      delayMs: 0,
      fetchImpl: async () => ({ status: statuses.shift() }),
    });
    assert.equal(result.ok, true);
    assert.equal(statuses.length, 0);
  });

  it("does not retry a 404", async () => {
    let calls = 0;
    const result = await checkExternal("https://awesomeds.yumaker.studio/missing", {
      delayMs: 0,
      fetchImpl: async () => {
        calls++;
        return { status: 404 };
      },
    });
    assert.equal(result.ok, false);
    assert.equal(calls, 1);
  });
});
