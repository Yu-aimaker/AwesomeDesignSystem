import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/patterns", (dictionary) => dictionary.nav.Patterns);
export default function Page() { return <CanonDomainPage domainKey="patterns" />; }
