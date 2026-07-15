import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () =>
  createLocalizedMetadata(
    "/review",
    (dictionary) => dictionary.nav.Review,
    (dictionary) =>
      dictionary.localeName === "日本語"
        ? "アクセシビリティ、品質、根拠、実装状態を出荷前に検証するレビュー体系。"
        : "A release review system for accessibility, craft, evidence, and implementation state.",
  );
export default function Page() {
  return <CanonDomainPage domainKey="review" />;
}
