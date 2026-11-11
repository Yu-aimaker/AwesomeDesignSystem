#!/usr/bin/env node
// Fail when any commit in the event range uses another author or committer,
// or a Co-authored-by / Signed-off-by trailer with a non-noreply email.
// Prints the SHA and role only. Never prints the address.
//
// pull_request: base.sha..head.sha (not the synthetic merge commit). Strict.
// push to main: the same rule, plus a merge GitHub's API reports as verified,
// committed by web-flow, with two or more parents, whose SHA is the
// merge_commit_sha of a pull request merged into main. Non-merge parents
// still need noreply authors, committers, and trailers. A failed or incomplete
// API response rejects the exception. A weekly commit GitHub signed as
// web-flow is accepted when it has a github-actions check run named
// weekly-growth-receipt, that run's external_id is a run of this
// repository's weekly-growth.yml, and the author email ends with
// @users.noreply.github.com.
// workflow_dispatch: origin/main..HEAD. An empty range is success.
// A shallow repository fails closed until it is unshallowed, even when both
// ends of the range exist. Missing objects or an unreadable fork head fail closed.
import { execFileSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { CANONICAL_EMAIL, CANONICAL_NAME } from "./lib/identity.mjs";
import { readProvenance } from "./lib/github-trust.mjs";
import { botCommitOk, isBotAuthorEmail, platformMergeOk } from "./lib/provenance.mjs";

const GITHUB_MERGE_EMAIL = "noreply@github.com";
const TRAILER_RE = /^(?:co-authored-by|signed-off-by):[^\n]*$/gim;
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

function arg(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? "" : process.argv[index + 1] ?? "";
}

function git(args, allowFail = false, input) {
  try {
    return execFileSync("git", args, { encoding: "utf8", input, stdio: ["pipe", "pipe", "pipe"] });
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

export function unfoldBody(body) {
  const lines = String(body ?? "").replace(/\r\n/g, "\n").split("\n");
  const out = [];
  for (const line of lines) {
    if (/^[ \t]/.test(line) && out.length) out[out.length - 1] += ` ${line.trim()}`;
    else out.push(line);
  }
  return out.join("\n");
}

export function trailerLeak(body) {
  const text = unfoldBody(body);
  TRAILER_RE.lastIndex = 0;
  for (const line of text.match(TRAILER_RE) ?? []) {
    EMAIL_RE.lastIndex = 0;
    const emails = line.match(EMAIL_RE) ?? [];
    if (emails.some((email) => !isNoreplyEmail(email))) return true;
  }
  return false;
}

function parentCount(commit) {
  if (Array.isArray(commit?.parentShas)) return commit.parentShas.length;
  return Number(commit?.parents) || 0;
}

export function passesNoreply(commit) {
  return isNoreplyEmail(commit?.authorEmail) && isNoreplyEmail(commit?.committerEmail) && !trailerLeak(commit?.body);
}

export function isPlatformMerge(commit, parentCommits = [], proof) {
  if (!proof || proof.error || !platformMergeOk(proof.commit, proof.pulls)) return false;
  if (proof.commit.sha !== commit?.sha) return false;
  if (parentCount(commit) < 2 || proof.commit.parents.length !== parentCount(commit)) return false;
  if (!Array.isArray(parentCommits) || parentCommits.length < 2) return false;
  // Parents may themselves be merges. Only an immediate non-merge parent needs noreply.
  const nonMerge = parentCommits.filter((parent) => parentCount(parent) < 2);
  return nonMerge.every((parent) => passesNoreply(parent));
}

function isSignedBotCommit(commit, proof) {
  if (!proof || proof.error) return false;
  if (proof.commit?.sha !== commit?.sha) return false;
  if (!isBotAuthorEmail(commit?.authorEmail)) return false;
  if (!isBotAuthorEmail(proof.commit?.commit?.author?.email)) return false;
  return botCommitOk(proof.commit, proof, proof.repo || process.env.GITHUB_REPOSITORY || "");
}

export function identityProblems(commits, options = {}) {
  const problems = [];
  for (const commit of commits) {
    const parents = commit.parentCommits ?? [];
    const canonical = commit.authorName === CANONICAL_NAME
      && commit.authorEmail === CANONICAL_EMAIL
      && commit.committerName === CANONICAL_NAME
      && commit.committerEmail === CANONICAL_EMAIL;
    const needsProof = !canonical || (options.allowPlatformMerge === true && parentCount(commit) >= 2);
    const proof = commit.provenance ?? (needsProof && options.lookup ? options.lookup(commit.sha) : null);
    const platform = options.allowPlatformMerge === true && isPlatformMerge(commit, parents, proof);
    const signedBot = isSignedBotCommit(commit, proof);
    if (!platform && !signedBot) {
      const authorBad = commit.authorName !== CANONICAL_NAME || commit.authorEmail !== CANONICAL_EMAIL;
      const committerBad = commit.committerName !== CANONICAL_NAME || commit.committerEmail !== CANONICAL_EMAIL;
      if (authorBad) problems.push({ sha: commit.sha, role: "author" });
      if (committerBad) problems.push({ sha: commit.sha, role: "committer" });
    }
    if (trailerLeak(commit.body)) problems.push({ sha: commit.sha, role: "trailer" });
  }
  return problems;
}

function readCommits(base, head) {
  const raw = git(["log", "-z", "--reverse", "--format=%H%x1f%an%x1f%ae%x1f%cn%x1f%ce%x1f%P%x1f%B", `${base}..${head}`], true);
  if (raw === null) return null;
  return raw.split("\0").filter(Boolean).map((record) => {
    const [sha, authorName, authorEmail, committerName, committerEmail, parents, body] = record.split("\x1f");
    const parentShas = String(parents ?? "").split(" ").filter(Boolean);
    return {
      sha,
      authorName,
      authorEmail,
      committerName,
      committerEmail,
      parents: parentShas.length,
      parentShas,
      body: body ?? "",
    };
  });
}

function readOne(sha) {
  const raw = git(["log", "-1", "-z", "--format=%H%x1f%an%x1f%ae%x1f%cn%x1f%ce%x1f%P%x1f%B", sha], true);
  if (!raw) return null;
  const record = raw.split("\0").find(Boolean);
  if (!record) return null;
  const [id, authorName, authorEmail, committerName, committerEmail, parents, body] = record.split("\x1f");
  const parentShas = String(parents ?? "").split(" ").filter(Boolean);
  return {
    sha: id,
    authorName,
    authorEmail,
    committerName,
    committerEmail,
    parents: parentShas.length,
    parentShas,
    body: body ?? "",
  };
}

function attachParents(commits) {
  const known = new Map(commits.map((commit) => [commit.sha, commit]));
  for (const commit of commits) {
    commit.parentCommits = [];
    for (const sha of commit.parentShas ?? []) {
      let parent = known.get(sha);
      if (!parent) {
        parent = readOne(sha);
        if (parent) known.set(sha, parent);
      }
      if (parent) commit.parentCommits.push(parent);
    }
  }
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
  for (const commit of commits) {
    const parsed = git(["interpret-trailers", "--parse"], true, `${commit.body ?? ""}\n`);
    if (parsed) commit.body = `${commit.body ?? ""}\n${parsed}`;
  }
  attachParents(commits);
  const problems = identityProblems(commits, {
    allowPlatformMerge: range.allowPlatformMerge === true,
    lookup: readProvenance,
  });
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
