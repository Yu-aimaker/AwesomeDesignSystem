import { PlaygroundControls } from "../../components/playground/playground-controls";
import { getDictionary } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";
import { createLocalizedMetadata } from "../../lib/metadata";

export const generateMetadata = () => createLocalizedMetadata("/playground", (dictionary) => dictionary.playground.title, (dictionary) => dictionary.playground.intro);

export default async function PlaygroundPage() {
  return <PlaygroundControls labels={getDictionary(await getRequestLocale()).playground} />;
}
