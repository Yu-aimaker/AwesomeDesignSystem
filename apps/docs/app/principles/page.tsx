import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/principles", (dictionary) => dictionary.nav.Principles);
export default function Page() { return <CanonDomainPage domainKey="principles" />; }
