import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  BOT_EMAIL,
  checkOgpFile,
  decide,
  diffGuard,
  discoveryStatus,
  filterTopicRepos,
  foreignAuthors,
  isDryRun,
  isPublishPath,
  isTrustedAuthor,
  planDiscoveries,
  publishPlan,
  readJpegSize,
  remoteWrites,
  renderReport,
  settle,
  topicQuery,
  trustFromGithub,
  workflowFindings,
} from "../lib/growth.mjs";
import { BOT_ACTOR, CANONICAL_NAME, GROWTH_STATE, identityEnv } from "../lib/identity.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

function git(cwd, args) {
  return execFileSync("git", ["-c", "user.email=test@example.com", "-c", "user.name=test", ...args], {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function repos(n, stars = 1000) {
  return Array.from({ length: n }, (_, i) => ({
    owner: "acme",
    name: `repo-${i}`,
    url: `https://github.com/acme/repo-${i}`,
    stars,
    category: "component-library",
    fetchedAt: "2026-10-05",
  }));
}

function brands(n) {
  return Array.from({ length: n }, (_, i) => ({ id: `b-${i}` }));
}

const curated = Object.fromEntries(repos(60).map((r) => [`${r.owner}/${r.name}`, "component-library"]));

function pack(list, brandList, extra = {}) {
  return {
    repos: { meta: { updated: "2026-10-05", counts: { total: list.length } }, repos: list },
    brands: { meta: { updated: "2026-10-05", counts: { n: brandList.length } }, brands: brandList },
    candidates: { meta: { updated: "2026-10-05" }, candidates: extra.candidates ?? [] },
    curated,
  };
}

test("topic query requires stars and a recent push, and blocklist drops known noise", () => {
  const q = topicQuery(new Date("2026-10-11T00:00:00Z"));
  assert.match(q, /topic:design-system/);
  assert.match(q, /stars:>500/);
  assert.match(q, /pushed:>2026-07-13/);
  const kept = filterTopicRepos(
    [
      { full_name: "donnemartin/system-design-primer", stargazers_count: 370000 },
      { full_name: "gztchan/awesome-design", stargazers_count: 9000 },
      { full_name: "radix-ui/themes", stargazers_count: 8000 },
    ],
    ["donnemartin/system-design-primer", "gztchan/awesome-design"],
  );
  assert.deepEqual(kept.map((r) => r.full_name), ["radix-ui/themes"]);
});

test("a normal week with only dates and counts changed is quiet", () => {
  const base = pack(repos(60), brands(50));
  const headRepos = repos(60).map((r) => ({ ...r, fetchedAt: "2026-10-12" }));
  const head = pack(headRepos, brands(50));
  head.repos.meta.updated = "2026-10-12";
  head.repos.meta.counts = { total: 60, fetched: 60 };
  const guard = diffGuard({
    base,
    head,
    changedPaths: ["AwesomeDS/data/repos.json"],
    fileBytes: { "AwesomeDS/data/repos.json": 80_000 },
    fetchErrors: [],
  });
  assert.equal(guard.ok, true);
  assert.equal(guard.meaningful, false);
  assert.deepEqual(decide({ guard, dryRun: true, humanAuthors: [] }), {
    action: "noop",
    reason: "no-meaningful-change",
  });
});

test("repos shrunk to 30 fail the guard and do not propose", () => {
  const base = pack(repos(60), brands(50));
  const head = pack(repos(30), brands(50));
  const guard = diffGuard({
    base,
    head,
    changedPaths: ["AwesomeDS/data/repos.json"],
    fileBytes: { "AwesomeDS/data/repos.json": 10_000 },
    fetchErrors: [],
  });
  assert.equal(guard.ok, false);
  assert.ok(guard.reasons.some((r) => /repos/i.test(r)));
  assert.equal(decide({ guard, dryRun: false, humanAuthors: [] }).action, "fail");
});

test("brands dropping by 10 fail the guard", () => {
  const base = pack(repos(60), brands(50));
  const head = pack(repos(60), brands(40));
  const guard = diffGuard({
    base,
    head,
    changedPaths: ["AwesomeDS/data/brands.json"],
    fileBytes: { "AwesomeDS/data/brands.json": 10_000 },
    fetchErrors: [],
  });
  assert.equal(guard.ok, false);
  assert.ok(guard.reasons.some((r) => /brand/i.test(r)));
});

test("a path outside data and a file over 1MB fail the guard", () => {
  const base = pack(repos(60), brands(50));
  const head = pack(repos(60), brands(50));
  const guard = diffGuard({
    base,
    head,
    changedPaths: ["web/src/pages/Home.tsx", "AwesomeDS/data/repos.json"],
    fileBytes: { "web/src/pages/Home.tsx": 100, "AwesomeDS/data/repos.json": 1_000_001 },
    fetchErrors: [],
  });
  assert.equal(guard.ok, false);
  assert.ok(guard.reasons.some((r) => /path/i.test(r)));
  assert.ok(guard.reasons.some((r) => /1MB|size/i.test(r)));
});

test("a curated repo removed or a star count cut in half fails", () => {
  const base = pack(repos(60), brands(50));
  const shrunk = repos(60);
  shrunk[0] = { ...shrunk[0], stars: 400 };
  const head = pack(shrunk, brands(50));
  head.curated = { ...curated };
  delete head.curated["acme/repo-0"];
  const guard = diffGuard({
    base,
    head,
    changedPaths: ["AwesomeDS/data/repos.json", "AwesomeDS/data/sources/curated-repos.json"],
    fileBytes: {},
    fetchErrors: [],
  });
  assert.equal(guard.ok, false);
  assert.ok(guard.reasons.some((r) => /curated/i.test(r)));
  assert.ok(guard.reasons.some((r) => /star/i.test(r)));
});

test("fetchErrors over 10% of curated fail closed", () => {
  const base = pack(repos(60), brands(50));
  const guard = diffGuard({
    base,
    head: pack(repos(60), brands(50)),
    changedPaths: ["AwesomeDS/data/repos.json"],
    fileBytes: {},
    fetchErrors: Array.from({ length: 7 }, (_, i) => `e${i}`),
  });
  assert.equal(guard.ok, false);
  assert.ok(guard.reasons.some((r) => /fetch/i.test(r)));
});

test("dry-run is the default and only an explicit false proposes", () => {
  const base = pack(repos(60), brands(50));
  const head = pack(repos(60), brands(50), {
    candidates: [
      {
        id: "oss:https://github.com/acme/new",
        kind: "oss",
        url: "https://github.com/acme/new",
        title: "new",
        description: null,
        stars: 400,
        firstSeen: "2026-10-11",
        lastSeen: "2026-10-11",
        signals: {},
        status: "new",
        note: "",
      },
    ],
  });
  const guard = diffGuard({
    base,
    head,
    changedPaths: ["AwesomeDS/data/candidates.json"],
    fileBytes: { "AwesomeDS/data/candidates.json": 2000 },
    fetchErrors: [],
  });
  assert.equal(guard.ok, true);
  assert.equal(guard.meaningful, true);
  assert.equal(isDryRun(undefined), true);
  assert.equal(isDryRun("true"), true);
  assert.equal(isDryRun(true), true);
  assert.equal(isDryRun("false"), false);
  assert.equal(decide({ guard, dryRun: undefined, humanAuthors: [] }).action, "dry-run");
  assert.equal(decide({ guard, dryRun: "false", humanAuthors: [] }).action, "propose");
  assert.equal(decide({ guard, dryRun: "false", humanAuthors: ["human@example.com"] }).action, "fail");
});

test("known, rejected, and imageless candidates are not proposed again", () => {
  const previous = [
    {
      id: "oss:https://github.com/acme/nope",
      kind: "oss",
      url: "https://github.com/acme/nope",
      title: "nope",
      description: "x",
      stars: 500,
      firstSeen: "2026-09-01",
      lastSeen: "2026-09-01",
      signals: {},
      status: "rejected",
      note: "off topic",
    },
  ];
  const planned = planDiscoveries({
    today: "2026-10-11",
    previous,
    curatedKeys: ["radix-ui/themes"],
    blocklist: ["donnemartin/system-design-primer"],
    flagshipUrls: ["https://ui.shadcn.com/"],
    ossItems: [
      { full_name: "acme/nope", html_url: "https://github.com/acme/nope", description: "x", stargazers_count: 900, archived: false, license: { spdx_id: "MIT" }, pushed_at: "2026-10-01T00:00:00Z" },
      { full_name: "radix-ui/themes", html_url: "https://github.com/radix-ui/themes", description: "known", stargazers_count: 9000, archived: false, pushed_at: "2026-10-01T00:00:00Z" },
      { full_name: "acme/fresh", html_url: "https://github.com/acme/fresh", description: "tokens", stargazers_count: 450, archived: false, license: { spdx_id: "MIT" }, pushed_at: "2026-10-01T00:00:00Z" },
      { full_name: "acme/tiny", html_url: "https://github.com/acme/tiny", description: "tiny", stargazers_count: 10, archived: false, pushed_at: "2026-10-01T00:00:00Z" },
    ],
    guidelines: [
      { url: "https://ui.shadcn.com/", title: "shadcn", http: 200, ogWidth: 1200, ogHeight: 630 },
      { url: "https://example.com/no-image", title: "bare", http: 200, ogWidth: null, ogHeight: null },
      { url: "https://example.com/logo", title: "logo", http: 200, ogWidth: 200, ogHeight: 200 },
      { url: "https://example.com/dead", title: "dead", http: 404, ogWidth: 1200, ogHeight: 630 },
      { url: "https://good.example/ds", title: "Good DS", http: 200, ogWidth: 1200, ogHeight: 630 },
    ],
    releases: [],
  });
  const ids = planned.candidates.map((c) => c.id);
  assert.equal(ids.filter((id) => id.includes("acme/nope")).length, 1);
  assert.equal(planned.candidates.find((c) => c.id.includes("acme/nope")).status, "rejected");
  assert.equal(planned.candidates.some((c) => c.url.includes("radix-ui/themes")), false);
  assert.equal(planned.candidates.some((c) => c.url.includes("example.com")), false);
  assert.equal(planned.candidates.some((c) => c.url === "https://good.example/ds"), true);
  assert.equal(planned.candidates.some((c) => c.url === "https://github.com/acme/fresh"), true);
  assert.ok(planned.excluded.noOg >= 1);
  assert.ok(planned.excluded.small >= 1);
  const again = planDiscoveries({ ...{
    today: "2026-10-18",
    previous: planned.candidates,
    curatedKeys: ["radix-ui/themes"],
    blocklist: [],
    flagshipUrls: ["https://ui.shadcn.com/"],
    ossItems: [
      { full_name: "acme/fresh", html_url: "https://github.com/acme/fresh", description: "tokens", stargazers_count: 460, archived: false, license: { spdx_id: "MIT" }, pushed_at: "2026-10-10T00:00:00Z" },
    ],
    guidelines: [{ url: "https://good.example/ds", title: "Good DS", http: 200, ogWidth: 1200, ogHeight: 630 }],
    releases: [],
  } });
  assert.equal(again.candidates.filter((c) => c.url === "https://github.com/acme/fresh").length, 1);
  assert.equal(again.candidates.filter((c) => c.status === "new" && c.url === "https://good.example/ds").length, 1);
});

test("jpeg size and ogp file rules", () => {
  const jpeg = Buffer.from([
    0xff, 0xd8,
    0xff, 0xc0, 0x00, 0x11, 0x08, 0x02, 0x76, 0x04, 0xb0,
    0x03, 0x01, 0x11, 0x00, 0x02, 0x11, 0x00, 0x03, 0x11, 0x00,
    0xff, 0xd9,
  ]);
  assert.deepEqual(readJpegSize(jpeg), { width: 1200, height: 630 });
  assert.deepEqual(checkOgpFile({ name: "apple-hig.jpg", referenced: true, exists: true, width: 1200, height: 630, bytes: 20_000 }), []);
  assert.ok(checkOgpFile({ name: "wide.jpg", referenced: true, exists: true, width: 1210, height: 630, bytes: 20_000 }).includes("dimensions"));
  assert.ok(checkOgpFile({ name: "huge.jpg", referenced: true, exists: true, width: 1200, height: 630, bytes: 200 * 1024 + 1 }).includes("size"));
  assert.ok(checkOgpFile({ name: "gone.jpg", referenced: true, exists: false, width: null, height: null, bytes: 0 }).includes("missing"));
});

test("workflows must not push main or call billed agents", () => {
  assert.deepEqual(workflowFindings("name: Check\non: pull_request\n"), []);
  const bad = workflowFindings("run: git push origin HEAD:main\nANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}\nuses: anthropics/claude-code-action@v1\n");
  assert.ok(bad.includes("push-main"));
  assert.ok(bad.includes("ANTHROPIC_API_KEY"));
  assert.ok(bad.includes("claude-code-action"));
  assert.deepEqual(foreignAuthors([BOT_EMAIL, "human@example.com"]), [BOT_EMAIL, "human@example.com"]);
  const trusted = {
    name: CANONICAL_NAME,
    email: BOT_EMAIL,
    committerName: CANONICAL_NAME,
    committerEmail: BOT_EMAIL,
    actor: "anyone",
    state: GROWTH_STATE,
    login: BOT_ACTOR,
  };
  assert.equal(isTrustedAuthor(trusted), true);
  assert.equal(isTrustedAuthor({ ...trusted, login: undefined, association: "OWNER" }), true);
  assert.equal(isTrustedAuthor({ ...trusted, login: undefined, association: "CONTRIBUTOR" }), false);
  assert.equal(isTrustedAuthor({ ...trusted, login: undefined }), false);
  assert.deepEqual(trustFromGithub({ login: BOT_ACTOR }), { login: BOT_ACTOR });
  assert.deepEqual(trustFromGithub({ login: "Yu-aimaker", permission: "admin" }), { login: "Yu-aimaker", association: "OWNER" });
  assert.deepEqual(trustFromGithub({ login: "Yu-aimaker", owner: "Yu-aimaker" }), { login: "Yu-aimaker", association: "OWNER" });
  assert.deepEqual(trustFromGithub({ login: "person", association: "MEMBER" }), { login: "person", association: "MEMBER" });
  assert.deepEqual(trustFromGithub({ login: "person", permission: "maintain" }), { login: "person", association: "MEMBER" });
  assert.deepEqual(trustFromGithub({ login: "person", permission: "read", association: "CONTRIBUTOR", owner: "Yu-aimaker" }), {});
  assert.deepEqual(foreignAuthors([trusted, "human@example.com"]), ["human@example.com"]);
  assert.ok(workflowFindings("runs-on: ubuntu-latest\nrun: git push --force origin HEAD\n").includes("force-push"));
  assert.ok(workflowFindings("runs-on: ubuntu-latest\n").includes("larger-runner"));
  assert.ok(workflowFindings("TOKEN: ${{ secrets.TOKEN }}\n").includes("secrets"));
  assert.deepEqual(workflowFindings("# git push --force\nname: Note\non: pull_request\n"), []);
});

test("collect report files under .growth/ do not fail the diff guard", () => {
  const ignore = readFileSync(join(repoRoot, ".gitignore"), "utf8");
  const yml = readFileSync(join(repoRoot, ".github/workflows/weekly-growth.yml"), "utf8");
  assert.match(ignore, /(^|\n)\.growth\/(\n|$)/);
  for (const name of ["discover.json", "ogp-probe.json", "guard.json", "report.md"]) {
    assert.match(yml, new RegExp(`\\.growth/${name.replace(".", "\\.")}`));
  }

  const cwd = mkdtempSync(join(tmpdir(), "ads-growth-scratch-"));
  try {
    git(cwd, ["init", "-b", "main"]);
    const data = pack(repos(60), brands(50));
    mkdirSync(join(cwd, "AwesomeDS/data/sources"), { recursive: true });
    writeFileSync(join(cwd, "AwesomeDS/data/repos.json"), JSON.stringify(data.repos));
    writeFileSync(join(cwd, "AwesomeDS/data/brands.json"), JSON.stringify(data.brands));
    writeFileSync(join(cwd, "AwesomeDS/data/candidates.json"), JSON.stringify(data.candidates));
    writeFileSync(join(cwd, "AwesomeDS/data/sources/curated-repos.json"), JSON.stringify(data.curated));
    writeFileSync(join(cwd, ".gitignore"), ".growth/\n");
    git(cwd, ["add", "."]);
    git(cwd, ["commit", "-m", "base"]);
    mkdirSync(join(cwd, ".growth"));
    writeFileSync(join(cwd, ".growth/discover.json"), "{}");
    writeFileSync(join(cwd, ".growth/ogp-probe.json"), "{}");
    writeFileSync(join(cwd, ".growth/guard.json"), "{}");
    const output = execFileSync(process.execPath, [join(repoRoot, "scripts/diff-guard.mjs"), "--git", "HEAD"], {
      cwd,
      encoding: "utf8",
    });
    assert.match(output, /"ok": true/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("an untracked file outside data fails the diff guard", () => {
  const cwd = mkdtempSync(join(tmpdir(), "ads-guard-"));
  try {
    git(cwd, ["init", "-b", "main"]);
    const data = pack(repos(60), brands(50));
    mkdirSync(join(cwd, "AwesomeDS/data/sources"), { recursive: true });
    writeFileSync(join(cwd, "AwesomeDS/data/repos.json"), JSON.stringify(data.repos));
    writeFileSync(join(cwd, "AwesomeDS/data/brands.json"), JSON.stringify(data.brands));
    writeFileSync(join(cwd, "AwesomeDS/data/candidates.json"), JSON.stringify(data.candidates));
    writeFileSync(join(cwd, "AwesomeDS/data/sources/curated-repos.json"), JSON.stringify(data.curated));
    git(cwd, ["add", "."]);
    git(cwd, ["commit", "-m", "base"]);
    writeFileSync(join(cwd, "SECRET.md"), "not data");
    let output = "";
    let code = 0;
    try {
      output = execFileSync(process.execPath, [join(repoRoot, "scripts/diff-guard.mjs"), "--git", "HEAD"], {
        cwd,
        encoding: "utf8",
      });
    } catch (error) {
      code = error.status ?? 1;
      output = `${error.stdout ?? ""}${error.stderr ?? ""}`;
    }
    assert.equal(code, 1);
    assert.match(output, /SECRET\.md/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("push to main is judged from workflow on, permissions, and the git push destination", () => {
  const comment = workflowFindings(`
# git push origin HEAD:main
name: Note
on:
  pull_request:
permissions:
  contents: read
jobs:
  n:
    steps:
      - run: |
          # git push origin HEAD:main
          echo ok
`);
  assert.deepEqual(comment, []);

  const explicit = workflowFindings(`
on: workflow_dispatch
jobs:
  p:
    permissions:
      contents: write
    steps:
      - run: git push origin HEAD:refs/heads/main
`);
  assert.ok(explicit.includes("push-main"));

  const bare = workflowFindings(`
on:
  push:
    branches: [main]
permissions:
  contents: write
jobs:
  ship:
    steps:
      - run: git push
`);
  assert.ok(bare.includes("push-main"));

  const checkOnly = workflowFindings(`
on:
  push:
    branches: [main]
jobs:
  repo:
    steps:
      - run: node scripts/validate-data.mjs
`);
  assert.deepEqual(checkOnly, []);

  const bot = workflowFindings(`
on:
  workflow_dispatch:
jobs:
  propose:
    permissions:
      contents: write
    steps:
      - run: git push origin "HEAD:bot/weekly-growth"
`);
  assert.deepEqual(bot, []);
});

test("an existing bot branch is merged forward and a diverged branch is left in place", async () => {
  const { prepareBotBranch } = await import("../lib/bot-branch.mjs");
  const cwd = mkdtempSync(join(tmpdir(), "ads-bot-"));
  try {
    git(cwd, ["init", "-b", "main"]);
    writeFileSync(join(cwd, "human.txt"), "base");
    git(cwd, ["add", "."]);
    git(cwd, ["commit", "-m", "base"]);
    git(cwd, ["branch", "bot/weekly-growth"]);
    git(cwd, ["checkout", "bot/weekly-growth"]);
    writeFileSync(join(cwd, "bot-only.txt"), "old data");
    git(cwd, ["add", "."]);
    git(cwd, ["commit", "-m", "bot data"]);
    const oldBot = git(cwd, ["rev-parse", "HEAD"]).trim();
    git(cwd, ["checkout", "main"]);
    writeFileSync(join(cwd, "human.txt"), "advanced");
    git(cwd, ["add", "."]);
    git(cwd, ["commit", "-m", "human"]);

    const prepared = prepareBotBranch({
      cwd,
      branch: "bot/weekly-growth",
      mainRef: "main",
      remoteRef: "bot/weekly-growth",
      actor: BOT_ACTOR,
      state: GROWTH_STATE,
    });
    assert.equal(prepared.action, "ready");
    assert.equal(prepared.reason, "merged-main");
    assert.equal(git(cwd, ["merge-base", "--is-ancestor", oldBot, "HEAD"]).trim(), "");
    assert.equal(git(cwd, ["show", "HEAD:human.txt"]).trim(), "advanced");
    assert.equal(git(cwd, ["show", "HEAD:bot-only.txt"]).trim(), "old data");

    git(cwd, ["checkout", "--orphan", "stray"]);
    git(cwd, ["rm", "-rf", "."]);
    writeFileSync(join(cwd, "stray.txt"), "unrelated");
    git(cwd, ["add", "stray.txt"]);
    git(cwd, ["commit", "-m", "stray"]);
    const stray = git(cwd, ["rev-parse", "HEAD"]).trim();
    git(cwd, ["checkout", "main"]);
    const diverged = prepareBotBranch({
      cwd,
      branch: "bot/other",
      mainRef: "main",
      remoteRef: "stray",
    });
    assert.deepEqual(diverged, { action: "skip", reason: "diverged" });
    assert.equal(git(cwd, ["rev-parse", "stray"]).trim(), stray);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

const HEAD_SHA = "0123456789abcdef0123456789abcdef01234567";

function trustedAuthor() {
  return {
    name: CANONICAL_NAME,
    email: BOT_EMAIL,
    committerName: CANONICAL_NAME,
    committerEmail: BOT_EMAIL,
    login: BOT_ACTOR,
  };
}

function settleInput(overrides = {}) {
  return {
    event: "workflow_run",
    workflow: "Check",
    repository: "acme/ads",
    expectedRepository: "acme/ads",
    branch: "bot/weekly-growth",
    headSha: HEAD_SHA,
    conclusion: "success",
    pullRequestOpen: true,
    pullRequestHeadSha: HEAD_SHA,
    authors: [trustedAuthor()],
    paths: ["Knowledge/research/oss-candidates.md"],
    ...overrides,
  };
}

test("settle reports an eligible bot pull request and does not merge it", () => {
  const input = settleInput();
  delete input.pullRequestHeadSha;
  const snapshot = JSON.stringify(input);
  const reported = { action: "report", reason: "eligible", headSha: HEAD_SHA };
  assert.deepEqual(settle(input), reported);
  assert.deepEqual(settle(input), reported);
  assert.equal(JSON.stringify(input), snapshot);

  const matched = settleInput();
  assert.deepEqual(settle(matched), reported);
  assert.deepEqual(settle(matched), reported);
  assert.deepEqual(
    settle(settleInput({ paths: ["Reference/REFERENCE.md", "Plugin/awesome-ds/knowledge/research/oss-candidates.md"] })),
    reported,
  );
});

test("settle skips, fails, or closes instead of merging an unsafe pull request", () => {
  assert.deepEqual(settle(settleInput({ event: "push" })), { action: "skip", reason: "event" });
  assert.deepEqual(settle(settleInput({ workflow: "Weekly growth" })), { action: "skip", reason: "workflow" });
  assert.deepEqual(settle(settleInput({ repository: "other/ads" })), { action: "skip", reason: "repository" });
  assert.deepEqual(settle(settleInput({ branch: "main", headSha: "" })), { action: "skip", reason: "branch" });
  assert.deepEqual(settle(settleInput({ branch: "feature/data" })), { action: "skip", reason: "branch" });
  assert.deepEqual(settle(settleInput({ pullRequestOpen: false })), { action: "skip", reason: "no-pull-request" });
  assert.deepEqual(settle(settleInput({ headSha: "" })), { action: "fail", reason: "missing-head-sha" });
  assert.deepEqual(settle(settleInput({ headSha: "   " })), { action: "fail", reason: "missing-head-sha" });
  assert.deepEqual(
    settle(settleInput({ pullRequestHeadSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", conclusion: "failure", paths: ["web/src/App.tsx"] })),
    { action: "skip", reason: "head-moved" },
  );
  assert.deepEqual(
    settle(settleInput({ branchTip: "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb" })),
    { action: "skip", reason: "head-moved" },
  );
  for (const conclusion of ["failure", "cancelled", "skipped", "timed_out", ""]) {
    assert.deepEqual(settle(settleInput({ conclusion })), { action: "skip", reason: "check-retryable" });
  }
  assert.deepEqual(settle(settleInput({ authors: [] })), { action: "close", reason: "author" });
  const leaked = settle(settleInput({ authors: [BOT_EMAIL, "human@example.com"] }));
  assert.equal(leaked.action, "close");
  assert.equal(leaked.reason, "author");
  assert.equal(JSON.stringify(leaked).includes("example.com"), false);
  assert.deepEqual(settle(settleInput({ paths: [] })), { action: "close", reason: "empty-diff" });
  assert.deepEqual(settle(settleInput({ paths: ["AwesomeDS/data/repos.json", "web/src/App.tsx"] })), { action: "close", reason: "path" });
  assert.deepEqual(settle(settleInput({ paths: ["AwesomeDS/data/../../web/App.tsx"] })), { action: "close", reason: "path" });
  assert.equal(isPublishPath("Knowledge/research/oss-candidates.md"), true);
  assert.equal(isPublishPath("AwesomeDS/data/repos.json"), false);
  assert.equal(isPublishPath("web/src/App.tsx"), false);
  assert.equal(isPublishPath("Plugin/awesome-ds/skills/awesome-ds/SKILL.md"), false);
});

test("monday schedule proposes for real and settle only reports the bot pull request", () => {
  const weekly = readFileSync(join(repoRoot, ".github/workflows/weekly-growth.yml"), "utf8");
  const settleYml = readFileSync(join(repoRoot, ".github/workflows/weekly-growth-settle.yml"), "utf8");
  assert.match(weekly, /cron:\s*"30 0 \* \* 1"/);
  assert.match(weekly, /workflow_dispatch:/);
  assert.match(weekly, /default:\s*true/);
  assert.match(weekly, /if \[ "\$EVENT_NAME" = "schedule" \]; then\n\s+dry_run=false/);
  assert.match(weekly, /weekly-growth-decide\.mjs --guard \.growth\/guard\.json --discover \.growth\/discover\.json --dry-run "\$dry_run"/);
  assert.match(weekly, /dry_run == 'false'/);
  assert.match(weekly, /check-publish-paths\.mjs/);
  assert.ok(weekly.includes("rm -rf growth-artifact"));
  assert.ok(weekly.indexOf("rm -rf growth-artifact") < weekly.indexOf("check-publish-paths.mjs"));
  assert.match(weekly, /setup-git-identity\.sh/);
  assert.doesNotMatch(weekly, /--force/);
  assert.doesNotMatch(weekly, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  assert.deepEqual(workflowFindings(weekly), []);
  assert.match(settleYml, /workflows:\s*\["Check"\]/);
  assert.match(settleYml, /head_branch != 'bot\/weekly-growth'/);
  assert.match(settleYml, /run: exit 0/);
  assert.match(settleYml, /weekly-growth-settle\.mjs/);
  assert.match(settleYml, /action == 'report'/);
  assert.match(settleYml, /close: not run/);
  assert.doesNotMatch(settleYml, /gh pr close/);
  assert.doesNotMatch(weekly, /gh pr close/);
  assert.doesNotMatch(settleYml, /gh pr merge/);
  assert.doesNotMatch(settleYml, /--delete/);
  assert.equal(settleYml.includes("HEAD:main"), false);
  assert.doesNotMatch(settleYml, /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
  assert.deepEqual(workflowFindings(settleYml), []);

  const dir = mkdtempSync(join(tmpdir(), "ads-settle-"));
  try {
    const authors = join(dir, "authors.txt");
    const paths = join(dir, "paths.txt");
    const pr = join(dir, "pr.json");
    const output = join(dir, "github-output.txt");
    writeFileSync(authors, JSON.stringify([trustedAuthor()]));
    writeFileSync(paths, "Knowledge/research/oss-candidates.md\0Reference/REFERENCE.md\0");
    writeFileSync(pr, JSON.stringify([{ number: 30, headRefOid: HEAD_SHA }]));
    const settleEnv = {
      ...process.env,
      EVENT_NAME: "workflow_run",
      WORKFLOW_NAME: "Check",
      SOURCE_REPOSITORY: "acme/ads",
      EXPECTED_REPOSITORY: "acme/ads",
      HEAD_BRANCH: "bot/weekly-growth",
      HEAD_SHA,
      CHECK_CONCLUSION: "success",
      AUTHORS_FILE: authors,
      PATHS_FILE: paths,
      PR_FILE: pr,
      GITHUB_OUTPUT: output,
    };
    const merged = execFileSync(process.execPath, [join(repoRoot, "scripts/weekly-growth-settle.mjs")], {
      encoding: "utf8",
      env: settleEnv,
    });
    assert.equal(merged.includes("@"), false);
    assert.deepEqual(JSON.parse(merged), { action: "report", reason: "eligible", headSha: HEAD_SHA });
    const recorded = readFileSync(output, "utf8");
    assert.match(recorded, /action=report/);
    assert.match(recorded, new RegExp(`head_sha=${HEAD_SHA}`));
    assert.match(recorded, /pr_number=30/);

    writeFileSync(pr, "[]");
    writeFileSync(output, "");
    const skipped = execFileSync(process.execPath, [join(repoRoot, "scripts/weekly-growth-settle.mjs")], {
      encoding: "utf8",
      env: { ...settleEnv, PR_FILE: pr, GITHUB_OUTPUT: output },
    });
    assert.deepEqual(JSON.parse(skipped), { action: "skip", reason: "no-pull-request" });

    const openPr = join(dir, "open.json");
    writeFileSync(openPr, JSON.stringify([{ number: 30, headRefOid: HEAD_SHA }]));
    let code = 0;
    let failed = "";
    try {
      failed = execFileSync(process.execPath, [join(repoRoot, "scripts/weekly-growth-settle.mjs")], {
        encoding: "utf8",
        env: { ...settleEnv, HEAD_SHA: "", PR_FILE: openPr, GITHUB_OUTPUT: output },
      });
    } catch (error) {
      code = error.status ?? 1;
      failed = `${error.stdout ?? ""}`;
    }
    assert.equal(code, 1);
    assert.deepEqual(JSON.parse(failed), { action: "fail", reason: "missing-head-sha" });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("Knowledge describes the Monday schedule, not a manual-only workflow", () => {
  const workflow = readFileSync(join(repoRoot, ".github/workflows/weekly-growth.yml"), "utf8");
  const settle = readFileSync(join(repoRoot, ".github/workflows/weekly-growth-settle.yml"), "utf8");
  const entry = readFileSync(join(repoRoot, "Knowledge/research/oss-rankings.md"), "utf8");
  const skill = readFileSync(join(repoRoot, "Plugin/awesome-ds/skills/knowledge-curator/SKILL.md"), "utf8");
  assert.match(workflow, /cron: "30 0 \* \* 1"/);
  assert.match(settle, /bot\/weekly-growth/);
  assert.match(entry, /月曜 09:30 JST/);
  assert.match(entry, /weekly-growth-settle\.yml/);
  assert.doesNotMatch(entry, /定期実行は未設定/);
  assert.match(skill, /Monday 09:30 JST/);
  assert.doesNotMatch(skill, /manual, dry-run by default/);
});

test("dry-run and a partial discovery do not mutate the remote", () => {
  const none = remoteWrites({ action: "noop", dryRun: true, branchAhead: false });
  assert.deepEqual(none, { propose: false, closeStalePr: false, closeFailureIssue: false, notify: false });
  const ahead = remoteWrites({ action: "noop", dryRun: false, branchAhead: true });
  assert.equal(ahead.closeStalePr, false);
  assert.equal(remoteWrites({ action: "propose", dryRun: "false" }).propose, true);
  assert.equal(decide({
    guard: { ok: true, meaningful: true, reasons: [] },
    dryRun: false,
    discovery: { partial: true, fresh: 3 },
  }).action, "fail");
  assert.deepEqual(discoveryStatus({ searches: 5, searchFailures: 5, releaseFailures: 0 }), {
    failed: true,
    partial: true,
    reason: "discovery-unavailable",
  });
  assert.equal(discoveryStatus({ searches: 5, searchFailures: 1, releaseFailures: 0 }).reason, "discovery-partial");
  assert.equal(discoveryStatus({ searches: 5, searchFailures: 0, releaseFailures: 0 }).failed, false);
  assert.equal(publishPlan({ actor: "", remoteExists: false, fastForward: true }).reason, "actor");
  assert.equal(publishPlan({
    actor: BOT_ACTOR,
    remoteExists: true,
    fastForward: false,
    commits: [trustedAuthor()],
  }).reason, "diverged");
  const report = renderReport({
    date: "2026-11-11",
    guard: { meaningful: true, ok: true, reasons: [], stats: { reposBase: 1, reposHead: 1, brandsBase: 1, brandsHead: 1, fetchErrors: 0 } },
    excluded: {},
    newCandidates: [{ kind: "oss", title: "leak@example.com", url: "https://github.com/acme/demo" }],
  });
  assert.equal(report.includes("example.com"), false);
});

function jobBlocks(yml) {
  const start = yml.search(/^jobs:\s*$/m);
  return yml.slice(start).split(/\n(?= {2}[a-z0-9-]+:\n)/).slice(1);
}

test("every workflow job has a short timeout and Check reads contents", () => {
  for (const file of ["check.yml", "weekly-growth.yml", "weekly-growth-settle.yml"]) {
    const yml = readFileSync(join(repoRoot, ".github/workflows", file), "utf8");
    const blocks = jobBlocks(yml);
    assert.ok(blocks.length >= 2, file);
    for (const block of blocks) assert.match(block, /\n {4}timeout-minutes:\s*(?:[1-9]|[12][0-9]|30)\n/);
  }
  const checkYml = readFileSync(join(repoRoot, ".github/workflows/check.yml"), "utf8");
  assert.match(checkYml, /^permissions:\n {2}contents: read\n/m);
  assert.doesNotMatch(checkYml, /actions: write/);
  assert.match(checkYml, /pnpm\/action-setup@[0-9a-f]{40}/);
  const weekly = readFileSync(join(repoRoot, ".github/workflows/weekly-growth.yml"), "utf8");
  assert.match(weekly, /actions: write/);
});

test("a Knowledge proposal passes bot Check and still fails the collection data guard", () => {
  const checkYml = readFileSync(join(repoRoot, ".github/workflows/check.yml"), "utf8");
  const weekly = readFileSync(join(repoRoot, ".github/workflows/weekly-growth.yml"), "utf8");
  const step = checkYml.slice(checkYml.indexOf("Bot publish paths"));
  assert.ok(step.startsWith("Bot publish paths"));
  assert.match(step, /check-publish-paths\.mjs/);
  assert.equal(step.includes("diff-guard.mjs"), false);
  assert.match(weekly, /diff-guard\.mjs --git origin\/main/);

  const cwd = mkdtempSync(join(tmpdir(), "ads-publish-"));
  try {
    execFileSync("git", ["init", "-b", "main"], { cwd, stdio: "pipe" });
    const env = identityEnv();
    mkdirSync(join(cwd, "Knowledge/research"), { recursive: true });
    writeFileSync(join(cwd, "Knowledge/research/oss-candidates.md"), "| url |\n| --- |\n");
    execFileSync("git", ["add", "Knowledge"], { cwd, stdio: "pipe" });
    execFileSync("git", ["commit", "-m", "base"], { cwd, env, stdio: "pipe" });
    writeFileSync(join(cwd, "Knowledge/research/oss-candidates.md"), "| url |\n| --- |\n| https://github.com/acme/demo |\n");
    const publish = execFileSync(process.execPath, [join(repoRoot, "scripts/check-publish-paths.mjs"), "--git", "HEAD"], {
      cwd,
      encoding: "utf8",
    });
    assert.match(publish, /check-publish-paths: 1 paths/);
    let guard = "";
    try {
      execFileSync(process.execPath, [join(repoRoot, "scripts/diff-guard.mjs"), "--git", "HEAD"], { cwd, encoding: "utf8" });
    } catch (error) {
      guard = `${error.stdout ?? ""}${error.stderr ?? ""}`;
      assert.equal(error.status, 1);
    }
    assert.match(guard, /path outside data: Knowledge\/research\/oss-candidates\.md/);
    mkdirSync(join(cwd, "web"), { recursive: true });
    writeFileSync(join(cwd, "web/leak.txt"), "nope");
    try {
      execFileSync(process.execPath, [join(repoRoot, "scripts/check-publish-paths.mjs"), "--git", "HEAD"], { cwd, encoding: "utf8", stdio: "pipe" });
      assert.fail("web path should fail");
    } catch (error) {
      assert.equal(error.status, 1);
      assert.match(String(error.stderr), /web\/leak\.txt/);
    }
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("a second weekly run keeps candidate rows the new discovery omitted", () => {
  const weekly = readFileSync(join(repoRoot, ".github/workflows/weekly-growth.yml"), "utf8");
  assert.ok(weekly.indexOf("--prepare-only") < weekly.indexOf("append-knowledge.mjs"));
  assert.equal(weekly.includes("rm -rf Knowledge"), false);
  const cwd = mkdtempSync(join(tmpdir(), "ads-ledger-"));
  const ledger = [
    "---",
    "title: candidates",
    "---",
    "",
    "| 見た日 | 名前 | URL | 補足 |",
    "|---|---|---|---|",
    "",
  ].join("\n");
  try {
    execFileSync("git", ["init", "-b", "main"], { cwd, stdio: "pipe" });
    const env = identityEnv();
    mkdirSync(join(cwd, "Knowledge/research"), { recursive: true });
    writeFileSync(join(cwd, "Knowledge/research/oss-candidates.md"), ledger);
    writeFileSync(join(cwd, "Knowledge/research/site-candidates.md"), ledger);
    execFileSync("git", ["add", "Knowledge"], { cwd, stdio: "pipe" });
    execFileSync("git", ["commit", "-m", "base"], { cwd, env, stdio: "pipe" });
    execFileSync("git", ["checkout", "-b", "bot/weekly-growth"], { cwd, stdio: "pipe" });
    writeFileSync(join(cwd, "Knowledge/research/oss-candidates.md"), `${ledger}| 2026-11-04 | acme/a | https://github.com/acme/a | MIT |\n`);
    execFileSync("git", ["add", "Knowledge"], { cwd, stdio: "pipe" });
    execFileSync("git", ["commit", "-m", "week A"], { cwd, env, stdio: "pipe" });
    execFileSync("git", ["checkout", "main"], { cwd, stdio: "pipe" });
    execFileSync("git", ["checkout", "bot/weekly-growth"], { cwd, stdio: "pipe" });
    mkdirSync(join(cwd, ".growth"), { recursive: true });
    writeFileSync(join(cwd, ".growth/discover.json"), JSON.stringify({
      fresh: [{ kind: "oss", title: "acme/b", url: "https://github.com/acme/b", stars: 12, license: "MIT" }],
    }));
    execFileSync(process.execPath, [join(repoRoot, "scripts/append-knowledge.mjs"), "--discover", ".growth/discover.json"], { cwd, stdio: "pipe" });
    const text = readFileSync(join(cwd, "Knowledge/research/oss-candidates.md"), "utf8");
    assert.match(text, /https:\/\/github.com\/acme\/a/);
    assert.match(text, /https:\/\/github.com\/acme\/b/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
