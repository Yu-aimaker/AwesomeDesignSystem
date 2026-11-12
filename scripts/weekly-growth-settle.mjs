#!/usr/bin/env node
// Print skip | fail | close | report. Exit 1 only for fail.
// Does not merge. A non-success Check stays open so a transient failure can be retried.
import { appendFileSync, readFileSync } from "node:fs";
import { settle } from "./lib/growth.mjs";

function readJson(path, fallback) {
  if (!path) return fallback;
  return JSON.parse(readFileSync(path, "utf8"));
}

const prFile = readJson(process.env.PR_FILE, []);
const open = Array.isArray(prFile) ? prFile.find((item) => item && item.number) : null;
const authors = readJson(process.env.AUTHORS_FILE, []);
const paths = process.env.PATHS_FILE
  ? readFileSync(process.env.PATHS_FILE, "utf8").split("\0").filter((item) => item.length > 0)
  : [];
const result = settle({
  event: process.env.EVENT_NAME ?? "",
  chained: process.env.CHAINED === "true",
  workflow: process.env.WORKFLOW_NAME ?? "",
  repository: process.env.SOURCE_REPOSITORY ?? "",
  expectedRepository: process.env.EXPECTED_REPOSITORY ?? "",
  branch: process.env.HEAD_BRANCH ?? "",
  headSha: process.env.HEAD_SHA ?? "",
  branchTip: process.env.BRANCH_TIP,
  conclusion: process.env.CHECK_CONCLUSION ?? "",
  pullRequestOpen: Boolean(open),
  pullRequestHeadSha: open ? (open.headRefOid ?? "") : undefined,
  authors: Array.isArray(authors) ? authors : [],
  paths,
});

const output = process.env.GITHUB_OUTPUT;
const shaOk = typeof result.headSha === "string" && /^[0-9a-f]{40}$/.test(result.headSha);
const numberOk = open && /^[0-9]+$/.test(String(open.number));
if (result.action === "report" && !shaOk) {
  const refused = { action: "fail", reason: "missing-head-sha" };
  if (output) appendFileSync(output, "action=fail\nreason=missing-head-sha\n");
  console.log(JSON.stringify(refused));
  process.exit(1);
}
if (output) {
  appendFileSync(output, `action=${result.action}\nreason=${result.reason}\n`);
  if (result.action === "report") appendFileSync(output, `head_sha=${result.headSha}\n`);
  if ((result.action === "report" || result.action === "close") && numberOk) {
    appendFileSync(output, `pr_number=${open.number}\n`);
  }
}
console.log(JSON.stringify(result));
process.exit(result.action === "fail" ? 1 : 0);
