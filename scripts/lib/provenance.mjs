// Server-side provenance. Git name, email, and account mapping are not proof.
// A commit counts only when GitHub's API reports a verified web-flow signature.
const WEB_FLOW = "web-flow";
export const WEEKLY_WORKFLOW_PATH = ".github/workflows/weekly-growth.yml";
export const RECEIPT_NAME = "weekly-growth-receipt";

export function isBotAuthorEmail(email) {
  return String(email ?? "").trim().toLowerCase().endsWith("@users.noreply.github.com");
}

export function receiptFor(checks) {
  if (!Array.isArray(checks)) return null;
  return checks.find((check) => check?.name === RECEIPT_NAME) ?? null;
}

export function isVerifiedWebFlow(commit) {
  if (!commit || commit.error || typeof commit !== "object") return false;
  if (!/^[0-9a-f]{40}$/i.test(String(commit.sha ?? ""))) return false;
  if (commit.commit?.verification?.verified !== true) return false;
  if (commit.committer?.login !== WEB_FLOW) return false;
  if (!Array.isArray(commit.parents)) return false;
  return true;
}

export function isMergedIntoMain(sha, pulls) {
  if (!/^[0-9a-f]{40}$/i.test(String(sha ?? ""))) return false;
  if (!Array.isArray(pulls)) return false;
  return pulls.some((pr) => pr
    && pr.merge_commit_sha === sha
    && pr.base?.ref === "main"
    && typeof pr.merged_at === "string"
    && pr.merged_at.length > 0);
}

export function platformMergeOk(commit, pulls) {
  if (!isVerifiedWebFlow(commit)) return false;
  if (commit.parents.length < 2) return false;
  return isMergedIntoMain(commit.sha, pulls);
}

export function workflowRunOk(run, repo, runId) {
  if (!run || run.error || typeof run !== "object") return false;
  if (!repo || run.head_repository?.full_name !== repo) return false;
  if (String(run.id ?? "") !== String(runId)) return false;
  if (run.path !== WEEKLY_WORKFLOW_PATH) return false;
  if (run.event !== "schedule" && run.event !== "workflow_dispatch") return false;
  return true;
}

export function botCommitOk(commit, proof, repo) {
  if (!isVerifiedWebFlow(commit)) return false;
  if (!isBotAuthorEmail(commit.commit?.author?.email)) return false;
  const checks = proof?.checks;
  const receipt = receiptFor(checks);
  if (!receipt) return false;
  if (receipt.app?.slug !== "github-actions") return false;
  if (receipt.head_sha !== commit.sha) return false;
  const runId = String(receipt.external_id ?? "");
  if (!/^[0-9]+$/.test(runId)) return false;
  return workflowRunOk(proof?.run, repo, runId);
}

export function commitRequest({ message, tree, parents }) {
  if (!String(message ?? "").trim()) return null;
  if (!/^[0-9a-f]{40}$/i.test(String(tree ?? ""))) return null;
  if (!Array.isArray(parents) || parents.length < 1) return null;
  if (parents.some((sha) => !/^[0-9a-f]{40}$/i.test(String(sha)))) return null;
  return {
    message: `${String(message).trim()}\n`,
    tree,
    parents,
  };
}

export function checkRunRequest({ sha, runId }) {
  if (!/^[0-9a-f]{40}$/i.test(String(sha ?? ""))) return null;
  if (!/^[0-9]+$/.test(String(runId ?? ""))) return null;
  return {
    name: RECEIPT_NAME,
    head_sha: sha,
    external_id: String(runId),
    status: "completed",
    conclusion: "success",
  };
}
