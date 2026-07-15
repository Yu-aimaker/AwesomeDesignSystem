import Link from "next/link";
import { motionRecipes } from "@awesome-ds/motion";
import { MotionDemo } from "../../components/motion-demo";
import { PageHeader } from "../../components/page-header";
import { getHomeContent } from "../../lib/home-content";
import { getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";
import { localizeMotionRecipe } from "../../lib/motion-localization";
import { createLocalizedMetadata } from "../../lib/metadata";

export const generateMetadata = () => createLocalizedMetadata("/motion", (dictionary) => dictionary.motion.title, (dictionary) => dictionary.motion.intro);

export default async function MotionPage() {
  const locale = await getRequestLocale();
  const d = getDictionary(locale).motion;
  const home = getHomeContent(locale).motion;
  return (
    <div className="ads-motion-enter route-page">
      <PageHeader
        eyebrow={locale === "ja" ? "目的別・CSS優先・動きを減らす設定に対応" : "Intent-led · CSS-first · reduced-motion ready"}
        title={d.title}
        description={d.intro}
        meta={<code>{motionRecipes.length} recipes · rule.motion.purpose-first</code>}
      />
      <section className="motion-overview" aria-labelledby="motion-live-title">
        <header className="split-heading"><div><p className="eyebrow">LIVE</p><h2 id="motion-live-title">{home.title}</h2></div><p>{home.description}</p></header>
        <MotionDemo items={home.demos} replayLabel={home.replay} replayedLabel={home.replayed} />
      </section>
      <section className="recipe-index" aria-label={d.title}>
        <div className="recipe-index__heading"><p className="eyebrow">RECIPES</p><h2>{locale === "ja" ? "意図からレシピを選ぶ" : "Choose by intent"}</h2></div>
        <div className="recipe-list">
          {motionRecipes.map((sourceRecipe, index) => {
            const recipe = localizeMotionRecipe(sourceRecipe, locale);
            return (
              <Link className="recipe-row" href={localizePathname("/motion/" + recipe.intent, locale)} key={recipe.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{recipe.intentLabel}</strong><p>{recipe.purpose}</p></div>
                <code>{recipe.cssClass}</code>
                <small>{recipe.reducedMotionAlternative}</small>
                <span aria-hidden="true">↗</span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
