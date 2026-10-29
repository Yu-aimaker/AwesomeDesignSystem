#!/usr/bin/env node
// Probe live og:image / twitter:image for the /sources flagship set.
// Committed JPEGs live in web/public/ogp/.
// Probe only:   node scripts/fetch-flagship-ogp.mjs
// Write JPEGs:  node scripts/fetch-flagship-ogp.mjs --write primer antd
//   Downloads the og:image (else twitter:image) of the listed ids and stores a
//   1200x630 cover-cropped JPEG via ffmpeg (lanczos, -q:v 3). Look at the result
//   before committing: a small logo on a padded canvas is worse than the poster.
//
// Some ids probe another official page than the card URL, because the card
// URL's own og:image is missing or weak (see `ogp.note` in design-systems.ts).
const targets = [
  ["apple-hig", "https://developer.apple.com/design/human-interface-guidelines"],
  ["material-design", "https://m3.material.io/"],
  ["vercel-design", "https://vercel.com/geist/introduction"],
  ["shadcn-ui", "https://ui.shadcn.com/"],
  ["goodpatch", "https://goodpatch.com/"],
  // design.duolingo.com only exposes the Ghost blog logo.
  ["duolingo", "https://www.duolingo.com/"],
  ["digital-agency-jp", "https://design.digital.go.jp/"],
  ["fluent", "https://fluent2.microsoft.design/"],
  ["carbon", "https://carbondesignsystem.com/"],
  // polaris.shopify.com redirects to shopify.dev (generic Shopify card).
  ["polaris", "https://github.com/Shopify/polaris-react"],
  // primer.style root renders meta client-side; the docs pages carry it.
  ["primer", "https://primer.style/product/getting-started/"],
  ["atlassian", "https://atlassian.design/"],
  ["stripe", "https://stripe.com/"],
  ["linear", "https://linear.app/"],
  ["smarthr", "https://smarthr.design/"],
  ["spectrum", "https://spectrum.adobe.com/"],
  // ant.design pages all share a 200x200 logo.
  ["antd", "https://github.com/ant-design/ant-design"],
  ["base-ui", "https://base-ui.com/"],
  ["radix", "https://www.radix-ui.com/primitives"],
  ["govuk", "https://design-system.service.gov.uk/"],
  // 200x200 logo on every page; card uses the poster.
  ["uswds", "https://designsystem.digital.gov/"],
  ["gitlab-pajamas", "https://design.gitlab.com/"],
  ["nordhealth", "https://nordhealth.design/"],
  // No og:image; card uses the poster.
  ["inclusive-components", "https://inclusive-components.design/"],
  ["laws-of-ux", "https://lawsofux.com/"],
  ["refactoring-ui", "https://www.refactoringui.com/"],
  ["nielsen", "https://www.nngroup.com/articles/ten-usability-heuristics/"],
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

function attr(html, name) {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${name}["'][^>]+content=["']([^"']+)["']`,
    "i",
  );
  const re2 = new RegExp(
    `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${name}["']`,
    "i",
  );
  return html.match(re)?.[1] || html.match(re2)?.[1] || null;
}

function abs(base, maybe) {
  if (!maybe) return null;
  try {
    return new URL(maybe.replace(/&amp;/g, "&"), base).href;
  } catch {
    return null;
  }
}

const rows = [];
for (const [id, url] of targets) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(20000),
    });
    const html = (await res.text()).slice(0, 400_000);
    rows.push({
      id,
      http: res.status,
      ogImage: abs(res.url, attr(html, "og:image") || attr(html, "og:image:url")),
      twitterImage: abs(res.url, attr(html, "twitter:image") || attr(html, "twitter:image:src")),
    });
  } catch (e) {
    rows.push({ id, error: String(e) });
  }
}

const withImage = rows.filter((r) => r.ogImage || r.twitterImage);
console.log(JSON.stringify(rows, null, 2));
console.log(`live OGP ${withImage.length}/${rows.length}`);

const writeAt = process.argv.indexOf("--write");
if (writeAt !== -1) {
  const { execFileSync } = await import("node:child_process");
  const { mkdtempSync, writeFileSync, rmSync } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join, dirname } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "web", "public", "ogp");
  const ids = process.argv.slice(writeAt + 1);
  const tmp = mkdtempSync(join(tmpdir(), "ogp-"));
  try {
    for (const id of ids) {
      const row = rows.find((r) => r.id === id);
      const src = row?.ogImage || row?.twitterImage;
      if (!src) {
        console.error(`${id}: no og:image / twitter:image, skipped`);
        continue;
      }
      const res = await fetch(src, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(30000) });
      const raw = join(tmp, `${id}.src`);
      writeFileSync(raw, Buffer.from(await res.arrayBuffer()));
      const out = join(outDir, `${id}.jpg`);
      execFileSync("ffmpeg", [
        "-v", "error", "-y", "-i", raw, "-frames:v", "1",
        "-vf", "scale=1200:630:force_original_aspect_ratio=increase:flags=lanczos,crop=1200:630",
        "-q:v", "3", out,
      ]);
      console.log(`${id}: ${src} -> web/public/ogp/${id}.jpg`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
