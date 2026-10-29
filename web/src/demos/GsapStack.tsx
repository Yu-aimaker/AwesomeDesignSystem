import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "../lib/theme";
import { cx } from "../ds/cx";
import { useT } from "../i18n/context";
import { demosMessages } from "../i18n/messages/demos";

gsap.registerPlugin(ScrollTrigger);

interface Step {
  title: string;
  body: string;
}

/**
 * Pinned card stack for the page-level section. The section pins at "top top"
 * against the window and each card slides in from below while the previous one
 * settles back and dims. Nothing runs under reduced motion.
 */
export function GsapStack() {
  const msg = useT(demosMessages);
  const root = useRef<HTMLDivElement>(null);
  const cards = msg.stackCards.slice(0, 3);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-card]");
      gsap.set(items.slice(1), { yPercent: 110, opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top top", end: `+=${items.length * 400}`, pin: true, scrub: 0.4, anticipatePin: 1 },
      });
      items.forEach((card, i) => {
        if (i === 0) return;
        tl.to(items[i - 1], { scale: 0.96, opacity: 0.5, duration: 1 }, i - 1);
        tl.to(card, { yPercent: 0, opacity: 1, duration: 1 }, i - 1);
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="h-dvh w-full pt-16">
      <div className="relative mx-auto flex h-[calc(100dvh-64px)] max-w-lg items-center px-4">
        {cards.map((c, i) => (
          <article key={i} data-card className="absolute inset-x-4 flex h-64 flex-col justify-end rounded-lg border border-hairline bg-surface p-6 shadow-2" style={{ zIndex: i + 1, top: `calc(50% - 128px + ${i * 12}px)` }}>
            <h3 className="t-h3 text-ink">{c.title}</h3>
            <p className="t-body-sm mt-2 text-ink-secondary">{c.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export interface StickyStackProps {
  count?: number; // 2..5
  scrub?: number; // seconds of catch-up
  dim?: number; // opacity of the settled card
  shrink?: number; // scale of the settled card
}

/**
 * The same stack inside its own scroll container (`scroller`), so the demo
 * works inside a card. ScrollTrigger switches to transform-based pinning
 * automatically for non-window scrollers.
 */
export function StickyStack({ count = 3, scrub = 0.4, dim = 0.5, shrink = 0.96 }: StickyStackProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const scroller = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const cards = msg.stackCards.slice(0, Math.max(2, Math.min(5, count)));

  useEffect(() => {
    const sc = scroller.current;
    const el = stage.current;
    if (!sc || !el || reduced) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-card]", el);
      gsap.set(items.slice(1), { yPercent: 110, opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: { scroller: sc, trigger: el, start: "top top", end: `+=${items.length * 240}`, pin: true, scrub, anticipatePin: 1 },
      });
      items.forEach((card, i) => {
        if (i === 0) return;
        tl.to(items[i - 1], { scale: shrink, opacity: dim, duration: 1 }, i - 1);
        tl.to(card, { yPercent: 0, opacity: 1, duration: 1 }, i - 1);
      });
    }, el);

    return () => ctx.revert();
  }, [cards.length, scrub, dim, shrink, reduced]);

  return (
    <div ref={scroller} className="h-80 w-full max-w-md overflow-y-auto rounded-lg border border-hairline bg-canvas-soft" tabIndex={0}>
      {reduced ? (
        <div className="flex flex-col gap-3 p-4">
          {cards.map((c, i) => (
            <Card key={i} card={c} />
          ))}
        </div>
      ) : (
        <>
          <div ref={stage} className="relative h-80 w-full">
            <div className="relative mx-auto h-full max-w-sm">
              {cards.map((c, i) => (
                <Card key={i} card={c} className="absolute inset-x-4" style={{ zIndex: i + 1, top: `calc(50% - 88px + ${i * 8}px)` }} />
              ))}
            </div>
          </div>
          <div style={{ height: cards.length * 240 }} />
          <p className="t-caption px-4 pb-4 text-ink-muted">{msg.stackHint(cards.length, scrub)}</p>
        </>
      )}
    </div>
  );
}

function Card({ card, className, style }: { card: Step; className?: string; style?: React.CSSProperties }) {
  return (
    <article data-card className={cx("flex h-44 flex-col justify-end rounded-lg border border-hairline bg-surface p-5 shadow-2", className)} style={style}>
      <h3 className="t-h4 text-ink">{card.title}</h3>
      <p className="t-body-sm mt-1 text-ink-secondary">{card.body}</p>
    </article>
  );
}
