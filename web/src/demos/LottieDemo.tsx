import { useMemo } from "react";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
// The package export map has no entry for the wasm, so it is addressed from the project root.
import wasmUrl from "/node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm?url";
import { useReducedMotion } from "../lib/theme";
import { colorToLottie, useReplay, useTokenColors, ReplayButton } from "./shared";

// Bundle the renderer instead of loading it from a CDN.
setWasmUrl(wasmUrl);

/*
 * Hand-written Lottie documents. Colors are read from the CSS variables on
 * <html> at mount and whenever the theme or a knob changes, then converted to
 * Lottie's normalized RGBA. No color literal lives in this file.
 */

// Two easing handles that match --ds-ease-out.
const easeOut = { i: { x: [0.16], y: [1] }, o: { x: [0.3], y: [0] } };
const transform = { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } };
const group = (items: unknown[]) => ({ ty: "gr", it: [...items, transform] });
const layerBase = (ind: number, nm: string, op: number) => ({ ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op, st: 0 });
const staticKs = (p: number[]) => ({ o: { a: 0, k: 100 }, r: { a: 0, k: 0 }, p: { a: 0, k: p }, a: { a: 0, k: [0, 0, 0] }, s: { a: 0, k: [100, 100, 100] } });
const doc = (w: number, h: number, op: number, layers: unknown[]) => ({ v: "5.7.4", fr: 60, ip: 0, op, w, h, nm: "AwesomeDS", ddd: 0, assets: [], layers });

/* ------------------------------------------------------------------ */
/* Original sample: dot travels, bar grows                             */
/* ------------------------------------------------------------------ */

function buildSample(accent: number[], ink: number[]) {
  return doc(240, 120, 120, [
    {
      ...layerBase(1, "dot", 120),
      ks: {
        ...staticKs([40, 60, 0]),
        p: { a: 1, k: [{ t: 0, s: [40, 60, 0], ...easeOut }, { t: 60, s: [200, 60, 0], ...easeOut }, { t: 120, s: [40, 60, 0] }] },
      },
      shapes: [group([{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [20, 20] } }, { ty: "fl", c: { a: 0, k: accent }, o: { a: 0, k: 100 } }])],
    },
    {
      ...layerBase(2, "bar", 120),
      ks: {
        ...staticKs([40, 90, 0]),
        s: { a: 1, k: [{ t: 0, s: [0, 100, 100], ...easeOut }, { t: 60, s: [100, 100, 100], ...easeOut }, { t: 120, s: [0, 100, 100] }] },
      },
      shapes: [group([{ ty: "rc", p: { a: 0, k: [80, 0] }, s: { a: 0, k: [160, 4] }, r: { a: 0, k: 2 } }, { ty: "fl", c: { a: 0, k: ink }, o: { a: 0, k: 100 } }])],
    },
  ]);
}

export function LottieDemo() {
  const reduced = useReducedMotion();
  const colors = useTokenColors(["accent", "ink"]);
  const data = useMemo(() => buildSample(colorToLottie(colors.accent), colorToLottie(colors.ink)), [colors.accent, colors.ink]);
  return (
    <div className="w-full max-w-sm rounded-lg border border-hairline bg-canvas-soft p-4">
      <DotLottieReact key={`${colors.accent}${colors.ink}`} data={data as unknown as Record<string, unknown>} loop autoplay={!reduced} className="h-32 w-full" aria-label="Lottie アニメーションの例" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LottieProgress: circle stroke, then a check mark draws on           */
/* ------------------------------------------------------------------ */

export interface LottieProgressProps {
  frames?: number; // total length; 60 = 1s at fr 60
  stroke?: number; // px
  loop?: boolean;
}

function buildCheck(success: number[], hairline: number[], frames: number, stroke: number) {
  const circleEnd = Math.round(frames * 0.6);
  const strokeShape = (c: number[], w: number) => ({ ty: "st", c: { a: 0, k: c }, o: { a: 0, k: 100 }, w: { a: 0, k: w }, lc: 2, lj: 2 });
  const trim = (from: number, to: number) => ({ ty: "tm", s: { a: 0, k: 0 }, e: { a: 1, k: [{ t: from, s: [0], ...easeOut }, { t: to, s: [100] }] }, o: { a: 0, k: 0 }, m: 1 });
  return doc(120, 120, frames, [
    {
      ...layerBase(1, "check", frames),
      ks: staticKs([60, 60, 0]),
      shapes: [
        group([
          { ty: "sh", ks: { a: 0, k: { c: false, v: [[-18, 2], [-6, 14], [20, -14]], i: [[0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0]] } } },
          trim(circleEnd, frames),
          strokeShape(success, stroke),
        ]),
      ],
    },
    {
      ...layerBase(2, "ring", frames),
      ks: staticKs([60, 60, 0]),
      shapes: [group([{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [88, 88] } }, trim(0, circleEnd), strokeShape(success, stroke)])],
    },
    {
      ...layerBase(3, "track", frames),
      ks: staticKs([60, 60, 0]),
      shapes: [group([{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [88, 88] } }, strokeShape(hairline, stroke)])],
    },
  ]);
}

