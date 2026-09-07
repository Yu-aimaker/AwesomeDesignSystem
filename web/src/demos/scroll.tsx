import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "../lib/theme";
import { cx } from "../ds/cx";
import { DURATION, SPRING, motionEase, sec } from "./shared";

/*
 * Scroll demos that live inside their own scroll container so the page itself
 * never has to move. None of them put scroll position into React state: Motion
 * values drive the transforms directly.
 */

function Paragraphs({ n = 10 }: { n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <p key={i} className="t-body-sm mb-3 text-ink-secondary">
          段落 {i + 1}。この箱の中だけをスクロールします。ページは動きません。
        </p>
      ))}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* ScrollProgressBar                                                   */
/* ------------------------------------------------------------------ */

export interface ScrollProgressBarProps {
  smooth?: boolean;
  stiffness?: number;
  damping?: number;
  thickness?: number; // px
  position?: "top" | "bottom";
}

/** `useScroll` on the container; `scaleX` is a motion value, optionally smoothed with a spring. */
export function ScrollProgressBar({ smooth = false, stiffness = SPRING.snappy.stiffness, damping = SPRING.snappy.damping, thickness = 2, position = "top" }: ScrollProgressBarProps) {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container });
  const sprung = useSpring(scrollYProgress, { stiffness, damping, restDelta: 0.001 });
  const scaleX: MotionValue<number> = smooth && !reduced ? sprung : scrollYProgress;
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-hairline bg-surface">
      <motion.div aria-hidden style={{ scaleX, height: thickness }} className={cx("absolute inset-x-0 z-10 origin-left bg-accent", position === "top" ? "top-0" : "bottom-0")} />
      <div ref={container} className="h-56 overflow-y-auto p-4" tabIndex={0}>
        <Paragraphs />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax                                                            */
/* ------------------------------------------------------------------ */

export interface ParallaxProps {
  depth?: number; // 0..1, how much slower the back layer moves
  layers?: number;
  smooth?: boolean;
}

function Layer({ progress, speed, index, total }: { progress: MotionValue<number>; speed: number; index: number; total: number }) {
  // Layers further back travel less. Range is the container height minus the layer height.
  const y = useTransform(progress, [0, 1], [0, -160 * speed]);
  const size = 40 + (total - index) * 16;
  return (
    <motion.div
      aria-hidden
      style={{ y, width: size, height: size, left: `${12 + index * (70 / total)}%`, top: `${20 + index * 8}%`, opacity: 0.35 + (index / total) * 0.65 }}
      className={cx("absolute rounded-lg", index === total - 1 ? "bg-accent" : "bg-ink")}
    />
  );
}

/** Layers move at different rates as the box scrolls. Under reduced motion they stay put. */
export function Parallax({ depth = 0.6, layers = 3, smooth = false }: ParallaxProps) {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container });
  const sprung = useSpring(scrollYProgress, { stiffness: SPRING.gentle.stiffness, damping: SPRING.gentle.damping });
  const progress = smooth ? sprung : scrollYProgress;
  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-hairline bg-canvas-soft">
      {!reduced && (
        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: layers }, (_, i) => (
            <Layer key={i} progress={progress} speed={1 - depth * (1 - i / Math.max(1, layers - 1))} index={i} total={layers} />
          ))}
        </div>
      )}
      <div ref={container} className="relative h-64 overflow-y-auto p-4" tabIndex={0}>
        <div className="h-24" />
        <div className="rounded-lg border border-hairline bg-surface p-4">
          <p className="t-label text-ink">前景のカード</p>
          <p className="t-body-sm mt-1 text-ink-secondary">背景の図形は depth {depth} でゆっくり動く。</p>
        </div>
        <div className="h-64" />
        <p className="t-caption text-ink-muted">{reduced ? "reduced motion: 図形は静止" : "scrollYProgress → useTransform → y"}</p>
        <div className="h-24" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* RevealOnScroll                                                      */
/* ------------------------------------------------------------------ */

export interface RevealOnScrollProps {
  travel?: number; // px
  duration?: number; // ms
  amount?: number; // 0..1 of the element that must be visible
  once?: boolean;
  easing?: string;
}

/** Cards fade up 8px when 40% of them enters the box. `viewport.root` scopes the observer. */
export function RevealOnScroll({ travel = 8, duration = DURATION.base, amount = 0.4, once = true, easing = "ease-out" }: RevealOnScrollProps) {
  const reduced = useReducedMotion();
  const container = useRef<HTMLDivElement>(null);
  return (
    <div ref={container} className="h-64 w-full max-w-md overflow-y-auto rounded-lg border border-hairline bg-surface p-4" tabIndex={0}>
      <p className="t-caption mb-3 text-ink-muted">下へスクロール</p>
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: reduced ? 0 : travel }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ root: container, once, amount }}
          transition={{ duration: sec(duration), ease: motionEase(easing) }}
          className="mb-3 flex h-20 items-center rounded-lg border border-hairline bg-canvas-soft px-4 text-sm text-ink"
        >
          カード {i + 1}
        </motion.div>
      ))}
    </div>
  );
}
