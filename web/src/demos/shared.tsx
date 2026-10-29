import { useEffect, useState, type ReactNode, type RefObject } from "react";
import { RotateCcw } from "lucide-react";
import type { PlaygroundState } from "../layout/Playground";
import { tokens } from "../lib/tokens";
import { useResolvedTheme } from "../lib/theme";
import { cx } from "../ds/cx";
import { useT } from "../i18n/context";
import { demosMessages } from "../i18n/messages/demos";

/* ------------------------------------------------------------------ */
/* Motion tokens as numbers                                            */
/* ------------------------------------------------------------------ */

export type Vec4 = [number, number, number, number];

const toMs = (v: string) => parseInt(v, 10);

export const DURATION = {
  instant: toMs(tokens.duration.instant.$value),
  fast: toMs(tokens.duration.fast.$value),
  base: toMs(tokens.duration.base.$value),
  slow: toMs(tokens.duration.slow.$value),
  slower: toMs(tokens.duration.slower.$value),
};

export const EASE = {
  out: tokens.easing.out.$value as Vec4,
  in: tokens.easing.in.$value as Vec4,
  inOut: tokens.easing["in-out"].$value as Vec4,
};

export const SPRING = {
  gentle: tokens.spring.gentle.$value,
  snappy: tokens.spring.snappy.$value,
};

/** Names offered in easing selects. The first is the token default. */
export const EASING_OPTIONS = ["ease-out", "ease-in", "ease-in-out", "ease", "linear"] as const;
export type EasingName = (typeof EASING_OPTIONS)[number];

// The CSS default `ease` curve, kept only so the comparison demos can show why it is avoided.
const CSS_EASE: Vec4 = [0.25, 0.1, 0.25, 1];

/** Easing for CSS `transition-timing-function` / `animation-timing-function`. */
export function cssEase(name: string): string {
  switch (name) {
    case "ease-out":
      return "var(--ds-ease-out)";
    case "ease-in":
      return "var(--ds-ease-in)";
    case "ease-in-out":
      return "var(--ds-ease-in-out)";
    case "linear":
      return "linear";
    default:
      return "ease";
  }
}

/** Easing for Motion's `transition.ease`. */
export function motionEase(name: string): Vec4 | "linear" {
  switch (name) {
    case "ease-out":
      return EASE.out;
    case "ease-in":
      return EASE.in;
    case "ease-in-out":
      return EASE.inOut;
    case "linear":
      return "linear";
    default:
      return CSS_EASE;
  }
}

/** The easing as it should appear in a Motion snippet. */
export function motionEaseCode(name: string): string {
  const e = motionEase(name);
  return typeof e === "string" ? `"${e}"` : `[${e.join(", ")}]`;
}

export const sec = (ms: number) => ms / 1000;

/* ------------------------------------------------------------------ */
/* Playground state readers                                            */
/* ------------------------------------------------------------------ */

export const num = (s: PlaygroundState, key: string, fallback: number): number => {
  const v = s[key];
  return typeof v === "number" ? v : fallback;
};
export const str = (s: PlaygroundState, key: string, fallback: string): string => {
  const v = s[key];
  return typeof v === "string" ? v : fallback;
};
export const bool = (s: PlaygroundState, key: string, fallback: boolean): boolean => {
  const v = s[key];
  return typeof v === "boolean" ? v : fallback;
};

/* ------------------------------------------------------------------ */
/* Replay                                                              */
/* ------------------------------------------------------------------ */

export function useReplay(): { key: number; replay: () => void } {
  const [key, setKey] = useState(0);
  return { key, replay: () => setKey((k) => k + 1) };
}

export function ReplayButton({ onClick, label, className }: { onClick: () => void; label?: string; className?: string }) {
  const msg = useT(demosMessages);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "t-label inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline-strong bg-surface px-3 text-ink transition-colors duration-instant ease-out-ds hover:bg-surface-sunken",
        className,
      )}
    >
      <RotateCcw className="size-3.5" strokeWidth={1.75} aria-hidden />
      {label ?? msg.replay}
    </button>
  );
}

