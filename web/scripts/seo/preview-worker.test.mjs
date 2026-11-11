import assert from "node:assert/strict";
import test from "node:test";
import worker from "../preview-spa-fallback.js";

const STATIC = ["/", "/sites", "/knowledge", "/robots.txt"];

test("preview worker sets noindex on existing static routes", async () => {
  for (const path of STATIC) {
    const response = await worker.fetch(new Request(`https://preview.example${path}`), {
      ASSETS: {
        async fetch() {
          return new Response(path.endsWith(".txt") ? "User-agent: Googlebot\nAllow: /\n" : "<html></html>", {
            status: 200,
            headers: { "content-type": path.endsWith(".txt") ? "text/plain" : "text/html" },
          });
        },
      },
    });
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow", path);
    assert.equal(response.status, 200, path);
  }
});
