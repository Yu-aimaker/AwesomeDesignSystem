import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { PRODUCTION_ROUTE, checkProductionRoutes, stripJsonc } from "./check-cf-assets.mjs";

const webRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const wrangler = JSON.parse(stripJsonc(readFileSync(join(webRoot, "wrangler.jsonc"), "utf8")));

function route(patch = {}) {
  return {
    routes: [{ pattern: PRODUCTION_ROUTE.pattern, zone_name: PRODUCTION_ROUTE.zone_name, ...patch }],
  };
}

test("wrangler.jsonc routes use the production pattern and zone", () => {
  assert.deepEqual(checkProductionRoutes(wrangler), []);
  assert.deepEqual(wrangler.routes, [PRODUCTION_ROUTE]);
  assert.equal(wrangler.custom_domain, undefined);
});

test("a different pattern fails", () => {
  const problems = checkProductionRoutes(route({ pattern: "example.com/*" }));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /pattern/);
});

test("a different zone fails", () => {
  const problems = checkProductionRoutes(route({ zone_name: "example.com" }));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /zone_name/);
});

test("custom_domain fails", () => {
  const problems = checkProductionRoutes({
    custom_domain: true,
    ...route({ custom_domain: true }),
  });
  assert.ok(problems.some((line) => /custom_domain/.test(line)));
});

test("missing routes fail", () => {
  const problems = checkProductionRoutes({});
  assert.equal(problems.length, 1);
  assert.match(problems[0], /one Worker Route/);
});
