#!/usr/bin/env node
// Fail when any commit in the event range uses another author or committer,
// or a Co-authored-by / Signed-off-by trailer with a non-noreply email.
// Prints the SHA and role only. Never prints the address.
//
// pull_request: base.sha..head.sha (not the synthetic merge commit). Strict.
// push to main: the same rule, plus one platform merge commit (two parents,
// canonical author, GitHub committer). Other refs stay strict.
// workflow_dispatch: origin/main..HEAD. An empty range is success.
// A shallow repository fails closed until it is unshallowed, even when both
// ends of the range exist. Missing objects or an unreadable fork head fail closed.
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { CANONICAL_EMAIL, CANONICAL_NAME } from "./lib/identity.mjs";

const GITHUB_MERGE_NAME = "GitHub";
const GITHUB_MERGE_EMAIL = "noreply@github.com";
const TRAILER_RE = /^(?:co-authored-by|signed-off-by):[^\n]*$/gim;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? "" : process.argv[index + 1] ?? "";
}

function git(args, allowFail = false) {
  try {
    return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  } catch (error) {
    if (allowFail) return null;
    throw error;
  }
}

export function intendedRange(env) {
  const event = env.EVENT_NAME || "";
  if (event === "pull_request") {
    if (!env.BASE_SHA || !env.HEAD_SHA) return { error: "missing base" };
    return { base: env.BASE_SHA, head: env.HEAD_SHA };
  }
  if (event === "push") {
    if (!env.PUSH_SHA) return { error: "missing head" };
    if (!env.BEFORE_SHA || /^0+$/.test(env.BEFORE_SHA)) return { error: "missing base" };
    return {
      base: env.BEFORE_SHA,
      head: env.PUSH_SHA,
      allowPlatformMerge: env.PUSH_REF === "refs/heads/main",
    };
  }
  if (event === "workflow_dispatch") return { base: "origin/main", head: "HEAD" };
  return { error: "missing base" };
}

function objectExists(rev) {
  return git(["cat-file", "-e", `${rev}^{commit}`], true) !== null;
}

function ensureObject(rev, role, env) {
  if (objectExists(rev)) return true;
  if (rev === "origin/main") git(["fetch", "--no-tags", "origin", "main:refs/remotes/origin/main"], true);
  else if (role === "head" && env.PR_NUMBER && /^[0-9]+$/.test(String(env.PR_NUMBER))) {
    git(["fetch", "--no-tags", "origin", `pull/${env.PR_NUMBER}/head`], true);
  } else if (/^[0-9a-f]{40}$/i.test(rev)) git(["fetch", "--no-tags", "origin", rev], true);
  return objectExists(rev);
}

export function isNoreplyEmail(email) {
  const text = String(email ?? "").trim().toLowerCase();
  return text === GITHUB_MERGE_EMAIL || text.endsWith("@users.noreply.github.com");
}

export function isPlatformMerge(commit) {
  return Number(commit.parents) >= 2
    && commit.authorName === CANONICAL_NAME
    && commit.authorEmail === CANONICAL_EMAIL
    && commit.committerName === GITHUB_MERGE_NAME
    && commit.committerEmail === GITHUB_MERGE_EMAIL;
}

export function identityProblems(commits, options = {}) {
  const problems = [];
  for (const commit of commits) {
    const authorBad = commit.authorName !== CANONICAL_NAME || commit.authorEmail !== CANONICAL_EMAIL;
    const committerBad = commit.committerName !== CANONICAL_NAME || commit.committerEmail !== CANONICAL_EMAIL;
    const platform = options.allowPlatformMerge && isPlatformMerge(commit);
    if (authorBad) problems.push({ sha: commit.sha, role: "author" });
    if (committerBad && !platform) problems.push({ sha: commit.sha, role: "committer" });
    const body = String(commit.body ?? "");
    let trailer = false;
    TRAILER_RE.lastIndex = 0;
    for (const line of body.match(TRAILER_RE) ?? []) {
      EMAIL_RE.lastIndex = 0;
      const emails = line.match(EMAIL_RE) ?? [];
      if (emails.some((email) => !isNoreplyEmail(email))) trailer = true;
    }
    if (trailer) problems.push({ sha: commit.sha, role: "trailer" });
  }
  return problems;
}

function readCommits(base, head) {
  const raw = git(["log", "-z", "--reverse", "--format=%H%x1f%an%x1f%ae%x1f%cn%x1f%ce%x1f%P%x1f%B", `${base}..${head}`], true);
  if (raw === null) return null;
  return raw.split("\0").filter(Boolean).map((record) => {
    const [sha, authorName, authorEmail, committerName, committerEmail, parents, body] = record.split("\x1f");
    return {
      sha,
      authorName,
      authorEmail,
      committerName,
      committerEmail,
      parents: String(parents ?? "").split(" ").filter(Boolean).length,
      body: body ?? "",
    };
  });
}

function isShallow() {
  return git(["rev-parse", "--is-shallow-repository"], true)?.trim() === "true";
}

function main() {
  const cliBase = arg("--base");
  const cliHead = arg("--head");
  const range = cliBase || cliHead
    ? (cliBase && cliHead ? { base: cliBase, head: cliHead } : { error: "missing base" })
    : intendedRange(process.env);
  if (range.error) {
    console.error(`identity: ${range.error}`);
    process.exit(1);
  }
  if (isShallow()) {
    console.error("identity: shallow history");
    process.exit(1);
  }
  const headOk = ensureObject(range.head, "head", process.env);
  const baseOk = ensureObject(range.base, "base", process.env);
  if (!baseOk) {
    console.error("identity: missing base");
    process.exit(1);
  }
  if (!headOk) {
    console.error("identity: missing head");
    process.exit(1);
  }
  const commits = readCommits(range.base, range.head);
  if (commits === null) {
    console.error("identity: missing range");
    process.exit(1);
  }
  const problems = identityProblems(commits, { allowPlatformMerge: range.allowPlatformMerge === true });
  if (!problems.length) {
    console.log(`identity: ${commits.length} commits`);
    process.exit(0);
  }
  console.error("identity: failed");
  for (const problem of problems) console.error(`${problem.sha} ${problem.role}`);
  process.exit(1);
}

const isDirect = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirect) main();
