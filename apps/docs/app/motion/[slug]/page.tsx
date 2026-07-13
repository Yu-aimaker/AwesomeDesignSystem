import { motionRecipes } from "@awesome-ds/motion";
import { notFound } from "next/navigation";
import { getDictionary } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";
import { createLocalizedMetadata } from "../../../lib/metadata";
import { localizeMotionRecipe } from "../../../lib/motion-localization";

export function generateStaticParams() {
  return motionRecipes.map((r) => ({ slug: r.intent }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = motionRecipes.find((item) => item.intent === slug);
  const locale = await getRequestLocale();
  const localizedRecipe = recipe ? localizeMotionRecipe(recipe, locale) : undefined;
  return createLocalizedMetadata(`/motion/${slug}`, localizedRecipe?.intentLabel ?? "Motion", localizedRecipe?.purpose);
}

export default async function MotionDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sourceRecipe = motionRecipes.find((r) => r.intent === slug);
  if (!sourceRecipe) notFound();
  const locale = await getRequestLocale();
  const recipe = localizeMotionRecipe(sourceRecipe, locale);
  const dictionary = getDictionary(locale);
  const d = dictionary.motionDetail;
  return (
    <article>
      <h1>{recipe.intentLabel}</h1>
      <p>{recipe.purpose}</p>
      <ul>
        <li>{d.cssClass}: <code>{recipe.cssClass}</code></li>
        <li>{d.allowed}: {recipe.allowedContexts.join(locale === "ja" ? "、" : ", ")}</li>
        <li>{d.prohibited}: {recipe.prohibited.join(locale === "ja" ? "、" : ", ")}</li>
        <li>{d.performance}: {recipe.performanceNotes}</li>
      </ul>
    </article>
  );
}
