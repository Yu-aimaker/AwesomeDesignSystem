import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const isProd = process.env.NODE_ENV === "production";
const tracedContent = [
  "assets/**/*.svg",
  "content/**/*.json",
  "design-system/**/*.md",
  "reports/**/*.json",
];
const contentBackedRoutes = [
  "/",
  "/api/v1/manifest",
  "/api/v1/references",
  "/api/v1/rules",
  "/artifacts/[id]",
  "/brand",
  "/brand/workbench",
  "/canon",
  "/canon/[...slug]",
  "/components",
  "/components/[slug]",
  "/foundations",
  "/interaction",
  "/llms.txt",
  "/motion",
  "/motion/[slug]",
  "/patterns",
  "/playground",
  "/principles",
  "/references",
  "/references/[id]",
  "/review",
  "/rules/[id]",
  "/sitemap.xml",
  "/status",
] as const;

// Disable powerful features the docs site never uses.
const permissionsPolicy = [
  "accelerometer=()",
  "autoplay=()",
  "camera=()",
  "display-capture=()",
  "encrypted-media=()",
  "fullscreen=(self)",
  "geolocation=()",
  "gyroscope=()",
  "magnetometer=()",
  "microphone=()",
  "payment=()",
  "usb=()",
  "browsing-topics=()",
  "interest-cohort=()",
].join(", ");

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Permissions-Policy", value: permissionsPolicy },
  // HSTS only in production so localhost is never pinned to HTTPS.
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  transpilePackages: [
    "@awesome-ds/brand",
    "@awesome-ds/content",
    "@awesome-ds/core",
    "@awesome-ds/motion",
    "@awesome-ds/react",
    "@awesome-ds/tokens",
  ],
  outputFileTracingRoot: root,
  turbopack: {
    root,
  },
  outputFileTracingIncludes: Object.fromEntries(
    contentBackedRoutes.map((route) => [route, tracedContent]),
  ),
};

export default nextConfig;
