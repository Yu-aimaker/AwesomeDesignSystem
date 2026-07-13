import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/ai-design", (dictionary) => dictionary.nav["AI Design"]);
export default function Page() { return <CanonDomainPage domainKey="ai-design" />; }
