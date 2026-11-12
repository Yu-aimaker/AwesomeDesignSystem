#!/usr/bin/env node
// Fast-forward bot/weekly-growth through the Git data API.
// GitHub signs that commit. A local git commit is never pushed.
import { appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { prepareBotBranch } from "./lib/bot-branch.mjs";
import { publishSignedCommit } from "./lib/github-commit.mjs";
import { authorFromLog, publishPlan } from "./lib/growth.mjs";
import { lookupCommitTrust } from "./lib/github-trust.mjs";
import { GROWTH_STATE } from "./lib/identity.mjs";

function arg(name, fallback = "") {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

function git(args) {
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function record(action, reason, extra = "") {
  const output = process.env.GITHUB_OUTPUT;
  if (output) appendFileSync(output, `action=${action}\nreason=${reason}\n${extra}`);
  console.log(`publish-bot-branch: ${action} ${reason}`);
}

const branch = arg("--branch", "bot/weekly-growth");
const mainRef = arg("--from", "origin/main");
const remoteRef = arg("--remote", `origin/${branch}`);
const message = arg("--message", "knowledge: 週次候補");
const actor = process.env.GROWTH_ACTOR || "";
const state = process.env.GROWTH_STATE || GROWTH_STATE;

if (process.argv.includes("--prepare-only")) {
  const prepared = prepareBotBranch({ cwd: process.cwd(), branch, mainRef, remoteRef, actor, state });
  record(prepared.action, prepared.reason);
  process.exit(0);
}

let remoteOk = false;
try {
  execFileSync("git", ["rev-parse", "--verify", "--quiet", remoteRef], { stdio: "pipe" });
  remoteOk = true;
} catch {
  remoteOk = false;
}
// Only commits already on the remote can have a GitHub signature.
const log = remoteOk
  ? git(["log", "--format=%H%x1f%an%x1f%ae%x1f%cn%x1f%ce%x1f%B%x1e", `${mainRef}..${remoteRef}`])
  : "";
const commits = log.split("\x1e").map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
  const [sha, authorName, authorEmail, committerName, committerEmail, body] = chunk.split("\x1f");
  const parsed = authorFromLog({ authorName, authorEmail, committerName, committerEmail, body });
  return { ...parsed, provenance: lookupCommitTrust(sha) };
});
const plan = publishPlan({
  actor,
  remoteExists: remoteOk,
  fastForward: true,
  commits,
});
if (plan.action !== "ready") {
  record(plan.action, plan.reason, "committed=false\n");
  process.exit(plan.reason === "provenance-unavailable" ? 1 : 0);
}
const staged = git(["diff", "--cached", "--name-only"]).trim();
if (!staged) {
  record("skip", "empty", "committed=false\n");
  process.exit(0);
}
if (!process.argv.includes("--push")) {
  record("skip", "provenance-unavailable", "committed=false\n");
  process.exit(0);
}
const published = publishSignedCommit({
  cwd: process.cwd(),
  repo: process.env.GITHUB_REPOSITORY || "",
  branch,
  message,
  runId: process.env.GITHUB_RUN_ID || "",
  mainRef,
  remoteRef,
});
if (published.action !== "ready") {
  record(published.action, published.reason, "committed=false\n");
  process.exit(0);
}
record("ready", published.reason, `committed=true\nhead_sha=${published.sha}\n`);
