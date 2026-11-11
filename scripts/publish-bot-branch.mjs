#!/usr/bin/env node
// Fast-forward bot/weekly-growth, or skip when the branch diverged or a person edited it.
// Never force-pushes. Author and committer are the canonical noreply identity.
import { appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { prepareBotBranch, commitAsCanonical, pushFastForward } from "./lib/bot-branch.mjs";
import { authorFromLog, publishPlan } from "./lib/growth.mjs";
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

const log = git(["log", "--format=%an%x1f%ae%x1f%cn%x1f%ce%x1f%B%x1e", `${mainRef}..HEAD`]);
const commits = log.split("\x1e").map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
  const [authorName, authorEmail, committerName, committerEmail, body] = chunk.split("\x1f");
  return authorFromLog({ authorName, authorEmail, committerName, committerEmail, body });
});
let remoteOk = false;
try {
  execFileSync("git", ["rev-parse", "--verify", "--quiet", remoteRef], { stdio: "pipe" });
  remoteOk = true;
} catch {
  remoteOk = false;
}
const plan = publishPlan({
  actor,
  remoteExists: remoteOk,
  fastForward: true,
  commits,
});
if (plan.action !== "ready") {
  record(plan.action, plan.reason, "committed=false\n");
  process.exit(0);
}
const staged = git(["diff", "--cached", "--name-only"]).trim();
if (!staged) {
  record("skip", "empty", "committed=false\n");
  process.exit(0);
}
commitAsCanonical({ cwd: process.cwd(), message, actor, state });
if (process.argv.includes("--push")) pushFastForward({ cwd: process.cwd(), branch });
record("ready", plan.reason, "committed=true\n");
