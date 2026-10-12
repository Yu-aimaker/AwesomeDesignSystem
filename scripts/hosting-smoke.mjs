#!/usr/bin/env node
// Compare hosting responses for the AwesomeDS static site.
// One or more origin URLs. Each must serve:
//   GET /                 200, text/html, X-Robots-Tag noindex+nofollow, HSTS max-age=63072000
//   GET /foo/bar?x=1      200, text/html (SPA fallback; same robots and HSTS)
//   GET /og-image.png     200, image/png (same robots and HSTS)
// With two or more URLs, status and those headers are also compared to the first URL.
// `server` and cache headers may differ between Vercel and Cloudflare and are not failures.
//
//   node scripts/hosting-smoke.mjs <url> [url...]
//
// CI runs scripts/hosting-smoke.test.mjs only. This file does not open the network
// unless executed as the CLI.
import { pathToFileURL } from "node:url";

export const PATHS = ["/", "/foo/bar?x=1", "/og-image.png"];

const HSTS_DIRECTIVE = "max-age=63072000";

function mediaType(value) {
  return String(value || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
}

function directives(value, separator) {
  return String(value || "")
    .split(separator)
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean)
    .sort();
}

export function normalizeHeaders(headers) {
  const out = {};
  for (const [key, value] of Object.entries(headers || {})) {
    out[key.toLowerCase()] = String(value).trim();
  }
  return out;
}

function robotsOk(value) {
  const tokens = new Set(directives(value, ","));
  return tokens.has("noindex") && tokens.has("nofollow");
}

function hstsOk(value) {
  return directives(value, ";").includes(HSTS_DIRECTIVE);
}

function expectedType(path) {
  return path === "/og-image.png" ? "image/png" : "text/html";
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
  const wantType = expectedType(path);
  if (type !== wantType) {
    const why = path === "/og-image.png" ? "og-image" : path === "/" ? "document" : "SPA fallback";
    problems.push(`${label} ${path}: ${why} content-type ${type || "(missing)"}, want ${wantType}`);
  }
  if (!robotsOk(headers["x-robots-tag"])) {
    problems.push(
      `${label} ${path}: x-robots-tag ${JSON.stringify(headers["x-robots-tag"] ?? null)}, want noindex, nofollow`,
    );
  }
  if (!hstsOk(headers["strict-transport-security"])) {
    problems.push(
      `${label} ${path}: strict-transport-security ${JSON.stringify(headers["strict-transport-security"] ?? null)}, want ${HSTS_DIRECTIVE}`,
    );
  }
  return problems;
}

function sameContract(a, b, path) {
  const left = normalizeHeaders(a.headers);
  const right = normalizeHeaders(b.headers);
  const diffs = [];
  if (a.status !== b.status) diffs.push(`status ${a.status} vs ${b.status}`);
  if (directives(left["x-robots-tag"], ",").join(",") !== directives(right["x-robots-tag"], ",").join(",")) {
    diffs.push(`x-robots-tag ${JSON.stringify(left["x-robots-tag"] ?? null)} vs ${JSON.stringify(right["x-robots-tag"] ?? null)}`);
  }
  if (directives(left["strict-transport-security"], ";").join(";") !== directives(right["strict-transport-security"], ";").join(";")) {
    diffs.push(
      `strict-transport-security ${JSON.stringify(left["strict-transport-security"] ?? null)} vs ${JSON.stringify(right["strict-transport-security"] ?? null)}`,
    );
  }
  if (mediaType(left["content-type"]) !== mediaType(right["content-type"])) {
    diffs.push(`content-type ${mediaType(left["content-type"]) || "(missing)"} vs ${mediaType(right["content-type"]) || "(missing)"}`);
  }
  if (!diffs.length) return [];
  return [`${path}: ${diffs.join("; ")}`];
}

/**
 * @param {{ label: string, probes: Record<string, { status: number, headers: Record<string, string> }> }[]} samples
 * @returns {string[]}
 */
export function checkSamples(samples) {
  const problems = [];
  for (const sample of samples) {
    for (const path of PATHS) {
      problems.push(...probeProblems(sample.label, path, sample.probes[path]));
    }
  }
  if (samples.length >= 2) {
    const base = samples[0];
    for (const other of samples.slice(1)) {
      for (const path of PATHS) {
        const left = base.probes[path];
        const right = other.probes[path];
        if (!left || !right) continue;
        for (const line of sameContract(left, right, path)) {
          problems.push(`diff ${base.label} vs ${other.label} ${line}`);
        }
      }
    }
  }
  return problems;
}

export function parseOrigins(argv) {
  const origins = [];
  for (const arg of argv) {
    let url;
    try {
      url = new URL(arg);
    } catch {
      throw new Error(`not a URL: ${arg}`);
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      throw new Error(`URL must be http(s): ${arg}`);
    }
    if (url.pathname !== "/" || url.search || url.hash) {
      throw new Error(`pass an origin only, without a path: ${arg}`);
    }
    origins.push(url.origin);
  }
  if (!origins.length) throw new Error("pass at least one URL");
  return origins;
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
    console.error(`hosting-smoke: ${error.message}`);
    console.error("usage: node scripts/hosting-smoke.mjs <url> [url...]");
    process.exit(2);
  }
  const samples = [];
  for (const origin of origins) {
    samples.push(await probeOrigin(origin));
  }
  const problems = checkSamples(samples);
  if (problems.length) {
    console.error(problems.map((line) => `hosting-smoke: ${line}`).join("\n"));
    process.exit(1);
  }
  const compared = origins.length > 1 ? `, compared ${origins.length} origins` : "";
  console.log(`hosting-smoke ok: ${origins.join(" ")}${compared}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`hosting-smoke: ${error.message}`);
    process.exit(1);
  });
}
