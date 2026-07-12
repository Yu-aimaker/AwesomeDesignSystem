import { motionRecipes } from "@awesome-ds/motion";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";

export function generateStaticParams() {
  return motionRecipes.map((r) => ({ slug: r.intent }));
}

export default async function MotionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = motionRecipes.find((r) => r.intent === slug);
  if (!recipe) notFound();
  const locale = await getRequestLocale();
  const dictionary = getDictionary(locale);
  const d = dictionary.motionDetail;
  return (
    <article>
      <h1>{recipe.intent}</h1>
      {locale === "ja" ? <p className="translation-notice">{dictionary.canon.fallbackNotice}</p> : null}
      <p lang="en">{recipe.purpose}</p>
      <ul lang="en">
        <li><span lang={locale}>{d.cssClass}</span>: <code>{recipe.cssClass}</code></li>
        <li><span lang={locale}>{d.allowed}</span>: {recipe.allowedContexts.join(", ")}</li>
        <li><span lang={locale}>{d.prohibited}</span>: {recipe.prohibited.join(", ")}</li>
        <li><span lang={locale}>{d.performance}</span>: {recipe.performanceNotes}</li>
      </ul>
    </article>
  );
}