/** Ring fills, then the check draws on via trim paths. Colors: success and hairline tokens. */
export function LottieProgress({ frames = 60, stroke = 4, loop = false }: LottieProgressProps) {
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const colors = useTokenColors(["success", "hairline"]);
  const data = useMemo(() => buildCheck(colorToLottie(colors.success), colorToLottie(colors.hairline), frames, stroke), [colors.success, colors.hairline, frames, stroke]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="rounded-lg border border-hairline bg-canvas-soft p-4">
        <DotLottieReact
          key={`${key}-${colors.success}-${frames}-${stroke}`}
          data={data as unknown as Record<string, unknown>}
          loop={loop && !reduced}
          autoplay={!reduced}
          segment={reduced ? [frames - 1, frames] : undefined}
          className="mx-auto h-32 w-32"
          aria-label="完了のチェックマーク"
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="t-caption text-ink-muted">{reduced ? "reduced motion: 最終フレーム" : `${frames} フレーム = ${(frames / 60).toFixed(2)}s`}</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LottieDots: loading dots                                            */
/* ------------------------------------------------------------------ */

export interface LottieDotsProps {
  dots?: number; // 3..5
  speed?: number; // playback multiplier
  bounce?: boolean; // move up 4px as well as fade
}

function buildDots(ink: number[], dots: number, bounce: boolean) {
  const frames = 60;
  const spacing = 20;
  const x0 = 60 - ((dots - 1) * spacing) / 2;
  return doc(
    120,
    40,
    frames,
    Array.from({ length: dots }, (_, i) => {
      const offset = Math.round((i / dots) * frames);
      const at = (t: number) => (t + offset) % frames;
      const keys = <T,>(a: T, b: T) =>
        [
          { t: 0, s: a },
          { t: at(0) || 1, s: a, ...easeOut },
          { t: at(Math.round(frames / dots / 2)), s: b, ...easeOut },
          { t: at(Math.round(frames / dots)), s: a },
          { t: frames, s: a },
        ].sort((p, q) => p.t - q.t);
      const x = x0 + i * spacing;
      return {
        ...layerBase(i + 1, `dot-${i}`, frames),
        ks: {
          o: { a: 1, k: keys([30], [100]) },
          r: { a: 0, k: 0 },
          p: bounce ? { a: 1, k: keys([x, 22, 0], [x, 18, 0]) } : { a: 0, k: [x, 20, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        shapes: [group([{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [8, 8] } }, { ty: "fl", c: { a: 0, k: ink }, o: { a: 0, k: 100 } }])],
      };
    }),
  );
}

/** Loading dots: the one allowed loop, in ink. Static under reduced motion. */
export function LottieDots({ dots = 3, speed = 1, bounce = false }: LottieDotsProps) {
  const reduced = useReducedMotion();
  const colors = useTokenColors(["ink"]);
  const n = Math.max(3, Math.min(5, dots));
  const data = useMemo(() => buildDots(colorToLottie(colors.ink), n, bounce), [colors.ink, n, bounce]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="rounded-lg border border-hairline bg-canvas-soft p-4" role="status" aria-label="読み込み中">
        <DotLottieReact key={`${colors.ink}-${n}-${bounce}`} data={data as unknown as Record<string, unknown>} loop={!reduced} autoplay={!reduced} speed={speed} className="mx-auto h-10 w-32" />
      </div>
      <p className="t-caption text-ink-muted">{reduced ? "reduced motion: 静止" : `${n} 点、speed ${speed}`}</p>
    </div>
  );
}
