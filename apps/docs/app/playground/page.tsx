import { PlaygroundControls } from "../../components/playground/playground-controls";
import { getDictionary } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

export default async function PlaygroundPage() {
  return <PlaygroundControls labels={getDictionary(await getRequestLocale()).playground} />;
}
