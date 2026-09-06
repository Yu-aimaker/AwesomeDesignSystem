import { useEffect, useRef, useState } from "react";

// 2px reading progress under the top bar. Uses CSS scroll-driven animation
// (animation-timeline: scroll()) when the browser has it; otherwise a
// requestAnimationFrame scroll listener writes the same transform.
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"css" | "js">("css");

  useEffect(() => {
    const supported = typeof CSS !== "undefined" && CSS.supports("animation-timeline: scroll()");
    if (supported) return;
    setMode("js");
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      el.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-x-0 bottom-[-1px] h-0.5">
      <div ref={ref} data-mode={mode} className="scroll-progress h-full w-full bg-ink" />
    </div>
  );
}
