import { CanonDomainPage } from "../../components/canon-domain-page";
import { createLocalizedMetadata } from "../../lib/metadata";
export const generateMetadata = () => createLocalizedMetadata("/review", (dictionary) => dictionary.nav.Review);
export default function Page() { return <CanonDomainPage domainKey="review" />; }
