import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { identityProblems, intendedRange, isPlatformMerge, unfoldBody } from "../check-identity.mjs";
import { botCommitOk, checkRunRequest, commitRequest, platformMergeOk } from "../lib/provenance.mjs";
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
    assert.match(shallow.stderr, /shallow history/);
    assert.equal(shallow.stderr.includes("@"), false);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
    rmSync(clone, { recursive: true, force: true });
  }
});

test("event ranges are explicit", () => {
  assert.deepEqual(intendedRange({ EVENT_NAME: "pull_request", BASE_SHA: "aaa", HEAD_SHA: "bbb" }), { base: "aaa", head: "bbb" });
  assert.equal(intendedRange({ EVENT_NAME: "pull_request", BASE_SHA: "", HEAD_SHA: "bbb" }).error, "missing base");
  assert.deepEqual(
    intendedRange({ EVENT_NAME: "push", BEFORE_SHA: "abc", PUSH_SHA: "def" }),
    { base: "abc", head: "def", allowPlatformMerge: false },
  );
  assert.equal(
    intendedRange({ EVENT_NAME: "push", BEFORE_SHA: "abc", PUSH_SHA: "def", PUSH_REF: "refs/heads/main" }).allowPlatformMerge,
    true,
  );
  assert.equal(intendedRange({ EVENT_NAME: "push", BEFORE_SHA: "0".repeat(40), PUSH_SHA: "def" }).error, "missing base");
  assert.deepEqual(intendedRange({ EVENT_NAME: "workflow_dispatch" }), { base: "origin/main", head: "HEAD" });
  const problems = identityProblems([
    { sha: "abc", authorName: CANONICAL_NAME, authorEmail: CANONICAL_EMAIL, committerName: CANONICAL_NAME, committerEmail: "hidden@example.com" },
  ]);
  assert.deepEqual(problems, [{ sha: "abc", role: "committer" }]);
  assert.equal(JSON.stringify(problems).includes("@"), false);
  const trailer = identityProblems([{
    sha: "def",
    authorName: CANONICAL_NAME,
    authorEmail: CANONICAL_EMAIL,
    committerName: CANONICAL_NAME,
    committerEmail: CANONICAL_EMAIL,
    body: "Co-authored-by: Person <person@example.com>",
  }]);
  assert.deepEqual(trailer, [{ sha: "def", role: "trailer" }]);
  assert.equal(JSON.stringify(trailer).includes("@"), false);
  const parent = {
    sha: "p",
    parents: 1,
    authorName: CANONICAL_NAME,
    authorEmail: CANONICAL_EMAIL,
    committerName: CANONICAL_NAME,
    committerEmail: CANONICAL_EMAIL,
    body: "",
  };
  const mergeSha = "a".repeat(40);
  const merge = {
    sha: mergeSha,
    parents: 2,
    authorName: "Owner",
    authorEmail: "owner@example.com",
    committerName: "GitHub",
    committerEmail: "noreply@github.com",
    body: "",
    parentCommits: [parent, { ...parent, sha: "q" }],
  };
  const verifiedMerge = {
    sha: mergeSha,
    commit: { verification: { verified: true }, message: "Merge pull request #7" },
    committer: { login: "web-flow" },
    parents: [{ sha: "p" }, { sha: "q" }],
  };
  const mergedPull = [{ merge_commit_sha: mergeSha, base: { ref: "main" }, merged_at: "2026-11-11T00:00:00Z" }];
  const proof = { commit: verifiedMerge, pulls: mergedPull };
  assert.equal(platformMergeOk(verifiedMerge, mergedPull), true);
  assert.equal(isPlatformMerge(merge, merge.parentCommits), false);
  assert.equal(isPlatformMerge(merge, merge.parentCommits, { error: true }), false);
  assert.equal(isPlatformMerge(merge, merge.parentCommits, { commit: verifiedMerge, pulls: [] }), false);
  assert.equal(isPlatformMerge(merge, merge.parentCommits, {
    commit: verifiedMerge,
    pulls: [{ merge_commit_sha: "other", base: { ref: "main" }, merged_at: "2026-11-11T00:00:00Z" }],
  }), false);
  assert.equal(isPlatformMerge(merge, merge.parentCommits, {
    commit: { ...verifiedMerge, commit: { verification: { verified: false }, message: "Merge" } },
    pulls: mergedPull,
  }), false);
  assert.equal(isPlatformMerge(merge, merge.parentCommits, proof), true);
  assert.deepEqual(identityProblems([{ ...merge, provenance: proof }], { allowPlatformMerge: true }), []);
  assert.deepEqual(identityProblems([merge], { allowPlatformMerge: true }), [
    { sha: mergeSha, role: "author" },
    { sha: mergeSha, role: "committer" },
  ]);
  assert.deepEqual(identityProblems([merge]), [{ sha: mergeSha, role: "author" }, { sha: mergeSha, role: "committer" }]);
  assert.equal(isPlatformMerge({ ...merge, parents: 1 }, merge.parentCommits, proof), false);
  assert.equal(isPlatformMerge(merge, [], proof), false);
  assert.equal(isPlatformMerge(merge, [parent, { ...parent, authorEmail: "person@example.com" }], proof), false);
  const botSha = "b".repeat(40);
  const botEmail = "41898282+github-actions[bot]@users.noreply.github.com";
  const weeklyRun = {
    id: 99,
    path: ".github/workflows/weekly-growth.yml",
    event: "schedule",
    head_repository: { full_name: "acme/ads" },
  };
  const receipt = {
    name: "weekly-growth-receipt",
    head_sha: botSha,
    external_id: "99",
    app: { slug: "github-actions" },
  };
  const botCommit = {
    sha: botSha,
    commit: {
      verification: { verified: true },
      message: "knowledge\n",
      author: { email: botEmail },
    },
    committer: { login: "web-flow" },
    parents: [{ sha: "p" }],
  };
  const botProof = { repo: "acme/ads", commit: botCommit, checks: [receipt], run: weeklyRun };
  assert.equal(botCommitOk(botCommit, botProof, "acme/ads"), true);
  assert.equal(botCommitOk(botCommit, botProof, "other/ads"), false);
  assert.equal(botCommitOk(botCommit, { ...botProof, checks: [] }, "acme/ads"), false);
  assert.equal(botCommitOk(botCommit, { ...botProof, checks: [{ ...receipt, app: { slug: "other-app" } }] }, "acme/ads"), false);
  assert.equal(botCommitOk(botCommit, { ...botProof, run: { ...weeklyRun, path: ".github/workflows/check.yml" } }, "acme/ads"), false);
  assert.equal(botCommitOk({
    ...botCommit,
    commit: { ...botCommit.commit, author: { email: "person@example.com" } },
  }, botProof, "acme/ads"), false);
  const botLocal = {
    sha: botSha,
    parents: 1,
    authorName: "github-actions[bot]",
    authorEmail: botEmail,
    committerName: "GitHub",
    committerEmail: "noreply@github.com",
    body: "",
    provenance: botProof,
  };
  assert.deepEqual(identityProblems([botLocal]), []);
  assert.ok(identityProblems([{ ...botLocal, authorEmail: "person@example.com" }]).some((problem) => problem.role === "author"));
  assert.ok(identityProblems([{ ...botLocal, provenance: { ...botProof, checks: [] } }]).some((problem) => problem.role === "author"));
  assert.ok(identityProblems([{
    ...botLocal,
    provenance: { ...botProof, checks: [{ ...receipt, app: { slug: "other-app" } }] },
  }]).some((problem) => problem.role === "author"));
  assert.ok(identityProblems([{
    ...botLocal,
    provenance: { ...botProof, run: { ...weeklyRun, path: ".github/workflows/check.yml" } },
  }]).some((problem) => problem.role === "author"));
  const request = commitRequest({
    message: "knowledge",
    tree: "a".repeat(40),
    parents: ["b".repeat(40)],
  });
  assert.deepEqual(Object.keys(request).sort(), ["message", "parents", "tree"]);
  assert.equal(request.message, "knowledge\n");
  assert.equal(commitRequest({ message: "  ", tree: "a".repeat(40), parents: ["b".repeat(40)] }), null);
  const runRequest = checkRunRequest({ sha: botSha, runId: "99" });
  assert.equal(runRequest.name, "weekly-growth-receipt");
  assert.equal(runRequest.head_sha, botSha);
  assert.equal(runRequest.external_id, "99");
  assert.equal(checkRunRequest({ sha: botSha, runId: "" }), null);
  const folded = unfoldBody("Co-authored-by: Fixture\n <person@example.com>");
  assert.match(folded, /Co-authored-by: Fixture <person@example.com>/);
  const foldedProblem = identityProblems([{
    sha: "fold",
    authorName: CANONICAL_NAME,
    authorEmail: CANONICAL_EMAIL,
    committerName: CANONICAL_NAME,
    committerEmail: CANONICAL_EMAIL,
    body: "CO-AUTHORED-BY: Fixture\n <person@example.com>\nSigned-off-by: Fixture\n <other@example.com>",
  }]);
  assert.deepEqual(foldedProblem, [{ sha: "fold", role: "trailer" }]);
  assert.equal(JSON.stringify(foldedProblem).includes("@"), false);
});

