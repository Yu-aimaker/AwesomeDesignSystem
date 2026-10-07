import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Heart, Info } from "lucide-react";
import { useReducedMotion } from "../lib/theme";
import { cx } from "../ds/cx";
import { Button } from "../ds/components/Button";
import { Skeleton } from "../ds/components/Skeleton";
import { DURATION, SPRING, cssEase, motionEase, sec } from "./shared";
import { useT } from "../i18n/context";
import { demosMessages } from "../i18n/messages/demos";

/* ------------------------------------------------------------------ */
/* ButtonPress                                                         */
/* ------------------------------------------------------------------ */

export interface ButtonPressProps {
  scale?: number;
  duration?: number; // ms
  compare?: boolean;
}

/** Press feedback: scale to 0.98 and back. Compared against a button that only changes color. */
export function ButtonPress({ scale = 0.98, duration = DURATION.instant, compare = true }: ButtonPressProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-wrap items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <motion.button
          type="button"
          whileTap={reduced ? { opacity: 0.8 } : { scale }}
          transition={{ duration: sec(duration), ease: motionEase("ease-out") }}
          className="t-label inline-flex h-10 items-center rounded-md bg-primary px-4 text-on-primary"
        >
          {msg.save}
        </motion.button>
        <span className="t-caption tabular text-ink-muted">scale {reduced ? msg.noScale : scale.toFixed(2)}</span>
      </div>
      {compare && (
        <div className="flex flex-col items-center gap-2">
          <Button>{msg.save}</Button>
          <span className="t-caption text-ink-muted">{msg.colorOnly}</span>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CheckboxDraw                                                        */
/* ------------------------------------------------------------------ */

export interface CheckboxDrawProps {
  duration?: number; // ms
  easing?: string;
  size?: number; // px
}

/** The check mark is a path drawn with `pathLength`, 150ms ease-out. */
export function CheckboxDraw({ duration = DURATION.fast, easing = "ease-out", size = 24 }: CheckboxDrawProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const [checked, setChecked] = useState(true);
  return (
    <label className="flex cursor-pointer items-center gap-4 select-none">
      <span className="relative inline-flex" style={{ width: size, height: size }}>
        <input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="peer absolute inset-0 cursor-pointer appearance-none rounded-xs" />
        <motion.span
          aria-hidden
          animate={{ backgroundColor: checked ? "var(--ds-primary)" : "var(--ds-surface)", borderColor: checked ? "var(--ds-primary)" : "var(--ds-hairline-strong)" }}
          transition={{ duration: sec(DURATION.instant), ease: motionEase("ease-out") }}
          className="pointer-events-none flex size-full items-center justify-center rounded-xs border"
        >
          <svg viewBox="0 0 24 24" fill="none" className="text-on-primary" style={{ width: size * 0.7, height: size * 0.7 }}>
            <motion.path
              d="M5 12.5 10 17.5 19 7"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={reduced ? { opacity: checked ? 1 : 0, pathLength: 1 } : { pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
              transition={{ pathLength: { duration: sec(duration), ease: motionEase(easing) }, opacity: { duration: sec(DURATION.instant) } }}
            />
          </svg>
        </motion.span>
      </span>
      <span className="t-body text-ink">{msg.agreeTerms}</span>
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* SwitchSpring                                                        */
/* ------------------------------------------------------------------ */

export interface SwitchSpringProps {
  stiffness?: number;
  damping?: number;
  duration?: number; // ms for the tween twin
  easing?: string;
}

function ThumbSwitch({ on, onToggle, transition, label }: { on: boolean; onToggle: () => void; transition: object; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={cx("relative h-7 w-12 rounded-full border transition-colors duration-fast ease-out-ds", on ? "border-primary bg-primary" : "border-hairline-strong bg-surface-sunken")}
      >
        <motion.span aria-hidden animate={{ x: on ? 20 : 0 }} transition={transition} className={cx("absolute top-0.5 left-0.5 block size-[22px] rounded-full", on ? "bg-on-primary" : "bg-ink-muted")} />
      </button>
      <span className="t-caption text-ink-muted">{label}</span>
    </div>
  );
}

/** One click drives two thumbs: a spring (400/30) and a duration tween. */
export function SwitchSpring({ stiffness = SPRING.snappy.stiffness, damping = SPRING.snappy.damping, duration = DURATION.fast, easing = "ease-out" }: SwitchSpringProps) {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(true);
  const toggle = () => setOn((v) => !v);
  const spring = reduced ? { duration: 0 } : { type: "spring" as const, stiffness, damping };
  const tween = reduced ? { duration: 0 } : { duration: sec(duration), ease: motionEase(easing) };
  return (
    <div className="flex items-center gap-12">
      <ThumbSwitch on={on} onToggle={toggle} transition={spring} label={`spring ${stiffness}/${damping}`} />
      <ThumbSwitch on={on} onToggle={toggle} transition={tween} label={`${duration}ms ${easing}`} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* LikeBurst                                                           */
/* ------------------------------------------------------------------ */

export interface LikeBurstProps {
  particles?: number;
  distance?: number; // px
  duration?: number; // ms
}

/** One-shot particles on click. They fly out once, fade, and unmount; nothing loops. */
export function LikeBurst({ particles = 8, distance = 28, duration = DURATION.slow }: LikeBurstProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const [liked, setLiked] = useState(false);
  const [bursts, setBursts] = useState<number[]>([]);

  const onClick = () => {
    setLiked((v) => !v);
    if (liked || reduced) return;
    const id = Date.now();
    setBursts((b) => [...b, id]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x !== id)), duration + 50);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        aria-pressed={liked}
        aria-label={msg.like}
        onClick={onClick}
        className="relative inline-flex size-12 items-center justify-center rounded-full border border-hairline bg-surface text-ink hover:bg-surface-sunken"
      >
        <motion.span animate={reduced ? {} : { scale: liked ? [1, 0.9, 1] : 1 }} transition={{ duration: sec(DURATION.fast), ease: motionEase("ease-out") }} className="inline-flex">
          <Heart className={cx("size-5 transition-colors duration-instant", liked ? "fill-danger text-danger" : "text-ink-secondary")} strokeWidth={1.75} aria-hidden />
        </motion.span>
        {bursts.map((id) => (
          <span key={id} aria-hidden className="pointer-events-none absolute inset-0">
            {Array.from({ length: particles }, (_, i) => {
              const a = (i / particles) * Math.PI * 2;
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(a) * distance, y: Math.sin(a) * distance, opacity: 0, scale: 0.4 }}
                  transition={{ duration: sec(duration), ease: motionEase("ease-out") }}
                  className="absolute top-1/2 left-1/2 -mt-[3px] -ml-[3px] block size-1.5 rounded-full bg-danger"
                />
              );
            })}
          </span>
        ))}
      </button>
      <span className="t-caption text-ink-muted">{reduced ? msg.reducedColorOnly : msg.burstNote(particles, distance, duration)}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* CopyConfirm                                                         */
/* ------------------------------------------------------------------ */

export interface CopyConfirmProps {
  duration?: number; // ms
  hold?: number; // ms before reverting
  style?: "crossfade" | "scale" | "slide";
}

/** Icon swap on click. The check is held, then the copy icon returns. */
export function CopyConfirm({ duration = DURATION.fast, hold = 1500, style = "scale" }: CopyConfirmProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), hold);
    return () => window.clearTimeout(t);
  }, [copied, hold]);

  const hidden = reduced || style === "crossfade" ? { opacity: 0 } : style === "scale" ? { opacity: 0, scale: 0.98 } : { opacity: 0, y: 4 };
  const shown = { opacity: 1, scale: 1, y: 0 };
  const transition = { duration: sec(duration), ease: motionEase("ease-out") };

  return (
    <div className="flex items-center gap-3 rounded-md border border-hairline bg-canvas-soft py-2 pr-2 pl-3">
      <code className="t-mono text-ink">pnpm add motion</code>
      <button
        type="button"
        aria-label={copied ? msg.copied : msg.copy}
        onClick={() => setCopied(true)}
        className="relative inline-flex size-8 items-center justify-center rounded-sm text-ink-secondary hover:bg-surface-sunken hover:text-ink"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {copied ? (
            <motion.span key="check" initial={hidden} animate={shown} exit={hidden} transition={transition} className="inline-flex text-success">
              <Check className="size-4" strokeWidth={2} aria-hidden />
            </motion.span>
          ) : (
            <motion.span key="copy" initial={hidden} animate={shown} exit={hidden} transition={transition} className="inline-flex">
              <Copy className="size-4" strokeWidth={1.75} aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SkeletonToContent                                                   */
/* ------------------------------------------------------------------ */

export interface SkeletonToContentProps {
  duration?: number; // ms
  travel?: number; // px
  loadTime?: number; // ms
}

/** Skeleton and content are stacked; the content fades in over the skeleton. */
export function SkeletonToContent({ duration = DURATION.base, travel = 4, loadTime = 1200 }: SkeletonToContentProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(true);

  const reload = () => {
    setLoaded(false);
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, loadTime);
  };

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="relative">
        <AnimatePresence initial={false}>
          {loading && (
            <motion.div key="skeleton" exit={{ opacity: 0 }} transition={{ duration: sec(duration * 0.65), ease: motionEase("ease-in") }} className="absolute inset-0 rounded-lg border border-hairline bg-surface p-5" aria-busy="true" aria-label={msg.loading}>
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="mt-2 h-3 w-1/3" />
                </div>
              </div>
              <Skeleton className="mt-4 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-4/5" />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={false}
          animate={loaded ? { opacity: 1, y: 0 } : { opacity: 0, y: reduced ? 0 : travel }}
          transition={{ duration: sec(duration), ease: motionEase("ease-out") }}
          className="rounded-lg border border-hairline bg-surface p-5"
          aria-hidden={!loaded}
        >
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Info className="size-5" strokeWidth={1.75} aria-hidden />
            </span>
            <div>
              <p className="t-label text-ink">{msg.syncedNotes}</p>
              <p className="t-caption text-ink-muted">{msg.secondsAgo}</p>
            </div>
          </div>
          <p className="t-body-sm mt-4 text-ink-secondary">{msg.skeletonTip}</p>
        </motion.div>
      </div>
      <Button size="sm" variant="secondary" onClick={reload} disabled={loading} className="self-start">
        {msg.reload}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ToastEnter                                                          */
/* ------------------------------------------------------------------ */

export interface ToastEnterProps {
  enter?: number; // ms
  exit?: number; // ms
  travel?: number; // px
  autoDismiss?: number; // ms
}

/** Enter 200ms ease-out from 8px below; exit ~130ms ease-in, opacity only. */
export function ToastEnter({ enter = DURATION.base, exit = 130, travel = 8, autoDismiss = 2500 }: ToastEnterProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const [items, setItems] = useState<number[]>([]);
  const push = () => {
    const id = Date.now();
    setItems((l) => [...l, id]);
    window.setTimeout(() => setItems((l) => l.filter((x) => x !== id)), autoDismiss);
  };
  return (
    <div className="relative flex h-56 w-full max-w-md flex-col items-start justify-start rounded-lg border border-dashed border-hairline-strong p-4">
      <Button size="sm" variant="secondary" onClick={push}>
        {msg.showToast}
      </Button>
      <div aria-live="polite" className="pointer-events-none absolute right-3 bottom-3 flex w-64 flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((id) => (
            <motion.div
              key={id}
              layout
              role="status"
              initial={{ opacity: 0, y: reduced ? 0 : travel }}
              animate={{ opacity: 1, y: 0, transition: { duration: sec(enter), ease: motionEase("ease-out") } }}
              exit={{ opacity: 0, transition: { duration: sec(exit), ease: motionEase("ease-in") } }}
              className="pointer-events-auto flex items-start gap-2 rounded-lg border border-hairline bg-surface p-3 shadow-2"
            >
              <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={1.75} aria-hidden />
              <p className="t-body-sm text-ink">{msg.saved}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <p className="t-caption absolute bottom-3 left-4 text-ink-muted">
        {msg.enterExit(enter, exit)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TooltipEnter                                                        */
/* ------------------------------------------------------------------ */

export interface TooltipEnterProps {
  travel?: number; // px
  duration?: number; // ms
  easing?: string;
  placement?: "top" | "bottom";
  pinned?: boolean;
}

/** Tooltip travels 4px toward its anchor. Hover or focus the button; pin it to inspect. */
export function TooltipEnter({ travel = 4, duration = DURATION.instant, easing = "ease-out", placement = "top", pinned = false }: TooltipEnterProps) {
  const msg = useT(demosMessages);
  const reduced = useReducedMotion();
  const [hover, setHover] = useState(false);
  const open = pinned || hover;
  const dir = placement === "top" ? 1 : -1;
  const style: CSSProperties = {
    transition: `opacity ${duration}ms var(--ds-ease-out), transform ${duration}ms ${cssEase(easing)}`,
    opacity: open ? 1 : 0,
    transform: open || reduced ? "translate(-50%, 0)" : `translate(-50%, ${travel * dir}px)`,
  };
  return (
    <span className="relative inline-flex" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}>
      <Button variant="secondary" aria-describedby="tooltip-enter-demo">
        <Info strokeWidth={1.75} aria-hidden /> {msg.details}
      </Button>
      <span
        role="tooltip"
        id="tooltip-enter-demo"
        className={cx("pointer-events-none absolute left-1/2 z-10 whitespace-nowrap rounded-sm border border-hairline bg-surface px-2 py-1 text-xs text-ink shadow-2", placement === "top" ? "bottom-full mb-2" : "top-full mt-2")}
        style={style}
      >
        {msg.appearsAfter(travel)}
      </span>
    </span>
  );
}
