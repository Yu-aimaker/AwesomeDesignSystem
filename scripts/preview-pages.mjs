#!/usr/bin/env node
// Opens the preview routes in Chromium at 390 and 1280, light and dark.
// Fails on a non-200 document, a console error, or horizontal overflow.
// Screenshots go to the directory given as the second argument.
//
//   node scripts/preview-pages.mjs <origin> <out-dir>
//
// Uses the Playwright install from web/. Does not change the site.
import { createRequire } from "node:module";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parseOrigins } from "./hosting-smoke.mjs";
import { PATHS } from "./preview-headers.mjs";

const require = createRequire(new URL("../web/package.json", import.meta.url));
const { chromium } = require("playwright");

process.env.PLAYWRIGHT_BROWSERS_PATH ??= "/opt/pw-browsers";

const widths = [390, 1280];
const themes = ["light", "dark"];

function fileName(route, width, theme) {
  const slug = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
  return `${slug}-${width}-${theme}.png`;
}

async function main() {
  const [originArg, outArg] = process.argv.slice(2);
  if (!originArg || !outArg) {
    console.error("usage: node scripts/preview-pages.mjs <origin> <out-dir>");
    process.exit(2);
  }
  const [origin] = parseOrigins([originArg]);
  const outDir = resolve(outArg);
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const problems = [];
  try {
    for (const theme of themes) {
      for (const width of widths) {
        const context = await browser.newContext({
          viewport: { width, height: width < 768 ? 844 : 800 },
          deviceScaleFactor: 1,
          colorScheme: theme,
          locale: "ja-JP",
        });
        await context.addInitScript((value) => localStorage.setItem("ds-theme", value), theme);
        const page = await context.newPage();
        page.on("pageerror", (err) => problems.push(`${theme} ${width} pageerror: ${err.message}`));
        page.on("console", (msg) => {
          if (msg.type() === "error") problems.push(`${theme} ${width} console: ${msg.text()}`);
        });
        for (const route of PATHS) {
          const response = await page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });
          const status = response?.status() ?? 0;
          if (status !== 200) problems.push(`${theme} ${width} ${route}: status ${status}, want 200`);
          await page.waitForTimeout(400);
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
          );
          if (overflow > 0) problems.push(`${theme} ${width} ${route}: horizontal overflow ${overflow}px`);
          const name = fileName(route, width, theme);
          await page.screenshot({ path: resolve(outDir, name), fullPage: true });
          console.log("saved", name);
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  if (problems.length) {
    console.error(problems.map((line) => `preview-pages: ${line}`).join("\n"));
    process.exit(1);
  }
  console.log(`preview-pages ok: ${PATHS.length} routes × ${widths.length} × ${themes.length}`);
}

main().catch((error) => {
  console.error(`preview-pages: ${error.message}`);
  process.exit(1);
});
