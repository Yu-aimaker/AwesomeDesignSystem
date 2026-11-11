// Append unaccepted weekly candidates to the Knowledge ledgers.
// Rows are constrained fields. A leaked value is dropped, not masked into the file.

import { constrainField, leakageFindings } from "./redact.mjs";

const OSS_LEDGER = "Knowledge/research/oss-candidates.md";
const SITE_LEDGER = "Knowledge/research/site-candidates.md";

export function ledgerPath(kind) {
  return kind === "guideline" ? SITE_LEDGER : OSS_LEDGER;
}

function rowFor(candidate, today) {
  const name = constrainField(candidate.title, 80);
  const url = constrainField(candidate.url, 200);
  const noteParts = [];
  if (typeof candidate.stars === "number") noteParts.push(`stars ${candidate.stars}`);
  const license = constrainField(candidate.license, 40);
  if (license) noteParts.push(license);
  const note = constrainField(noteParts.join(", "), 80);
  if (!name || !url || !/^https:\/\/[^\s]+$/.test(url)) return null;
  const line = `| ${today} | ${name} | ${url} | ${note} |`;
  if (leakageFindings(line).length) return null;
  return { url, line };
}

export function appendLedger(markdown, candidates, today) {
  const text = String(markdown);
  const header = text.indexOf("| 見た日 |");
  if (header === -1) return { markdown: text, added: 0, refused: candidates.length };
  const known = new Set([...text.matchAll(/https:\/\/[^\s|]+/g)].map((match) => match[0]));
  const lines = [];
  let refused = 0;
  for (const candidate of candidates) {
    const row = rowFor(candidate, today);
    if (!row) {
      refused += 1;
      continue;
    }
    if (known.has(row.url)) continue;
    known.add(row.url);
    lines.push(row.line);
  }
  if (!lines.length) return { markdown: text, added: 0, refused };
  const separator = text.indexOf("\n|---", header);
  if (separator === -1) return { markdown: text, added: 0, refused: refused + candidates.length };
  const insertAt = text.indexOf("\n", separator + 1);
  if (insertAt === -1) return { markdown: text, added: 0, refused: refused + candidates.length };
  const next = `${text.slice(0, insertAt + 1)}${lines.join("\n")}\n${text.slice(insertAt + 1)}`;
  const updated = next.replace(/^updated:.*$/m, `updated: ${today}`);
  if (leakageFindings(lines.join("\n")).length) return { markdown: text, added: 0, refused: candidates.length };
  return { markdown: updated, added: lines.length, refused };
}

export function splitCandidates(fresh) {
  const oss = [];
  const sites = [];
  for (const candidate of fresh ?? []) {
    if (candidate?.kind === "guideline") sites.push(candidate);
    else oss.push(candidate);
  }
  return { oss, sites };
}
