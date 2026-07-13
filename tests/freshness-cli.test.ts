import { execFile } from "node:child_process";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { afterEach, expect, test } from "vitest";

const execFileAsync = promisify(execFile);
const temporaryDirectories: string[] = [];

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function runFreshness(dataRoot: string): Promise<number> {
  try {
    await execFileAsync("pnpm", ["exec", "tsx", "scripts/check-freshness.mjs", "--strict"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        AWESOME_DS_DATA_ROOT: dataRoot,
        AWESOME_DS_FAILURE_THRESHOLD_DAYS: "7",
        AWESOME_DS_OBSERVATION_RETRIES: "0",
        AWESOME_DS_OBSERVATION_TIMEOUT_MS: "1000",
      },
      timeout: 15_000,
    });
    return 0;
  } catch (error) {
    return typeof error === "object" && error && "code" in error && typeof error.code === "number" ? error.code : -1;
  }
}

test("freshness CLI preserves failure age, applies allowlists, and resets after recovery", async () => {
  let failing = true;
  const server = createServer((_request, response) => {
    response.statusCode = failing ? 503 : 200;
    response.setHeader("content-type", "text/plain");
    response.end(failing ? "temporary failure" : "stable design guidance");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const address = server.address();
    if (!address || typeof address === "string") throw new Error("fixture server did not expose a port");
    const dataRoot = await mkdtemp(path.join(tmpdir(), "awesome-ds-freshness-"));
    temporaryDirectories.push(dataRoot);
    await mkdir(path.join(dataRoot, "content", "references"), { recursive: true });
    await writeFile(path.join(dataRoot, "content", "references", "fixture.json"), JSON.stringify({
      id: "ref.test.cli",
      title: "CLI fixture",
      url: `http://127.0.0.1:${address.port}/guide`,
      owner: "test",
      sourceClass: "implementation",
      region: "global",
      language: "en",
      topics: ["governance"],
      observedDate: "2026-07-01",
      lastVerifiedDate: "2026-07-01",
      reviewCadenceDays: 30,
      freshnessState: "healthy",
      evidenceLevel: "first-party-implementation",
      summary: "A local source used to verify the CLI policy.",
      lessons: ["Persistent failures must retain their original age."],
      caveats: [],
      licenseNote: "Test fixture.",
      antiImitationNote: "Test fixture.",
      linkedRuleIds: [],
      contentHash: "seed-cli",
    }, null, 2));
    await writeFile(path.join(dataRoot, "content", "observation-policy.json"), JSON.stringify({ sources: {}, failureAllowlistSourceIds: [] }));

    expect(await runFreshness(dataRoot)).toBe(0);

    await writeFile(path.join(dataRoot, "reports", "source-observations.json"), JSON.stringify({ observations: [{
      sourceId: "ref.test.cli",
      url: `http://127.0.0.1:${address.port}/guide`,
      observedAt: "2026-07-01T00:00:00.000Z",
      result: "fetch_failed",
      attempts: 1,
      firstFailedAt: "2026-07-01T00:00:00.000Z",
      lastSuccessfulHash: "seed-cli",
    }] }));
    expect(await runFreshness(dataRoot)).toBe(1);

    await writeFile(path.join(dataRoot, "content", "observation-policy.json"), JSON.stringify({ sources: {}, failureAllowlistSourceIds: ["ref.test.cli"] }));
    expect(await runFreshness(dataRoot)).toBe(0);

    failing = false;
    await writeFile(path.join(dataRoot, "content", "observation-policy.json"), JSON.stringify({ sources: {}, failureAllowlistSourceIds: [] }));
    expect(await runFreshness(dataRoot)).toBe(0);
    failing = true;
    expect(await runFreshness(dataRoot)).toBe(0);
    const stored = JSON.parse(await readFile(path.join(dataRoot, "reports", "source-observations.json"), "utf8")) as { observations: Array<{ firstFailedAt?: string }> };
    expect(new Date(stored.observations[0]!.firstFailedAt!).getTime()).toBeGreaterThan(new Date("2026-07-01T00:00:00.000Z").getTime());
  } finally {
    await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  }
}, 30_000);
