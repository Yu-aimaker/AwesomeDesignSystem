import { createServer, type RequestListener, type Server } from "node:http";
import { afterEach, describe, expect, test } from "vitest";
import { isActionablePersistentFailure, isPersistentFailure, observeSource, observeTrackedSource, parseGitHubRepository } from "../scripts/lib/source-observation";

const servers: Server[] = [];

afterEach(async () => {
  await Promise.all(servers.splice(0).map((server) => new Promise<void>((resolve) => server.close(() => resolve()))));
});

async function fixture(handler: RequestListener) {
  const server = createServer(handler);
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  if (!address || typeof address === "string") throw new Error("fixture address unavailable");
  return `http://127.0.0.1:${address.port}`;
}

describe("source observation", () => {
  test("classifies normalized content as unchanged and material content as changed", async () => {
    const url = await fixture((_request, response) => {
      response.setHeader("content-type", "text/html");
      response.end("<main>Stable doctrine</main>");
    });
    const first = await observeSource({ id: "ref.test.stable", url }, { retries: 0 });
    expect(first.result).toBe("changed");
    const second = await observeSource({ id: "ref.test.stable", url }, { previousHash: first.contentHash!, retries: 0 });
    expect(second.result).toBe("unchanged");
    const changed = await observeSource({ id: "ref.test.changed", url: url + "/changed" }, { previousHash: "sha256:old", retries: 0 });
    expect(changed.result).toBe("changed");
  });

  test("falls back to GET when HEAD is rejected", async () => {
    const methods: string[] = [];
    const url = await fixture((request, response) => {
      methods.push(request.method ?? "");
      if (request.method === "HEAD") {
        response.statusCode = 405;
        response.end();
        return;
      }
      response.end("available");
    });
    const result = await observeSource({ id: "ref.test.fallback", url }, { retries: 0 });
    expect(result.result).toBe("changed");
    expect(methods).toEqual(["HEAD", "GET"]);
  });

  test("distinguishes persistent fetch failure from source change", async () => {
    const url = await fixture((_request, response) => {
      response.statusCode = 503;
      response.end("temporary");
    });
    const result = await observeSource({ id: "ref.test.failure", url }, { previousHash: "sha256:known", retries: 1, retryDelayMs: 1 });
    expect(result.result).toBe("fetch_failed");
    expect(result.contentHash).toBeUndefined();
    expect(result.attempts).toBe(2);
    expect(result.firstFailedAt).toBeTruthy();
  });

  test("only makes an aged fetch failure strict", () => {
    const now = new Date("2026-07-13T00:00:00Z");
    expect(isPersistentFailure({ result: "fetch_failed", firstFailedAt: "2026-07-12T00:00:00Z" }, 7, now)).toBe(false);
    expect(isPersistentFailure({ result: "fetch_failed", firstFailedAt: "2026-07-01T00:00:00Z" }, 7, now)).toBe(true);
    expect(isPersistentFailure({ result: "changed" }, 7, now)).toBe(false);
    const aged = { sourceId: "ref.test.allowlisted", result: "fetch_failed" as const, firstFailedAt: "2026-07-01T00:00:00Z" };
    expect(isActionablePersistentFailure(aged, new Set(), 7, now)).toBe(true);
    expect(isActionablePersistentFailure(aged, new Set([aged.sourceId]), 7, now)).toBe(false);
  });

  test("observes GitHub repositories by push and release revision", async () => {
    const fetchImpl = async (input: string | URL | Request) => {
      const url = String(input);
      return new Response(JSON.stringify(url.endsWith("/releases/latest")
        ? { tag_name: "v2.0.0", published_at: "2026-07-01T00:00:00Z" }
        : { default_branch: "main", pushed_at: "2026-07-12T00:00:00Z" }), { status: 200 });
    };
    const first = await observeTrackedSource({ id: "ref.test.github", url: "https://github.com/acme/design" }, { fetchImpl });
    expect(first.adapter).toBe("github");
    expect(first.revision).toContain("v2.0.0");
    const second = await observeTrackedSource({ id: "ref.test.github", url: "https://github.com/acme/design" }, { fetchImpl, previousHash: first.contentHash! });
    expect(second.result).toBe("unchanged");
    expect(parseGitHubRepository("https://example.com/acme/design")).toBeNull();
  });

  test("supports an explicit stable landmark policy for volatile pages", async () => {
    let requestCount = 0;
    const url = await fixture((_request, response) => {
      requestCount += 1;
      response.setHeader("content-type", "text/html");
      response.end(`<h1>Design system</h1><p>volatile-${requestCount}</p><a href="/guide">Guide</a>`);
    });
    const first = await observeSource({ id: "ref.test.volatile", url }, { retries: 0, hashMode: "headings-links" });
    const second = await observeSource({ id: "ref.test.volatile", url }, { retries: 0, hashMode: "headings-links", previousHash: first.contentHash! });
    expect(second.result).toBe("unchanged");
  });
});
