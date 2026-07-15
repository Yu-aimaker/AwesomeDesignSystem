import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () =>
  createLocalizedMetadata(
    "/principles",
    (dictionary) => dictionary.nav.Principles,
    (dictionary) =>
      dictionary.localeName === "日本語"
        ? "流行や模倣ではなく、根拠と検証から判断するデザイン原則。"
        : "Evidence-backed design principles for decisions beyond trends and imitation.",
  );
export default function Page() {
  return <CanonDomainPage domainKey="principles" />;
}
