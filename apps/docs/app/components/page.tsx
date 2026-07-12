import Link from "next/link";
import {
  Accordion, Badge, Button, Callout, Card, Checkbox, EmptyState, ErrorState, Input, Progress, Spinner, Stack, Tabs, Toast,
} from "@awesome-ds/react";
import { componentCatalog } from "../../lib/components-catalog";
import { formatMessage, getDictionary, localizePathname } from "../../lib/i18n";
import { getRequestLocale } from "../../lib/i18n-server";

export const metadata = { title: "Components" };

const families = ["primitives", "forms", "overlay", "navigation", "status", "layout"] as const;

export default async function ComponentsPage() {
  const locale = await getRequestLocale();
  const d = getDictionary(locale).components;
  return (
    <div className="ads-motion-enter">
      <h1>{d.title}</h1>
      <p className="muted">
        {formatMessage(d.intro, { count: componentCatalog.length })}
      </p>
      {families.map((family) => {
        const items = componentCatalog.filter((c) => c.family === family);
        if (!items.length) return null;
        return (
          <section key={family}>
            <h2>{family}</h2>
            <div className="grid-cards">
              {items.map((item) => (
                <Link key={item.slug} className="card-link" href={localizePathname("/components/" + item.slug, locale)}>
                  <strong>{item.name}</strong>
                  <p className="meta">{item.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      <h2>{d.gallery}</h2>
      <Stack gap={6}>
        <Card title="Actions">
          <div className="ads-cluster">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button loading>Loading</Button>
            <Badge tone="accent">Baseline</Badge>
          </div>
        </Card>
        <Card title="Forms">
          <Input id="name" label="Name" hint="Used on invoices" />
          <Checkbox id="terms" label="I agree to the terms" />
        </Card>
        <Card title="Status">
          <div className="ads-cluster">
            <Spinner />
            <Progress value={64} label="Upload" />
            <Toast>Saved just now</Toast>
          </div>
          <Callout title="Evidence">Implements rule.a11y.wcag-aa and rule.components.state-matrix.</Callout>
        </Card>
        <Tabs items={[
          { value: "preview", label: "Preview", content: <EmptyState title="Nothing selected" description="Choose a row to inspect." actionLabel="Browse" /> },
          { value: "error", label: "Error", content: <ErrorState title="Could not load" description="Network failed." actionLabel="Retry" /> },
        ]} />
        <Accordion items={[{ id: "a1", title: "Catalog size", content: <p>{componentCatalog.length} components registered.</p> }]} />
      </Stack>
    </div>
  );
}
