import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { animate, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "../lib/theme";
import { cx } from "../ds/cx";
import { DURATION, DemoFrame, cssEase, motionEase, sec, useReplay } from "./shared";

const PHRASE = "Motion is feedback, not decoration.";

/* ------------------------------------------------------------------ */
/* SplitTextReveal                                                     */
/* ------------------------------------------------------------------ */

export interface SplitTextRevealProps {
  mode?: "words" | "chars";
  stagger?: number; // ms
  duration?: number; // ms
  travel?: number; // px
  easing?: string;
}

/** Words or characters fade up 8px, staggered. Once, on mount or replay. */
export function SplitTextReveal({ mode = "words", stagger = 30, duration = DURATION.base, travel = 8, easing = "ease-out" }: SplitTextRevealProps) {
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const units = mode === "words" ? PHRASE.split(" ") : Array.from(PHRASE);
  const ease = motionEase(easing);
  return (
    <DemoFrame onReplay={replay} note={`${units.length} 個 × ${stagger}ms、最後は ${((units.length - 1) * stagger) | 0}ms 後に開始`}>
      <motion.p
        key={key}
        aria-label={PHRASE}
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: reduced ? 0 : sec(stagger) } } }}
        className={cx("t-h2 flex flex-wrap text-ink", mode === "words" ? "gap-x-[0.3em]" : "")}
      >
        {units.map((u, i) => (
          <motion.span
            key={i}
            aria-hidden
            variants={{
              hidden: { opacity: 0, y: reduced ? 0 : travel },
              show: { opacity: 1, y: 0, transition: { duration: sec(duration), ease } },
            }}
            className="inline-block whitespace-pre"
          >
            {u}
          </motion.span>
        ))}
      </motion.p>
    </DemoFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Typewriter                                                          */
/* ------------------------------------------------------------------ */

export interface TypewriterProps {
  speed?: number; // ms per char
  cursor?: boolean;
  text?: string;
}

/** Characters appear one at a time. The cursor is solid while typing and disappears after. */
export function Typewriter({ speed = 40, cursor = true, text = "設計は、決めたことを守る仕組みです。" }: TypewriterProps) {
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const [count, setCount] = useState(reduced ? text.length : 0);

  useEffect(() => {
    if (reduced) {
      setCount(text.length);
      return;
    }
    setCount(0);
    let i = 0;
    let timer = 0;
    const tick = () => {
      i += 1;
      setCount(i);
      if (i < text.length) timer = window.setTimeout(tick, speed);
    };
    timer = window.setTimeout(tick, speed);
    return () => window.clearTimeout(timer);
  }, [key, speed, text, reduced]);

  const done = count >= text.length;
  return (
    <DemoFrame onReplay={replay} note={`${speed}ms / 文字、全体 ${text.length * speed}ms`}>
      <p className="t-h3 min-h-[1.5em] text-ink" aria-label={text}>
        <span aria-hidden>{text.slice(0, count)}</span>
        {cursor && !done && !reduced && <span aria-hidden className="ml-px inline-block h-[1em] w-[2px] translate-y-[0.15em] bg-ink" />}
      </p>
    </DemoFrame>
  );
}

/* ------------------------------------------------------------------ */
/* NumberTicker                                                        */
/* ------------------------------------------------------------------ */

export interface NumberTickerProps {
  target?: number;
  duration?: number; // ms
  easing?: string;
  decimals?: number;
}

/** Counts from 0 to the target, writing to the DOM directly. Tabular figures keep the width stable. */
export function NumberTicker({ target = 12480, duration = 800, easing = "ease-out", decimals = 0 }: NumberTickerProps) {
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = useMemo(() => new Intl.NumberFormat("ja-JP", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }), [decimals]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = fmt.format(target);
      return;
    }
    const controls = animate(0, target, {
      duration: sec(duration),
      ease: motionEase(easing),
      onUpdate: (v) => {
        el.textContent = fmt.format(v);
      },
    });
    return () => controls.stop();
  }, [key, target, duration, easing, fmt, reduced]);

  return (
    <DemoFrame onReplay={replay} note="font-variant-numeric: tabular-nums">
      <p className="t-display tabular text-ink">
        <span ref={ref}>0</span>
      </p>
    </DemoFrame>
  );
}

/* ------------------------------------------------------------------ */
/* TextScramble                                                        */
/* ------------------------------------------------------------------ */

export interface TextScrambleProps {
  duration?: number; // ms
  charset?: "symbols" | "katakana" | "digits";
  text?: string;
}

const CHARSETS: Record<NonNullable<TextScrambleProps["charset"]>, string> = {
  symbols: "!<>-_\\/[]{}—=+*^?#",
  katakana: "アイウエオカキクケコサシスセソタチツテトナニヌネノ",
  digits: "0123456789",
};

