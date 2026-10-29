import { useEffect, useId, useState, useSyncExternalStore, type AnimationEvent } from "react";
import "./mascot.css";

export const mascotMotions = ["idle", "wave", "happy", "blink", "nod"] as const;
export type MascotMotion = (typeof mascotMotions)[number];
export type MascotPose = "neutral" | "wave" | "happy" | "blink" | "nod";

/** The keyframes that end last for each motion; its animationend means the motion is over. */
const lastKeyframes: Record<MascotMotion, string> = {
  idle: "mascot-breathe",
  wave: "mascot-wave",
  happy: "mascot-jump",
  blink: "mascot-blink",
  nod: "mascot-nod",
};

/** Static pose shown instead of each motion under reduced motion. */
const reducedPose: Record<MascotMotion, MascotPose> = { idle: "neutral", wave: "wave", happy: "happy", blink: "blink", nod: "nod" };

const query = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

// Body: the icon's "A" silhouette closed into one shape on the 96 grid, integer points only.
// Corners (33,24) (63,24) (78,72) (18,72) give the A's 5:16 side slope; each is rounded by about 10.
const MASCOT_BODY = "M43 24H53Q63 24 66 34L75 62Q78 72 68 72H28Q18 72 21 62L30 34Q33 24 43 24Z";
// Accent tiles for "happy": centre x, centre y, side, corner radius. Even sides keep the corners on the grid.
const SPARKS: Array<[number, number, number, number]> = [
  [16, 26, 6, 2],
  [80, 22, 6, 2],
  [10, 46, 4, 1],
  [86, 44, 4, 1],
];

export interface MascotProps {
  /** Plays once per `playKey`. Omit for a still figure in `pose`. */
  motion?: MascotMotion;
  /** Change to replay the same motion. */
  playKey?: number;
  /** Still pose when no motion plays. */
  pose?: MascotPose;
  paused?: boolean;
  /** Page-level reduced motion; the OS setting is always honoured as well. */
  reduced?: boolean;
  /** Pixel size or any CSS length. Omit to size with `className`. */
  size?: number | string;
  /** Accessible name. Without it the figure is decorative (aria-hidden). */
  title?: string;
  className?: string;
  onMotionEnd?: () => void;
}

export function Mascot({ motion, playKey = 0, pose = "neutral", paused = false, reduced = false, size, title, className, onMotionEnd }: MascotProps) {
  const clipId = `mascot-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const isReduced = usePrefersReducedMotion() || reduced;
  // Under reduced motion a blink is a closed-eyes frame swapped back within 100ms, not an animation.
  const [eyesShut, setEyesShut] = useState(false);
  useEffect(() => {
    if (!isReduced || motion !== "blink") return;
    setEyesShut(true);
    const id = window.setTimeout(() => setEyesShut(false), 100);
    return () => window.clearTimeout(id);
  }, [isReduced, motion, playKey]);

  const shown: MascotPose = motion && isReduced ? (motion === "blink" ? (eyesShut ? "blink" : "neutral") : reducedPose[motion]) : motion ? "neutral" : pose;
  const onAnimationEnd = (e: AnimationEvent<HTMLSpanElement>) => {
    if (motion && e.animationName === lastKeyframes[motion]) onMotionEnd?.();
  };

  // The jump runs on an HTML wrapper so its translateY is in CSS px at every rendered size;
  // inside the SVG, px are viewBox units and would scale with the figure.
  return (
    <span
      className={className}
      style={size === undefined ? undefined : { width: size, height: size }}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      data-mascot=""
      data-motion={motion && !isReduced ? motion : undefined}
      data-pose={shown}
      data-paused={paused || undefined}
      data-reduced={isReduced || undefined}
      onAnimationEnd={onAnimationEnd}
    >
      <span key={playKey} className="m-jump">
        <svg viewBox="0 0 96 96" focusable="false">
          <defs>
            <clipPath id={clipId}>
              <path d={MASCOT_BODY} />
            </clipPath>
          </defs>
          <g className="m-ink">
            <rect x="30" y="64" width="13" height="14" rx="5" />
            <rect x="53" y="64" width="13" height="14" rx="5" />
          </g>
          <g className="m-torso">
            <g className="m-arm m-arm-l m-ink">
              <rect x="26" y="43" width="8" height="22" rx="4" />
            </g>
            <g className="m-arm m-arm-r m-ink">
              <rect x="62" y="43" width="8" height="22" rx="4" />
            </g>
            <path className="m-ink" d={MASCOT_BODY} />
            <rect className="m-accent" x="0" y="54" width="96" height="7" clipPath={`url(#${clipId})`} />
            <g className="m-face m-canvas">
              <g className="m-eyes">
                <ellipse cx="40" cy="41" rx="4" ry="5" />
                <ellipse cx="56" cy="41" rx="4" ry="5" />
              </g>
              <rect className="m-mouth" x="45" y="48" width="6" height="2" rx="1" />
            </g>
          </g>
          <g className="m-sparks m-accent">
            {SPARKS.map(([x, y, s, r], i) => (
              <rect key={i} className="m-spark" x={x - s / 2} y={y - s / 2} width={s} height={s} rx={r} transform={`rotate(45 ${x} ${y})`} />
            ))}
          </g>
        </svg>
      </span>
    </span>
  );
}
