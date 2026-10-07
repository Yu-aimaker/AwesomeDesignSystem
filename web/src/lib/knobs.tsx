import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

/**
 * Site knobs: accent, radius family, font pairing and density. They write
 * data attributes on <html>; src/knobs.css maps them to token overrides.
 * index.html applies the saved values before first paint.
 */
export const accents = [
  { id: "blue", label: { ja: "ブルー", en: "Blue" } },
  { id: "violet", label: { ja: "バイオレット", en: "Violet" } },
  { id: "emerald", label: { ja: "エメラルド", en: "Emerald" } },
  { id: "rose", label: { ja: "ローズ", en: "Rose" } },
  { id: "amber", label: { ja: "アンバー", en: "Amber" } },
  { id: "cyan", label: { ja: "シアン", en: "Cyan" } },
  { id: "orange", label: { ja: "オレンジ", en: "Orange" } },
  { id: "ink", label: { ja: "インク", en: "Ink" } },
] as const;
export const radii = [
  { id: "sharp", label: { ja: "シャープ", en: "Sharp" }, px: "0 / 2 / 4" },
  { id: "soft", label: { ja: "ソフト", en: "Soft" }, px: "8 / 12 / 16" },
  { id: "round", label: { ja: "ラウンド", en: "Round" }, px: "12 / 16 / 20" },
  { id: "pill", label: { ja: "ピル", en: "Pill" }, px: "9999 / 16 / 20" },
] as const;
export const fonts = [
  { id: "geist", label: { ja: "Geist", en: "Geist" }, sample: { ja: "Geist + Noto Sans JP", en: "Geist + Noto Sans JP" } },
  { id: "inter", label: { ja: "Inter", en: "Inter" }, sample: { ja: "Inter + Noto Sans JP", en: "Inter + Noto Sans JP" } },
  { id: "plex", label: { ja: "IBM Plex", en: "IBM Plex" }, sample: { ja: "IBM Plex Sans + Noto Sans JP", en: "IBM Plex Sans + Noto Sans JP" } },
  { id: "manrope", label: { ja: "Manrope", en: "Manrope" }, sample: { ja: "Manrope + Noto Sans JP", en: "Manrope + Noto Sans JP" } },
  { id: "source-serif", label: { ja: "Serif 見出し", en: "Serif headings" }, sample: { ja: "Source Serif 4 の見出し", en: "Source Serif 4 headings" } },
] as const;
export const densities = [
  { id: "comfortable", label: { ja: "標準", en: "Comfortable" }, note: { ja: "40px の操作部品", en: "40px controls" } },
  { id: "compact", label: { ja: "コンパクト", en: "Compact" }, note: { ja: "32px の操作部品", en: "32px controls" } },
] as const;

export type AccentId = (typeof accents)[number]["id"] | "custom";

/** A palette applied from /palettes: one hex per mode so dark mode keeps contrast. */
export interface CustomAccent {
  label: string;
  light: string;
  dark: string;
}
export type RadiusId = (typeof radii)[number]["id"];
export type FontId = (typeof fonts)[number]["id"];
export type DensityId = (typeof densities)[number]["id"];

export interface Knobs {
  accent: AccentId;
  radius: RadiusId;
  font: FontId;
  density: DensityId;
  custom?: CustomAccent;
}

export const defaultKnobs: Knobs = { accent: "blue", radius: "soft", font: "geist", density: "comfortable" };
const KEY = "ds-knobs";

function read(): Knobs {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultKnobs;
    const parsed = JSON.parse(raw) as Partial<Knobs>;
    const custom = isCustom(parsed.custom) ? parsed.custom : undefined;
    return {
      custom,
      accent: accents.some((a) => a.id === parsed.accent) ? (parsed.accent as AccentId) : parsed.accent === "custom" && custom ? "custom" : defaultKnobs.accent,
      radius: radii.some((r) => r.id === parsed.radius) ? (parsed.radius as RadiusId) : defaultKnobs.radius,
      font: fonts.some((f) => f.id === parsed.font) ? (parsed.font as FontId) : defaultKnobs.font,
      density: densities.some((d) => d.id === parsed.density) ? (parsed.density as DensityId) : defaultKnobs.density,
    };
  } catch {
    return defaultKnobs;
  }
}

const HEX = /^#[0-9a-f]{6}$/i;
function isCustom(v: unknown): v is CustomAccent {
  if (!v || typeof v !== "object") return false;
  const c = v as Record<string, unknown>;
  return typeof c.label === "string" && typeof c.light === "string" && HEX.test(c.light) && typeof c.dark === "string" && HEX.test(c.dark);
}

function apply(k: Knobs) {
  const root = document.documentElement;
  if (k.accent === "custom" && k.custom) {
    root.style.setProperty("--ds-custom-accent-light", k.custom.light);
    root.style.setProperty("--ds-custom-accent-dark", k.custom.dark);
  } else {
    root.style.removeProperty("--ds-custom-accent-light");
    root.style.removeProperty("--ds-custom-accent-dark");
  }
  const set = (name: string, value: string, def: string) => {
    if (value === def) root.removeAttribute(name);
    else root.setAttribute(name, value);
  };
  set("data-accent", k.accent, defaultKnobs.accent);
  set("data-radius", k.radius, defaultKnobs.radius);
  set("data-font", k.font, defaultKnobs.font);
  set("data-density", k.density, defaultKnobs.density);
}

interface KnobsContextValue {
  knobs: Knobs;
  set: <K extends keyof Knobs>(key: K, value: Knobs[K]) => void;
  reset: () => void;
  /** Apply an arbitrary accent (from a palette). */
  setCustomAccent: (custom: CustomAccent) => void;
  isDefault: boolean;
}

const KnobsContext = createContext<KnobsContextValue | null>(null);

export function KnobsProvider({ children }: { children: ReactNode }) {
  const [knobs, setKnobs] = useState<Knobs>(() => (typeof window === "undefined" ? defaultKnobs : read()));

  useEffect(() => {
    apply(knobs);
    try {
      if (JSON.stringify(knobs) === JSON.stringify(defaultKnobs)) localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, JSON.stringify(knobs));
    } catch {
      // storage unavailable
    }
  }, [knobs]);

  const set = useCallback(<K extends keyof Knobs>(key: K, value: Knobs[K]) => setKnobs((k) => ({ ...k, [key]: value })), []);
  const reset = useCallback(() => setKnobs(defaultKnobs), []);
  const setCustomAccent = useCallback((custom: CustomAccent) => setKnobs((k) => ({ ...k, accent: "custom", custom })), []);
  const value = useMemo(
    () => ({ knobs, set, reset, setCustomAccent, isDefault: JSON.stringify(knobs) === JSON.stringify(defaultKnobs) }),
    [knobs, set, reset, setCustomAccent],
  );
  return <KnobsContext.Provider value={value}>{children}</KnobsContext.Provider>;
}

export function useKnobs(): KnobsContextValue {
  const ctx = useContext(KnobsContext);
  if (!ctx) throw new Error("useKnobs must be used inside KnobsProvider");
  return ctx;
}
