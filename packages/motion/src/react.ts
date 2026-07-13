"use client";

import { motionRecipes, getMotionPreference, type MotionRecipe } from "./recipes";
import { useSyncExternalStore } from "react";

export type MotionStyleProps = {
  recipeId: string;
  className?: string;
};

type MatchMedia = (query: string) => Pick<MediaQueryList, "matches" | "addEventListener" | "removeEventListener">;
const query = "(prefers-reduced-motion: reduce)";

function browserMatchMedia(): MatchMedia | undefined {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    ? window.matchMedia.bind(window)
    : undefined;
}

export function getReducedMotionSnapshot(matchMedia: MatchMedia | undefined = browserMatchMedia()): "reduce" | "no-preference" {
  return getMotionPreference(matchMedia?.(query));
}

export function subscribeReducedMotion(listener: () => void, matchMedia: MatchMedia | undefined = browserMatchMedia()): () => void {
  if (!matchMedia) return () => undefined;
  const media = matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

/** Resolve a recipe to className + data attributes for React consumers. */
export function useMotionRecipe(recipeId: string): {
  recipe: MotionRecipe | undefined;
  className: string;
  preference: "reduce" | "no-preference";
  "data-motion-intent"?: MotionRecipe["intent"];
} {
  const recipe = motionRecipes.find((r) => r.id === recipeId);
  const preference = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    (): "no-preference" => "no-preference",
  );

  return {
    recipe,
    className: recipe?.cssClass ?? "",
    preference,
    ...(recipe ? { "data-motion-intent": recipe.intent } : {}),
  };
}

export { motionRecipes, getMotionPreference };
