import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/theme";
import { useT } from "../i18n/context";
import { demosMessages } from "../i18n/messages/demos";

gsap.registerPlugin(ScrollTrigger);

export interface HorizontalPanProps {
  panels?: number; // 3..6
  scrub?: number;
  snap?: boolean;
}

/**
 * Vertical scroll drives a horizontal track. The stage is pinned inside its own
 * scroller and translated by x over the scrub. Under reduced motion the panels
 * are a plain horizontal row the visitor scrolls by hand.
 */
export function HorizontalPan({ panels = 4, scrub = 0.4, snap = false }: HorizontalPanProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const n = Math.max(3, Math.min(6, panels));

  useEffect(() => {
    const sc = scroller.current;
    const st = stage.current;
    const tr = track.current;
    if (!sc || !st || !tr || reduced) return;

    const ctx = gsap.context(() => {
      const distance = () => tr.scrollWidth - st.clientWidth;
      gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          scroller: sc,
          trigger: st,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: snap ? 1 / (n - 1) : undefined,
        },
      });
    }, st);

    return () => ctx.revert();
  }, [n, scrub, snap, reduced]);

  const items = Array.from({ length: n }, (_, i) => i + 1);

  if (reduced) {
    return (
      <div className="w-full max-w-md overflow-x-auto rounded-lg border border-hairline bg-canvas-soft p-4" tabIndex={0}>
        <div className="flex gap-3">
          {items.map((i) => (
            <Panel key={i} i={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={scroller} className="h-80 w-full max-w-md overflow-x-hidden overflow-y-auto rounded-lg border border-hairline bg-canvas-soft" tabIndex={0}>
      <div ref={stage} className="flex h-80 w-full items-center overflow-hidden">
        <div ref={track} className="flex gap-3 px-4">
          {items.map((i) => (
            <Panel key={i} i={i} />
          ))}
        </div>
      </div>
      <div style={{ height: n * 200 }} />
      <p className="t-caption px-4 pb-4 text-ink-muted">{msg.panHint(n, snap)}</p>
    </div>
  );
}

function Panel({ i }: { i: number }) {
  const msg = useT(demosMessages);
  return (
    <article className="flex h-48 w-64 shrink-0 flex-col justify-end rounded-lg border border-hairline bg-surface p-5 shadow-2">
      <span className="t-display tabular text-ink-muted">{String(i).padStart(2, "0")}</span>
      <p className="t-label mt-2 text-ink">{msg.panel(i)}</p>
    </article>
  );
}
