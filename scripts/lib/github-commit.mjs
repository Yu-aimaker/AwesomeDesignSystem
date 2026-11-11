// Create the weekly commit through the Git data API so GitHub signs it.
// No custom author, committer, or signature: those block bot verification.
import { execFileSync } from "node:child_process";
import { botCommitOk, checkRunRequest, commitRequest, isBotAuthorEmail, isVerifiedWebFlow } from "./provenance.mjs";

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
  if (!token) throw new Error("github api: missing token");
  const args = ["api", "--method", method, path, "-H", "Accept: application/vnd.github+json"];
  if (body !== undefined) args.push("--input", "-");
  let out = "";
  try {
    out = execFileSync("gh", args, {
      encoding: "utf8",
      input: body === undefined ? undefined : JSON.stringify(body),
      env: { ...process.env, GH_TOKEN: token },
      stdio: ["pipe", "pipe", "pipe"],
    });
  } catch {
    throw new Error(`github api failed: ${method} ${path}`);
  }
  if (!String(out).trim()) throw new Error(`github api failed: ${method} ${path}`);
  try {
    return JSON.parse(out);
  } catch {
    throw new Error(`github api failed: ${method} ${path}`);
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
    if (!blob?.sha) throw new Error("github api failed: POST git/blobs");
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
  if (!repo || !branch?.startsWith("bot/")) throw new Error("github api: missing repository");
  const planned = parentShas({ cwd, mainRef, remoteRef });
  if (planned.action === "skip") return planned;
  const indexTree = git(cwd, ["write-tree"]).trim();
  const baseTree = git(cwd, ["rev-parse", `${planned.parents[0]}^{tree}`]).trim();
  const entries = treeEntries(cwd, repo, baseTree, indexTree);
  if (!entries) throw new Error("github api failed: tree");
  if (!entries.length) return { action: "skip", reason: "empty" };
  const tree = gh("POST", `repos/${repo}/git/trees`, { base_tree: baseTree, tree: entries });
  if (!tree?.sha) throw new Error("github api failed: POST git/trees");
  const body = commitRequest({ message, tree: tree.sha, parents: planned.parents });
  if (!body || Object.keys(body).some((key) => !["message", "tree", "parents"].includes(key))) {
    throw new Error("github api failed: POST git/commits");
  }
  const created = gh("POST", `repos/${repo}/git/commits`, body);
  if (!created?.sha) throw new Error("github api failed: POST git/commits");
  const commit = gh("GET", `repos/${repo}/commits/${created.sha}`);
  if (!isVerifiedWebFlow(commit) || !isBotAuthorEmail(commit.commit?.author?.email)) {
    throw new Error("github api failed: commit attribution");
  }
  const receipt = checkRunRequest({ sha: created.sha, runId });
  if (!receipt) throw new Error("github api failed: POST check-runs");
  gh("POST", `repos/${repo}/check-runs`, receipt);
  const listed = gh("GET", `repos/${repo}/commits/${created.sha}/check-runs?per_page=100`);
  if (!listed || !Array.isArray(listed.check_runs)) throw new Error("github api failed: GET check-runs");
  const run = gh("GET", `repos/${repo}/actions/runs/${runId}`);
  if (!botCommitOk(commit, { checks: listed.check_runs, run }, repo)) {
    throw new Error("github api failed: receipt");
  }
  const hasRemote = Boolean(planned.remoteSha);
  const updated = hasRemote
    ? gh("PATCH", `repos/${repo}/git/refs/heads/${branch}`, { sha: created.sha, force: false })
    : gh("POST", `repos/${repo}/git/refs`, { ref: `refs/heads/${branch}`, sha: created.sha });
  if (!updated?.ref && !updated?.object?.sha) throw new Error("github api failed: refs");
  return { action: "ready", reason: hasRemote ? "fast-forward" : "created", sha: created.sha };
}
