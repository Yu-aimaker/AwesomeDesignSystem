// Security headers for the assets-only Worker. No X-Robots-Tag here:
// production stays indexable. Preview sends noindex from preview-spa-fallback.js.
// script-src allows inline scripts because each page has its own JSON-LD block.
// A hash would disable 'unsafe-inline', and one global hash cannot cover every page.
export const CSP = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
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
