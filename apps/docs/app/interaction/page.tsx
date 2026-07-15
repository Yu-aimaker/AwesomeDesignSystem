import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () =>
  createLocalizedMetadata(
    "/interaction",
    (dictionary) => dictionary.nav.Interaction,
    (dictionary) =>
      dictionary.localeName === "日本語"
        ? "状態、回復、ユーザー主導権を含む、検証可能なインタラクション契約。"
        : "Verifiable interaction contracts for state, recovery, and user agency.",
  );
export default function Page() {
  return <CanonDomainPage domainKey="interaction" />;
}
