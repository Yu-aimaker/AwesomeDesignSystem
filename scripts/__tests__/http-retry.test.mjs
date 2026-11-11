import assert from "node:assert/strict";
import test from "node:test";
import { classifyResponse, githubRequest, waitMs } from "../lib/http-retry.mjs";

function jsonResponse(status, body, headers = {}) {
  return new Response(JSON.stringify(body), { status, headers });
}

test("429 waits for Retry-After and then succeeds", async () => {
  const waits = [];
  let calls = 0;
  const body = await githubRequest("/repos/acme/demo", {
    token: "test-token",
    budgetMs: 10_000,
    now: () => 1_000_000,
    sleep: async (ms) => waits.push(ms),
    fetchImpl: async () => {
      calls += 1;
      if (calls === 1) return jsonResponse(429, { message: "slow down", token: "should-not-leak" }, { "retry-after": "2" });
      return jsonResponse(200, { ok: true });
    },
  });
  assert.deepEqual(body, { ok: true });
  assert.deepEqual(waits, [2000]);
  assert.equal(calls, 2);
});

test("a quota 403 uses the reset header and a permanent 403 does not retry", async () => {
  const decision = classifyResponse({
    status: 403,
    headers: new Headers({ "x-ratelimit-remaining": "0", "x-ratelimit-reset": "100" }),
  });
  assert.equal(decision.kind, "quota");
  const wait = waitMs({
    headers: new Headers({ "retry-after": "0", "x-ratelimit-reset": "120" }),
    attempt: 0,
    now: 100_000,
    budgetLeftMs: 50_000,
  });
  assert.equal(wait.exceeds, false);
  assert.ok(wait.waitMs >= 1);

  let calls = 0;
  await assert.rejects(
    () => githubRequest("/user", {
      budgetMs: 5_000,
      now: () => 0,
      sleep: async () => {},
      fetchImpl: async () => {
        calls += 1;
        return jsonResponse(403, { message: "nope" });
      },
    }),
    (error) => {
      assert.equal(error.status, 403);
      assert.equal(error.message.includes("nope"), false);
      return true;
    },
  );
  assert.equal(calls, 1);
});

test("a wait beyond the budget fails with a clear retry-after and keeps no body", async () => {
  await assert.rejects(
    () => githubRequest("/search", {
      budgetMs: 1_000,
      now: () => 0,
      sleep: async () => {
        throw new Error("slept");
      },
      fetchImpl: async () => jsonResponse(429, { message: "secret-body" }, { "retry-after": "30" }),
    }),
    (error) => {
      assert.match(error.message, /retry after 30s exceeds budget 1s/);
      assert.equal(error.message.includes("secret-body"), false);
      return true;
    },
  );
});

test("401 and 404 are not retried, and a timeout is", async () => {
  let denied = 0;
  await assert.rejects(
    () => githubRequest("/repos/acme/missing", {
      now: () => 0,
      sleep: async () => {},
      fetchImpl: async () => {
        denied += 1;
        return jsonResponse(401, { message: "bad" });
      },
    }),
    (error) => error.status === 401,
  );
  assert.equal(denied, 1);

  let tries = 0;
  const body = await githubRequest("/rate", {
    budgetMs: 10_000,
    now: () => 0,
    sleep: async () => {},
    fetchImpl: async () => {
      tries += 1;
      if (tries === 1) {
        const error = new Error("The operation was aborted due to timeout");
        error.name = "TimeoutError";
        throw error;
      }
      return jsonResponse(200, { ok: true });
    },
  });
  assert.deepEqual(body, { ok: true });
  assert.equal(tries, 2);
});
