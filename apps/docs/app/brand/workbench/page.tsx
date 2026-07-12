import { BrandWorkbench } from "../../../components/brand-workbench";
import { getDictionary } from "../../../lib/i18n";
import { getRequestLocale } from "../../../lib/i18n-server";

export const metadata = { title: "Brand Workbench" };

export default async function BrandWorkbenchPage() {
  const d = getDictionary(await getRequestLocale()).workbench;
  return (
    <div className="ads-motion-enter">
      <p className="eyebrow">{d.eyebrow}</p>
      <h1>{d.title}</h1>
      <p className="hero-lede">{d.intro}</p>
      <BrandWorkbench />
    </div>
  );
}
