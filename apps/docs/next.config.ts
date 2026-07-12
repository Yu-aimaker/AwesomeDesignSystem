import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const nextConfig: NextConfig = {
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
};

export default nextConfig;