test("commit trailers reject a non-noreply address and keep a noreply trailer", () => {
  const cwd = emptyRepo();
  try {
    git(cwd, ["commit", "--allow-empty", "-m", "base"], identityEnv());
    const base = git(cwd, ["rev-parse", "HEAD"]).trim();
    git(cwd, ["commit", "--allow-empty", "-m", "note", "-m", "Co-authored-by: Person <person@example.com>\nSigned-off-by: Person <other@example.com>"], identityEnv());
    const leaked = git(cwd, ["rev-parse", "HEAD"]).trim();
    const bad = runCheck(cwd, ["--base", base, "--head", leaked]);
    assert.equal(bad.code, 1);
    assert.match(bad.stderr, new RegExp(`${leaked} trailer`));
    assert.equal(`${bad.stdout}${bad.stderr}`.includes("@"), false);

    git(cwd, ["reset", "--hard", base]);
    git(cwd, ["commit", "--allow-empty", "-m", "folded", "-m", "Co-authored-by: Fixture\n <person@example.com>"], identityEnv());
    const foldedSha = git(cwd, ["rev-parse", "HEAD"]).trim();
    const folded = runCheck(cwd, ["--base", base, "--head", foldedSha]);
    assert.equal(folded.code, 1);
    assert.match(folded.stderr, new RegExp(`${foldedSha} trailer`));
    assert.equal(`${folded.stdout}${folded.stderr}`.includes("@"), false);

    git(cwd, ["reset", "--hard", base]);
    git(cwd, ["commit", "--allow-empty", "-m", "note", "-m", `Co-authored-by: ${CANONICAL_NAME} <${CANONICAL_EMAIL}>`], identityEnv());
    const okHead = git(cwd, ["rev-parse", "HEAD"]).trim();
    const good = runCheck(cwd, ["--base", base, "--head", okHead]);
    assert.equal(good.code, 0);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});

test("a shallow range with both ends present still hides nothing", () => {
  const cwd = emptyRepo();
  const clone = mkdtempSync(join(tmpdir(), "ads-gap-"));
  try {
    git(cwd, ["commit", "--allow-empty", "-m", "root"], identityEnv());
    const root = git(cwd, ["rev-parse", "HEAD"]).trim();
    const leaked = identityEnv();
    leaked.GIT_AUTHOR_EMAIL = "middle@example.com";
    git(cwd, ["commit", "--allow-empty", "-m", "middle"], leaked);
    const middle = git(cwd, ["rev-parse", "HEAD"]).trim();
    git(cwd, ["commit", "--allow-empty", "-m", "tip"], identityEnv());
    execFileSync("git", ["clone", "--depth", "1", "--no-local", cwd, clone], { stdio: "pipe" });
    execFileSync("git", ["fetch", "--depth", "1", "origin", root], { cwd: clone, stdio: "pipe" });
    const hidden = runCheck(clone, ["--base", root, "--head", "HEAD"]);
    assert.equal(hidden.code, 1);
    assert.match(hidden.stderr, /shallow history/);
    assert.equal(`${hidden.stdout}${hidden.stderr}`.includes("example.com"), false);

    execFileSync("git", ["fetch", "--unshallow", "origin"], { cwd: clone, stdio: "pipe" });
    const seen = runCheck(clone, ["--base", root, "--head", "HEAD"]);
    assert.equal(seen.code, 1);
    assert.match(seen.stderr, new RegExp(`${middle} author`));
    assert.equal(`${seen.stdout}${seen.stderr}`.includes("@"), false);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
    rmSync(clone, { recursive: true, force: true });
  }
});

test("push to main allows only a platform merge commit", () => {
  const cwd = emptyRepo();
  try {
    git(cwd, ["commit", "--allow-empty", "-m", "base"], identityEnv());
    git(cwd, ["checkout", "-b", "side"]);
    git(cwd, ["commit", "--allow-empty", "-m", "side"], identityEnv());
    git(cwd, ["checkout", "main"]);
    const base = git(cwd, ["rev-parse", "HEAD"]).trim();
    const mergeEnv = identityEnv();
    mergeEnv.GIT_COMMITTER_NAME = "GitHub";
    mergeEnv.GIT_COMMITTER_EMAIL = "noreply@github.com";
    git(cwd, ["merge", "--no-ff", "side", "-m", "Merge pull request #7 from side"], mergeEnv);
    const head = git(cwd, ["rev-parse", "HEAD"]).trim();
    const offline = { ...process.env };
    delete offline.GH_TOKEN;
    delete offline.GITHUB_TOKEN;
    delete offline.PROVENANCE_FIXTURE;
    const pushed = runCheck(cwd, [], {
      ...offline,
      EVENT_NAME: "push",
      BEFORE_SHA: base,
      PUSH_SHA: head,
      PUSH_REF: "refs/heads/main",
    });
    assert.equal(pushed.code, 1);
    assert.match(pushed.stderr, new RegExp(`${head} committer`));

    const fixture = join(cwd, "provenance.json");
    const verified = {
      repo: "acme/ads",
      commits: {
        [head]: {
          sha: head,
          commit: { verification: { verified: true }, message: "Merge pull request #7" },
          committer: { login: "web-flow" },
          parents: [{ sha: base }, { sha: "c".repeat(40) }],
        },
      },
      pulls: {
        [head]: [{ merge_commit_sha: head, base: { ref: "main" }, merged_at: "2026-11-11T00:00:00Z" }],
      },
    };
    writeFileSync(fixture, JSON.stringify(verified));
    const allowed = runCheck(cwd, [], {
      ...offline,
      PROVENANCE_FIXTURE: fixture,
      GITHUB_REPOSITORY: "acme/ads",
      EVENT_NAME: "push",
      BEFORE_SHA: base,
      PUSH_SHA: head,
      PUSH_REF: "refs/heads/main",
    });
    assert.equal(allowed.code, 0, allowed.stderr);
    const stillPr = runCheck(cwd, [], {
      ...offline,
      PROVENANCE_FIXTURE: fixture,
      GITHUB_REPOSITORY: "acme/ads",
      EVENT_NAME: "pull_request",
      BASE_SHA: base,
      HEAD_SHA: head,
    });
    assert.equal(stillPr.code, 1);

    verified.pulls[head] = [];
    writeFileSync(fixture, JSON.stringify(verified));
    const notMerged = runCheck(cwd, [], {
      ...offline,
      PROVENANCE_FIXTURE: fixture,
      EVENT_NAME: "push",
      BEFORE_SHA: base,
      PUSH_SHA: head,
      PUSH_REF: "refs/heads/main",
    });
    assert.equal(notMerged.code, 1);

    verified.commits[head] = { error: true };
    verified.pulls[head] = [{ merge_commit_sha: head, base: { ref: "main" }, merged_at: "2026-11-11T00:00:00Z" }];
    writeFileSync(fixture, JSON.stringify(verified));
    const apiError = runCheck(cwd, [], {
      ...offline,
      PROVENANCE_FIXTURE: fixture,
      EVENT_NAME: "push",
      BEFORE_SHA: base,
      PUSH_SHA: head,
      PUSH_REF: "refs/heads/main",
    });
    assert.equal(apiError.code, 1);

    const asPr = runCheck(cwd, [], {
      ...process.env,
      EVENT_NAME: "pull_request",
      BASE_SHA: base,
      HEAD_SHA: head,
    });
    assert.equal(asPr.code, 1);
    assert.match(asPr.stderr, new RegExp(`${head} committer`));
    assert.equal(`${asPr.stdout}${asPr.stderr}`.includes("@"), false);

    const other = emptyRepo();
    try {
      git(other, ["commit", "--allow-empty", "-m", "base"], identityEnv());
      git(other, ["checkout", "-b", "side"]);
      git(other, ["commit", "--allow-empty", "-m", "side"], identityEnv());
      git(other, ["checkout", "main"]);
      const otherBase = git(other, ["rev-parse", "HEAD"]).trim();
      const forged = identityEnv();
      forged.GIT_AUTHOR_NAME = "Other";
      forged.GIT_AUTHOR_EMAIL = "person@example.com";
      forged.GIT_COMMITTER_NAME = "GitHub";
      forged.GIT_COMMITTER_EMAIL = "noreply@github.com";
      git(other, ["merge", "--no-ff", "side", "-m", "Merge pull request #8 from side"], forged);
      const otherHead = git(other, ["rev-parse", "HEAD"]).trim();
      const offline = { ...process.env };
      delete offline.GH_TOKEN;
      delete offline.GITHUB_TOKEN;
      delete offline.PROVENANCE_FIXTURE;
      const accepted = runCheck(other, [], {
        ...offline,
        EVENT_NAME: "push",
        BEFORE_SHA: otherBase,
        PUSH_SHA: otherHead,
        PUSH_REF: "refs/heads/main",
      });
      assert.equal(accepted.code, 1);
      assert.match(accepted.stderr, new RegExp(`${otherHead} committer`));
      const direct = identityEnv();
      direct.GIT_AUTHOR_EMAIL = "person@example.com";
      direct.GIT_COMMITTER_EMAIL = "person@example.com";
      git(other, ["commit", "--allow-empty", "-m", "direct"], direct);
      const directHead = git(other, ["rev-parse", "HEAD"]).trim();
      const directBad = runCheck(other, [], {
        ...process.env,
        EVENT_NAME: "push",
        BEFORE_SHA: otherHead,
        PUSH_SHA: directHead,
        PUSH_REF: "refs/heads/main",
      });
      assert.equal(directBad.code, 1);
      assert.match(directBad.stderr, new RegExp(`${directHead} author`));
      assert.equal(`${directBad.stdout}${directBad.stderr}`.includes("example.com"), false);

      const tainted = emptyRepo();
      try {
        const gmail = identityEnv();
        gmail.GIT_AUTHOR_EMAIL = "person@example.com";
        gmail.GIT_COMMITTER_EMAIL = "person@example.com";
        git(tainted, ["commit", "--allow-empty", "-m", "gmail-base"], gmail);
        const gmailBase = git(tainted, ["rev-parse", "HEAD"]).trim();
        git(tainted, ["checkout", "-b", "side"]);
        git(tainted, ["commit", "--allow-empty", "-m", "side"], identityEnv());
        git(tainted, ["checkout", "main"]);
        const web = identityEnv();
        web.GIT_AUTHOR_NAME = "Owner";
        web.GIT_AUTHOR_EMAIL = "owner@example.com";
        web.GIT_COMMITTER_NAME = "GitHub";
        web.GIT_COMMITTER_EMAIL = "noreply@github.com";
        git(tainted, ["merge", "--no-ff", "side", "-m", "Merge pull request #9 from side"], web);
        const taintedHead = git(tainted, ["rev-parse", "HEAD"]).trim();
        const taintedPush = runCheck(tainted, [], {
          ...process.env,
          EVENT_NAME: "push",
          BEFORE_SHA: gmailBase,
          PUSH_SHA: taintedHead,
          PUSH_REF: "refs/heads/main",
        });
        assert.equal(taintedPush.code, 1);
        assert.match(taintedPush.stderr, new RegExp(`${taintedHead} committer`));
        assert.equal(`${taintedPush.stdout}${taintedPush.stderr}`.includes("example.com"), false);
      } finally {
        rmSync(tainted, { recursive: true, force: true });
      }
    } finally {
      rmSync(other, { recursive: true, force: true });
    }
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