/** A demo frame with the replay button in its corner. */
export function DemoFrame({ children, onReplay, className, note }: { children: ReactNode; onReplay?: () => void; className?: string; note?: ReactNode }) {
  return (
    <div className={cx("flex w-full max-w-md flex-col gap-4", className)}>
      {children}
      {(onReplay || note) && (
        <div className="flex items-center justify-between gap-3">
          {note ? <p className="t-caption text-ink-muted">{note}</p> : <span />}
          {onReplay && <ReplayButton onClick={onReplay} />}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Viewport visibility                                                 */
/* ------------------------------------------------------------------ */

export function useInViewport<T extends Element>(ref: RefObject<T | null>, threshold = 0.1): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

/* ------------------------------------------------------------------ */
/* Token colors read from CSS variables                                */
/* ------------------------------------------------------------------ */

/**
 * Resolve any CSS color string to `rgb(r, g, b)` by letting the browser
 * compute it on a probe element. Works for hex, rgb(), color-mix(), etc.
 */
function normalizeColor(raw: string, host: HTMLElement): string {
  if (!raw) return "";
  const probe = document.createElement("span");
  probe.style.color = raw;
  host.appendChild(probe);
  const value = getComputedStyle(probe).color;
  host.removeChild(probe);
  return value || raw;
}

/** Read `--ds-<name>` from the given scope (default: the document root). */
export function readTokenColor(name: string, host: HTMLElement = document.documentElement): string {
  const raw = getComputedStyle(host).getPropertyValue(`--ds-${name}`).trim();
  return normalizeColor(raw, host);
}

function readAll(names: readonly string[], host: HTMLElement): Record<string, string> {
  return Object.fromEntries(names.map((n) => [n, readTokenColor(n, host)]));
}

/**
 * Token colors as computed strings, re-read when the theme or any knob on
 * <html> (data-theme, data-accent, ...) changes. Used by three.js and Lottie,
 * which cannot consume CSS variables directly.
 */
export function useTokenColors(names: readonly string[], scope?: RefObject<HTMLElement | null>): Record<string, string> {
  const theme = useResolvedTheme();
  const joined = names.join(",");
  const [colors, setColors] = useState<Record<string, string>>(() =>
    typeof window === "undefined" ? {} : readAll(names, document.documentElement),
  );

  useEffect(() => {
    const host = scope?.current ?? document.documentElement;
    const read = () => setColors(readAll(joined.split(","), host));
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true });
    return () => obs.disconnect();
  }, [theme, joined, scope]);

  return colors;
}

/** "rgb(r, g, b)" or "#rrggbb" to Lottie's normalized [r, g, b, a]. */
export function colorToLottie(color: string): number[] {
  const m = color.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (m) return [Number(m[1]) / 255, Number(m[2]) / 255, Number(m[3]) / 255, 1];
  const h = color.replace("#", "");
  if (/^[0-9a-f]{3,8}$/i.test(h)) {
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h.slice(0, 6);
    const n = parseInt(full, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1];
  }
  return [0, 0, 0, 1];
}

/* ------------------------------------------------------------------ */
/* Snippet helpers                                                     */
/* ------------------------------------------------------------------ */

/** `duration: 0.2, ease: [0.16, 1, 0.3, 1]` */
export function tweenCode(ms: number, easing: string): string {
  return `duration: ${sec(ms)}, ease: ${motionEaseCode(easing)}`;
}

/** `type: "spring", stiffness: 400, damping: 30` */
export function springCode(stiffness: number, damping: number): string {
  return `type: "spring", stiffness: ${stiffness}, damping: ${damping}`;
}

/** `var(--ds-duration-base)` when the value matches a token, else the raw ms. */
export function cssDuration(ms: number): string {
  const hit = (Object.keys(DURATION) as Array<keyof typeof DURATION>).find((k) => DURATION[k] === ms);
  return hit ? `var(--ds-duration-${hit})` : `${ms}ms`;
}
