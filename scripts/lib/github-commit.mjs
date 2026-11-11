// Create the weekly commit through the Git data API so GitHub signs it.
// No custom author, committer, or signature: those block bot verification.
import { execFileSync } from "node:child_process";
import { botCommitOk, commitRequest } from "./provenance.mjs";

const MAX_BLOB = 1_000_000;

function git(cwd, args, encoding = "utf8") {
  return execFileSync("git", args, {
    cwd,
    encoding: encoding === null ? undefined : encoding,
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function gitOk(cwd, args) {
  try {
    execFileSync("git", args, { cwd, stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
}

function gh(method, path, body) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
  if (!token) return { error: true };
  try {
    const args = ["api", "--method", method, path, "-H", "Accept: application/vnd.github+json"];
    const out = execFileSync("gh", args, {
      encoding: "utf8",
      input: body === undefined ? undefined : JSON.stringify(body),
      env: { ...process.env, GH_TOKEN: token },
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (!String(out).trim()) return { error: true };
    return JSON.parse(out);
  } catch {
    return { error: true };
  }
}

function treeEntries(cwd, repo, baseTree, indexTree) {
  const raw = git(cwd, ["diff-tree", "-r", "-z", "--no-renames", "--name-status", baseTree, indexTree]);
  const records = raw.split("\0").filter(Boolean);
  if (records.length % 2 !== 0) return null;
  const entries = [];
  for (let i = 0; i + 1 < records.length; i += 2) {
    const status = records[i];
    const path = records[i + 1];
    if (status.startsWith("D")) {
      entries.push({ path, mode: "100644", type: "blob", sha: null });
      continue;
    }
    const listed = git(cwd, ["ls-tree", indexTree, "--", path]).trim();
    const mode = listed.slice(0, 6);
    if (mode !== "100644" && mode !== "100755") return null;
    const bytes = git(cwd, ["cat-file", "blob", `${indexTree}:${path}`], null);
    if (!Buffer.isBuffer(bytes) || bytes.length > MAX_BLOB) return null;
    const blob = gh("POST", `repos/${repo}/git/blobs`, {
      content: bytes.toString("base64"),
      encoding: "base64",
    });
    if (!blob?.sha) return null;
    entries.push({ path, mode, type: "blob", sha: blob.sha });
  }
  return entries;
}

export function parentShas({ cwd, mainRef, remoteRef }) {
  const mainSha = git(cwd, ["rev-parse", mainRef]).trim();
  let remoteSha = "";
  if (gitOk(cwd, ["rev-parse", "--verify", "--quiet", remoteRef])) {
    remoteSha = git(cwd, ["rev-parse", remoteRef]).trim();
  }
  if (!remoteSha) return { parents: [mainSha], remoteSha: "" };
  if (gitOk(cwd, ["merge-base", "--is-ancestor", mainRef, remoteRef])) return { parents: [remoteSha], remoteSha };
  if (gitOk(cwd, ["merge-base", "--is-ancestor", remoteRef, mainRef])) return { parents: [mainSha], remoteSha };
  if (!gitOk(cwd, ["merge-base", mainRef, remoteRef])) return { action: "skip", reason: "diverged" };
  return { parents: [remoteSha, mainSha], remoteSha };
}

export function publishSignedCommit({ cwd, repo, branch, message, runId, mainRef, remoteRef }) {
  if (!repo || !branch?.startsWith("bot/")) return { action: "skip", reason: "provenance-unavailable" };
  const planned = parentShas({ cwd, mainRef, remoteRef });
  if (planned.action === "skip") return planned;
  const indexTree = git(cwd, ["write-tree"]).trim();
  const baseTree = git(cwd, ["rev-parse", `${planned.parents[0]}^{tree}`]).trim();
  const entries = treeEntries(cwd, repo, baseTree, indexTree);
  if (!entries) return { action: "skip", reason: "provenance-unavailable" };
  if (!entries.length) return { action: "skip", reason: "empty" };
  const tree = gh("POST", `repos/${repo}/git/trees`, { base_tree: baseTree, tree: entries });
  if (!tree?.sha) return { action: "skip", reason: "provenance-unavailable" };
  const body = commitRequest({ message, tree: tree.sha, parents: planned.parents, runId });
  if (!body || Object.keys(body).some((key) => !["message", "tree", "parents"].includes(key))) {
    return { action: "skip", reason: "provenance-unavailable" };
  }
  const created = gh("POST", `repos/${repo}/git/commits`, body);
  if (!created?.sha) return { action: "skip", reason: "provenance-unavailable" };
  const commit = gh("GET", `repos/${repo}/commits/${created.sha}`);
  const run = gh("GET", `repos/${repo}/actions/runs/${runId}`);
  if (!botCommitOk(commit, run, repo)) return { action: "skip", reason: "unverified" };
  const hasRemote = Boolean(planned.remoteSha);
  const updated = hasRemote
    ? gh("PATCH", `repos/${repo}/git/refs/heads/${branch}`, { sha: created.sha, force: false })
    : gh("POST", `repos/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha: created.sha });
  if (!updated || updated.error || !(updated.ref || updated.object?.sha)) {
    return { action: "skip", reason: "provenance-unavailable" };
  }
  return { action: "ready", reason: hasRemote ? "fast-forward" : "created", sha: created.sha };
}
