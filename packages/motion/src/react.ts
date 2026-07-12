"use client";

import { motionRecipes, getMotionPreference, type MotionRecipe } from "./recipes";

export type MotionStyleProps = {
  recipeId: string;
  className?: string;
};

/** Resolve a recipe to className + data attributes for React consumers. */
export function useMotionRecipe(recipeId: string): {
  recipe: MotionRecipe | undefined;
  className: string;
  preference: "reduce" | "no-preference";
  "data-motion-intent"?: MotionRecipe["intent"];
} {
  const recipe = motionRecipes.find((r) => r.id === recipeId);
  const preference =
    typeof window !== "undefined"
      ? getMotionPreference(window.matchMedia("(prefers-reduced-motion: reduce)"))
      : "no-preference";

  return {
    recipe,
    className: recipe?.cssClass ?? "",
    preference,
    ...(recipe ? { "data-motion-intent": recipe.intent } : {}),
  };
}

export { motionRecipes, getMotionPreference };
