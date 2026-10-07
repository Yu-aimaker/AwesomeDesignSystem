#!/usr/bin/env node
// Probe live og:image / twitter:image for the /sources flagship set.
// Does not write files. Committed JPEGs live in web/public/ogp/.
// Run: node scripts/fetch-flagship-ogp.mjs
const targets = [
  ["apple-hig", "https://developer.apple.com/design/human-interface-guidelines"],
  ["material-design", "https://m3.material.io/"],
  ["vercel-design", "https://vercel.com/geist/introduction"],
  ["shadcn-ui", "https://ui.shadcn.com/"],
  ["goodpatch", "https://goodpatch.com/"],
  ["duolingo", "https://design.duolingo.com/"],
  ["digital-agency-jp", "https://design.digital.go.jp/"],
  ["fluent", "https://fluent2.microsoft.design/"],
  ["carbon", "https://carbondesignsystem.com/"],
  ["polaris", "https://polaris.shopify.com/"],
  ["primer", "https://primer.style/"],
  ["atlassian", "https://atlassian.design/"],
  ["stripe", "https://stripe.com/"],
  ["linear", "https://linear.app/"],
  ["smarthr", "https://smarthr.design/"],
  ["spectrum", "https://spectrum.adobe.com/"],
  ["antd", "https://ant.design/"],
  ["base-ui", "https://base-ui.com/"],
  ["radix", "https://www.radix-ui.com/primitives"],
  ["govuk", "https://design-system.service.gov.uk/"],
  ["uswds", "https://designsystem.digital.gov/"],
  ["gitlab-pajamas", "https://design.gitlab.com/"],
  ["nordhealth", "https://nordhealth.design/"],
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