/** Characters resolve left to right; a rAF loop writes straight to the DOM. */
export function TextScramble({ duration = 600, charset = "symbols", text = "AwesomeDS" }: TextScrambleProps) {
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = text;
      return;
    }
    const chars = CHARSETS[charset];
    const start = performance.now();
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const resolveAt = (i + 1) / text.length;
        out += t >= resolveAt ? text[i] : chars[Math.floor(Math.random() * chars.length)];
      }
      el.textContent = out;
      if (t < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [key, duration, charset, text, reduced]);

  return (
    <DemoFrame onReplay={replay} note="装飾。見出し 1 か所まで">
      <p className="t-display text-ink" aria-label={text}>
        <span ref={ref} aria-hidden className="font-mono">
          {text}
        </span>
      </p>
    </DemoFrame>
  );
}

/* ------------------------------------------------------------------ */
/* MarqueeStrip                                                        */
/* ------------------------------------------------------------------ */

export interface MarqueeStripProps {
  seconds?: number; // one loop
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  gap?: number; // px
}

const LOGOS = ["Stripe", "Linear", "Vercel", "Figma", "Notion", "Shopify", "GitHub", "Atlassian"];

/** Continuous linear loop. The one allowed infinite animation, and it must be pausable. */
export function MarqueeStrip({ seconds = 24, direction = "left", pauseOnHover = true, gap = 48 }: MarqueeStripProps) {
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const running = !reduced && !paused;
  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={cx("group relative w-full overflow-hidden border-y border-hairline py-4", pauseOnHover && "[&:hover_.marquee-track]:[animation-play-state:paused]")}
        style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
      >
        <div
          className={cx("marquee-track flex w-max", reduced && "w-full justify-around")}
          style={
            reduced
              ? undefined
              : ({
                  gap,
                  paddingRight: gap,
                  animation: `marquee-x ${seconds}s linear infinite`,
                  animationDirection: direction === "left" ? "normal" : "reverse",
                  animationPlayState: running ? "running" : "paused",
                } as CSSProperties)
          }
        >
          {(reduced ? [LOGOS] : [LOGOS, LOGOS]).map((set, i) => (
            <ul key={i} aria-hidden={i > 0} className="flex shrink-0 items-center" style={{ gap }}>
              {set.map((l) => (
                <li key={l} className="t-h3 whitespace-nowrap text-ink-secondary">
                  {l}
                </li>
              ))}
            </ul>
          ))}
        </div>
        <style>{`@keyframes marquee-x { to { transform: translateX(-50%); } }`}</style>
      </div>
      <div className="flex items-center justify-between">
        <p className="t-caption text-ink-muted">{reduced ? "reduced motion: 静止" : `${seconds}s / 周、linear`}</p>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          disabled={reduced}
          className="t-label inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline-strong bg-surface px-3 text-ink disabled:opacity-50"
        >
          {paused ? <Play className="size-3.5" strokeWidth={1.75} aria-hidden /> : <Pause className="size-3.5" strokeWidth={1.75} aria-hidden />}
          {paused ? "再開" : "一時停止"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* UnderlineDraw                                                       */
/* ------------------------------------------------------------------ */

export interface UnderlineDrawProps {
  duration?: number; // ms
  easing?: string;
  thickness?: number; // px
  origin?: "left" | "center";
  trigger?: "hover" | "mount";
}

/** An ink underline scales in from 0. No gradient, no color change: one line drawn on. */
export function UnderlineDraw({ duration = DURATION.base, easing = "ease-out", thickness = 2, origin = "left", trigger = "hover" }: UnderlineDrawProps) {
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const [shown, setShown] = useState(trigger === "mount" ? false : true);

  useEffect(() => {
    if (trigger !== "mount") return;
    setShown(false);
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, [key, trigger]);

  const lineStyle: CSSProperties = {
    height: thickness,
    transformOrigin: origin === "left" ? "0 50%" : "50% 50%",
    transition: reduced ? `opacity ${duration}ms ${cssEase(easing)}` : `transform ${duration}ms ${cssEase(easing)}`,
  };

  return (
    <DemoFrame onReplay={trigger === "mount" ? replay : undefined} note={trigger === "hover" ? "ホバーで線が伸びる" : "表示時に線が伸びる"}>
      <p className="t-h2 text-ink">
        {["設計", "規則", "実装"].map((w, i) => (
          <span key={w} className={cx("group relative mr-[0.6em] inline-block", i === 1 && trigger === "hover" ? "cursor-pointer" : "")}>
            {w}
            <span
              aria-hidden
              className={cx(
                "absolute inset-x-0 bottom-0 block bg-ink",
                trigger === "hover"
                  ? reduced
                    ? "opacity-0 group-hover:opacity-100"
                    : "scale-x-0 group-hover:scale-x-100"
                  : reduced
                    ? shown
                      ? "opacity-100"
                      : "opacity-0"
                    : shown
                      ? "scale-x-100"
                      : "scale-x-0",
              )}
              style={lineStyle}
            />
          </span>
        ))}
      </p>
    </DemoFrame>
  );
}
