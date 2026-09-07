// Fonts shown only on /fonts are loaded on demand, so the rest of the site
// pays for nothing. Each import is a fontsource CSS file; the browser fetches
// a woff2 only when a specimen actually uses the family.
const extra: Record<string, () => Promise<unknown>> = {
  "@fontsource-variable/dm-sans": () => import("@fontsource-variable/dm-sans"),
  "@fontsource-variable/space-grotesk": () => import("@fontsource-variable/space-grotesk"),
  "@fontsource-variable/jetbrains-mono": () => import("@fontsource-variable/jetbrains-mono"),
  "@fontsource-variable/plus-jakarta-sans": () => import("@fontsource-variable/plus-jakarta-sans"),
  "@fontsource-variable/outfit": () => import("@fontsource-variable/outfit"),
  "@fontsource-variable/fraunces": () => import("@fontsource-variable/fraunces"),
  "@fontsource-variable/figtree": () => import("@fontsource-variable/figtree"),
  "@fontsource-variable/public-sans": () => import("@fontsource-variable/public-sans"),
  "@fontsource/zen-kaku-gothic-new": () => Promise.all([import("@fontsource/zen-kaku-gothic-new/400.css"), import("@fontsource/zen-kaku-gothic-new/700.css")]),
  "@fontsource/biz-udpgothic": () => Promise.all([import("@fontsource/biz-udpgothic/400.css"), import("@fontsource/biz-udpgothic/700.css")]),
  "@fontsource/m-plus-1p": () => Promise.all([import("@fontsource/m-plus-1p/400.css"), import("@fontsource/m-plus-1p/700.css")]),
  "@fontsource/noto-serif-jp": () => Promise.all([import("@fontsource/noto-serif-jp/400.css"), import("@fontsource/noto-serif-jp/700.css")]),
};

let started = false;
/** Loads every on-demand font once. Failures are ignored: the specimen falls back. */
export function loadSpecimenFonts(): Promise<void> {
  if (started) return Promise.resolve();
  started = true;
  return Promise.allSettled(Object.values(extra).map((load) => load())).then(() => undefined);
}
