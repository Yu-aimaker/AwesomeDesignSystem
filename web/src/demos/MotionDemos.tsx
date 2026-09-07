import { motion } from "motion/react";
import { useReducedMotion } from "../lib/theme";
import { SPRING } from "./shared";
import { ListAddRemove, ReorderList, StaggerGrid } from "./layout";

/*
 * Compatibility exports for pages that predate the demo registry. The full,
 * controllable versions live in ./layout.tsx and ./registry.tsx.
 */

/** Drag to reorder. `layout` animates the other items into place with a spring. */
export function ReorderDemo() {
  return <ReorderList />;
}

/** Enter 200ms ease-out from 8px below; exit 150ms ease-in, opacity only. */
export function PresenceDemo() {
  return <ListAddRemove />;
}

/** Children fade in 8px as they scroll into view, 30ms apart, once. */
export function InViewStaggerDemo() {
  return <StaggerGrid count={3} />;
}

export interface SpringDragProps {
  stiffness?: number;
  damping?: number;
  dragScale?: number;
}

/** Drag anywhere inside the box; release and it springs back (stiffness 400, damping 30). */
export function SpringDragDemo({ stiffness = SPRING.snappy.stiffness, damping = SPRING.snappy.damping, dragScale = 1.04 }: SpringDragProps) {
  const reduced = useReducedMotion();
  return (
    <div className="flex h-48 w-full items-center justify-center rounded-lg border border-dashed border-hairline-strong">
      <motion.div
        drag
        dragSnapToOrigin
        dragTransition={{ bounceStiffness: stiffness, bounceDamping: damping }}
        whileDrag={reduced ? undefined : { scale: dragScale }}
        className="flex size-16 cursor-grab items-center justify-center rounded-lg bg-primary text-xs text-on-primary select-none active:cursor-grabbing"
      >
        drag
      </motion.div>
    </div>
  );
}
