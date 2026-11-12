// Move onto bot/<name> without resetting history and without force-push.
// A missing branch is created from main. An existing branch is checked out
// and main is merged when the histories still share a base. Divergence is reported.
// The collect payload is copied only after that checkout. It contains tracked
// data files, and a dirty repos.json makes checkout abort.
import { execFileSync } from "node:child_process";
import { cpSync, realpathSync, statSync } from "node:fs";
import { isAbsolute, relative, sep } from "node:path";
import { identityEnv } from "./identity.mjs";
import { leakageFindings } from "./redact.mjs";

function git(cwd, args, env = process.env) {
  try {
    return execFileSync("git", args, {
      cwd,
      env,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (error) {
    const stderr = String(error.stderr ?? "");
    const safe = leakageFindings(stderr).length ? "git command failed" : stderr.trim() || "git command failed";
    const wrapped = new Error(safe);
    wrapped.status = error.status ?? 1;
    throw wrapped;
  }
}

function gitOk(cwd, args, env = process.env) {
  try {
    execFileSync("git", args, { cwd, env, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

export function prepareBotBranch({ cwd, branch, mainRef, remoteRef, actor, state }) {
  if (!branch || !branch.startsWith("bot/")) throw new Error(`refusing to publish ${branch}`);
  if (!gitOk(cwd, ["rev-parse", "--verify", "--quiet", mainRef])) throw new Error("missing main ref");
  const remote = remoteRef || `origin/${branch}`;
  if (!gitOk(cwd, ["rev-parse", "--verify", "--quiet", remote])) {
    git(cwd, ["checkout", "-B", branch, mainRef]);
    return { action: "ready", reason: "created" };
  }
  git(cwd, ["checkout", "-B", branch, remote]);
  if (gitOk(cwd, ["merge-base", "--is-ancestor", mainRef, "HEAD"])) {
    return { action: "ready", reason: "fast-forward" };
  }
  if (!gitOk(cwd, ["merge-base", mainRef, "HEAD"])) return { action: "skip", reason: "diverged" };
  const env = identityEnv();
  if (!gitOk(cwd, ["merge", "--no-edit", mainRef], env)) {
    gitOk(cwd, ["merge", "--abort"]);
    return { action: "skip", reason: "diverged" };
  }
  if (actor && state && /^[A-Za-z0-9_.[\]-]+$/.test(actor) && /^[a-z0-9-]+$/.test(state)) {
    const message = git(cwd, ["log", "-1", "--format=%B"], env).trim();
    if (!message.includes("Growth-State:")) {
      git(cwd, ["commit", "--amend", "-m", `${message}\n\nGrowth-Actor: ${actor}\nGrowth-State: ${state}\n`], env);
    }
  }
  return { action: "ready", reason: "merged-main" };
}

function outsideWorktree(cwd, payloadDir) {
  const root = realpathSync(cwd);
  const source = realpathSync(payloadDir);
  const rel = relative(root, source);
  const inside = rel === "" || (!rel.startsWith(`..${sep}`) && rel !== ".." && !isAbsolute(rel));
  if (inside) throw new Error("payload must stay outside the worktree");
  return { root, source };
}

export function applyPayloadTree({ cwd, payloadDir }) {
  if (!payloadDir) throw new Error("missing payload");
  let placed;
  try {
    placed = outsideWorktree(cwd, payloadDir);
  } catch (error) {
    if (error?.code === "ENOENT") throw new Error("missing payload");
    throw error;
  }
  if (!statSync(placed.source).isDirectory()) throw new Error("missing payload");
  cpSync(placed.source, placed.root, { recursive: true, dereference: true });
}

// Checkout and merge first. Copying AwesomeDS/data into the worktree before
// the branch switch makes git refuse when the bot branch already differs.
export function stageWeeklyBranch({ cwd, payloadDir = "", ...rest }) {
  const prepared = prepareBotBranch({ cwd, ...rest });
  if (prepared.action !== "ready" || !payloadDir) return prepared;
  applyPayloadTree({ cwd, payloadDir });
  return prepared;
}

export function commitAsCanonical({ cwd, message, actor, state }) {
  if (!/^[A-Za-z0-9_.[\]-]+$/.test(actor || "")) throw new Error("refusing actor");
  if (!/^[a-z0-9-]+$/.test(state || "")) throw new Error("refusing state");
  const full = `${message}\n\nGrowth-Actor: ${actor}\nGrowth-State: ${state}\n`;
  git(cwd, ["commit", "-m", full], identityEnv());
}

export function pushFastForward({ cwd, branch }) {
  if (!branch || !branch.startsWith("bot/")) throw new Error(`refusing to publish ${branch}`);
  git(cwd, ["push", "origin", `HEAD:${branch}`], identityEnv());
}
