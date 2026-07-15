import { motionRecipes } from "@awesome-ds/motion";
import { notFound } from "next/navigation";
import { MotionDemo } from "../../../components/motion-demo";
import { PageHeader } from "../../../components/page-header";
import { getHomeContent } from "../../../lib/home-content";
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
  const d = getDictionary(locale).motionDetail;
  const home = getHomeContent(locale).motion;
  return (
    <article className="ads-motion-enter route-page motion-detail">
      <PageHeader
        eyebrow={`${sourceRecipe.id} · ${sourceRecipe.durationToken}`}
        title={recipe.intentLabel}
        description={recipe.purpose}
        meta={<code>{recipe.cssClass}</code>}
      />
      <section className="motion-detail__demo" aria-labelledby="motion-demo-title">
        <h2 id="motion-demo-title">{locale === "ja" ? "ライブ表示" : "Live demonstration"}</h2>
        <MotionDemo
          items={[{ intent: recipe.intent, label: recipe.intentLabel, description: `${recipe.cssClass} · ${sourceRecipe.durationToken}` }]}
          replayLabel={home.replay}
          replayedLabel={home.replayed}
        />
      </section>
      <section className="motion-contract" aria-label={locale === "ja" ? "モーション契約" : "Motion contract"}>
        <div><h2>{d.allowed}</h2><ul>{recipe.allowedContexts.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h2>{d.prohibited}</h2><ul>{recipe.prohibited.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><h2>{d.performance}</h2><p>{recipe.performanceNotes}</p></div>
        <div><h2>{locale === "ja" ? "動きを減らす場合" : "Reduced motion"}</h2><p>{recipe.reducedMotionAlternative}</p></div>
      </section>
    </article>
  );
}
