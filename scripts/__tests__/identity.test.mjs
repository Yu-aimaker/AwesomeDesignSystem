import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { identityProblems, intendedRange } from "../check-identity.mjs";
import { CANONICAL_EMAIL, CANONICAL_NAME, identityEnv } from "../lib/identity.mjs";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const script = join(repoRoot, "scripts/check-identity.mjs");
const setup = join(repoRoot, "scripts/setup-git-identity.sh");

function git(cwd, args, env = process.env) {
  return execFileSync("git", args, { cwd, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function emptyRepo() {
  const cwd = mkdtempSync(join(tmpdir(), "ads-id-"));
  git(cwd, ["init", "-b", "main"]);
  return cwd;
}

function runCheck(cwd, args, env = process.env) {
  try {
    const stdout = execFileSync(process.execPath, [script, ...args], {
      cwd,
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    return { code: 0, stdout, stderr: "" };
  } catch (error) {
    return { code: error.status ?? 1, stdout: String(error.stdout ?? ""), stderr: String(error.stderr ?? "") };
  }
}

test("identity setup is local and idempotent", () => {
  const cwd = emptyRepo();
  const home = mkdtempSync(join(tmpdir(), "ads-home-"));
  const env = { ...process.env, HOME: home, GIT_CONFIG_GLOBAL: join(home, ".gitconfig") };
  try {
    git(cwd, ["config", "--global", "user.email", "other@example.com"], env);
    git(cwd, ["config", "--global", "user.name", "Other"], env);
    execFileSync("bash", [setup], { cwd, env, stdio: "pipe" });
    execFileSync("bash", [setup], { cwd, env, stdio: "pipe" });
    assert.equal(git(cwd, ["config", "--local", "user.name"], env).trim(), CANONICAL_NAME);
    assert.equal(git(cwd, ["config", "--local", "user.email"], env).trim(), CANONICAL_EMAIL);
    assert.equal(git(cwd, ["config", "--global", "user.email"], env).trim(), "other@example.com");
  } finally {
    rmSync(cwd, { recursive: true, force: true });
    rmSync(home, { recursive: true, force: true });
  }
});

test("a compliant range passes and leaks are reported by sha and role only", () => {
  const cwd = emptyRepo();
  try {
    git(cwd, ["commit", "--allow-empty", "-m", "base"], identityEnv());
    const base = git(cwd, ["rev-parse", "HEAD"]).trim();
    git(cwd, ["commit", "--allow-empty", "-m", "one"], identityEnv());
    const authorLeak = identityEnv();
    authorLeak.GIT_AUTHOR_EMAIL = "author-leak@example.com";
    git(cwd, ["commit", "--allow-empty", "-m", "author"], authorLeak);
    const authorSha = git(cwd, ["rev-parse", "HEAD"]).trim();
    git(cwd, ["commit", "--allow-empty", "-m", "two"], identityEnv());
    const committerLeak = identityEnv();
    committerLeak.GIT_COMMITTER_EMAIL = "committer-leak@example.com";
    git(cwd, ["commit", "--allow-empty", "-m", "committer"], committerLeak);
    const committerSha = git(cwd, ["rev-parse", "HEAD"]).trim();
    const head = committerSha;

    const bad = runCheck(cwd, ["--base", base, "--head", head]);
    assert.equal(bad.code, 1);
    assert.match(bad.stderr, new RegExp(`${authorSha} author`));
    assert.match(bad.stderr, new RegExp(`${committerSha} committer`));
    assert.equal(`${bad.stdout}${bad.stderr}`.includes("@"), false);

    git(cwd, ["reset", "--hard", base]);
    git(cwd, ["commit", "--allow-empty", "-m", "ok"], identityEnv());
    const goodHead = git(cwd, ["rev-parse", "HEAD"]).trim();
    const good = runCheck(cwd, ["--base", base, "--head", goodHead]);
    assert.equal(good.code, 0);
    assert.match(good.stdout, /identity: 1 commits/);

    const same = runCheck(cwd, ["--base", goodHead, "--head", goodHead]);
    assert.equal(same.code, 0);
    assert.match(same.stdout, /identity: 0 commits/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("missing base, missing head, and a shallow range fail closed", () => {
  const cwd = emptyRepo();
  const clone = mkdtempSync(join(tmpdir(), "ads-shallow-"));
  try {
    git(cwd, ["commit", "--allow-empty", "-m", "root"], identityEnv());
    const root = git(cwd, ["rev-parse", "HEAD"]).trim();
    git(cwd, ["commit", "--allow-empty", "-m", "next"], identityEnv());
    const head = git(cwd, ["rev-parse", "HEAD"]).trim();
    const missingBase = runCheck(cwd, ["--base", "deadbeefdeadbeefdeadbeefdeadbeefdeadbeef", "--head", head]);
    assert.equal(missingBase.code, 1);
    assert.match(missingBase.stderr, /missing base/);
    assert.equal(missingBase.stderr.includes("@"), false);

    const missingHead = runCheck(cwd, ["--base", root, "--head", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"], {
      ...process.env,
      PR_NUMBER: "4",
    });
    assert.equal(missingHead.code, 1);
    assert.match(missingHead.stderr, /missing head/);
    assert.equal(missingHead.stderr.includes("@"), false);

    execFileSync("git", ["clone", "--depth", "1", "--no-local", cwd, clone], { stdio: "pipe" });
    execFileSync("git", ["remote", "remove", "origin"], { cwd: clone, stdio: "pipe" });
    const shallow = runCheck(clone, ["--base", root, "--head", "HEAD"]);
    assert.equal(shallow.code, 1);
    assert.match(shallow.stderr, /missing base/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
    rmSync(clone, { recursive: true, force: true });
  }
});

test("event ranges are explicit", () => {
  assert.deepEqual(intendedRange({ EVENT_NAME: "pull_request", BASE_SHA: "aaa", HEAD_SHA: "bbb" }), { base: "aaa", head: "bbb" });
  assert.equal(intendedRange({ EVENT_NAME: "pull_request", BASE_SHA: "", HEAD_SHA: "bbb" }).error, "missing base");
  assert.deepEqual(intendedRange({ EVENT_NAME: "push", BEFORE_SHA: "abc", PUSH_SHA: "def" }), { base: "abc", head: "def" });
  assert.equal(intendedRange({ EVENT_NAME: "push", BEFORE_SHA: "0".repeat(40), PUSH_SHA: "def" }).error, "missing base");
  assert.deepEqual(intendedRange({ EVENT_NAME: "workflow_dispatch" }), { base: "origin/main", head: "HEAD" });
  const problems = identityProblems([
    { sha: "abc", authorName: CANONICAL_NAME, authorEmail: CANONICAL_EMAIL, committerName: CANONICAL_NAME, committerEmail: "hidden@example.com" },
  ]);
  assert.deepEqual(problems, [{ sha: "abc", role: "committer" }]);
  assert.equal(JSON.stringify(problems).includes("@"), false);
});
