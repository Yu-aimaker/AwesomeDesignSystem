/**
 * Canonical CMY logomark geometry — the single source of truth for the
 * AwesomeDS brand signature. Three overlapping circles (cyan · magenta ·
 * yellow) in subtractive mixing: the 🎨 metaphor drawn, not a logo wall.
 *
 * Shared across: site header (`<CmyMark>`), Open Graph image, `assets/banner.svg`,
 * and `app/icon.svg`. Ratios are fixed so the mark never silently drifts.
 */
export const CMY = {
  cyan: "#15C7DE",
  magenta: "#FF2EA6",
  yellow: "#FFD400",
  ink: "#18181D",
  paper: "#FAFAF9",
  spectrum: [
    "#E5484D",
    "#F2711C",
    "#F5C518",
    "#46C26B",
    "#1FB8B8",
    "#3E7BFA",
    "#7C5CFC",
    "#D6409F",
  ],
} as const;

/**
 * Circle layout as fractions of a unit side (viewBox = unit × unit).
 * Three circles of radius 0.34, centers form an equilateral-ish cluster.
 */
export const CMY_MARK = {
  /** Circle radius ÷ unit — sized to stay inside the unit square. */
  radiusRatio: 0.30,
  centers: [
    { id: "cyan", x: 0.5, y: 0.34, fill: CMY.cyan },
    { id: "magenta", x: 0.34, y: 0.64, fill: CMY.magenta },
    { id: "yellow", x: 0.66, y: 0.64, fill: CMY.yellow },
  ],
} as const;

export type CmyMarkGeometry = {
  unit: number;
  radius: number;
  circles: Array<{ id: string; cx: number; cy: number; r: number; fill: string }>;
  width: number;
  height: number;
};

const round = (value: number) => Math.round(value * 1000) / 1000;

/** Compute concrete pixel geometry for a CMY mark of the given unit side. */
export function computeCmyMark(unit: number): CmyMarkGeometry {
  const radius = round(unit * CMY_MARK.radiusRatio);
  return {
    unit,
    radius,
    circles: CMY_MARK.centers.map((c) => ({
      id: c.id,
      cx: round(unit * c.x),
      cy: round(unit * c.y),
      r: radius,
      fill: c.fill,
    })),
    width: unit,
    height: unit,
  };
}

/** Canonical authoring unit used by banner / OG / header (integer-friendly). */
export const CMY_MARK_UNIT = 72;
