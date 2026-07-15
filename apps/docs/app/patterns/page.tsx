import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () =>
  createLocalizedMetadata(
    "/patterns",
    (dictionary) => dictionary.nav.Patterns,
    (dictionary) =>
      dictionary.localeName === "日本語"
        ? "プロダクト文脈へ適応できる、根拠と失敗条件を備えたUIパターン。"
        : "UI patterns with evidence, failure conditions, and room for product context.",
  );
export default function Page() {
  return <CanonDomainPage domainKey="patterns" />;
}
