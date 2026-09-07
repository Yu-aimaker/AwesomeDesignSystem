import { useState, type CSSProperties } from "react";
import { AnimatePresence, LayoutGroup, motion, Reorder } from "motion/react";
import { ChevronDown, GripVertical, Moon, Plus, Sun, X } from "lucide-react";
import { useReducedMotion } from "../lib/theme";
import { colorRoles, colorValue } from "../lib/tokens";
import { cx } from "../ds/cx";
import { Button } from "../ds/components/Button";
import { DURATION, SPRING, cssEase, motionEase, sec, useReplay, ReplayButton } from "./shared";

type Tween = { duration: number; ease: ReturnType<typeof motionEase> };
type Spring = { type: "spring"; stiffness: number; damping: number };

/** Shared control shape for demos that let the visitor choose spring or tween. */
export interface SpringOrTweenProps {
  mode?: "spring" | "tween";
  stiffness?: number;
  damping?: number;
  duration?: number; // ms
  easing?: string;
}

function useTransition({ mode = "spring", stiffness = SPRING.gentle.stiffness, damping = SPRING.gentle.damping, duration = DURATION.base, easing = "ease-out" }: SpringOrTweenProps, reduced: boolean): Tween | Spring | { duration: 0 } {
  if (reduced) return { duration: 0 };
  return mode === "spring" ? { type: "spring", stiffness, damping } : { duration: sec(duration), ease: motionEase(easing) };
}

/* ------------------------------------------------------------------ */
/* SharedLayoutTabs                                                    */
/* ------------------------------------------------------------------ */

export interface SharedLayoutTabsProps extends SpringOrTweenProps {
  indicator?: "underline" | "pill";
}

const TABS = ["概要", "仕様", "履歴", "設定"];

