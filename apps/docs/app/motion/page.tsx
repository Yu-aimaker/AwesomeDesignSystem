import { motionRecipes } from "@awesome-ds/motion";
import { getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

export const metadata = { title: "Motion" };

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
          {motionRecipes.map((recipe) => (
            <tr key={recipe.id}>
              <td><a href={localizePathname("/motion/" + recipe.intent, locale)}>{recipe.intent}</a></td>
              <td>{recipe.purpose}</td>
              <td>{recipe.reducedMotionAlternative}</td>
              <td className="meta">{recipe.ruleIds.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={"ads-motion-enter ads-card"} style={{ marginTop: "var(--space-6)" }}>
        <strong>{d.demo}</strong>
        <p className="meta">{d.demoDescription}</p>
      </div>
    </div>
  );
}
