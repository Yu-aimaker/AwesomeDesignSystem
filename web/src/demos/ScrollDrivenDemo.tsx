import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useReducedMotion } from "../lib/theme";
import { cx } from "../ds/cx";

export interface ScrollDrivenCSSProps {
  variant?: "scroll" | "view";
  travel?: number; // px, for the view() variant
  rangeEnd?: number; // % of "entry" at which the card is fully shown
}

function useScrollTimelineSupport(): boolean {
  const [ok, setOk] = useState(true);
  useEffect(() => {
    setOk(typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()"));
  }, []);
  return ok;
}

/**
 * `scroll()`: a progress bar bound to the container's scroll position.
 * `view()`: each card animates as it enters the container's scrollport, with
 * `animation-range: entry 0% entry N%`. Neither runs JavaScript per frame.
 * Browsers without scroll timelines fall back to a scroll listener for the bar
 * and to static cards.
 */
export function ScrollDrivenCSS({ variant = "scroll", travel = 8, rangeEnd = 100 }: ScrollDrivenCSSProps) {
  const reduced = useReducedMotion();
  const supported = useScrollTimelineSupport();
  const scroller = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  // JS fallback for the progress bar only: writes a transform, never React state.
  useEffect(() => {
    if (supported || variant !== "scroll") return;
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? el.scrollTop / max : 0})`;
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [supported, variant]);

  const viewAnimated = variant === "view" && supported && !reduced;

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-hairline bg-surface">
      {variant === "scroll" && (
        <div className="h-1 w-full bg-surface-sunken">
          <div
            ref={bar}
            className="h-full w-full origin-left bg-accent"
            style={supported ? ({ animation: "sd-grow linear both", animationTimeline: "--sd-scroller" } as CSSProperties) : { transform: "scaleX(0)" }}
          />
        </div>
      )}
      <div ref={scroller} className="h-56 overflow-y-auto p-4" style={{ scrollTimelineName: "--sd-scroller" } as CSSProperties} tabIndex={0}>
        {variant === "scroll"
          ? Array.from({ length: 10 }, (_, i) => (
              <p key={i} className="t-body-sm mb-3 text-ink-secondary">
                段落 {i + 1}。このボックスをスクロールすると上のバーが伸びます。メインスレッドの JavaScript は動いていません。
              </p>
            ))
          : Array.from({ length: 8 }, (_, i) => (
              <div
                key={i}
                className={cx("mb-3 flex h-20 items-center rounded-lg border border-hairline bg-canvas-soft px-4 text-sm text-ink", viewAnimated && "sd-view")}
                style={viewAnimated ? ({ animationRange: `entry 0% entry ${rangeEnd}%`, ["--sd-travel" as string]: `${travel}px` } as CSSProperties) : undefined}
              >
                カード {i + 1}
              </div>
            ))}
      </div>
      <p className="t-caption border-t border-hairline px-4 py-2 text-ink-muted">
        {reduced && variant === "view" ? "reduced motion: 静止" : supported ? `この環境: animation-timeline: ${variant}()` : "この環境: JavaScript フォールバック"}
      </p>
      <style>{`
        @keyframes sd-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes sd-enter { from { opacity: 0; transform: translateY(var(--sd-travel, 8px)); } to { opacity: 1; transform: none; } }
        .sd-view { animation: sd-enter linear both; animation-timeline: view(); }
      `}</style>
    </div>
  );
}

/** Compatibility export for the pre-registry animation page. */
export function ScrollDrivenDemo() {
  return <ScrollDrivenCSS />;
}
