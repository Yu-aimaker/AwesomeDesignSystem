import { PlaygroundControls } from "../../components/playground/playground-controls";
import { getDictionary } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";
import { createLocalizedMetadata } from "../../lib/metadata";
import { PageHeader } from "../../components/page-header";

export const generateMetadata = () => createLocalizedMetadata("/playground", (dictionary) => dictionary.playground.title, (dictionary) => dictionary.playground.intro);

export default async function PlaygroundPage() {
  const locale = await getRequestLocale();
  const labels = getDictionary(locale).playground;
  return <div className="ads-motion-enter route-page"><PageHeader eyebrow={locale === "ja" ? "許可された操作だけを実行" : "Allowlisted controls only"} title={labels.title} description={labels.intro} meta={<code>semantic tokens · deterministic output</code>} /><PlaygroundControls labels={labels} locale={locale} /></div>;
}
