import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig(({ command, isPreview }) => ({
  // GitHub Pages project site lives under the repository name. `vite preview`
  // serves the built output, so it uses the same base as the build.
  base: command === "build" || isPreview ? "/Awesome-Design-Systems-Claude/" : "/",
  plugins: [react(), tailwindcss()],
  server: {
    fs: { allow: [repoRoot] },
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 1200,
  },
}));
