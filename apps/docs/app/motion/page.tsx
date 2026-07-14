import { motionRecipes } from "@awesome-ds/motion";
import { getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

import { createLocalizedMetadata } from "../../lib/metadata";
import { localizeMotionRecipe } from "../../lib/motion-localization";
export const generateMetadata = () => createLocalizedMetadata("/motion", (dictionary) => dictionary.motion.title, (dictionary) => dictionary.motion.intro);

export default async function MotionPage() {
  const locale = await getRequestLocale();
  const d = getDictionary(locale).motion;
  return (
    <div>
      <h1>{d.title}</h1>
      <p className="muted">{d.intro}</p>
      <table className="table">
        <thead><tr><th>{d.intent}</th><th>{d.purpose}</th><th>{d.reduced}</th><th>{d.rules}</th></tr></thead>
        <tbody>
          {motionRecipes.map((sourceRecipe) => {
            const recipe = localizeMotionRecipe(sourceRecipe, locale);
            return (
            <tr key={recipe.id}>
              <td><a href={localizePathname("/motion/" + recipe.intent, locale)}>{recipe.intentLabel}</a></td>
              <td>{recipe.purpose}</td>
              <td>{recipe.reducedMotionAlternative}</td>
              <td className="meta">{recipe.ruleIds.join(", ")}</td>
            </tr>
            );
          })}
        </tbody>
      </table>
      <div className={"ads-motion-enter ads-card"} style={{ marginTop: "var(--space-6)" }}>
        <strong>{d.demo}</strong>
        <p className="meta">{d.demoDescription}</p>
      </div>
    </div>
  );
}
