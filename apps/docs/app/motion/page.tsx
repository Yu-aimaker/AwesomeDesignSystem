import { motionRecipes } from "@awesome-ds/motion";

export const metadata = { title: "Motion" };

export default function MotionPage() {
  return (
    <div>
      <h1>Motion recipes</h1>
      <p className="muted">Intent-based, CSS-first recipes with reduced-motion alternatives.</p>
      <table className="table">
        <thead><tr><th>Intent</th><th>Purpose</th><th>Reduced motion</th><th>Rules</th></tr></thead>
        <tbody>
          {motionRecipes.map((recipe) => (
            <tr key={recipe.id}>
              <td><a href={"/motion/" + recipe.intent}>{recipe.intent}</a></td>
              <td>{recipe.purpose}</td>
              <td>{recipe.reducedMotionAlternative}</td>
              <td className="meta">{recipe.ruleIds.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={"ads-motion-enter ads-card"} style={{ marginTop: "var(--space-6)" }}>
        <strong>Live enter recipe</strong>
        <p className="meta">This card uses <code>ads-motion-enter</code>.</p>
      </div>
    </div>
  );
}
