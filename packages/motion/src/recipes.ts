import { motionTokens } from "@awesome-ds/tokens";

export type MotionIntent =
  | "enter"
  | "exit"
  | "reveal"
  | "expand"
  | "shared-layout"
  | "list-change"
  | "feedback"
  | "drag"
  | "scroll"
  | "page-transition";

export type MotionRecipe = {
  id: string;
  intent: MotionIntent;
  purpose: string;
  allowedContexts: string[];
  prohibited: string[];
  cssClass: string;
  reducedMotionAlternative: string;
  ruleIds: string[];
  durationToken: keyof typeof motionTokens;
  performanceNotes: string;
};

export const motionRecipes: MotionRecipe[] = [
  {
    id: "recipe.enter.fade-up",
    intent: "enter",
    purpose: "Introduce new content without layout thrash",
    allowedContexts: ["modals", "toasts", "page sections"],
    prohibited: ["continuous looping attention grabbers"],
    cssClass: "ads-motion-enter",
    reducedMotionAlternative: "Instant opacity change only",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-base",
    performanceNotes: "Use transform + opacity only",
  },
  {
    id: "recipe.exit.fade",
    intent: "exit",
    purpose: "Signal removal of content",
    allowedContexts: ["dialogs", "toasts", "menus"],
    prohibited: ["long exit delays blocking next action"],
    cssClass: "ads-motion-exit",
    reducedMotionAlternative: "Immediate unmount",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-fast",
    performanceNotes: "Keep under 200ms default",
  },
  {
    id: "recipe.reveal.scroll",
    intent: "reveal",
    purpose: "Progressively reveal content as users scroll",
    allowedContexts: ["marketing sections", "docs chapters"],
    prohibited: ["critical form fields"],
    cssClass: "ads-motion-reveal",
    reducedMotionAlternative: "Static full opacity",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-slow",
    performanceNotes: "Prefer CSS scroll-driven when available",
  },
  {
    id: "recipe.expand.collapse",
    intent: "expand",
    purpose: "Communicate expand/collapse hierarchy",
    allowedContexts: ["accordion", "disclosure", "nav trees"],
    prohibited: ["full-page layout shifts without reserved space"],
    cssClass: "ads-motion-expand",
    reducedMotionAlternative: "Height jumps instantly",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-base",
    performanceNotes: "Animate grid-template-rows or max-height carefully",
  },
  {
    id: "recipe.feedback.press",
    intent: "feedback",
    purpose: "Acknowledge user input",
    allowedContexts: ["buttons", "toggles", "drag handles"],
    prohibited: ["decorative bounce on every hover"],
    cssClass: "ads-motion-feedback",
    reducedMotionAlternative: "Color/border change only",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-fast",
    performanceNotes: "Interruptible; cancel on pointer leave",
  },
  {
    id: "recipe.page.view-transition",
    intent: "page-transition",
    purpose: "Preserve spatial continuity across routes",
    allowedContexts: ["docs navigation", "product multi-step flows"],
    prohibited: ["full-screen flashy transitions that block reading"],
    cssClass: "ads-motion-page",
    reducedMotionAlternative: "Hard cut between pages",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-base",
    performanceNotes: "Use View Transitions API when supported",
  },
  {
    id: "recipe.list.reorder",
    intent: "list-change",
    purpose: "Show list insert/remove/reorder",
    allowedContexts: ["tables", "kanban", "notification feeds"],
    prohibited: ["animating every keystroke in filters"],
    cssClass: "ads-motion-list",
    reducedMotionAlternative: "Instant reflow",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-base",
    performanceNotes: "Limit concurrent FLIP animations",
  },
  {
    id: "recipe.drag.lift",
    intent: "drag",
    purpose: "Show grabbed object and drop target",
    allowedContexts: ["sortable lists", "canvas objects"],
    prohibited: ["auto-dragging without pointer capture"],
    cssClass: "ads-motion-drag",
    reducedMotionAlternative: "Static lift styling without spring",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-fast",
    performanceNotes: "Must be interruptible by pointer",
  },
  {
    id: "recipe.scroll.progress",
    intent: "scroll",
    purpose: "Map scroll position to subtle progress cues",
    allowedContexts: ["reading progress", "parallax accents"],
    prohibited: ["scroll-jacking"],
    cssClass: "ads-motion-scroll",
    reducedMotionAlternative: "Static indicators",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-fast",
    performanceNotes: "Use compositor-friendly properties",
  },
  {
    id: "recipe.shared.layout",
    intent: "shared-layout",
    purpose: "Morph shared elements across states",
    allowedContexts: ["card→detail", "thumbnail→lightbox"],
    prohibited: ["unrelated elements sharing layout ids"],
    cssClass: "ads-motion-shared",
    reducedMotionAlternative: "Cross-fade only",
    ruleIds: ["rule.motion.purpose-first"],
    durationToken: "dur-base",
    performanceNotes: "One shared element at a time preferred",
  },
];

export function getRecipe(id: string): MotionRecipe | undefined {
  return motionRecipes.find((r) => r.id === id);
}

export function getMotionPreference(
  media:
    | Pick<MediaQueryList, "matches">
    | { matches: boolean }
    | null
    | undefined,
): "reduce" | "no-preference" {
  if (!media) return "no-preference";
  return media.matches ? "reduce" : "no-preference";
}
