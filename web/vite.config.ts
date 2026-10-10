import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

// Vercel serves the site at the domain root, so "/" is the default. Set
// SITE_BASE (for example "/AwesomeDesignSystem/") to build for a
// host that serves the site under a path. `vite preview` uses the build base.
const productionBase = process.env.SITE_BASE ?? "/";

export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? productionBase : "/",
  plugins: [react(), tailwindcss()],
  server: {
    fs: { allow: [repoRoot] },
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1200,
  },
}));
