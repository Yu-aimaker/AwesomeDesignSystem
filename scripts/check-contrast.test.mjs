import { spawnSync } from "node:child_process";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { contrast } from "../AwesomeDS/tokens/scripts/check-contrast.mjs";

// WCAG 2.2 1.4.3 Contrast (Minimum): body text 4.5:1.
// https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
const TEXT_MIN = 4.5;

describe("contrast ratio", () => {
  it("passes ink on canvas and fails a gray that is under 4.5:1", () => {
    assert.ok(contrast("#0a0a0a", "#ffffff") >= TEXT_MIN);
    assert.ok(contrast("#777777", "#ffffff") < TEXT_MIN);
  });
});

describe("token audit", () => {
  it("exits 0 for the committed light, dark, chart, and accent tokens", () => {
    const result = spawnSync(process.execPath, ["AwesomeDS/tokens/scripts/check-contrast.mjs"], {
      encoding: "utf8",
    });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /0 fail/);
  });
});
