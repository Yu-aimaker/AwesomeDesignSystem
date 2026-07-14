import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/interaction", (dictionary) => dictionary.nav.Interaction);
export default function Page() { return <CanonDomainPage domainKey="interaction" />; }