/** The indicator is one element with `layoutId`; Motion moves it between tabs. */
export function SharedLayoutTabs({ indicator = "underline", ...rest }: SharedLayoutTabsProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const transition = useTransition(rest, reduced);
  return (
    <LayoutGroup id="shared-layout-tabs">
      <div role="tablist" className={cx("flex", indicator === "underline" ? "gap-1 border-b border-hairline" : "gap-1 rounded-md bg-surface-sunken p-1")}>
        {TABS.map((t, i) => {
          const selected = i === active;
          return (
            <button
              key={t}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(i)}
              className={cx(
                "relative px-3 text-sm transition-colors duration-instant ease-out-ds",
                indicator === "underline" ? "-mb-px h-10" : "h-8 rounded-sm",
                selected ? "font-medium text-ink" : "text-ink-secondary hover:text-ink",
              )}
            >
              {indicator === "pill" && selected && <motion.span layoutId="tab-pill" transition={transition} className="absolute inset-0 rounded-sm bg-surface shadow-2" />}
              <span className="relative">{t}</span>
              {indicator === "underline" && selected && <motion.span layoutId="tab-underline" transition={transition} className="absolute inset-x-0 bottom-0 h-0.5 bg-ink" />}
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

/* ------------------------------------------------------------------ */
/* AccordionHeight                                                     */
/* ------------------------------------------------------------------ */

export interface AccordionHeightProps {
  duration?: number; // ms
  easing?: string;
  multiple?: boolean;
  fadeContent?: boolean;
}

const FAQ = [
  { q: "なぜ 200ms なのか", a: "0.1 秒以下は瞬間、1 秒以下は流れを保つ。200ms は反応と落ち着きの間にある。" },
  { q: "なぜ ease-out なのか", a: "最初に速く動いて静かに止まる。応答が即座に見え、終わりが穏やかになる。" },
  { q: "なぜ 8px までなのか", a: "方向を示すには十分で、飛んでくる物体には見えない。" },
];

/** `height: "auto"` is measured by Motion, so the panel opens to its content. */
export function AccordionHeight({ duration = DURATION.base, easing = "ease-out", multiple = false, fadeContent = true }: AccordionHeightProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState<number[]>([0]);
  const toggle = (i: number) => setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : multiple ? [...o, i] : [i]));
  const transition = reduced ? { duration: 0 } : { duration: sec(duration), ease: motionEase(easing) };
  return (
    <div className="w-full max-w-md divide-y divide-hairline rounded-lg border border-hairline bg-surface">
      {FAQ.map((item, i) => {
        const isOpen = open.includes(i);
        return (
          <div key={item.q}>
            <button type="button" aria-expanded={isOpen} onClick={() => toggle(i)} className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left">
              <span className="t-label text-ink">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={reduced ? { duration: 0 } : { duration: sec(DURATION.fast), ease: motionEase("ease-out") }} className="inline-flex text-ink-muted">
                <ChevronDown className="size-4" strokeWidth={1.75} aria-hidden />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div key="panel" initial={{ height: 0, opacity: fadeContent ? 0 : 1 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: fadeContent ? 0 : 1 }} transition={transition} className="overflow-hidden">
                  <p className="t-body-sm px-4 pb-4 text-ink-secondary">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ReorderList                                                         */
/* ------------------------------------------------------------------ */

export interface ReorderListProps {
  stiffness?: number;
  damping?: number;
  dragScale?: number;
  axis?: "x" | "y";
}

/** Drag to reorder. The other items move into place with a spring (170/26). */
export function ReorderList({ stiffness = SPRING.gentle.stiffness, damping = SPRING.gentle.damping, dragScale = 1.02, axis = "y" }: ReorderListProps) {
  const reduced = useReducedMotion();
  const [items, setItems] = useState(["設計レビュー", "トークン更新", "リリースノート", "QA チェック"]);
  return (
    <Reorder.Group axis={axis} values={items} onReorder={setItems} className={cx("flex w-full gap-2", axis === "y" ? "max-w-sm flex-col" : "max-w-xl flex-row")}>
      {items.map((item) => (
        <Reorder.Item
          key={item}
          value={item}
          transition={reduced ? { duration: 0 } : { type: "spring", stiffness, damping }}
          whileDrag={reduced ? { boxShadow: "var(--ds-shadow-2)" } : { scale: dragScale, boxShadow: "var(--ds-shadow-2)" }}
          className={cx("flex h-11 cursor-grab items-center gap-3 rounded-md border border-hairline bg-surface px-3 text-sm text-ink select-none active:cursor-grabbing", axis === "x" && "flex-1 justify-center")}
        >
          <GripVertical className="size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

/* ------------------------------------------------------------------ */
/* CardExpand                                                          */
/* ------------------------------------------------------------------ */

export interface CardExpandProps extends SpringOrTweenProps {
  backdrop?: boolean;
}

const CARDS = [
  { id: "a", title: "色", body: "1 アクセント。テキストは ink、面は canvas。" },
  { id: "b", title: "余白", body: "4px 基準。セクション間は 96〜128px。" },
  { id: "c", title: "動き", body: "200ms、ease-out、4〜8px。" },
];

/** Card and modal share a `layoutId`; the card grows into the dialog inside this pane. */
export function CardExpand({ backdrop = true, ...rest }: CardExpandProps) {
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(null);
  const transition = useTransition(rest, reduced);
  const card = CARDS.find((c) => c.id === selected);
  return (
    <LayoutGroup id="card-expand">
      <div className="relative h-72 w-full max-w-lg">
        <div className="grid grid-cols-3 gap-3">
          {CARDS.map((c) => (
            <motion.button
              key={c.id}
              type="button"
              layoutId={reduced ? undefined : `card-${c.id}`}
              onClick={() => setSelected(c.id)}
              transition={transition}
              className="flex h-28 flex-col justify-end rounded-lg border border-hairline bg-surface p-4 text-left hover:bg-surface-sunken"
              style={{ opacity: selected === c.id && !reduced ? 0 : 1 }}
            >
              <motion.span layoutId={reduced ? undefined : `title-${c.id}`} className="t-label text-ink">
                {c.title}
              </motion.span>
            </motion.button>
          ))}
        </div>
        <AnimatePresence>
          {card && (
            <>
              {backdrop && (
                <motion.div
                  key="backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: sec(DURATION.base), ease: motionEase("ease-out") }}
                  onClick={() => setSelected(null)}
                  className="absolute inset-0 rounded-lg"
                  style={{ background: "rgb(var(--ds-shadow-color) / 0.4)" }}
                />
              )}
              <motion.div
                key="dialog"
                role="dialog"
                aria-modal="true"
                aria-label={card.title}
                layoutId={reduced ? undefined : `card-${card.id}`}
                initial={reduced ? { opacity: 0 } : undefined}
                animate={reduced ? { opacity: 1 } : undefined}
                exit={reduced ? { opacity: 0 } : undefined}
                transition={transition}
                className="absolute inset-x-8 top-6 flex flex-col rounded-lg border border-hairline bg-surface p-6 shadow-3"
              >
                <div className="flex items-start justify-between">
                  <motion.h4 layoutId={reduced ? undefined : `title-${card.id}`} className="t-h3 text-ink">
                    {card.title}
                  </motion.h4>
                  <button type="button" aria-label="閉じる" onClick={() => setSelected(null)} className="-m-1 rounded-sm p-1 text-ink-muted hover:text-ink">
                    <X className="size-4" strokeWidth={1.75} aria-hidden />
                  </button>
                </div>
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: sec(DURATION.fast) }} className="t-body-sm mt-3 text-ink-secondary">
                  {card.body}
                </motion.p>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

/* ------------------------------------------------------------------ */
/* ListAddRemove                                                       */
/* ------------------------------------------------------------------ */

export interface ListAddRemoveProps {
  enter?: number; // ms
  exit?: number; // ms
  travel?: number; // px
  exitTravel?: boolean;
}

/** Enter 200ms ease-out from 8px below; exit 150ms ease-in, opacity only. Siblings close the gap with `layout`. */
export function ListAddRemove({ enter = DURATION.base, exit = DURATION.fast, travel = 8, exitTravel = false }: ListAddRemoveProps) {
  const reduced = useReducedMotion();
  const [items, setItems] = useState([1, 2, 3]);
  const [next, setNext] = useState(4);
  return (
    <div className="w-full max-w-sm">
      <div className="mb-3 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setItems((l) => [...l, next]);
            setNext((n) => n + 1);
          }}
        >
          <Plus strokeWidth={1.75} aria-hidden /> 追加
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((id) => (
            <motion.li
              key={id}
              layout={!reduced}
              initial={{ opacity: 0, y: reduced ? 0 : travel }}
              animate={{ opacity: 1, y: 0, transition: { duration: sec(enter), ease: motionEase("ease-out") } }}
              exit={{ opacity: 0, y: exitTravel && !reduced ? -travel / 2 : 0, transition: { duration: sec(exit), ease: motionEase("ease-in") } }}
              className="flex h-11 items-center justify-between rounded-md border border-hairline bg-surface px-3 text-sm text-ink"
            >
              項目 {id}
              <button type="button" aria-label={`項目 ${id} を削除`} onClick={() => setItems((l) => l.filter((x) => x !== id))} className="-mr-1 rounded-sm p-1 text-ink-muted hover:text-ink">
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StaggerGrid                                                         */
/* ------------------------------------------------------------------ */

export interface StaggerGridProps {
  count?: number;
  stagger?: number; // ms
  duration?: number; // ms
  travel?: number; // px
  once?: boolean;
  easing?: string;
}

/** Tiles fade up as the grid scrolls into view, 30ms apart. Replay remounts the grid. */
export function StaggerGrid({ count = 6, stagger = 30, duration = DURATION.base, travel = 8, once = true, easing = "ease-out" }: StaggerGridProps) {
  const reduced = useReducedMotion();
  const { key, replay } = useReplay();
  const last = (count - 1) * stagger;
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <motion.ul
        key={key}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.4 }}
        variants={{ show: { transition: { staggerChildren: reduced ? 0 : sec(stagger) } } }}
        className="grid w-full grid-cols-3 gap-3"
      >
        {Array.from({ length: count }, (_, i) => (
          <motion.li
            key={i}
            variants={{ hidden: { opacity: 0, y: reduced ? 0 : travel }, show: { opacity: 1, y: 0, transition: { duration: sec(duration), ease: motionEase(easing) } } }}
            className="flex h-16 items-center justify-center rounded-lg border border-hairline bg-surface text-sm text-ink"
          >
            {i + 1}
          </motion.li>
        ))}
      </motion.ul>
      <div className="flex items-center justify-between">
        <p className={cx("t-caption", last > 200 ? "text-warning" : "text-ink-muted")}>最後の開始 {last}ms{last > 200 ? "（200ms を超えている）" : ""}</p>
        <ReplayButton onClick={replay} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ThemeCrossfade                                                      */
/* ------------------------------------------------------------------ */

export interface ThemeCrossfadeProps {
  duration?: number; // ms
  mode?: "crossfade" | "colors" | "none";
  easing?: string;
}

/** Inline token values for one mode, taken from tokens.json so the pane is independent of the page theme. */
function themeVars(mode: "light" | "dark"): CSSProperties {
  const vars = Object.fromEntries(colorRoles.map((r) => [`--ds-${r}`, colorValue(mode, r)]));
  return { ...vars, colorScheme: mode } as CSSProperties;
}

function MiniUI() {
  return (
    <div className="flex h-full flex-col gap-3 p-5" style={{ background: "var(--ds-canvas)", color: "var(--ds-ink)" }}>
      <div className="rounded-lg border p-4" style={{ background: "var(--ds-surface)", borderColor: "var(--ds-hairline)" }}>
        <p className="t-label">週次レポート</p>
        <p className="t-caption mt-1" style={{ color: "var(--ds-ink-secondary)" }}>
          3 件の更新
        </p>
        <span className="t-caption mt-3 inline-block rounded-sm px-2 py-0.5" style={{ background: "var(--ds-accent-soft)", color: "var(--ds-accent)" }}>
          公開済み
        </span>
      </div>
      <span className="t-label inline-flex h-9 w-max items-center rounded-md px-4" style={{ background: "var(--ds-primary)", color: "var(--ds-on-primary)" }}>
        送信
      </span>
    </div>
  );
}

/**
 * Two fully painted panes are stacked; the incoming one fades in (opacity only,
 * compositor-friendly). "colors" transitions each color property instead, which
 * is how most sites do it and why text looks muddy mid-way.
 */
export function ThemeCrossfade({ duration = DURATION.base, mode = "crossfade", easing = "ease-out" }: ThemeCrossfadeProps) {
  const reduced = useReducedMotion();
  const [dark, setDark] = useState(false);
  const ms = reduced && mode !== "crossfade" ? 0 : duration;
  const ease = motionEase(easing);
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="relative h-56 overflow-hidden rounded-lg border border-hairline">
        {mode === "crossfade" ? (
          <>
            <div className="absolute inset-0" style={themeVars(dark ? "light" : "dark")}>
              <MiniUI />
            </div>
            <motion.div key={dark ? "dark" : "light"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: sec(ms), ease }} className="absolute inset-0" style={themeVars(dark ? "dark" : "light")}>
              <MiniUI />
            </motion.div>
          </>
        ) : (
          <div className="theme-colors-scope absolute inset-0" style={themeVars(dark ? "dark" : "light")}>
            {mode === "colors" && (
              <style>{`.theme-colors-scope, .theme-colors-scope * { transition: background-color ${ms}ms ${cssEase(easing)}, color ${ms}ms ${cssEase(easing)}, border-color ${ms}ms ${cssEase(easing)}; }`}</style>
            )}
            <MiniUI />
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="t-caption text-ink-muted">{mode === "crossfade" ? "2 枚重ねて opacity だけ" : mode === "colors" ? "各色を transition" : "切り替えのみ"}</p>
        <Button size="sm" variant="secondary" onClick={() => setDark((d) => !d)} aria-pressed={dark}>
          {dark ? <Sun strokeWidth={1.75} aria-hidden /> : <Moon strokeWidth={1.75} aria-hidden />}
          {dark ? "ライトへ" : "ダークへ"}
        </Button>
      </div>
    </div>
  );
}
