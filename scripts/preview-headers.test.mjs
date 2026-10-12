import assert from "node:assert/strict";
import test from "node:test";
import { PATHS, checkPreviewHeaders } from "./preview-headers.mjs";

function headers(extra = {}) {
  return {
    "content-type": "text/html; charset=utf-8",
    "x-robots-tag": "noindex, nofollow",
    "strict-transport-security": "max-age=63072000",
    ...extra,
  };
}

function sample(overrides = {}) {
  const probes = Object.fromEntries(PATHS.map((path) => [path, { status: 200, headers: headers() }]));
  for (const [path, patch] of Object.entries(overrides)) {
    probes[path] = {
      ...probes[path],
      ...patch,
      headers: { ...probes[path].headers, ...(patch.headers ?? {}) },
    };
  }
  return { label: "https://preview.example", probes };
}

test("the five preview routes pass when they are 200 HTML with noindex and HSTS", () => {
  assert.deepEqual(checkPreviewHeaders([sample()]), []);
});

test("a missing route that is not the SPA document fails", () => {
  const problems = checkPreviewHeaders([sample({ "/missing-page": { status: 404 } })]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /\/missing-page: status 404/);
});

test("noindex and HSTS are required on /en/sources", () => {
  const problems = checkPreviewHeaders([
    sample({
      "/en/sources": {
        headers: { "x-robots-tag": "nofollow", "strict-transport-security": "max-age=31536000" },
      },
    }),
  ]);
  assert.equal(problems.length, 2);
  assert.match(problems[0], /\/en\/sources: x-robots-tag/);
  assert.match(problems[1], /\/en\/sources: strict-transport-security/);
});
