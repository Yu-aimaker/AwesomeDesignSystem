import { BrandWorkbench } from "../../../components/brand-workbench";
import { getDictionary } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";

import { createLocalizedMetadata } from "../../../lib/metadata";
import { PageHeader } from "../../../components/page-header";
export const generateMetadata = () => createLocalizedMetadata("/brand/workbench", (dictionary) => dictionary.workbench.title, (dictionary) => dictionary.workbench.intro);

export default async function BrandWorkbenchPage() {
  const locale = await getRequestLocale();
  const d = getDictionary(locale).workbench;
  return (
    <div className="ads-motion-enter route-page">
      <PageHeader eyebrow={d.eyebrow} title={d.title} description={d.intro} meta={<code>@awesome-ds/brand · ProductLexicon</code>} />
      <BrandWorkbench locale={locale} labels={d} />
    </div>
  );
}
