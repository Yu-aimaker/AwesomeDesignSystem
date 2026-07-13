import { BrandWorkbench } from "../../../components/brand-workbench";
import { getDictionary } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";

import { createLocalizedMetadata } from "../../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/brand/workbench", (dictionary) => dictionary.workbench.title, (dictionary) => dictionary.workbench.intro);

export default async function BrandWorkbenchPage() {
  const locale = await getRequestLocale();
  const d = getDictionary(locale).workbench;
  return (
    <div className="ads-motion-enter">
      <p className="eyebrow">{d.eyebrow}</p>
      <h1>{d.title}</h1>
      <p className="hero-lede">{d.intro}</p>
      <BrandWorkbench locale={locale} labels={d} />
    </div>
  );
}
