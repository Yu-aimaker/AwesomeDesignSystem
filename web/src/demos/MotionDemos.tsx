import { useState } from "react";
import { AnimatePresence, motion, Reorder } from "motion/react";
import { GripVertical, Plus, X } from "lucide-react";
import { tokens } from "../lib/tokens";
import { Button } from "../ds/components/Button";

const easeOut = tokens.easing.out.$value as [number, number, number, number];
const easeIn = tokens.easing.in.$value as [number, number, number, number];
const base = parseInt(tokens.duration.base.$value, 10) / 1000;
const fast = parseInt(tokens.duration.fast.$value, 10) / 1000;
const snappy = tokens.spring.snappy.$value;

/** Drag to reorder. `layout` animates the other items into place with a spring. */
export function ReorderDemo() {
  const [items, setItems] = useState(["設計レビュー", "トークン更新", "リリースノート", "QA チェック"]);
  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex w-full max-w-sm flex-col gap-2">
      {items.map((item) => (
        <Reorder.Item
          key={item}
          value={item}
          transition={{ type: "spring", stiffness: snappy.stiffness, damping: snappy.damping }}
          whileDrag={{ scale: 1.02, boxShadow: "var(--ds-shadow-2)" }}
          className="flex h-11 cursor-grab items-center gap-3 rounded-md border border-hairline bg-surface px-3 text-sm text-ink select-none active:cursor-grabbing"
        >
          <GripVertical className="size-4 text-ink-muted" strokeWidth={1.75} aria-hidden />
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

/** Enter 200ms ease-out from 8px below; exit 150ms ease-in, opacity only. */
export function PresenceDemo() {
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
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { duration: base, ease: easeOut } }}
              exit={{ opacity: 0, transition: { duration: fast, ease: easeIn } }}
              className="flex h-11 items-center justify-between rounded-md border border-hairline bg-surface px-3 text-sm text-ink"
            >
              項目 {id}
              <button
                type="button"
                aria-label={`項目 ${id} を削除`}
                onClick={() => setItems((l) => l.filter((x) => x !== id))}
                className="-mr-1 rounded-sm p-1 text-ink-muted hover:text-ink"
              >
                <X className="size-4" strokeWidth={1.75} aria-hidden />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

/** Children fade in 8px as they scroll into view, 60ms apart, once. */
export function InViewStaggerDemo() {
  return (
    <motion.ul
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
      className="grid w-full gap-3 sm:grid-cols-3"
    >
      {["読み込み", "空の状態", "エラー"].map((label) => (
        <motion.li
          key={label}
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: base, ease: easeOut } } }}
          className="rounded-lg border border-hairline bg-surface p-4 text-sm text-ink"
        >
          {label}
        </motion.li>
      ))}
    </motion.ul>
  );
}

/** Drag anywhere inside the box; release and it springs back (stiffness 400, damping 30). */
export function SpringDragDemo() {
  return (
    <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-hairline-strong">
      <motion.div
        drag
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: snappy.stiffness, bounceDamping: snappy.damping }}
        whileDrag={{ scale: 1.04 }}
        className="flex size-16 cursor-grab items-center justify-center rounded-lg bg-primary text-xs text-on-primary select-none active:cursor-grabbing"
      >
        drag
      </motion.div>
    </div>
  );
}
