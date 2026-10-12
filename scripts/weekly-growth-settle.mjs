#!/usr/bin/env node
// Print skip | fail | close | merge. Exit 1 only for fail.
// Env: HEAD_BRANCH, HEAD_SHA, CHECK_CONCLUSION, AUTHORS_FILE, PATHS_FILE, PR_FILE.
import { appendFileSync, readFileSync } from "node:fs";
import { settle } from "./lib/growth.mjs";

function readSplit(path, separator) {
  if (!path) return [];
  return readFileSync(path, "utf8").split(separator).filter((item) => item.length > 0);
}

const prFile = JSON.parse(readFileSync(process.env.PR_FILE, "utf8"));
const open = Array.isArray(prFile) ? prFile.find((item) => item && item.number) : null;
const result = settle({
  branch: process.env.HEAD_BRANCH ?? "",
  headSha: process.env.HEAD_SHA ?? "",
  conclusion: process.env.CHECK_CONCLUSION ?? "",
  pullRequestOpen: Boolean(open),
  pullRequestHeadSha: open ? (open.headRefOid ?? "") : undefined,
  authors: readSplit(process.env.AUTHORS_FILE, /\r?\n/),
  paths: readSplit(process.env.PATHS_FILE, "\0"),
});

const output = process.env.GITHUB_OUTPUT;
const shaOk = typeof result.headSha === "string" && /^[0-9a-f]{40}$/.test(result.headSha);
const numberOk = open && /^[0-9]+$/.test(String(open.number));
if (result.action === "merge" && !shaOk) {
  const refused = { action: "fail", reason: "missing-head-sha" };
  if (output) appendFileSync(output, "action=fail\nreason=missing-head-sha\n");
  console.log(JSON.stringify(refused));
  process.exit(1);
}
if (output) {
  appendFileSync(output, `action=${result.action}\nreason=${result.reason}\n`);
  if (result.action === "merge") appendFileSync(output, `head_sha=${result.headSha}\n`);
  if ((result.action === "merge" || result.action === "close") && numberOk) {
    appendFileSync(output, `pr_number=${open.number}\n`);
  }
}
console.log(JSON.stringify(result));
process.exit(result.action === "fail" ? 1 : 0);
