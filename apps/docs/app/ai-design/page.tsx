import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () =>
  createLocalizedMetadata(
    "/ai-design",
    (dictionary) => dictionary.nav["AI Design"],
    (dictionary) =>
      dictionary.localeName === "日本語"
        ? "AIエージェントが安全に高品質UIを作るための、有限で追跡可能な設計契約。"
        : "Bounded, traceable contracts for agents building safe, high-quality interfaces.",
  );
export default function Page() {
  return <CanonDomainPage domainKey="ai-design" />;
}
