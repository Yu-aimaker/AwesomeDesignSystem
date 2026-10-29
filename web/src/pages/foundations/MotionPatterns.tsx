import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion, useReducedMotionConfig } from "motion/react";
import { Info, RotateCcw, X } from "lucide-react";
import { Button } from "../../ds/components/Button";
import { Tag } from "../../layout/Gallery";
import { DURATION, EASE, SPRING } from "../../demos/shared";
import { useT } from "../../i18n/context";
import { motionPatternsMessages } from "../../i18n/messages/motionPatterns";
import { cx } from "../../ds/cx";

// Live previews of the motion tokens on real UI patterns.
// Rules from AwesomeDS/foundations/motion.md: transform and opacity only, enters ease-out,
// exits about two thirds of the enter with ease-in, nothing loops, nothing plays on its own
// except the ladder once when it scrolls into view. Reduced motion comes from the page's
// <MotionConfig reducedMotion>, which makes Motion drop transforms and keep opacity.

const s = (ms: number) => ms / 1000;
const EXIT = s(Math.round(DURATION.base * 0.65));

/**
 * Start/end offsets for an enter. Under reduced motion (OS setting or the page switch, both via
 * MotionConfig) there is no offset at all, so nothing snaps or moves; only opacity changes.
 */
function useOffset(offset: { y?: number; scale?: number }) {
  const reduced = useReducedMotionConfig();
  return reduced ? {} : offset;
}

function PatternCard({ title, rule, tokens, action, children, stageClassName }: { title: string; rule: string; tokens: string[]; action?: ReactNode; children: ReactNode; stageClassName?: string }) {
  const t = useT(motionPatternsMessages);
  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-hairline bg-surface">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-hairline px-5 py-4">
        <div className="min-w-0">
          <h3 className="t-h4 text-ink">{title}</h3>
          <p className="t-body-sm mt-0.5 text-ink-secondary">{rule}</p>
        </div>
        {action}
      </header>
      {/* Fixed-height stage: entering and leaving elements never shift the page. */}
      <div className={cx("relative min-w-0 overflow-hidden bg-canvas-soft p-5", stageClassName)}>{children}</div>
      <footer className="flex flex-wrap items-center gap-1.5 border-t border-hairline px-5 py-3">
        <span className="t-caption mr-1 text-ink-muted">{t.tokensLabel}</span>
        {tokens.map((k) => (
          <Tag key={k}>{k}</Tag>
        ))}
      </footer>
    </article>
  );
}

function ReplayButton({ onClick }: { onClick: () => void }) {
  const t = useT(motionPatternsMessages);
  return (
    <Button variant="secondary" size="sm" onClick={onClick}>
      <RotateCcw className="size-4" strokeWidth={1.75} aria-hidden />
      {t.replay}
    </Button>
  );
}

function DurationLadder() {
  const t = useT(motionPatternsMessages);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (inView) setRun((r) => (r === 0 ? 1 : r));
  }, [inView]);
  const rows = Object.entries(DURATION) as Array<[keyof typeof DURATION, number]>;
  const from = useOffset({ y: 8 });
  return (
    <PatternCard title={t.ladderTitle} rule={t.ladderRule} tokens={["duration-*", "ease-out", "translateY 8px"]} action={<ReplayButton onClick={() => setRun((r) => r + 1)} />}>
      <div ref={ref} className="flex flex-col gap-3">
        {rows.map(([name, ms]) => (
          <div key={name} className="grid grid-cols-[minmax(0,7.5rem)_1fr] items-center gap-3 sm:grid-cols-[minmax(0,10rem)_1fr]">
            <div className="min-w-0">
              <p className="t-mono text-ink">
                {name} <span className="text-ink-muted">{ms}ms</span>
              </p>
              <p className="t-caption text-ink-muted">{t.ladderUse[name]}</p>
            </div>
            <div className="h-9">
              {run > 0 && (
                <motion.span
                  key={run}
                  className="t-label inline-flex h-9 items-center rounded-md border border-hairline bg-surface px-3 text-ink"
                  initial={{ opacity: 0, ...from }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: s(ms), ease: EASE.out }}
                >
                  {t.ladderChip}
                </motion.span>
              )}
            </div>
          </div>
        ))}
      </div>
    </PatternCard>
  );
}

