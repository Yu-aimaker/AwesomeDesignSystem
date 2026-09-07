// Small color helpers for the palette pages: WCAG contrast and contrast-safe adjustment.
const HEX = /^#([0-9a-f]{6})$/i;

export function isHex(v: string): boolean {
  return HEX.test(v);
}
function toRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function toHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");
}
function luminance(hex: string): number {
  const [r, g, b] = toRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string): number {
  if (!isHex(a) || !isHex(b)) return 0;
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
}
function mix(hex: string, target: string, t: number): string {
  const a = toRgb(hex);
  const b = toRgb(target);
  return toHex([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]);
}
/**
 * Moves `hex` towards black (on light canvas) or white (on dark canvas) in
 * small steps until it reaches `min` contrast on `canvas`. Returns the input
 * unchanged when it already passes.
 */
export function ensureContrast(hex: string, canvas: string, min = 4.5): { hex: string; adjusted: boolean } {
  if (!isHex(hex) || !isHex(canvas)) return { hex, adjusted: false };
  if (contrast(hex, canvas) >= min) return { hex, adjusted: false };
  const towards = luminance(canvas) > 0.5 ? "#000000" : "#ffffff";
  let out = hex;
  for (let i = 1; i <= 40; i++) {
    out = mix(hex, towards, i / 40);
    if (contrast(out, canvas) >= min) return { hex: out, adjusted: true };
  }
  return { hex: towards, adjusted: true };
}
/** Best text color (ink or canvas) on a given background. */
export function onColor(bg: string, ink = "#0a0a0a", canvas = "#ffffff"): string {
  return contrast(bg, ink) >= contrast(bg, canvas) ? ink : canvas;
}
