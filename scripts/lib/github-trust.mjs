// Read GitHub's signature verdict. A missing field or a failed call is a rejection.
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { botCommitOk, isBotAuthorEmail, receiptFor } from "./provenance.mjs";

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
  if (fixture.checks?.[sha]?.error) return { error: true };
  const checks = Array.isArray(fixture.checks?.[sha]) ? fixture.checks[sha] : [];
  const receipt = receiptFor(checks);
  let run = null;
  if (receipt) {
    const runId = String(receipt.external_id ?? "");
    if (!/^[0-9]+$/.test(runId)) return { error: true };
    run = fixture.runs?.[runId];
    if (!run || run.error) return { error: true };
  }
  return {
    commit,
    pulls: Array.isArray(pulls) ? pulls : null,
    checks,
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
  const listed = gh(`repos/${repo}/commits/${sha}/check-runs?per_page=100`);
  if (!listed || listed.error || !Array.isArray(listed.check_runs)) return { error: true };
  if (listed.total_count > listed.check_runs.length) return { error: true };
  const checks = listed.check_runs;
  const receipt = receiptFor(checks);
  let run = null;
  if (receipt) {
    const runId = String(receipt.external_id ?? "");
    if (!/^[0-9]+$/.test(runId)) return { error: true };
    run = gh(`repos/${repo}/actions/runs/${runId}`);
    if (!run || run.error || run.id === undefined) return { error: true };
  }
  return { commit, pulls, checks, run, repo };
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
    webFlow: proof.commit.committer?.login === "web-flow",
    noreplyAuthor: isBotAuthorEmail(proof.commit.commit?.author?.email),
    receipt: botCommitOk(proof.commit, proof, repo),
    error: false,
  };
}
