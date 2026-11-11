// Append unaccepted weekly candidates to the Knowledge ledgers.
// Rows are constrained fields. A leaked value is dropped, not masked into the file.

import { githubRepoKey, ossLicenseDecision } from "./growth.mjs";
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

const LEDGER_ROW = /^\| ([^|]+) \| ([^|]+) \| (https:\/\/[^|\s]+) \| ([^|]*) \|$/;

export function licenseFromNote(note) {
  return String(note ?? "")
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part && !/^stars\s+\d+$/i.test(part))
    .join(", ");
}

export function ossLedgerRows(markdown) {
  const rows = [];
  for (const line of String(markdown).replace(/\r\n/g, "\n").split("\n")) {
    const match = line.match(LEDGER_ROW);
    if (!match || match[1].trim() === "見た日") continue;
    rows.push({
      date: match[1].trim(),
      name: match[2].trim(),
      url: match[3].trim(),
      note: match[4].trim(),
      line,
    });
  }
  return rows;
}

export function pruneOssLedger(markdown, { cataloguedKeys = [], licenseTextFor = () => "", today = "" } = {}) {
  const known = new Set(cataloguedKeys.map((key) => String(key).toLowerCase()));
  const text = String(markdown);
  const rows = ossLedgerRows(text);
  const dropped = [];
  const keep = new Set();
  for (const row of rows) {
    const repo = githubRepoKey(row.url).toLowerCase();
    if (repo && known.has(repo)) {
      dropped.push({ name: row.name, url: row.url, reason: "catalogued" });
      continue;
    }
    const decision = ossLicenseDecision({
      license: { spdx_id: licenseFromNote(row.note) },
      licenseText: licenseTextFor(row) ?? "",
    });
    if (!decision.admit) {
      dropped.push({ name: row.name, url: row.url, reason: "license" });
      continue;
    }
    keep.add(row.line);
  }
  if (!dropped.length) return { markdown: text, dropped };
  const next = text.replace(/\r\n/g, "\n").split("\n").filter((line) => {
    const match = line.match(LEDGER_ROW);
    if (!match || match[1].trim() === "見た日") return true;
    return keep.has(line);
  }).join("\n");
  const dated = today ? next.replace(/^updated:.*$/m, `updated: ${today}`) : next;
  return { markdown: dated, dropped };
}

export function ledgerDropSummary(dropped) {
  if (!dropped?.length) return "落とした候補: なし";
  const lines = ["落とした候補:"];
  const seen = new Set();
  for (const row of dropped) {
    const name = constrainField(row.name, 80);
    if (!name || seen.has(name)) continue;
    seen.add(name);
    lines.push(`- ${name} (${row.reason === "catalogued" ? "既掲載" : "ライセンス"})`);
  }
  const text = lines.join("\n");
  if (leakageFindings(text).length) return "落とした候補: 本文は公開できません。";
  return text;
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
