import { motionRecipes } from "@awesome-ds/motion";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return motionRecipes.map((r) => ({ slug: r.intent }));
}

export default async function MotionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = motionRecipes.find((r) => r.intent === slug);
  if (!recipe) notFound();
  return (
    <article>
      <h1>{recipe.intent}</h1>
      <p>{recipe.purpose}</p>
      <ul>
        <li>CSS class: <code>{recipe.cssClass}</code></li>
        <li>Allowed: {recipe.allowedContexts.join(", ")}</li>
        <li>Prohibited: {recipe.prohibited.join(", ")}</li>
        <li>Performance: {recipe.performanceNotes}</li>
      </ul>
    </article>
  );
}
