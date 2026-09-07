import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { title: "1. 調査", body: "Knowledge にソース付きで記録する。" },
  { title: "2. 抽出", body: "繰り返し現れるパターンだけを規則にする。" },
  { title: "3. 実装", body: "トークンに落とし、コンポーネントで検証する。" },
];

/**
 * Pinned three-card stack. The section pins at "top top" and each card slides
 * in from 24px below while the previous one settles back and dims. The
 * pin offset for the fixed top bar is handled by padding inside the pinned
 * element, so the trigger stays "top top". Nothing runs under reduced motion.
 */
export function GsapStack() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-card]");
      gsap.set(items.slice(1), { yPercent: 110, opacity: 0 });
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: `+=${items.length * 400}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
        },
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
          <article
            key={c.title}
            data-card
            className="absolute inset-x-4 flex h-64 flex-col justify-end rounded-lg border border-hairline bg-surface p-6 shadow-2"
            style={{ zIndex: i + 1, top: `calc(50% - 128px + ${i * 12}px)` }}
          >
            <h3 className="t-h3 text-ink">{c.title}</h3>
            <p className="t-body-sm mt-2 text-ink-secondary">{c.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
