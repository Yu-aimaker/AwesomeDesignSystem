import { useEffect, useRef, useState } from "react";

/**
 * A progress bar bound to the scroll position of its own container using
 * `animation-timeline: scroll()`. Browsers without scroll timelines fall back
 * to a scroll listener that writes the same transform.
 */
export function ScrollDrivenDemo() {
  const scroller = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    const ok = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
    setSupported(ok);
    if (ok) return;
    const el = scroller.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      if (bar.current) bar.current.style.transform = `scaleX(${max > 0 ? el.scrollTop / max : 0})`;
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-hairline bg-surface">
      <div className="h-1 w-full bg-surface-sunken">
        <div ref={bar} className="h-full w-full origin-left bg-accent [animation-timeline:--demo-scroller]" style={supported ? { animation: "demo-grow linear both" } : { transform: "scaleX(0)" }} />
      </div>
      <div ref={scroller} className="h-48 overflow-y-auto p-4 [scroll-timeline-name:--demo-scroller]" tabIndex={0}>
        {Array.from({ length: 10 }, (_, i) => (
          <p key={i} className="t-body-sm mb-3 text-ink-secondary">
            段落 {i + 1}。このボックスをスクロールすると上のバーが伸びます。メインスレッドの JavaScript は動いていません。
          </p>
        ))}
      </div>
      <p className="t-caption border-t border-hairline px-4 py-2 text-ink-muted">
        {supported ? "この環境: CSS scroll-driven animation" : "この環境: JavaScript フォールバック"}
      </p>
      <style>{`@keyframes demo-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>
    </div>
  );
}
