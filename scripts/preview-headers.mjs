#!/usr/bin/env node
// Header contract for the routes a preview review actually opens.
// Each must be 200 HTML with X-Robots-Tag noindex+nofollow and HSTS max-age=63072000.
// /missing-page is not a real route: the assets-only Worker must still serve the SPA.
//
//   node scripts/preview-headers.mjs <url>
//
// CI runs scripts/preview-headers.test.mjs only. This file does not open the network
// unless executed as the CLI.
import { pathToFileURL } from "node:url";
import { normalizeHeaders, parseOrigins } from "./hosting-smoke.mjs";

export const PATHS = ["/", "/sources", "/foundations", "/en/sources", "/missing-page"];

const HSTS_DIRECTIVE = "max-age=63072000";

function directives(value, separator) {
  return String(value || "")
    .split(separator)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
}

function mediaType(value) {
  return String(value || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
}

function probeProblems(label, path, probe) {
  const problems = [];
  if (!probe) {
    problems.push(`${label} ${path}: no response`);
    return problems;
  }
  const headers = normalizeHeaders(probe.headers);
  if (probe.status !== 200) {
    problems.push(`${label} ${path}: status ${probe.status}, want 200`);
  }
  const type = mediaType(headers["content-type"]);
  if (type !== "text/html") {
    problems.push(`${label} ${path}: content-type ${type || "(missing)"}, want text/html`);
  }
  const robots = new Set(directives(headers["x-robots-tag"], ","));
  if (!robots.has("noindex") || !robots.has("nofollow")) {
    problems.push(
      `${label} ${path}: x-robots-tag ${JSON.stringify(headers["x-robots-tag"] ?? null)}, want noindex, nofollow`,
    );
  }
  if (!directives(headers["strict-transport-security"], ";").includes(HSTS_DIRECTIVE)) {
    problems.push(
      `${label} ${path}: strict-transport-security ${JSON.stringify(headers["strict-transport-security"] ?? null)}, want ${HSTS_DIRECTIVE}`,
    );
  }
  return problems;
}

/**
 * @param {{ label: string, probes: Record<string, { status: number, headers: Record<string, string> }> }[]} samples
 * @returns {string[]}
 */
export function checkPreviewHeaders(samples) {
  const problems = [];
  for (const sample of samples) {
    for (const path of PATHS) {
      problems.push(...probeProblems(sample.label, path, sample.probes[path]));
    }
  }
  return problems;
}

async function probeOrigin(origin) {
  const probes = {};
  for (const path of PATHS) {
    const response = await fetch(new URL(path, origin), {
      redirect: "manual",
      signal: AbortSignal.timeout(20_000),
    });
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    await response.body?.cancel();
    probes[path] = { status: response.status, headers };
  }
  return { label: origin, probes };
}

async function main() {
  let origins;
  try {
    origins = parseOrigins(process.argv.slice(2));
  } catch (error) {
    console.error(`preview-headers: ${error.message}`);
    console.error("usage: node scripts/preview-headers.mjs <url>");
    process.exit(2);
  }
  if (origins.length !== 1) {
    console.error("preview-headers: pass exactly one origin");
    process.exit(2);
  }
  const problems = checkPreviewHeaders([await probeOrigin(origins[0])]);
  if (problems.length) {
    console.error(problems.map((line) => `preview-headers: ${line}`).join("\n"));
    process.exit(1);
  }
  console.log(`preview-headers ok: ${origins[0]} ${PATHS.join(" ")}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`preview-headers: ${error.message}`);
    process.exit(1);
  });
}
