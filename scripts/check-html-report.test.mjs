import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkHtmlReport } from "../Plugin/awesome-ds/skills/html-report/scripts/check-report.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const good = `<!DOCTYPE html>
<html lang="ja">
<head><style>
  :root { --canvas: #ffffff; --ink: #0a0a0a; --accent: #2f5bea; }
  body { background: var(--canvas); color: var(--ink); }
</style></head>
<body>
  <main>
    <h1>請求の確認</h1>
    <section class="conclusion">
      <p>未入金は3件です。</p>
      <p>期限を1週間延ばします。</p>
      <p>次は請求書を送ります。</p>
    </section>
    <table><tr><td>3件</td></tr></table>
    <p class="meta">https://example.com/source</p>
  </main>
</body>
</html>`;

describe("html-report contract", () => {
  it("accepts one white report with three conclusion lines and one table", () => {
    const result = checkHtmlReport(good);
    assert.deepEqual(result.errors, []);
    assert.equal(result.ok, true);
  });

  it("rejects a gradient, a short conclusion, and both a table and a figure", () => {
    const bad = good
      .replace("--canvas: #ffffff", "--canvas: #111111")
      .replace("<p>次は請求書を送ります。</p>", "")
      .replace("</table>", "</table><img src=\"x.png\" alt=\"\">")
      .replace("body { background: var(--canvas); color: var(--ink); }", "body { background: linear-gradient(#000,#111); }");
    const result = checkHtmlReport(bad);
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes("--canvas")));
    assert.ok(result.errors.some((e) => e.includes("3 paragraphs")));
    assert.ok(result.errors.some((e) => e.includes("gradient")));
    assert.ok(result.errors.some((e) => e.includes("tables=")));
  });

  it("rejects a Japanese body over 1500 characters", () => {
    const long = good.replace("<table>", `<p>${"あ".repeat(1501)}</p><table>`);
    const result = checkHtmlReport(long);
    assert.equal(result.ok, false);
    assert.ok(result.errors.some((e) => e.includes("1500")));
  });

  it("points the skill at the checker", () => {
    const skill = readFileSync(join(root, "Plugin/awesome-ds/skills/html-report/SKILL.md"), "utf8");
    assert.match(skill, /skills\/html-report\/scripts\/check-report\.mjs/);
  });
});
