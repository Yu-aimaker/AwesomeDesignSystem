import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/foundations", (dictionary) => dictionary.nav.Foundations);
export default function Page() { return <CanonDomainPage domainKey="foundations" />; }
