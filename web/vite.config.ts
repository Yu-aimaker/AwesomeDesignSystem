import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

// Vercel serves the site at the domain root. GitHub Pages serves a project site
// under the repository name. `vite preview` uses the same base as the build.
// Set SITE_BASE to override either.
const onVercel = process.env.VERCEL === "1";
const pagesBase = "/Awesome-Design-Systems-Claude/";
const productionBase = process.env.SITE_BASE ?? (onVercel ? "/" : pagesBase);

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
