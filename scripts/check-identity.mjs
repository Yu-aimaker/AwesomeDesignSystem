#!/usr/bin/env node
// Fail when any commit in the event range uses another author or committer.
// Prints the SHA and role only. Never prints the address.
//
// pull_request: base.sha..head.sha (not the synthetic merge commit).
// push: github.event.before..github.sha. A new branch with no before SHA fails closed.
// workflow_dispatch: origin/main..HEAD. An empty range is success.
// Missing objects, a shallow history, or an unreadable fork head fail closed.
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { CANONICAL_EMAIL, CANONICAL_NAME } from "./lib/identity.mjs";

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
    return { base: env.BEFORE_SHA, head: env.PUSH_SHA };
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

export function identityProblems(commits) {
  const problems = [];
  for (const commit of commits) {
    const authorBad = commit.authorName !== CANONICAL_NAME || commit.authorEmail !== CANONICAL_EMAIL;
    const committerBad = commit.committerName !== CANONICAL_NAME || commit.committerEmail !== CANONICAL_EMAIL;
    if (authorBad) problems.push({ sha: commit.sha, role: "author" });
    if (committerBad) problems.push({ sha: commit.sha, role: "committer" });
  }
  return problems;
}

function readCommits(base, head) {
  const raw = git(["log", "--reverse", "--format=%H%x1f%an%x1f%ae%x1f%cn%x1f%ce", `${base}..${head}`], true);
  if (raw === null) return null;
  return raw.split("\n").filter(Boolean).map((line) => {
    const [sha, authorName, authorEmail, committerName, committerEmail] = line.split("\x1f");
    return { sha, authorName, authorEmail, committerName, committerEmail };
  });
}

function shallowMissing(base) {
  const shallow = git(["rev-parse", "--is-shallow-repository"], true);
  return shallow?.trim() === "true" && !objectExists(base);
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
  const headOk = ensureObject(range.head, "head", process.env);
  const baseOk = ensureObject(range.base, "base", process.env);
  if (!baseOk || shallowMissing(range.base)) {
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
  const problems = identityProblems(commits);
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