function MenuPattern() {
  const t = useT(motionPatternsMessages);
  const [open, setOpen] = useState(false);
  const id = useId();
  const from = useOffset({ y: -4, scale: 0.98 });
  return (
    <PatternCard title={t.menuTitle} rule={t.menuRule} tokens={["duration-base", "ease-out", "ease-in", "scale 0.98"]} stageClassName="h-52">
      <Button variant="secondary" size="sm" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
        {t.menuButton}
      </Button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={id}
            className="absolute top-16 left-5 w-48 origin-top-left rounded-lg border border-hairline bg-surface p-1 shadow-2"
            initial={{ opacity: 0, ...from }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: s(DURATION.base), ease: EASE.out } }}
            exit={{ opacity: 0, ...from, transition: { duration: EXIT, ease: EASE.in } }}
          >
            {t.menuItems.map((item) => (
              <li key={item} className="t-body-sm rounded-md px-3 py-2 text-ink">
                {item}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </PatternCard>
  );
}

function ToastPattern() {
  const t = useT(motionPatternsMessages);
  // One toast at a time: pressing again while it is visible restarts its 5 s timer instead of stacking.
  const [shown, setShown] = useState(0);
  const trigger = useRef<HTMLButtonElement>(null);
  const from = useOffset({ y: 8 });
  useEffect(() => {
    if (!shown) return;
    // Toasts without an action auto-dismiss after 5 s (components/README.md, Toast).
    const timer = window.setTimeout(() => setShown(0), 5000);
    return () => window.clearTimeout(timer);
  }, [shown]);
  return (
    <PatternCard title={t.toastTitle} rule={t.toastRule} tokens={["duration-base", "ease-out", "ease-in", "translateY 8px"]} stageClassName="h-52">
      <Button ref={trigger} variant="secondary" size="sm" onClick={() => setShown((n) => n + 1)}>
        {t.toastButton}
      </Button>
      <div aria-live="polite" role="status" className="absolute right-5 bottom-5 left-5 flex justify-end">
        <AnimatePresence>
          {shown > 0 && (
            <motion.div
              key="toast"
              className="flex w-full max-w-72 items-center gap-3 rounded-lg border border-hairline bg-surface px-4 py-3 shadow-2"
              initial={{ opacity: 0, ...from }}
              animate={{ opacity: 1, y: 0, transition: { duration: s(DURATION.base), ease: EASE.out } }}
              exit={{ opacity: 0, ...from, transition: { duration: EXIT, ease: EASE.in } }}
            >
              <span className="t-body-sm min-w-0 flex-1 text-ink">{t.toastText}</span>
              <button
                type="button"
                onClick={() => {
                  setShown(0);
                  trigger.current?.focus();
                }}
                aria-label={t.toastClose} className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-secondary hover:bg-surface-sunken hover:text-ink">
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PatternCard>
  );
}

function DialogPattern() {
  const t = useT(motionPatternsMessages);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const firstAction = useRef<HTMLButtonElement>(null);
  const headingId = useId();
  const from = useOffset({ scale: 0.98 });
  // Move focus into the dialog once it opens (not on every animation start: the exit would pull it back).
  useEffect(() => {
    if (open) firstAction.current?.focus({ preventScroll: true });
  }, [open]);
  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  // Escape closes wherever focus is while the example is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  // Keep Tab inside the panel, as a modal would.
  const trapTab = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const items = [...e.currentTarget.querySelectorAll<HTMLElement>("button")];
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };
  return (
    <PatternCard title={t.dialogTitle} rule={t.dialogRule} tokens={["duration-slow", "duration-base", "ease-out", "ease-in", "scale 0.98"]} stageClassName="h-64">
      <Button ref={trigger} variant="secondary" size="sm" onClick={() => setOpen(true)}>
        {t.dialogButton}
      </Button>
      <AnimatePresence>
        {open && (
          <div className="absolute inset-0" role="group" aria-label={t.dialogStage}>
            <motion.div
              className="absolute inset-0"
              // Same backdrop as the real Dialog (styles.css dialog::backdrop), so dark mode stays dark.
              style={{ background: "rgb(var(--ds-shadow-color) / 0.4)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: s(DURATION.base), ease: EASE.out } }}
              exit={{ opacity: 0, transition: { duration: EXIT, ease: EASE.in } }}
              onClick={close}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              onKeyDown={trapTab}
              className="absolute inset-x-5 top-1/2 mx-auto max-w-80 -translate-y-1/2 rounded-xl border border-hairline bg-surface p-5 shadow-3"
              initial={{ opacity: 0, ...from }}
              animate={{ opacity: 1, scale: 1, transition: { duration: s(DURATION.slow), ease: EASE.out } }}
              exit={{ opacity: 0, ...from, transition: { duration: s(DURATION.base), ease: EASE.in } }}
            >
              <p id={headingId} className="t-h4 text-ink">
                {t.dialogHeading}
              </p>
              <p className="t-body-sm mt-1 text-ink-secondary">{t.dialogBody}</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button ref={firstAction} variant="secondary" size="sm" onClick={close}>
                  {t.dialogCancel}
                </Button>
                <Button variant="danger" size="sm" onClick={close}>
                  {t.dialogConfirm}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PatternCard>
  );
}

function TabsPattern() {
  const t = useT(motionPatternsMessages);
  const [active, setActive] = useState(0);
  const group = useId();
  return (
    <PatternCard title={t.tabsTitle} rule={t.tabsRule} tokens={["duration-fast", "ease-out"]}>
      <LayoutGroup id={group}>
        <div className="flex gap-1 border-b border-hairline" role="group" aria-label={t.tabsTitle}>
          {t.tabs.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              className={cx("t-label relative h-10 px-3 transition-colors duration-instant ease-out-ds", active === i ? "text-ink" : "text-ink-secondary hover:text-ink")}
            >
              {label}
              {active === i && (
                <motion.span
                  layoutId="underline"
                  className="absolute inset-x-0 -bottom-px h-0.5 bg-ink"
                  transition={{ duration: s(DURATION.fast), ease: EASE.out }}
                />
              )}
            </button>
          ))}
        </div>
      </LayoutGroup>
    </PatternCard>
  );
}

function ReorderPattern() {
  const t = useT(motionPatternsMessages);
  // Indices, so a language switch keeps the user's order.
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const next = () => setOrder((o) => [o[2], o[0], o[3], o[1]]);
  return (
    <PatternCard
      title={t.reorderTitle}
      rule={t.reorderRule}
      tokens={["spring-gentle", "layout (FLIP)"]}
      action={
        <Button variant="secondary" size="sm" onClick={next}>
          {t.reorderButton}
        </Button>
      }
    >
      <ul className="flex flex-col gap-2">
        {order.map((i) => (
          <motion.li
            key={i}
            layout
            transition={{ type: "spring", stiffness: SPRING.gentle.stiffness, damping: SPRING.gentle.damping }}
            className="t-body-sm rounded-md border border-hairline bg-surface px-3 py-2 text-ink"
          >
            {t.reorderItems[i]}
          </motion.li>
        ))}
      </ul>
    </PatternCard>
  );
}

/** Says which motion mode the previews are in. role="status" announces a change. */
export function MotionModeNote({ forced }: { forced: boolean }) {
  const t = useT(motionPatternsMessages);
  const os = useReducedMotion();
  const text = forced ? t.modeReducedPage : os ? t.modeReducedOs : t.modeNormal;
  const reduced = forced || !!os;
  return (
    <p role="status" className={cx("t-body-sm flex items-start gap-2 rounded-md border px-4 py-3", reduced ? "border-hairline-strong bg-surface text-ink" : "border-hairline bg-canvas-soft text-ink-secondary")}>
      <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden />
      <span>
        {text}
      </span>
    </p>
  );
}

export function MotionPatterns() {
  const t = useT(motionPatternsMessages);
  return (
    <div className="flex flex-col gap-6">
      <DurationLadder />
      <div className="grid gap-6 lg:grid-cols-2">
        <MenuPattern />
        <ToastPattern />
        <DialogPattern />
        <TabsPattern />
      </div>
      <ReorderPattern />
      <p className="t-caption measure text-ink-muted">{t.perfNote}</p>
    </div>
  );
}
