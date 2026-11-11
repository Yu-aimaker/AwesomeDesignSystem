// Read GitHub's signature verdict. A missing field or a failed call is a rejection.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { botCommitOk, isVerifiedWebFlow } from "./provenance.mjs";

function gh(path) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
  if (!token) return { error: true };
  try {
    const out = execFileSync("gh", ["api", path, "-H", "Accept: application/vnd.github+json"], {
      encoding: "utf8",
      env: { ...process.env, GH_TOKEN: token },
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (!String(out).trim()) return { error: true };
    return JSON.parse(out);
  } catch {
    return { error: true };
  }
}

export function provenanceFromFixture(fixture, sha) {
  if (!fixture || typeof fixture !== "object") return { error: true };
  const commit = fixture.commits?.[sha];
  if (!commit || commit.error) return { error: true };
  if (!Array.isArray(fixture.pulls?.[sha]) && fixture.pulls?.[sha]?.error) return { error: true };
  const pulls = fixture.pulls?.[sha];
  const runId = commit.commit?.message?.match(/^Workflow-Run:[ \t]+([0-9]+)[ \t]*$/m)?.[1] ?? "";
  let run = null;
  if (runId) {
    run = fixture.runs?.[runId];
    if (!run || run.error) return { error: true };
  }
  return {
    commit,
    pulls: Array.isArray(pulls) ? pulls : null,
    run,
    repo: fixture.repo ?? process.env.GITHUB_REPOSITORY ?? "",
  };
}

export function fetchProvenance(sha, repo) {
  if (!repo || !/^[0-9a-f]{40}$/i.test(String(sha ?? ""))) return { error: true };
  const commit = gh(`repos/${repo}/commits/${sha}`);
  if (!commit || commit.error || !commit.sha) return { error: true };
  const pulls = gh(`repos/${repo}/commits/${sha}/pulls`);
  if (!Array.isArray(pulls)) return { error: true };
  const runId = commit.commit?.message?.match(/^Workflow-Run:[ \t]+([0-9]+)[ \t]*$/m)?.[1] ?? "";
  let run = null;
  if (runId) {
    run = gh(`repos/${repo}/actions/runs/${runId}`);
    if (!run || run.error || run.id === undefined) return { error: true };
  }
  return { commit, pulls, run, repo };
}

export function readProvenance(sha) {
  const fixturePath = process.env.PROVENANCE_FIXTURE || "";
  if (fixturePath) {
    try {
      return provenanceFromFixture(JSON.parse(readFileSync(fixturePath, "utf8")), sha);
    } catch {
      return { error: true };
    }
  }
  return fetchProvenance(sha, process.env.GITHUB_REPOSITORY || "");
}

export function lookupCommitTrust(sha) {
  const proof = readProvenance(sha);
  if (!proof || proof.error || !proof.commit) return { error: true };
  const repo = proof.repo || process.env.GITHUB_REPOSITORY || "";
  return {
    verified: proof.commit.commit?.verification?.verified === true,
    webFlow: proof.commit.committer?.login === "web-flow" && isVerifiedWebFlow(proof.commit),
    runMatches: botCommitOk(proof.commit, proof.run, repo),
    error: false,
  };
}
