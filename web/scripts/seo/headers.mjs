// Security headers for the assets-only Worker. No X-Robots-Tag here:
// production stays indexable. Preview sends noindex from preview-spa-fallback.js.
// script-src hashes the fixed theme bootstrap. JSON-LD is type=application/ld+json,
// so it does not need script 'unsafe-inline'. style-src keeps 'unsafe-inline' for style attributes.
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function bootstrapScriptHashes(html) {
  const source = html ?? readFileSync(join(dirname(fileURLToPath(import.meta.url)), "../../index.html"), "utf8");
  const hashes = [...source.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((match) => {
    const digest = createHash("sha256").update(match[1]).digest("base64");
    return `'sha256-${digest}'`;
  });
  if (!hashes.length) throw new Error("index.html has no bootstrap script to hash");
  return hashes;
}

const scriptSrc = ["'self'", ...bootstrapScriptHashes(), "'wasm-unsafe-eval'"].join(" ");

export const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `script-src ${scriptSrc}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

export function renderHeaders() {
  return `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=63072000
  Content-Security-Policy: ${CSP}

/assets/*
  Cache-Control: public, max-age=31536000, immutable
`;
}
