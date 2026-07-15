import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () =>
  createLocalizedMetadata(
    "/foundations",
    (dictionary) => dictionary.nav.Foundations,
    (dictionary) =>
      dictionary.localeName === "日本語"
        ? "カラー、文字、余白、トークンを実装可能な契約として扱う基礎体系。"
        : "Color, typography, spacing, and tokens expressed as executable contracts.",
  );
export default function Page() {
  return <CanonDomainPage domainKey="foundations" />;
}
