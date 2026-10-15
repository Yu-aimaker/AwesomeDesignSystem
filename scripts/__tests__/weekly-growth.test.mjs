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
  filterTopicRepos,
  foreignAuthors,
  isDryRun,
  planDiscoveries,
  readJpegSize,
  settle,
  topicQuery,
  workflowFindings,
} from "../lib/growth.mjs";

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
  assert.deepEqual(foreignAuthors([BOT_EMAIL, "human@example.com"]), ["human@example.com"]);
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

test("the next run recreates the bot branch from main after main moves", async () => {
  const { recreateBotBranch } = await import("../lib/bot-branch.mjs");
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
    const mainTip = git(cwd, ["rev-parse", "HEAD"]).trim();

    recreateBotBranch({ cwd, branch: "bot/weekly-growth", mainRef: "main" });
    writeFileSync(join(cwd, "data.txt"), "fresh");
    git(cwd, ["add", "data.txt"]);
    git(cwd, ["commit", "-m", "data: weekly"]);

    const parents = git(cwd, ["rev-parse", "HEAD^@"]).trim().split(/\s+/).filter(Boolean);
    assert.deepEqual(parents, [mainTip]);
    assert.equal(git(cwd, ["show", "HEAD:human.txt"]).trim(), "advanced");
    assert.throws(() => git(cwd, ["merge-base", "--is-ancestor", oldBot, "HEAD"]));
    assert.throws(() => git(cwd, ["cat-file", "-e", "HEAD:bot-only.txt"]));
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

const HEAD_SHA = "0123456789abcdef0123456789abcdef01234567";

function settleInput(overrides = {}) {
  return {
    branch: "bot/weekly-growth",
    headSha: HEAD_SHA,
    conclusion: "success",
    pullRequestOpen: true,
    pullRequestHeadSha: HEAD_SHA,
    authors: [BOT_EMAIL],
    paths: ["AwesomeDS/data/repos.json"],
    ...overrides,
  };
}

test("settle merges only a green bot pull request and repeats that action", () => {
  const input = settleInput();
  delete input.pullRequestHeadSha;
  const snapshot = JSON.stringify(input);
  const merged = { action: "merge", reason: "check-green", headSha: HEAD_SHA };
  assert.deepEqual(settle(input), merged);
  assert.deepEqual(settle(input), merged);
  assert.equal(JSON.stringify(input), snapshot);

  const matched = settleInput();
  const first = settle(matched);
  const second = settle(matched);
  assert.deepEqual(first, merged);
  assert.deepEqual(second, merged);
  assert.deepEqual(
    settle(settleInput({ paths: ["Plugin/awesome-ds/ds/data/repos.json", "AwesomeDS/data/brands.json"] })),
    merged,
  );
});

test("settle skips, fails, or closes instead of merging an unsafe pull request", () => {
  assert.deepEqual(settle(settleInput({ branch: "main", headSha: "" })), { action: "skip", reason: "branch" });
  assert.deepEqual(settle(settleInput({ branch: "feature/data" })), { action: "skip", reason: "branch" });
  assert.deepEqual(settle(settleInput({ pullRequestOpen: false })), { action: "skip", reason: "no-pull-request" });
  assert.deepEqual(settle(settleInput({ headSha: "" })), { action: "fail", reason: "missing-head-sha" });
  assert.deepEqual(settle(settleInput({ headSha: "   " })), { action: "fail", reason: "missing-head-sha" });
  assert.deepEqual(
    settle(settleInput({ pullRequestHeadSha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", conclusion: "failure", paths: ["web/src/App.tsx"] })),
    { action: "skip", reason: "head-moved" },
  );
  for (const conclusion of ["failure", "cancelled", "skipped", "timed_out", ""]) {
    assert.deepEqual(settle(settleInput({ conclusion })), { action: "close", reason: "check" });
  }
  assert.deepEqual(settle(settleInput({ authors: [] })), { action: "close", reason: "author" });
  assert.deepEqual(settle(settleInput({ authors: [BOT_EMAIL, "human@example.com"] })), { action: "close", reason: "author" });
  assert.deepEqual(settle(settleInput({ paths: [] })), { action: "close", reason: "empty-diff" });
  assert.deepEqual(settle(settleInput({ paths: ["AwesomeDS/data/repos.json", "web/src/App.tsx"] })), { action: "close", reason: "path" });
  assert.deepEqual(settle(settleInput({ paths: ["AwesomeDS/data/../../web/App.tsx"] })), { action: "close", reason: "path" });
});

test("monday schedule proposes for real and settle merges or closes only the bot pull request", () => {
  const weekly = readFileSync(join(repoRoot, ".github/workflows/weekly-growth.yml"), "utf8");
  const settleYml = readFileSync(join(repoRoot, ".github/workflows/weekly-growth-settle.yml"), "utf8");
  assert.match(weekly, /cron:\s*"30 0 \* \* 1"/);
  assert.match(weekly, /workflow_dispatch:/);
  assert.match(weekly, /default:\s*true/);
  assert.match(weekly, /if \[ "\$EVENT_NAME" = "schedule" \]; then\n\s+dry_run=false/);
  assert.match(weekly, /weekly-growth-decide\.mjs --guard \.growth\/guard\.json --dry-run "\$dry_run"/);
  assert.deepEqual(workflowFindings(weekly), []);
  assert.match(settleYml, /workflows:\s*\["Check"\]/);
  assert.match(settleYml, /head_branch != 'bot\/weekly-growth'/);
  assert.match(settleYml, /run: exit 0/);
  assert.match(settleYml, /weekly-growth-settle\.mjs/);
  assert.match(settleYml, /gh pr merge[^\n]*--squash[^\n]*--delete-branch[^\n]*--match-head-commit/);
  assert.match(settleYml, /gh pr close/);
  assert.match(settleYml, /git push origin --delete bot\/weekly-growth/);
  assert.equal(settleYml.includes("HEAD:main"), false);
  assert.deepEqual(workflowFindings(settleYml), []);

  const dir = mkdtempSync(join(tmpdir(), "ads-settle-"));
  try {
    const authors = join(dir, "authors.txt");
    const paths = join(dir, "paths.txt");
    const pr = join(dir, "pr.json");
    const output = join(dir, "github-output.txt");
    writeFileSync(authors, `${BOT_EMAIL}\n`);
    writeFileSync(paths, "AwesomeDS/data/repos.json\0Plugin/awesome-ds/ds/data/repos.json\0");
    writeFileSync(pr, JSON.stringify([{ number: 30, headRefOid: HEAD_SHA }]));
    const merged = execFileSync(process.execPath, [join(repoRoot, "scripts/weekly-growth-settle.mjs")], {
      encoding: "utf8",
      env: {
        ...process.env,
        HEAD_BRANCH: "bot/weekly-growth",
        HEAD_SHA,
        CHECK_CONCLUSION: "success",
        AUTHORS_FILE: authors,
        PATHS_FILE: paths,
        PR_FILE: pr,
        GITHUB_OUTPUT: output,
      },
    });
    assert.deepEqual(JSON.parse(merged), { action: "merge", reason: "check-green", headSha: HEAD_SHA });
    const recorded = readFileSync(output, "utf8");
    assert.match(recorded, /action=merge/);
    assert.match(recorded, new RegExp(`head_sha=${HEAD_SHA}`));
    assert.match(recorded, /pr_number=30/);

    writeFileSync(pr, "[]");
    writeFileSync(output, "");
    const skipped = execFileSync(process.execPath, [join(repoRoot, "scripts/weekly-growth-settle.mjs")], {
      encoding: "utf8",
      env: {
        ...process.env,
        HEAD_BRANCH: "bot/weekly-growth",
        HEAD_SHA,
        CHECK_CONCLUSION: "success",
        AUTHORS_FILE: authors,
        PATHS_FILE: paths,
        PR_FILE: pr,
        GITHUB_OUTPUT: output,
      },
    });
    assert.deepEqual(JSON.parse(skipped), { action: "skip", reason: "no-pull-request" });

    const openPr = join(dir, "open.json");
    writeFileSync(openPr, JSON.stringify([{ number: 30, headRefOid: HEAD_SHA }]));
    let code = 0;
    let failed = "";
    try {
      failed = execFileSync(process.execPath, [join(repoRoot, "scripts/weekly-growth-settle.mjs")], {
        encoding: "utf8",
        env: {
          ...process.env,
          HEAD_BRANCH: "bot/weekly-growth",
          HEAD_SHA: "",
          CHECK_CONCLUSION: "success",
          AUTHORS_FILE: authors,
          PATHS_FILE: paths,
          PR_FILE: openPr,
          GITHUB_OUTPUT: output,
        },
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
