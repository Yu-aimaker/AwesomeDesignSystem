import assert from "node:assert/strict";
import test from "node:test";
import { checkSamples, parseOrigins } from "./hosting-smoke.mjs";

function headers(extra = {}) {
  return {
    "content-type": "text/html; charset=utf-8",
    "x-robots-tag": "noindex, nofollow",
    "strict-transport-security": "max-age=63072000",
    server: "Vercel",
    ...extra,
  };
}

function sample(label, overrides = {}) {
  const probes = {
    "/": { status: 200, headers: headers() },
    "/foo/bar?x=1": { status: 200, headers: headers() },
    "/og-image.png": { status: 200, headers: headers({ "content-type": "image/png" }) },
  };
  for (const [path, patch] of Object.entries(overrides)) {
    probes[path] = {
      ...probes[path],
      ...patch,
      headers: { ...probes[path].headers, ...(patch.headers ?? {}) },
    };
  }
  return { label, probes };
}

test("a host that matches the contract passes", () => {
  assert.deepEqual(checkSamples([sample("https://prod.example")]), []);
});

test("header names and directive order do not matter", () => {
  const host = sample("https://prod.example", {
    "/": {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "X-Robots-Tag": "nofollow, noindex",
        "Strict-Transport-Security": "max-age=63072000",
      },
    },
  });
  assert.deepEqual(checkSamples([host]), []);
});

test("missing noindex fails", () => {
  const host = sample("https://prod.example", {
    "/": { headers: { "x-robots-tag": "nofollow" } },
  });
  const problems = checkSamples([host]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /x-robots-tag/);
});

test("HSTS without the Vercel max-age fails", () => {
  const host = sample("https://prod.example", {
    "/foo/bar?x=1": { headers: { "strict-transport-security": "max-age=31536000" } },
  });
  const problems = checkSamples([host]);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /SPA fallback|\/foo\/bar/);
  assert.match(problems[0], /strict-transport-security/);
});

test("SPA fallback must be 200 HTML", () => {
  const missing = sample("https://prod.example", { "/foo/bar?x=1": { status: 404 } });
  const notHtml = sample("https://prod.example", {
    "/foo/bar?x=1": { headers: { "content-type": "text/plain" } },
  });
  assert.match(checkSamples([missing])[0], /status 404/);
  assert.match(checkSamples([notHtml])[0], /SPA fallback/);
});

test("og-image must be 200 image/png", () => {
  const missing = sample("https://prod.example", { "/og-image.png": { status: 404 } });
  const wrongType = sample("https://prod.example", {
    "/og-image.png": { headers: { "content-type": "image/jpeg" } },
  });
  assert.match(checkSamples([missing])[0], /og-image\.png: status 404/);
  assert.match(checkSamples([wrongType])[0], /og-image content-type image\/jpeg/);
});

test("two hosts can differ on server and still match", () => {
  const prod = sample("https://prod.example");
  const preview = sample("https://preview.example", {
    "/": { headers: { server: "cloudflare" } },
    "/foo/bar?x=1": { headers: { server: "cloudflare", "cache-control": "public, max-age=0" } },
    "/og-image.png": { headers: { server: "cloudflare", "content-type": "image/png" } },
  });
  assert.deepEqual(checkSamples([prod, preview]), []);
});

test("status and contract headers are compared across URLs", () => {
  const prod = sample("https://prod.example");
  const preview = sample("https://preview.example", {
    "/og-image.png": { status: 404, headers: { "content-type": "text/plain" } },
  });
  const problems = checkSamples([prod, preview]);
  assert.ok(problems.some((line) => line.startsWith("diff ") && line.includes("status 200 vs 404")));
  assert.ok(problems.some((line) => line.includes("og-image")));
});

test("parseOrigins accepts origins and rejects paths", () => {
  assert.deepEqual(parseOrigins(["https://awesomeds.yumaker.studio"]), ["https://awesomeds.yumaker.studio"]);
  assert.throws(() => parseOrigins(["https://awesomeds.yumaker.studio/sources"]), /origin only/);
  assert.throws(() => parseOrigins([]), /at least one URL/);
});
