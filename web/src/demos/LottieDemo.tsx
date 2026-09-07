import { useMemo } from "react";
import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";
// The package export map has no entry for the wasm, so it is addressed from the project root.
import wasmUrl from "/node_modules/@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm?url";
import { useReducedMotion, useResolvedTheme } from "../lib/theme";
import { colorValue } from "../lib/tokens";
import { hexToRgb } from "../lib/contrast";

// Bundle the renderer instead of loading it from a CDN.
setWasmUrl(wasmUrl);

function lottieColor(hex: string): number[] {
  const [r, g, b] = hexToRgb(hex);
  return [r / 255, g / 255, b / 255, 1];
}

// Two easing handles that match --ds-ease-out.
const easeOut = { i: { x: [0.16], y: [1] }, o: { x: [0.3], y: [0] } };

/** A hand-written Lottie document: a dot travels along a line and a bar grows. */
function buildAnimation(accent: string, ink: string) {
  const dotColor = lottieColor(accent);
  const barColor = lottieColor(ink);
  const shapeGroup = (items: unknown[]) => ({
    ty: "gr",
    it: [...items, { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }],
  });
  return {
    v: "5.7.4",
    fr: 60,
    ip: 0,
    op: 120,
    w: 240,
    h: 120,
    nm: "AwesomeDS sample",
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: "dot",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: {
            a: 1,
            k: [
              { t: 0, s: [40, 60, 0], ...easeOut },
              { t: 60, s: [200, 60, 0], ...easeOut },
              { t: 120, s: [40, 60, 0] },
            ],
          },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: [shapeGroup([{ ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [20, 20] } }, { ty: "fl", c: { a: 0, k: dotColor }, o: { a: 0, k: 100 } }])],
        ip: 0,
        op: 120,
        st: 0,
      },
      {
        ddd: 0,
        ind: 2,
        ty: 4,
        nm: "bar",
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [40, 90, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: {
            a: 1,
            k: [
              { t: 0, s: [0, 100, 100], ...easeOut },
              { t: 60, s: [100, 100, 100], ...easeOut },
              { t: 120, s: [0, 100, 100] },
            ],
          },
        },
        ao: 0,
        shapes: [
          shapeGroup([
            { ty: "rc", p: { a: 0, k: [80, 0] }, s: { a: 0, k: [160, 4] }, r: { a: 0, k: 2 } },
            { ty: "fl", c: { a: 0, k: barColor }, o: { a: 0, k: 100 } },
          ]),
        ],
        ip: 0,
        op: 120,
        st: 0,
      },
    ],
  };
}

export function LottieDemo() {
  const theme = useResolvedTheme();
  const reduced = useReducedMotion();
  const data = useMemo(() => buildAnimation(colorValue(theme, "accent"), colorValue(theme, "ink")), [theme]);
  return (
    <div className="w-full max-w-sm rounded-lg border border-hairline bg-canvas-soft p-4">
      <DotLottieReact key={theme} data={data as unknown as Record<string, unknown>} loop autoplay={!reduced} className="h-32 w-full" aria-label="Lottie アニメーションの例" />
    </div>
  );
}
