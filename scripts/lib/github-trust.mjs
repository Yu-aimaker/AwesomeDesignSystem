// Attach GitHub's own login and association to commits.
// The commit message is not a source for either field.
import { execFileSync } from "node:child_process";
import { trustFromGithub } from "./growth.mjs";

function gh(args) {
  const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN || "";
  if (!token) return "";
  try {
    return execFileSync("gh", args, {
      encoding: "utf8",
      env: { ...process.env, GH_TOKEN: token },
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
  } catch {
    return "";
  }
}

function associationFor(repo, sha) {
  const number = gh(["api", `repos/${repo}/commits/${sha}/pulls`, "--jq", ".[0].number"]);
  if (!number || !/^[0-9]+$/.test(number)) return "";
  const assoc = gh([
    "api",
    "--paginate",
    `repos/${repo}/pulls/${number}/commits`,
    "--jq",
    `.[] | select(.sha=="${sha}") | .author_association`,
  ]);
  return assoc.split("\n").find(Boolean) ?? "";
}

export function lookupCommitTrust(sha) {
  const repo = process.env.GITHUB_REPOSITORY || "";
  if (!repo || !/^[0-9a-f]{40}$/i.test(String(sha ?? ""))) return {};
  const login = gh(["api", `repos/${repo}/commits/${sha}`, "--jq", ".author.login"]);
  if (!login || login === "null") return {};
  const owner = gh(["api", `repos/${repo}`, "--jq", ".owner.login"]);
  const permission = gh(["api", `repos/${repo}/collaborators/${login}/permission`, "--jq", ".permission"]);
  const association = associationFor(repo, sha);
  return trustFromGithub({ login, permission, association, owner: owner === "null" ? "" : owner });
}
