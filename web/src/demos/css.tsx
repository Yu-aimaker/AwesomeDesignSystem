import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "../lib/theme";
import { cx } from "../ds/cx";
import { DURATION, DemoFrame, cssEase, useReplay } from "./shared";
import { useT } from "../i18n/context";
import { demosMessages } from "../i18n/messages/demos";

/* ------------------------------------------------------------------ */
/* KeyframeSpinner                                                     */
/* ------------------------------------------------------------------ */

export interface KeyframeSpinnerProps {
  seconds?: number; // one revolution
  stroke?: number; // px
  style?: "ring" | "dots";
  paused?: boolean;
}

/** A progress indicator is the one thing allowed to loop. Linear is correct here: constant rate is the message. */
export function KeyframeSpinner({ seconds = 0.8, stroke = 2, style = "ring", paused = false }: KeyframeSpinnerProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const running = !reduced && !paused;
  return (
    <div className="flex flex-col items-center gap-4" role="status" aria-label={msg.loading}>
      {style === "ring" ? (
        <span
          aria-hidden
          className="block size-8 rounded-full border-ink-muted/30"
          style={{
            borderWidth: stroke,
            borderStyle: "solid",
            borderColor: "var(--ds-hairline)",
            borderTopColor: "var(--ds-ink)",
            animation: reduced ? undefined : `spin-ring ${seconds}s linear infinite`,
            animationPlayState: running ? "running" : "paused",
          }}
        />
      ) : (
        <span aria-hidden className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block rounded-full bg-ink"
              style={{
                width: stroke * 3,
                height: stroke * 3,
                animation: reduced ? undefined : `spin-dot ${seconds}s var(--ds-ease-in-out) infinite`,
                animationDelay: `${(i * seconds) / 3}s`,
                animationPlayState: running ? "running" : "paused",
                opacity: reduced ? 1 : undefined,
              }}
            />
          ))}
        </span>
      )}
      <p className="t-caption text-ink-muted">{reduced ? msg.reducedStill : msg.perLoopLinear(seconds)}</p>
      <style>{`
        @keyframes spin-ring { to { transform: rotate(360deg); } }
        @keyframes spin-dot { 0%, 100% { opacity: 0.25; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CSSTransitionCompare                                                */
/* ------------------------------------------------------------------ */

export interface CSSTransitionCompareProps {
  duration?: number; // ms
  distance?: number; // px
  property?: "transform" | "opacity";
}

const CURVES = [
  { name: "ease-out (token)", value: "ease-out" },
  { name: "ease", value: "ease" },
  { name: "linear", value: "linear" },
];

/** Three blocks, same duration, three curves. Replay to feel the difference. */
export function CSSTransitionCompare({ duration = DURATION.base, distance = 160, property = "transform" }: CSSTransitionCompareProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const [end, setEnd] = useState(false);

  useEffect(() => {
    setEnd(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setEnd(true)));
    return () => cancelAnimationFrame(id);
  }, [key]);

  return (
    <DemoFrame onReplay={replay} note={`${duration}ms、${property}`}>
      <div className="flex flex-col gap-3">
        {CURVES.map((c) => {
          const style: CSSProperties = reduced
            ? { opacity: 1, transform: `translateX(${property === "transform" ? distance : 0}px)` }
            : property === "transform"
              ? { transform: end ? `translateX(${distance}px)` : "translateX(0)", transition: `transform ${duration}ms ${cssEase(c.value)}` }
              : { opacity: end ? 1 : 0.1, transition: `opacity ${duration}ms ${cssEase(c.value)}` };
          return (
            <div key={c.value} className="flex items-center gap-3">
              <span className="t-caption w-28 shrink-0 text-ink-secondary">{c.value === "ease" ? msg.easeDefault : c.name}</span>
              <div className="relative h-8 flex-1 rounded-md bg-surface-sunken">
                <span aria-hidden className={cx("absolute top-1 left-1 block size-6 rounded-sm", c.value === "ease-out" ? "bg-accent" : "bg-ink")} style={style} />
              </div>
            </div>
          );
        })}
      </div>
    </DemoFrame>
  );
}

/* ------------------------------------------------------------------ */
/* ClipPathReveal                                                      */
/* ------------------------------------------------------------------ */

export interface ClipPathRevealProps {
  direction?: "left" | "top" | "circle";
  duration?: number; // ms
  easing?: string;
}

const CLIP_FROM: Record<NonNullable<ClipPathRevealProps["direction"]>, string> = {
  left: "inset(0 100% 0 0)",
  top: "inset(0 0 100% 0)",
  circle: "circle(0% at 50% 50%)",
};
const CLIP_TO: Record<NonNullable<ClipPathRevealProps["direction"]>, string> = {
  left: "inset(0 0 0 0)",
  top: "inset(0 0 0 0)",
  circle: "circle(75% at 50% 50%)",
};

/** CSS only: `clip-path` transitions from an empty inset to the full box. Reduced motion fades instead. */
export function ClipPathReveal({ direction = "left", duration = DURATION.slow, easing = "ease-out" }: ClipPathRevealProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    setShown(false);
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(id);
  }, [key]);

  const style: CSSProperties = reduced
    ? { opacity: shown ? 1 : 0, transition: `opacity ${duration}ms ${cssEase(easing)}` }
    : { clipPath: shown ? CLIP_TO[direction] : CLIP_FROM[direction], transition: `clip-path ${duration}ms ${cssEase(easing)}` };

  return (
    <DemoFrame onReplay={replay} note={`clip-path: ${CLIP_FROM[direction]} → ${CLIP_TO[direction]}`}>
      <div className="relative h-40 w-full overflow-hidden rounded-lg border border-hairline bg-surface-sunken">
        <div className="absolute inset-0 flex items-end bg-accent p-5" style={style}>
          <p className="t-h3 text-on-accent">{msg.clipHeadline}</p>
        </div>
      </div>
    </DemoFrame>
  );
}
